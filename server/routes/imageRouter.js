const router = require('../services/imageService');

router.get('/getImages/:eventName', router);
router.get('/getImageById/:id', router);
router.post('/uploadImage', router);
router.post('/uploadImages', router);
router.put('/updateImageDetails/:id', router);
router.delete('/deleteImage/:id', router);

module.exports = router;