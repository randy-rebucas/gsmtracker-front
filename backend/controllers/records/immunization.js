const Immunization = require('../../models/records/immunization');
const moment = require('moment');

exports.create = async(req, res, next) => {
    try {
        const newImmunization = new Immunization({
            vaccines: req.body.vaccines,
            doses: req.body.doses,
            created: req.body.created,
            patientId: req.body.patientId
        });
        let immunization = await newImmunization.save();
        if (!immunization) {
            throw new Error('Something went wrong. Cannot create immunization!');
        }
        res.status(201).json({
            message: 'Successfully added',
            immunization: {
                ...immunization,
                id: immunization._id,
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
        const newImmunization = new Immunization({
            _id: req.body.immunizationId,
            vaccines: req.body.vaccines,
            doses: req.body.doses,
            created: req.body.created,
            patientId: req.body.patientId
        });
        let height = await Immunization.updateOne({ _id: req.params.immunizationId }, newImmunization).exec();
        if (!height) {
            throw new Error('Something went wrong. Cannot update immunization!');
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
        const currentPage = +req.query.page;
        const pageSize = +req.query.pagesize;
        const query = Immunization.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        let immunization = await query.exec();

        let count = await Immunization.countDocuments({ 'patientId': req.query.patientId });

        res.status(200).json({
            message: 'Fetched successfully!',
            immunizations: immunization,
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
        let immunization = await Immunization.findById(req.params.immunizationId).exec();
        if (!immunization) {
            throw new Error('Something went wrong. Cannot be found immunization id: ' + req.params.immunizationId);
        }
        res.status(200).json(immunization);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getCurrent = async(req, res, next) => {
    try {
        const today = moment().startOf('day');
        //addpatient id
        let immunization = await Immunization.find({
            patient: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

        res.status(200).json(immunization);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getLast = async(req, res, next) => {
    try {
        let immunization = await Immunization.find({ 'patientId': req.params.patientId })
            .limit(1)
            .sort({ 'created': 'desc' })
            .exec();

        res.status(200).json(immunization);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await Immunization.deleteOne({ _id: req.params.immunizationId }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};