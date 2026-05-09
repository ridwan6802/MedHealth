import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandHeader from '../../components/BrandHeader';

export default function AdminMessagesView({ threads, loading, error, onSelectCustomer }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('newest');

  const filteredThreads = useMemo(() => {
    let filtered = threads;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((thread) =>
        thread.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply message type filter
    if (filterType === 'unread') {
      filtered = filtered.filter((thread) => thread.unreadCount > 0);
    }

    // Sort by selected order
    return filtered.sort((a, b) => {
      const timeA = a.latestMessageAt || '';
      const timeB = b.latestMessageAt || '';
      return filterType === 'oldest' ? new Date(timeA) - new Date(timeB) : new Date(timeB) - new Date(timeA);
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

  const handleSelectCustomer = (customerId) => {
    navigate(`/admin/messages/${customerId}`);
  };

  return (
    <main className="dashboard-shell">
      <BrandHeader />
      <div className="dashboard-container">
        <div className="admin-messages-container">
          <div className="messages-header">
            <h1>
              <i className="fas fa-comments"></i> Customer Messages
            </h1>
            <div className="search-filter-container">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search customers..."
                  id="messageSearch"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-box">
                <select
                  id="messageFilter"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="newest">New to Old</option>
                  <option value="oldest">Old to New</option>
                  <option value="all">All Messages</option>
                  <option value="unread">Unread Only</option>
                </select>
                <svg className="filter-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M7 10l5 5 5-5" />
                </svg>
              </div>
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="messages-content">
            {loading ? (
              <p className="dashboard-note">Loading conversations...</p>
            ) : filteredThreads.length > 0 ? (
              <div className="conversation-list">
                {filteredThreads.map((thread) => {
                  const unreadCount = thread.unreadCount || 0;
                  return (
                    <button
                      key={thread.customerId}
                      className={`conversation-item ${unreadCount > 0 ? 'unread' : ''}`}
                      onClick={() => handleSelectCustomer(thread.customerId)}
                    >
                      <div className="conversation-details">
                        <div className="conversation-header">
                          <h5>{thread.customerName}</h5>
                          <span className="time">
                            {thread.latestMessageAt ? formatTime(thread.latestMessageAt) : ''}
                          </span>
                        </div>
                        <p className="preview-text">
                          {thread.latestMessage && thread.latestMessage.length > 70
                            ? `${thread.latestMessage.substring(0, 70)}...`
                            : thread.latestMessage}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <span className="unread-count">{unreadCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="no-messages">
                <i className="far fa-comment-dots"></i>
                <h3>No messages yet</h3>
                <p>When customers contact you, their messages will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
