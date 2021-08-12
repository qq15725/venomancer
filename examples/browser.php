<?php

require __DIR__ . '/../vendor/autoload.php';

$app = new \Wxm\Venomancer\Application();

switch ($argv[1] ?? null) {
    case 'launch':
        $res = $app->client->launchChrome([

        ]);
        break;
}

echo json_encode($res, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . PHP_EOL;
