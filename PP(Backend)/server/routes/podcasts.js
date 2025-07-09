const express = require('express');
const router = express.Router();

const generatePodcasts = (count = 50) => {
  const podcasts = [];
  for (let i = 1; i <= count; i++) {
    podcasts.push({
      id: i,
      title: `Podcast Episode ${i}`,
      description: `Description of episode ${i}. This one talks about tech, life, or something interesting.`,
      audio: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`,
      image: `https://picsum.photos/seed/podcast${i}/400/300`
    });
  }
  return podcasts;
};

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const data = generatePodcasts(limit);
  res.json(data);
});

module.exports = router;
