'use strict'

exports.parseArg = () => process.argv.reduce((args, item) => {
  if (!/^--[a-zA-Z0-9]+(=.*?){0,1}$/.test(item)) return args
  let [key, value] = item.split('=')
  args[key.slice(2)] = value === undefined ? null : value
  return args
}, {})

exports.parseConfig = () => {
  const configPath = require('path').resolve(process.cwd(), 'headless-chrome.config.js')
  const config = require('fs').existsSync(configPath) ? require(configPath) : {}
  return require('extend')(require('../config'), config)
}

exports.getNestedValue = (obj, path, fallback) => {
  const last = path.length - 1
  if (last < 0) return obj === undefined ? fallback : obj
  for (let i = 0; i < last; i++) {
    if (obj == null) {
      return fallback
    }
    obj = obj[path[i]]
  }
  if (obj == null) return fallback
  return obj[path[last]] === undefined ? fallback : obj[path[last]]
}

exports.getObjectValueByPath = (obj, path, fallback) => {
  // credit:
  // http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
  if (obj == null || !path || typeof path !== 'string') return fallback
  if (obj[path] !== undefined) return obj[path]
  path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  path = path.replace(/^\./, '') // strip a leading dot
  return exports.getNestedValue(obj, path.split('.'), fallback)
}

exports.setNestedValue = (obj, path, value) => {
  const last = path.length - 1
  for (let i = 0; i < last; i++) {
    if (typeof obj[path[i]] !== 'object') {
      obj[path[i]] = {}
    }
    obj = obj[path[i]]
  }
  obj[path[last]] = value
}

exports.setObjectValueByPath = (obj, path, value) => {
  if (typeof obj !== 'object' || !path || typeof path !== 'string') return
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  return exports.setNestedValue(obj, path.split('.'), value)
}
