const Appointment = require('../models/appointment');
const Person = require('../models/person');
const Detail = require('../models/appointment_detail');

const moment = require('moment');

exports.create = async (req, res, next) => {
  try {
    const appointmentData = new Appointment({
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      backgroundColor: '#ff4081',
      borderColor: '#ff4081',
      textColor: '#fff',
      patientId: req.body.users.id,
      clientId: req.body.clientId
    });
    let appointment = await appointmentData.save();
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
    // this will eventually be handled by your error handling middleware
    // next(e)
  }
};

exports.updateStatus = async (req, res, next) => {
  const appointment = new Appointment({
    _id: req.body.appointmentId,
    status: req.body.status,
    backgroundColor: req.body.status === 1 ? '#3f51b5' : '#f44336',
    borderColor: req.body.status === 1 ? '#3f51b5' : '#f44336',
  });
  await Appointment.updateOne({ _id: req.body.appointmentId },
    appointment
  )
  .exec()
  .then(() => {
    res.status(200).json({ message: 'Update successful!' });
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
  const appointmentQuery = Appointment.find({ 'clientId': req.query.clientId }); //

  let fetchedRecord;
  if (pageSize && currentPage) {
    appointmentQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  appointmentQuery
      .populate('patientId')
      .exec()
      .then(documents => {
        newAppointments = [];
        documents.forEach(element => {
            //create object
            var myObj = {
              _id: element._id,
              title: element.title,
              start: element.start,
              end: element.end,
              backgroundColor: element.backgroundColor,
              borderColor: element.borderColor,
              textColor: element.textColor,
              fullname : element.patientId.firstname + ' ' + element.patientId.midlename + ', ' +element.patientId.lastname,
              status: element.status
            };
            //   //push the object to your array
            newAppointments.push( myObj );
        });
          fetchedRecord = newAppointments;
          return Appointment.countDocuments();
      })
      .then(count => {
          res.status(200).json({
              message: 'Fetched successfully!',
              appointment: fetchedRecord,
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
  Appointment.findById(req.params.appointmentId)
  .populate('patientId')
  .exec()
  .then(appointment => {
      if (appointment) {
        res.status(200).json({
          _id: appointment._id,
          title: appointment.title,
          start: appointment.start,
          end: appointment.end,
          status: appointment.status,
          fullname: appointment.patientId.firstname + ' ' + appointment.patientId.midlename + ', ' +appointment.patientId.lastname,
          gender: appointment.patientId.gender,
          address: appointment.patientId.address,
          birthdate: appointment.patientId.birthdate,
          contact: appointment.patientId.contact,
          detailId: appointment.patientId._id
        });
      } else {
          res.status(404).json({ message: 'thread not found' });
      }
  })
  .catch(error => {
      res.status(500).json({
          message: error.message
      });
  });
};

exports.delete = (req, res, next) => {
  Appointment.deleteOne({ _id: req.params.appointmentId })
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
