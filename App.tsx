import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EmpresasPage from './pages/EmpresasPage';
import EncuestasPage from './pages/EncuestasPage';
import ReportesPage from './pages/ReportesPage';
import WhatsAppPage from './pages/WhatsAppPage';

// Importaremos las otras páginas a medida que las creemos

function App() {
  return (
    <Router>
      <Routes>
        {/* TEMPORAL: Redirigir a dashboard para pruebas */}
        <Route path="/" element={<Navigate to="/dashboard" />} />


        {/* Ruta por defecto redirige a login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Páginas de autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/empresas" element={<EmpresasPage />} />
        <Route path="/encuestas" element={<EncuestasPage />} />
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="/whatsapp" element={<WhatsAppPage />} />
        
        {/* Otras rutas (las agregaremos después) */}
        {/* <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/encuestas" element={<EncuestasPage />} /> */}
        
        {/* Ruta 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
              <p className="text-gray-600 mb-8">Página no encontrada</p>
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Volver al login
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;