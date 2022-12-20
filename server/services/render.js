const express = require("express")
const router = express.Router()
const Model = require('../model/model');

router.get("/getUsers", async (req, res) => {
    try {
        const data = await Model.find();
        if (!data) {
            res.send({ message: 'Data Not Found' })
        } else {
            res.send(data);
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/getUser/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post("/addUser", async (req, res) => {
    const data = new Model({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    })
    try {
        await data.save();
        res.send(data)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.patch('/saveUser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.firstName} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router