const asyncHandler = require('express-async-handler');
const Note = require('../models/noteModel');

// @desc    Create note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }

  const note = await Note.create({
    text: req.body.text,
    user: req.user.id,
  });

  res.status(200).send(note);
});

// @desc    Read all notes
// @route   GET /api/notes
// @access  Private
const readNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.status(200).send(notes);
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error('Note not found');
  }

  // Соответсвует ли залогиненный пользователь пользователю данного note
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Пользователь данной note не авторизован');
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).send(updatedNote);
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error('Note not found');
  }

  console.log('удаление');

  // Соответсвует ли залогиненный пользователь пользователю данного note
  if (note.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Пользователь данной note не авторизован');
  }

  await note.remove();
  console.log('удаление завершение');
  res.status(200).send({ id: req.params.id });
});

module.exports = {
  createNote,
  readNotes,
  updateNote,
  deleteNote,
};
