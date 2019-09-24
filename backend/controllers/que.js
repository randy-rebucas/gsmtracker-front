const Que = require('../models/que');

const moment = require('moment');
const count = 0;

exports.create = async(req, res, next) => {
    try {
        let queCheck = await Que.findOne({ personId: req.body.personId }).populate('personId').exec();
        if (queCheck) {
            throw new Error('Something went wrong.' + queCheck.personId.firstname + ' ' + queCheck.personId.lastname + ' already on que!');
        }

        let count = await Que.countDocuments({ 'licenseId': req.body.licenseId });

        const queData = new Que({
            queNumber: '00' + (count + 1),
            personId: req.body.personId,
            licenseId: req.body.licenseId
        });
        let que = await queData.save();
        res.status(201).json({
            que: {
                // ...que,
                queNumber: que.queNumber,
                id: que._id,
            }
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {

        const que = await Que.find({ 'licenseId': req.query.licenseId })
            .sort({ 'queNumber': 'asc' })
            .populate('personId')
            .exec();

        newQueings = [];
        que.forEach(element => {
            var myObj = {
                id: element._id,
                queNum: element.queNumber,
                fullname: element.personId.firstname + ' ' + element.personId.lastname,
                personId: element.personId._id
            };
            newQueings.push(myObj);
        });
        console.log(newQueings);
        res.status(200).json({
            ques: newQueings
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await Que.deleteOne({ _id: req.params.queId }).exec();
        res.status(200).json({
            message: 'Deletion successfull!'
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.deleteAll = async(req, res, next) => {
    try {
        await Que.deleteMany({ licenseId: req.params.licenseId }).exec();
        res.status(200).json({
            message: 'Deletion successfull!'
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.deleteSmooth = async(req, res, next) => {
    try {
        let que = await Que.findOne({ 'personId': req.params.personId }).exec();
        await Que.deleteOne({ _id: que._id }).exec();
        res.status(200).json({
            message: 'Deletion successfull!'
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getNext = async(req, res, next) => {

    try {
        let nextQue = await Que.findOne({ 'licenseId': req.params.licenseId }).populate('personId').sort({ created: -1 }).exec();
        if (!nextQue) {
            throw new Error('Something went wrong.!');
        }
        res.status(200).json({
            _id: nextQue._id,
            personId: nextQue.personId._id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};