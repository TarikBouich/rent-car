const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken); // Protect all routes

router.get('/', agencyController.getAll);
router.get('/:id', agencyController.getById);
router.post('/', agencyController.create);
router.put('/:id', agencyController.update);
router.delete('/:id', agencyController.delete);

module.exports = router;
