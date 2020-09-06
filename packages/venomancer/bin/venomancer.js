#!/usr/bin/env node

'use strict'

process.env.DEBUG = process.env.DEBUG || 'venomancer,puppeteer:launcher'

const Application = require('../lib/Application')

const { port } = Application.parseArgs()

const config = Application.parseConfig()

const app = new Application(config)

const executablePath = app.config('headlessChrome.launchOptions.executablePath')

if (!executablePath || !require('fs').existsSync(executablePath)) {
  return Application.printDownloadChromium()
}

app.listen(process.env.PORT || port || 8888)