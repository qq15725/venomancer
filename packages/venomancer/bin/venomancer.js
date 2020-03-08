#!/usr/bin/env node

'use strict'

const Application = require('../lib/Application')

const {
  port = 8888,
  env = 'development',
  debug,
  print
} = Application.parseArg()

process.env.PORT = port
process.env.NODE_ENV = env
if (debug !== undefined) {
  process.env.DEBUG = debug
} else {
  process.env.DEBUG = env === 'production' ? '' : '*'
}

if (print === 'chromium') return Application.printChromium()

new Application(Application.parseConfig()).listen(process.env.PORT || 8888)
