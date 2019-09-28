const Prescription = require('../../models/records/prescription');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try{
    const newPrescription = new Prescription({
      created: req.body.created,
      patientId: req.body.patientId
    });

    prescriptionData = req.body.prescriptions;
    for (let index = 0; index < prescriptionData.length; index++) {
      newPrescription.prescriptions.push(prescriptionData[index]);
    }

    let prescription = await newPrescription.save();
    if (!prescription) {
      throw new Error('Something went wrong. Cannot create prescription!');
    }
    res.status(201).json({
        message: 'Successfully added',
        prescription: {
            ...prescription,
            id: prescription._id,
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
    const newPrescription = new Prescription({
      _id: req.body.prescriptionId,
      created: req.body.created,
      patientId: req.body.patientId
    });
    prescriptionData = req.body.prescriptions;
    for (let index = 0; index < prescriptionData.length; index++) {
      newPrescription.prescriptions.push(prescriptionData[index]);
    }

    let prescription = await Prescription.updateOne({ _id: req.params.prescriptionId }, newPrescription).exec();
    if (!prescription) {
      throw new Error('Something went wrong. Cannot update prescription!');
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
    const prescriptionQuery = Prescription.find({ 'patientId': req.query.patientId }).sort({'created': 'desc'});

    if (pageSize && currentPage) {
      prescriptionQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let prescription = await prescriptionQuery.exec();
    newPrescription = [];
    prescription.forEach(element => {
      var obj = {
        _id: element._id,
        created: element.created,
        patientId: element.patientId,
        prescriptions: element.prescriptions
      }
      newPrescription.push(obj);
    });

    let count = await Prescription.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        prescriptions: newPrescription,
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
    let prescription = await Prescription.findById(req.params.prescriptionId).exec();
    if (!prescription) {
      throw new Error('Something went wrong. Cannot be found prescription id: '+req.params.prescriptionId);
    }
    res.status(200).json(prescription);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let prescription = await Prescription.find({
          created: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
          }
      }).exec();

    res.status(200).json(prescription);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try{
    let prescription = await Prescription.find({patientId: req.params.patientId})
      .limit(1)
      .sort({ 'created': 'desc' })
      .exec();

    res.status(200).json(prescription);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await Prescription.deleteOne({ _id: req.params.prescriptionId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

