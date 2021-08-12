<?php

namespace Wxm\Venomancer;

use SDK\Kernel\ServiceContainer;

/**
 * Class Application.
 *
 * @property \Wxm\Venomancer\Server $server
 * @property \Wxm\Venomancer\Client $client
 * @property \Wxm\Venomancer\Browser\Client $browser
 */
class Application extends ServiceContainer
{
    protected $providers = [
        ServiceProvider::class,
        Browser\ServiceProvider::class,
    ];

    protected $defaultConfig = [
        'server' => [
            'port' => 8888,
        ],
        'http' => [
            'base_uri' => 'http://localhost:8888',
        ],
    ];
}

