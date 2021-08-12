<?php

require __DIR__ . '/../vendor/autoload.php';

$app = new \Wxm\Venomancer\Application();

$image = $app->client->screenshot('https://www.baidu.com');

file_put_contents('./baidu.png', $image);
