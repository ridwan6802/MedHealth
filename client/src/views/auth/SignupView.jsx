import { useState } from 'react';

export default function SignupView({ formData, error, loading, onChange, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Create Your Account</h1>
            <p>Join MedHealth to get your medicines delivered quickly</p>
          </div>

          <form className="signup-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="username">Full Name</label>
              <input id="username" type="text" name="username" value={formData.username} onChange={onChange} placeholder="Enter your full name" required />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={onChange} placeholder="Enter your email" required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" name="phone" value={formData.phone} onChange={onChange} placeholder="Enter your phone number" required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  placeholder="Create a password"
                  required
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="password-strength">
                <div className="strength-meter" />
                <div className="strength-text" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  placeholder="Confirm your password"
                  required
                />
                <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword((value) => !value)} aria-label="Toggle confirm password visibility">
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={onChange} />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            <div className="login-link">
              Already have an account? <a href="/login">Log in</a>
            </div>
          </form>
        </div>

        <aside className="signup-benefits">
          <h2>Why Sign Up?</h2>
          <ul className="benefits-list">
            <li>✅ Fastest medicine delivery in your city</li>
            <li>✅ Exclusive discounts for members</li>
            <li>✅ Free doctor consultations</li>
            <li>✅ Prescription management</li>
            <li>✅ Order history tracking</li>
          </ul>

          <div className="secure-badge">🔒 100% Secure Registration</div>
        </aside>
      </div>
    </main>
  );
}
