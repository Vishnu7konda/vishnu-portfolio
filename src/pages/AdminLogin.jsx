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
        <div className="al-logo">
          <i className="fas fa-shield-halved"></i>
        </div>
        <h1 className="al-title">Admin Panel</h1>
        <p className="al-sub">Vishnu Konda · Portfolio CMS</p>

        <form className="al-form" onSubmit={handleSubmit}>
          <div className="al-input-wrap">
            <i className="fas fa-lock al-input-icon"></i>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="al-input"
            />
            <button
              type="button"
              className="al-eye-btn"
              onClick={() => setShowPw((v) => !v)}
              tabIndex={-1}
            >
              <i className={`fas fa-eye${showPw ? '-slash' : ''}`}></i>
            </button>
          </div>

          {error && (
            <p className="al-error">
              <i className="fas fa-exclamation-circle"></i> {error}
            </p>
          )}

          <button type="submit" className="al-submit" disabled={loading}>
            {loading ? (
              <><i className="fas fa-spinner fa-spin"></i> Logging in…</>
            ) : (
              <><i className="fas fa-arrow-right-to-bracket"></i> Login</>
            )}
          </button>
        </form>

        <a href="/" className="al-back">
          <i className="fas fa-arrow-left"></i> Back to Portfolio
        </a>
      </div>
    </div>
  );
}
