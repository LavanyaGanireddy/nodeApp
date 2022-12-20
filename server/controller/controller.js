var Userdb = require('../model/model');

// create and save new user
exports.create = (req, res) => {
    // validate the request
    if (!req.body) {
        res.status(400).send({ message: 'Content cannot be empty' });
        return;
    }
    // new user
    const user = new Userdb({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });

    // save user in the database
    user
        .save(user)
        .then((data) => {
            // res.send(data);
            res.redirect(getUser);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occured',
            });
        });
};

// retrieve and return all users/retrieve and return a single user

exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;

        Userdb.findById(id)
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: 'not found user with id ' + id });
                } else {
                    res.send(data);
                }
            })
            .catch((err) => {
                res.status(500).send({ message: 'error retrieving user' });
            });
    } else {
        Userdb.find()
            .then((user) => {
                console.log('user data', user)
                res.send(user);
            })

            .catch((err) => {
                console.log(err)
                res.status(500).send({
                    message: err.message || 'Some error occured',
                });
            });
    }
};