import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('tourista_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tourista_token');
      localStorage.removeItem('tourista_user');
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
  toggleWishlist: (propertyId) => API.post(`/auth/wishlist/${propertyId}`),
};

// Properties
export const propertyAPI = {
  getAll: (params) => API.get('/properties', { params }),
  getById: (id) => API.get(`/properties/${id}`),
  create: (data) => API.post('/properties', data),
  update: (id, data) => API.put(`/properties/${id}`, data),
  delete: (id) => API.delete(`/properties/${id}`),
  approve: (id, status) => API.patch(`/properties/${id}/approve`, { status }),
  getMy: () => API.get('/properties/host/my'),
  getMapData: () => API.get('/properties/map'),
};

// Places
export const placeAPI = {
  getAll: (params) => API.get('/places', { params }),
  getById: (id) => API.get(`/places/${id}`),
  create: (data) => API.post('/places', data),
  update: (id, data) => API.put(`/places/${id}`, data),
  delete: (id) => API.delete(`/places/${id}`),
  approve: (id, data) => API.patch(`/places/${id}/approve`, data),
  getMapData: () => API.get('/places/map'),
};

// Experiences
export const experienceAPI = {
  getAll: (params) => API.get('/experiences', { params }),
  getById: (id) => API.get(`/experiences/${id}`),
  create: (data) => API.post('/experiences', data),
  update: (id, data) => API.put(`/experiences/${id}`, data),
  delete: (id) => API.delete(`/experiences/${id}`),
  approve: (id, data) => API.patch(`/experiences/${id}/approve`, data),
  getMy: () => API.get('/experiences/host/my'),
};

// Bookings
export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getMy: () => API.get('/bookings/my'),
  getById: (id) => API.get(`/bookings/${id}`),
  cancel: (id, reason) => API.patch(`/bookings/${id}/cancel`, { reason }),
  getHostBookings: () => API.get('/bookings/host'),
  confirm: (id) => API.patch(`/bookings/${id}/confirm`),
};

// Reviews
export const reviewAPI = {
  create: (data) => API.post('/reviews', data),
  getByTarget: (targetId) => API.get(`/reviews/target/${targetId}`),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

// Admin
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  updateUser: (id, data) => API.patch(`/admin/users/${id}`, data),
  getPending: () => API.get('/admin/pending'),
  getBookings: (params) => API.get('/admin/bookings', { params }),
};

// Image Upload (Cloudinary)
export const uploadAPI = {
  // Upload 1–10 property images, returns { images: [{url, public_id}] }
  uploadPropertyImages: (formData) =>
    API.post('/upload/property', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Upload 1–8 place images
  uploadPlaceImages: (formData) =>
    API.post('/upload/place', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Upload 1–6 experience images
  uploadExperienceImages: (formData) =>
    API.post('/upload/experience', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Upload single avatar
  uploadAvatar: (formData) =>
    API.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // Delete image from Cloudinary by public_id
  deleteImage: (publicId) =>
    API.delete(`/upload/${encodeURIComponent(publicId)}`),
};

export default API;
