const router = require('../services/imageService');

router.get('/getImages', router);
router.get('/getImageById/:id', router);
router.post('/uploadImage', router);
router.post('/uploadImages', router);
router.delete('/deleteImage', router);

module.exports = router;