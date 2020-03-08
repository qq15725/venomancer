'use strict'

module.exports = app => {
  const HeadlessChrome = require('./lib/HeadlessChrome')

  const headlessChrome = new HeadlessChrome(app)

  headlessChrome.launch()

  return async (ctx, next) => {
    if (ctx.headlessChrome) return await next()

    Object.assign(ctx, { headlessChrome })

    await next()
  }
}