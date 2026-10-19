const express = require('express');
const router = express.Router();
const publicLandingController = require('../controllers/publicLandingController');

// Public (no authentication) - only published landing data is exposed.
router.get('/landing/:agencyId', publicLandingController.getLanding);

module.exports = router;
