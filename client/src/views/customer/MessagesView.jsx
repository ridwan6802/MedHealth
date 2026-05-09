import BrandHeader from '../../components/BrandHeader';

export default function MessagesView({ messages, loading, sending, error, message, onMessageChange, onSubmit }) {
  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString();
  };

  return (
    <main className="conversation-page">
      <BrandHeader />
      <div className="conversation-container">
        <div className="conversation-header conversation-header-centered">
          <div>
            <h2 className="conversation-title">Support Chat</h2>
            <p className="dashboard-note">Chat with MedHealth support about your orders and medicines.</p>
          </div>
        </div>
        {loading ? <p className="dashboard-note">Loading messages...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <div className="conversation-list">
          {messages.map((chatMessage) => {
            const isCustomerMessage = String(chatMessage.senderRole || '').toLowerCase() === 'customer';

            return (
            <article
              key={chatMessage._id}
              className={`message-bubble ${isCustomerMessage ? 'customer' : 'staff'}`}
              aria-label={isCustomerMessage ? 'Your message' : 'Reply from MedHealth'}
            >
              {!isCustomerMessage ? <p className="message-role">MedHealth</p> : null}
              <p className="message-text">{chatMessage.message}</p>
              <p className="message-time">{formatTime(chatMessage.createdAt)}</p>
            </article>
            );
          })}
        </div>

        <form className="reply-form" onSubmit={onSubmit}>
          <label htmlFor="new-message">New message</label>
          <textarea id="new-message" value={message} onChange={(event) => onMessageChange(event.target.value)} rows="4" />
          <button className="primary-button" type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>
    </main>
  );
}
