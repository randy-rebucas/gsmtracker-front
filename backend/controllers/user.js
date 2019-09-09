const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ip = require("ip");

const Person = require('../models/person');
const User = require('../models/user');
const Setting = require('../models/setting');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const person = new Person({
                firstname: req.body.firstname,
                lastname: req.body.lastname
            });
            person.save()
                .then(personResult => {
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                        lastIp: ip.address(),
                        personId: personResult._id
                    });
                    user.save()
                        .then(userResult => {
                            const setting = new Setting({
                                userId: userResult._id,
                                clinicName: req.body.clinicname,
                                clinicOwner: personResult.firstname + ', ' + personResult.lastname
                            });
                            setting.save().then(createdSetting => {
                                    res.status(201).json({
                                        message: 'User created!',
                                        result: userResult
                                    });
                                })
                                .catch(error => {
                                    res.status(500).json({
                                        message: error.message
                                    });
                                });
                        })
                        .catch(err => {
                            res.status(500).json({
                                message: err.message
                            });
                        });
                })
                .catch(err => {
                    res.status(500).json({
                        message: err.message
                    });
                });
        });
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .populate('personId')
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed no result'
                });
            }
            const token = jwt.sign({ email: fetchedUser.email, license: fetchedUser.subscriptionType, userId: fetchedUser._id },
                process.env.JWT_KEY, { expiresIn: '12h' }
            );
            res.status(200).json({
                token: token,
                expiresIn: 43200, // 3600,
                userId: fetchedUser._id, // fetchedUser._id,
                userEmail: fetchedUser.email,
                userSubscriptionType: fetchedUser.subscriptionType
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: err.message // 'Invalid authentication credentials!'
            });
        });
}
