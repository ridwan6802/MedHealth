import { Navigate, Route, Routes } from 'react-router-dom';
import HomeController from '../controllers/HomeController';
import { LoginController, SignupController } from '../controllers/authController';
import {
  CustomerDashboardController,
  CartController,
  CheckoutController,
  CustomerMessagesController,
  OrdersController
} from '../controllers/customerController';
import { ProfileController } from '../controllers/profileController';
import AboutView from '../views/AboutView';
import {
  AdminDashboardController,
  AdminUsersController,
  AdminMedicinesController,
  AdminCategoriesController,
  AdminNotificationsController,
  AdminMessagesController,
  AdminConversationController
} from '../controllers/adminController';
import {
  StaffDashboardController,
  StaffMessagesController,
  StaffConversationController,
  StaffNotificationsController,
  StaffMedicinesController,
  StaffOrdersController,
  StaffOrderDetailsController
} from '../controllers/staffController';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeController />} />
      <Route path="/login" element={<LoginController />} />
      <Route path="/signup" element={<SignupController />} />
      <Route
        path="/customer"
        element={
          <ProtectedRoute roles={["customer"]}>
            <CustomerDashboardController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/cart"
        element={
          <ProtectedRoute roles={["customer"]}>
            <CartController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/checkout"
        element={
          <ProtectedRoute roles={["customer"]}>
            <CheckoutController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/messages"
        element={
          <ProtectedRoute roles={["customer"]}>
            <CustomerMessagesController />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<AboutView />} />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute roles={["customer"]}>
            <OrdersController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={["customer", "admin", "staff"]}>
            <ProfileController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboardController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminUsersController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/medicines"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminMedicinesController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminCategoriesController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminNotificationsController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminMessagesController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages/:customerId"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminConversationController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffDashboardController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/messages"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffMessagesController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/messages/:customerId"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffConversationController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/notifications"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffNotificationsController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/orders"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffOrdersController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/orders/:customerId"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffOrderDetailsController />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/medicines"
        element={
          <ProtectedRoute roles={["staff"]}>
            <StaffMedicinesController />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
