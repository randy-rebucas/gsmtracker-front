const PulseRate = require('../../models/records/pulse_rate');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try{
    const newPulseRate = new PulseRate({
        pulserate: req.body.pulserate,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let pulseRate = await newPulseRate.save();
    if (!pulseRate) {
      throw new Error('Something went wrong. Cannot create respiratory rate!');
    }

    res.status(201).json({
        message: 'Successfully added',
        pulseRate: {
            ...pulseRate,
            id: pulseRate._id,
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
    const newPulseRate = new PulseRate({
        _id: req.body.pulseRateId,
        pulserate: req.body.pulserate,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let pulseRate = await PulseRate.updateOne({ _id: req.params.pulseRateId }, newPulseRate).exec();
    if (!pulseRate) {
      throw new Error('Something went wrong. Cannot update pulse rate!');
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
    const query = PulseRate.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
      query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let pulseRate = await query.exec();

    let count = await PulseRate.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        prs: pulseRate,
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
    let pulseRate = await PulseRate.findById(req.params.pulseRateId).exec();
    if (!pulseRate) {
      throw new Error('Something went wrong. Cannot be found pulse rate id: '+req.params.pulseRateId);
    }
    res.status(200).json(pulseRate);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try{
    const today = moment().startOf('day');

    let pulserate = await PulseRate.find({
      patientId: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(pulserate);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try{
    let pulserate = await PulseRate.find({ 'patientId': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .exec();

    res.status(200).json(pulserate);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await PulseRate.deleteOne({ _id: req.params.pulseRateId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
