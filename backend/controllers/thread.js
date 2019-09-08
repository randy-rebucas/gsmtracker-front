const Thread = require('../models/thread');
const Message = require('../models/message');
const moment = require('moment');
/**
 * loop all users recepient to send sms
 */
exports.create = (req, res, next) => {
  Thread.findOne({userId: req.body.users.id}, function(err,obj) {
      if (obj === null) {
        const thread = new Thread({
          userId: req.body.users.id,
          ownerId: req.body.ownerId
        });
        thread.save()
        .then(createdThread => {
          const message = new Message({
            message: req.body.message,
            threadId: createdThread._id,
            personId: req.body.ownerId
          });
          message.save()
            .then(createdMessage => {
              res.status(201).json({
                thread: {
                    ...createdThread,
                    id: createdThread._id,
                }
              });
            })
            .catch(error => {
              res.status(500).json({
                message: error.message
              });
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message
            });
        });
      } else {
        // reply
        const message = new Message({
          message: req.body.message,
          threadId: obj._id,
          personId: obj.ownerId
        });
        message.save()
          .then(createdMessage => {
            res.status(201).json({
              messages: {
                  ...createdMessage,
                  id: createdMessage._id,
              }
            });
          })
          .catch(error => {
            res.status(500).json({
              message: error.message
            });
          });
      }
    });

};

exports.getAll = (req, res, next) => {

    Thread.find({ 'ownerId': req.query.ownerId })
      .populate('userId')
      .sort({ 'created': 'asc' })
      .exec()
      .then(documents => {

          newThreads = [];
          documents.forEach(element => {
            // find all message by threadId limit 1 order created desc
            //create object
            var myObj = {
              id: element._id,
              created: moment(element.created, "YYYYMMDD").fromNow(),
              ownerId: element.ownerId,
              fullname : element.userId.firstname + ' ' + element.userId.midlename + ', ' +element.userId.lastname,
            };
            //push the object to your array
            newThreads.push( myObj );
          });
          res.status(200).json({
            threads: newThreads
        });
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.get = (req, res, next) => {
  Thread.findById(req.params.threadId)
  .populate('userId')
  .exec()
  .then(thread => {
      if (thread) {
          res.status(200).json({
            threadId: thread._id,
            ownerId: thread.ownerId,
            fullname: thread.userId.firstname + ' ' + thread.userId.midlename + ', ' +thread.userId.lastname,
            gender: thread.userId.gender,
            address: thread.userId.address,
            birthdate: thread.userId.birthdate,
            contact: thread.userId.contact,
            personId: thread.userId._id,
            created: moment(thread.created, "YYYYMMDD").fromNow()
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
  Thread.deleteOne({ _id: req.params.threadId }) //pass doctors role for restriction
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
