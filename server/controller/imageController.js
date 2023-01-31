const imgModel = require('../model/imageModel');
const asyncHandler = require("express-async-handler");

exports.uploadImage = asyncHandler(async (req, res) => {
    try {
        if (req.file) {
            const image = req.file.filename;
            const newImage = await imgModel.create({ image: image });

            if (newImage) {
                res.status(201).json({
                    message: "Image uploaded successfully!",
                    imageUploaded: {
                        _id: newImage._id,
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
        console.log(req.file)
        if (req.file) {
            // if (req.files.length <= 0) {
            //     return res
            //         .status(400)
            //         .send({ message: "You must select at least 1 file." });
            // } else if (req.files.length > 10) {
            //     return res
            //         .status(400)
            //         .send({ message: "Too many files to upload." });
            // } else {
            //     const imageList = await imgModel.create(array, (err) => {
            //         if(err){
            //             return res
            //         .status(400)
            //         .send({ error: err });
            //         }

            //         for (var i=1; i<arguments.length; ++i) {
            //             var image = arguments[i];
            //             console.log(image)
            //         }
            //     })
            //     if(imageList){
            //         res.status(201).json({
            //             message: "Image uploaded successfully!"
            //         })
            //     } else{
            //         res.status(400)
            //     throw new Error('Error Occured!');
            //     }                
            // }
            // const image = req.file.filename;
            // const newImage = await imgModel.create({ image: image });

            // if (newImage) {
            //     res.status(201).json({
            //         message: "Image uploaded successfully!",
            //         imageUploaded: {
            //             _id: newImage._id,
            //             image: newImage.image
            //         }
            //     })
            // } else {
            //     res.status(400)
            //     throw new Error('Error Occured!');
            // }
        } else {
            res.status(400)
            throw new Error('Error Occured!');
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
            res.send(`Document has been deleted..`)
        } else {
            res.status(500).json({ message: error.message })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});