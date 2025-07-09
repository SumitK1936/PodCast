import React, { useEffect, useState } from 'react';
import './PodcastCard.css';
import { Link } from 'react-router-dom';

function PodcastCard({ podcast }) {
  const [liked, setLiked] = useState(false);

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

  return (
    <Link
      to={`/podcast/${podcast.id}`}
      className="podcast-card"
      data-aos="zoom-in"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div
        style={{
          background: '#1e1e2f',
          color: '#fff',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <img
          src={podcast.image}
          alt={podcast.title}
          style={{ width: '100%', borderRadius: '10px' }}
        />
        <h2 style={{ marginTop: '0.8rem', fontSize: '1.2rem' }}>{podcast.title}</h2>
        <audio
          controls
          src={podcast.audio}
          style={{
            width: '100%',
            marginTop: '1rem',
            backgroundColor: '#2d2d3f',
            borderRadius: '10px'
          }}
        ></audio>
        <button
          onClick={toggleLike}
          className="like-btn"
          style={{
            marginTop: '1rem',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: liked ? '#f87171' : '#334155',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          {liked ? '❤️ Liked' : '🤍 Like'}
        </button>
      </div>
    </Link>
  );
}

export default PodcastCard;
