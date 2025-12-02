import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Aquí iría la lógica de logout
    alert('Sesión cerrada');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
              E
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Encuesta360</h1>
              <p className="text-xs text-gray-500">Sistema de Encuestas Empresariales</p>
            </div>
          </div>

          {/* Menú derecho */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/empresas" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Empresas
              </Link>
              <Link 
                to="/encuestas" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Encuestas
              </Link>
              <Link 
                to="/reportes" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Reportes
              </Link>
            </div>

            {/* Perfil usuario */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="font-medium text-gray-800">Juan David Cárdenas</p>
                <p className="text-sm text-gray-500">Administrador</p>
              </div>
              
              <div className="relative">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer">
                  <span className="font-bold text-blue-600">JD</span>
                </div>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border hidden">
                  <div className="py-2">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Configuración
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón logout móvil */}
              <button
                onClick={handleLogout}
                className="md:hidden text-gray-600 hover:text-red-600"
                title="Cerrar sesión"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden mt-4 pt-4 border-t flex justify-around">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Dashboard</span>
            </div>
          </Link>
          
          <Link to="/encuestas" className="text-gray-700 hover:text-blue-600">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs mt-1">Encuestas</span>
            </div>
          </Link>
          
          <Link to="/reportes" className="text-gray-700 hover:text-blue-600">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs mt-1">Reportes</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;