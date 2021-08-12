'use strict'

const debug = require('debug')('venomancer:browser')
const debugPage = require('debug')('venomancer:page')

const puppeteer = require('puppeteer-core')
const { setupPageSpider } = require('./utils/page')

module.exports = class Browser {
  constructor (app) {
    this.app = app
    this.browser = null
    this.wsEndpoint = null
  }

  get config () {
    return require('./config/config')
  }

  async launch () {
    this.timer && clearTimeout(this.timer)

    if (this.browser) {
      await this.close()
    }

    this.browser = await puppeteer.launch(this.config.options)

    this.wsEndpoint = this.browser.wsEndpoint()

    this.registerEventBindings()

    this.timer = setTimeout(
      this.launch,
      this.config.browserTTL * 1000
    )
  }

  async registerEventBindings () {
    await this.browser.on('disconnected', async () => {
      debug('disconnected [%s]', this.wsEndpoint)
    })

    await this.browser.on('targetcreated', async (target) => {
      debug('targetcreated [%s]', this.wsEndpoint)
      const page = await target.page()
      if (page) {
        await this.registerPageEventBindings(await target.page())
      }
    })

    await this.browser.on('targetchanged', async (target) => {
      debug('targetchanged [%s]', this.wsEndpoint)
    })

    await this.browser.on('targetdestroyed', async (target) => {
      debug('targetdestroyed [%s]', this.wsEndpoint)
    })

    let pages = await this.browser.pages()

    pages.forEach(async page => {
      await this.registerPageEventBindings(page)
    })

    for (let ix = 0; ix < this.config.browserPresetPagesCount - 1; ix++) {
      await this.browser.newPage()
    }

    debug('event binded [%s]', this.wsEndpoint)
  }

  async registerPageEventBindings (page) {
    await page.on('close', async () => {
      debugPage('closed [%s]', page.target()._targetId)
    })

    await page.on('domcontentloaded', async () => {
      // if (this.config.spider) {
      //   await setupPageSpider(page)
      // }

      debugPage('domcontentloaded [%s] %s', page.target()._targetId, page.url())
    })

    await page.on('load', async () => {
      debugPage('loaded [%s]', page.target()._targetId)
    })

    debugPage('event binded [%s]', page.target()._targetId)
  }

  async close (retries = 2) {
    const pages = await this.browser.pages()

    if (pages && pages.length > 1 && retries > 0) {
      return setTimeout(
        () => this.close(--retries),
        60 * 1000
      )
    }

    return await this.browser.close()
  }

  async getRandomBrowser () {
    return this.browser
  }
}
