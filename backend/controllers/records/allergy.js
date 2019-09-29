const Allergy = require('../../models/records/allergy');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newAllergy = new Allergy({
        allergy: req.body.allergy,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let allergy = await newAllergy.save();
    if (!allergy) {
      throw new Error('Something went wrong. Cannot create allergy!');
    }
    res.status(201).json({
        message: 'Successfully added',
        allergy: {
            ...allergy,
            id: allergy._id,
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
    const newAllergy = new Allergy({
        _id: req.body.allergyId,
        allergy: req.body.allergy,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let allergy = await Height.updateOne({ _id: req.params.allergyId }, newAllergy).exec();
    if (!allergy) {
      throw new Error('Something went wrong. Cannot update allergy!');
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
    const query = Allergy.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
      query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    let allergy = await query.exec();

    let count = await Allergy.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        allergies: allergy,
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
    let allergy = await Allergy.findById(req.params.allergyId).exec();
    if (!allergy) {
      throw new Error('Something went wrong. Cannot be found allergy id: '+req.params.allergyId);
    }
    res.status(200).json(allergy);

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
    let allergy = await Allergy.find({
      patient: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(allergy);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let allergy = await Allergy.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec();

    res.status(200).json(allergy);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try {
    await Allergy.deleteOne({ _id: req.params.allergyId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
