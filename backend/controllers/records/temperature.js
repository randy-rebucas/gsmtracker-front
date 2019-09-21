const Temperature = require('../../models/records/temperature');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try{
    const newTemperature = new Temperature({
        temperature: req.body.temperature,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let temperature = await newTemperature.save();
    if (!temperature) {
      throw new Error('Something went wrong. Cannot create temperature!');
    }

    res.status(201).json({
        message: 'Successfully added',
        temperature: {
            ...createdRecord,
            id: createdRecord._id,
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
    const newTemperature = new Temperature({
        _id: req.body.temperatureId,
        temperature: req.body.temperature,
        created: req.body.created_date,
        patientId: req.body.patienId
    });
    let temperature = await Temperature.updateOne({ _id: req.params.temperatureId }, newTemperature).exec();
    if (!temperature) {
      throw new Error('Something went wrong. Cannot update temperature!');
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
    const temperatureQuery = Temperature.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        temperatureQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let temperature = await temperatureQuery.exec();

    let count = await Temperature.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        temperatures: temperature,
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
    let temperature = await Temperature.findById(req.params.temperatureId).exec();
    if (!temperature) {
      throw new Error('Something went wrong. Cannot be found temperature id: '+req.params.temperatureId);
    }
    res.status(200).json(temperature);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try{
    const today = moment().startOf('day');
    // 'patient': req.params.patientId
    let temperature = await Temperature.find({
      patientId: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .exec()

    res.status(200).json(temperature);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try{
    let temperature = await Temperature.find({ 'patientId': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .exec();

    res.status(200).json(temperature);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await Temperature.deleteOne({ _id: req.params.temperatureId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
