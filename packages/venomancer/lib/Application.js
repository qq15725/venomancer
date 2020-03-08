'use strict'

const Store = require('./Store')
const Middles = require('../middleware/')
const Koa = require('koa')

const { getObjectValueByPath } = require('../util')

module.exports = class {
  constructor (options) {
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
    // bodyParser
    this.use(Middles.bodyparser(this))
    // HeadlessChrome
    this.use(Middles.headlessChrome(this))
    // Router
    this.use(Middles.router(this))
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