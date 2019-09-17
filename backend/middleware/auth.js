const bcrypt = require('bcryptjs');
const ip = require("ip");
const Person = require('../models/person');
const Auth = require('../models/auth');

module.exports = async (req, res, next) => {
  try {
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
    res.status(401).json({ message: 'Cannot create auth credentials!' });
  }
}
