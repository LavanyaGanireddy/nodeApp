const express = require("express")
const router = express.Router()
const userService = require('../controller/controller')

router.post("/sendMail", userService.sendMail);

router.post("/sendAttachmentMail", userService.sendAttachmentMail);

router.get("/generateToken", userService.generateToken);

router.get("/validateToken", userService.validateToken);

router.post("/loginUser", userService.loginUser);

// router.get("/logoutUser", userService.logoutUser);

router.get("/getAllUsers", userService.getAllUsers);

router.get('/getUser/:id', userService.getUserById);

router.post('/getUserByEmailId', userService.getUserByEmailId);

router.post("/createUser", userService.createUser);

router.put('/updateUser/:id', userService.updateUser);

router.put('/forgotPassword/:id', userService.forgotPassword);

router.delete('/deleteUser/:id', userService.deleteUser);

module.exports = router