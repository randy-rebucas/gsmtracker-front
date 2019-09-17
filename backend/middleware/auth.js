const bcrypt = require('bcryptjs');
const ip = require("ip");
const Person = require('../models/person');
const Auth = require('../models/auth');

module.exports = async (req, res, next) => {
  try {
    let authCheck = await Auth.findOne({ email: req.body.email });
    if (authCheck) {
      throw new Error('Something went wrong. Email is in used!');
    }
    const newPerson = new Person({
        firstname: req.body.firstname,
        lastname: req.body.lastname
    });
    let person = await newPerson.save();

    let hash = await bcrypt.hash(req.body.password, 10);
    const authCredentials = new Auth({
        email: req.body.email,
        password: hash,
        personId: person._id
    });
    let auth = await authCredentials.save();

    req.person = person;
    req.auth = auth;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
