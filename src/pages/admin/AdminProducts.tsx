import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Settings, Search, Package } from 'lucide-react';
import { useStore } from '@/store';
import type { Product } from '@/types';

export default function AdminProducts() {
  const navigate = useNavigate();
  const { products, deleteProduct, logout, isAuthenticated } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.specifications.brand?.toLowerCase().includes(term) ||
      product.specifications.model?.toLowerCase().includes(term)
    );
  });

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const formatPrice = (product: Product) => {
    if (product.priceType === 'negotiable' || product.price === null) {
      return '面议';
    }
    return `¥${product.price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">挖</span>
              </div>
              <div>
                <h1 className="font-bold text-dark-600">管理后台</h1>
                <p className="text-xs text-dark-400">产品管理</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                to="/admin/contact"
                className="flex items-center gap-2 px-4 py-2 text-dark-500 hover:text-dark-600 transition-colors"
              >
                <Settings size={18} />
                <span className="hidden sm:inline">联系方式</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">退出</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" size={20} />
            <input
              type="text"
              placeholder="搜索产品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <Link
            to="/admin/products/new"
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus size={20} />
            <span>添加产品</span>
          </Link>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-50 border-b border-dark-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-500">产品</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-500 hidden sm:table-cell">分类</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-500 hidden md:table-cell">价格</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-dark-500 hidden md:table-cell">状态</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-dark-500">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-dark-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-dark-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.images[0] || '/placeholder.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-dark-600 truncate">{product.name}</p>
                            <p className="text-xs text-dark-400 sm:hidden">
                              {product.category === 'excavator' ? '挖掘机' : '配件'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.category === 'excavator'
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-accent-orange/10 text-accent-orange'
                        }`}>
                          {product.category === 'excavator' ? '挖掘机' : '配件'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-dark-500 hidden md:table-cell">
                        {formatPrice(product)}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className={product.status === 'available' ? 'status-available' : 'status-sold'}>
                          {product.status === 'available' ? '在售' : '已售'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-2 text-dark-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 text-dark-400 hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="w-24 h-24 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={40} className="text-dark-300" />
            </div>
            <h3 className="text-xl font-bold text-dark-500 mb-2">暂无产品</h3>
            <p className="text-dark-400 mb-4">点击上方按钮添加第一个产品</p>
            <Link to="/admin/products/new" className="btn-primary">
              添加产品
            </Link>
          </div>
        )}
      </main>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-dark-600 mb-2">确认删除</h3>
            <p className="text-dark-400 mb-6">删除后无法恢复，确定要删除这个产品吗？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-dark-200 rounded-lg text-dark-500 hover:bg-dark-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
