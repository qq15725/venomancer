<?php

namespace Wxm\Venomancer\Screenshot;

use SDK\Kernel\BaseClient;

class Client extends BaseClient
{
    /**
     * 获取浏览器列表
     *
     * @return array
     */
    public function get()
    {
        return $this->httpGet('/browsers');
    }

    /**
     * 启动浏览器
     *
     * @param array $optional
     *
     * @return array
     */
    public function launch(array $optional = [])
    {
        return $this->httpPostJson('/browsers', $optional);
    }

    /**
     * 关闭浏览器
     *
     * @param $id
     *
     * @return array
     */
    public function close($id)
    {
        return $this->httpDelete("/browsers/{$id}");
    }

    /**
     * 设置浏览器 cookie
     *
     * @param $id
     *
     * @return array
     */
    public function setCookie($id, $cookie, $domain)
    {
        return $this->httpPostJson("/browsers/{$id}/cookies", [
            'cookie' => $cookie,
            'domain' => $domain,
        ]);
    }

    /**
     * 浏览器截图
     *
     * @param int $id
     * @param string $content
     * @param array $optional
     *
     * @return string
     */
    public function screenshot(int $id, string $content, array $optional = [])
    {
        $optional += [
            'content' => $content,
            'scroll' => true,
            'scrollDistance' => 100,
            'scrollInterval' => 0,
            'fullPage' => true,
        ];

        return $this
            ->requestRaw("/browsers/{$id}/screenshot", 'POST', [
                'json' => $optional,
            ])
            ->getBodyContents();
    }

    /**
     * @param int $id
     * @param string $url
     * @param array $optional
     *
     * @return array
     */
    public function crawl(int $id, string $url, array $optional = [])
    {
        $optional += [
            'url' => $url,
            'selector' => null,
            'attribute' => null,
        ];

        return $this->httpPostJson("/browsers/{$id}/crawl", $optional);
    }
}