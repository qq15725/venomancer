'use strict'

const path = require('path')

const getDefaultExecutablePath = () => {
  if (process.platform === 'win32') {
    return 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  } else if (process.platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  } else {
    return null
  }
}

module.exports = {
  headlessChrome: {
    // 浏览器实例数量
    browsersCount: 1,
    // 浏览器实例重启时间（单位秒）
    browserTTL: 1800,
    // 每个浏览器实例预设的空白页数量（减少 new page 的时间占用）
    presetPagesCount: 5,
    // 实例启动的选项
    // puppeteer options
    // @see https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
    launchOptions: {
      executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || getDefaultExecutablePath(),
      // 毫秒
      timeout: 30 * 1000,
      // 不使用默认选项
      ignoreDefaultArgs: true,
      // @see https://peter.sh/experiments/chromium-command-line-switches/
      args: [
        // puppeteer-core/lib/Launcher.js defaultArgs
        '--disable-background-networking',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-extensions-with-background-pages',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-features=TranslateUI',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-popup-blocking',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-sync',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--no-first-run',
        '--enable-automation',
        '--password-store=basic',
        '--use-mock-keychain',

        // devtools
        // '--auto-open-devtools-for-tabs'，

        // headless
        '--headless',
        '--hide-scrollbars',
        '--mute-audio',

        // 自定义部分
        '--disable-gpu',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',

        'about:blank'
      ]
    }
  },
  router: {
    routes: [
      path.resolve(__dirname, '../routes/api')
    ]
  }
}