'use strict'

const pageSpider = require('@venomancer/headless-chrome/spider')

module.exports = {
  rebootBrowser: async function (ctx) {
    const chrome = ctx.venomancer.chrome


    ctx.body = 'ok'
  }
}