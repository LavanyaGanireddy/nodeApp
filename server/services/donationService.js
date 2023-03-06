const express = require("express")
const router = express.Router()
const donationController = require('../controller/donationController');

router.get("/getAllDonations", donationController.getAllDonations);

router.get('/getDonation/:id', donationController.getDonationById);

router.post("/createDonation", donationController.createDonation);

router.put('/updateDonation/:id', donationController.updateDonation);

router.put('/deleteDonation/:id', donationController.deleteDonation);

module.exports = router