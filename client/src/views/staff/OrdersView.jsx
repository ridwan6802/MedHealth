import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandHeader from '../../components/BrandHeader';

export default function OrdersView({ threads, loading, error }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const visibleThreads = useMemo(() => {
    if (!searchTerm) {
      return threads;
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return threads.filter((thread) =>
      String(thread.customerName || '').toLowerCase().includes(normalizedSearch) ||
      String(thread.customerEmail || '').toLowerCase().includes(normalizedSearch)
    );
  }, [threads, searchTerm]);

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString();
  };

  return (
    <main className="dashboard-shell">
      <BrandHeader />
      <div className="dashboard-container">
        <header className="dashboard-header staff-header">
          <h1>Customer Orders</h1>
          <p>Select a customer to review their orders and update status</p>
        </header>

        <div className="search-sort-container staff-message-toolbar">
          <div className="search-filter-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? <p className="dashboard-note">Loading customer orders...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <section className="staff-thread-panel staff-message-thread-panel">
          <div className="panel-heading">
            <h2>Customers</h2>
            <p>Open a customer to see all placed orders</p>
          </div>

          <div className="thread-list conversation-list">
            {visibleThreads.length > 0 ? (
              visibleThreads.map((thread) => (
                <button
                  type="button"
                  key={thread.customerId}
                  className="thread-item conversation-item"
                  onClick={() => navigate(`/staff/orders/${thread.customerId}`)}
                >
                  <div className="conversation-details thread-item-main">
                    <div className="conversation-header">
                      <h5>{thread.customerName}</h5>
                      <span className="time">{formatTime(thread.latestOrderAt)}</span>
                    </div>
                    <p className="preview-text">
                      {thread.orderCount} order{thread.orderCount === 1 ? '' : 's'} placed
                    </p>
                    <span className="thread-email">{thread.customerEmail}</span>
                  </div>
                  <span className="unread-count">{thread.latestOrderNumber || thread.orderCount}</span>
                </button>
              ))
            ) : (
              <div className="no-messages">
                <i className="far fa-folder-open"></i>
                <h3>No customer orders yet</h3>
                <p>Customers who place orders will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}