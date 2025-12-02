import React, { useState } from 'react';
import Navbar from '../components/Layout/Navbar';

const WhatsAppPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'instrucciones' | 'webhook' | 'estadisticas'>('instrucciones');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  // Ejemplo de instrucciones para diferentes encuestas
  const encuestasEjemplo = [
    {
      id: 'k5s5nyTV7oLnpuTRVcKmKk',
      titulo: 'Satisfacción Cliente - Atención Telefónica',
      instruccion: '[k5s5nyTV7oLnpuTRVcKmKk] Muy satisfecho, Excelente servicio, 5, Sí, Excelente'
    },
    {
      id: 'abc123',
      titulo: 'Encuesta de Clima Laboral',
      instruccion: '[abc123] 4, Regular, No, Sí, Muy bueno'
    }
  ];

  const handleSendTest = () => {
    if (!phoneNumber || !message) {
      alert('Por favor ingresa número y mensaje');
      return;
    }

    // Aquí iría POST /api/whatsapp/webhook
    console.log('Enviando mensaje WhatsApp:', { phoneNumber, message });
    
    alert(`Mensaje de prueba enviado a ${phoneNumber}`);
    setMessage('');
  };

  const handleCopyInstruction = (instruccion: string) => {
    navigator.clipboard.writeText(instruccion);
    alert('Instrucción copiada al portapapeles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Integración WhatsApp</h1>
          <p className="text-gray-600">
            Configura y utiliza el servicio de WhatsApp para recolectar respuestas de encuestas
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow mb-8">
          <div className="border-b">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('instrucciones')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === 'instrucciones' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Instrucciones
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('webhook')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === 'webhook' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Webhook Test
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('estadisticas')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === 'estadisticas' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Estadísticas
                </div>
              </button>
            </nav>
          </div>

          {/* Contenido de los tabs */}
          <div className="p-6">
            {/* Tab: Instrucciones */}
            {activeTab === 'instrucciones' && (
              <div className="space-y-8">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 text-lg">¿Cómo funciona?</h3>
                      <p className="text-green-700">
                        Los usuarios pueden responder encuestas enviando un mensaje de WhatsApp con un formato específico
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Formato del mensaje</h3>
                  <div className="bg-gray-800 text-gray-100 p-6 rounded-xl font-mono mb-6">
                    <div className="text-green-400">[ID_ENCUESTA] respuesta1, respuesta2, respuesta3, ...</div>
                    <div className="text-gray-400 text-sm mt-4">Ejemplo:</div>
                    <div className="text-yellow-300 mt-2">[k5s5nyTV7oLnpuTRVcKmKk] Muy satisfecho, Excelente, 5, Sí</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h4 className="font-bold text-blue-800 mb-3">Pasos para el usuario</h4>
                      <ol className="list-decimal list-inside space-y-2 text-blue-700">
                        <li>Obtener el ID de la encuesta (se genera automáticamente)</li>
                        <li>Abrir WhatsApp y crear nuevo mensaje</li>
                        <li>Escribir: [ID_ENCUESTA] seguido de las respuestas separadas por comas</li>
                        <li>Enviar al número configurado</li>
                        <li>Recibir confirmación de recepción</li>
                      </ol>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl">
                      <h4 className="font-bold text-purple-800 mb-3">Requisitos técnicos</h4>
                      <ul className="list-disc list-inside space-y-2 text-purple-700">
                        <li>Número de WhatsApp Business configurado</li>
                        <li>Webhook activo en el servidor</li>
                        <li>Conexión a internet estable</li>
                        <li>Formato de mensaje estricto</li>
                        <li>ID de encuesta válido y activo</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Ejemplos por encuesta</h3>
                  <div className="space-y-4">
                    {encuestasEjemplo.map((encuesta) => (
                      <div key={encuesta.id} className="bg-white border rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-gray-800">{encuesta.titulo}</h4>
                            <p className="text-sm text-gray-500">ID: {encuesta.id}</p>
                          </div>
                          <button
                            onClick={() => handleCopyInstruction(encuesta.instruccion)}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm font-medium"
                          >
                            Copiar ejemplo
                          </button>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <code className="text-gray-800">{encuesta.instruccion}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Webhook Test */}
            {activeTab === 'webhook' && (
              <div className="space-y-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-800 text-lg">Probar Webhook</h3>
                      <p className="text-blue-700">
                        Envía un mensaje de prueba para verificar la integración con WhatsApp
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white border rounded-xl p-6">
                    <h4 className="font-bold text-gray-800 mb-6">Enviar mensaje de prueba</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Número de WhatsApp (con código país)
                        </label>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="+573001234567"
                        />
                        <p className="text-xs text-gray-500 mt-1">Formato: +código_país número</p>
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Mensaje (formato correcto)
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                          placeholder="[ID_ENCUESTA] respuesta1, respuesta2, ..."
                          rows={4}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Usa un ID de encuesta válido para pruebas reales
                        </p>
                      </div>

                      <button
                        onClick={handleSendTest}
                        disabled={!phoneNumber || !message}
                        className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Enviar Mensaje de Prueba
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border rounded-xl p-6">
                    <h4 className="font-bold text-gray-800 mb-6">Información del Webhook</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">URL del Webhook</h5>
                        <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm">
                          http://localhost:8000/api/whatsapp/webhook
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText('http://localhost:8000/api/whatsapp/webhook')}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Copiar URL
                        </button>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Método HTTP</h5>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          POST
                        </span>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Formato esperado</h5>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <code className="text-gray-800 text-sm">
                            {`{\n  "message": "[ID] respuestas",\n  "from": "whatsapp:+573001234567"\n}`}
                          </code>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                          <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5" />
                          </svg>
                          <div>
                            <p className="text-yellow-700 font-medium">Nota importante</p>
                            <p className="text-yellow-600 text-sm mt-1">
                              El webhook debe estar configurado en la plataforma de WhatsApp Business API.
                              Esta página solo sirve para pruebas del backend.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Estadísticas */}
            {activeTab === 'estadisticas' && (
              <div className="space-y-8">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-purple-800 text-lg">Estadísticas WhatsApp</h3>
                      <p className="text-purple-700">
                        Métricas y análisis de respuestas recibidas por WhatsApp
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Total Respuestas</p>
                        <p className="text-3xl font-bold text-gray-800">156</p>
                      </div>
                      <div className="bg-green-100 p-3 rounded-full">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 font-medium">+12%</span>
                        <span className="ml-2">vs mes anterior</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Tasa de Respuesta</p>
                        <p className="text-3xl font-bold text-gray-800">68%</p>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-full">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-green-500 font-medium">+5%</span>
                        <span className="ml-2">vs mes anterior</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">Tiempo Promedio</p>
                        <p className="text-3xl font-bold text-gray-800">2.4m</p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-full">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-red-500 font-medium">-0.3m</span>
                        <span className="ml-2">vs mes anterior</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h4 className="font-bold text-gray-800 mb-6">Distribución por hora del día</h4>
                  <div className="space-y-4">
                    {[
                      { hora: '8:00 - 10:00', porcentaje: 35, respuestas: 55 },
                      { hora: '10:00 - 12:00', porcentaje: 25, respuestas: 39 },
                      { hora: '12:00 - 14:00', porcentaje: 15, respuestas: 23 },
                      { hora: '14:00 - 16:00', porcentaje: 12, respuestas: 19 },
                      { hora: '16:00 - 18:00', porcentaje: 8, respuestas: 12 },
                      { hora: '18:00 - 20:00', porcentaje: 5, respuestas: 8 },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-24 text-gray-600 text-sm">{item.hora}</div>
                        <div className="flex-1 ml-4">
                          <div className="bg-gray-200 rounded-full h-4">
                            <div 
                              className="bg-green-500 rounded-full h-4" 
                              style={{ width: `${item.porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-16 text-right text-sm text-gray-700">
                          {item.respuestas} resp
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <h4 className="font-bold text-gray-800 mb-6">Recomendaciones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-bold text-green-700 mb-2">✓ Mejores prácticas</h5>
                      <ul className="text-green-600 text-sm space-y-1">
                        <li>• Enviar recordatorios entre 10:00 y 12:00</li>
                        <li>• Mantener mensajes cortos y claros</li>
                        <li>• Incluir instrucciones en la invitación</li>
                        <li>• Proporcionar ID de encuesta claramente</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-bold text-blue-700 mb-2">📈 Oportunidades</h5>
                      <ul className="text-blue-600 text-sm space-y-1">
                        <li>• Aumentar respuestas en horario tarde</li>
                        <li>• Implementar respuestas automáticas</li>
                        <li>• Crear plantillas para preguntas frecuentes</li>
                        <li>• Integrar con CRM empresarial</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8">
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 rounded-lg mr-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Información técnica</h3>
              <p className="text-gray-600">
                Para configurar WhatsApp Business API, necesitas una cuenta empresarial verificada y configurar 
                el webhook en el panel de desarrolladores de Meta. Contacta con soporte para asistencia técnica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPage;