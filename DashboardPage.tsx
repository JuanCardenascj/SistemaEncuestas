import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';

const DashboardPage: React.FC = () => {
  // Datos de ejemplo (luego vendrán de la API)
  const stats = {
    totalEmpresas: 5,
    totalEncuestas: 12,
    totalRespuestas: 156,
    encuestasActivas: 8
  };

  const empresasRecientes = [
    { id: 1, nombre: 'Empresa de Prueba Grupo 6', encuestas: 3, fecha: '2025-11-27' },
    { id: 2, nombre: 'Test Company', encuestas: 2, fecha: '2025-11-26' },
    { id: 3, nombre: 'Mi Empresa Final', encuestas: 1, fecha: '2025-11-25' },
  ];

  const encuestasRecientes = [
    { id: 1, titulo: 'Satisfacción Cliente', empresa: 'Empresa de Prueba', respuestas: 45, estado: 'Activa' },
    { id: 2, titulo: 'Evaluación Servicio', empresa: 'Test Company', respuestas: 28, estado: 'Activa' },
    { id: 3, titulo: 'Encuesta Interna', empresa: 'Mi Empresa', respuestas: 12, estado: 'Finalizada' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al sistema de encuestas empresariales</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Empresas Registradas</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalEmpresas}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Encuestas</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalEncuestas}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Respuestas</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalRespuestas}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Encuestas Activas</p>
                <p className="text-3xl font-bold text-gray-800">{stats.encuestasActivas}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/empresas/registrar" 
              className="bg-white rounded-xl shadow p-6 border hover:border-blue-500 hover:shadow-lg transition group"
            >
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Registrar Empresa</h3>
                  <p className="text-sm text-gray-600">Agrega una nueva empresa al sistema</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/encuestas/crear" 
              className="bg-white rounded-xl shadow p-6 border hover:border-green-500 hover:shadow-lg transition group"
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg mr-4 group-hover:bg-green-200 transition">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Crear Encuesta</h3>
                  <p className="text-sm text-gray-600">Diseña una nueva encuesta</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/reportes" 
              className="bg-white rounded-xl shadow p-6 border hover:border-purple-500 hover:shadow-lg transition group"
            >
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg mr-4 group-hover:bg-purple-200 transition">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Generar Reporte</h3>
                  <p className="text-sm text-gray-600">Descarga reportes PDF/Excel</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Empresas recientes y encuestas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Empresas recientes */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Empresas Recientes</h2>
                <Link to="/empresas" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver todas →
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {empresasRecientes.map((empresa) => (
                <div key={empresa.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{empresa.nombre}</p>
                    <p className="text-sm text-gray-500">{empresa.encuestas} encuestas • {empresa.fecha}</p>
                  </div>
                  <Link 
                    to={`/empresas/${empresa.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Ver detalles
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Encuestas recientes */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Encuestas Recientes</h2>
                <Link to="/encuestas" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Ver todas →
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {encuestasRecientes.map((encuesta) => (
                <div key={encuesta.id} className="py-3 border-b last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-800">{encuesta.titulo}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      encuesta.estado === 'Activa' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {encuesta.estado}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{encuesta.empresa}</span>
                    <span>{encuesta.respuestas} respuestas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;