// frontend/src/services/empresas.ts - VERSIÓN CORREGIDA
import api from './api';

// ✅ Exporta las interfaces PRIMERO
export interface Empresa {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  creado_en: string;
}

export interface EmpresaCreate {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
}

// Clase del servicio
class EmpresasService {
  async getAll(): Promise<Empresa[]> {
    try {
      const response = await api.get('/empresas/');
      return response.data;
    } catch (error) {
      console.error('Error fetching empresas:', error);
      throw error;
    }
  }

  async create(empresaData: EmpresaCreate): Promise<Empresa> {
    try {
      const response = await api.post('/empresas/registrar', empresaData);
      return response.data;
    } catch (error) {
      console.error('Error creating empresa:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Empresa> {
    try {
      const response = await api.get(`/empresas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching empresa ${id}:`, error);
      throw error;
    }
  }

  async update(id: string, empresaData: Partial<EmpresaCreate>): Promise<Empresa> {
    try {
      const response = await api.put(`/empresas/${id}`, empresaData);
      return response.data;
    } catch (error) {
      console.error(`Error updating empresa ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/empresas/${id}`);
    } catch (error) {
      console.error(`Error deleting empresa ${id}:`, error);
      throw error;
    }
  }
}

// ✅ Exporta la instancia del servicio
const empresasService = new EmpresasService();
export default empresasService;