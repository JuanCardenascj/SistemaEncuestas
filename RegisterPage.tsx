import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    state: '',
    additionalDetails: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validaciones básicas
  if (formData.password !== formData.confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }
  
  // 1. PREPARAR DATOS para el backend
  const userData = {
    email: formData.email,
    password: formData.password,
    nombre: `${formData.firstName} ${formData.lastName}`,
    direccion: formData.address,
    estado: formData.state,
    detalles: formData.additionalDetails
  };
  
  console.log('Enviando datos:', userData);
  
  try {
    // 2. HACER LA PETICIÓN REAL al backend
    const response = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    // 3. VERIFICAR RESPUESTA
    const data = await response.json();
    console.log('Respuesta del backend:', data);
    
    if (response.ok) {
      alert('¡Registro exitoso! Redirigiendo al login...');
      navigate('/login');
    } else {
      // Mostrar error del backend
      alert(data.detail || `Error: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Error en la petición:', error);
    alert('Error de conexión con el servidor. Verifica que el backend esté corriendo en http://localhost:8000');
  }
};

  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    // Aquí iría la conexión con tu backend /api/usuarios/
    console.log('Registro attempt:', formData);
    
    // Redirigir al login después del registro
    alert('¡Registro exitoso! Redirigiendo al login...');
    navigate('/login');
  };*/

  // Opciones para el dropdown de estado
  const states = [
    'Seleccionar estado',
    'Antioquia',
    'Bogotá D.C.',
    'Valle del Cauca',
    'Atlántico',
    'Santander',
    'Cundinamarca',
    'Bolívar',
    'Nariño',
    'Córdoba',
    'Otro'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl">
        
        {/* Header */}
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-2xl">
                E
              </div>
              <h1 className="text-3xl font-bold text-gray-800 ml-3">Encuesta360</h1>
            </div>
            
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Volver al login
            </Link>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Create your account
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Complete todos los campos para crear su cuenta
          </p>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primera columna */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                >
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Segunda columna */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter your Address"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Additional details
                </label>
                <textarea
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                  placeholder="Enter additional details (hours, etc)"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Botón que ocupa ambas columnas */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition duration-200 mt-4"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 font-medium hover:text-blue-800 hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-2xl p-4 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Encuesta360. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;