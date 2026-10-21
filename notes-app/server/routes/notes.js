const router = require('express').Router();
const mongoose = require('mongoose');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

router.use(auth);   // every route below needs a valid token

// GET /api/notes?search=abc&tag=work
router.get('/', async (req, res) => {
  const { search, tag } = req.query;

  const filter = { user: req.userId };          // ONLY this user's notes
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { title:   { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
  res.json(notes);
});

// POST /api/notes
router.post('/', async (req, res) => {
  const { title, content, tags, pinned } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const note = await Note.create({
    title, content, tags, pinned,
    user: req.userId,                           // owner comes from the token, never from the client
  });
  res.status(201).json(note);
});

// PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid note id' });
  }

  const { title, content, tags, pinned } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },   // must exist AND belong to me
    { title, content, tags, pinned },
    { new: true, runValidators: true }
  );

  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid note id' });
  }

  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });

  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
});

module.exports = router;