const imageModel = require('../model/imageModel');
const fs = require('fs')
const asyncHandler = require("express-async-handler");

exports.uploadImage = asyncHandler(async (req, res) => {
    try {
        if (req.file) {
            const newImage = await imageModel.create({
                uploadedBy: req.body.uploadedBy,
                eventName: req.body.eventName,
                imageName: req.file.filename,
                image: {
                    data: fs.readFileSync("uploads/" + req.file.filename).toString('base64'),
                    contentType: "image/png"
                }
            });

            if (newImage) {
                res.status(201).json({
                    message: "Image uploaded successfully!",
                    imageUploaded: {
                        _id: newImage._id,
                        eventName: newImage.eventName,
                        imageName: newImage.imageName,
                        image: newImage.image,
                        uploadedBy: newImage.uploadedBy
                    }
                })
            } else {
                res.status(400)
                throw new Error('Error Occured!');
            }
        } else {
            res.status(400)
            throw new Error('Error Occured!');
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.uploadImages = asyncHandler(async (req, res) => {
    try {
        const imageArray = req.files;
        if (imageArray.length <= 0) {
            return res
                .status(400)
                .send({ message: "You must select at least 1 file." });
        } else if (imageArray.length > 10) {
            return res
                .status(400)
                .send({ message: "Too many files to upload." });
        } else {
            imageArray.map((file) => {
                imageModel.create({
                    uploadedBy: req.body.uploadedBy,
                    eventName: req.body.eventName,
                    imageName: file.filename,
                    image: {
                        data: fs.readFileSync("uploads/" + file.filename),
                        contentType: "image/png"
                    }
                });
            })
            res.status(201).json({
                message: "Images uploaded successfully!"
            })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.getImages = asyncHandler(async (req, res) => {
    try {
        const eventName = req.params.eventName;
        const data = await imageModel.find({ eventName: eventName });
        if (!data) {
            res.send({ message: 'Data Not Found' })
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.getImageById = asyncHandler(async (req, res) => {
    try {
        const data = await imageModel.findById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.updateImageDetails = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const resultData = await imageModel.findByIdAndUpdate(
            id, updatedData, options
        )

        if (resultData) {
            res.send(resultData);
        } else {
            res.status(400)
            throw new Error('Event not existed');
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});

exports.deleteImage = asyncHandler(async (req, res) => {
    try {
        const data = await imageModel.findByIdAndRemove(req.params.id)

        if (data) {
            res.status(200).json({
                message: 'Document has been deleted...',
                data: data
            })
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});