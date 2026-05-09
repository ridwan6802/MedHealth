import BrandHeader from '../../components/BrandHeader';

export default function UsersView({ users, loading, error, search, roleFilter, formData, editingId, showForm, onSearchChange, onRoleFilterChange, onChange, onSubmit, onEdit, onDelete, onCancel }) {
  return (
    <main className="admin-manage-page">
      <BrandHeader />
      <div className="manage-users-container">
        <div className="user-header">
          <h1>Manage Users</h1>
          <button id="toggle-form-btn" type="button" className="btn btn-primary" onClick={onCancel}>+ Add New User</button>
        </div>

        <div className="user-form-container" style={{ display: showForm || editingId ? 'block' : 'none' }}>
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={onChange} placeholder="e.g., johndoe" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={onChange} placeholder="e.g., john@example.com" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={onChange} placeholder="e.g., 1234567890" />
              </div>
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" value={formData.role} onChange={onChange} required>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={onChange} placeholder={editingId ? 'Leave blank to keep current password' : 'Enter a password'} required={!editingId} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" value={formData.address} onChange={onChange} placeholder="Full address" rows="2" />
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <div className="form-actions">
              <button type="submit" className="btn btn-submit">{editingId ? 'Update' : 'Save'}</button>
              <button type="button" className="btn btn-cancel" onClick={onCancel}>Cancel</button>
            </div>
          </form>
        </div>

        <div className="user-list-container">
          <h2>User List</h2>
          <div className="search-filter">
            <input type="text" placeholder="Search users..." value={search} onChange={(event) => onSearchChange(event.target.value)} />
            <select value={roleFilter} onChange={(event) => onRoleFilterChange(event.target.value)}>
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {loading ? <p className="dashboard-note">Loading users...</p> : null}

          <div className="user-list">
            <div className="list-header">
              <span className="user-id">ID</span>
              <span className="user-name">Name</span>
              <span className="user-email">Email</span>
              <span className="user-phone">Phone</span>
              <span className="user-role">Role</span>
              <span className="user-actions">Actions</span>
            </div>
            <div className="list-body">
              {users.map((user) => (
                <div className="user-item" key={user._id} data-role={user.role} data-name={String(user.username || '').toLowerCase()}>
                  <span className="user-id">{String(user._id).slice(-4)}</span>
                  <span className="user-name">{user.username}</span>
                  <span className="user-email">{user.email}</span>
                  <span className="user-phone">{user.phone || '-'}</span>
                  <span className={`user-role ${user.role}-role`}>{user.role}</span>
                  <span className="user-actions">
                    <button type="button" className="btn-edit" onClick={() => onEdit(user)}>Edit</button>
                    <button type="button" className="btn-delete" onClick={() => onDelete(user._id)}>Delete</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
