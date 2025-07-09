import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

function PodcastDetails() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/podcasts?limit=100`)
      .then(res => res.json())
      .then(data => {
        const match = data.find(p => p.id.toString() === id);
        setPodcast(match);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/comments/${id}`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [id]);

  const handleAddComment = async () => {
    if (input.trim()) {
      const commentObj = { podcastId: id, text: input.trim() };
     const res = await fetch('http://localhost:5000/api/comments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify(commentObj),
});

      const newComment = await res.json();
         setComments(prev => [...prev, newComment]);
        setInput('');

// ✅ Safe + supported audio feedback
          try {
            const snd = new Audio('https://www.soundjay.com/buttons/sounds/button-4.mp3');
            snd.play();
          } catch (err) {
            console.warn("Audio playback failed:", err);
          }

          }
        };

  const deleteComment = async (commentId) => {
   await fetch(`http://localhost:5000/api/comments/${commentId}`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
});

    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const reactToComment = async (commentId, emoji) => {
    const res = await fetch(`http://localhost:5000/api/comments/${commentId}/react`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({ emoji }),
});

    const updated = await res.json();
    setComments(prev =>
      prev.map(c => (c.id === updated.id ? updated : c))
    );
  };

  if (!podcast) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>❌ Episode not found</h2>
        <Link to="/" className="theme-toggle">← Go back</Link>
      </div>
    );
  }

  return (
    <div className="episode-detail" style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <Link to="/" className="theme-toggle" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back</Link>

      <div data-aos="fade-up">
        <img src={podcast.image} alt={podcast.title} style={{ width: '100%', borderRadius: '12px' }} />
        <h2 style={{ marginTop: '1rem' }}>{podcast.title}</h2>
        <p>{podcast.description}</p>

        {podcast.audio ? (
          <audio controls style={{ width: '100%', marginTop: '1rem' }}>
            <source src={podcast.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        ) : (
          <p style={{ color: 'red' }}>⚠️ Audio not available</p>
        )}
      </div>

      <div data-aos="fade-up" style={{ marginTop: '2rem' }}>
        <h3>💬 Comments</h3>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comment..."
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '0.5rem',
            borderRadius: '10px',
            border: 'none',
            background: '#eee',
            color: '#333'
          }}
        />
        <button
          onClick={handleAddComment}
          style={{ marginTop: '0.5rem', padding: '8px 16px', borderRadius: '8px' }}
          className="theme-toggle"
        >
          Post
        </button>

        <ul style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
          {comments.map((c, i) => (
            <li
              key={c.id}
              data-aos={i % 2 === 0 ? 'fade-left' : 'flip-up'}
              data-aos-delay={i * 100}
              style={{
                marginBottom: '12px',
                background: ['#f1f5f9', '#fee2e2', '#fef3c7', '#dcfce7'][i % 4],
                color: '#111',
                padding: '12px',
                borderRadius: '10px',
                listStyle: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>@{c.username}</strong>: {c.text}
              </p>

              <div style={{ marginTop: '6px', fontSize: '1.2rem' }}>
                {['❤️', '😂', '😮', '👏'].map((emoji, eIndex) => (
                  <span
                    key={eIndex}
                    onClick={() => reactToComment(c.id, emoji)}
                    style={{
                      cursor: 'pointer',
                      marginRight: '6px',
                      transition: 'transform 0.2s',
                      transform: c.reaction === emoji ? 'scale(1.3)' : 'scale(1)',
                      filter: c.reaction === emoji ? 'drop-shadow(0 0 5px orange)' : 'none'
                    }}
                  >
                    {emoji}
                  </span>
                ))}
                    {c.username === localStorage.getItem('username') && (
                      <span
                        onClick={() => deleteComment(c.id)}
                        style={{
                          cursor: 'pointer',
                          marginLeft: '10px',
                          color: 'red',
                          fontSize: '1rem'
                        }}
                        title="Delete"
                      >
                        🗑️
                      </span>
                    )}

              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PodcastDetails;
