const Appointment = require('../models/appointment');
const moment = require('moment');

exports.create = (req, res, next) => {
    const appointment = new Appointment({
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      clientId: req.body.clientId
    });
    appointment.save().then(createdRecord => {
      res.status(201).json({
          message: {
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

exports.getAll = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const appointmentQuery = Appointment.find().sort({ 'created': 'desc' }); //{ 'clientId': req.query.clientId }

  let fetchedRecord;
  if (pageSize && currentPage) {
    appointmentQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  appointmentQuery
      .then(documents => {
          fetchedRecord = documents;
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
