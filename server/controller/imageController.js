const imgModel = require('../model/imageModel');
const fs = require('fs')
const asyncHandler = require("express-async-handler");

exports.uploadImage = asyncHandler(async (req, res) => {
    try {
        if (req.file) {
            const newImage = await imgModel.create({
                name: req.file.filename,
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
                        name: newImage.name,
                        image: newImage.image
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
                imgModel.create({
                    name: file.filename,
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
        const data = await imgModel.find();
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
        const data = await imgModel.findById(req.params.id);
        if (data) {
            res.json(data);
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

exports.deleteImage = asyncHandler(async (req, res) => {
    try {
        const data = await imgModel.findByIdAndRemove(req.params.id)

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