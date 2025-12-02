import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import empresasService from '../services/empresas';
import type { Empresa, EmpresaCreate } from '../services/empresas';

interface EmpresaLocal {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  creado_en: string;
  encuestas_count?: number;
}

const EmpresasPage: React.FC = () => {
  const [empresas, setEmpresas] = useState<EmpresaLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  });

  // Conectar con la API real
  useEffect(() => {
    const loadEmpresas = async () => {
      setLoading(true);
      try {
        // 🔴 ESTA ES LA PARTE IMPORTANTE: Llama a la API REAL
        const data = await empresasService.getAll();
        // Convertir datos de API a nuestro formato local
        const empresasConvertidas: EmpresaLocal[] = data.map((empresa: Empresa) => ({
          id: empresa.id,
          nombre: empresa.nombre,
          email: empresa.email,
          telefono: empresa.telefono,
          creado_en: empresa.creado_en,
          encuestas_count: 0 // Por defecto, luego se puede calcular
        }));
        setEmpresas(empresasConvertidas);
      } catch (error) {
        console.error('Error cargando empresas:', error);
        alert('Error al cargar las empresas: ' + (error as any).message);
        
        // 🟡 Datos de ejemplo SOLO si falla la API
        const empresasEjemplo: EmpresaLocal[] = [
          {
            id: '1',
            nombre: 'Empresa de Prueba Grupo 6',
            email: 'prueba@grupotesp6.com',
            telefono: '3001234567',
            creado_en: '2025-11-27',
            encuestas_count: 3
          },
          {
            id: '2',
            nombre: 'Test Company',
            email: 'test@company.com',
            telefono: '3105558888',
            creado_en: '2025-11-26',
            encuestas_count: 2
          },
        ];
        setEmpresas(empresasEjemplo);
      } finally {
        setLoading(false);
      }
    };

    loadEmpresas();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 🔴 CONEXIÓN REAL CON LA API
      const empresaData: EmpresaCreate = {
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password
      };
      
      const nuevaEmpresaAPI = await empresasService.create(empresaData);
      
      // Convertir respuesta de API a formato local
      const nuevaEmpresa: EmpresaLocal = {
        id: nuevaEmpresaAPI.id,
        nombre: nuevaEmpresaAPI.nombre,
        email: nuevaEmpresaAPI.email,
        telefono: nuevaEmpresaAPI.telefono,
        creado_en: nuevaEmpresaAPI.creado_en,
        encuestas_count: 0
      };
      
      // Agregar la nueva empresa a la lista
      setEmpresas(prev => [nuevaEmpresa, ...prev]);
      setFormData({ nombre: '', email: '', telefono: '', password: '' });
      setShowModal(false);
      alert('¡Empresa registrada exitosamente!');
    } catch (error: any) {
      console.error('Error registrando empresa:', error);
      alert('Error al registrar empresa: ' + error.message);
      
      // Fallback: agregar empresa localmente si la API falla
      const nuevaEmpresa: EmpresaLocal = {
        id: (empresas.length + 1).toString(),
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        creado_en: new Date().toISOString().split('T')[0],
        encuestas_count: 0
      };
      
      setEmpresas(prev => [nuevaEmpresa, ...prev]);
      setFormData({ nombre: '', email: '', telefono: '', password: '' });
      setShowModal(false);
      alert('¡Empresa registrada localmente (API no disponible)!');
    }
  };

  const handleDelete = (id: string, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar la empresa "${nombre}"?`)) {
      // Aquí iría la llamada a la API para eliminar
      // empresasService.delete(id);
      
      // Por ahora solo eliminamos localmente
      setEmpresas(prev => prev.filter(empresa => empresa.id !== id));
      alert('Empresa eliminada');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Empresas</h1>
            <p className="text-gray-600">Administra las empresas registradas en el sistema</p>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Registrar Nueva Empresa
          </button>
        </div>

        {/* Tarjeta de información */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-blue-800 text-lg">Importante</h3>
              <p className="text-blue-700">
                Cada empresa tiene sus propias encuestas y usuarios autorizados. 
                Los usuarios de una empresa solo pueden acceder a las encuestas de su empresa.
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de empresas */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Empresas Registradas</h2>
            <p className="text-gray-600 text-sm">Total: {empresas.length} empresas</p>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando empresas...</p>
            </div>
          ) : empresas.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="mt-4 text-gray-600 text-lg">No hay empresas registradas</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Registrar la primera empresa
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Encuestas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Registro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {empresas.map((empresa) => (
                    <tr key={empresa.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">{empresa.nombre}</p>
                          <p className="text-sm text-gray-500">ID: {empresa.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-gray-900">{empresa.email}</p>
                          <p className="text-sm text-gray-500">{empresa.telefono}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          empresa.encuestas_count && empresa.encuestas_count > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {empresa.encuestas_count || 0} encuestas
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {formatDate(empresa.creado_en)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link 
                            to={`/empresas/${empresa.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalles"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link 
                            to={`/empresas/${empresa.id}/editar`}
                            className="text-green-600 hover:text-green-900"
                            title="Editar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(empresa.id, empresa.nombre)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para registrar empresa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Registrar Nueva Empresa</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Nombre de la Empresa *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Ej: Mi Empresa S.A.S."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Email de Contacto *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="contacto@empresa.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="+57 300 123 4567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Contraseña Inicial *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Contraseña para el usuario admin"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Será la contraseña del usuario administrador de esta empresa
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Registrar Empresa
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpresasPage;