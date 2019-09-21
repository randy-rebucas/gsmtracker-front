const RespiratoryRate = require('../../models/records/respiratory_rate');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try{
    const newRespiratoryRate = new RespiratoryRate({
        respiratoryrate: req.body.respiratoryrate,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let respiratoryRate = await newRespiratoryRate.save();
    if (!respiratoryRate) {
      throw new Error('Something went wrong. Cannot create respiratory rate!');
    }

    res.status(201).json({
        message: 'Successfully added',
        weight: {
            ...respiratoryRate,
            id: respiratoryRate._id,
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
    const newPespiratoryRate = new RespiratoryRate({
        _id: req.body.respiratoryRateId,
        respiratoryrate: req.body.respiratoryrate,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let respiratoryRate = await RespiratoryRate.updateOne({ _id: req.params.respiratoryRateId }, newPespiratoryRate).exec();
    if (!respiratoryRate) {
      throw new Error('Something went wrong. Cannot update respiratory rate!');
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
    const resrateQuery = RespiratoryRate.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        resrateQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let respiratoryRate = await resrateQuery.exec();

    let count = await RespiratoryRate.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        rprs: respiratoryRate,
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
    let respiratoryRate = await RespiratoryRate.findById(req.params.respiratoryRateId).exec();
    if (!respiratoryRate) {
      throw new Error('Something went wrong. Cannot be found respiratory rate id: '+req.params.respiratoryRateId);
    }
    res.status(200).json(respiratoryRate);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try{
    const today = moment().startOf('day');

    let respiratoryrate = await RespiratoryRate.find({
      patientId: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(respiratoryrate);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try{
    let respiratoryrate = await RespiratoryRate.find({ 'patientId': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .exec();

    res.status(200).json(respiratoryrate);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await RespiratoryRate.deleteOne({ _id: req.params.respiratoryRateId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
