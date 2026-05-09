import BrandHeader from '../../components/BrandHeader';

export default function NotificationsView({ notifications, loading, error, notificationType, message, onNotificationTypeChange, onMessageChange, onSubmit, sending = false }) {
  return (
    <main className="notifications-page">
      <BrandHeader />
      <div className="notifications-container">
        <div className="notifications-header">
          <h1><i className="fas fa-bell"></i> Send Notifications</h1>
          <p>Send important notifications to the admin team</p>
        </div>

        <div className="notification-form-container">
          <form className="notification-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="notification_type">Notification Type</label>
              <select id="notification_type" name="notification_type" className="form-control" value={notificationType} onChange={(event) => onNotificationTypeChange(event.target.value)} required>
                <option value="stock_alert">Stock Alert</option>
                <option value="order_issue">Order Issue</option>
                <option value="system_alert">System Alert</option>
                <option value="general">General Notification</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" className="form-control" rows="5" placeholder="Enter your notification message here..." value={message} onChange={(event) => onMessageChange(event.target.value)} required />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={sending}>
                <i className="fas fa-paper-plane"></i> {sending ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </form>
        </div>

        {loading ? <p className="dashboard-note">Loading notifications...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <div className="recent-notifications">
          <h2>Recent Notifications</h2>
          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <article key={notification._id} className="notification-item">
                  <div className="notification-header">
                    <span className={`notification-type ${notification.notificationType}`}>{String(notification.notificationType).replace(/_/g, ' ')}</span>
                    <span className="notification-time">{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}</span>
                  </div>
                  <div className="notification-message">{notification.message}</div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-notifications">
              <i className="far fa-bell-slash"></i>
              <p>No notifications sent yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
