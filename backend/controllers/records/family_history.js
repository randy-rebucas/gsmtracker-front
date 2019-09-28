const FamilyHistory = require('../../models/records/family_history');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newFamilyHistory = new FamilyHistory({
        created: req.body.created,
        patientId: req.body.patientId,
        familyHistory: req.body.familyHistory
    });
    let familyHistory = await newFamilyHistory.save();
    if (!familyHistory) {
      throw new Error('Something went wrong. Cannot create family history!');
    }
    res.status(201).json({
        message: 'Successfully added',
        familyHistory: {
            ...familyHistory,
            id: familyHistory._id,
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
    const newFamilyHistory = new FamilyHistory({
        _id: req.body.familyHistoryId,
        created: req.body.created,
        patientId: req.body.patientId,
        familyHistory: req.body.familyHistory
    });
    let familyHistory = await FamilyHistory.updateOne({ _id: req.params.familyHistoryId }, newFamilyHistory).exec();
    if (!familyHistory) {
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
    const query = FamilyHistory.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let familyHistory = await query.exec();

    let count = await FamilyHistory.countDocuments({ 'patientId': req.query.patientId });

    console.log(familyHistory);

    res.status(200).json({
        message: 'Fetched successfully!',
        familyHistories: familyHistory,
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
    let familyHistory = await FamilyHistory.findById(req.params.familyHistoryId).exec();
    if (!familyHistory) {
      throw new Error('Something went wrong. Cannot be found complaint id: '+req.params.familyHistoryId);
    }
    res.status(200).json(familyHistory);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let familyHistory = await FamilyHistory.find({
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(familyHistory);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let familyHistory = await FamilyHistory.find({ 'patientId': req.params.patientId })
        .limit(1)
        .sort({ 'created': 'desc' })
        .exec();

    res.status(200).json(familyHistory);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await FamilyHistory.deleteOne({ _id: req.params.familyHistoryId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
