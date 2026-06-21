import api from './client';

export const getUsers = async (params = {}) => {
  const { data } = await api.get('/api/admin/users/', { params });
  return data;
};

export const getUserDetail = async (userId) => {
  const { data } = await api.get(`/api/admin/users/${userId}/`);
  return data;
};

export const updateUser = async (userId, payload) => {
  const { data } = await api.patch(`/api/admin/users/${userId}/`, payload);
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await api.delete(`/api/admin/users/${userId}/`);
  return data;
};

export const adminVerifyEmail = async (userId) => {
  const { data } = await api.post(`/api/admin/users/${userId}/verify-email/`);
  return data;
};

export const adminResendVerification = async (userId) => {
  const { data } = await api.post(`/api/admin/users/${userId}/resend-verification/`);
  return data;
};
