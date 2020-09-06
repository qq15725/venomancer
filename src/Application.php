<?php

namespace Wxm\Venomancer;

use Wxm\Venomancer\Providers\ClientServiceProvider;
use Wxm\Venomancer\Providers\ServerServiceProvider;

/**
 * Class Application.
 *
 * @property \Wxm\Venomancer\Client $client
 * @property \Wxm\Venomancer\Server $server
 *
 * @method static string screenshot(string $content, bool $fullPage = true, bool $scroll = true, int $scrollDistance = 100, int $scrollInterval = 0)
 */
class Application extends Container
{
    protected $providers = [
        ClientServiceProvider::class,
        ServerServiceProvider::class,
    ];

    public function getConfig()
    {
        $config = parent::getConfig();

        $config['server'] = $config['server'] ?? [];
        $config['server']['port'] = $config['server']['port'] ?? 8882;

        if (!($baseUri = $config['client']['base_uri'] ?? null)) {
            $config['client'] = $config['client'] ?? [];
            $config['client']['base_uri'] = "http://localhost:{$config['server']['port']}";
        }

        return $config;
    }

    public function __call($method, $parameters)
    {
        return $this->client->$method(...$parameters);
    }
}

