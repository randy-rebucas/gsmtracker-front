const Histories = require('../../models/records/histories');
const moment = require('moment');

exports.create = (req, res, next) => {
    const history = new Histories({
        type: req.body.type,
        description: req.body.description,
        created: req.body.created,
        patientId: req.body.patientId
    });
    history.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                history: {
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
    const history = new Histories({
        _id: req.body.historyId,
        type: req.body.type,
        description: req.body.description,
        created: req.body.created_date,
        patientId: req.body.patientId
    });
    Histories.updateOne({ _id: req.params.historyId }, //pass doctor role for restriction
      history
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
    const historyQuery = Histories.find({ 'patientId': req.query.patientId }).sort({'created': 'desc'});

    let fetchedRecord;
    if (pageSize && currentPage) {
      historyQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    historyQuery
    .exec()
        .then(documents => {
            fetchedRecord = documents;
            return Histories.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                histories: fetchedRecord,
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
  Histories.findById(req.params.historyId)
  .exec()
  .then(history => {
            if (history) {
                res.status(200).json(history);
            } else {
                res.status(404).json({ message: 'history not found' });
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
  Histories.find({
    patientId: req.params.patientId,
          created: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
          }
      })
      .exec()
      .then(history => {
          if (history) {
              res.status(200).json(history);
          } else {
              res.status(404).json({ message: 'history not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.getLast = (req, res, next) => {
  Histories.find({ 'patientId': req.params.patientId })
      .limit(2)
      .sort({ 'created': 'desc' })
      .exec()
      .then(history => {
          if (history) {
              res.status(200).json(history);
          } else {
              res.status(404).json({ message: 'history not found' });
          }
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.delete = (req, res, next) => {
  Histories.deleteOne({ _id: req.params.historyId }) //pass doctors role for restriction
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
