const express = require("express")
const router = express.Router()
const eventController = require('../controller/eventController')

router.get("/getAllEvents", eventController.getAllEvents);

router.get('/getEvent/:id', eventController.getEventById);

router.post("/createEvent", eventController.createEvent);

router.put('/updateEvent/:id', eventController.updateEvent);

router.delete('/deleteEvent/:id', eventController.deleteEvent);

module.exports = router