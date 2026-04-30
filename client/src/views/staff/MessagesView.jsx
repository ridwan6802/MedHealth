import BrandHeader from '../../components/BrandHeader';

export default function MessagesView({ threads, conversation, selectedCustomerId, loading, sending, error, draftMessage, onSelectCustomer, onDraftChange, onSubmit }) {
  return (
    <main className="dashboard-shell">
      <BrandHeader />
      <div className="dashboard-container">
        <header className="dashboard-header staff-header">
          <h1>Messages</h1>
          <p>Review customer conversations and reply from one place</p>
        </header>

        {loading ? <p className="dashboard-note">Loading conversations...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <section className="staff-inbox-layout">
          <aside className="staff-thread-panel">
            <div className="panel-heading">
              <h2>Customers</h2>
              <p>Open a thread to continue the conversation</p>
            </div>

            <div className="thread-list">
              {threads.length > 0 ? (
                threads.map((thread) => (
                  <button
                    type="button"
                    key={thread.customerId}
                    className={`thread-item ${String(thread.customerId) === String(selectedCustomerId) ? 'active' : ''}`}
                    onClick={() => onSelectCustomer(thread.customerId)}
                  >
                    <span className="thread-name">{thread.customerName}</span>
                    <span className="thread-hint">Reply to last message</span>
                  </button>
                ))
              ) : (
                <div className="empty-orders">
                  <h3 className="no-orders-title">No conversations yet</h3>
                  <p className="no-orders-text">Customer messages will appear here.</p>
                </div>
              )}
            </div>
          </aside>

          <section className="staff-conversation-panel">
            <div className="panel-heading">
              <h2>Conversation</h2>
              <p>{selectedCustomerId ? `Customer ID ending in ${selectedCustomerId.slice(-6)}` : 'Select a customer to view messages'}</p>
            </div>

            <div className="conversation-list">
              {conversation.length > 0 ? (
                conversation.map((chatMessage) => (
                  <article
                    key={chatMessage._id}
                    className={`chat-bubble ${String(chatMessage.senderRole || '').toLowerCase().includes('staff') ? 'from-staff' : 'from-customer'}`}
                  >
                    <p className="chat-role">{chatMessage.senderRole}</p>
                    <p className="chat-message">{chatMessage.message}</p>
                  </article>
                ))
              ) : (
                <div className="empty-orders">
                  <h3 className="no-orders-title">No messages to show</h3>
                  <p className="no-orders-text">Choose a customer to load their thread.</p>
                </div>
              )}
            </div>

            <form className="reply-form" onSubmit={onSubmit}>
              <label className="reply-label">
                Reply
                <textarea
                  value={draftMessage}
                  onChange={(event) => onDraftChange(event.target.value)}
                  rows="5"
                  placeholder="Type your response here..."
                />
              </label>
              <div className="reply-actions">
                <button className="primary-button" type="submit" disabled={sending || !selectedCustomerId}>
                  {sending ? 'Sending...' : 'Send reply'}
                </button>
              </div>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}
