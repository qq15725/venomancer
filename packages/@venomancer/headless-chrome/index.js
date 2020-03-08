'use strict'

const HeadlessChrome = require('./lib/HeadlessChrome')

module.exports = app => {
  const headlessChrome = new HeadlessChrome(app)

  headlessChrome.launch()

  return async (ctx, next) => {
    if (ctx.headlessChrome) return await next()

    Object.assign(ctx, { headlessChrome })

    await next()
  }
}