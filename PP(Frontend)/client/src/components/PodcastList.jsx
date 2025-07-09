import React, { useEffect, useState } from 'react';
import PodcastCard from './PodcastCard';

function PodcastList({ showLikedOnly }) {
const [podcasts, setPodcasts] = useState([]);
const [search, setSearch] = useState('');
const [likedIds, setLikedIds] = useState([]);
const [visibleCount, setVisibleCount] = useState(4); // Load 4 initially

useEffect(() => {
 fetch('http://localhost:5000/api/podcasts?limit=100')
.then(res => res.json())
.then(data => setPodcasts(data))
.catch(err => console.error('Failed to fetch podcasts:', err));
}, []);

useEffect(() => {
const stored = JSON.parse(localStorage.getItem('likedPodcasts')) || [];
setLikedIds(stored);
}, [showLikedOnly]);

const filtered = podcasts
.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
.filter(p => (showLikedOnly ? likedIds.includes(p.id) : true));

const handleLoadMore = () => {
setVisibleCount(prev => prev + 4); // Show 4 more each click
};

return (
<>
<div style={{ marginBottom: '1.5rem', textAlign: 'center' }} className="fade-in-up">
<input
type="text"
placeholder="Search podcast title..."
value={search}
onChange={(e) => setSearch(e.target.value)}
style={{
padding: '10px',
fontSize: '1rem',
width: '80%',
maxWidth: '400px',
borderRadius: '12px',
border: 'none',
outline: 'none',
background: '#eee',
color: '#333'
}}
/>
</div>
 <div className="podcast-list">
    {filtered.slice(0, visibleCount).map(podcast => (
      <PodcastCard key={podcast.id} podcast={podcast} />
    ))}
  </div>

  {visibleCount < filtered.length && (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <button
        onClick={handleLoadMore}
        className="theme-toggle"
        style={{ padding: '10px 20px', fontSize: '1rem' }}
      >
        Load More 🎧
      </button>
    </div>
  )}
</>
);
}

export default PodcastList;