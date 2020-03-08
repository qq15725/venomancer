'use strict'

const puppeteer = require('puppeteer-core')
const { LifecycleWatcher } = require('puppeteer-core/lib/LifecycleWatcher')

module.exports = class HeadlessChrome {
  constructor (app) {
    this._app = app
  }

  browsers () {
    return this._app.store().get('browsers') || []
  }

  getRandomBrowser () {
    const browsers = this.browsers()
    return browsers[~~(Math.random() * browsers.length)] || {}
  }

  async launch () {
    this.launchBrowsers()
    this._refreshTimer = setTimeout(() => this.resetBrowsers, (this._app.option('HeadlessChrome.browserTTL') || 1800) * 1000)
  }

  async launchBrowsers () {
    let {
      launchOptions = {},
      browsersCount = 1,
      presetPagesCount = 0,
    } = this._app.option('HeadlessChrome')

    const browsers = this.browsers()

    browsersCount = Math.max(0, browsersCount - browsers.length)
    presetPagesCount = Math.max(0, presetPagesCount - 1)

    while (browsersCount--) {
      const browser = await puppeteer.launch(launchOptions)
      let _presetPagesCount = presetPagesCount
      while (_presetPagesCount--) {
        await browser.newPage()
      }
      browsers.push({
        browserWSEndpoint: browser.wsEndpoint(),
        pages: (await browser.pages()).map(page => page.target()._targetId)
      })
      await browser.disconnect()
    }

    this._app.store().set('browsers', browsers)
  }

  async resetBrowsers () {
    clearTimeout(this._refreshTimer)
    const browsers = this.browsers()
    let len = browsers.length
    while (len--) {
      await this.closeBrowser(browsers.shift())
    }
    this.launchBrowsers()
    this._refreshTimer = setTimeout(() => this.resetBrowsers, (this._app.option('HeadlessChrome.browserTTL') || 1800) * 1000)
  }

  async closeBrowser (_browser, retries = 2) {
    const browser = await puppeteer.connect({ browserWSEndpoint: _browser.browserWSEndpoint })
    if (!browser) return false
    const pages = await browser.pages()
    if (pages && pages.length > 1 && retries > 0) {
      return setTimeout(() => this.closeBrowser(_browser, retries - 1), 60 * 1000)
    }
    return await browser.close()
  }

  async setContent (page, content) {
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

  async screenshot (content, opts = {}) {
    const { browserWSEndpoint, pages } = this.getRandomBrowser()
    if (!pages || !pages.length) return
    const targetId = pages.shift()
    const browser = await puppeteer.connect({ browserWSEndpoint })
    const page = await (await browser.waitForTarget(({ _targetId }) => _targetId === targetId)).page()
    const {
      viewport,
      device,
      autoScroll,
      $,
      ...options
    } = opts
    if (viewport) await page.setViewport(viewport)
    if (device && puppeteer.devices[device]) await page.emulate(puppeteer.devices[device])
    if (/^http/.test(content)) {
      await Promise.all([page.goto(content), this.waitForNetworkIdle(page, 500, 0)])
    } else {
      await this.setContent(page, content)
    }
    if (autoScroll) await this.autoScroll(page)
    const el = ($ ? (await page.$($)) : null) || page
    const image = await el.screenshot(options)
    this.resetPage(browser, page, pages)
    return image
  }

  async resetPage (browser, page, pages) {
    await page.close()
    pages.push((await browser.newPage()).target()._targetId)
  }

  async autoScroll (page) {
    return await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0
        let distance = 100
        let timer = setInterval(() => {
          let scrollHeight = Math.min(document.body.scrollHeight, 5000)
          window.scrollBy(0, distance)
          totalHeight += distance
          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
    })
  }

  waitForNetworkIdle (page, timeout, maxInflightRequests = 0) {
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
}