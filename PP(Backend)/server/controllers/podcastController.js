const fs = require('fs');
const path = require('path');

const getAllPodcasts = (req, res) => {
  const filePath = path.join(__dirname, '../data/podcasts.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load podcast data' });
    res.json(JSON.parse(data));
  });
};

module.exports = { getAllPodcasts };
