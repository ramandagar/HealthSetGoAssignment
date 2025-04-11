import axios from 'axios';

// Base URL for all API calls
export const BASE_URL = 'https://fakestoreapi.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API endpoints
export const endpoints = {
  products: '/products',
  product: (id) => `/products/${id}`,
  login: '/auth/login',
};

// API request methods
export const fetchProducts = async () => {
  try {
    const response = await api.get(endpoints.products);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to fetch products';
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(endpoints.product(id));
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Failed to fetch product';
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post(endpoints.login, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Login failed';
  }
};

export default api; 