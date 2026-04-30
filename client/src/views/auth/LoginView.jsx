import { useState } from 'react';

export default function LoginView({ formData, error, loading, onChange, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="login-box">
          <h2 className="login-title">Login</h2>
          <form className="login-form" onSubmit={onSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={onChange} required placeholder="Enter your email" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={onChange}
                required
                placeholder="Enter your password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
            <p className="signup-link">
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
