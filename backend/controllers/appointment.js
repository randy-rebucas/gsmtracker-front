const Appointment = require('../models/appointment');
const moment = require('moment');

exports.create = async(req, res, next) => {
    try {
        const appointmentData = new Appointment({
            title: req.body.title,
            start: req.body.start,
            backgroundColor: '#ff4081',
            borderColor: '#ff4081',
            textColor: '#fff',
            patientId: req.body.users.id,
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

        let appointments = await query.populate('patientId').exec();
        newAppointments = [];
        appointments.forEach(element => {
            //create object
            var myObj = {
                _id: element._id,
                title: element.title,
                start: element.start,
                end: element.end,
                backgroundColor: element.backgroundColor,
                borderColor: element.borderColor,
                textColor: element.textColor,
                fullname: element.patientId.firstname + ' ' + element.patientId.midlename + ', ' + element.patientId.lastname,
                status: element.status
            };
            //   //push the object to your array
            newAppointments.push(myObj);
        });

        let count = await Appointment.countDocuments();

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
        let appointment = await Appointment.findById(req.params.appointmentId).populate('patientId').exec();
        res.status(200).json({
            appointmentId: appointment._id,
            title: appointment.title,
            start: appointment.start,
            end: appointment.end,
            status: appointment.status,
            fullname: appointment.patientId.firstname + ' ' + appointment.patientId.midlename + ', ' + appointment.patientId.lastname,
            gender: appointment.patientId.gender,
            address: appointment.patientId.address,
            birthdate: appointment.patientId.birthdate,
            contact: appointment.patientId.contact,
            detailId: appointment.patientId._id
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