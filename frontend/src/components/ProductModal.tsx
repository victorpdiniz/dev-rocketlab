import { useState } from 'react';
import { api } from '../api';
// import { Product } from '../types/product';
export interface Product {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: number;
  total_vendas: number;
  media_avaliacoes: number;
  comprimento_centimetros: number;
  altura_centimetros: number;
  largura_centimetros: number;
}
import { X } from 'lucide-react';

interface Props {
  product?: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductModal({ product, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    id_produto: product?.id_produto || Math.random().toString(36).substr(2, 9),
    nome_produto: product?.nome_produto || '',
    categoria_produto: product?.categoria_produto || '',
    peso_produto_gramas: product?.peso_produto_gramas || 0,
    comprimento_centimetros: product?.comprimento_centimetros || 0,
    altura_centimetros: product?.altura_centimetros || 0,
    largura_centimetros: product?.largura_centimetros || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        await api.put(`/produtos/${product.id_produto}`, formData);
      } else {
        await api.post('/produtos/', formData);
      }
      onSuccess();
    } catch (error) {
      alert("Erro ao salvar produto. Verifique se o ID já existe.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-6">{product ? 'Editar Produto' : 'Novo Produto'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input 
              required
              className="w-full border p-2 rounded mt-1"
              value={formData.nome_produto}
              onChange={e => setFormData({...formData, nome_produto: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <input 
              required
              className="w-full border p-2 rounded mt-1"
              value={formData.categoria_produto}
              onChange={e => setFormData({...formData, categoria_produto: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Peso (g)</label>
              <input 
                type="number"
                className="w-full border p-2 rounded mt-1"
                value={formData.peso_produto_gramas}
                onChange={e => setFormData({...formData, peso_produto_gramas: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
              <input 
                type="number"
                className="w-full border p-2 rounded mt-1"
                value={formData.altura_centimetros}
                onChange={e => setFormData({...formData, altura_centimetros: Number(e.target.value)})}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            {product ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}