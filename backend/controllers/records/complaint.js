const Complaint = require('../../models/records/complaint');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newComplaint = new Complaint({
        created: req.body.created,
        patientId: req.body.patientId,
        complaints: req.body.complaints
    });
    // complaintData = req.body.complaints;
    // for (let index = 0; index < complaintData.length; index++) {
    //   newComplaint.complaints.push(complaintData[index]);
    // }
    let complaint = await newComplaint.save();
    if (!complaint) {
      throw new Error('Something went wrong. Cannot create complaint!');
    }
    res.status(201).json({
        message: 'Successfully added',
        complaint: {
            ...complaint,
            id: complaint._id,
        }
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.update = async(req, res, next) => {
  try {
    const newComplaint = new Complaint({
        _id: req.body.complaintId,
        created: req.body.created,
        patientId: req.body.patientId,
        complaints: req.body.complaints
    });
    // complaintData = req.body.complaints;
    // for (let index = 0; index < complaintData.length; index++) {
    //   newComplaint.complaints.push(complaintData[index]);
    // }
    let complaint = await Complaint.updateOne({ _id: req.params.complaintId },newComplaint).exec();
    if (!complaint) {
      throw new Error('Something went wrong. Cannot update complaint!');
    }
    res.status(200).json({ message: 'Update successful!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getAll = async(req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const complaintQuery = Complaint.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        complaintQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let complaint = await complaintQuery.exec();

    let count = await Complaint.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        complaints: complaint,
        max: count
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.get = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.complaintId).exec();
    if (!complaint) {
      throw new Error('Something went wrong. Cannot be found complaint id: '+req.params.complaintId);
    }
    res.status(200).json(complaint);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let complaint = await Complaint.find({
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(complaint);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let complaint = await Complaint.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec();

    res.status(200).json(complaint);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await Complaint.deleteOne({ _id: req.params.complaintId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
