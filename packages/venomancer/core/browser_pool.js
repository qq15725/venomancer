'use strict'

module.exports = class BrowserPool {
  constructor () {
    this.browsers = []
  }

  /**
   * @returns {[Browser]}
   */
  get () {
    return this.browsers
  }

  /**
   * @param id
   */
  close (id) {
    this.browsers[id - 1] = null
  }

  /**
   * @param id
   * @returns {Browser}
   */
  find (id) {
    return this.browsers[id - 1]
  }

  /**
   * @param id
   * @returns {Browser}
   */
  findOrFail (id) {
    const res = this.find(id)

    if (!res) {
      let err = new Error('browser not found')
      err.status = 404
      throw err
    }

    return res
  }

  /**
   * @returns {Browser}
   */
  firstOrFail () {
    const res = this.browsers[0]

    if (!res) {
      let err = new Error('browser not found')
      err.status = 404
      throw err
    }

    return res
  }

  /**
   * @param browser {Browser}
   * @returns {number}
   */
  push (browser) {
    return this.browsers.push(browser)
  }
}