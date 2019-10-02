const Endorsement = require('../../models/records/endorsement');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newEndorsement = new Endorsement({
        created: req.body.created,
        patientId: req.body.patientId,
        endorsement: req.body.endorsement,
        endorsementRef: req.body.endorsementRef
    });
    let endorsement = await newEndorsement.save();
    if (!endorsement) {
      throw new Error('Something went wrong. Cannot create endorsement!');
    }
    res.status(201).json({
        message: 'Successfully added',
        endorsement: {
            ...endorsement,
            id: endorsement._id,
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
    const newEndorsement = new Endorsement({
        _id: req.body.endorsementId,
        created: req.body.created,
        patientId: req.body.patientId,
        endorsement: req.body.endorsement,
        endorsementRef: req.body.endorsementRef
    });
    let endorsement = await Endorsement.updateOne({ _id: req.params.endorsementId }, newEndorsement).exec();
    if (!endorsement) {
      throw new Error('Something went wrong. Cannot update endorsement!');
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
    const query = Endorsement.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let endorsement = await query.exec();

    let count = await Endorsement.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        endorsements: endorsement,
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
    let endorsement = await Endorsement.findById(req.params.endorsementId).exec();
    if (!endorsement) {
      throw new Error('Something went wrong. Cannot be found complaint id: '+req.params.endorsementId);
    }
    res.status(200).json(endorsement);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let endorsement = await Endorsement.find({
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(endorsement);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let endorsement = await Endorsement.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec();

    res.status(200).json(endorsement);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await Endorsement.deleteOne({ _id: req.params.endorsementId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
