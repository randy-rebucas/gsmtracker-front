const express = require('express');

const UploadController = require('../controllers/upload');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', UploadController.getAll);

router.post('', checkAuth, UploadController.upload);

router.get('/latest', UploadController.getCurrent);

router.get('/last/:patientId', UploadController.getLast);

router.get('/complaint/:complaintId', UploadController.getByComplaint);

router.get('/:uploadId', UploadController.get);

router.put('/:uploadId', checkAuth, UploadController.update);

router.delete('/:uploadId', checkAuth, UploadController.delete);

module.exports = router;
