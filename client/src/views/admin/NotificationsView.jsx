import { useMemo, useState } from 'react';
import BrandHeader from '../../components/BrandHeader';

export default function NotificationsView({ notifications, loading, error, onMarkRead, onMarkAll }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleClearFilters = () => {
    setSearchTerm('');
    setReadFilter('all');
    setTypeFilter('all');
  };

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((notification) => {
        const message = String(notification.message || '').toLowerCase();
        const sender = String(notification.sender?.username || 'staff member').toLowerCase();
        const notificationType = String(notification.notificationType || '').toLowerCase();
        return message.includes(normalizedSearch) || sender.includes(normalizedSearch) || notificationType.includes(normalizedSearch);
      });
    }

    if (readFilter === 'read') {
      filtered = filtered.filter((notification) => notification.isRead);
    } else if (readFilter === 'unread') {
      filtered = filtered.filter((notification) => !notification.isRead);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((notification) => notification.notificationType === typeFilter);
    }

    return filtered;
  }, [notifications, searchTerm, readFilter, typeFilter]);

  return (
    <main className="dashboard-shell">
      <BrandHeader />
      <div className="dashboard-container">
        <header className="dashboard-header admin-header">
          <h1>Staff Notifications</h1>
          <p>View and manage notifications from staff members</p>
        </header>

        <section className="notification-actions">
          <button className="primary-button" type="button" onClick={onMarkAll}>
            Mark All as Read
          </button>
        </section>

        <section className="search-sort-container notification-toolbar">
          <div className="search-filter-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          <div className="filter-options">
            <select className="filter-select" value={readFilter} onChange={(event) => setReadFilter(event.target.value)}>
              <option value="all">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>

            <select className="filter-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">All Types</option>
              <option value="stock_alert">Stock Alert</option>
              <option value="order_issue">Order Issue</option>
              <option value="system_alert">System Alert</option>
              <option value="general">General</option>
            </select>

            <button className="primary-button" type="button" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </section>

        {loading ? <p className="dashboard-note">Loading notifications...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <section className="notifications-list admin-notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <article key={notification._id} className={`notification-card ${!notification.isRead ? 'unread' : ''}`}>
                <div className="notification-card-header">
                  <div className="notification-meta">
                    <span className={`notification-type ${notification.notificationType}`}>{String(notification.notificationType).replace(/_/g, ' ')}</span>
                    <span className="notification-time">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}</span>
                  </div>
                  <div className="notification-actions-row">
                    {!notification.isRead ? (
                      <button className="primary-button" type="button" onClick={() => onMarkRead(notification._id)}>
                        Mark as Read
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-sender">From: {notification.sender?.username || 'Staff member'}</div>
              </article>
            ))
          ) : (
            <div className="no-notifications">
              <p>No notifications match your search or filters.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}