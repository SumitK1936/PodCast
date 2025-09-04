import React, { useEffect, useState } from 'react';
import './PodcastCard.css';
import { Link } from 'react-router-dom';

function PodcastCard({ podcast, viewMode = 'grid', index = 0 }) {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const likedIds = JSON.parse(localStorage.getItem('likedPodcasts')) || [];
    setLiked(likedIds.includes(podcast.id));
  }, [podcast.id]);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const likedIds = JSON.parse(localStorage.getItem('likedPodcasts')) || [];
    const updated = liked
      ? likedIds.filter(id => id !== podcast.id)
      : [...likedIds, podcast.id];

    localStorage.setItem('likedPodcasts', JSON.stringify(updated));
    setLiked(!liked);
  };

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: podcast.title,
        text: `Check out this amazing podcast: ${podcast.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div className="podcast-card-list">
        <div className="card-image-container">
          <img
            src={podcast.image}
            alt={podcast.title}
            className="card-image"
          />
          <button
            className="play-overlay"
            onClick={handlePlay}
          >
            ▶️
          </button>
        </div>

        <div className="card-content">
          <div className="card-header">
            <h3 className="card-title">{podcast.title}</h3>
            <div className="card-meta">
              <span className="meta-item">
                ⏱️ {formatDuration(podcast.duration)}
              </span>
              <span className="meta-item">
                📅 {formatDate(podcast.createdAt)}
              </span>
              {podcast.author && (
                <span className="meta-item">
                  👤 {podcast.author}
                </span>
              )}
            </div>
          </div>

          <p className="card-description">
            {podcast.description || 'No description available'}
          </p>

          <div className="card-actions">
            <button
              className={`action-btn like-btn ${liked ? 'liked' : ''}`}
              onClick={toggleLike}
            >
              {liked ? '❤️' : '🤍'} {liked ? 'Liked' : 'Like'}
            </button>

            <button
              className="action-btn"
              onClick={handleShare}
            >
              📤 Share
            </button>

            <Link to={`/podcast/${podcast.id}`} className="action-btn">
              📖 Details
            </Link>
          </div>
        </div>

        <div className="card-audio">
          <audio
            controls
            src={podcast.audio}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="podcast-card">
      <Link to={`/podcast/${podcast.id}`} className="card-link">
        <div className="card-image-container">
          <img
            src={podcast.image}
            alt={podcast.title}
            className="card-image"
          />
          <button
            className="play-overlay"
            onClick={handlePlay}
          >
            ▶️
          </button>
          
          {isPlaying && (
            <div className="playing-indicator">
              🔊
            </div>
          )}
        </div>

        <div className="card-content">
          <div className="card-header">
            <h3 className="card-title">{podcast.title}</h3>
            <div className="card-meta">
              <span className="meta-item">
                ⏱️ {formatDuration(podcast.duration)}
              </span>
              {podcast.author && (
                <span className="meta-item">
                  👤 {podcast.author}
                </span>
              )}
            </div>
          </div>

          <p className="card-description">
            {podcast.description?.substring(0, 100) || 'No description available'}
            {podcast.description?.length > 100 && '...'}
          </p>

          <div className="card-actions">
            <button
              className={`action-btn like-btn ${liked ? 'liked' : ''}`}
              onClick={toggleLike}
            >
              {liked ? '❤️' : '🤍'} {liked ? 'Liked' : 'Like'}
            </button>

            <button
              className="action-btn"
              onClick={handleShare}
            >
              📤
            </button>
          </div>
        </div>

        <div className="card-audio">
          <audio
            controls
            src={podcast.audio}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </Link>
    </div>
  );
}

export default PodcastCard;
