const express = require("express")
const router = express.Router()
const userController = require('../controller/userController')

router.post("/sendMail", userController.sendMail);

router.post("/sendAttachmentMail", userController.sendAttachmentMail);

router.get("/generateToken", userController.generateToken);

router.get("/validateToken", userController.validateToken);

router.get("/generateOtp", userController.generateOtp);

router.post("/validateOtp", userController.validateOtp);

router.post("/loginUser", userController.loginUser);

// router.get("/logoutUser", userController.logoutUser);

router.get("/getAllUsers", userController.getAllUsers);

router.get('/getUser/:id', userController.getUserById);

router.post('/getUserByEmailId', userController.getUserByEmailId);

router.post("/createUser", userController.createUser);

router.put('/updateUser/:id', userController.updateUser);

router.post('/forgotPassword', userController.forgotPassword);

router.put('/resetPassword', userController.resetPassword);

router.post('/updateOtp', userController.updateOtp);

router.put('/deleteUser/:id', userController.deleteUser);

module.exports = router