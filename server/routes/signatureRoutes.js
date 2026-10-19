const express = require('express');
const router = express.Router();
const signatureController = require('../controllers/signatureController');

// Public routes: the client opens the link without being logged in.
router.get('/', signatureController.getSession);
router.post('/', signatureController.handlePost);

module.exports = router;
