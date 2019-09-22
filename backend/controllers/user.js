const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Auth = require('../models/auth');
const License = require('../models/license');
const User = require('../models/user');
const Setting = require('../models/setting');

exports.createUser = async(req, res, next) => {
    try {
        const newLicense = new License({
            personId: req.auth.personId,
            licenseKey: (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
        });
        let license = await newLicense.save();
        if (!license) {
            throw new Error('Something went wrong.Cannot save license!');
        }

        const newUser = new User({
            userType: 'doctor',
            personId: req.auth.personId,
            licenseId: license._id
        });
        let user = await newUser.save();
        if (!user) {
            throw new Error('Something went wrong.Cannot save user!');
        }

        const newSetting = new Setting({
            licenseId: license._id,
            clinicName: req.body.clinicname,
            clinicOwner: req.person.firstname + ', ' + req.person.lastname
        });
        let setting = await newSetting.save();

        res.status(201).json({
            message: 'User created!',
            result: setting
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.userLogin = async(req, res, next) => {
    try {
        let auth = await Auth.findOne({ email: req.body.email }).populate('personId');
        if (!auth) {
            throw new Error('Something went wrong. Your email is not listed!');
        }
        let decrypted = await bcrypt.compare(req.body.password, auth.password);
        if (!decrypted) {
            throw new Error('Something went wrong. Incorrect password!');
        }

        let user = await User.findOne({ personId: auth.personId }).populate('licenseId');

        let token = await jwt.sign({
                email: auth.email,
                userId: auth.personId._id,
                licenseId: user.licenseId._id
            },
            process.env.JWT_KEY, { expiresIn: '12h' }
        );
        res.status(200).json({
            token: token,
            expiresIn: 43200, // 3600,
            userId: auth.personId._id, // fetchedUser._id,
            userEmail: auth.email,
            licenseId: user.licenseId._id
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.create = async(req, res, next) => {
    try {
        const newPerson = new Person({
            _id: req.auth.personId,
            midlename: req.body.midlename,
            contact: req.body.contact,
            gender: req.body.gender,
            birthdate: req.body.birthdate
        });
        addressData = req.body.address;
        for (let index = 0; index < addressData.length; index++) {
            newPerson.address.push(addressData[index]);
        }
        let updatedPerson = await Person.updateOne({ _id: req.person._id }, newPerson);
        if (!updatedPerson) {
            throw new Error('Something went wrong.Cannot update person!');
        }

        const newUser = new User({
            userType: 'Patient',
            personId: req.auth.personId,
            licenseId: req.body.licenseId,
            metaData: req.body.meta
        });
        let user = await newUser.save();

        if (!user) {
            throw new Error('Something went wrong.Cannot save user!');
        }

        res.status(200).json({
            message: 'User added successfully',
            users: {
                ...user,
                id: user._id,
            }
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        const newUser = new User({
            _id: req.body.id
        });
        metaData = req.body.meta;
        for (let index = 0; index < metaData.length; index++) {
            newUser.metaData.push(metaData[index]);
        }
        let updatedUser = await User.updateOne({ _id: req.body.id }, newUser);
        if (!updatedUser) {
            throw new Error('Something went wrong.Cannot update user!');
        }

        res.status(200).json({ message: 'Update successful!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const query = User.find({
            'licenseId': req.query.licenseId
        });

        if (req.query.usertype) {
            query.where('userType', req.query.usertype);
        }
        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        let users = await query.populate('personId').exec();
        let count = await User.countDocuments();

        res.status(200).json({
            message: 'Patient fetched successfully!',
            users: users,
            counts: count
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        let user = await User.findOne({personId: req.params.userId}).populate('personId').exec();
        let auth = await Auth.findOne({personId: req.params.userId}).exec();
        if (!user) {
            throw new Error('Something went wrong. Cannot find patient id !' + req.params.userId);
        }

        res.status(200).json({
            userId: user._id,
            meta: user.metaData,
            personId: user.personId._id,
            firstname: user.personId.firstname,
            lastname: user.personId.lastname,
            midlename: user.personId.midlename,
            contact: user.personId.contact,
            gender: user.personId.gender,
            birthdate: user.personId.birthdate,
            addresses: user.personId.address,
            created: user.personId.created,
            email: auth.email
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        let user = await User.findById(req.params.userId).exec();
        if (user.licenseId != req.userData.licenseId) {
            throw new Error('Not Authorized!');
        }
        await Auth.deleteOne({ personId: user.personId });
        await Person.deleteOne({ _id: user.personId });
        await User.deleteOne({ _id: user._id });

        res.status(200).json({
            message: 'Deletion successfull!'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
