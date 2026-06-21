import api from './client';

export const submitIEEECheck = async (formData) => {
  const { data } = await api.post('/api/ai/ieee/check/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getIEEEReports = async () => {
  const { data } = await api.get('/api/ai/ieee/reports/');
  return data;
};

export const getIEEEReportDetail = async (id) => {
  const { data } = await api.get(`/api/ai/ieee/reports/${id}/`);
  return data;
};
