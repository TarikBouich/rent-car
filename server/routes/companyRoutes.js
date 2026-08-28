const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken); // Protect all routes

router.get('/', companyController.getAll);
router.get('/support-contact', companyController.getSupportContact);
router.put('/support-contact', companyController.updateSupportContact);
router.get('/:id', companyController.getById);
router.post('/', companyController.create);
router.put('/:id', companyController.update);

module.exports = router;
