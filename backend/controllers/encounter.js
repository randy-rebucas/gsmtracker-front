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
      console.log(req.query.licenseId);
      const encounter = await Encounter.aggregate([
        // { "$lookup": {
        //   "from": "connections",
        //   "localField": "_id",
        //   "foreignField": "user",
        //   "as": "connections"
        // }},

        // { $match: { licenseId: req.query.licenseId } },
        // { $redact: {
        //     $cond: [{ $eq: ["$licenseId", req.query.licenseId ] }, "$$KEEP",
        //     "$$PRUNE" ]
        //   }
        // },
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
          { $sort: {count: 1} }
        ]);
        console.log(encounter);
        // const encounter = await Encounter.find({ 'licenseId': req.query.licenseId })
        //     .sort({ 'created': 'asc' })
        //     .populate({
        //       path: 'userId',
        //       populate: {
        //         path: 'personId',
        //         model: Person
        //       }
        //     })
        //     .exec();
        // const chart = {
        //   type: 'bar',
        //   series: [
        //     {
        //       values: employeeInfo
        //     }
        //   ]
        // };
        // newEncounters = [];
        // encounter.forEach(element => {
        //     var myObj = {
        //         id: element._id,
        //         status: element.status,
        //         fullname: element.userId.personId.firstname + ' ' + element.userId.personId.lastname,
        //         userId: element.userId._id
        //     };
        //     newEncounters.push(myObj);
        // });
        // let count = await Appointment.countDocuments({ 'licenseId': req.query.licenseId });
        // console.log(encounter);
        res.status(200).json({
            encounters: encounter
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};


