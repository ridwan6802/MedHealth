import BrandHeader from '../../components/BrandHeader';

export default function ProfileView({ loading, saving, error, successMessage, user, formData, onChange, onSubmit }) {
  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

  return (
    <main className="profile-page">
      <BrandHeader />
      <div className="profile-container">
        <section className="profile-hero">
          <div className="profile-avatar">{(user?.username || 'U').slice(0, 1).toUpperCase()}</div>
          <div>
            <h1>Profile</h1>
            <p>Update your MedHealth account details and password from one place.</p>
          </div>
          <span className="profile-role-badge">{roleLabel}</span>
        </section>

        {loading ? <p className="dashboard-note">Loading profile...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {successMessage ? <p className="form-success">{successMessage}</p> : null}

        <div className="profile-grid">
          <aside className="profile-summary-card">
            <h2>Account Summary</h2>
            <p><strong>Username:</strong> {user?.username || '-'}</p>
            <p><strong>Email:</strong> {user?.email || '-'}</p>
            <p><strong>Phone:</strong> {user?.phone || '-'}</p>
            <p><strong>Address:</strong> {user?.address || '-'}</p>
            <p><strong>Role:</strong> {roleLabel}</p>
          </aside>

          <section className="user-form-container profile-form-card">
            <form onSubmit={onSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input id="username" name="username" value={formData.username} onChange={onChange} placeholder="Enter your username" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="Enter your email" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={onChange} placeholder="Enter your phone number" />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <input id="role" value={roleLabel} disabled />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea id="address" name="address" value={formData.address} onChange={onChange} placeholder="Enter your address" rows="3" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input id="password" name="password" type="password" value={formData.password} onChange={onChange} placeholder="Leave blank to keep your current password" />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={onChange} placeholder="Repeat the new password" />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}