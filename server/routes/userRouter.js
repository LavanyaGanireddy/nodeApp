const router = require('../services/userService');

router.post('/sendMail', router);
router.post('/sendAttachmentMail', router);
router.get('/generateToken', router);
router.get('/validateToken', router);
router.get('/generateOtp', router);
router.post('/validateOtp', router);
router.post('/loginUser', router);
// router.get('/logoutUser', router);
router.get('/getAllUsers', router);
router.post('/createUser', router);
router.get('/getUser/:id', router);
router.post('/getUserByEmailId', router);
router.put('/updateUser/:id', router);
router.post('/forgotPassword', router);
router.put('/resetPassword', router);
router.delete('deleteUser/:id', router);

module.exports = router;