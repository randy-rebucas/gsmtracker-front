const BloodPressure = require('../../models/records/blood_pressure');
const moment = require('moment');

exports.create = async(req, res, next) => {
    try {
        const newBp = new BloodPressure({
            systolic: req.body.systolic,
            diastolic: req.body.diastolic,
            created: req.body.created,
            patientId: req.body.patientId
        });
        let bp = await newBp.save();
        if (!bp) {
            throw new Error('Something went wrong. Cannot create blood pressure!');
        }

        res.status(201).json({
            message: 'Successfully added',
            bp: {
                ...bp,
                id: bp._id,
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        const newBp = new BloodPressure({
            _id: req.body.bloodPressureId,
            systolic: req.body.systolic,
            diastolic: req.body.diastolic,
            created: req.body.created,
            patientId: req.body.patientId
        });
        let bp = await BloodPressure.updateOne({ _id: req.params.bloodPressureId }, newBp).exec();
        if (!bp) {
            throw new Error('Something went wrong. Cannot update blood pressure!');
        }

        res.status(200).json({ message: 'Update successful!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const bpQuery = BloodPressure.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

        if (pageSize && currentPage) {
            bpQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
        let bd = await bpQuery.exec();

        let count = await BloodPressure.countDocuments({ 'patientId': req.query.patientId });

        res.status(200).json({
            message: 'Fetched successfully!',
            bps: bd,
            max: count
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        let bp = await BloodPressure.findById(req.params.bloodPressureId).exec();
        if (!bp) {
            throw new Error('Something went wrong. Cannot be found blood pressure id: ' + req.params.bloodPressureId);
        }
        res.status(200).json(bp);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getCurrent = async(req, res, next) => {
    try {
        const today = moment().startOf('day');

        let bp = await BloodPressure.findOne({
                patientId: req.params.patientId,
                created: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate()
                }
            })
            .select('systolic diastolic created')
            .exec();

        res.status(200).json(bp);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getLast = async(req, res, next) => {
    try {
        var projection = {
            _id: false
        };
        let bp = await BloodPressure.findOne({ 'patientId': req.params.patientId }, projection)
            .select('systolic diastolic created')
            .sort({ created: -1 })
            .exec();

        res.status(200).json(bp);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await BloodPressure.deleteOne({ _id: req.params.bloodPressureId }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};