<?php

require __DIR__ . '/../vendor/autoload.php';

$app = new \Wxm\Venomancer\Application();

if (!($argv[1] ?? null)) {
    return;
}

$id = $argv[2] ?? null;

switch ($argv[1]) {
    case 'get':
        $res = $app->browser->get();
        break;
    case 'launch':
        $res = $app->browser->launch();
        break;
    case 'close':
        $res = $app->browser->close($id);
        break;
    case 'screenshot':
        $image = $app->browser->screenshot($id, 'https://www.baidu.com');
        file_put_contents('./baidu.png', $image);
        break;
    case 'crawl':
//        $res = $app->browser->crawl($argv[2], 'https://jessiro.tmall.com', [
//            'selector' => 'a[href*="search.htm"]',
//            'attribute' => 'href',
//        ]);

//        $res = $app->browser->crawl($argv[2], 'https://jessiro.tmall.com/search.htm?search=y', [
//            'xpath' => [
//                'url' => '//*[@class="J_TItems"]//dl/dt//@href',
//                'next_url' => '//a[@class="ui-page-s-next"]/@href',
//            ],
//        ]);

        $res = $app->browser->crawl($argv[2], 'https://detail.tmall.com/item.htm?id=641548527159&rn=c6a7895d6996095f1a21b5a02b30da1d&abbucket=3', [
            'xpath' => [
                'url' => '//*[@class="J_TItems"]//dl/dt//@href',
            ],
        ]);
        break;
}

if (isset($res)) {
    echo json_encode($res, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . PHP_EOL;
}
