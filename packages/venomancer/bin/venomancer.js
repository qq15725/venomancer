#!/usr/bin/env node

'use strict'

require('dotenv').config()

const parseArg = require('../util').parseArg

process.env.DEBUG = process.env.DEBUG
  || parseArg('debug')
  || '*'

const app = require('../bootstrap')

const {
  getDownloadTip,
  existsExecutablePath
} = require('@venomancer/browser/utils')

if (!existsExecutablePath(app.config.get('executablePath'))) {
  return console.error(getDownloadTip())
}

app.run()