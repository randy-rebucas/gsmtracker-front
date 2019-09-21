const Height = require('../../models/records/height');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newHeight = new Height({
        height: req.body.height,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let height = await newHeight.save();
    if (!height) {
      throw new Error('Something went wrong. Cannot create height!');
    }
    res.status(201).json({
        message: 'Successfully added',
        height: {
            ...height,
            id: height._id,
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
    const newHeight = new Height({
        _id: req.body.heightId,
        height: req.body.height,
        created: req.body.created_date,
        patientId: req.body.patientId
    });
    let height = await Height.updateOne({ _id: req.params.heightId }, newHeight).exec();
    if (!height) {
      throw new Error('Something went wrong. Cannot update height!');
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
    const currentPage = +req.query.page;
    const pageSize = +req.query.pagesize;
    const heightQuery = Height.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        heightQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    let height = await heightQuery.exec();

    let count = await Height.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        heights: height,
        max: count
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.get = async(req, res, next) => {
  try {
    let height = await Height.findById(req.params.heightId).exec();
    if (!height) {
      throw new Error('Something went wrong. Cannot be found height id: '+req.params.heightId);
    }
    res.status(200).json(height);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');
    //addpatient id
    let height = await Height.find({
      patient: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(height);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let height = await Height.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec();

    res.status(200).json(height);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try {
    await Height.deleteOne({ _id: req.params.heightId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
