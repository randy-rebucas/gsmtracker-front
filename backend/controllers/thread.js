const Thread = require('../models/thread');
const Message = require('../models/message');
const User = require('../models/user');
const moment = require('moment');

exports.create = async (req, res, next) => {
  try {
    let threadUserCheck = await Thread.findOne({ userId: req.body.users.id });
    if (threadUserCheck === null) {
      const threadData = new Thread({
          userId: req.body.users.id,
          ownerId: req.body.ownerId
      });
      let thread = await threadData.save();

      const messageData = new Message({
          message: req.body.message,
          threadId: thread._id,
          personId: thread.ownerId
      });
      let message = await messageData.save();

      res.status(201).json({
          thread: {
              ...thread,
              id: thread._id,
          }
      });
    } else {
      const messageData = new Message({
          message: req.body.message,
          threadId: threadUserCheck._id,
          personId: threadUserCheck.ownerId
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
  }
};

exports.getAll = async (req, res, next) => {
    try {
      let threads = await Thread.find({ 'ownerId': req.query.ownerId })
        .populate('userId')
        .sort({ 'created': 'asc' })
        .exec();
      newThreads = [];
      await threads.forEach(element => {
          var myObj = {
            id: element._id,
            created: moment(element.created, "YYYYMMDD").fromNow(),
            ownerId: element.ownerId,
            fullname: element.userId.firstname + ' ' + element.userId.midlename + ', ' + element.userId.lastname
          };
          newThreads.push(myObj);
      });
      res.status(200).json({
          threads: newThreads
      });
    } catch (e) {
      res.status(500).json({
          message: e.message
      });
    }
};

exports.getLastMessage = async (req, res, next) => {
  try {
    let lastMessage = await Message.findOne({ threadId: req.params.threadId }).sort({created: -1});
    res.status(200).json({
      message: lastMessage
    });
  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
}

exports.get = async (req, res, next) => {
  try {
    let thread = await Thread.findById(req.params.threadId).populate('userId').exec();
    if (!thread) {
      throw new Error('Something went wrong.Cannot find thread id: '+req.params.threadId);
    }
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

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try {
    await Thread.deleteOne({ _id: req.params.threadId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};
