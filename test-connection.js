// frontend/src/test-connection.js
export async function testBackendConnection() {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    
    console.log('✅ Conexión exitosa:', data);
    return data;
  } catch (error) {
    console.error('❌ Error conectando al backend:', error);
    return null;
  }
}