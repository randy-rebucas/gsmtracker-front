const Person = require('../models/person');
const User = require('../models/user');
const Patient = require('../models/patient');

exports.createPatient = async (req, res, next) => {
  try {
    // const newPerson = new Person({
    //   _id: req.auth.personId,
    //   midlename: req.body.midlename,
    //   contact: req.body.contact,
    //   gender: req.body.gender,
    //   birthdate: req.body.birthdate
    // });
    // addressData = req.body.address;
    // for (let index = 0; index < addressData.length; index++) {
    //   newPerson.address.push(addressData[index]);
    // }
    // let updatedPerson = await Person.updateOne({ _id: req.person._id }, newPerson );
    // if (!updatedPerson) {
    //   throw new Error('Something went wrong.Cannot update person!');
    // }
    // console.log(req.person);
    const newUser = new User({
      userType: 'Patient',
          personId: req.auth.personId
      });
    let user = await newUser.save();
    console.log(user);
    if (!user) {
      throw new Error('Something went wrong.Cannot save user!');
    }
    /**
     * set this to dynamic data
     */
    const newPatient = new Patient({
      bloodType: req.body.bloodType,
      comments: req.body.comments,
      personId: req.person._id,
      userId: user._id
    });
    let patient = await newPatient.save();
    if (!patient) {
      throw new Error('Something went wrong.Cannot save patient!');
    }
    res.status(200).json({
      message: 'Patient added successfully',
      patients: {
        ...patient,
        id: patient._id,
      }
    });
  } catch (e) {
    res.status(500).json({
        message: e.message
    });
    // this will eventually be handled by your error handling middleware
    // next(e)
  }
};

exports.updatePatient = (req, res, next) => {
  const patient = new Patient({
    _id: req.body.id,
    bloodType: req.body.bloodType,
    comments: req.body.comments
  });

  Patient
    .updateOne(
      {
        _id: req.params.patientId //userId: req.userData.userId
      },
      patient
    )
    .exec()
    .then(
      result => {
        if (result.n > 0) {
          const person = new Person({
            _id: req.params.personId,
            firstname: req.body.firstname,
            midlename: req.body.midlename,
            lastname: req.body.lastname,
            contact: req.body.contact,
            gender: req.body.gender,
            birthdate: req.body.birthdate
          });
          addressData = req.body.address;
          for (let index = 0; index < addressData.length; index++) {
            person.address.push(addressData[index]);
          }
          Person.updateOne(
            { _id: req.params.personId }, //pass doctor role for restriction
            person
              )
              .exec()
              .then(result => {
                  if (result.n > 0) {
                      res.status(200).json({ message: 'Update successful!' });
                  } else {
                      res.status(401).json({ message: 'Not authorized!' });
                  }
              })
              .catch(error => {
                  res.status(500).json({
                      message: error.message
                  });
              });
        } else {
          res.status(401).json({ message: 'Not authorized!' });
        }
      }
    )
    .catch(
      error => {
        res.status(500).json({
          message: error.message
        } );
      }
    );
};
/**
 * tobe transfer in network
 */
exports.getAllNetwork = (req, res, next) => {
  const currentPage = +req.query.page;
  const patientQuery = Patient.find({
    'userId': req.query.userId
  });
  patientQuery
    .populate('personId')
    .then(documents => {
        fetchedPatients = documents;
        return Patient.countDocuments();
      }
    )
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

exports.getPatients = async (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const patientQuery = Patient.find({
    'userId': req.query.userId
  });

  if (pageSize && currentPage) {
    patientQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  await patientQuery
    .populate('personId')
    .exec()
    .then(documents => {
        fetchedPatients = documents;
        return Patient.countDocuments();
      }
    )
    .then(
      count => {
        res.status(200).json({
          message: 'Patient fetched successfully!',
          patients: fetchedPatients,
          maxPatients: count
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
};

exports.getPatient = (req, res, next) => {
  Patient
    .findById(
      req.params.patientId
    )
    .populate(
      'personId'
    )
    .exec()
    .then(
      patient => {
        if (patient) {
          res.status(200).json({
            _id: patient._id,
            bloodType: patient.bloodType,
            comments: patient.comments,
            userId: patient.userId,
            personId: patient.personId._id,
            firstname: patient.personId.firstname,
            lastname: patient.personId.lastname,
            midlename: patient.personId.midlename,
            contact: patient.personId.contact,
            gender: patient.personId.gender,
            birthdate: patient.personId.birthdate,
            addresses: patient.personId.address,
            createdAt: patient.personId.createdAt
          });
        } else {
          res.status(404).json({
            message: 'patient not found'
          });
        }
      }
    )
    .catch(
      error => {
        res.status(500).json({
          message: error.message
        });
      }
    );
};

exports.deletePatient = (req, res, next) => {
  Patient
    .deleteOne(
      { _id: req.params.patientId,
        userId: req.userData.userId //only owner can delete
      }
    )
    .exec()
    .then(
      result => {
        if (result.n > 0) {
          res.status(200)
          .json({
            message: 'Deletion successfull!'
          });
        } else {
          res.status(401)
          .json({
            message: 'Not Authorized!'
          });
        }
      }
    )
    .catch(
      error => {
        res.status(500).json({
          message: error.message
        });
      }
    );
};
