'use strict'

const { getObjectValueByPath, setObjectValueByPath } = require('../util')

class Store {
  constructor () {
    this._data = {}
  }

  get (key) {
    return getObjectValueByPath(this._data, key)
  }

  set (key, value) {
    setObjectValueByPath(this._data, key, value)
  }
}

module.exports = Store
