#!/usr/bin/env node

'use strict'

require('dotenv').config()

const { parseConfig, parseArg } = require('../util')

const {
  port = 8888,
  env = 'development',
  debug,
  print
} = parseArg()

process.env.PORT = port
process.env.NODE_ENV = env
if (debug !== undefined) {
  process.env.DEBUG = debug
} else {
  process.env.DEBUG = env === 'production' ? '' : '*'
}

const Application = require('../lib/Application')

if (print === 'chromium') return Application.printChromium()

new Application(parseConfig()).listen(process.env.PORT || 8888)
