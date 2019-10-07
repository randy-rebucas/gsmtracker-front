const Appointment = require('../models/appointment');
const Person = require('../models/person');

const moment = require('moment');

exports.create = async(req, res, next) => {
    try {
        const appointmentData = new Appointment({
            title: req.body.title,
            start: req.body.start,
            backgroundColor: '#ff4081',
            borderColor: '#ff4081',
            textColor: '#fff',
            userId: req.body.users.id,
            licenseId: req.body.licenseId
        });
        let appointment = await appointmentData.save();
        if (!appointment) {
            throw new Error('Something went wrong. Cannot create new appointment!');
        }
        res.status(200).json({
            message: {
                ...appointment,
                id: appointment._id,
            }
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        const newAppointment = new Appointment({
            _id: req.body.appointmentId,
            status: req.body.status,
            backgroundColor: req.body.status === 1 ? '#3f51b5' : '#f44336',
            borderColor: req.body.status === 1 ? '#3f51b5' : '#f44336',
        });
        let appointment = await Appointment.updateOne({ _id: req.body.appointmentId }, newAppointment).exec();
        if (!appointment) {
            throw new Error('Something went wrong. Cannot update appointment!');
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
        const query = Appointment.find({ 'licenseId': req.query.licenseId });

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        let appointments = await query.populate({
          path: 'userId',
          populate: {
            path: 'personId',
            model: Person
          }
        }).exec();
        newAppointments = [];
        appointments.forEach(element => {
            var myObj = {
                _id: element._id,
                title: element.title,
                start: element.start,
                end: element.end,
                backgroundColor: element.backgroundColor,
                borderColor: element.borderColor,
                textColor: element.textColor,
                avatar: element.userId.avatarPath,
                fullname: element.userId.personId.firstname + ' ' + element.userId.personId.midlename + ', ' + element.userId.personId.lastname,
                status: element.status
            };
            newAppointments.push(myObj);
        });

        let count = await Appointment.countDocuments({ 'licenseId': req.query.licenseId });

        res.status(200).json({
            message: 'Fetched successfully!',
            appointment: newAppointments,
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
        let appointment = await Appointment.findById(req.params.appointmentId).populate({
          path: 'userId',
          populate: {
            path: 'personId',
            model: Person
          }
        }).exec();
        res.status(200).json({
            appointmentId: appointment._id,
            title: appointment.title,
            start: appointment.start,
            end: appointment.end,
            status: appointment.status,
            avatar: appointment.userId.avatarPath,
            fullname: appointment.userId.personId.firstname + ' ' + appointment.userId.personId.midlename + ', ' + appointment.userId.personId.lastname,
            gender: appointment.userId.personId.gender,
            address: appointment.userId.personId.address,
            birthdate: appointment.userId.personId.birthdate,
            contact: appointment.userId.personId.contact,
            detailId: appointment.userId._id
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getNewAppointment = async(req, res, next) => {
    try {
        const today = moment().startOf('day');

        let newAppointmentCount = await Appointment.countDocuments({
            'licenseId': req.params.licenseId,
            'status': 0
        }).exec()

        res.status(200).json({
            count: newAppointmentCount
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.appointmentId).exec();
        if (appointment.licenseId != req.userData.licenseId) {
            throw new Error('Not Authorized!');
        }
        await Appointment.deleteOne({ _id: req.params.appointmentId });

        res.status(200).json({
            message: 'Deletion successfull!'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
