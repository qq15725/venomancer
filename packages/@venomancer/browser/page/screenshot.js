'use strict'

const debug = require('debug')('venomancer:page-screenshot')

const puppeteer = require('puppeteer-core')

async function pageSetContent (page, content) {
  const { LifecycleWatcher } = require('puppeteer-core/lib/LifecycleWatcher')

  await page.evaluate(html => {
    document.open()
    document.write(html)
    document.close()
  }, content)

  const watcher = new LifecycleWatcher(
    page._frameManager,
    page._frameManager.mainFrame(),
    ['load'],
    page._frameManager._timeoutSettings.navigationTimeout()
  )

  const error = await Promise.race([
    watcher.timeoutOrTerminationPromise(),
    watcher.lifecyclePromise(),
  ])

  watcher.dispose()

  if (error)
    throw error
}

async function pageWaitForNetworkIdle (page, timeout, maxInflightRequests = 0) {
  let inflight = 0
  let fulfill
  let promise = new Promise(x => fulfill = x)
  const onRequestStarted = () => {
    ++inflight
    if (inflight > maxInflightRequests) {
      clearTimeout(timeoutId)
    }
  }
  const onTimeoutDone = () => {
    page.removeListener('request', onRequestStarted)
    page.removeListener('requestfinished', onRequestFinished)
    page.removeListener('requestfailed', onRequestFinished)
    fulfill()
  }
  let timeoutId = setTimeout(onTimeoutDone, timeout)
  const onRequestFinished = () => {
    if (inflight === 0) return
    --inflight
    if (inflight === maxInflightRequests) {
      timeoutId = setTimeout(onTimeoutDone, timeout)
    }
  }
  page.on('request', onRequestStarted)
  page.on('requestfinished', onRequestFinished)
  page.on('requestfailed', onRequestFinished)
  return promise
}

async function pageScroll (page, distance, interval) {
  return await page.evaluate(async params => {
    const {
      distance,
      interval
    } = params
    await new Promise(resolve => {
      let scrollHeight = Math.min(document.body.scrollHeight, 5000)
      let totalHeight = scrollHeight - document.body.offsetHeight
      let timer = setInterval(() => {
        window.scrollBy(0, distance)
        totalHeight += distance
        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, interval)
    })
  }, {
    distance,
    interval
  })
}

async function pageScreenshot (page, options) {
  const {
    content,
    viewport,
    device,
    scroll,
    scrollDistance,
    scrollInterval,
    $,
    ...screenshotOptions
  } = options || {}

  if (viewport) {
    try {
      await page.setViewport(viewport)
    } catch (e) {
      debug('page set viewport error: %s', e.message())
    }
  }

  if (device && puppeteer.devices[device]) {
    try {
      await page.emulate(puppeteer.devices[device])
    } catch (e) {
      debug('page emulate error: %s', e.message())
    }
  }

  if (/^http/.test(content)) {
    await Promise.all([
      page.goto(content),
      pageWaitForNetworkIdle(page, 500, 0)
    ])
  } else {
    await pageSetContent(page, content)
  }

  if (scroll) {
    try {
      await pageScroll(
        page,
        scrollDistance || 100,
        scrollInterval || 0
      )
    } catch (e) {
      debug('page scroll error: %s', e.message())
    }
  }

  let el = page
  if ($) {
    try {
      el = await page.$($)
    } catch (e) {
      debug('page $ error: %s', e.message())
    }
  }

  return await el.screenshot(screenshotOptions)
}

exports.pageSetContent = pageSetContent
exports.pageWaitForNetworkIdle = pageWaitForNetworkIdle
exports.pageScroll = pageScroll
exports.pageScreenshot = pageScreenshot