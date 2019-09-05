const Thread = require('../models/thread');
const moment = require('moment');

exports.create = (req, res, next) => {
    const thread = new Thread({
      message: req.body.message,
      userId: req.body.users.id,
      ownerId: req.body.ownerId
    });
    thread.save().then(createdThread => {
      console.log(createdThread);
            res.status(201).json({
                message: 'Successfully added',
                thread: {
                    ...createdThread,
                    id: createdThread._id,
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
    const height = new Message({
        _id: req.body.heightId,
        height: req.body.height,
        created: req.body.created_date,
        patientId: req.body.patientId
    });
    Height.updateOne({ _id: req.params.heightId }, //pass doctor role for restriction
            height
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

    Thread.find({ 'ownerId': req.query.ownerId })
    .populate('userId')
      .sort({ 'created': 'desc' })
      .then(documents => {
          res.status(200).json({
            threads: documents
        });
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.get = (req, res, next) => {
    Height.findById(req.params.heightId).then(height => {
            if (height) {
                res.status(200).json(height);
            } else {
                res.status(404).json({ message: 'height not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.delete = (req, res, next) => {
    Message.deleteOne({ _id: req.params.heightId }) //pass doctors role for restriction
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
