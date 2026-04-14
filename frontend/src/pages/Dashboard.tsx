import { useEffect, useState } from 'react';
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
import { Search, Plus, Edit, Trash2, Star, ShoppingCart, Package } from 'lucide-react';
import { ProductModal } from '../components/ProductModal';

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const fetchProducts = async (busca?: string) => {
    try {
      const response = await api.get(`/produtos${busca ? `?busca=${busca}` : ''}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este produto?")) {
      await api.delete(`/produtos/${id}`);
      fetchProducts();
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedProduct(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de E-Commerce</h1>
          <p className="text-gray-600">Painel do Gerente - Desempenho e Estoque</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Adicionar Produto
        </button>
      </header>

      {/* Barra de Busca */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar produtos por nome..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900">
          Buscar
        </button>
      </form>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id_produto} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded">
                  {product.categoria_produto}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-2">{product.nome_produto}</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(product)} className="text-gray-400 hover:text-blue-600"><Edit size={18} /></button>
                <button onClick={() => handleDelete(product.id_produto)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShoppingCart size={16} /> <span><strong>{product.total_vendas}</strong> vendas realizadas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star size={16} className="text-yellow-400 fill-yellow-400" /> 
                <span>Média: <strong>{product.media_avaliacoes}</strong> / 5.0</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                <Package size={16} /> 
                <span>{product.peso_produto_gramas}g | {product.comprimento_centimetros}x{product.altura_centimetros}cm</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchProducts(); }} 
        />
      )}
    </div>
  );
}