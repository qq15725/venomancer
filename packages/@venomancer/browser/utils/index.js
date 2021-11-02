'use strict'

/**
 * @param ms
 * @returns {Promise}
 */
exports.sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Simple object check.
 *
 * @param item
 * @returns {boolean}
 */
exports.isObject = function (item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 * @returns {*}
 */
exports.mergeDeep = function (target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (exports.isObject(target) && exports.isObject(source)) {
    for (const key in source) {
      if (exports.isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        exports.mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return exports.mergeDeep(target, ...sources)
}

/**
 * 获取 chromium 可执行地址
 *
 * @returns {string|null}
 */
exports.getExecutablePath = function () {
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    return process.env.CHROMIUM_EXECUTABLE_PATH
  } else if (process.platform === 'win32') {
    return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  } else if (process.platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  } else {
    return null
  }
}

/**
 * 存在 chromium 可执行地址
 *
 * @returns boolean
 */
exports.existsExecutablePath = function (executablePath = null) {
  executablePath = executablePath || exports.getExecutablePath()

  return executablePath && require('fs').existsSync(executablePath)
}

/**
 * 获取 chromium 下载提示
 *
 * @returns {string}
 */
exports.getDownloadTip = function () {
  const version = require('puppeteer-core/package').puppeteer.chromium_revision
  const platform = process.platform
  const arch = process.arch
  const title = `Chromium v${ version } is not downloaded`
  const linkMapping = {
    mac: `https://npm.taobao.org/mirrors/chromium-browser-snapshots/Mac/${ version }/chrome-mac.zip`,
    win: `https://npm.taobao.org/mirrors/chromium-browser-snapshots/Win/${ version }/chrome-win.zip`,
    winx64: `https://npm.taobao.org/mirrors/chromium-browser-snapshots/Win_x64/${ version }/chrome-win.zip`,
    linux: `https://npm.taobao.org/mirrors/chromium-browser-snapshots/Linux_x64/${ version }/chrome-linux.zip`,
  }

  if (platform === 'darwin') {
    return `${ title }
Download Chromium ${ linkMapping.mac }
      
Try "wget ${ linkMapping.mac } && unzip chrome-mac && echo CHROMIUM_EXECUTABLE_PATH=$(pwd)/chrome-mac/Chromium.app/Contents/MacOS/Chromium > .env"`
  } else if (platform === 'win32' && arch === 'x64') {
    return `${ title }
Download Chromium ${ linkMapping.winx64 }`
  } else if (platform === 'win32' && arch === 'x32') {
    return `${ title }
Download Chromium ${ linkMapping.win }`
  } else if (platform === 'linux') {
    return `${ title }
Download Chromium ${ linkMapping.linux }
      
Try "wget ${ linkMapping.linux } && unzip chrome-linux && echo CHROMIUM_EXECUTABLE_PATH=$(pwd)/chrome-linux/chrome > .env"`
  } else {
    return `${ title }
Download Chromium for Mac ${ linkMapping.mac }
Download Chromium for Win ${ linkMapping.win }
Download Chromium for Win_x64 ${ linkMapping.winx64 }
Download Chromium for Linux_x64 ${ linkMapping.linux }`
  }
}