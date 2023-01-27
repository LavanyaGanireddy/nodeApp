const Model = require('../model/userModel');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
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

exports.sendMail = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const { to, subject, text } = req.body;
        const mailData = {
            from: process.env.SENDER_MAIL,
            to: to,
            subject: subject,
            text: text,
            html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
        };

        if (verified) {
            transporter.sendMail(mailData, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.status(200).send({ message: "Mail sent to " + to, message_id: info.messageId });
            });
        } else {
            return res.status(401).send(error);
        }
    } catch (error) {
        return res.status(401).send(error);
    }
});

exports.sendAttachmentMail = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const { to, subject, text } = req.body;
        const mailData = {
            from: process.env.SENDER_MAIL,
            to: to,
            subject: subject,
            text: text,
            html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
            attachments: [
                {
                    filename: 'sorry.jpg',
                    path: 'public/images/sorry.jpg'
                }
            ]
        };

        if (verified) {
            transporter.sendMail(mailData, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                res.status(200).send({ message: "Mail sent to " + to, message_id: info.messageId });
            });
        } else {
            return res.status(401).send(error);
        }
    } catch (error) {
        return res.status(401).send(error);
    }
});

exports.generateToken = asyncHandler(async (req, res) => {
    try {
        const user = { email: 'testuser@gmail.com', password: 'test' }
        const token = generateToken(user);
        res.send({
            token: token
        });
    } catch (error) {
        return res.status(401).send(error);
    }
});

exports.validateToken = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (verified) {
            return res.send("Successfully Verified!!!")
        } else {
            return res.status(401).send(error);
        }
    } catch (error) {
        return res.status(401).send(error);
    }
});

exports.loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Model.findOne({ email });

        const token = generateToken({ email: user.email, password: user.password });

        if (user && (await user.matchPassword(password))) {
            res.send({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                token: token
            })
        } else {
            res.status(400)
            throw new Error('Invalid Email or Password!');
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

// exports.logoutUser = asyncHandler(async (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             return console.log(err);
//         }
//         res.redirect('/');
//     });
// });

exports.getAllUsers = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const data = await Model.find();
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

exports.getUserById = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const data = await Model.findById(req.params.id);
        if (verified) {
            res.json(data);
        } else {
            res.status(500).json({ message: error.message })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.getUserByEmailId = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const data = await Model.findOne({ email: req.body.email });
        if (verified) {
            res.json(data);
        } else {
            res.status(500).json({ message: error.message })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.createUser = asyncHandler(async (req, res) => {
    try {
        let id;
        const { firstName, lastName, email, password } = req.body;
        let createdBy = req.body.firstName;

        const userExists = await Model.findOne({ email });
        if (userExists) {
            res.status(400)
            throw new Error('User with email: ' + email + ' already exists');
        }

        const validEmail = await isEmailValid(email);

        if (validEmail.valid) {
            const user = await Model.create({
                id, firstName, lastName, email, password, createdBy
            })

            if (user) {
                const request = {
                    to: email,
                    subject: 'Register Mail',
                    text: 'This is a system generated registered mail.'
                }
                const { to, subject, text } = request;
                const mailData = {
                    from: process.env.SENDER_MAIL,
                    to: to,
                    subject: subject,
                    text: text,
                    html: '<b>You have registered successfully </b><br> Welcome to our website Helping Hands.<br/>',
                };

                transporter.sendMail(mailData, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                });
                res.status(201).json({
                    _id: user._id,
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    password: user.password,
                    message: "Mail sent to " + to,
                    createdBy: user.firstName,
                    createdAt: user.createdAt
                })
            } else {
                res.status(400)
                throw new Error('Error Occured!');
            }
        } else {
            res.status(400)
            throw new Error('This mail address: ' + email + ' doesn\'t exist');
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.updateUser = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const resultData = await Model.findByIdAndUpdate(
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
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.forgotPassword = asyncHandler(async (req, res) => {
    try {
        const userExists = await Model.findOne({ email: req.body.to });
        const validEmail = await isEmailValid(req.body.to);

        console.log(userExists)

        if (validEmail.valid) {
            if (userExists) {
                const request = {
                    to: req.body.to,
                    subject: 'Your Password Reset Token (valid for 10min)'
                }
                const { to, subject } = request;
                const mailData = {
                    from: process.env.SENDER_MAIL,
                    to: to,
                    subject: subject,
                    text: `
                    Hi ${userExists.firstName},
                    Forgot Password? Here is a Password Reset Link. Please enter a New Password and Confirm Password through the link. 
                    http://localhost:3000/resetPassword
                    If you did not request this, please ignore this email and your password will remain unchanged`,
                };

                transporter.sendMail(mailData, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                });

                res.status(201).json({
                    message: "Password Reset mail sent to " + to
                })
            } else {
                res.status(400)
                throw new Error('Error Occured!');
            }
        } else {
            res.status(400)
            throw new Error('This mail address: ' + email + ' doesn\'t exist');
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.resetPassword = asyncHandler(async (req, res) => {
    try {
        const userExists = await Model.findOne({ email: req.body.email });
        const validEmail = await isEmailValid(req.body.email);

        const updatedData = { isUpdated: true, updatedBy: req.body.updatedBy, password: await userExists.updatePassword(req.body.password) };
        const options = { new: true };

        const resultData = await Model.findByIdAndUpdate(
            userExists._id, updatedData, options
        )

        if (validEmail.valid) {
            if (resultData) {
                const request = {
                    to: req.body.email,
                    subject: 'Your Password Reset is successful'
                }

                const { to, subject } = request;
                const mailData = {
                    from: process.env.SENDER_MAIL,
                    to: to,
                    subject: subject,
                    text: `
                    Hi ${userExists.firstName},
                    Your Password Reset is successful.
                    Please SignIn here: http://localhost:3000`,
                };

                transporter.sendMail(mailData, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                });

                res.status(201).json({
                    message: "Password Reset Successful!!!"
                })
            } else {
                res.status(400)
                throw new Error('User not existed');
            }
        } else {
            res.status(400)
            throw new Error('This mail address: ' + email + ' doesn\'t exist');
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.deleteUser = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const id = req.params.id;
        const userExists = await Model.findById(id);

        const updatedData = { isDeleted: true, deletedAt: new Date() };
        const options = { new: true };

        if (verified) {
            const result = await Model.findByIdAndUpdate(
                id, updatedData, options
            )

            res.send(`Document with ${result.firstName} has been deleted..`)
        } else {
            res.status(500).json({ message: error.message })
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});