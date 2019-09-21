const Message = require('../models/message');
const User = require('../models/user');

const moment = require('moment');

exports.create = async (req, res, next) => {
  try {
    const messageData = new Message({
      message: req.body.message,
      threadId: req.body.threadId,
      personId: req.body.personId
    });
    let message = await messageData.save();
    res.status(201).json({
      thread: {
          ...message,
          id: message._id,
      }
    });
  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    /**
     * find all unread message and update them to read
     */
    let unreadMessage = await Message.find({ 'threadId': req.query.threadId }).where({ status: 0 });
    if (unreadMessage.length > 0) {
      ids = [];
      unreadMessage.forEach(element => {
        ids.push(element._id);
      });
      await Message.updateMany({ "_id": { "$in": ids } }, { "$set": { "status": 1 } } , {multi: true});
    }

    const user = await Message.find({ 'threadId': req.query.threadId }).populate('personId');
    newMessages = [];
    user.forEach(element => {
      var myObj = {
        id: element._id,
        created: moment(element.created, "YYYYMMDD").fromNow(),
        message: element.message,
        fullname : element.personId.firstname + ' ' +element.personId.lastname,
        personId : element.personId._id
      };
      newMessages.push( myObj );
    });
    res.status(200).json({
        messages: newMessages
    });

  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try {
    await Message.deleteOne({ _id: req.params.messageId }).exec();
    res.status(200).json({
      message: 'Deletion successfull!'
    });
  } catch (e) {
    res.status(500).json({
      message: e.message
    });
  }
};
