import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Tratamento básico para erro 401 (Não autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Tentar refresh token (simplificado para este momento)
        // const { data } = await axios.post(`${API_URL}/auth/refresh`);
        // useAuthStore.getState().setAuth(data.user, data.accessToken);
        // originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        // return api(originalRequest);
        
        // Fallback: deslogar
        useAuthStore.getState().logout();
        window.location.href = '/login';
      } catch (err) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
