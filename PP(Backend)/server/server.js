const express = require('express');
const cors = require('cors');
const podcastRoutes = require('./routes/podcasts');
const commentRoutes = require('./routes/comments');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/podcasts', podcastRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
