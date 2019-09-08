const RespiratoryRate = require('../../models/records/respiratory_rate');
const moment = require('moment');

exports.create = (req, res, next) => {
    const respiratoryrate = new RespiratoryRate({
        respiratoryrate: req.body.respiratoryrate,
        created: req.body.created,
        patientId: req.body.patientId
    });
    respiratoryrate.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                weight: {
                    ...createdRecord,
                    id: createdRecord._id,
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.update = (req, res, next) => {
    const respiratoryrate = new RespiratoryRate({
        _id: req.body.respiratoryRateId,
        respiratoryrate: req.body.respiratoryrate,
        created: req.body.created_date,
        patientId: req.body.patientId
    });
    RespiratoryRate.updateOne({ _id: req.params.respiratoryRateId }, //pass doctor role for restriction
            respiratoryrate
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
};

exports.getAll = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const resrateQuery = RespiratoryRate.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    let fetchedRecord;
    if (pageSize && currentPage) {
        resrateQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    resrateQuery
    .exec()
        .then(documents => {
            fetchedRecord = documents;
            return RespiratoryRate.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                rprs: fetchedRecord,
                max: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.get = (req, res, next) => {
    RespiratoryRate.findById(req.params.respiratoryRateId)
    .exec()
    .then(respiratoryrate => {
            if (respiratoryrate) {
                res.status(200).json(respiratoryrate);
            } else {
                res.status(404).json({ message: 'respiratory rate not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.getCurrent = (req, res, next) => {
    const today = moment().startOf('day');

    RespiratoryRate.find({
      patientId: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .exec()
        .then(respiratoryrate => {
            if (respiratoryrate) {
                res.status(200).json(respiratoryrate);
            } else {
                res.status(404).json({ message: 'respiratoryrate not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.getLast = (req, res, next) => {
  RespiratoryRate.find({ 'patientId': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .exec()
      .then(respiratoryrate => {
          if (respiratoryrate) {
              res.status(200).json(respiratoryrate);
          } else {
              res.status(404).json({ message: 'respiratory rate not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.delete = (req, res, next) => {
    RespiratoryRate.deleteOne({ _id: req.params.respiratoryRateId }) //pass doctors role for restriction
    .exec()
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: 'Deletion successfull!' });
            } else {
                res.status(401).json({ message: 'Not Authorized!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};
