'use strict'

require('dotenv').config()

const Application = require('../core/application')

// app
const app = new Application(
  require('path').dirname(__dirname)
)

module.exports = app