import BrandHeader from '../../components/BrandHeader';

export default function CheckoutView({
  cart,
  loading,
  submitting,
  error,
  message,
  paymentMethod,
  transactionId,
  bkashNumber,
  onPaymentMethodChange,
  onTransactionIdChange,
  onBkashNumberChange,
  onSubmit
}) {
  const total = cart.items.reduce((sum, item) => sum + Number(item.medicine?.price || 0) * Number(item.quantity || 0), 0);

  return (
    <main className="checkout-page">
      <BrandHeader />
      <div className="checkout-layout">
        <section className="checkout-summary-card">
          <div className="card-header">
            <h4>Order Summary</h4>
          </div>
          <div className="card-body">
            {cart.items.map((item) => (
              <div className="order-item" key={item.medicine?._id}>
                <div className="item-details">
                  <span className="item-name">{item.medicine?.name}</span>
                  <span className="item-quantity">x {item.quantity}</span>
                </div>
                <span className="item-price">৳{(Number(item.medicine?.price || 0) * Number(item.quantity || 0)).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="total-section">
              <span className="total-label">Total Amount:</span>
              <span className="total-amount">৳{total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section className="checkout-form-card">
          <div className="card-header">
            <h4>Payment Details</h4>
          </div>
          <div className="card-body">
            {loading ? <p className="dashboard-note">Loading cart...</p> : null}
            {error ? <p className="form-error">{error}</p> : null}
            {message ? <p className="dashboard-note">{message}</p> : null}

            <form id="payment-form" onSubmit={onSubmit}>
              <div className="payment-methods mb-4 text-center">
                <h3 className="payment-title mb-4">Select Payment Method</h3>
                <div className="payment-method-grid">
                  <button type="button" className={`payment-method-btn ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`} onClick={() => onPaymentMethodChange('Cash on Delivery')}>
                    Cash on Delivery
                  </button>
                  <button type="button" className={`payment-method-btn ${paymentMethod === 'bKash' ? 'active' : ''}`} onClick={() => onPaymentMethodChange('bKash')}>
                    bKash Payment
                  </button>
                </div>
              </div>

              {paymentMethod === 'bKash' ? (
                <div className="bkash-section">
                  <div className="payment-instructions">
                    <h5>bKash Payment Instructions</h5>
                    <ol>
                      <li>Send payment to: <strong>01712345678</strong></li>
                      <li>Keep your Transaction ID ready</li>
                      <li>Fill in the details below</li>
                    </ol>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bkash_number">bKash Number</label>
                    <input type="text" id="bkash_number" value={bkashNumber} onChange={(event) => onBkashNumberChange(event.target.value)} placeholder="01XXXXXXXXX" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="transaction_id">Transaction ID</label>
                    <input type="text" id="transaction_id" value={transactionId} onChange={(event) => onTransactionIdChange(event.target.value)} placeholder="Enter Transaction ID" />
                  </div>
                </div>
              ) : null}

              <div className="checkout-actions">
                <button type="submit" className="submit-btn" disabled={submitting || cart.items.length === 0}>{submitting ? 'Placing order...' : 'Confirm Order'}</button>
                <a href="/customer/cart" className="cancel-btn">Cancel Order</a>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
