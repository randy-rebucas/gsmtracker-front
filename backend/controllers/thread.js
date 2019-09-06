const Thread = require('../models/thread');
const Message = require('../models/message');
const moment = require('moment');
/**
 * loop all users recepient to send sms
 */
exports.create = (req, res, next) => {
    const thread = new Thread({
      userId: req.body.users.id,
      ownerId: req.body.ownerId
    });
    thread.save().then(createdThread => {
      const message = new Message({
        message: req.body.message,
        threadId: createdThread._id,
        personId: req.body.ownerId
      });
      message.save()
        .then(createdMessage => {
          this.reply(req);
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
};

exports.reply = (req, res, next) => {
  console.log(req);
  // const message = new Message({
  //   message: req.body.message,
  //   threadId: createdThread._id,
  //   personId: req.body.ownerId
  // });
  // message.save()
  //   .then(createdMessage => {
  //     this.reply();
  //     res.status(201).json({
  //       thread: {
  //           ...createdThread,
  //           id: createdThread._id,
  //       }
  //     });
  //   })
  //   .catch(error => {
  //     res.status(500).json({
  //       message: error.message
  //     });
  //   });
}

exports.getAll = (req, res, next) => {

    Thread.find({ 'ownerId': req.query.ownerId })
    .populate('userId')
      .sort({ 'created': 'asc' })
      .then(documents => {
          res.status(200).json({
            threads: documents
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
            created: thread.created
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
