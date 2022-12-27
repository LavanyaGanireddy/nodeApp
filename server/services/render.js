const express = require("express")
const router = express.Router()
const userService = require('../controller/controller')

router.post("/sendMail", userService.sendMail);

router.post("/sendAttachmentMail", userService.sendAttachmentMail);

router.get("/generateToken", userService.generateToken);

router.get("/validateToken", userService.validateToken);

router.post("/loginUser", userService.loginUser);

router.get("/getUsers", userService.getAllUsers);

router.get('/getUser/:id', userService.getUserById);

router.post("/createUser", userService.createUser);

router.patch('/updateUser/:id', userService.updateUser);

router.delete('/deleteUser/:id', userService.deleteUser);

module.exports = router