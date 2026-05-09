import { useEffect, useState } from 'react';
import ProfileView from '../views/profile/ProfileView';
import { getProfile, updateProfile } from '../models/profileModel';
import { sessionModel } from '../models/sessionModel';

const initialFormState = {
  username: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: ''
};

export function ProfileController() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfile();
        const profileUser = response.user || null;
        setUser(profileUser);
        setFormData({
          username: profileUser?.username || '',
          email: profileUser?.email || '',
          phone: profileUser?.phone || '',
          address: profileUser?.address || '',
          password: '',
          confirmPassword: ''
        });
      } catch (profileError) {
        setError(profileError.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      };

      const response = await updateProfile(payload);
      const updatedUser = response.user || null;
      setUser(updatedUser);
      sessionModel.setUser(updatedUser);
      setFormData((current) => ({ ...current, password: '', confirmPassword: '' }));
      setSuccessMessage('Profile updated successfully');
    } catch (profileError) {
      setError(profileError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileView
      loading={loading}
      saving={saving}
      error={error}
      successMessage={successMessage}
      user={user}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}