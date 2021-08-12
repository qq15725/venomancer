const { getExecutablePath } = require('../utils')

const defaultArgs = require('./args')

module.exports = {
  // 浏览器重启间隔时间（单位秒）
  relaunchInterval: 1800,
  // 浏览器预设空白页数量
  presetPagesCount: 5,
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
    // https://peter.sh/experiments/chromium-command-line-switches
    args: [
      ...defaultArgs,

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
}