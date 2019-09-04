const Message = require('../models/message');
const moment = require('moment');

exports.create = (req, res, next) => {
    const height = new Message({
        height: req.body.height,
        created: req.body.created,
        patientId: req.body.patientId
    });
    height.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                height: {
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
    const currentPage = +req.query.page;
    const pageSize = +req.query.pagesize;
    const heightQuery = Message.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    let fetchedRecord;

    if (pageSize && currentPage) {
        heightQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    heightQuery
        .then(documents => {
            fetchedRecord = documents;
            return Height.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                heights: fetchedRecord,
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

exports.getCurrent = (req, res, next) => {
    const today = moment().startOf('day');
    //addpatient id
    Message.find({
            patient: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .then(height => {
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

exports.getLast = (req, res, next) => {
    Height.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .then(height => {
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