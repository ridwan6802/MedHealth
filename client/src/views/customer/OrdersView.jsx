import BrandHeader from '../../components/BrandHeader';

export default function OrdersView({ orders, loading, error }) {
  return (
    <main className="order-history-page">
      <BrandHeader />
      <div className="order-history-container">
        <h2 className="order-history-title">Your Order History</h2>
        {loading ? <p className="dashboard-note">Loading orders...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {orders.length > 0 ? (
          <div className="order-history-list">
            {orders.map((order) => (
              <article key={order._id} className="order-card">
                <div className="order-card-header">
                  <h5>Order #{order._id.slice(-6)}</h5>
                  <p>
                    <strong>Delivery Status:</strong>{' '}
                    <span className={`status-badge status-${String(order.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="order-card-body">
                  <div className="order-card-grid">
                    <div>
                      <p><strong>Order Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</p>
                      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                      <p><strong>Payment Status:</strong> <span className="status-text">{order.paymentStatus}</span></p>
                    </div>
                    <div className="order-total-block">
                      <h4 className="total-price">Total: ৳{Number(order.totalPrice || 0).toFixed(2)}</h4>
                    </div>
                  </div>

                  <div className="order-details-table-wrap">
                    <h6>Order Details</h6>
                    <table className="order-details-table">
                      <thead>
                        <tr>
                          <th>Medicine Name</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.items || []).map((detail) => (
                          <tr key={`${order._id}-${detail.medicine?._id || detail.medicine}`}>
                            <td>{detail.medicine?.name || 'Medicine'}</td>
                            <td>{detail.quantity}</td>
                            <td>৳{Number(detail.price || 0).toFixed(2)}</td>
                            <td>৳{(Number(detail.price || 0) * Number(detail.quantity || 0)).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="table-info-row">
                          <td colSpan="3"><strong>Grand Total:</strong></td>
                          <td><strong>৳{Number(order.totalPrice || 0).toFixed(2)}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-orders">
            <h3 className="no-orders-title">No Orders Found</h3>
            <p className="no-orders-text">You haven't placed any orders yet.</p>
            <a href="/customer" className="shop-now-btn">Start Shopping</a>
          </div>
        )}
      </div>
    </main>
  );
}
