const PastMedical = require('../../models/records/past_medical');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newPastMedical = new PastMedical({
        created: req.body.created,
        patientId: req.body.patientId,
        pastMedical: req.body.pastMedical
    });
    let pastMedical = await newPastMedical.save();
    if (!pastMedical) {
      throw new Error('Something went wrong. Cannot create past medical!');
    }
    res.status(201).json({
        message: 'Successfully added',
        pastMedical: {
            ...pastMedical,
            id: pastMedical._id,
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
    const newPastMedical = new PastMedical({
        _id: req.body.pastMedicalId,
        created: req.body.created,
        patientId: req.body.patientId,
        pastMedical: req.body.pastMedical
    });
    let pastMedical = await PastMedical.updateOne({ _id: req.params.pastMedicalId }, newPastMedical).exec();
    if (!pastMedical) {
      throw new Error('Something went wrong. Cannot update past medical!');
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
    const query = PastMedical.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let pastMedical = await query.exec();

    let count = await PastMedical.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        pastMedicals: pastMedical,
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
    let pastMedical = await PastMedical.findById(req.params.pastMedicalId).exec();
    if (!pastMedical) {
      throw new Error('Something went wrong. Cannot be found complaint id: '+req.params.pastMedicalId);
    }
    res.status(200).json(pastMedical);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let pastMedical = await PastMedical.find({
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(pastMedical);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let pastMedical = await PastMedical.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec();

    res.status(200).json(pastMedical);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await PastMedical.deleteOne({ _id: req.params.pastMedicalId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
