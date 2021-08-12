<?php

namespace Wxm\Venomancer;

use SDK\Kernel\BaseClient;

class Client extends BaseClient
{
    /**
     * 浏览器截图
     *
     * @param string $content
     * @param array $optional
     *
     * @return string
     */
    public function screenshot(string $content, array $optional = [])
    {
        $optional += [
            'content' => $content,
            'scroll' => true,
            'scrollDistance' => 100,
            'scrollInterval' => 0,
            'fullPage' => true,
        ];

        return $this
            ->requestRaw('screenshot', 'POST', [
                'json' => $optional,
            ])
            ->getBodyContents();
    }
}