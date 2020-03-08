'use strict'

const bodyParser = require('koa-bodyparser')

module.exports = app => {
  app.use(bodyParser())
  return async (ctx, next) => await next()
}