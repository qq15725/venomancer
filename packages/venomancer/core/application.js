'use strict'

const path = require('path')
const fs = require('fs')
const objectExtend = require('extend')
const { parseArg } = require('../util')
const debug = require('debug')('venomancer:application')
const error = require('debug')('venomancer:error')

const Koa = require('koa')
const Router = require('koa-router')
const Container = require('./container')
const Config = require('./config')
const BrowserPool = require('./browser_pool')

module.exports = class Application extends Container {
  constructor (basePath) {
    super()
    this.basePath = basePath
    this.registerBaseBindings()
  }

  getPath (...names) {
    return path.resolve(this.basePath, ...names)
  }

  registerBaseBindings () {
    this.registerConfigBinding()
    this.registerKoaBinding()
    this.registerRouterBinding()
    this.registerBrowserPoolBinding()
  }

  /**
   * register config
   */
  registerConfigBinding () {
    const userConfigPath = path.resolve(process.cwd(), 'venomancer.config.js')
    let userConfig = {}
    if (fs.existsSync(userConfigPath)) {
      userConfig = require(userConfigPath)
    }

    let config = {}
    fs.readdirSync(path.resolve(this.basePath, 'config')).forEach(filename => {
      const key = filename.replace('.js', '')
      const filepath = path.resolve(this.basePath, 'config', filename)
      config[key] = require(filepath)
    })

    config = objectExtend(config, userConfig)

    this.set('config', new Config(config))
  }

  /**
   * @returns {Config}
   */
  get config () {
    return this.get('config')
  }

  /**
   * register koa
   */
  registerKoaBinding () {
    this.set('koa', new Koa())
  }

  /**
   * @returns {Koa}
   */
  get koa () {
    return this.get('koa')
  }

  registerRouterBinding () {
    this.set('router', new Router())
  }

  /**
   * @returns {Router}
   */
  get router () {
    return this.get('router')
  }

  registerBrowserPoolBinding () {
    this.set('browser_pool', new BrowserPool())
  }

  /**
   * @returns {BrowserPool}
   */
  get browserPool () {
    return this.get('browser_pool')
  }

  /**
   * @param name
   */
  loadRoutes (name) {
    require(this.getPath('routes', name))(this.router, this)
  }

  /**
   * run server
   */
  async run () {
    const koa = this.koa

    // catch error
    koa.use(function catchError (ctx, next) {
      return next().catch(function (err) {
        const status = err.status || 500
        ctx.status = status
        ctx.body = {
          code: status,
          message: err.message,
        }
        if (status === 500) {
          ctx.body.errors = err.stack.split('\n')
          ctx.app.emit('error', err, ctx)
        }
      })
    })

    // body parser
    koa.use(require('koa-bodyparser')())

    // routes
    koa.use(this.router.routes())

    // OPTIONS ...
    koa.use(this.router.allowedMethods())

    // handle error
    koa.on('error', (err, ctx) => {
      error(err)
    })

    const server = koa.listen(
      process.env.PORT
      || parseArg('port')
      || 8888
    )

    debug('http server listen port %s', server.address().port)

    if (this.config.get('poster.autoLaunchPosterBrowser')) {
      const Browser = require('@venomancer/browser')
      const browser = new Browser(
        objectExtend(
          { type: 'poster', },
          this.config.get('poster', {})
        )
      )
      await browser.launch()
      this.set('poster_browser_id', this.browserPool.push(browser))
    }
  }
}
