'use strict'

const { setupPageStealth } = require('./page/crawl')

module.exports = class Page {
  /**
   * 浏览器
   */
  browser

  /**
   * 页面连接
   */
  connection

  /**
   * 状态
   */
  status = 'normal'

  constructor (connection, browser) {
    this.browser = browser
    this.connection = connection
    this.registerEventBindings()
  }

  async registerEventBindings () {
    await this.connection.on('domcontentloaded', async () => {
      if (this.browser.config.stealth) {
        await setupPageStealth(page)
      }
    })
  }

  async close () {
    if (this.status !== 'normal') return false
    this.status = 'closeing'
    await this.connection.close()
    this.status = 'closed'
    this.browser.resetPages()
    return true
  }
}
