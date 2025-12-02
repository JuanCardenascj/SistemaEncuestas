import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';

interface Reporte {
  id: string;
  nombre: string;
  encuesta_id: string;
  encuesta_titulo: string;
  empresa: string;
  formato: 'pdf' | 'xlsx';
  tipo: 'resumen' | 'detallado' | 'comparativo';
  creado_en: string;
  url_descarga: string;
  total_respuestas: number;
}

interface Empresa {
  id: string;
  nombre: string;
}

interface Encuesta {
  id: string;
  titulo: string;
  empresa_id: string;
}

const ReportesPage: React.FC = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerarModal, setShowGenerarModal] = useState(false);
  
  // Filtros
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string>('');
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState<string>('');
  const [formatoSeleccionado, setFormatoSeleccionado] = useState<'pdf' | 'xlsx'>('pdf');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'resumen' | 'detallado' | 'comparativo'>('resumen');

  // Datos de ejemplo
  const empresasEjemplo: Empresa[] = [
    { id: '1', nombre: 'Empresa de Prueba Grupo 6' },
    { id: '2', nombre: 'Test Company' },
    { id: '3', nombre: 'Mi Empresa Final' },
    { id: '4', nombre: 'Prueba Grupo TSP6' },
  ];

  const encuestasEjemplo: Encuesta[] = [
    { id: 'k5s5nyTV7oLnpuTRVcKmKk', titulo: 'Satisfacción Cliente - Atención Telefónica', empresa_id: '1' },
    { id: '2', titulo: 'Evaluación Servicio Postventa', empresa_id: '2' },
    { id: '3', titulo: 'Encuesta Interna de Clima Laboral', empresa_id: '3' },
    { id: '4', titulo: 'Satisfacción con Envío de Productos', empresa_id: '4' },
  ];

  const reportesEjemplo: Reporte[] = [
    {
      id: '1',
      nombre: 'Reporte Trimestral - Nov 2025',
      encuesta_id: 'k5s5nyTV7oLnpuTRVcKmKk',
      encuesta_titulo: 'Satisfacción Cliente - Atención Telefónica',
      empresa: 'Empresa de Prueba Grupo 6',
      formato: 'pdf',
      tipo: 'resumen',
      creado_en: '2025-11-30T10:30:00',
      url_descarga: '/api/reportes/1/descargar',
      total_respuestas: 45
    },
    {
      id: '2',
      nombre: 'Análisis Detallado Respuestas',
      encuesta_id: '2',
      encuesta_titulo: 'Evaluación Servicio Postventa',
      empresa: 'Test Company',
      formato: 'xlsx',
      tipo: 'detallado',
      creado_en: '2025-11-29T14:20:00',
      url_descarga: '/api/reportes/2/descargar',
      total_respuestas: 28
    },
    {
      id: '3',
      nombre: 'Comparativo Mensual',
      encuesta_id: '3',
      encuesta_titulo: 'Encuesta Interna de Clima Laboral',
      empresa: 'Mi Empresa Final',
      formato: 'pdf',
      tipo: 'comparativo',
      creado_en: '2025-11-28T09:15:00',
      url_descarga: '/api/reportes/3/descargar',
      total_respuestas: 12
    },
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setEmpresas(empresasEjemplo);
      setEncuestas(encuestasEjemplo);
      setReportes(reportesEjemplo);
      setLoading(false);
      
      // Seleccionar primera empresa por defecto
      if (empresasEjemplo.length > 0) {
        setEmpresaSeleccionada(empresasEjemplo[0].id);
      }
    }, 1000);
  }, []);

  // Filtrar encuestas por empresa seleccionada
  const encuestasFiltradas = empresaSeleccionada 
    ? encuestas.filter(e => e.empresa_id === empresaSeleccionada)
    : encuestas;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFormatoColor = (formato: string) => {
    switch (formato) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'xlsx': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'resumen': return 'bg-blue-100 text-blue-800';
      case 'detallado': return 'bg-purple-100 text-purple-800';
      case 'comparativo': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerarReporte = () => {
    // Aquí iría POST /api/reportes/
    const nuevoReporte: Reporte = {
      id: 'nuevo-' + Date.now(),
      nombre: `Reporte ${tipoSeleccionado} - ${new Date().toLocaleDateString()}`,
      encuesta_id: encuestaSeleccionada,
      encuesta_titulo: encuestas.find(e => e.id === encuestaSeleccionada)?.titulo || '',
      empresa: empresas.find(e => e.id === empresaSeleccionada)?.nombre || '',
      formato: formatoSeleccionado,
      tipo: tipoSeleccionado,
      creado_en: new Date().toISOString(),
      url_descarga: `/api/reportes/nuevo-${Date.now()}/descargar`,
      total_respuestas: Math.floor(Math.random() * 100) + 1
    };

    setReportes(prev => [nuevoReporte, ...prev]);
    setShowGenerarModal(false);
    alert(`Reporte generado exitosamente. Se descargará automáticamente.`);
    
    // Simular descarga
    setTimeout(() => {
      alert(`Descarga completada: ${nuevoReporte.nombre}.${nuevoReporte.formato}`);
    }, 1500);
  };

  const handleDescargar = (reporte: Reporte) => {
    // Aquí iría GET /api/reportes/{id}/descargar
    alert(`Iniciando descarga: ${reporte.nombre}.${reporte.formato}`);
    
    // Simular descarga
    setTimeout(() => {
      alert(`Descarga completada: ${reporte.nombre}.${reporte.formato}`);
    }, 1000);
  };

  const handleEliminar = (id: string, nombre: string) => {
    if (window.confirm(`¿Está seguro de eliminar el reporte "${nombre}"?`)) {
      setReportes(prev => prev.filter(reporte => reporte.id !== id));
      alert('Reporte eliminado');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reportes y Análisis</h1>
            <p className="text-gray-600">Genera y descarga reportes de tus encuestas en PDF o Excel</p>
          </div>
          
          <button
            onClick={() => setShowGenerarModal(true)}
            className="mt-4 md:mt-0 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generar Nuevo Reporte
          </button>
        </div>

        {/* Tarjeta de información */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-blue-800 text-lg">Formatos disponibles</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-blue-700">PDF</span>
                  <span className="text-blue-600 text-sm ml-2">(Para presentaciones)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-blue-700">Excel (XLSX)</span>
                  <span className="text-blue-600 text-sm ml-2">(Para análisis de datos)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filtrar Reportes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Empresa
              </label>
              <select
                value={empresaSeleccionada}
                onChange={(e) => {
                  setEmpresaSeleccionada(e.target.value);
                  setEncuestaSeleccionada('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Todas las empresas</option>
                {empresas.map(empresa => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Encuesta
              </label>
              <select
                value={encuestaSeleccionada}
                onChange={(e) => setEncuestaSeleccionada(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                disabled={!empresaSeleccionada}
              >
                <option value="">Todas las encuestas</option>
                {encuestasFiltradas.map(encuesta => (
                  <option key={encuesta.id} value={encuesta.id}>
                    {encuesta.titulo}
                  </option>
                ))}
              </select>
              {!empresaSeleccionada && (
                <p className="text-sm text-gray-500 mt-1">Selecciona una empresa primero</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Resultados
              </label>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{reportes.length}</p>
                  <p className="text-sm text-gray-500">Reportes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {reportes.filter(r => r.formato === 'pdf').length}
                  </p>
                  <p className="text-sm text-gray-500">PDF</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {reportes.filter(r => r.formato === 'xlsx').length}
                  </p>
                  <p className="text-sm text-gray-500">Excel</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de reportes */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Reportes Generados</h2>
            <p className="text-gray-600 text-sm">Total: {reportes.length} reportes</p>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando reportes...</p>
            </div>
          ) : reportes.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-gray-600 text-lg">No hay reportes generados</p>
              <button
                onClick={() => setShowGenerarModal(true)}
                className="mt-4 bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Generar primer reporte
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reporte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detalles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportes.map((reporte) => (
                    <tr key={reporte.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{reporte.nombre}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getFormatoColor(reporte.formato)}`}>
                              {reporte.formato.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTipoColor(reporte.tipo)}`}>
                              {reporte.tipo.charAt(0).toUpperCase() + reporte.tipo.slice(1)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">{reporte.encuesta_titulo}</p>
                          <p className="text-sm text-gray-500">{reporte.empresa}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {reporte.total_respuestas} respuestas
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{formatDate(reporte.creado_en)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleDescargar(reporte)}
                            className="text-blue-600 hover:text-blue-900 font-medium text-sm flex items-center"
                            title="Descargar"
                          >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Descargar
                          </button>
                          <button
                            onClick={() => handleEliminar(reporte.id, reporte.nombre)}
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

      {/* Modal para generar reporte */}
      {showGenerarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Generar Nuevo Reporte</h2>
                <button
                  onClick={() => setShowGenerarModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Nombre del Reporte *
                  </label>
                  <input
                    type="text"
                    defaultValue={`Reporte ${tipoSeleccionado} - ${new Date().toLocaleDateString()}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Ej: Reporte Trimestral Noviembre 2025"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Empresa *
                    </label>
                    <select
                      value={empresaSeleccionada}
                      onChange={(e) => {
                        setEmpresaSeleccionada(e.target.value);
                        setEncuestaSeleccionada('');
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    >
                      <option value="">Seleccionar empresa</option>
                      {empresas.map(empresa => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Encuesta *
                    </label>
                    <select
                      value={encuestaSeleccionada}
                      onChange={(e) => setEncuestaSeleccionada(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                      disabled={!empresaSeleccionada}
                    >
                      <option value="">Seleccionar encuesta</option>
                      {encuestasFiltradas.map(encuesta => (
                        <option key={encuesta.id} value={encuesta.id}>
                          {encuesta.titulo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Formato de salida *
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="formato"
                          value="pdf"
                          checked={formatoSeleccionado === 'pdf'}
                          onChange={() => setFormatoSeleccionado('pdf')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">PDF</span>
                        <span className="ml-1 text-xs text-gray-500">(Para presentar)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="formato"
                          value="xlsx"
                          checked={formatoSeleccionado === 'xlsx'}
                          onChange={() => setFormatoSeleccionado('xlsx')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">Excel (XLSX)</span>
                        <span className="ml-1 text-xs text-gray-500">(Para analizar)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Tipo de reporte *
                    </label>
                    <select
                      value={tipoSeleccionado}
                      onChange={(e) => setTipoSeleccionado(e.target.value as any)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="resumen">Resumen ejecutivo</option>
                      <option value="detallado">Detallado con gráficos</option>
                      <option value="comparativo">Comparativo histórico</option>
                    </select>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-yellow-700 font-medium">El reporte incluirá:</p>
                      <ul className="text-yellow-600 text-sm mt-1 list-disc list-inside">
                        <li>Estadísticas generales de la encuesta</li>
                        <li>Gráficos de distribución de respuestas</li>
                        <li>Análisis por pregunta</li>
                        <li>Recomendaciones basadas en los resultados</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowGenerarModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGenerarReporte}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center"
                  disabled={!empresaSeleccionada || !encuestaSeleccionada}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generar y Descargar Reporte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportesPage;