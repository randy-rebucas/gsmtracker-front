const bcrypt = require('bcryptjs');
const ip = require("ip");
const Person = require('../models/person');
const Auth = require('../models/auth');
const User = require('../models/user');

module.exports = async(req, res, next) => {
    try {

      if (req.body.id) {
        let user = await User.findById(req.body.id).exec();
        const newPerson = new Person({
            _id: user.personId,
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
        let updatedPerson = await Person.updateOne({ _id: user.personId }, newPerson);
        if (!updatedPerson) {
            throw new Error('Something went wrong.Cannot update person!');
        }

      } else {

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
      }
      next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
