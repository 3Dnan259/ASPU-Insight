import api from './client';


//خالص
// جلب كل الأبحاث (مع دعم الفلترة والبحث عبر query params)
export const getPapers = async (params = {}) => {
  const { data } = await api.get('/api/research/researchAspu2004/papers/', { params });
  return data;
};

// تقديم بحث جديد
//خالص
export const createPaper = async (payload) => {
  const { data } = await api.post('/api/research/researchAspu2004/papers/', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

// جلب بحث محدد
//خالص
export const getPaper = async (id) => {
  const { data } = await api.get(`/api/research/researchAspu2004/papers/${id}`);
  return data;
};

// تعديل بحث كامل
export const updatePaper = async (id, payload) => {
  const { data } = await api.put(`/api/research/researchAspu2004/papers/${id}/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// حذف بحث
export const deletePaper = async (id) => {
  const { data } = await api.delete(`/api/research/researchAspu2004/papers/${id}/`);
  return data;
};

// ══ ASSISTANT REVIEW ══

// جلب نتيجة مراجعة الذكاء الاصطناعي لبحث معين
export const getAssistantReview = async (paperId) => {
  const { data } = await api.get(`/api/research/papers/${paperId}/assistant-review/`);
  return data;
};

// طلب مراجعة الذكاء الاصطناعي لبحث معين
export const requestAssistantReview = async (paperId, payload = {}) => {
  const { data } = await api.post(`/api/research/papers/${paperId}/assistant-review/`, payload);
  return data;
};

// ══ EDITOR REVIEW — INITIAL ══

// جلب المراجعة الأولية من المحرر
export const getEditorReviewInitial = async (paperId) => {
  const { data } = await api.get(`/api/research/papers/${paperId}/editor-review/initial/`);
  return data;
};

// إرسال المراجعة الأولية من المحرر
export const submitEditorReviewInitial = async (paperId, payload) => {
  const { data } = await api.post(`/api/research/papers/${paperId}/editor-review/initial/`, payload);
  return data;
};

// ══ EDITOR REVIEW — FINAL ══

// جلب المراجعة النهائية من المحرر
export const getEditorReviewFinal = async (paperId) => {
  const { data } = await api.get(`/api/research/papers/${paperId}/editor-review/final/`);
  return data;
};

// إرسال المراجعة النهائية من المحرر
export const submitEditorReviewFinal = async (paperId, payload) => {
  const { data } = await api.post(`/api/research/papers/${paperId}/editor-review/final/`, payload);
  return data;
};

// ══ PUBLISH ══

// نشر البحث (بعد اكتمال المراجعة)
export const publishPaper = async (paperId) => {
  const { data } = await api.post(`/api/research/papers/${paperId}/publish/`);
  return data;
};