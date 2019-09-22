const Assessment = require('../../models/records/assessment');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try {
    const newAssessment = new Assessment({
        created: req.body.created,
        complaintId: req.body.complaintId,
        patientId: req.body.patientId
    });
    assessmentData = req.body.diagnosis;
    for (let index = 0; index < assessmentData.length; index++) {
      newAssessment.diagnosis.push(assessmentData[index]);
    }
    treatmentData = req.body.treatments;
    for (let index = 0; index < treatmentData.length; index++) {
      newAssessment.treatments.push(treatmentData[index]);
    }
    let assessment = await newAssessment.save();
    if (!assessment) {
      throw new Error('Something went wrong. Cannot create assessment!');
    }

    res.status(201).json({
        message: 'Successfully added',
        assessment: {
            ...assessment,
            id: assessment._id,
        }
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.update = async (req, res, next) => {
  try {
    const newAssessment = new Assessment({
        _id: req.body.assessmentId,
        created: req.body.created,
        complaintId: req.body.complaintId,
        patientId: req.body.patientId
    });
    assessmentData = req.body.diagnosis;
    for (let index = 0; index < assessmentData.length; index++) {
      newAssessment.diagnosis.push(assessmentData[index]);
    }
    treatmentData = req.body.treatments;
    for (let index = 0; index < treatmentData.length; index++) {
      newAssessment.treatments.push(treatmentData[index]);
    }
    let assessment = await Assessment.updateOne({ _id: req.params.assessmentId }, newAssessment).exec();
    if (!assessment) {
      throw new Error('Something went wrong. Cannot update assessment!');
    }

    res.status(200).json({ message: 'Update successful!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const assessmentQuery = Assessment.find({ 'patientId': req.query.patientId }).sort({ 'created': 'desc' });

    if (pageSize && currentPage) {
        assessmentQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let assessment = await assessmentQuery.populate('complaintId').exec();
    if (!assessment) {
      throw new Error('Something went wrong. Cannot fetch all assessment!');
    }

    newAssessment = [];
    assessment.forEach(element => {
      var obj = {
        _id: element._id,
        created: element.created,
        complaints: element.complaintId.complaints,
        patientId: element.patientId,
        diagnosis: element.diagnosis,
        treatments: element.treatments
      }
      newAssessment.push(obj);
    });

    let count = await Assessment.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        assessments: newAssessment,
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
    let assessment = await Assessment.findById(req.params.assessmentId).exec();
    if (!assessment) {
      throw new Error('Something went wrong. Cannot be found asessment id: '+req.params.assessmentId);
    }

    res.status(200).json(complaint);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let assessment = await Assessment.find({
      'patientId': req.params.patientId,
            created: {
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            }
        })
        .exec();
    if (!assessment) {
      throw new Error('Something went wrong. No assessment found!');
    }

    res.status(200).json(assessment);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try {
    let assessment = await Assessment.find({ 'patientId': req.params.patientId }).limit(1).sort({ 'created': 'desc' }).exec();
    if (!assessment) {
      throw new Error('Something went wrong. No assessment found!');
    }

    res.status(200).json(assessment);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
/**
 * @param complaintId
 * @since v1
 */
exports.getByComplaint = async(req, res, next) => {
  try {
    let assessment = await Assessment.find({complaintId: req.params.complaintId}).exec();
    if (!assessment) {
      throw new Error('Something went wrong. No assessment found!');
    }

    res.status(200).json(assessment);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try {
    await Assessment.deleteOne({ _id: req.params.assessmentId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
