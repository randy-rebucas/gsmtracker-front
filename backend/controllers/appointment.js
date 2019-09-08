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

exports.updateStatus = (req, res, next) => {
  const detail = new Detail({
      _id: req.body.detailId,
      status: req.body.status
  });
  Detail.updateOne({ _id: req.params.detailId }, //pass doctor role for restriction
    detail
      )
      .exec()
      .then(result => {
          if (result.n > 0) {
            const appointment = new Appointment({
              _id: req.body.appointmentId,
              backgroundColor: req.body.status === 1 ? '#3f51b5' : '#f44336',
              borderColor: req.body.status === 1 ? '#3f51b5' : '#f44336',
            });
            Appointment.updateOne({ _id: req.body.appointmentId },
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
  const appointmentQuery = Appointment.find({ 'clientId': req.query.clientId }); //

  let fetchedRecord;
  if (pageSize && currentPage) {
    appointmentQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  appointmentQuery
      .then(documents => {
        newAppointments = [];
        documents.forEach(element => {
          Detail.findOne({ appointmentId: element._id })
          .exec()
          .then(result => {
            //create object
            var myObj = {
              _id: element._id,
              title: element.title,
              start: element.start,
              end: element.end,
              backgroundColor: element.backgroundColor,
              borderColor: element.borderColor,
              textColor: element.textColor,
              fullname : result.firstname + ' ' + result.midlename + ', ' +result.lastname,
              status: result.status
            };
            //   //push the object to your array
            newAppointments.push( myObj );
          });
        });
        // console.log(newAppointments);

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
  Appointment.findById(req.params.appointmentId).exec()
  .then(appointment => {
      if (appointment) {
        Detail.findOne({ appointmentId: appointment._id })
          .then(result => {
              res.status(200).json({
                _id: appointment._id,
                title: appointment.title,
                start: appointment.start,
                end: appointment.end,
                fullname: result.firstname + ' ' + result.midlename + ', ' +result.lastname,
                gender: result.gender,
                address: result.address,
                birthdate: result.birthdate,
                contact: result.contact,
                type: result.type,
                status: result.status,
                detailId: result._id
              });
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
