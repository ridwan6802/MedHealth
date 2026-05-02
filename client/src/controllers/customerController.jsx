import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
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

  useEffect(() => {
    const orderMessage = location.state?.orderMessage;
    if (orderMessage) {
      setCartMessage(orderMessage);
    }
  }, [location.state]);

  const handleAddToCart = async (medicineId, quantity = 1) => {
    try {
      setCartMessage('');
      await addToCart(medicineId, quantity);
      setCartMessage('Item added to cart successfully.');
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
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [transactionId, setTransactionId] = useState('');
  const [bkashNumber, setBkashNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [isWarningBannerVisible, setIsWarningBannerVisible] = useState(false);

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

  const flashCheckoutWarning = (warning) => {
    setWarningMessage(warning);
    setShowWarningBanner(true);
    setIsWarningBannerVisible(false);

    const enterFrame = window.requestAnimationFrame(() => {
      setIsWarningBannerVisible(true);
    });

    const fadeTimer = window.setTimeout(() => {
      setIsWarningBannerVisible(false);
    }, 2600);

    const hideTimer = window.setTimeout(() => {
      setShowWarningBanner(false);
      setWarningMessage('');
      setIsWarningBannerVisible(false);
    }, 3000);

    return () => {
      window.cancelAnimationFrame(enterFrame);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  };

  const handleBkashNumberChange = (value) => {
    const digitsOnly = String(value || '').replace(/\D/g, '').slice(0, 11);
    setBkashNumber(digitsOnly);
  };

  const handleTransactionIdChange = (value) => {
    setTransactionId(value);
  };

  const isValidBkashNumber = (value) => /^01\d{9}$/.test(String(value || '').trim());

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    if (paymentMethod === 'bKash') {
      const trimmedBkashNumber = bkashNumber.trim();
      const trimmedTransactionId = transactionId.trim();

      if (!trimmedBkashNumber && !trimmedTransactionId) {
        flashCheckoutWarning('Please provide your bKash Number and Transaction ID.');
        setSubmitting(false);
        return;
      }

      if (!trimmedBkashNumber) {
        flashCheckoutWarning('Please provide your bKash Number.');
        setSubmitting(false);
        return;
      }

      if (!isValidBkashNumber(trimmedBkashNumber)) {
        flashCheckoutWarning('Please provide a valid bKash Number. It must be 11 digits and start with 01.');
        setSubmitting(false);
        return;
      }

      if (!trimmedTransactionId) {
        flashCheckoutWarning('Please provide your Transaction ID.');
        setSubmitting(false);
        return;
      }
    }

    try {
      const order = await createOrder({ paymentMethod, transactionId, bkashNumber });
      setCart({ items: [] });
      navigate('/customer', {
        replace: true,
        state: { orderMessage: 'Order placed successfully!' }
      });
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
      warningMessage={warningMessage}
      showWarningBanner={showWarningBanner}
      isWarningBannerVisible={isWarningBannerVisible}
      paymentMethod={paymentMethod}
      transactionId={transactionId}
      bkashNumber={bkashNumber}
      onPaymentMethodChange={setPaymentMethod}
      onTransactionIdChange={handleTransactionIdChange}
      onBkashNumberChange={handleBkashNumberChange}
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
