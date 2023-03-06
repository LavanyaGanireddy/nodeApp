const donationModel = require('../model/donationModel');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
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
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
}

const transporter = nodemailer.createTransport(MAIL_SETTINGS);

exports.getAllDonations = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const data = await donationModel.find();
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

exports.getDonationById = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const data = await donationModel.findById(req.params.id);
        if (verified) {
            res.json(data);
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.createDonation = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        let id;
        const { email, donar, amount, donationType, date } = req.body;
        let createdBy = req.body.donar;

        if (verified) {
            const validEmail = await isEmailValid(email);

            if (validEmail.valid) {
                const donation = await donationModel.create({
                    id, email, donar, amount, donationType, date, createdBy
                })

                if (donation) {
                    const request = {
                        to: email,
                        subject: 'Donation information!!!',
                        text: 'This is a system generated donation information mail.'
                    }
                    const { to, subject, text } = request;
                    const mailData = {
                        from: process.env.SENDER_MAIL,
                        to: to,
                        subject: subject,
                        text: text,
                        html: `
                        <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
                            <h2>Hi ${donar},</h2>
                            <p>Thank you for the donation.</p>
                            <p>Will reach out to you about the event details</p>
                            <p>If you have any queries, you can write to us at ${process.env.MAIL_EMAIL}</p>                            
                        </div>`,
                    };

                    transporter.sendMail(mailData, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                    });
                    res.status(201).json({
                        _id: donation._id,
                        id: donation.id,
                        email: donation.email,
                        donar: donation.donar,
                        amount: donation.amount,
                        donationType: donation.donationType,
                        date: donation.date,
                        createdBy: donation.donar,
                        createdAt: donation.createdAt
                    })
                } else {
                    res.status(400)
                    throw new Error('Error Occured!');
                }
            } else {
                res.status(400)
                throw new Error('This mail address: ' + email + ' doesn\'t exist');
            }
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.updateDonation = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const resultData = await donationModel.findByIdAndUpdate(
            id, updatedData, options
        )

        if (verified) {
            if (resultData) {
                res.send(resultData);
            } else {
                res.status(400)
                throw new Error('User not existed');
            }
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.deleteDonation = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const id = req.params.id;

        const updatedData = { isDeleted: true, deletedAt: new Date(), deletedBy: req.body.deletedBy };
        const options = { new: true };

        if (verified) {
            const result = await donationModel.findByIdAndUpdate(
                id, updatedData, options
            )
            res.status(200).json({
                message: `Document with ${result.donar} has been deleted..`,
                data: result
            })
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});