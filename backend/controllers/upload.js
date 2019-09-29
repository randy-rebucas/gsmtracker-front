const IncomingForm = require('formidable').IncomingForm
const Upload = require('../models/upload');
const moment = require('moment');

exports.getAll = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const fileQuery = Upload.find({ 'patientId': req.query.patientId });

    if (pageSize && currentPage) {
      fileQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let file = await fileQuery;
    if (!file) {
      throw new Error('Something went wrong.Cannot fetch all files!');
    }
    newFiles = [];
    file.forEach(element => {
      var obj = {
        _id: element._id,
        created: element.created,
        path: element.path,
        type: element.type,
        name: element.name,
        patientId: element.patientId,
      }
      newFiles.push(obj);
    });

    let count = await Upload.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
      message: 'Fetched successfully!',
      files: newFiles,
      max: count
    });

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.update = async(req, res, next) => {
  try {
    const newFile = new Upload({
        _id: req.body.fileId,
        name: req.body.name
    });
    let file = await Upload.updateOne({ _id: req.params.uploadId }, newFile).exec();
    if (!file) {
      throw new Error('Something went wrong.Cannot update the file!');
    }

    res.status(200).json({ message: 'Update successful!' });

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.get = async(req, res, next) => {
  try {
    let file = await Upload.findById(req.params.uploadId);
    if (!file) {
      throw new Error('Something went wrong.Cannot find file id: '+req.params.uploadId);
    }

    res.status(200).json(file);

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try {
    const today = moment().startOf('day');

    let file = await Upload.find({
          created: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
          }
      });
    if (!file) {
      throw new Error('Something went wrong. No file found!');
    }

    res.status(200).json(file);

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.getLast = async (req, res, next) => {
  try {
    let file = await Upload.find({ 'patientId': req.params.patientId }).limit(1).sort({ 'created': 'desc' }).exec();

    if (!file) {
      throw new Error('Something went wrong. No file found!');
    }
    res.status(200).json(file);

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

/**
 * @param complaintId
 * @since v1
 */
exports.getByComplaint = async(req, res, next) => {
  try {
    let file = await Upload.find({complaintId: req.params.complaintId}).exec();

    if (!file) {
      throw new Error('Something went wrong. No file found!');
    }

    res.status(200).json(file);

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};

exports.upload = async (req, res, next) => {
  try {
    var form = new IncomingForm();
    form.uploadDir = 'attachments';
    form.keepExtensions = true;
    form.type = 'multipart';
    form.maxFieldsSize = 20 * 1024 * 1024; //10mb
    form.maxFileSize = 200 * 1024 * 1024;
    form.hash = true;
    form.multiples = false;
    // form.on('field', function(name, value) {
    //   // console.log(name + ': ' + value);
    // });

    // form.on('file', (name, file) => {

    // });

    form.on('error', (err) => {
      console.log(err);
    });

    form.on('end', () => {
      res.json()
    });

    form.parse(req, function(err, fields, files) {
      const url = req.protocol + '://' + req.get('host');
      const upload = new Upload({
        path: url + '/' + files.file.path,
        name: files.file.name,
        type: files.file.type,
        patientId: fields.patientId
      });
      upload.save();

    });
  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};


exports.delete = async(req, res, next) => {
  try {
    let file = await Upload.deleteOne({ _id: req.params.uploadId }).exec();
    if (!file) {
      throw new Error('Something went wrong. Cannot delete this file!');
    }

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (e) {
    res.status(500).json({
        message: e.message
    });
  }
};
