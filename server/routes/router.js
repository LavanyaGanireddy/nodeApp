const router = require('../services/render');

router.post('/sendMail', router);
router.post('/sendAttachmentMail', router);
router.get('/generateToken', router);
router.get('/validateToken', router);
router.post('/loginUser', router);
// router.get('/logoutUser', router);
router.get('/getAllUsers', router);
router.post('/addUser', router);
router.get('/getUser/:id', router);
router.post('/getUserByEmailId', router);
router.patch('/saveUser/:id', router);
router.delete('deleteUser/:id', router);

module.exports = router;