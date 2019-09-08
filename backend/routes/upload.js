const express = require('express');

const UploadController = require('../controllers/upload');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', UploadController.getAll);

router.get('/:uploadId', UploadController.get);

router.get('/latest', UploadController.getCurrent);

router.get('/last/:patientId', UploadController.getLast);

router.get('/complaint/:complaintId', UploadController.getByComplaint);

//router.put('/:uploadId', checkAuth, SettingController.update);

router.post('', checkAuth, UploadController.upload);

router.delete('/:uploadId', checkAuth, UploadController.delete);


module.exports = router;
