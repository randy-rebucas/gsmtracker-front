const express = require('express');

const Controller = require('../../controllers/records/progress_note');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:progressNoteId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/complaint/:complaintId', Controller.getByComplaint);

router.get('/:progressNoteId', Controller.get);

router.delete('/:progressNoteId', checkAuth, Controller.delete);


module.exports = router;
