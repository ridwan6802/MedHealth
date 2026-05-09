import BrandHeader from '../../components/BrandHeader';

export default function DashboardView({ summary, loading, error }) {
  const cardItems = [
    { icon: '👥', title: 'Manage Users', desc: 'Add, edit, or remove users', href: '/admin/users', color: 'users' },
    { icon: '🏷️', title: 'Manage Categories', desc: 'Organize medicine categories', href: '/admin/categories', color: 'categories' },
    { icon: '💊', title: 'Manage Medicines', desc: 'Update medicine inventory', href: '/admin/medicines', color: 'medicines' },
    { icon: '💬', title: 'Messages', desc: 'Review customer conversations', href: '/admin/messages', color: 'messages' },
    { icon: '🔔', title: 'Notifications', desc: 'Check staff notifications', href: '/admin/notifications', color: 'notifications' }
  ];

  return (
    <main className="dashboard-shell">
      <BrandHeader />
      <div className="dashboard-container admin-dashboard-container">
        <header className="dashboard-header admin-header">
          <h1>Welcome, Admin</h1>
          <p>Manage your pharmacy efficiently</p>
        </header>

        {loading ? <p className="dashboard-note">Loading dashboard summary...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        {summary ? (
          <section className="dashboard-cards stats-grid admin-stats">
            <article className="dashboard-card stat-card">
              <strong>{summary.users ?? 0}</strong>
              <span>Users</span>
            </article>
            <article className="dashboard-card stat-card">
              <strong>{summary.medicines ?? 0}</strong>
              <span>Medicines</span>
            </article>
            <article className="dashboard-card stat-card">
              <strong>{summary.categories ?? 0}</strong>
              <span>Categories</span>
            </article>
          </section>
        ) : null}

        <section className="admin-management-cards">
          {cardItems.map((item) => (
            <a key={item.title} href={item.href} className={`admin-card admin-card-${item.color}`}>
              <div className="admin-card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}
