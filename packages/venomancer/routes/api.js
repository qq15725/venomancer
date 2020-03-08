'use strict'

module.exports = router => {
  const path = require('path')
  const fs = require('fs')
  const curPath = path.resolve(__dirname, '../controller')

  fs.readdirSync(curPath).forEach(item => {
    const controller = require(`${curPath}/${item}`)
    Object.keys(controller).forEach(method => {
      if (['get', 'post'].includes(method)) {
        router[method](`/${item.replace('.js', '')}`, controller[method])
      }
    })
  })
}