# venomancer

<p>
  <a href="https://github.com/qq15725/venomancer" target="_blank">
    <img alt="Node-Version" src="https://img.shields.io/node/v/venomancer" />
  </a>
  <a href="https://github.com/qq15725/venomancer" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/qq15725/venomancer/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/qq15725/venomancer/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

- php 版
- javascript 版

## php 版

<p>
  <a href="https://github.com/qq15725/venomancer" target="_blank">
    <img alt="Php-Version" src="https://img.shields.io/packagist/php-v/wxm/venomancer.svg" />
  </a>
</p>

安装

```bash
composer require wxm/venomancer

# TODO 待移除
npm install venomancer --save
```

例:

server.php

```php
<?php

require './vendor/autoload.php';

$app = new \Wxm\Venomancer\Application();

$app->server->serve();

// php ./server.php
// 如果不存在 chromium 根据提示下载 chromium 然后编辑配置，没有提示则不用管这部分，然后再次执行启动服务
// vim .env
// CHROMIUM_EXECUTABLE_PATH=这里填可执行地址
```

client.php

```php
<?php

require './vendor/autoload.php';

$app = new \Wxm\Venomancer\Application();

$image = $app->screenshot('http://baidu.com');

file_put_contents('./baidu.png', $image);

// php ./client.php
```

## javascript 版

<p>
  <a href="https://www.npmjs.com/package/venomancer" target="_blank">
    <img alt="Javascript-Version" src="https://img.shields.io/npm/v/venomancer.svg">
  </a>
</p>

### 快速开始


```bash
# 全局安装
npm install venomancer -g

# 启动服务
venomancer --port=8888

# 如果不存在 chromium 根据提示下载 chromium 然后编辑配置，没有提示则不用管这部分，然后再次执行启动服务
vim .env
CHROMIUM_EXECUTABLE_PATH=这里填可执行地址
```

### API

截图服务

```bash
# GET/POST 都可
# content = url
http://localhost:8888/screenshot?content=https://baidu.com&scroll=1&fullPage=1
# content = html 
http://localhost:8888/screenshot?content=<h1>213123</h1>&scroll=1&fullPage=1
```