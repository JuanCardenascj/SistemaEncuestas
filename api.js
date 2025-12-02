// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Interceptor para agregar token a las peticiones
const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },
  
  // Métodos específicos
  async getEncuestas() {
    return this.request('/api/encuestas');
  },
  
  async createEncuesta(encuestaData) {
    return this.request('/api/encuestas', {
      method: 'POST',
      body: JSON.stringify(encuestaData),
    });
  },
  
  async login(email, password) {
    return this.request('/api/usuarios/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
};

export default api;