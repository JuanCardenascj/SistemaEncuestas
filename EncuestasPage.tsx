import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';

interface Encuesta {
  id: string;
  titulo: string;
  descripcion: string;
  empresa: string;
  empresa_id: string;
  estado: 'activa' | 'inactiva' | 'finalizada';
  fecha_inicio: string;
  fecha_fin: string;
  total_respuestas: number;
  total_preguntas: number;
  enlace_corto: string;
  enlace_largo: string;
  codigo_qr?: string;
}

const EncuestasPage: React.FC = () => {
  const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState<string | null>(null);
  const [selectedEncuesta, setSelectedEncuesta] = useState<Encuesta | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo (luego vendrán de GET /api/encuestas/)
  const encuestasEjemplo: Encuesta[] = [
    {
      id: 'k5s5nyTV7oLnpuTRVcKmKk',
      titulo: 'Satisfacción Cliente - Atención Telefónica',
      descripcion: 'Evaluación del servicio de atención al cliente vía telefónica',
      empresa: 'Empresa de Prueba Grupo 6',
      empresa_id: '1',
      estado: 'activa',
      fecha_inicio: '2025-11-28',
      fecha_fin: '2025-12-31',
      total_respuestas: 45,
      total_preguntas: 5,
      enlace_corto: 'http://localhost:3000/e/ABRknKGg',
      enlace_largo: 'http://localhost:3000/encuesta/k5s5nyTV7oLnpuTRVcKmKk',
      codigo_qr: 'iVBORw0KGgoAAAANSUhEUgAAAa4AAAGuAQAAAADgjt83AAADJUlEQVR4nO1cW27jMAyk5AD9jIEeoEdRb7BHKvZIewP7KDlAAOezgAwuSD2sjbDAunCbajXzkdqxidrUgKRGVAzTB7Daj1gRwawCXFIBLqkAl1SASyrAJRXgkgpwSQW4pE2XECumfDqdPTEv2ykzOfbp+llv9028m4XZwSw5h9En/SC3UKKKkCYwp7wPA1ChC5esxphRDm5PrNwwr8qhyxObN+HLbIx59EPug915fwTMKpzuv5h/eOJ5XNjM4xASDc/j9e4ueLJCXy65CXFuJ+KJVgkeqwmx5HP+2z8BZt8llgwiwq5SiFwNCzfILc/euF8plrhSpcW4VeiBJbet5hCcryeeX94Nzy8+3BKvnxt6NwuzY+c4GyYauJgOu2WQmfAdMMfpi5NUzHCFG5QUEbk2sFIlqSlKH7Ck41iyJAWNNr4kkS0GFNVQEEu61l6HWJy6pKrpEXMgiEaVLfcg43Ral/hwRFGNz9klC7DxKljSdyzhXLNyPNUElEOLBBTUJX3XJUP4SwEheAhBwkcMMqhLOp/j+FipUooqoVzNRzGqIOP03jngNKfkOlav5twTjjDH6T3jUIwWPnEj6SWxfUDog1jS9nDbA2IJ5w6SRJpNLwllLWJJ79orhdMlKmiRG4UKi4zT/HDbIzIOC1WyvpYb1rLsio7GxofbHlG90p8tjLqsU6Yd1CW995d4oQwJOLQiza+x58Q4aWvUnpPHPKSF2bdR6CnEEkrlx7TNbPJaIOY4vfeXUMwpPk9qUh2riAIs1nH6NZuNpp4155TVhB76TWSbRyL+Obb3bnthd1v02KtGqXDNm7i2HiXEkr5jSQSpAKubcnIPQQwyulHnkQ+5F3a3hQJmf3VJ7mN0l5Ns2NLcM7B5u+herTLtlGY7YWHW+pow5eUaLhocQ3GigPba/HDbg1jCqaskzY7jvAdrwv/DcNuDdoDS7ZlJtmkZNw1MsilHv1ZVjZt6Nwuzz/3NAU4/RRHX/dKKMdaEu+QkFes4VAgkqR9JM07YfYH9ON2aGfxGY5PjZmF2D7ikAlxSAS6pAJdUgEsqwCUV4JIKXzvH+Q17O1dn2xY1WgAAAABJRU5ErkJggg=='
    },
    {
      id: '2',
      titulo: 'Evaluación Servicio Postventa',
      descripcion: 'Encuesta para medir satisfacción después de la compra',
      empresa: 'Test Company',
      empresa_id: '2',
      estado: 'activa',
      fecha_inicio: '2025-11-25',
      fecha_fin: '2025-12-25',
      total_respuestas: 28,
      total_preguntas: 4,
      enlace_corto: 'http://localhost:3000/e/XyZ123Ab',
      enlace_largo: 'http://localhost:3000/encuesta/abc123def456'
    },
    {
      id: '3',
      titulo: 'Encuesta Interna de Clima Laboral',
      descripcion: 'Medición del ambiente laboral en la empresa',
      empresa: 'Mi Empresa Final',
      empresa_id: '3',
      estado: 'finalizada',
      fecha_inicio: '2025-11-01',
      fecha_fin: '2025-11-20',
      total_respuestas: 12,
      total_preguntas: 7,
      enlace_corto: 'http://localhost:3000/e/789DEF',
      enlace_largo: 'http://localhost:3000/encuesta/xyz789abc'
    },
    {
      id: '4',
      titulo: 'Satisfacción con Envío de Productos',
      descripcion: 'Evaluación del servicio de logística y entrega',
      empresa: 'Prueba Grupo TSP6',
      empresa_id: '4',
      estado: 'inactiva',
      fecha_inicio: '2025-12-01',
      fecha_fin: '2025-12-31',
      total_respuestas: 0,
      total_preguntas: 6,
      enlace_corto: 'http://localhost:3000/e/GHI456',
      enlace_largo: 'http://localhost:3000/encuesta/def456ghi'
    },
  ];

  useEffect(() => {
    // Simular carga de API
    setTimeout(() => {
      setEncuestas(encuestasEjemplo);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrar encuestas
  const encuestasFiltradas = encuestas.filter(encuesta => {
    const coincideEstado = filtroEstado === 'todas' || encuesta.estado === filtroEstado;
    const coincideBusqueda = encuesta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            encuesta.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'bg-green-100 text-green-800';
      case 'inactiva': return 'bg-yellow-100 text-yellow-800';
      case 'finalizada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'activa': return 'Activa';
      case 'inactiva': return 'Inactiva';
      case 'finalizada': return 'Finalizada';
      default: return estado;
    }
  };

  const handleDuplicar = (encuesta: Encuesta) => {
    // Aquí iría POST /api/encuestas/{id}/duplicar
    const nuevaEncuesta = {
      ...encuesta,
      id: 'nueva-' + Date.now(),
      titulo: `${encuesta.titulo} (Copia)`,
      total_respuestas: 0,
      estado: 'activa' as const
    };
    setEncuestas(prev => [nuevaEncuesta, ...prev]);
    alert(`Encuesta "${encuesta.titulo}" duplicada exitosamente`);
  };

  const handleCambiarEstado = (id: string, nuevoEstado: 'activa' | 'inactiva' | 'finalizada') => {
    setEncuestas(prev => prev.map(encuesta => 
      encuesta.id === id ? { ...encuesta, estado: nuevoEstado } : encuesta
    ));
    alert(`Estado actualizado a: ${getEstadoTexto(nuevoEstado)}`);
  };

  const handleEliminar = (id: string, titulo: string) => {
    if (window.confirm(`¿Está seguro de eliminar la encuesta "${titulo}"?`)) {
      setEncuestas(prev => prev.filter(encuesta => encuesta.id !== id));
      alert('Encuesta eliminada');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Encuestas</h1>
            <p className="text-gray-600">Crea, administra y comparte tus encuestas empresariales</p>
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Nueva Encuesta
            </button>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Buscar encuesta
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Buscar por título o empresa..."
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Filtrar por estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="todas">Todas las encuestas</option>
                <option value="activa">Activas</option>
                <option value="inactiva">Inactivas</option>
                <option value="finalizada">Finalizadas</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Estadísticas
              </label>
              <div className="flex space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{encuestas.length}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {encuestas.filter(e => e.estado === 'activa').length}
                  </p>
                  <p className="text-sm text-gray-500">Activas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">
                    {encuestas.reduce((sum, e) => sum + e.total_respuestas, 0)}
                  </p>
                  <p className="text-sm text-gray-500">Respuestas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de encuestas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando encuestas...</p>
            </div>
          ) : encuestasFiltradas.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-gray-600 text-lg">No hay encuestas que coincidan con tu búsqueda</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700"
              >
                Crear primera encuesta
              </button>
            </div>
          ) : (
            encuestasFiltradas.map((encuesta) => (
              <div key={encuesta.id} className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300">
                {/* Header de la tarjeta */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg line-clamp-2">{encuesta.titulo}</h3>
                      <p className="text-sm text-gray-500 mt-1">{encuesta.empresa}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(encuesta.estado)}`}>
                      {getEstadoTexto(encuesta.estado)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{encuesta.descripcion}</p>
                </div>

                {/* Información de la encuesta */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-500">Fecha inicio</p>
                      <p className="font-medium text-gray-800">{formatDate(encuesta.fecha_inicio)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fecha fin</p>
                      <p className="font-medium text-gray-800">{formatDate(encuesta.fecha_fin)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Preguntas</p>
                      <p className="font-medium text-gray-800">{encuesta.total_preguntas}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Respuestas</p>
                      <p className="font-medium text-gray-800">{encuesta.total_respuestas}</p>
                    </div>
                  </div>

                  {/* Enlaces */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-1 mr-3">
                        <p className="text-xs text-gray-500 mb-1">Enlace corto</p>
                        <p className="text-sm font-medium text-blue-600 truncate">{encuesta.enlace_corto}</p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(encuesta.enlace_corto)}
                        className="text-gray-500 hover:text-blue-600"
                        title="Copiar enlace"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    {encuesta.codigo_qr && (
                      <button
                        onClick={() => {
                          setSelectedEncuesta(encuesta);
                          setShowQRModal(encuesta.id);
                        }}
                        className="w-full flex items-center justify-center bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        Ver Código QR
                      </button>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/encuestas/${encuesta.id}`}
                      className="flex-1 min-w-[120px] bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Ver Detalles
                    </Link>
                    
                    <button
                      onClick={() => handleDuplicar(encuesta)}
                      className="flex-1 min-w-[120px] bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                      title="Duplicar encuesta"
                    >
                      Duplicar
                    </button>

                    <div className="relative group flex-1 min-w-[120px]">
                      <button className="w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                        Más
                      </button>
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border hidden group-hover:block z-10">
                        <div className="py-2">
                          <button
                            onClick={() => handleCambiarEstado(encuesta.id, 'activa')}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                          >
                            Marcar como Activa
                          </button>
                          <button
                            onClick={() => handleCambiarEstado(encuesta.id, 'inactiva')}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                          >
                            Marcar como Inactiva
                          </button>
                          <button
                            onClick={() => handleCambiarEstado(encuesta.id, 'finalizada')}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                          >
                            Marcar como Finalizada
                          </button>
                          <div className="border-t my-1"></div>
                          <button
                            onClick={() => handleEliminar(encuesta.id, encuesta.titulo)}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                          >
                            Eliminar Encuesta
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal QR */}
      {showQRModal && selectedEncuesta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Código QR</h2>
                <button
                  onClick={() => setShowQRModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-center">
                <div className="bg-gray-100 p-4 rounded-lg inline-block mb-4">
                  <img 
                    src={`data:image/png;base64,${selectedEncuesta.codigo_qr}`} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                
                <p className="text-gray-600 mb-2">Escanea este código para acceder a la encuesta:</p>
                <p className="font-medium text-blue-600 break-all text-sm mb-6">
                  {selectedEncuesta.enlace_largo}
                </p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedEncuesta.enlace_largo)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Copiar Enlace
                  </button>
                  <a
                    href={selectedEncuesta.enlace_largo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-center"
                  >
                    Abrir Encuesta
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal crear encuesta (simplificado por ahora) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Crear Nueva Encuesta</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-600 text-lg mb-6">
                  Esta funcionalidad se conectará con tu backend FastAPI para crear encuestas reales
                </p>
                <p className="text-gray-500 mb-8">
                  El backend ya tiene el endpoint POST /api/encuestas/ listo para recibir los datos
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cerrar
                  </button>
                  <Link
                    to="http://localhost:8000/docs"
                    target="_blank"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Ver Documentación API
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncuestasPage;