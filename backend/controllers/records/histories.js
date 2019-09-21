const Histories = require('../../models/records/histories');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try{
    const newHistory = new Histories({
        type: req.body.type,
        description: req.body.description,
        created: req.body.created,
        patientId: req.body.patientId
    });
    let history = await newHistory.save();
    if (!history) {
      throw new Error('Something went wrong. Cannot create history!');
    }
    res.status(201).json({
        message: 'Successfully added',
        history: {
            ...history,
            id: history._id,
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
    const newHistory = new Histories({
        _id: req.body.historyId,
        type: req.body.type,
        description: req.body.description,
        created: req.body.created_date,
        patientId: req.body.patientId
    });
    let history = await Histories.updateOne({ _id: req.params.historyId }, newHistory).exec();
    if (!history) {
      throw new Error('Something went wrong. Cannot update history!');
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
    const historyQuery = Histories.find({ 'patientId': req.query.patientId }).sort({'created': 'desc'});

    if (pageSize && currentPage) {
      historyQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let history = await historyQuery.exec();
    let count = await Histories.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        histories: history,
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
    let history = await Histories.findById(req.params.historyId).exec();
    if (!history) {
      throw new Error('Something went wrong. Cannot be found history id: '+req.params.historyId);
    }
    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try{
    const today = moment().startOf('day');
    let history = await Histories.find({
      patientId: req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        }).exec();

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let history = await Histories.find({ 'patientId': req.params.patientId })
      .limit(2)
      .sort({ 'created': 'desc' })
      .exec();

    res.status(200).json(history);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try {
    await Histories.deleteOne({ _id: req.params.historyId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
