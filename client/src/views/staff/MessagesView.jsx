import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandHeader from '../../components/BrandHeader';

export default function MessagesView({ threads, loading, error }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredThreads = useMemo(() => {
    let filtered = threads;

    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((thread) =>
        String(thread.customerName || '').toLowerCase().includes(normalizedSearch) ||
        String(thread.customerEmail || '').toLowerCase().includes(normalizedSearch)
      );
    }

    if (filterType === 'unread') {
      filtered = filtered.filter((thread) => Number(thread.unreadCount || 0) > 0);
    }

    return [...filtered].sort((left, right) => {
      const leftTime = left.latestMessageAt ? new Date(left.latestMessageAt).getTime() : 0;
      const rightTime = right.latestMessageAt ? new Date(right.latestMessageAt).getTime() : 0;
      return rightTime - leftTime;
    });
  }, [threads, searchTerm, filterType]);

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = d.toLocaleString('default', { month: 'short' });
    const day = d.getDate();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${month} ${day}, ${hours}:${minutes}`;
  };

  return (
    <main className="dashboard-shell">
      <BrandHeader />
      <div className="dashboard-container">
        <header className="dashboard-header staff-header">
          <h1>Customer Messages</h1>
        </header>

        {loading ? <p className="dashboard-note">Loading conversations...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <div className="search-filter-container staff-message-filters staff-message-toolbar">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="filter-box">
            <select value={filterType} onChange={(event) => setFilterType(event.target.value)}>
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
            </select>
            <svg className="filter-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M7 10l5 5 5-5" />
            </svg>
          </div>
        </div>

        <section className="staff-thread-panel staff-message-thread-panel">
          <div className="panel-heading">
            <h2>Customers</h2>
            <p>Open a thread to continue the conversation</p>
          </div>

          <div className="thread-list conversation-list">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => (
                <button
                  type="button"
                  key={thread.customerId}
                  className={`thread-item conversation-item ${Number(thread.unreadCount || 0) > 0 ? 'unread' : ''}`}
                  onClick={() => navigate(`/staff/messages/${thread.customerId}`)}
                >
                  <div className="conversation-details thread-item-main">
                    <div className="conversation-header">
                      <h5>{thread.customerName}</h5>
                      <span className="time">{formatTime(thread.latestMessageAt)}</span>
                    </div>
                    <p className="preview-text">
                      {thread.latestMessage && thread.latestMessage.length > 70
                        ? `${thread.latestMessage.substring(0, 70)}...`
                        : thread.latestMessage || 'Reply to last message'}
                    </p>
                    <span className="thread-email">{thread.customerEmail}</span>
                  </div>
                  {Number(thread.unreadCount || 0) > 0 ? <span className="unread-count">{thread.unreadCount}</span> : null}
                </button>
              ))
            ) : (
              <div className="no-messages">
                <i className="far fa-comment-dots"></i>
                <h3>No conversations yet</h3>
                <p>Customer messages will appear here.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
