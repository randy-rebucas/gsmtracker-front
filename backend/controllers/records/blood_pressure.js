const BloodPressure = require('../../models/records/blood_pressure');
const moment = require('moment');

exports.create = (req, res, next) => {
    const bp = new BloodPressure({
        systolic: req.body.systolic,
        diastolic: req.body.diastolic,
        created: req.body.created,
        patientId: req.body.patientId
    });
    bp.save().then(createdRecord => {
            res.status(201).json({
                message: 'Successfully added',
                bp: {
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
    const bp = new BloodPressure({
        _id: req.body.bloodPressureId,
        systolic: req.body.systolic,
        diastolic: req.body.diastolic,
        created: req.body.created_date,
        patientId: req.body.patientId
    });
    BloodPressure.updateOne({ _id: req.params.bloodPressureId }, //pass doctor role for restriction
            bp
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
    const bpQuery = BloodPressure.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    let fetchedRecord;
    if (pageSize && currentPage) {
        bpQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    bpQuery
    .exec()
        .then(documents => {
            fetchedRecord = documents;
            return BloodPressure.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Fetched successfully!',
                bps: fetchedRecord,
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
    BloodPressure.findById(req.params.bloodPressureId)
    .exec()
    .then(bp => {
            if (bp) {
                res.status(200).json(bp);
            } else {
                res.status(404).json({ message: 'bp not found' });
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

    BloodPressure.find({
            patient: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .exec()
        .then(bp => {
            if (bp) {
                res.status(200).json(bp);
            } else {
                res.status(404).json({ message: 'bp not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.getLast = (req, res, next) => {
    BloodPressure.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec()
        .then(bp => {
            if (bp) {
                res.status(200).json(bp);
            } else {
                res.status(404).json({ message: 'bp not found' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
};

exports.delete = (req, res, next) => {
    BloodPressure.deleteOne({ _id: req.params.bloodPressureId }) //pass doctors role for restriction
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
