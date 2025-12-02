// frontend/src/components/LoginForm.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

function LoginForm({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Intentando login con:', credentials);
      
      const result = await authService.login(credentials);
      
      console.log('Login exitoso:', result);
      
      if (onLoginSuccess) {
        onLoginSuccess(result);
      }
      
      // Redireccionar o actualizar estado
      window.location.href = '/dashboard'; // Cambia según tu router
      
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      
      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Tu contraseña"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="register-link">
        <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
      </div>

      <style jsx>{`
        .login-form {
          max-width: 400px;
          margin: 50px auto;
          padding: 30px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        h2 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          color: #555;
          font-weight: 600;
        }
        
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        input:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }
        
        .alert-error {
          background-color: #ffeaea;
          border: 1px solid #ffcccc;
          color: #d8000c;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
        }
        
        .btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .register-link {
          text-align: center;
          margin-top: 20px;
          color: #666;
        }
        
        .register-link a {
          color: #4a90e2;
          text-decoration: none;
          font-weight: 600;
        }
        
        .register-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default LoginForm;