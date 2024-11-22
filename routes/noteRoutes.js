// routes/noteRoutes.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const noteController = require('../controllers/noteController');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Route for saving a note
router.post('/save-note', upload.single('file'), noteController.saveNote);

// Route for fetching notes
router.get('/get-notes', noteController.getNotes);

module.exports = router;
