import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid password');
      onLogin(data.token);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-page">
      <div className="al-card">
        <span className="al-logo">VK</span>
        <h1 className="al-title">Welcome back</h1>
        <p className="al-sub">Sign in to manage your portfolio content.</p>

        <form className="al-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-password" className="al-label">Password</label>
          <div className="al-input-wrap">
            <i className="fas fa-lock al-input-icon" aria-hidden="true"></i>
            <input
              id="admin-password"
              type={showPw ? 'text' : 'password'}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              autoFocus
              className="al-input"
            />
            <button
              type="button"
              className="al-eye-btn"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              <i className={`fas fa-eye${showPw ? '-slash' : ''}`} aria-hidden="true"></i>
            </button>
          </div>

          {error && (
            <p className="al-error" role="alert">
              <i className="fas fa-circle-exclamation" aria-hidden="true"></i> {error}
            </p>
          )}

          <button type="submit" className="al-submit" disabled={loading || !password}>
            {loading ? <><i className="fas fa-spinner fa-spin" aria-hidden="true"></i> Signing in…</> : 'Sign in'}
          </button>
        </form>

        <a href="/" className="al-back">
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to portfolio
        </a>
      </div>
    </div>
  );
}
