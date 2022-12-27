const router = require('../services/render');

router.post('/sendMail', router);
router.post('/sendAttachmentMail', router);
router.get('/generateToken', router);
router.get('/validateToken', router);
router.post('/loginUser', router);
router.get('/getUsers', router);
router.post('/addUser', router);
router.get('/getUser/:id', router);
router.patch('/saveUser/:id', router);
router.delete('deleteUser/:id', router);

module.exports = router;