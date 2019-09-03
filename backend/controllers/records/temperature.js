const Temperature = require('../../models/records/temperature');
const moment = require('moment');

exports.create = (req, res, next) => {
    const temperature = new Temperature({
        temperature: req.body.temperature,
        created: req.body.created,
        patientId: req.body.patientId
    });
    temperature.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                temperature: {
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
    const temperature = new Temperature({
        _id: req.body.temperatureId,
        temperature: req.body.temperature,
        created: req.body.created_date,
        patientId: req.body.patienId
    });
    Temperature.updateOne({ _id: req.params.temperatureId }, //pass doctor role for restriction
            temperature
        ).then(result => {
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
    const temperatureQuery = Temperature.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    let fetchedRecord;
    if (pageSize && currentPage) {
        temperatureQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    temperatureQuery
        .then(documents => {
            fetchedRecord = documents;
            return Temperature.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                temperatures: fetchedRecord,
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
    Temperature.findById(req.params.temperatureId).then(temperature => {
            if (temperature) {
                res.status(200).json(temperature);
            } else {
                res.status(404).json({ message: 'temperature not found' });
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
    // 'patient': req.params.patientId
    Temperature.find({
      patientId: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .then(temperature => {
            if (temperature) {
                res.status(200).json(temperature);
            } else {
                res.status(404).json({ message: 'temperature not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.getLast = (req, res, next) => {
  Temperature.find({ 'patientId': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .then(temperature => {
          if (temperature) {
              res.status(200).json(temperature);
          } else {
              res.status(404).json({ message: 'temperature not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.delete = (req, res, next) => {
    Temperature.deleteOne({ _id: req.params.temperatureId }) //pass doctors role for restriction
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
