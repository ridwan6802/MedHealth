import { useEffect, useState } from 'react';
import DashboardView from '../views/customer/DashboardView';
import CartView from '../views/customer/CartView';
import CheckoutView from '../views/customer/CheckoutView';
import MessagesView from '../views/customer/MessagesView';
import OrdersView from '../views/customer/OrdersView';
import { getCategories, getMedicines } from '../models/catalogModel';
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from '../models/cartModel';
import { createOrder, getOrders } from '../models/orderModel';
import { getCustomerMessages, sendCustomerMessage } from '../models/chatModel';

export function CustomerDashboardController() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [medicineData, categoryData] = await Promise.all([getMedicines(), getCategories()]);
        setMedicines(medicineData);
        setCategories(categoryData);
      } catch (catalogError) {
        setError(catalogError.message);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  const handleAddToCart = async (medicineId, quantity = 1) => {
    try {
      setCartMessage('');
      await addToCart(medicineId, quantity);
      setCartMessage('Added to cart');
    } catch (cartError) {
      setCartMessage(cartError.message);
    }
  };

  return (
    <DashboardView
      medicines={medicines}
      categories={categories}
      loading={loading}
      error={error}
      cartMessage={cartMessage}
      onAddToCart={handleAddToCart}
    />
  );
}

export function CartController() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshCart = async () => {
    const cartData = await getCart();
    setCart(cartData);
  };

  useEffect(() => {
    async function loadCart() {
      try {
        await refreshCart();
      } catch (cartError) {
        setError(cartError.message);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  const handleQuantityChange = async (medicineId, quantity) => {
    try {
      setError('');
      const cartData = await updateCartItem(medicineId, quantity);
      setCart(cartData);
    } catch (cartError) {
      setError(cartError.message);
    }
  };

  const handleRemove = async (medicineId) => {
    try {
      setError('');
      const cartData = await removeFromCart(medicineId);
      setCart(cartData);
    } catch (cartError) {
      setError(cartError.message);
    }
  };

  const handleClear = async () => {
    try {
      setError('');
      await clearCart();
      await refreshCart();
    } catch (cartError) {
      setError(cartError.message);
    }
  };

  return (
    <CartView
      cart={cart}
      loading={loading}
      error={error}
      onQuantityChange={handleQuantityChange}
      onRemove={handleRemove}
      onClear={handleClear}
    />
  );
}

export function CheckoutController() {
  const [cart, setCart] = useState({ items: [] });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [transactionId, setTransactionId] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadCart() {
      try {
        const cartData = await getCart();
        setCart(cartData);
      } catch (cartError) {
        setError(cartError.message);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const order = await createOrder({ paymentMethod, transactionId, bkashNumber });
      setMessage(`Order placed successfully: ${order._id}`);
      setCart({ items: [] });
    } catch (orderError) {
      setError(orderError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CheckoutView
      cart={cart}
      loading={loading}
      submitting={submitting}
      error={error}
      message={message}
      paymentMethod={paymentMethod}
      transactionId={transactionId}
      bkashNumber={bkashNumber}
      onPaymentMethodChange={setPaymentMethod}
      onTransactionIdChange={setTransactionId}
      onBkashNumberChange={setBkashNumber}
      onSubmit={handleSubmit}
    />
  );
}

export function CustomerMessagesController() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const loadMessages = async () => {
    const messageData = await getCustomerMessages();
    setMessages(messageData);
  };

  useEffect(() => {
    async function loadConversation() {
      try {
        await loadMessages();
      } catch (chatError) {
        setError(chatError.message);
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }

    setSending(true);
    setError('');

    try {
      await sendCustomerMessage(message);
      setMessage('');
      await loadMessages();
    } catch (chatError) {
      setError(chatError.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <MessagesView
      messages={messages}
      loading={loading}
      sending={sending}
      error={error}
      message={message}
      onMessageChange={setMessage}
      onSubmit={handleSubmit}
    />
  );
}

export function OrdersController() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrders() {
      try {
        const orderData = await getOrders();
        setOrders(orderData);
      } catch (orderError) {
        setError(orderError.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return <OrdersView orders={orders} loading={loading} error={error} />;
}
