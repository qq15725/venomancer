'use strict'

async function setPageCookie (page, cookie, domain) {
  await page.setCookie(...cookie.split(';').map(item => {
    const [key, value] = item.split('=')
    return {
      name: key.trim(),
      value: value.trim(),
      domain: domain,
    }
  }))
}

exports.setPageCookie = setPageCookie