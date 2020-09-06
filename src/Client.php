<?php

namespace Wxm\Venomancer;

class Client extends BaseClient
{
    /**
     * @param string $content
     *
     * @param bool $fullPage
     * @param bool $scroll
     * @param int $scrollDistance
     * @param int $scrollInterval
     *
     * @return \Psr\Http\Message\ResponseInterface|string
     */
    public function screenshot(string $content, bool $fullPage = true, bool $scroll = true, int $scrollDistance = 100, int $scrollInterval = 0)
    {
        return $this->httpPostJson('screenshot', [
            'content' => $content,
            'scroll' => $scroll,
            'scrollDistance' => $scrollDistance,
            'scrollInterval' => $scrollInterval,
            'fullPage' => $fullPage
        ]);
    }
}