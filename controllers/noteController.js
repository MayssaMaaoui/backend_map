// controllers/noteController.js

const Note = require('../models/note');

// Controller for saving a new note
const saveNote = (req, res) => {
  console.log(req.body); // Log the note text
  console.log(req.file);  // Log the uploaded file details

  const { note } = req.body;
  const filePath = req.file ? `http://192.168.74.238:3000/uploads/${req.file.filename}` : null;

  const newNote = new Note({
    note: note,
    filePath: filePath,
  });

  newNote.save()
    .then(() => res.status(200).send('Note saved successfully'))
    .catch(err => res.status(500).send('Error saving note: ' + err));
};

// Controller for fetching all notes
const getNotes = (req, res) => {
  Note.find()
    .then(notes => res.status(200).json(notes))
    .catch(err => res.status(500).send('Error fetching notes: ' + err));
};

module.exports = {
  saveNote,
  getNotes,
};
