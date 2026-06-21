import api from './client';

//خالص
export const login = async (email, password) => {
  const { data } = await api.post('/api/auth/ASPU-2004/login/', { email, password });
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

//خالص
export const register = async (payload) => {
  const { data } = await api.post('/api/auth/ASPU-2004/register/', payload);
  return data;
};
//خالص
export const logout = async () => {
  const refresh = localStorage.getItem('refresh_token');
  try {
    await api.post('/api/auth/ASPU-2004/logout/', { refresh });
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

//خالص
export const getProfile = async () => {
  const { data } = await api.get('/api/auth/ASPU-2004/profile/');
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch('/api/auth/ASPU-2004/profile/', payload);
  return data;
};

export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
  const { data } = await api.post('/api/auth/change-password/', {
    old_password: oldPassword,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });
  return data;
};

export const requestPasswordReset = async (email) => {
  const { data } = await api.post('/api/auth/password-reset/', { email });
  return data;
};

export const confirmPasswordReset = async (token, newPassword, confirmPassword) => {
  const { data } = await api.post('/api/auth/password-reset/confirm/', {
    token,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });
  return data;
};

export const verifyEmail = async (token) => {
  const { data } = await api.post('/api/auth/verify-email/', { token });
  return data;
};

export const isAuthenticated = () => !!localStorage.getItem('access_token');

export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};
