import { useCallback, useEffect, useState } from 'react';
import DashboardView from '../views/staff/DashboardView';
import MessagesView from '../views/staff/MessagesView';
import StaffConversationView from '../views/staff/ConversationView';
import NotificationsView from '../views/staff/NotificationsView';
import StaffMedicinesView from '../views/staff/MedicinesView';
import StaffOrdersView from '../views/staff/OrdersView';
import StaffOrderDetailsView from '../views/staff/OrderDetailsView';
import { getStaffMessageThreads } from '../models/chatModel';
import { getCategories, getMedicines } from '../models/catalogModel';
import { getStaffCustomerOrders, getStaffOrderThreads, updateStaffOrderStatus } from '../models/orderModel';
import { createStaffNotification, getStaffNotifications } from '../models/notificationModel';

export function StaffDashboardController() {
  return <DashboardView />;
}

export function StaffMessagesController() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadThreads = async () => {
    const threadData = await getStaffMessageThreads();
    setThreads(threadData);
  };

  useEffect(() => {
    async function initializeMessages() {
      try {
        await loadThreads();
      } catch (chatError) {
        setError(chatError.message);
      } finally {
        setLoading(false);
      }
    }

    initializeMessages();
  }, []);

  return (
    <MessagesView threads={threads} loading={loading} error={error} />
  );
}

export function StaffConversationController() {
  return <StaffConversationView />;
}

export function StaffMedicinesController() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMedicines() {
      try {
        const [medicineData, categoryData] = await Promise.all([getMedicines(), getCategories()]);
        setMedicines(medicineData);
        setCategories(categoryData);
      } catch (medicineError) {
        setError(medicineError.message);
      } finally {
        setLoading(false);
      }
    }

    loadMedicines();
  }, []);

  return <StaffMedicinesView medicines={medicines} categories={categories} loading={loading} error={error} />;
}

export function StaffOrdersController() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadThreads = async () => {
    const threadData = await getStaffOrderThreads();
    setThreads(threadData);
  };

  useEffect(() => {
    async function initializeOrders() {
      try {
        await loadThreads();
      } catch (orderError) {
        setError(orderError.message);
      } finally {
        setLoading(false);
      }
    }

    initializeOrders();
  }, []);

  return <StaffOrdersView threads={threads} loading={loading} error={error} />;
}

export function StaffOrderDetailsController() {
  const [orders, setOrders] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState('');
  const [error, setError] = useState('');

  const loadOrders = useCallback(async (customerId) => {
    const orderData = await getStaffCustomerOrders(customerId);
    setOrders(orderData);
    if (orderData.length > 0) {
      const customer = orderData[0].customer || {};
      setCustomerInfo({
        id: customerId,
        name: customer.username || `Customer #${customerId}`,
        email: customer.email || ''
      });
    }
  }, []);

  const handleStatusChange = useCallback(async (orderId, status, customerId) => {
    try {
      setSavingOrderId(orderId);
      setError('');
      await updateStaffOrderStatus(orderId, status);
      await loadOrders(customerId);
    } catch (orderError) {
      setError(orderError.message);
    } finally {
      setSavingOrderId('');
    }
  }, [loadOrders]);

  return (
    <StaffOrderDetailsView
      loading={loading}
      error={error}
      orders={orders}
      customerInfo={customerInfo}
      savingOrderId={savingOrderId}
      onLoadOrders={loadOrders}
      onStatusChange={handleStatusChange}
      setLoading={setLoading}
      setError={setError}
      setOrders={setOrders}
      setCustomerInfo={setCustomerInfo}
    />
  );
}

export function StaffNotificationsController() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [notificationType, setNotificationType] = useState('stock_alert');
  const [message, setMessage] = useState('');

  const loadNotifications = async () => {
    const notificationData = await getStaffNotifications();
    setNotifications(notificationData);
  };

  useEffect(() => {
    async function initializeNotifications() {
      try {
        await loadNotifications();
      } catch (notificationError) {
        setError(notificationError.message);
      } finally {
        setLoading(false);
      }
    }

    initializeNotifications();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (sending) {
      return;
    }

    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    try {
      setError('');
      setSending(true);
      await createStaffNotification({ message, notificationType });
      setMessage('');
      await loadNotifications();
    } catch (notificationError) {
      setError(notificationError.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <NotificationsView
      notifications={notifications}
      loading={loading}
      error={error}
      notificationType={notificationType}
      message={message}
      onNotificationTypeChange={setNotificationType}
      onMessageChange={setMessage}
      onSubmit={handleSubmit}
      sending={sending}
    />
  );
}
