const Thread = require('../models/thread');
const Message = require('../models/message');
const User = require('../models/user');
const moment = require('moment');
/**
 * loop all users recepient to send sms
 */
exports.create = async (req, res, next) => {
  try {
    let threadUserCheck = await Thread.findOne({ userId: req.body.users.id });
    if (threadUserCheck === null) {
      const threadData = new Thread({
          userId: req.body.users.id,
          ownerId: req.body.ownerId
      });
      let thread = await threadData.save();
      let user = await User.findById(thread.ownerId);
      const messageData = new Message({
          message: req.body.message,
          threadId: thread._id,
          personId: user.personId
      });
      let message = await messageData.save();

      res.status(201).json({
          thread: {
              ...thread,
              id: thread._id,
          }
      });
    } else {
      // reply
      let user = await User.findById(threadUserCheck.ownerId);

      const messageData = new Message({
          message: req.body.message,
          threadId: threadUserCheck._id,
          personId: user.personId
      });
      let message = await messageData.save();
      res.status(201).json({
          messages: {
              ...message,
              id: message._id,
          }
      });
    }

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
    // this will eventually be handled by your error handling middleware
    // next(e)
  }
};

exports.getAll = async (req, res, next) => {
    try {
      let threads = await Thread.find({ 'ownerId': req.query.ownerId })
        .populate('userId')
        .sort({ 'created': 'asc' })
        .exec();
      newThreads = [];
      threads.forEach(element => {
          // find all message by threadId limit 1 order created desc
          //create object
          var myObj = {
            id: element._id,
            created: moment(element.created, "YYYYMMDD").fromNow(),
            ownerId: element.ownerId,
            fullname: element.userId.firstname + ' ' + element.userId.midlename + ', ' + element.userId.lastname
          };
            //push the object to your array
          newThreads.push(myObj);
      });
      res.status(200).json({
          threads: newThreads
      });
    } catch (e) {
      res.status(500).json({
          message: e.message
      });
      // this will eventually be handled by your error handling middleware
      // next(e)
    }
};

exports.getLastMessage = async (req, res, next) => {
  try {
    let lastMessage = await Message.findOne({ threadId: req.params.threadId })
      .sort({created: -1});
    res.status(200).json({
      message: lastMessage
    });
  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
}

exports.get = (req, res, next) => {
    Thread.findById(req.params.threadId)
        .populate('userId')
        .exec()
        .then(thread => {
          console.log(thread);
            if (thread) {
                res.status(200).json({
                    threadId: thread._id,
                    ownerId: thread.ownerId,
                    fullname: thread.userId.firstname + ' ' + thread.userId.midlename + ', ' + thread.userId.lastname,
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
