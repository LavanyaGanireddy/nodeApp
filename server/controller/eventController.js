const eventModel = require('../model/eventModel');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');

exports.getAllEvents = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const data = await eventModel.find();
        if (verified) {
            if (!data) {
                res.send({ message: 'Data Not Found' })
            } else {
                res.send(data);
            }
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.getEventById = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const data = await eventModel.findById(req.params.id);
        if (verified) {
            res.json(data);
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.createEvent = asyncHandler(async (req, res) => {
    try {
        let id;
        const { eventName, organisedBy, location, createdBy, eventDate } = req.body;

        const eventExists = await eventModel.findOne({ eventName });
        if (eventExists) {
            res.status(400)
            throw new Error('Event name: ' + eventName + ' already exists');
        } else {
            const event = await eventModel.create({
                id, eventName, organisedBy, location, createdBy, eventDate
            })

            if (event) {
                res.status(201).json({
                    _id: event._id,
                    id: event.id,
                    eventName: event.eventName,
                    organisedBy: event.organisedBy,
                    location: event.location,
                    eventDate: event.eventDate,
                    createdBy: event.createdBy,
                    createdAt: event.createdAt
                });
            } else {
                res.status(400)
                throw new Error('Error Occured!');
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.updateEvent = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const resultData = await eventModel.findByIdAndUpdate(
            id, updatedData, options
        )

        if (verified) {
            if (resultData) {
                res.send(resultData);
            } else {
                res.status(400)
                throw new Error('Event not existed');
            }
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.deleteEvent = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const id = req.params.id;
        const data = await eventModel.findByIdAndRemove(id)

        if (verified) {
            if (data) {
                res.status(200).json({
                    message: 'Document has been deleted...',
                    data: data
                })
            } else {
                res.status(500).json({ message: error.message })
            }
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});