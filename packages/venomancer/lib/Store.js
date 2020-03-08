'use strict'

const { getObjectValueByPath, setObjectValueByPath } = require('../util')

module.exports = class {
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
