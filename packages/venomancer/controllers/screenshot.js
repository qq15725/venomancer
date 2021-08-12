'use strict'

const debug = require('debug')('venomancer:screenshot')

const app = require('../bootstrap/app')

const { pageScreenshot } = require('@venomancer/browser/page/screenshot')

function firstOrFail () {
  return app.browserPool.findOrFail(app.get('poster_browser_id'))
}

async function reset (browser, page) {
  await page.close()
  await browser.newPage()
  await browser.disconnect()
}

module.exports = class ScreenshotController {
  async store (ctx) {
    const browser = await firstOrFail().connection()
    const pages = await browser.pages()
    const page = pages[~~(Math.random() * 10) % pages.length]
    ctx.body = await pageScreenshot(page, ctx.request.body)
    ctx.type = 'image/png'
    reset(browser, page)
  }
}