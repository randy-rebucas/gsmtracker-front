const Appointment = require('../models/appointment');
const Person = require('../models/person');
const Detail = require('../models/appointment_detail');

const moment = require('moment');

exports.create = (req, res, next) => {

    const appointment = new Appointment({
      title: req.body.title,
      start: req.body.start,
      end: req.body.end,
      backgroundColor: '#ff4081',
      borderColor: '#ff4081',
      textColor: '#fff',
      clientId: req.body.clientId
    });
    appointment.save().then(createdRecord => {

      if(req.body.users.id) {
        Person
          .findById(
            req.body.users.id
          )
          .then(
            person => {
              const detail = new Detail({
                firstname: person.firstname,
                midlename: person.midlename,
                lastname: person.lastname,
                contact: person.contact,
                gender: person.gender,
                address: person.address,
                type: 0,
                appointmentId: createdRecord._id
              });

              detail.save().then(createdDetails => {
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
            }
          );
      } else {
        const detail = new Detail({
          firstname:  req.body.firstname,
          midlename: req.body.midlename,
          lastname: req.body.lastname,
          contact: req.body.contact,
          gender: req.body.gender,
          address: req.body.address,
          type: 0,
          appointmentId: createdRecord._id
        });

        detail.save().then(createdDetails => {
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
