const express = require('express');
const router = express.Router();
const { createDocument, getDocuments } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// Create a new document (protected)
router.post('/', protect, createDocument);

// Get all documents (protected)
router.get('/', protect, getDocuments);

module.exports = router;