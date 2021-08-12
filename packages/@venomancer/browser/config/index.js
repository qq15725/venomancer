const { getExecutablePath } = require('../utils')

const defaultArgs = require('./default_args')

module.exports = {
  // 浏览器重启间隔时间（单位秒）
  relaunchInterval: 1800,
  // 浏览器预设空白页数量
  presetPagesCount: 1,
  // 隐藏特征
  stealth: true,
  // 启动选项
  // puppeteer options
  // https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
  options: {
    // 可执行路径
    executablePath: getExecutablePath(),
    // 毫秒
    timeout: 30000,
    // 不使用默认选项
    ignoreDefaultArgs: true,
    dumpio: false,
    pipe: false,
    env: process.env,
    handleSIGINT: true,
    handleSIGTERM: true,
    handleSIGHUP: true,
    ignoreHTTPSErrors: false,
    defaultViewport: {
      width: 1200,
      height: 1000,
      // width: 800,
      // height: 600
    },
    slowMo: 0,
    // https://peter.sh/experiments/chromium-command-line-switches
    args: [
      ...defaultArgs,

      // devtools
      '--auto-open-devtools-for-tabs',

      'about:blank',
    ],
  }
}