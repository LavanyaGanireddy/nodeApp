const eventModel = require('../model/eventModel');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const emailValidator = require('deep-email-validator');

async function isEmailValid(email) {
    return emailValidator.validate(email)
}

const MAIL_SETTINGS = {
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'lavanyasrinivassalapu@gmail.com',
        pass: 'sksbmpcnhiwfghsi',
    },
    secure: true,
}

const transporter = nodemailer.createTransport(MAIL_SETTINGS);

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
        const { title, organisedBy, location, createdBy, startDate } = req.body;

        const eventExists = await eventModel.findOne({ title });
        if (eventExists) {
            res.status(400)
            throw new Error('Event name: ' + title + ' already exists');
        }

        const event = await eventModel.create({
            id, title, organisedBy, location, createdBy, startDate
        })

        if (event) {
            const date = new Date(startDate);
            const newDate = new Date();

            if (date.getTime() >= newDate.getTime()) {
                const getDate = date.getDate();
                const getMonth = date.getMonth() + 1;
                const getDay = date.getDay() === 0 ? date.getDay() : date.getDay() - 1;

                const scheduleDate = `15 14 ${getDate} ${getMonth} ${getDay}`;

                cron.schedule(scheduleDate, function () {
                    const request = {
                        to: 'kumarsrinivas91@gmail.com',
                        subject: `${title} Event Reminder Email!!!`,
                        text: `${title} Event Reminder Email!!!`
                    }
                    const { to, subject, text } = request;
                    const mailData = {
                        from: process.env.SENDER_MAIL,
                        to: to,
                        subject: subject,
                        text: text,
                        html: `
                            <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
                               <h1>${title} Event Scheduled by ${createdBy} on ${startDate}</h1>
                               <h2>Event Organised by ${organisedBy} at ${location}</h2>
                               <p>Participate in the event and do the needful</p>                               
                            </div>
                            <h5>Thanks & Regards</h5>
                            <h4>Lavanya Salapu(Event Organiser)</h4>
                            `,
                    };

                    transporter.sendMail(mailData, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                    });
                });
            }

            res.status(201).json({
                _id: event._id,
                id: event.id,
                title: event.title,
                organisedBy: event.organisedBy,
                location: event.location,
                startDate: event.startDate,
                createdBy: event.createdBy,
                createdAt: event.createdAt
            });
        } else {
            res.status(400)
            throw new Error('Error Occured!');
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

        const updatedData = { isDeleted: true, deletedAt: new Date(), deletedBy: req.body.deletedBy };
        const options = { new: true };

        if (verified) {
            const data = await eventModel.findByIdAndUpdate(
                id, updatedData, options
            )
            if (data) {
                res.status(200).json({
                    message: `Document with ${data.title} has been deleted...`,
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