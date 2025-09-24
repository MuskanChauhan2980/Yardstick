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
      onLogin(response.data.token);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <>
      <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
        }

        .login-container {
          background: #fff;
          padding: 2rem 2.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          width: 360px;
          text-align: center;
          animation: fadeIn 0.6s ease-in-out;
        }

        .login-container h2 {
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
          color: #333;
        }

        .login-container form {
          display: flex;
          flex-direction: column;
        }

        .login-container input {
          margin-bottom: 1rem;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 12px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .login-container input:focus {
          border-color: #2575fc;
          box-shadow: 0 0 6px rgba(37, 117, 252, 0.4);
        }

        .login-container button {
          background: #2575fc;
          color: #fff;
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .login-container button:hover {
          background: #1b5ed9;
        }

        .error {
          margin-top: 1rem;
          color: #e74c3c;
          font-size: 0.95rem;
          font-weight: 500;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="login-container">
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
