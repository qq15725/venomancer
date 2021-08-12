'use strict'

module.exports = class ChromePool {
  constructor () {
    this.chromes = []
  }

  push (chrome) {
    return this.chromes.push(chrome)
  }
}