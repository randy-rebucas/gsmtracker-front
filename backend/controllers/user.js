const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ip = require("ip");
const sharp = require('sharp');
const moment = require('moment');
const slugify = require('slugify');

const ObjectId = require('mongoose').Types.ObjectId;

const Auth = require('../models/auth');
const License = require('../models/license');
const User = require('../models/user');
const MyUser = require('../models/myuser');
const Person = require('../models/person');
const Setting = require('../models/setting');
const Type = require('../models/type');
const Plan = require('../models/plan');

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
        const salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
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
        let plan = await Plan.findOne({ slug: 'starter' }).exec();
        const newLicense = new License({
            userId: user._id,
            planId: plan._id,
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
            slug: slugify('Physicians', {
                replacement: '-', // replace spaces with replacement
                remove: null, // regex to remove characters
                lower: true, // result in lower case
            }),
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
            slug: slugify('Patients', {
                replacement: '-', // replace spaces with replacement
                remove: null, // regex to remove characters
                lower: true, // result in lower case
            }),
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
                myUserId: myUser._id,
                licenseId: myUser.licenseId
            },
            process.env.JWT_KEY, {}
        );

        res.status(200).json({
            token: token,
            myUserId: myUser._id,
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
          lastname: req.body.lastname,
          midlename: req.body.midlename,
          contact: req.body.contact,
          gender: req.body.gender,
          birthdate: req.body.birthdate
        });
        addressData = req.body.address;
        for (let index = 0; index < addressData.length; index++) {
            newPerson.address.push(addressData[index]);
        }
        let person = await newPerson.save();
        if (!person) {
            throw new Error('Something went wrong.Cannot save person data!');
        }
        /**
         * Set extended entities from poeple to users collection
         */
        const newUser = new User({
          personId: person._id,
          metaData: req.body.meta
        });
        let user = await newUser.save();

        if (!user) {
            throw new Error('Something went wrong.Cannot save user data!');
        }
        /**
         * Set login credentials in auth collection
         */
        const salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.password, salt);
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
         * Get user type id in types collection
         */
        let userType = await Type.findOne({ slug: req.body.userType }).exec();
        /**
         * Set owned user in myusers collection
         */
        const myUser = new MyUser({
            userType: userType._id,
            userId: user._id,
            licenseId: req.body.licenseId
        });
        let myuser = await myUser.save();
        if (!myuser) {
            throw new Error('Something went wrong.Cannot save my user collection!');
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
        /**
         * get myuser data
         */
        let filteredUser = await MyUser.findOne({ _id: req.params.myUserId }).populate({
          path: 'userId',
          populate: {
              path: 'personId',
              model: Person
          }
        }).exec();
      /**
         * Set common entities on people collection
         */
        const newPerson = new Person({
          _id: filteredUser.userId.personId,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          midlename: req.body.midlename,
          contact: req.body.contact,
          gender: req.body.gender,
          birthdate: req.body.birthdate
        });
        addressData = req.body.address;
        for (let index = 0; index < addressData.length; index++) {
            newPerson.address.push(addressData[index]);
        }

        let person = await Person.findOneAndUpdate({ _id: filteredUser.userId.personId }, newPerson, {new: true});
        if (!person) {
            throw new Error('Something went wrong.Cannot update person data!');
        }
      /**
         * Set extended entities from poeple to users collection
         */
        const updatedUser = new User({
          _id: filteredUser.userId._id
        });
        metaData = req.body.meta;
        for (let index = 0; index < metaData.length; index++) {
          updatedUser.metaData.push(metaData[index]);
        }
        let user = await User.updateOne({ _id: filteredUser.userId._id }, updatedUser);
        if (!user) {
            throw new Error('Something went wrong.Cannot update user data!');
        }
        /**
         * update myuser data
         */
        const updateMyUser = new MyUser({
          _id: filteredUser._id,
          userType: req.body.userType,
          userId: req.params.userId,
          licenseId: req.body.licenseId
        });
        let myuser = await MyUser.findOneAndUpdate({ _id: filteredUser._id }, updateMyUser, {new: true});
        if (!myuser) {
            throw new Error('Something went wrong.Cannot update my user data!');
        }
        // console.log(myuser);
        res.status(200).json({ message: person.firstname + ' Update successful!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};
exports.search = async(req, res, next) => {
  try {
      const patientQuery = User.find({ 'licenseId': req.query.licenseId });
      let patient = await patientQuery.populate('personId').where('userType', 'patient');
      const result = [];
      patient.forEach(element => {
          let fullname = element.personId.firstname + ', ' + element.personId.lastname;
          result.push({ id: element._id, name: fullname });
      });

      let count = await User.countDocuments({ 'licenseId': req.query.licenseId });

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

exports.search = async(req, res, next) => {
    try {

      let userType = await Type.findOne({ slug: 'patients' }).exec();
      let myUsers = await MyUser.find({ 'licenseId': req.query.licenseId })
      .populate({
        path: 'userId',
        populate: {
            path: 'personId',
            model: Person
        }
      }).where('userType', userType._id);

      const result = [];
      myUsers.forEach(element => {
          result.push({ id: element._id, name: element.userId.personId.firstname + ', ' + element.userId.personId.lastname });
      });

      let count = await MyUser.countDocuments({ 'licenseId': req.query.licenseId, 'userType': userType._id });

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

exports.getAll = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const query = MyUser.find({ 'licenseId': req.query.licenseId });

        let userCount = 0;
        if (req.query.usertype != 'all') {
            let userType = await Type.findOne({ slug: req.query.usertype }).exec();
            userCount = await MyUser.countDocuments({ 'userType': userType._id });
            query.where('userType', userType._id);
        }

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        let users = await query
            .populate({
                path: 'userId',
                populate: {
                    path: 'personId',
                    model: Person
                }
            })
            .exec();

        res.status(200).json({
            message: 'Users fetched successfully!',
            users: users,
            counts: userCount
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        const _u = await MyUser.aggregate([{
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
            // { $match: { 'users._id': new ObjectId(req.params.userId) } },
            { $match: { _id: new ObjectId(req.params.myUserId) } },
            {
                $project: {
                    userType: 1,
                    users: 1,
                    people: 1,
                    'auths.email': 1
                }
            },
            { $sort: { 'people.created': -1 } }
        ]);

        res.status(200).json({
            myuserId: _u[0]._id,
            userId: _u[0].users._id,
            personId: _u[0].people._id,
            metas: _u[0].users.metaData,
            firstname: _u[0].people.firstname,
            lastname: _u[0].people.lastname,
            midlename: _u[0].people.midlename,
            contact: _u[0].people.contact,
            gender: _u[0].people.gender,
            birthdate: _u[0].people.birthdate,
            addresses: _u[0].people.address,
            created: _u[0].people.created,
            email: _u[0].auths.email,
            avatar: _u[0].users.avatarPath,
            userType: _u[0].userType
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
  try {
      Ids = req.params.myUserIds;
      Id = Ids.split(',');
      /**
       * Find all users and retrive ids
       */
      let users = await MyUser.find({ _id: { $in: Id } })
        .populate({
          path: 'userId',
          populate: {
              path: 'personId',
              model: Person
          }
        }).exec();

      userIds = [];
      personIds = [];
      users.forEach(user => {
        userIds.push(new ObjectId(user.userId._id));
        personIds.push(new ObjectId(user.userId.personId._id));
      });

      /**
       * delete auth credentials
       */
      let auth = await Auth.deleteMany({ userId: { $in: userIds } });
      if (!auth) {
          throw new Error('Error in deleting auth!');
      }
      /**
       * delete person collection
       */
      let person = await Person.deleteMany({ _id: { $in: personIds } });
      if (!person) {
          throw new Error('Error in deleting person!');
      }
      /**
       * delete user collection
       */
      let user = await User.deleteMany({ _id: { $in: userIds } });
      if (!user) {
          throw new Error('Error in deleting user!');
      }
      /**
       * delete my user collection
       */
      let myuser = await MyUser.deleteMany({ _id: { $in: Id } });
      if (!myuser) {
          throw new Error('Error in deleting myuser!');
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

exports.uploadProfile = async(req, res, next) => {
    try {
        let userPicture = await sharp(req.file.path).resize(200, 200).toBuffer();
        if (!userPicture) {
            throw new Error('Error in updating profile picture!');
        }
        const newUser = new User({
            _id: req.body.userId,
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
        let userType = await Type.findOne({ slug: 'patients' }).exec();
        let newPatientCount = await MyUser.countDocuments({
                'licenseId': req.params.licenseId,
                'userType': userType._id
            })
            .populate({
              path: 'userId',
              populate: {
                  path: 'personId',
                  model: Person,
                  match: {
                    created: {
                        $gte: today.toDate(),
                        $lte: moment(today).endOf('day').toDate()
                    }
                },
              }
            })
            .exec()

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
        const birthdays = await MyUser.aggregate([
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
            { $match: { licenseId: new ObjectId(req.params.licenseId) } },
            {
                $redact: {
                    $cond: [{
                            $eq: [
                                { $month: "$people.birthdate" },
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
