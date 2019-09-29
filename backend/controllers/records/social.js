const Social = require('../../models/records/social');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newSocial = new Social({
        created: req.body.created,
        patientId: req.body.patientId,
        social: req.body.social
    });
    let social = await newSocial.save();
    if (!social) {
      throw new Error('Something went wrong. Cannot create social history!');
    }
    res.status(201).json({
        message: 'Successfully added',
        social: {
            ...social,
            id: social._id,
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
    const newSocial = new Social({
        _id: req.body.socialId,
        created: req.body.created,
        patientId: req.body.patientId,
        social: req.body.social
    });
    let social = await Social.updateOne({ _id: req.params.socialId }, newSocial).exec();
    if (!social) {
      throw new Error('Something went wrong. Cannot update social history!');
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
    const query = Social.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let social = await query.exec();

    let count = await Social.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        socials: social,
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
    let social = await Social.findById(req.params.pastMedicalId).exec();
    if (!social) {
      throw new Error('Something went wrong. Cannot be found complaint id: '+req.params.socialId);
    }
    res.status(200).json(social);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let social = await Social.find({
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(social);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let social = await Social.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec();

    res.status(200).json(social);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await Social.deleteOne({ _id: req.params.socialId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
