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
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

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

  return <SignupView formData={formData} error={error} loading={loading} onChange={handleChange} onSubmit={handleSubmit} />;
}
