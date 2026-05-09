import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BrandHeader from '../../components/BrandHeader';

const ORDER_STATUSES = ['Pending', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function OrderDetailsView({
  loading,
  error,
  orders,
  customerInfo,
  savingOrderId,
  onLoadOrders,
  onStatusChange,
  setLoading
}) {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [draftStatuses, setDraftStatuses] = useState({});

  useEffect(() => {
    const loadCustomerOrders = async () => {
      try {
        setLoading(true);
        await onLoadOrders(customerId);
      } catch {
        // handled by controller state
      } finally {
        setLoading(false);
      }
    };

    loadCustomerOrders();
  }, [customerId, onLoadOrders, setLoading]);

  useEffect(() => {
    const nextStatuses = {};
    for (const order of orders) {
      nextStatuses[order._id] = order.status || 'Pending';
    }
    setDraftStatuses(nextStatuses);
  }, [orders]);

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString();
  };

  const handleStatusChange = async (orderId) => {
    await onStatusChange(orderId, draftStatuses[orderId], customerId);
  };

  const itemCount = (order) => (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const getMedicineLabel = (detail) => detail.medicine?.name || detail.medicine?.title || detail.medicine?.label || detail.medicine || 'Medicine';
  const showBkashFields = (order) => String(order.paymentMethod || order.payment_method || '').toLowerCase() === 'bkash';
  const textStyle = { color: '#1f2937' };

  return (
    <main className="order-history-page">
      <BrandHeader />
      <div className="order-history-container">
        <div className="order-history-hero">
          <div>
            <div className="header-content">
              <button
                className="back-button"
                onClick={() => navigate('/staff/orders')}
                aria-label="Back to orders"
                title="Back to orders"
              >
                ←
              </button>
              <h2 className="order-history-title">Orders for {customerInfo?.name || 'Customer'}</h2>
            </div>
            <p className="dashboard-note">Review placed orders, payment details, and update the latest status.</p>
          </div>
          <div className="customer-info">
            <span className="badge bg-light text-dark">{customerInfo?.name || orders[0]?.customer?.username || `Customer #${customerId}`}</span>
            <span className="badge bg-light text-dark">{customerInfo?.email || orders[0]?.customer?.email || ''}</span>
          </div>
        </div>

        {loading ? <p className="dashboard-note">Loading customer orders...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        {orders.length > 0 ? (
          <div className="order-history-list">
            {orders.map((order) => (
              <article key={order._id} className="order-card staff-order-card">
                <div className="order-card-header">
                  <div>
                    <h5>Order #{order.orderNumber || order.id || order._id}</h5>
                    <p className="order-date-text">Placed on {formatTime(order.order_date || order.createdAt)}</p>
                  </div>
                  <div className="order-header-badges">
                    <span className={`status-badge status-${String(order.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                      {order.status}
                    </span>
                    <span className="order-payment-pill">{order.paymentMethod || order.payment_method}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-card-grid order-card-meta-grid">
                    <div>
                      <p><strong>Order ID:</strong> {order.id || order._id}</p>
                      <p><strong>Items:</strong> {itemCount(order) || 'Not stored in this record'}</p>
                      {showBkashFields(order) ? (
                        <>
                          <p><strong>Transaction ID:</strong> {order.transactionId || order.transaction_id || '-'}</p>
                          <p><strong>bKash Number:</strong> {order.bkashNumber || order.bkash_number || '-'}</p>
                        </>
                      ) : null}
                    </div>
                    <div className="order-total-block">
                      <span className="order-total-label">Total</span>
                      <h4 className="total-price">৳{Number(order.totalPrice || order.total_price || 0).toFixed(2)}</h4>
                    </div>
                  </div>

                  {(order.items || []).length > 0 ? (
                    <div className="order-details-table-wrap">
                      <h6>Order Items</h6>
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
                          {order.items.map((detail) => (
                            <tr key={`${order._id}-${detail.medicine?._id || detail.medicine}`}>
                              <td>{getMedicineLabel(detail)}</td>
                              <td>{detail.quantity}</td>
                              <td>৳{Number(detail.price || 0).toFixed(2)}</td>
                              <td>৳{(Number(detail.price || 0) * Number(detail.quantity || 0)).toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="table-info-row">
                            <td colSpan="3"><strong>Grand Total:</strong></td>
                            <td><strong>৳{Number(order.totalPrice || order.total_price || 0).toFixed(2)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="no-messages">
                      <i className="far fa-folder-open"></i>
                      <p>This order record does not store line items.</p>
                    </div>
                  )}

                  <div className="order-actions-row order-status-row">
                    <select
                      className="filter-select"
                      value={draftStatuses[order._id] || order.status}
                      onChange={(event) => setDraftStatuses((current) => ({ ...current, [order._id]: event.target.value }))}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleStatusChange(order._id)}
                      disabled={savingOrderId === order._id}
                    >
                      {savingOrderId === order._id ? 'Saving...' : 'Update Status'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : loading || error ? null : (
          <div className="empty-orders">
            <h3 className="no-orders-title">No Orders Found</h3>
            <p className="no-orders-text">No orders were found for this customer.</p>
          </div>
        )}
      </div>
    </main>
  );
}