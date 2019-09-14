const Message = require('../models/message');
const User = require('../models/user');

const moment = require('moment');

exports.create = async (req, res, next) => {
  try {
    let user = await User.findById(req.body.personId);
      const messageData = new Message({
        message: req.body.message,
        threadId: req.body.threadId,
        personId: user.personId
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
    // this will eventually be handled by your error handling middleware
    // next(e)
  }
};

exports.getAll = async (req, res, next) => {
  try {
    let unreadMessage = await Message.find({ 'threadId': req.query.threadId }).where({ status: 0 });
    if (unreadMessage.length > 0) {
      ids = [];
      unreadMessage.forEach(element => {
        ids.push(element._id);
      });
      let readMessage = await Message.updateMany({ "_id": { "$in": ids } }, { "$set": { "status": 1 } } , {multi: true});
      console.log(readMessage.n + ' items updated');
    }

    const user = await Message.find({ 'threadId': req.query.threadId }).populate('personId');
    newMessages = [];
    user.forEach(element => {
      //create object
      var myObj = {
        id: element._id,
        created: moment(element.created, "YYYYMMDD").fromNow(),
        message: element.message,
        fullname : element.personId.firstname + ' ' + element.personId.midlename + ', ' +element.personId.lastname,
        personId : element.personId._id
      };
      //push the object to your array
      newMessages.push( myObj );
    });
    res.status(200).json({
        messages: newMessages
    });

  } catch (e) {
    res.status(500).json({
      message: e.message
    });
    //this will eventually be handled by your error handling middleware
    // next(e)
  }
};

exports.delete = (req, res, next) => {
    Message.deleteOne({ _id: req.params.messageId })
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
