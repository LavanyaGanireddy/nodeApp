const router = require('../services/donationService');

router.get('/getAllDonations', router);
router.get('/getDonation/:id', router);
router.post('/createDonation', router);
router.put('/updateDonation/:id', router);
router.put('/deleteDonation/:id', router);

module.exports = router;