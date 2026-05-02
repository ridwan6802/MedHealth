import BrandHeader from '../../components/BrandHeader';

export default function NotificationsView({ notifications, loading, error, onMarkRead, onMarkAll }) {
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

        {loading ? <p className="dashboard-note">Loading notifications...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <section className="notifications-list admin-notifications-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
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
              <p>No notifications available</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}