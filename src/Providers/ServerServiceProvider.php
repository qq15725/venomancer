<?php

namespace Wxm\Venomancer\Providers;

use Wxm\Venomancer\Server;
use Pimple\Container;
use Pimple\ServiceProviderInterface;

class ServerServiceProvider implements ServiceProviderInterface
{
    public function register(Container $pimple)
    {
        $pimple['server'] = function ($app) {
            return new Server($app);
        };
    }
}