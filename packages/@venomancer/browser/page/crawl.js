'use strict'

async function getPageXpathValues (page, xpath) {
  const els = await page.$x(xpath)
  let items = []
  for (let i = 0; i < els.length; i++) {
    items.push(
      await page.evaluate(el => {
        return el.innerText || el.value
      }, els[i])
    )
  }
  return items
}

async function pageCrawl (page, options) {
  const {
    url,
    selector,
    attribute,
    xpath,
  } = options

  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 30000
  })

  if (selector) {
    return await page.$$eval(selector, async (els, { attribute }) => {
      let items = []
      for (let i = 0; i < els.length; i++) {
        const el = els[i]
        if (attribute) {
          items.push(
            el.getAttribute(attribute)
          )
        } else {
          items.push(
            el.innerText
          )
        }
      }
      return items
    }, { attribute })
  } else if (xpath) {
    if (typeof xpath === 'object') {
      const items = []
      const keys = Object.keys(xpath)
      let rows = []
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        items[key] = await getPageXpathValues(page, xpath[key])
        if (items[key].length > rows.length) {
          rows = items[key]
        }
      }
      return rows.map((_, i) => {
        let row = {}
        Object.keys(items).forEach(key => {
          row[key] = items[key][i]
        })
        return row
      })
    } else {
      return await getPageXpathValues(page, xpath)
    }
  }

  return await page.content()
}

async function setupPageStealth (page) {
  await page.evaluate(require('./stealth'))
}

exports.pageCrawl = pageCrawl
exports.getPageXpathValues = getPageXpathValues
exports.setupPageStealth = setupPageStealth
