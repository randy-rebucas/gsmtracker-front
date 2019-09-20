const Person = require('../models/person');
const Auth = require('../models/auth');
const User = require('../models/user');
const Patient = require('../models/patient');

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
            userType: 'patient',
            personId: req.auth.personId,
            licenseId: req.body.licenseId,
            metaData: req.body.meta
        });
        let user = await newUser.save();

        if (!user) {
            throw new Error('Something went wrong.Cannot save user!');
        }

        res.status(200).json({
            message: 'Patient added successfully',
            patients: {
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
/**
 * tobe transfer in network
 */
exports.search = (req, res, next) => {
    const patientQuery = User.find({
        'licenseId': req.query.licenseId
    });
    patientQuery
        .populate('personId')
        .where('userType', 'patient')
        .then(documents => {
            fetchedPatients = documents;
            return Patient.countDocuments();
        })
        .then(
            count => {
                const result = [];
                fetchedPatients.forEach(element => {
                    let fullname = element.personId.firstname + ', ' + element.personId.lastname;
                    result.push({ id: element.personId._id, name: fullname });
                });
                res.status(200).json({
                    total: count,
                    results: result
                });
            }
        )
        .catch(
            error => {
                res.status(500).json({
                    message: error.message
                });
            }
        );
}

exports.getAll = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const patientQuery = User.find({ 'licenseId': req.query.licenseId });

        if (pageSize && currentPage) {
            patientQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        let patients = await patientQuery.populate('personId').where('userType', 'patient').exec();
        let count = await User.countDocuments({ 'userType': 'patient' });

        res.status(200).json({
            message: 'Patient fetched successfully!',
            patients: patients,
            maxPatients: count
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        let user = await User.findById(req.params.patientId).populate('personId').exec();
        if (!user) {
            throw new Error('Something went wrong. Cannot find patient id !' + req.params.patientId);
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
            created: user.personId.created
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        let user = await User.findById(req.params.patientId).exec();
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