import React, { useState } from 'react';
import { Activity, ShieldAlert } from 'lucide-react';
import { loginUser, registerUser } from '../utils/mockData';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        if (!name || !email || !password) {
          setError('Please fill in all fields');
          return;
        }
        const user = registerUser(name, email, password);
        onLoginSuccess(user);
      } else {
        if (!email || !password) {
          setError('Please fill in all fields');
          return;
        }
        const user = loginUser(email, password);
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      padding: '20px',
      position: 'relative'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <Activity size={32} color="#0ea5e9" />
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '26px', fontWeight: '800' }}>
            Med<span style={{ color: '#0d9488' }}>Bot</span>
          </h1>
        </div>

        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '20px', marginBottom: '8px' }}>
          {isRegistering ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p style={{ color: 'var(--text-body)', fontSize: '14px', marginBottom: '24px' }}>
          {isRegistering ? 'Sign up to manage reminders and check symptoms.' : 'Sign in to access your personal health assistant.'}
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '12px',
            borderRadius: '12px',
            color: 'var(--accent-error)',
            fontSize: '13px',
            textAlign: 'left',
            marginBottom: '20px'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-body)' }}>
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-blue)',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '0'
              }}
            >
              {isRegistering ? 'Sign In' : 'Sign Up Free'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
