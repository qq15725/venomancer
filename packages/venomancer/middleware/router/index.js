'use strict'

const Router = require('koa-router')

module.exports = app => {
  const router = new Router()
  const routes = app.option('router.routes') || []
  routes.forEach(route => require(route)(router))
  app.use(router.routes())
  app.use(router.allowedMethods())
  return async (ctx, next) => await next()
}