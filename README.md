# venomancer

## 快速开始

全局安装

```bash
npm install venomancer -g
```

启动服务

```bash
# 开发环境启动
venomancer 

# 开发环境启动（屏蔽部分输出）
venomancer --debug="*,-nodemon*,-puppeteer:protocol*"

# 线上环境启动
venomancer --env=production
```

## API

截图服务

```bash
http://localhost:8888/screenshot?content=https://baidu.com
```