const Network = require('../models/network');
const moment = require('moment');

exports.create = async (req, res, next) => {
  try {
    const networkData = new Network({
      requesterId: req.body.requesterId,
      requesteeId: req.body.requesteeId
    });
    let network = await networkData.save();
    res.status(200).json({
        message: {
            ...network,
            id: network._id,
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

exports.updateStatus = async (req, res, next) => {
  const network = new Network({
    _id: req.body.networkId,
    status: req.body.status
  });
  await Network.updateOne({ _id: req.body.networkId },
    network
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
};
exports.getAllNetwork = (req, res, next) => {
  const currentPage = +req.query.page;
  const patientQuery = Patient.find({
    'userId': req.query.userId
  });
  patientQuery
    .populate('personId')
    .then(documents => {
        fetchedPatients = documents;
        return Patient.countDocuments();
      }
    )
    .then(
      count => {
        const result = [];
        fetchedPatients.forEach(element => {
          let fullname = element.personId.firstname + ', ' + element.personId.lastname;
          result.push({ id: element.personId._id, name: fullname });
        });
        res.status(200).json({
          total: count,
          results: result
        });
      }
    )
    .catch(
      error => {
        res.status(500).json({
          message: error.message
        });
      }
    );
}
exports.getAll = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const networkQuery = Network.find({ 'requesteeId': req.query.requesteeId }); //

  let fetchedRecord;
  if (pageSize && currentPage) {
    networkQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  networkQuery
      .populate('requesterId', 'firstname midlename lastname')
      .exec()
      .then(documents => {
        networks = [];
        documents.forEach(element => {
        //     //create object
            // var myObj = {
            //   _id: element._id,
            //   fullname: element.requesterId.firstname + ' ' + element.requesterId.midlename + ', ' +element.requesterId.lastname,
            //   requesterId: element.requesterId._id,
            //   status: element.status
            // };
            let fullname = element.requesterId.firstname + ' ' + element.requesterId.midlename + ', ' +element.requesterId.lastname;
            networks.push({ id: element.requesterId._id, name: fullname });
        //     //   //push the object to your array
            // newAppointments.push( myObj );
        });
          fetchedRecord = networks;
          return Network.countDocuments();
      })
      .then(count => {
          res.status(200).json({
              message: 'Fetched successfully!',
              results: fetchedRecord,
              total: count
          });
      })
      .catch(error => {
          res.status(500).json({
              message: error.message
          });
      });
};

exports.get = (req, res, next) => {
  Network.findById(req.params.networkId)
  .populate('requesterId', 'firstname midlename lastname')
  .exec()
  .then(network => {
      if (network) {
        res.status(200).json({
          _id: network._id,
          status: network.status,
          fullname: network.requesterId.firstname + ' ' + network.requesterId.midlename + ', ' +network.requesterId.lastname,
          requesterId: network.requesterId._id
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
  Network.deleteOne({ _id: req.params.networkId })
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
