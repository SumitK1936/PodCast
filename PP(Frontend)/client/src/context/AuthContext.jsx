import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [token, setToken] = useState(localStorage.getItem('token') || null);

useEffect(() => {
if (token && !user) {
const payload = JSON.parse(atob(token.split('.')[1]));
setUser({ username: payload.username });
localStorage.setItem('username', payload.username);
}
}, [token, user]);

const login = (token) => {
const payload = JSON.parse(atob(token.split('.')[1]));
const username = payload.username;

setToken(token);
setUser({ username });

localStorage.setItem('token', token);
localStorage.setItem('username', username);

const userTokens = JSON.parse(localStorage.getItem('userTokens') || '{}');
userTokens[username] = token;
localStorage.setItem('userTokens', JSON.stringify(userTokens));

};

const logout = () => {
localStorage.removeItem('token');
setToken(null);
setUser(null);
};

const switchAccount = (username) => {
const tokens = JSON.parse(localStorage.getItem('userTokens') || '{}');
const token = tokens[username];

if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));

  setToken(token);
  setUser({ username: payload.username });

  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
  window.location.reload();
} else {
  toast.error('No token found for this user');
}

};

return (
<AuthContext.Provider value={{ user, token, login, logout, switchAccount }}>
{children}
</AuthContext.Provider>
);
};
