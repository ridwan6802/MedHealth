import BrandHeader from '../../components/BrandHeader';

export default function MessagesView({ messages, loading, sending, error, message, onMessageChange, onSubmit }) {
  return (
    <main className="conversation-page">
      <BrandHeader />
      <div className="conversation-container">
        <h2 className="conversation-title">Messages</h2>
        {loading ? <p className="dashboard-note">Loading messages...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <div className="conversation-list">
          {messages.map((chatMessage) => (
            <article key={chatMessage._id} className={`message-bubble ${chatMessage.isFromCustomer ? 'customer' : 'staff'}`}>
              <p className="message-role">{chatMessage.senderRole}</p>
              <p className="message-text">{chatMessage.message}</p>
            </article>
          ))}
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
