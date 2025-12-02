// frontend/src/App.jsx o App.js
import React, { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = (userData) => {
    console.log('Usuario autenticado:', userData);
    setIsLoggedIn(true);
    // Aquí puedes redireccionar o cambiar el estado
  };

  if (isLoggedIn) {
    return (
      <div className="app">
        <h1>Bienvenido al Sistema de Encuestas</h1>
        <button onClick={() => setIsLoggedIn(false)}>Cerrar Sesión</button>
        {/* Aquí iría el dashboard principal */}
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Sistema de Encuestas 360°</h1>
      
      <div className="auth-container">
        <div className="auth-tabs">
          <button 
            className={!showRegister ? 'active' : ''}
            onClick={() => setShowRegister(false)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={showRegister ? 'active' : ''}
            onClick={() => setShowRegister(true)}
          >
            Registrar Empresa
          </button>
        </div>
        
        <div className="auth-content">
          {showRegister ? (
            <RegisterForm />
          ) : (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 40px;
          font-size: 2.5rem;
        }
        
        .auth-container {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        
        .auth-tabs {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }
        
        .auth-tabs button {
          flex: 1;
          padding: 15px;
          border: none;
          background: none;
          font-size: 16px;
          font-weight: 600;
          color: #666;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .auth-tabs button:hover {
          background: #e9ecef;
        }
        
        .auth-tabs button.active {
          background: white;
          color: #4a90e2;
          border-bottom: 3px solid #4a90e2;
        }
        
        .auth-content {
          padding: 30px;
        }
      `}</style>
    </div>
  );
}

export default App;