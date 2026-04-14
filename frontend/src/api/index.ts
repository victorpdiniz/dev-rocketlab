import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Funções utilitárias
export const getProducts = (search?: string) => 
  api.get(`/produtos${search ? `?busca=${search}` : ''}`);

export const deleteProduct = (id: string) => 
  api.delete(`/produtos/${id}`);