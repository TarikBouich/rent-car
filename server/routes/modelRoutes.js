const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', modelController.getAll);
router.get('/brand/:brandId', modelController.getByBrand);
router.post('/', modelController.create);
router.put('/:id', modelController.update);
router.delete('/:id', modelController.delete);

module.exports = router;
