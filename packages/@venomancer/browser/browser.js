'use strict'

const debug = require('debug')('venomancer:browser')

const puppeteer = require('puppeteer-core')
const { mergeDeep } = require('./utils')

const { setupPageStealth } = require('./page/crawl')

module.exports = class Browser {
  /**
   * @param config
   */
  constructor (config = {}) {
    let defaultConfig
    if (config.type === 'poster') {
      defaultConfig = require('./config/poster_browser')
    } else {
      defaultConfig = require('./config')
    }

    this.config = mergeDeep(defaultConfig, config)

    this.wsEndpoint = null

    if (this.config.relaunchInterval) {
      setInterval(
        () => this.relaunch(),
        this.config.relaunchInterval * 1000
      )
    }
  }

  /**
   * 启动浏览器
   *
   * @returns {Promise<Browser>}
   */
  async launch () {
    if (this.wsEndpoint) {
      return this
    }

    const browser = await puppeteer.launch(this.config.options)

    if (this.wsEndpoint) {
      await browser.close()
      return this
    }

    this.wsEndpoint = browser.wsEndpoint()

    await this.registerEventBindings(browser)

    let pages = await browser.pages()

    for (let i = 0; i < pages.length; i++) {
      await this.registerPageEventBindings(pages[i])
    }

    for (let ix = 0; ix < this.config.presetPagesCount - 1; ix++) {
      await browser.newPage()
    }

    await browser.disconnect()

    return this
  }

  /**
   * 重启浏览器
   *
   * @returns {Promise<Browser>}
   */
  async relaunch () {
    debug('relaunch [%s]', this.wsEndpoint)

    if (this.wsEndpoint) {
      await this.close()
    }

    await this.launch()

    return this
  }

  /**
   * 链接浏览器实例
   *
   * @returns {Promise<*>}
   */
  async connection () {
    const browser = await puppeteer.connect({
      browserWSEndpoint: this.wsEndpoint
    })

    await this.registerEventBindings(browser)

    return browser
  }

  /**
   * 关闭浏览器
   *
   * @returns {Promise<boolean>}
   */
  async close () {
    if (this.wsEndpoint) {
      const browser = await this.connection()

      await browser.close()

      this.wsEndpoint = null
    }

    return true
  }

  async registerEventBindings (browser) {
    await browser.on('targetcreated', async (target) => {
      const page = await target.page()
      if (page) {
        await this.registerPageEventBindings(await target.page())
      }
    })
  }

  async registerPageEventBindings (page) {
    await page.on('domcontentloaded', async () => {
      if (this.config.stealth) {
        await setupPageStealth(page)
      }
    })
  }

  async getRandomPage () {
    const browser = await this.connection()

    return (await browser.pages())[0]
  }
}
