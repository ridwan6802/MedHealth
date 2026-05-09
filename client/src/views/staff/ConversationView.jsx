import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BrandHeader from '../../components/BrandHeader';
import { getStaffConversation, markStaffConversationRead, sendStaffMessage } from '../../models/chatModel';

export default function StaffConversationView() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [draftMessage, setDraftMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const data = await getStaffConversation(customerId);
        if (data.length > 0) {
          const customer = data[0].customer || {};
          setCustomerInfo({
            name: customer.username || 'Customer',
            email: customer.email || '',
            id: customerId
          });
        }
        setConversation(data);
        await markStaffConversationRead(customerId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [customerId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!draftMessage.trim()) {
      return;
    }

    setSending(true);
    setError('');

    try {
      await sendStaffMessage(customerId, draftMessage);
      setDraftMessage('');
      const updated = await getStaffConversation(customerId);
      setConversation(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

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
        <div className="admin-conversation-container">
          <div className="conversation-header">
            <div className="header-content">
              <button
                className="back-button"
                onClick={() => navigate('/staff/messages')}
                aria-label="Back to messages"
                title="Back to messages"
              >
                ←
              </button>
              <h1>Conversation with {customerInfo?.name || 'Customer'}</h1>
            </div>
            <div className="customer-info">
              <span className="badge bg-light text-dark">
                <svg className="customer-info-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
                </svg>
                {customerInfo?.name}
              </span>
              <span className="badge bg-light text-dark">
                <svg className="customer-info-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                {customerInfo?.email}
              </span>
            </div>
          </div>

          <div className="conversation-body">
            <div className="messages-wrapper">
              <div className="messages-container" id="messagesContainer">
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>Loading conversation...</p>
                ) : error ? (
                  <p style={{ textAlign: 'center', color: '#c53030' }}>{error}</p>
                ) : conversation.length > 0 ? (
                  conversation.map((message) => (
                    <div
                      key={message._id}
                      className={`message ${String(message.senderRole || '').toLowerCase() === 'customer' ? 'customer' : 'staff'}-message`}
                    >
                      <div className="message-content">
                        <div className="message-text">{message.message}</div>
                        <div className="message-time">
                          {formatTime(message.createdAt)}
                          {message.senderRole !== 'customer' && (
                            <i className="fas fa-check-double read-icon"></i>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-messages">
                    <i className="far fa-comment-dots"></i>
                    <p>No messages yet</p>
                  </div>
                )}
              </div>
            </div>

            <form className="message-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <textarea
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  className="form-control"
                  placeholder="Type your reply..."
                  rows="1"
                  required
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={sending || !draftMessage.trim()}
                  aria-label="Send message"
                >
                  <svg
                    className="send-button-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M3.4 20.6 21 12 3.4 3.4 3 10.3 15 12 3 13.7z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}