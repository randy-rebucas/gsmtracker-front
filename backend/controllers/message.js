const Message = require('../models/message');
const moment = require('moment');

exports.create = (req, res, next) => {
    const message = new Message({
      message: req.body.message,
      threadId: req.body.threadId,
      personId: req.body.personId
    });
    message.save().then(createdRecord => {
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
  Message.find({ 'threadId': req.query.threadId })
    .populate('personId')
    .sort({ 'created': 'asc' })
    .then(documents => {
        newMessages = [];
        documents.forEach(element => {
          //create object
          var myObj = {
            id: element._id,
            created: element.created,
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
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

// exports.getStatus = (req, res, next) => {
//   Message.findOne({ threadId: req.body.threadId })
//     .where('status', 0)
//     .then(result => {
//         console.log(result);
//     })
//     .catch(error => {
//         res.status(500).json({
//             message: error.message
//         });
//     });
// };

exports.delete = (req, res, next) => {
    Message.deleteOne({ _id: req.params.messageId })
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
