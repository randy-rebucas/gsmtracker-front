const Network = require('../models/network');
const moment = require('moment');

exports.create = async(req, res, next) => {
    try {
        const networkData = new Network({
            requesteeId: req.body.requesteeId,
            networkLists: {
                requesterId: req.body.requesterId
            }
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
    }
};

exports.update = async(req, res, next) => {
    try {
        let updatedNetwork = await Network.findOneAndUpdate({ "_id": req.body.networkId, "networkLists.requesterId": req.body.requesterId }, {
            "$set": {
                "networkLists.$.status": req.body.status
            }
        });
        const networkData = new Network({
            requesteeId: req.body.requesterId,
            networkLists: {
                status: req.body.status == 'denied' ? 1 : 2,
                requesterId: req.body.requesteeId
            }
        });
        let newNetwork = await networkData.save();

        res.status(200).json({ message: 'Update successful!' });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getMyNetwork = async(req, res, next) => {
    try {
        // console.log(req.query);
        // let network = await Network.find().exec(); // { 'requesteeId': req.query.requesteeId }
        let network = await Network.find({ 'requesteeId': req.query.requesterId })
            .populate({
                path: 'networkLists',
                populate: {
                    path: 'requesterId',
                    model: 'Person',
                    select: 'firstname midlename lastname' // space separated (selected fields only)
                }
            }).exec();

        const result = [];
        network.forEach(element => {
            let fullname = element.personId.firstname + ', ' + element.personId.lastname;
            result.push({ id: element.personId._id, name: fullname });
        });

        let count = await Network.countDocuments({ 'requesterId': req.query.requesteeId });

        res.status(200).json({
            total: count,
            results: result
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getAll = async(req, res, next) => {
  try {
    let networkQuery = await Network.find({ 'requesteeId': req.query.requesteeId }); //
    if (pageSize && currentPage) {
        networkQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let network = await networkQuery.populate('requesteeId').exec();

    const result = [];
    network.forEach(element => {
        let fullname = element.personId.firstname + ', ' + element.personId.lastname;
        result.push({ id: element.personId._id, name: fullname });
    });

    let count = await Network.countDocuments({ 'requesteeId': req.query.requesteeId });

    res.status(200).json({
        total: count,
        results: result
    });
  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.get = async(req, res, next) => {
  try {
    let network = await Network.findById(req.params.networkId).populate('requesterId', 'firstname midlename lastname').exec();
    if (!network) {
      throw new Error('Something went wrong.!');
    }
    res.status(200).json({
        _id: network._id,
        status: network.status,
        fullname: network.requesterId.firstname + ' ' + network.requesterId.midlename + ', ' + network.requesterId.lastname,
        requesterId: network.requesterId._id
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try {
    await Network.deleteOne({ _id: req.params.networkId });

    res.status(200).json({
      message: 'Deletion successfull!'
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
