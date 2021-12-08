'use strict'

const { setupPageStealth } = require('./page/crawl')

module.exports = class Page {
  constructor (connection, browser) {
    this.status = 'normal'
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
