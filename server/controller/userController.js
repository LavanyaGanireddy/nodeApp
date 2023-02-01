const Model = require('../model/userModel');
const asyncHandler = require("express-async-handler");
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const generateOTP = require('../utils/generateOTP');
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

exports.generateOtp = asyncHandler(async (req, res) => {
    try {
        const otpGenerated = generateOTP();
        res.send({
            otp: otpGenerated
        });
    } catch (error) {
        return res.status(401).send(error);
    }
});

exports.validateOtp = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await Model.findOne({ email });
        if (!user) {
            return res.status(400).send([false, 'User not found']);
        }
        if (user && user.otp !== otp) {
            return res.status(400).send([false, 'Invalid OTP']);
        } else {
            return res.status(201).send([true, 'Valid OTP']);
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
                token: token,
                role: user.role
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
    } catch (error) {
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
    } catch (error) {
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
                    subject: 'Welcome to Social Site!',
                    text: 'This is a system generated registered mail.'
                }
                const { to, subject, text } = request;
                const mailData = {
                    from: process.env.SENDER_MAIL,
                    to: to,
                    subject: subject,
                    text: text,
                    html: `
                        <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
                            <h2>Hi ${firstName},</h2>
                            <p>Thank you for registering.</p>
                            <p>If you have any queries, you can write to us at ${process.env.MAIL_EMAIL}</p>                            
                        </div>`,
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
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.forgotPassword = asyncHandler(async (req, res) => {
    try {
        const userExists = await Model.findOne({ email: req.body.to });
        console.log('user', userExists)
        const validEmail = await isEmailValid(req.body.to);
        const otpGenerated = generateOTP();
        const updatedData = { isUpdated: false, otp: otpGenerated };
        const options = { new: true };

        if (validEmail.valid && userExists) {
            const resultData = await Model.findByIdAndUpdate(
                userExists._id, updatedData, options
            )
            if (resultData) {
                const request = {
                    to: req.body.to,
                    subject: 'Your Password Reset Token (valid for 10min)'
                }
                const { to, subject } = request;
                const mailData = {
                    from: process.env.SENDER_MAIL,
                    to: to,
                    subject: subject,
                    text: '',
                    html: `
                        <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
                            <h2>Hi ${userExists.firstName},</h2>
                            <p>Forgot Password? Please enter your OTP to get started.</p>
                            <h1 style="font-size: 40px; letter-spacing: 2px;">${otpGenerated}</h1>
                            <p>Please verify your OTP by clicking the below button and reset your password.</p>
                            <a href="http://localhost:3000/verifyOtp" 
                               style="background-color: #3f51b5;
                                      border: none;
                                      color: white;
                                      padding: 0.5rem;
                                      text-align: center;
                                      text-decoration: none;
                                      display: inline-block;
                                      font-size: 16px;
                                      cursor: pointer;">Verify OTP</a>
                            <p>If you did not do this request, please ignore this email and your password will remain unchanged.</p>
                        </div>`,
                };

                transporter.sendMail(mailData, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                });

                res.status(201).json({
                    message: "OTP sent to user" + to,
                    otp: otpGenerated
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
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.updateOtp = asyncHandler(async (req, res) => {
    try {
        const userExists = await Model.findOne({ email: req.body.email });
        const validEmail = await isEmailValid(req.body.email);
        console.log('user', userExists)

        const updatedData = { isUpdated: false, otp: '' };
        const options = { new: true };

        if (validEmail.valid && userExists) {
            const resultData = await Model.findByIdAndUpdate(
                userExists._id, updatedData, options
            )
            if (resultData) {
                if (resultData) {
                    res.send(resultData);
                } else {
                    res.status(400)
                    throw new Error('User not existed');
                }
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

exports.deleteUser = asyncHandler(async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        const id = req.params.id;

        const updatedData = { isDeleted: true, deletedAt: new Date() };
        const options = { new: true };

        if (verified) {
            const result = await Model.findByIdAndUpdate(
                id, updatedData, options
            )
            res.status(200).json({
                message: `Document with ${result.firstName} has been deleted..`,
                data: result
            })
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});