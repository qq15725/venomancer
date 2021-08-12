'use strict'

const {
  getObjectValueByPath,
  setObjectValueByPath
} = require('../util')

module.exports = class Store {
  constructor () {
    this.items = {}
  }

  get (key) {
    return getObjectValueByPath(this.items, key)
  }

  set (key, value) {
    setObjectValueByPath(this.items, key, value)
  }
}
