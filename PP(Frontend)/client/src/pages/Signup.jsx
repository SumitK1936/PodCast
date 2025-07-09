import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const Signup = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  let saved = JSON.parse(localStorage.getItem('savedUsers')) || [];
        if (!saved.includes(form.username)) {
        saved.push(form.username);
        localStorage.setItem('savedUsers', JSON.stringify(saved));
        }
        localStorage.setItem('username', form.username);

  return (
    <AuthLayout>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🆕 Signup</h2>
      <form
        onSubmit={handleSignup}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Create Account</button>
        {error && <p style={errorStyle}>{error}</p>}
        <p style={linkStyle}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#fff', textDecoration: 'underline' }}>Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

const inputStyle = {
  width: '100%',
  maxWidth: '300px',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '1rem',
  border: '1px solid #ccc',
  background: '#1e293b',
  color: '#fff',
  fontSize: '1rem',
};

const buttonStyle = {
  width: '100%',
  maxWidth: '300px',
  padding: '12px',
  borderRadius: '8px',
  background: '#10b981',
  border: 'none',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: '0.3s',
};

const errorStyle = {
  color: 'tomato',
  marginTop: '0.5rem',
  textAlign: 'center',
  maxWidth: '300px',
};

const linkStyle = {
  marginTop: '1rem',
  textAlign: 'center',
  maxWidth: '300px',
};

export default Signup;
