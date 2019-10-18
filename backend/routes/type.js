const express = require('express');

const Controller = require('../controllers/type');

const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', Controller.create); //checkAuth, 

router.put('/:typeId', checkAuth, Controller.update);

router.get('', Controller.getAll);

router.get('/:typeId', Controller.get);

router.delete('/:typeId', checkAuth, Controller.delete);

module.exports = router;