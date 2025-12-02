import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🔴 CONEXIÓN REAL CON BACKEND
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe
        }),
      });

      const data = await response.json();

      if (data.success) {
        // ✅ Login exitoso
        console.log('Login exitoso:', data);
        
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isAuthenticated', 'true');
        
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Redirigir al dashboard
        navigate('/dashboard');
        
      } else {
        // ❌ Error en login
        setError(data.message || 'Error en el login');
      }
      
    } catch (err: any) {
      console.error('Error de conexión:', err);
      setError('Error de conexión con el servidor');
      
      // 🟡 FALLBACK: Login simulado para desarrollo
      alert('⚠️ Backend no disponible. Usando login de demostración.');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 'demo-user',
        email: email,
        nombre: 'Usuario Demo',
        rol: 'admin'
      }));
      navigate('/dashboard');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        
        {/* Header */}
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-2xl">
              E
            </div>
            <h1 className="text-3xl font-bold text-gray-800 ml-3">Encuesta360</h1>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Ingresa tus credenciales para acceder al sistema
          </p>

          {/* Mostrar error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">❌ {error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Tu contraseña"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <label htmlFor="remember" className="ml-2 text-gray-700 text-sm">
                  Recordarme
                </label>
              </div>
              
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Conectando...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/register" 
                className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
              >
                Crear cuenta
              </Link>
            </p>
          </div>

          {/* Información de debug */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
            <p className="font-medium">ℹ️ Para pruebas:</p>
            <p>Backend: http://localhost:8000</p>
            <p>Endpoint: POST /api/auth/login</p>
            <button 
              onClick={() => {
                setEmail('admin@test.com');
                setPassword('123456');
              }}
              className="mt-2 text-blue-600 hover:underline"
            >
              Cargar credenciales de prueba
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-2xl p-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Encuesta360. Sistema de Encuestas Empresariales
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;