'use strict'

const {
  getObjectValueByPath,
  setObjectValueByPath
} = require('../util')

module.exports = class Container {
  constructor (data) {
    this.instances = data || {}
  }

  /**
   *
   * @param key
   * @param defaultValue
   * @returns {*|{}}
   */
  get (key, defaultValue) {
    if (key !== undefined) {
      return getObjectValueByPath(this.instances, key, defaultValue)
    }

    return this.instances
  }

  /**
   * @param key
   * @param value
   */
  set (key, value) {
    setObjectValueByPath(this.instances, key, value)
  }
}
