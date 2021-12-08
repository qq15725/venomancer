'use strict'

// Debug
const debug = require('debug')('venomancer:browser')

// Page
const Page = require('./page')

// Utils
const puppeteer = require('puppeteer-core')
const { mergeDeep } = require('./utils')

function getConfig (type) {
  switch (type) {
    case 'poster':
      return require('./config/poster_browser')
    default:
      return require('./config')
  }
}

module.exports = class Browser {
  /**
   * @param options
   */
  constructor (options = {}) {
    this.status = 'closed'
    this.wsEndpoint = null
    this.pages = []
    this.connection = null
    this.config = mergeDeep(getConfig(options.type), options)
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
    if (this.status !== 'closed') return this
    this.status = 'launching'
    const connection = await puppeteer.launch(this.config.options)
    this.connection = connection
    this.wsEndpoint = connection.wsEndpoint()
    await this.setupPages()
    this.status = 'launched'
    return this
  }

  /**
   * 关闭浏览器
   *
   * @returns {Promise<boolean>}
   */
  async close () {
    if (this.status !== 'launched') return false
    this.status = 'closeing'
    await (await this.getConnection()).close()
    this.wsEndpoint = null
    this.connection = null
    this.status = 'closed'
    return true
  }

  /**
   * 设置页面
   *
   * @returns {Promise<void>}
   */
  async setupPages () {
    this.pages = (await (await this.getConnection()).pages()).map(
      connection => new Page(connection, this)
    )
    for (let ix = 0; ix < this.config.presetPagesCount - 1; ix++) {
      this.newPage()
    }
  }

  /**
   * 重启浏览器
   *
   * @returns {Promise<Browser>}
   */
  async relaunch () {
    debug('relaunch [%s]', this.wsEndpoint)
    if (this.status === 'launched') {
      await this.close()
    }
    if (this.status === 'closed') {
      await this.launch()
    }
    return this
  }

  /**
   * 获取连接
   *
   * @returns {!Promise<!Puppeteer.Browser>}
   */
  async getConnection () {
    if (!this.connection) {
      this.connection = await puppeteer.connect({
        browserWSEndpoint: this.wsEndpoint
      })
    }
    return this.connection
  }

  /**
   * 断开连接
   *
   * @returns {Promise<*>}
   */
  async disconnect () {
    if (!this.connection) return false
    await this.connection.disconnect()
    this.pages = []
    this.connection = null
    return true
  }

  /**
   * 新建页面
   *
   * @returns {Promise<Page>}
   */
  async newPage () {
    const page = new Page(
      await (await this.getConnection()).newPage(), this
    )
    this.pages.push(page)
    return page
  }

  /**
   * 重置页面列表
   */
  resetPages () {
    return this.pages = this.pages.filter(page => (
      !['closeing', 'closed'].includes(page.status)
    ))
  }

  /**
   * 获取随机页面
   *
   * @returns {Page}
   */
  getRandomPage () {
    const pages = this.pages.filter(page => page.status === 'normal')
    return pages[~~(Math.random() * 10) % pages.length]
  }
}
