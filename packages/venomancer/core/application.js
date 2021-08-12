'use strict'

const debug = require('debug')('venomancer')

const { getObjectValueByPath } = require('../util')

class Application {
  constructor (config) {
    this._config = config
    this._store = new (require('./Store'))()
    this._server = new (require('koa'))()
  }

  store () {
    return this._store
  }

  config (key) {
    if (key === undefined) {
      return this._config
    }
    return getObjectValueByPath(this._config, key)
  }

  server () {
    return this._server
  }

  use (fn) {
    return this._server.use(fn)
  }

  listen (...args) {
    this.setupDefaultMiddleware()
    const server = this._server.listen(...args)
    const address = server.address()
    debug('listen port %s', address.port)
    return server
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
    return require('extend')(
      require('../config'),
      require('fs').existsSync(configPath) ? require(configPath) : {}
    )
  }

  static parseArgs () {
    return process.argv.reduce((args, item) => {
      if (!/^--[a-zA-Z0-9]+=.+?$/.test(item)) return args
      let [key, value] = item.split('=')
      args[key.slice(2)] = value
      return args
    }, {})
  }

  static printDownloadChromium () {
    const version = require('puppeteer-core/package').puppeteer.chromium_revision
    const platform = process.platform
    const arch = process.arch
    const title = `Chromium v${ version } is not downloaded`
    const linkMapping = {
      mac: `https://npm.taobao.org/mirrors/chromium-browser-snapshots/Mac/${ version }/chrome-mac.zip`,
      win: `https://npm.taobao.org/mirrors/chromium-browser-snapshots/Win/${ version }/chrome-win.zip`,
      winx64: `https://npm.taobao.org/mirrors/chromium-browser-snapshots/Win_x64/${ version }/chrome-win.zip`,
      linux: `https://npm.taobao.org/mirrors/chromium-browser-snapshots/Linux_x64/${ version }/chrome-linux.zip`,
    }

    if (platform === 'darwin') {
      console.log(
        `${ title }\n` +
        `Download Chromium ${ linkMapping.mac }\n\n` +
        `Try "wget ${ linkMapping.mac } && unzip chrome-mac && echo CHROMIUM_EXECUTABLE_PATH=$(pwd)/chrome-mac/Chromium.app/Contents/MacOS/Chromium > .env"`
      )
    } else if (platform === 'win32' && arch === 'x64') {
      console.log(
        `${ title }\n` +
        `Download Chromium ${ linkMapping.winx64 }`
      )
    } else if (platform === 'win32' && arch === 'x32') {
      console.log(
        `${ title }\n` +
        `Download Chromium ${ linkMapping.win }`
      )
    } else if (platform === 'linux') {
      console.log(
        `${ title }\n` +
        `Download Chromium ${ linkMapping.linux }\n\n` +
        `Try "wget ${ linkMapping.linux } && unzip chrome-linux && echo CHROMIUM_EXECUTABLE_PATH=$(pwd)/chrome-linux/chrome > .env"`
      )
    } else {
      console.log(
        `${ title }\n` +
        `Download Chromium for Mac ${ linkMapping.mac }\n` +
        `Download Chromium for Win ${ linkMapping.win }\n` +
        `Download Chromium for Win_x64 ${ linkMapping.winx64 }\n` +
        `Download Chromium for Linux_x64 ${ linkMapping.linux }`
      )
    }
  }
}

module.exports = Application
