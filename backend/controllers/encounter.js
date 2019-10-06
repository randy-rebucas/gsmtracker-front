const Encounter = require('../models/encounter');
const Person = require('../models/person');
const moment = require('moment');
const count = 0;

exports.create = async(req, res, next) => {
    try {
        const encounterData = new Encounter({
            userId: req.body.patientId,
            licenseId: req.body.licenseId
        });
        let encounter = await encounterData.save();
        res.status(200).json();
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
  try {
    //  {email: {$not: /@domain.com/}}
    let encounter = await Encounter.findOneAndUpdate({ userId: req.params.userId, licenseId: req.params.licenseId, status: 0 }, {$set:{status: req.body.status}}).exec();
    if (!encounter) {
      throw new Error('Something went wrong.Cannot update encounter!');
    }
    res.status(200).json({ message: 'encounter update successful!' });

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.getAll = async(req, res, next) => {
    try {
        const encounter = await Encounter.find({ 'licenseId': req.query.licenseId })
            .sort({ 'created': 'asc' })
            .populate({
              path: 'userId',
              populate: {
                path: 'personId',
                model: Person
              }
            })
            .exec();

        newEncounters = [];
        encounter.forEach(element => {
            var myObj = {
                id: element._id,
                status: element.status,
                fullname: element.userId.personId.firstname + ' ' + element.userId.personId.lastname,
                userId: element.userId._id
            };
            newEncounters.push(myObj);
        });

        res.status(200).json({
            encounters: newEncounters
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.get = async(req, res, next) => {
  try {
    let onQue = false;
    let que = await Que.findOne({ userId: req.params.userId }).exec();
    if (que) {
      onQue = true;
    }
    res.status(200).json({
      onQue: onQue
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

