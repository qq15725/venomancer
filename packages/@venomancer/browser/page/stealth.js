module.exports = function () {
  Object.defineProperty(navigator, 'webdriver', {
    get: () => false
  })

  window.chrome = {
    app: {
      InstallState: 'hehe',
      RunningState: 'haha',
      getDetails: 'xixi',
      getIsInstalled: 'ohno',
    },
    csi: function () {
    },
    loadTimes: function () {
    },
    runtime: function () {
    }
  }

  Object.defineProperty(navigator, 'userAgent', {
    get: () => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36'
  })

  Object.defineProperty(navigator, 'plugins', {
    get: () => [
      {
        0: {
          type: 'application/x-google-chrome-pdf',
          suffixes: 'pdf',
          description: 'Portable Document Format',
          enabledPlugin: Plugin,
        },
        description: 'Portable Document Format',
        filename: 'internal-pdf-viewer',
        length: 1,
        name: 'Chrome PDF Plugin',
      },
      {
        0: {
          type: 'application/pdf',
          suffixes: 'pdf',
          description: '',
          enabledPlugin: Plugin,
        },
        description: '',
        filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
        length: 1,
        name: 'Chrome PDF Viewer',
      },
      {
        0: {
          type: 'application/x-nacl',
          suffixes: '',
          description: 'Native Client Executable',
          enabledPlugin: Plugin,
        },
        1: {
          type: 'application/x-pnacl',
          suffixes: '',
          description: 'Portable Native Client Executable',
          enabledPlugin: Plugin,
        },
        description: '',
        filename: 'internal-nacl-plugin',
        length: 2,
        name: 'Native Client',
      },
    ],
  })

  Object.defineProperty(navigator, 'languages', {
    get: () => ['zh-CN', 'zh', 'en'],
  })

  const originalQuery = window.navigator.permissions.query
  window.navigator.permissions.query = (parameters) =>
    parameters.name === 'notifications'
      ? Promise.resolve({ state: Notification.permission })
      : originalQuery(parameters)

  const getParameter = WebGLRenderingContext.getParameter
  WebGLRenderingContext.prototype.getParameter = function (parameter) {
    if (parameter === 37445) {
      return 'Intel Inc.'
    }
    if (parameter === 37446) {
      return 'Intel(R) Iris(TM) Graphics 6100'
    }
    return getParameter(parameter)
  }
}