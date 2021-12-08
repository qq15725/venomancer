'use strict'

const app = require('../bootstrap/app')
const { pageScreenshot } = require('@venomancer/browser/page/screenshot')

function firstOrFail () {
  return app.browserPool.findOrFail(app.get('poster_browser_id'))
}

module.exports = class ScreenshotController {
  async store (ctx) {
    const browser = firstOrFail()
    let isNewPage = false
    let page = browser.getRandomPage()
    if (!page) {
      page = await browser.newPage()
      isNewPage = true
    }
    page.status = 'screenshoting'
    ctx.body = await pageScreenshot(page.connection, ctx.request.body)
    ctx.type = 'image/png'
    page.status = 'normal'
    page.close()
    !isNewPage && browser.newPage()
  }
}