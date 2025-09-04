import React, { useEffect, useState } from 'react';
import PodcastCard from './PodcastCard';

function PodcastList({ showLikedOnly, searchQuery = '' }) {
  const [podcasts, setPodcasts] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('title'); // 'title', 'date', 'duration'

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/podcasts?limit=100')
      .then(res => res.json())
      .then(data => {
        setPodcasts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch podcasts:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('likedPodcasts')) || [];
    setLikedIds(stored);
  }, [showLikedOnly]);

  // Filter and sort podcasts
  const filtered = podcasts
    .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(p => (showLikedOnly ? likedIds.includes(p.id) : true))
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'duration':
          return (a.duration || 0) - (b.duration || 0);
        default:
          return 0;
      }
    });

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">⏳</div>
        <p>Loading amazing podcasts...</p>
      </div>
    );
  }

  return (
    <div className="podcast-list-container">
      {/* Stats and Controls */}
      <div className="list-header">
        <div className="stats">
          <span className="stat-item">
            🔍 {filtered.length} podcasts found
          </span>
          {showLikedOnly && (
            <span className="stat-item">
              🔧 Showing liked only
            </span>
          )}
        </div>

        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            📊
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="sort-controls">
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="title">Sort by Title</option>
          <option value="date">Sort by Date</option>
          <option value="duration">Sort by Duration</option>
        </select>
      </div>

      {/* Podcast Grid/List */}
      <div className={`podcast-list ${viewMode === 'list' ? 'list-view' : ''}`}>
        {filtered.slice(0, visibleCount).map((podcast, index) => (
          <div
            key={podcast.id}
            className="podcast-card-wrapper"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <PodcastCard 
              podcast={podcast} 
              viewMode={viewMode}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filtered.length && (
        <div className="load-more-container">
          <button
            onClick={handleLoadMore}
            className="load-more-btn"
          >
            Load More Podcasts
            <span className="load-icon">⏳</span>
          </button>
        </div>
      )}

      {/* No Results */}
      {filtered.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No podcasts found</h3>
          <p>
            {searchQuery 
              ? `No podcasts match "${searchQuery}"`
              : showLikedOnly 
                ? "You haven't liked any podcasts yet"
                : "No podcasts available"
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default PodcastList;