const ScreenshotController = require('../controller/screenshot')
const ContentController = require('../controller/content')

module.exports = router => {
  router.get('/content', ContentController.get)
  router.post('/content', ContentController.post)
  router.get('/screenshot', ScreenshotController.get)
  router.post('/screenshot', ScreenshotController.post)
}