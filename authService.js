// frontend/src/services/authService.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authService = {
  // Registrar empresa
  async registerEmpresa(empresaData) {
    try {
      console.log('Enviando registro a:', `${API_URL}/api/empresas/registro`);
      
      const response = await fetch(`${API_URL}/api/empresas/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empresaData),
      });

      console.log('Respuesta HTTP:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);
      return data;
      
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  // Login de usuario
  async login(credentials) {
    try {
      console.log('Enviando login a:', `${API_URL}/api/usuarios/login`);
      
      const response = await fetch(`${API_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Respuesta login:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}`);
      }

      const data = await response.json();
      console.log('Login exitoso:', data);
      
      // Guardar token en localStorage
      if (data.token || data.access_token) {
        localStorage.setItem('token', data.token || data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user || data));
      }
      
      return data;
      
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('token');
  }
};