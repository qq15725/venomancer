# venomancer

## 快速开始

全局安装

```bash
npm install venomancer -g
```

查看需要下载的 chromium 地址，下载并解压

```bash
venomancer --print=chromium
```

编辑配置

```bash
vim venomancer.config.js
```

```javascript
'use strict'

module.exports = {
  HeadlessChrome: {
    launchOptions: {
      // chromium 路径
      executablePath: '/data/venomancer/chrome-linux/chrome'
    }
  }
}
```

启动服务

```bash
# 开发环境启动
venomancer --port=8888 --debug="*,-nodemon*,-puppeteer:protocol*"

# 线上环境启动
venomancer --port=8888 --env=production
```

## API

截图服务

```bash
# GET/POST 都可
# content = url
http://localhost:8888/screenshot?content=https://baidu.com&scroll=1&fullPage=1
# content = html 
http://localhost:8888/screenshot?content=<h1>213123</h1>&scroll=1&fullPage=1
```