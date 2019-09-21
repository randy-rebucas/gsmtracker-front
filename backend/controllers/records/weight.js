const Weight = require('../../models/records/weight');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try{
    const newWeight = new Weight({
        weight: req.body.weight,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let weight = await newWeight.save();
    if (!weight) {
      throw new Error('Something went wrong. Cannot create weight!');
    }

    res.status(201).json({
        message: 'Successfully added',
        weight: {
            ...weight,
            id: weight._id,
        }
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.update = async(req, res, next) => {
  try{
    const newWeight = new Weight({
        _id: req.body.weightId,
        weight: req.body.weight,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let weight = await Weight.updateOne({ _id: req.params.weightId }, newWeight).exec();
    if (!weight) {
      throw new Error('Something went wrong. Cannot update weight!');
    }

    res.status(200).json({ message: 'Update successful!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getAll = async(req, res, next) => {
  try{
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const weightQuery = Weight.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        weightQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let weight = await weightQuery.exec();

    let count = await Weight.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        weights: weight,
        max: count
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.get = async(req, res, next) => {
  try{
    let weight = await Weight.findById(req.params.weightId).exec()
    if (!weight) {
      throw new Error('Something went wrong. Cannot be found weight id: '+req.params.weightId);
    }
    res.status(200).json(weight);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try{
    const today = moment().startOf('day');

    let weight = await Weight.find({
      patient: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .exec();

    res.status(200).json(weight);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try{
    let weight = await Weight.find({ 'patientId': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .exec();

    res.status(200).json(weight);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await Weight.deleteOne({ _id: req.params.weightId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
