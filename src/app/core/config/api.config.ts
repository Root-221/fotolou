/**
 * Centralized API configuration for Fotolou.
 * Allows effortless switching between JSON Server (mock backend)
 * and the production Spring Boot API backend.
 */
export const API_CONFIG = {
  baseUrl: 'http://localhost:3000',
  endpoints: {
    salons: '/salons',
    tickets: '/tickets',
    products: '/products',
    categories: '/categories',
    orders: '/orders',
    relatives: '/relatives',
    notifications: '/notifications',
    users: '/users'
  },
  timeoutMs: 10000
};
