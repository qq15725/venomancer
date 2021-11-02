'use strict'

exports.getNestedValue = function (obj, path, fallback) {
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

exports.getObjectValueByPath = function (obj, path, fallback) {
  // credit:
  // http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
  if (obj == null || !path || typeof path !== 'string') return fallback
  if (obj[path] !== undefined) return obj[path]
  path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  path = path.replace(/^\./, '') // strip a leading dot
  return exports.getNestedValue(obj, path.split('.'), fallback)
}

exports.setNestedValue = function (obj, path, value) {
  const last = path.length - 1
  for (let i = 0; i < last; i++) {
    if (typeof obj[path[i]] !== 'object') {
      obj[path[i]] = {}
    }
    obj = obj[path[i]]
  }
  obj[path[last]] = value
}

exports.setObjectValueByPath = function (obj, path, value) {
  if (typeof obj !== 'object' || !path || typeof path !== 'string') return
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')
  return exports.setNestedValue(obj, path.split('.'), value)
}

/**
 * Simple object check.
 *
 * @param item
 * @returns {boolean}
 */
exports.isObject = function (item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 * @returns {*}
 */
exports.mergeDeep = function (target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (exports.isObject(target) && exports.isObject(source)) {
    for (const key in source) {
      if (exports.isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        exports.mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return exports.mergeDeep(target, ...sources)
}

exports.parseArg = function (name) {
  const options = process.argv.reduce((items, item) => {
    if (!/^--[a-zA-Z0-9]+=.+?$/.test(item)) return items

    let [key, value] = item.split('=')

    items[key.slice(2)] = value

    return items
  }, {})

  if (name === undefined) {
    return options
  }

  return options[name]
}