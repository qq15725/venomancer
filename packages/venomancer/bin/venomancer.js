#!/usr/bin/env node

'use strict'

process.env.DEBUG = process.env.DEBUG || '*'

const {
  getDownloadTip,
  existsExecutablePath
} = require('@venomancer/browser/utils')

if (!existsExecutablePath()) {
  return console.error(getDownloadTip())
}

require('../bootstrap').run()