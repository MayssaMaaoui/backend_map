// models/note.js

const mongoose = require('mongoose');

// Define the schema for notes
const noteSchema = new mongoose.Schema({
  note: String,
  filePath: String,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
