import BrandHeader from '../../components/BrandHeader';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

export default function OrdersView({ orders, loading, error }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const visibleOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      const paymentMethod = String(order.paymentMethod || '').toLowerCase();
      const status = String(order.status || '').toLowerCase();
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || paymentMethod === paymentFilter;

      return matchesStatus && matchesPayment;
    });

    return filtered.sort((left, right) => {
      const leftDate = new Date(left.createdAt || 0).getTime();
      const rightDate = new Date(right.createdAt || 0).getTime();
      const leftTotal = Number(left.totalPrice || 0);
      const rightTotal = Number(right.totalPrice || 0);

      switch (sortBy) {
        case 'oldest':
          return leftDate - rightDate;
        case 'highest':
          return rightTotal - leftTotal;
        case 'lowest':
          return leftTotal - rightTotal;
        default:
          return rightDate - leftDate;
      }
    }).map((order, index) => ({
      ...order,
      displayOrderNumber: index + 1
    }));
  }, [orders, paymentFilter, sortBy, statusFilter]);

  const summary = useMemo(() => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
    const pendingOrders = orders.filter((order) => String(order.status || '').toLowerCase() === 'pending').length;
    const deliveredOrders = orders.filter((order) => String(order.status || '').toLowerCase() === 'delivered').length;

    return { totalOrders, totalSpent, pendingOrders, deliveredOrders };
  }, [orders]);

  const clearFilters = () => {
    setStatusFilter('all');
    setPaymentFilter('all');
    setSortBy('newest');
  };

  return (
    <main className="order-history-page">
      <BrandHeader />
      <div className="order-history-container">
        <div className="order-history-hero">
          <div>
            <h2 className="order-history-title">Your Order History</h2>
            <p className="dashboard-note">Review past orders, payment details, and delivery status in one place.</p>
          </div>
          <Link to="/customer" className="shop-now-btn">Continue Shopping</Link>
        </div>

        <div className="order-summary-grid">
          <article className="order-summary-card">
            <span>Total Orders</span>
            <strong>{summary.totalOrders}</strong>
          </article>
          <article className="order-summary-card">
            <span>Total Spent</span>
            <strong>৳{summary.totalSpent.toFixed(2)}</strong>
          </article>
          <article className="order-summary-card">
            <span>Pending</span>
            <strong>{summary.pendingOrders}</strong>
          </article>
          <article className="order-summary-card">
            <span>Delivered</span>
            <strong>{summary.deliveredOrders}</strong>
          </article>
        </div>

        <div className="order-filters-panel">
          <div className="order-filters-grid">
            <select className="filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="out for delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
            <select className="filter-select" value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>
              <option value="all">All Payments</option>
              <option value="cash on delivery">Cash on Delivery</option>
              <option value="bkash">bKash</option>
            </select>
            <select className="sort-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Total - High to Low</option>
              <option value="lowest">Total - Low to High</option>
            </select>
            <button type="button" className="clear-search order-clear-btn" onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>

        {loading ? <p className="dashboard-note">Loading orders...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
        {visibleOrders.length > 0 ? (
          <div className="order-history-list">
            {visibleOrders.map((order, index) => {
              const orderKey = order._id;
              const itemCount = (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
              const isExpanded = expandedOrderId === orderKey;
              const displayOrderNumber = order.orderNumber;

              return (
              <article key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h5>Order #{displayOrderNumber}</h5>
                    <p className="order-date-text">Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}</p>
                  </div>
                  <div className="order-header-badges">
                    <span className={`status-badge status-${String(order.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                      {order.status}
                    </span>
                    <span className="order-payment-pill">{order.paymentMethod}</span>
                  </div>
                </div>
                <div className="order-card-body">
                  <div className="order-card-grid order-card-meta-grid">
                    <div>
                      <p><strong>Items:</strong> {itemCount}</p>
                      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                      <p><strong>Payment Status:</strong> <span className="status-text">{order.paymentStatus}</span></p>
                    </div>
                    <div className="order-total-block">
                      <span className="order-total-label">Total</span>
                      <h4 className="total-price">৳{Number(order.totalPrice || 0).toFixed(2)}</h4>
                    </div>
                  </div>

                  <div className="order-actions-row">
                    <button type="button" className="btn-edit order-toggle-btn" onClick={() => setExpandedOrderId(isExpanded ? null : orderKey)}>
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </button>
                    <Link to="/customer" className="btn-cancel order-repeat-btn">Order Again</Link>
                  </div>

                  {isExpanded ? (
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
                  ) : null}
                </div>
              </article>
            );
            })}
          </div>
        ) : (
          <div className="empty-orders">
            <h3 className="no-orders-title">No Orders Found</h3>
            <p className="no-orders-text">{orders.length === 0 ? "You haven't placed any orders yet." : 'No orders match the selected filters.'}</p>
            <Link to="/customer" className="shop-now-btn">Start Shopping</Link>
          </div>
        )}
      </div>
    </main>
  );
}
