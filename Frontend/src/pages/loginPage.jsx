import React, { useState } from 'react';
import axios from 'axios';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { email, password });

      const token = response.data.token;

      // Save token in localStorage
      localStorage.setItem('token', token);

      // Decode JWT to extract tenantSlug
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (decoded.tenantSlug) {
        localStorage.setItem('tenantSlug', decoded.tenantSlug);
      }

      // Keep existing callback
      onLogin(token);

    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <>
      <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #242424;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
        }

        .login-card {
          background: #ffffff;
          padding: 40px 35px;
          border-radius: 15px;
          box-shadow: 0 4px 16px rgba(106, 17, 203, 0.15);
          width: 360px;
          text-align: center;
        }

        .login-card h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #000000ff;
          margin-bottom: 25px;
        }

        .login-card form {
          display: flex;
          flex-direction: column;
        }

        .login-card input {
          margin-bottom: 15px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #dcdfe6;
          font-size: 1rem;
          transition: border 0.2s ease, box-shadow 0.2s ease;
          outline: none;
        }

        .login-card input:focus {
          border-color: #2575fc;
          box-shadow: 0 0 6px rgba(37, 117, 252, 0.3);
        }

        .login-card button {
          background: #4f37de;
          color: #fff;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .login-card button:hover {
          background: #1a5fd1;
        }

        .error {
          margin-top: 10px;
          color: #e74c3c;
          font-size: 0.95rem;
          font-weight: 500;
        }
      `}</style>

      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit">Log In</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
}

export default LoginPage;
