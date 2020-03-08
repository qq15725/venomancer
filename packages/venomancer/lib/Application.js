'use strict'

const { getObjectValueByPath } = require('../util')

class Application {
  constructor (options) {
    const Store = require('./Store')
    const Koa = require('koa')

    this._options = options
    this._store = new Store()
    this._server = new Koa()
    this.setupDefaultMiddleware()
  }

  store () {
    return this._store
  }

  option (key) {
    return getObjectValueByPath(this._options, key)
  }

  options () {
    return this._options
  }

  server () {
    return this._server
  }

  use (fn) {
    return this._server.use(fn)
  }

  listen (...args) {
    return this._server.listen(...args)
  }

  setupDefaultMiddleware () {
    const Middles = require('../middleware/')
    // bodyParser
    this.use(Middles.bodyparser(this))
    // HeadlessChrome
    this.use(Middles.headlessChrome(this))
    // Router
    this.use(Middles.router(this))
  }

  static parseConfig () {
    require('dotenv').config()
    const configPath = require('path').resolve(process.cwd(), 'venomancer.config.js')
    return require('extend')(require('../config'), require('fs').existsSync(configPath) ? require(configPath) : {})
  }

  static parseArg () {
    return process.argv.reduce((args, item) => {
      if (!/^--[a-zA-Z0-9]+=.+?$/.test(item)) return args
      let [key, value] = item.split('=')
      args[key.slice(2)] = value
      return args
    }, {})
  }

  static printChromium () {
    const version = require('puppeteer-core/package').puppeteer.chromium_revision
    console.log(
      `chromium revision ${version} \r\n\r\n` +
      `download link https://npm.taobao.org/mirrors/chromium-browser-snapshots/ \r\n` +
      `Linux_x64 download link https://npm.taobao.org/mirrors/chromium-browser-snapshots/Linux_x64/${version}/chrome-linux.zip`
    )
  }
}

module.exports = Application
