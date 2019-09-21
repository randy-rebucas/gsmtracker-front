const Note = require('../../models/records/progress_note');
const moment = require('moment');

exports.create = async(req, res, next) => {
  try{
    const newNote = new Note({
      note: req.body.note,
        created: req.body.created,
        complaintId: req.body.complaintId,
        patientId: req.body.patientId
    });
    let note = await newNote.save();
    if (!note) {
      throw new Error('Something went wrong. Cannot create note!');
    }
    res.status(201).json({
        message: 'Successfully added',
        note: {
            ...note,
            id: note._id,
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
    const newNote = new Note({
        _id: req.body.progressNoteId,
        note: req.body.note,
        created: req.body.created_date,
        complaintId: req.body.complaintId,
        patientId: req.body.patientId
    });
    let note = await Note.updateOne({ _id: req.params.progressNoteId }, newNote).exec();
    if (!note) {
      throw new Error('Something went wrong. Cannot update note!');
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
    const noteQuery = Note.find({ 'patientId': req.query.patientId }).sort({'created': 'desc'});

    if (pageSize && currentPage) {
      noteQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    let note = await noteQuery.populate('complaintId').exec();

    newNotes = [];
    note.forEach(element => {
      var obj = {
        _id: element._id,
        created: element.created,
        complaints: element.complaintId.complaints,
        patientId: element.patientId,
        note: element.note
      }
      newNotes.push(obj);
    });

    let count = await Note.countDocuments({ 'patientId': req.query.patientId });

    res.status(200).json({
        message: 'Fetched successfully!',
        notes: newNotes,
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
    let note = await Note.findById(req.params.progressNoteId).exec();
    if (!note) {
      throw new Error('Something went wrong. Cannot be found note id: '+req.params.progressNoteId);
    }
    res.status(200).json(note);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getCurrent = async(req, res, next) => {
  try{
    const today = moment().startOf('day');

    let note = await Note.find({
            created: {
              $gte: today.toDate(),
              $lte: moment(today).endOf('day').toDate()
          }
      }).exec();

    res.status(200).json(note);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getLast = async(req, res, next) => {
  try{
    let note = await Note.find({ 'patientId': req.params.patientId })
      .limit(1)
      .sort({ 'created': 'desc' })
      .exec();

    res.status(200).json(note);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.getByComplaint = async(req, res, next) => {
  try{
    let note = await Note.find({
      complaintId: req.params.complaintId
    }).exec();

    res.status(200).json(note);

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
  try{
    await Note.deleteOne({ _id: req.params.progressNoteId }).exec();

    res.status(200).json({ message: 'Deletion successfull!' });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};
