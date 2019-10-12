const Message = require('../models/message');
const User = require('../models/user');
const Person = require('../models/person');
const moment = require('moment');
var ObjectId = require('mongoose').Types.ObjectId;

exports.create = async (req, res, next) => {
  try {
    const messageData = new Message({
      message: req.body.message,
      threadId: req.body.threadId,
      userId: req.body.userId
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

    const user = await Message.find({ 'threadId': req.query.threadId }).populate({
      path: 'userId',
      populate: {
        path: 'personId',
        model: Person
      }
    }).exec();
    newMessages = [];
    user.forEach(element => {
      var myObj = {
        id: element._id,
        created: moment(element.created, "YYYYMMDD").fromNow(),
        message: element.message,
        avatar: element.userId.avatarPath,
        fullname : element.userId.personId.firstname + ' ' +element.userId.personId.lastname,
        personId : element.userId.personId._id
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

exports.getAllUnread = async(req, res, next) => {
  try {
    const newMessages = await Message.aggregate([
      { $unwind : "$messages" },
      { $lookup: {
          "from": "threads",
          "localField": "messages.licenseId",
          "foreignField": "_id",
          "as": "threads"
      }},
      { $match: { licenseId : new ObjectId(req.params.licenseId) } }, // .toString()
      { $group:
          {
            _id:
              {
                //day: {$dayOfMonth: "$created"},
                //month: {$month: "$created"},
                year: {$year: "$created"}
              },
              unread: {$sum: { $cond: [{ $eq: ["$status", 0 ] }, 1, 0] }},
              count: {$sum: 1}
          }
        },
        { $sort: { "created": -1 } }
      ]);
      console.log(newMessages);

      res.status(200).json({
        count: 0 // newMessages
      });

    // let unread = await Message.countDocuments({
    //   'licenseId': req.params.licenseId,
    //   'status': 0
    // }).exec()

    // res.status(200).json({
    //     count: unread
    // });

  } catch (e) {
      res.status(500).json({
          message: e.message
      });
  }
};
