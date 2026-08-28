const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', stateController.getAll);
router.get('/stream', stateController.stream);
router.get('/:key', stateController.getByKey);
router.put('/:key', stateController.upsert);
router.delete('/:key', stateController.remove);

module.exports = router;
