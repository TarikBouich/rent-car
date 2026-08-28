const express = require('express');
const router = express.Router();
const factureController = require('../controllers/factureController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', factureController.getAll);
router.get('/:id', factureController.getById);
router.post('/', factureController.create);
router.put('/:id', factureController.update);
router.delete('/:id', factureController.delete);

module.exports = router;
