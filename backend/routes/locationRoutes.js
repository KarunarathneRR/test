const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// GET route to get filtered node locations
router.get('/', locationController.getAllNodeLocations);

// GET route to get filter values (regions, districts, engineers)
router.get('/filters', locationController.getFilterValues);

module.exports = router;