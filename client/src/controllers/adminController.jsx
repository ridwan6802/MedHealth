import { useEffect, useState } from 'react';
import DashboardView from '../views/admin/DashboardView';
import UsersView from '../views/admin/UsersView';
import MedicinesView from '../views/admin/MedicinesView';
import CategoriesView from '../views/admin/CategoriesView';
import {
  getDashboardSummary,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  createCategory,
  updateCategory,
  deleteCategory
} from '../models/adminCatalogModel';
import { getCategories, getMedicines } from '../models/catalogModel';
import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead
} from '../models/notificationModel';
import AdminNotificationsView from '../views/admin/NotificationsView';

export function AdminDashboardController() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSummary() {
      try {
        const dashboardSummary = await getDashboardSummary();
        setSummary(dashboardSummary);
      } catch (summaryError) {
        setError(summaryError.message);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  return <DashboardView summary={summary} loading={loading} error={error} />;
}

export function AdminUsersController() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingId, setEditingId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    role: 'customer',
    password: ''
  });

  const loadUsers = async () => {
    const userData = await getUsers();
    setUsers(userData);
  };

  useEffect(() => {
    async function loadUserData() {
      try {
        await loadUsers();
      } catch (userError) {
        setError(userError.message);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await updateUser(editingId, formData);
      } else {
        await createUser(formData);
      }
      setFormData({ username: '', email: '', phone: '', address: '', role: 'customer', password: '' });
      setEditingId('');
      setShowForm(false);
      await loadUsers();
    } catch (userError) {
      setError(userError.message);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setShowForm(true);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'customer',
      password: ''
    });
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (userError) {
      setError(userError.message);
    }
  };

  const handleCancel = () => {
    setEditingId('');
    setFormData({ username: '', email: '', phone: '', address: '', role: 'customer', password: '' });
    setShowForm((current) => !current);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = !search || [user.username, user.email, user.phone].some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <UsersView
      users={filteredUsers}
      loading={loading}
      error={error}
      search={search}
      roleFilter={roleFilter}
      formData={formData}
      editingId={editingId}
      showForm={showForm}
      onSearchChange={setSearch}
      onRoleFilterChange={setRoleFilter}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCancel={handleCancel}
    />
  );
}

export function AdminMedicinesController() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    expiryDate: ''
  });

  const refreshMedicines = async () => {
    const [medicineData, dashboardSummary, categoryData] = await Promise.all([getMedicines(), getDashboardSummary(), getCategories()]);
    setMedicines(medicineData);
    setSummary(dashboardSummary);
    setCategories(categoryData);
  };

  useEffect(() => {
    async function initializeMedicines() {
      try {
        await refreshMedicines();
      } catch (inventoryError) {
        setError(inventoryError.message);
      } finally {
        setLoading(false);
      }
    }

    initializeMedicines();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        expiryDate: formData.expiryDate || undefined
      };

      if (editingId) {
        await updateMedicine(editingId, payload);
      } else {
        await createMedicine(payload);
      }

      setEditingId('');
      setFormData({ name: '', description: '', category: '', price: '', stock: '', expiryDate: '' });
      setShowForm(false);
      await refreshMedicines();
    } catch (inventoryError) {
      setError(inventoryError.message);
    }
  };

  const handleEdit = (medicine) => {
    setEditingId(medicine._id);
    setShowForm(true);
    setFormData({
      name: medicine.name || '',
      description: medicine.description || '',
      category: medicine.category?._id || medicine.category || '',
      price: medicine.price ?? '',
      stock: medicine.stock ?? '',
      expiryDate: medicine.expiryDate ? String(medicine.expiryDate).slice(0, 10) : ''
    });
  };

  const handleDelete = async (medicineId) => {
    try {
      await deleteMedicine(medicineId);
      await refreshMedicines();
    } catch (inventoryError) {
      setError(inventoryError.message);
    }
  };

  const handleCancel = () => {
    setEditingId('');
    setFormData({ name: '', description: '', category: '', price: '', stock: '', expiryDate: '' });
    setShowForm((current) => !current);
  };

  return (
    <MedicinesView
      medicines={medicines}
      categories={categories}
      summary={summary}
      formData={formData}
      editingId={editingId}
      showForm={showForm}
      loading={loading}
      error={error}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCancel={handleCancel}
    />
  );
}

export function AdminCategoriesController() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const refreshCategories = async () => {
    const categoryData = await getCategories();
    setCategories(categoryData);
  };

  useEffect(() => {
    async function initializeCategories() {
      try {
        await refreshCategories();
      } catch (catalogError) {
        setError(catalogError.message);
      } finally {
        setLoading(false);
      }
    }

    initializeCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }

      setEditingId('');
      setFormData({ name: '', description: '' });
      setShowForm(false);
      await refreshCategories();
    } catch (catalogError) {
      setError(catalogError.message);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setShowForm(true);
    setFormData({ name: category.name || '', description: category.description || '' });
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      await refreshCategories();
    } catch (catalogError) {
      setError(catalogError.message);
    }
  };

  const handleCancel = () => {
    setEditingId('');
    setFormData({ name: '', description: '' });
    setShowForm((current) => !current);
  };

  return (
    <CategoriesView
      categories={categories}
      formData={formData}
      editingId={editingId}
      showForm={showForm}
      loading={loading}
      error={error}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCancel={handleCancel}
    />
  );
}

export function AdminNotificationsController() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    const notificationData = await getAdminNotifications();
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

  const handleMarkRead = async (notificationId) => {
    try {
      await markAdminNotificationRead(notificationId);
      await loadNotifications();
    } catch (notificationError) {
      setError(notificationError.message);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAdminNotificationsRead();
      await loadNotifications();
    } catch (notificationError) {
      setError(notificationError.message);
    }
  };

  return (
    <AdminNotificationsView
      notifications={notifications}
      loading={loading}
      error={error}
      onMarkRead={handleMarkRead}
      onMarkAll={handleMarkAll}
    />
  );
}
