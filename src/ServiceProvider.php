<?php

namespace Wxm\Venomancer;

use Pimple\Container;
use Pimple\ServiceProviderInterface;

class ServiceProvider implements ServiceProviderInterface
{
    public function register(Container $pimple)
    {
        $pimple['client'] = function ($app) {
            return new Client($app);
        };

        $pimple['server'] = function ($app) {
            return new Server($app);
        };
    }
}