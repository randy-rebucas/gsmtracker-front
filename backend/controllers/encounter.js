const Encounter = require('../models/encounter');
const Person = require('../models/person');
const moment = require('moment');
const count = 0;
var ObjectId = require('mongoose').Types.ObjectId;

exports.create = async(req, res, next) => {
    try {
        const encounterData = new Encounter({
            myUserId: req.body.myUserId
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
    let encounter = await Encounter.findOneAndUpdate({ myUserId: req.params.myUserId, status: 0 }, {$set:{status: req.body.status}}).exec();
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
      const encounter = await Encounter.aggregate([
        // { $match: { licenseId : new ObjectId(req.query.licenseId) } }, // .toString()
        { $group:
            {
              _id:
                {
                  //day: {$dayOfMonth: "$created"},
                  //month: {$month: "$created"},
                  year: {$year: "$created"}
                },
                canceled: {$sum: { $cond: [{ $eq: ["$status", 1 ] }, 1, 0] }},
                done: {$sum: { $cond: [{ $eq: ["$status", 2 ] }, 1, 0] }},
                count: {$sum: 1}
            }
          },
          { $sort: { "created": -1 } }
        ]);

        res.status(200).json({
            encounters: encounter
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};


