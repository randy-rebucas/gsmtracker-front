const express = require('express');

const Controller = require('../../controllers/records/present_illness');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, Controller.create);

router.put('/:presentIllnessId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/latest', Controller.getCurrent);

router.get('/last/:patientId', Controller.getLast);

router.get('/:presentIllnessId', Controller.get);

router.delete('/:presentIllnessId', checkAuth, Controller.delete);


module.exports = router;
