'use strict'

const debug = require('debug')('venomancer:routes')

let controllers = {}

module.exports = function (router, app) {
  post('/screenshot', 'screenshot@store')

  get('/browsers', 'browser@index')
  post('/browsers', 'browser@store')
  del('/browsers/:id', 'browser@delete')
  post('/browsers/:id/screenshot', 'browser@screenshot')
  post('/browsers/:id/crawl', 'browser@crawl')
  post('/browsers/:id/cookies', 'browser@setCookie')

  /**
   * 注册 GET 路由
   *
   * @param path
   * @param controller
   */
  function get (path, controller) {
    register('get', path, controller)
  }

  /**
   * 注册 POST 路由
   *
   * @param path
   * @param controller
   */
  function post (path, controller) {
    register('post', path, controller)
  }

  /**
   * 注册 DELETE 路由
   *
   * @param path
   * @param controller
   */
  function del (path, controller) {
    register('delete', path, controller)
  }

  /**
   * 注册路由
   *
   * @param method
   * @param path
   * @param controller
   */
  function register (method, path, controller) {
    let [ctrl, action] = controller.split('@')
    if (!controllers[ctrl]) {
      const filepath = app.getPath('controllers', `${ ctrl }.js`)
      if (!require('fs').existsSync(filepath)) {
        debug('%s file not exists', ctrl)
        return
      }
      controllers[ctrl] = new (require(filepath))()
    }
    const instance = controllers[ctrl]
    if (!instance[action]) {
      debug('"%s" controller "%s" action not exists', ctrl, action)
      return
    }
    router[method](path, instance[action])
  }
}