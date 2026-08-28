const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken); // Protect all routes

router.get('/', carController.getAll);
router.get('/:id', carController.getById);
router.post('/', carController.create);
router.put('/:id', carController.update);
router.delete('/:id', carController.delete);

module.exports = router;
