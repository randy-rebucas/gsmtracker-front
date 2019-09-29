const PresentIllness = require('../../models/records/present_illness');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newPresentIllness = new PresentIllness({
        created: req.body.created,
        patientId: req.body.patientId,
        presentIllness: req.body.presentIllness
    });
    let presentIllness = await newPresentIllness.save();
    if (!presentIllness) {
      throw new Error('Something went wrong. Cannot create present illness!');
    }
    res.status(201).json({
        message: 'Successfully added',
        presentIllness: {
            ...presentIllness,
            id: presentIllness._id,
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
    const newPresentIllness = new PresentIllness({
        _id: req.body.presentIllnessId,
        created: req.body.created,
        patientId: req.body.patientId,
        presentIllness: req.body.presentIllness
    });
    let presentIllness = await PresentIllness.updateOne({ _id: req.params.presentIllnessId }, newPresentIllness).exec();
    if (!presentIllness) {
      throw new Error('Something went wrong. Cannot update present illness!');
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
    const query = PresentIllness.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let presentIllness = await query.exec();

    let count = await PresentIllness.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        presentIllnesses: presentIllness,
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
    let presentIllness = await PresentIllness.findById(req.params.presentIllnessId).exec();
    if (!presentIllness) {
      throw new Error('Something went wrong. Cannot be found complaint id: '+req.params.presentIllnessId);
    }
    res.status(200).json(presentIllness);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let presentIllness = await PresentIllness.find({
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(presentIllness);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let presentIllness = await PresentIllness.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec();

    res.status(200).json(presentIllness);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await PresentIllness.deleteOne({ _id: req.params.presentIllnessId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
