const router = require('../services/eventService');

router.get('/getAllEvents', router);
router.get('/getEvent/:id', router);
router.post('/createEvent', router);
router.put('/updateEvent/:id', router);
router.put('/deleteEvent/:id', router);

module.exports = router;