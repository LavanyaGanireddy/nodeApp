const router = require('../services/render');

router.get('/getUsers', router);
router.post('/addUser', router);
router.get('/getUser/:id', router);
router.get('/saveUser/:id', router);
router.get('deleteUser/:id', router);

module.exports = router;