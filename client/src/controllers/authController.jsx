import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginView from '../views/auth/LoginView';
import SignupView from '../views/auth/SignupView';
import { login, register } from '../models/authModel';

const loginInitialState = {
  email: '',
  password: ''
};

const signupInitialState = {
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'customer',
  terms: false
};

export function LoginController() {
  const [formData, setFormData] = useState(loginInitialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else if (result.user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/customer');
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return <LoginView formData={formData} error={error} loading={loading} onChange={handleChange} onSubmit={handleSubmit} />;
}

export function SignupController() {
  const [formData, setFormData] = useState(signupInitialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ phone: '', email: '' });
  const navigate = useNavigate();

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!/^01\d{9}$/.test(cleanPhone)) {
      return 'Phone number must be exactly 11 digits and start with 01';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validate phone and email on change
    if (name === 'phone') {
      setValidationErrors((current) => ({
        ...current,
        phone: validatePhone(value)
      }));
    } else if (name === 'email') {
      setValidationErrors((current) => ({
        ...current,
        email: validateEmail(value)
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Validate phone
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      setError(phoneError);
      setValidationErrors((current) => ({ ...current, phone: phoneError }));
      setLoading(false);
      return;
    }

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      setValidationErrors((current) => ({ ...current, email: emailError }));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.terms) {
      setError('You must accept the terms');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else if (result.user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/customer');
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return <SignupView formData={formData} error={error} validationErrors={validationErrors} loading={loading} onChange={handleChange} onSubmit={handleSubmit} />;
}
