<?php

namespace Wxm\Venomancer\Browser;

use Pimple\Container;
use Pimple\ServiceProviderInterface;

class ServiceProvider implements ServiceProviderInterface
{
    public function register(Container $app)
    {
        $app['browser'] = function ($app) {
            return new Client($app);
        };
    }
}