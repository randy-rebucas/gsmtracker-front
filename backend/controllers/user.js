const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ip = require("ip");
const sharp = require('sharp');
const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;

const Auth = require('../models/auth');
const License = require('../models/license');
const User = require('../models/user');
const MyUser = require('../models/myuser');
const Person = require('../models/person');
const Setting = require('../models/setting');
const Type = require('../models/type');

exports.createUser = async(req, res, next) => {
    try {

        /**
         * check for existing email
         */
        let authCheck = await Auth.findOne({ email: req.body.email });
        if (authCheck) {
            throw new Error('Something went wrong. Email is in used!');
        }

        /**
         * Set common entities on people collection
         */
        const newPerson = new Person({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        let person = await newPerson.save();
        if (!person) {
          throw new Error('Something went wrong. Cannot save people collection!');
        }

        /**
         * Set extended entities from poeple to users collection
         */
        const newUser = new User({
          personId: person._id
        });
        let user = await newUser.save();
        if (!user) {
            throw new Error('Something went wrong.Cannot save user collection!');
        }

        /**
         * Set login credentials in auth collection
         */
        let hash = await bcrypt.hash(req.body.password, 10);
        const authCredentials = new Auth({
            email: req.body.email,
            password: hash,
            userId: user._id
        });
        let auth = await authCredentials.save();
        if (!auth) {
          throw new Error('Something went wrong.Cannot save auth collection!');
        }

        /**
         * Set new license in license collection
         */
        const newLicense = new License({
          userId: user._id,
          licenseKey: (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase()
        });
        let license = await newLicense.save();
        if (!license) {
            throw new Error('Something went wrong.Cannot save license collection!');
        }

        /**
         * Set physicians doc in type collection
         */
        const newType = new Type({
            name: 'Physicians',
            description: 'a person qualified to practice medicine',
            licenseId: license._id,
        });
        let type = await newType.save();
        if (!type) {
          throw new Error('Something went wrong.Cannot save user type collection!');
        }

        /**
         * Set owned user in myusers collection
         */
        const myUser = new MyUser({
          userType: type._id,
          userId: user._id,
          licenseId: license._id
        });
        let myuser = await myUser.save();
        if (!myuser) {
            throw new Error('Something went wrong.Cannot save my user collection!');
        }

        /**
         * Set new patients type doc in Type Collection
         */
        const otherType = new Type({
            name: 'Patients',
            description: 'a person receiving or registered to receive medical treatment.',
            licenseId: license._id,
        });
        await otherType.save();

        /**
         * Set new setting doc in Setting Collection
         */
        const newSetting = new Setting({
          licenseId: license._id,
          clinicName: req.body.clinicname,
          clinicOwner: person.firstname + ', ' + person.lastname
        });
        await newSetting.save();

        res.status(200).json({
            message: 'Registered successfully!'
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.userLogin = async(req, res, next) => {
    try {
      /**
       * Find email on auth collection
       */
        let auth = await Auth.findOne({ email: req.body.email }).populate('userId');
        if (!auth) {
            throw new Error('Something went wrong. Your email is not listed!');
        }
        /**
         * compare password
         */
        let decrypted = await bcrypt.compare(req.body.password, auth.password);
        if (!decrypted) {
            throw new Error('Something went wrong. Incorrect password!');
        }

        let myUser = await MyUser.findOne({ userId: auth.userId });

        let token = await jwt.sign({
                email: auth.email,
                userId: myUser.userId,
                licenseId: myUser.licenseId
            },
            process.env.JWT_KEY, {}
        );

        res.status(200).json({
            token: token,
            userId:  myUser.userId,
            userEmail: auth.email,
            userType: myUser.userType,
            licenseId: myUser.licenseId
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
            _id: req.body.id,
            userType: req.body.userType
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

exports.search = async(req, res, next) => {
    try {
        const query = User.find({ 'licenseId': req.query.licenseId });
        let users = await query.populate('personId').where('userType', 'patient');
        const result = [];
        users.forEach(element => {
            let fullname = element.personId.firstname + ', ' + element.personId.lastname;
            result.push({ id: element.personId._id, name: fullname });
        });

        let count = await User.countDocuments({ 'licenseId': req.query.licenseId, 'userType': 'patient' });

        res.status(200).json({
            total: count,
            results: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getAllGlobal = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const query = User.find().where('userType', 'patient');

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        let users = await query.populate('personId').exec();
        let count = await User.countDocuments();

        res.status(200).json({
            message: 'Users fetched successfully!',
            users: users,
            counts: count
        });

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
        const query = User.find({ 'licenseId': req.query.licenseId });

        if (req.query.usertype != 'all') {
            query.where('userType', req.query.usertype);
        }

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        let users = await query.populate('personId').exec();
        let count = await User.countDocuments({ 'userType': 'patient' });

        res.status(200).json({
            message: 'Users fetched successfully!',
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

        const _u = await MyUser.aggregate([
          {
            $lookup: {
                from: 'users', // other table name
                localField: 'userId', // name of users table field
                foreignField: '_id', // name of userinfo table field
                as: 'users' // alias for userinfo table
            }
          },
          { $unwind: '$users' },
          {
            $lookup: {
                from: 'people', // other table name
                localField: 'users.personId', // name of users table field
                foreignField: '_id', // name of userinfo table field
                as: 'people' // alias for userinfo table
            }
          },
          { $unwind: '$people' },
          {
            $lookup: {
                from: 'auths', // other table name
                localField: 'userId', // name of users table field
                foreignField: 'userId', // name of userinfo table field
                as: 'auths' // alias for userinfo table
            }
          },
          { $unwind: '$auths' },
          { $match: { 'users._id': new ObjectId(req.params.userId) } },
          {
            $project : {
              userType : 1,
              users : 1,
              people : 1,
              'auths.email': 1
            }
          },
          { $sort: { 'people.created': -1 } }
        ]);

        res.status(200).json({
          userId:     _u[0]._id,
          metas:      _u[0].users.metaData,
          firstname:  _u[0].people.firstname,
          lastname:   _u[0].people.lastname,
          midlename:  _u[0].people.midlename,
          contact:    _u[0].people.contact,
          gender:     _u[0].people.gender,
          birthdate:  _u[0].people.birthdate,
          addresses:  _u[0].people.address,
          created:    _u[0].people.created,
          email:      _u[0].auths.email,
          avatar:     _u[0].users.avatarPath,
          userType:   _u[0].userType
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

exports.uploadProfile = async(req, res, next) => {
    try {
        let userPicture = await sharp(req.file.path).resize(200, 200).toBuffer();
        if (!userPicture) {
            throw new Error('Error in updating profile picture!');
        }
        const newUser = new User({
            _id: req.body.userId,
            userType: req.body.userType,
            avatarPath: `data:${req.file.mimetype};base64,${userPicture.toString('base64')}`
        });

        let user = await User.updateOne({ _id: req.params.userId }, newUser);
        if (!user) {
            throw new Error('Error in updating user!');
        }

        res.status(200).json({
            imagePath: newUser.avatarPath,
            message: 'Profile picture updated!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getNewUser = async(req, res, next) => {
    try {
        const today = moment().startOf('day');
        let newPatientCount = await User.countDocuments({
                'licenseId': req.params.licenseId,
                'userType': 'patient'
            })
            .populate({
                path: 'personId',
                match: {
                    created: {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
                },
            }).exec()

        res.status(200).json({
            count: newPatientCount
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getTodaysBirthday = async(req, res, next) => {
    try {
        const birthdays = await Person.aggregate([{
                $lookup: {
                    from: "users", // other table name
                    localField: "_id", // name of users table field
                    foreignField: "personId", // name of userinfo table field
                    as: "users" // alias for userinfo table
                }
            },
            { $unwind: "$users" },
            { $match: { "users.licenseId": new ObjectId(req.params.licenseId) } },
            {
                $redact: {
                    $cond: [{
                            $eq: [
                                { $month: "$birthdate" },
                                { $month: new Date() }
                            ]
                        },
                        "$$KEEP",
                        "$$PRUNE"
                    ]
                }
            }
        ]);

        res.status(200).json({
            users: birthdays
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.deleteMany = async(req, res, next) => {
    try {
        Ids = req.params.userIds;
        Id = Ids.split(',');
        /**
         * Find all users and retrive person ids
         */
        let users = await User.find({ _id: { $in: Id } }).exec();
        personIds = [];
        users.forEach(user => {
            personIds.push(new ObjectId(user.personId));
        });

        let auth = await Auth.deleteMany({ personId: { $in: personIds } });
        if (!auth) {
            throw new Error('Error in deleting auth!');
        }
        let person = await Person.deleteMany({ _id: { $in: personIds } });
        if (!person) {
            throw new Error('Error in deleting person!');
        }
        let user = await User.deleteMany({ _id: { $in: Id } });
        if (!user) {
            throw new Error('Error in deleting user!');
        }
        res.status(200).json({
            message: user.deletedCount + ' item deleted successfull!'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
