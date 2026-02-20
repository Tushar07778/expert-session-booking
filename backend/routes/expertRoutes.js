const express = require('express');
const router = express.Router();
const { getExperts, getExpertById } = require('../controllers/expertController');

// GET /api/experts - List with pagination, search, category filter
router.get('/', getExperts);

// GET /api/experts/:id - Single expert detail with annotated slots
router.get('/:id', getExpertById);

module.exports = router;
