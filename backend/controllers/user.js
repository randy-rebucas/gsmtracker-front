const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Auth = require('../models/auth');
const User = require('../models/user');
const Setting = require('../models/setting');

exports.createUser = async (req, res, next) => {
  try {
    const newUser = new User({
          userType: 'Doctor',
          personId: req.auth.personId
      });
    let user = await newUser.save();
    if (!user) {
      throw new Error('Something went wrong.Connot save user!');
    }
    const newSetting = new Setting({
        userId: req.auth.personId,
        clinicName: req.body.clinicname,
        clinicOwner: req.person.firstname + ', ' + req.person.lastname
    });
    let setting = newSetting.save();

    res.status(201).json({
        message: 'User created!',
        result: setting
    });

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
    // this will eventually be handled by your error handling middleware
    // next(e)
  }
}

exports.userLogin = async (req, res, next) => {
  try {
    let auth = await Auth.findOne({ email: req.body.email }).populate('personId');
    if (!auth) {
      throw new Error('Something went wrong. Your email is not listed!');
    }

    let decrypted = await bcrypt.compare(req.body.password, auth.password);
    if (!decrypted) {
      throw new Error('Something went wrong. Incorrect password!');
    }

    let token = await jwt.sign({ email: auth.email, userId: auth.personId._id },
        process.env.JWT_KEY, { expiresIn: '12h' }
    );
    res.status(200).json({
        token: token,
        expiresIn: 43200, // 3600,
        userId: auth.personId._id, // fetchedUser._id,
        userEmail: auth.email
    });
  } catch (error) {
    res.status(500).json({
        message: error.message
    });
    // this will eventually be handled by your error handling middleware
    // next(e)
  }
}
