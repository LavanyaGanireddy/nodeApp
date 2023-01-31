const express = require("express")
const router = express.Router()
const imageController = require('../controller/imageController');
const uploadFile = require("../middlewares/imageMiddleware");

router.get("/getImages", imageController.getImages);

router.get("/getImageById/:id", imageController.getImageById);

router.post("/uploadImage", uploadFile.single('image'), imageController.uploadImage);

router.post("/uploadImages", uploadFile.array('images', 10), imageController.uploadImages);

router.delete("/deleteImage/:id", imageController.deleteImage);

module.exports = router