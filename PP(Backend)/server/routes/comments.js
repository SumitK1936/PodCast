const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const verifyToken = require('../middleware/verifyAuth');

const COMMENTS_PATH = './data/comments.json';

// Helper to read/write
const readComments = () => {
  const raw = fs.readFileSync(COMMENTS_PATH);
  return JSON.parse(raw);
};

const writeComments = (comments) => {
  fs.writeFileSync(COMMENTS_PATH, JSON.stringify(comments, null, 2));
};

// Get all comments for a podcast
router.get('/:id', (req, res) => {
  const comments = readComments();
  const filtered = comments.filter(c => c.podcastId === req.params.id);
  res.json(filtered);
});

// Add a comment
router.post('/', verifyToken, (req, res) => {
const { podcastId, text } = req.body;

if (!podcastId || !text) {
return res.status(400).json({ message: 'Podcast ID and comment text are required' });
}

const newComment = {
  id: uuidv4(),
  podcastId,
  text,
  reaction: null,
  username: req.user.username  // ✅ add username from token
};


const comments = readComments();
comments.push(newComment);
writeComments(comments);
res.json(newComment);
});

router.delete('/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const user = req.user; // from verifyToken

  const comments = readData();
  const comment = comments.find(c => c.id === id);

  if (!comment) {
    return res.status(404).json({ message: 'Comment not found' });
  }

  if (comment.username !== user.username) {
    return res.status(403).json({ message: 'Not authorized to delete this comment' });
  }

  const updated = comments.filter(c => c.id !== id);
  writeData(updated);
  res.json({ message: 'Comment deleted' });
});



// React to a comment
router.patch('/:id/react', verifyToken, (req, res) => {
  const { emoji } = req.body;
  const comments = readComments();
  const updated = comments.map(c => c.id === req.params.id ? { ...c, reaction: emoji } : c);
  writeComments(updated);
  const found = updated.find(c => c.id === req.params.id);
  res.json(found);
});

module.exports = router;
