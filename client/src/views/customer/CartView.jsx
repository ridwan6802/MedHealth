import BrandHeader from '../../components/BrandHeader';

export default function CartView({ cart, loading, error, onQuantityChange, onRemove, onClear }) {
  const items = cart.items || [];
  const total = items.reduce((sum, item) => sum + Number(item.medicine?.price || 0) * Number(item.quantity || 0), 0);

  return (
    <main className="cart-page">
      <BrandHeader />
      <div className="cart-container">
        <h1 className="cart-title">Your Shopping Cart</h1>

        {loading ? <p className="dashboard-note">Loading cart...</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        <div className="cart-content">
          {items.length > 0 ? (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const medicineId = item.medicine?._id;
                  const itemTotal = Number(item.medicine?.price || 0) * Number(item.quantity || 0);
                  return (
                    <tr key={medicineId}>
                      <td className="medicine-name">{item.medicine?.name}</td>
                      <td className="medicine-price">৳{Number(item.medicine?.price || 0).toFixed(2)}</td>
                      <td className="quantity-cell">
                        <div className="quantity-control">
                          <button type="button" className="quantity-btn minus" onClick={() => onQuantityChange(medicineId, Math.max(1, item.quantity - 1))}>-</button>
                          <input type="number" value={item.quantity} min="1" readOnly className="quantity-input" />
                          <button type="button" className="quantity-btn plus" onClick={() => onQuantityChange(medicineId, item.quantity + 1)}>+</button>
                        </div>
                      </td>
                      <td className="item-total">৳{itemTotal.toFixed(2)}</td>
                      <td className="action-cell">
                        <button type="button" className="remove-btn" onClick={() => onRemove(medicineId)}>×</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <a href="/customer" className="continue-shopping">Continue Shopping</a>
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <div className="cart-summary">
            <div className="summary-content">
              <h3>Cart Total: <span id="cart-total">৳{total.toFixed(2)}</span></h3>
              <a href="/customer/checkout" className="checkout-btn">Proceed to Checkout</a>
              <a href="/customer" className="continue-shopping">Continue Shopping</a>
              <button type="button" className="clear-cart-btn" onClick={onClear}>Clear Cart</button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
