'use strict'

const app = require('../bootstrap/app')

const Browser = require('@venomancer/browser')

const { pageScreenshot } = require('@venomancer/browser/page/screenshot')
const { pageCrawl } = require('@venomancer/browser/page/crawl')

function findOrFail (id) {
  return app.browserPool.findOrFail(id)
}

module.exports = class BrowserController {
  async index (ctx) {
    ctx.body = app.browserPool.get().map((browser, index) => {
      return {
        id: index + 1,
        wsEndpoint: (browser || {}).wsEndpoint,
      }
    })
  }

  async store (ctx) {
    const browser = new Browser(
      ctx.request.body
    )
    await browser.launch()
    ctx.body = {
      id: app.browserPool.push(browser),
      wsEndpoint: browser.wsEndpoint,
    }
  }

  async delete (ctx) {
    const id = ctx.params.id
    const browser = findOrFail(id)
    await browser.close()
    app.browserPool.close(id)
    ctx.body = {}
    ctx.status = 201
  }

  async setCookie (ctx) {
    const {
      cookie,
      domain
    } = ctx.request.body
    const browser = await findOrFail(ctx.params.id).connection()
    const page = await browser.newPage()
    const cookies = cookie.split(';').map(item => {
      const [key, value] = item.split('=')
      return {
        name: key.trim(),
        value: value.trim(),
        domain,
      }
    })
    await page.setCookie(...cookies)
    ctx.body = cookies
    await page.close()
    await browser.disconnect()
  }

  async screenshot (ctx) {
    const browser = await findOrFail(ctx.params.id).connection()
    const page = (await browser.pages())[0]
    const image = await pageScreenshot(page, ctx.request.body)
    await page.close()
    await browser.newPage()
    await browser.disconnect()
    ctx.body = image
    ctx.type = 'image/png'
  }

  async crawl (ctx) {
    const browser = await findOrFail(ctx.params.id).connection()
    const page = (await browser.pages())[0]
    const res = await pageCrawl(page, ctx.request.body)
    await page.close()
    await browser.newPage()
    await browser.disconnect()
    ctx.body = res
  }
}