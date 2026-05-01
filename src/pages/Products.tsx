import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '@/store';
import ProductCard from '@/components/ProductCard';
import type { Category, ProductStatus } from '@/types';

export default function Products() {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>(
    (searchParams.get('category') as Category) || 'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedHours, setSelectedHours] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category === 'excavator' || category === 'parts') {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach((p) => {
      if (p.specifications.brand) {
        brandSet.add(p.specifications.brand);
      }
    });
    return Array.from(brandSet).sort();
  }, [products]);

  const years = useMemo(() => {
    const yearSet = new Set<number>();
    products.forEach((p) => {
      if (p.specifications.year) {
        yearSet.add(p.specifications.year);
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [products]);

  const handleCategoryChange = (category: Category | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    if (selectedStatus !== 'all' && product.status !== selectedStatus) {
      return false;
    }
    if (selectedBrand !== 'all' && product.specifications.brand !== selectedBrand) {
      return false;
    }
    if (selectedYear !== 'all') {
      const year = parseInt(selectedYear);
      if (product.specifications.year !== year) {
        return false;
      }
    }
    if (selectedHours !== 'all') {
      const hours = product.specifications.hours;
      if (hours === undefined) return false;
      switch (selectedHours) {
        case '0-3000':
          if (hours > 3000) return false;
          break;
        case '3000-5000':
          if (hours < 3000 || hours > 5000) return false;
          break;
        case '5000-8000':
          if (hours < 5000 || hours > 8000) return false;
          break;
        case '8000+':
          if (hours < 8000) return false;
          break;
      }
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(term);
      const matchesBrand = product.specifications.brand?.toLowerCase().includes(term);
      const matchesModel = product.specifications.model?.toLowerCase().includes(term);
      if (!matchesName && !matchesBrand && !matchesModel) {
        return false;
      }
    }
    if (priceRange.min || priceRange.max) {
      if (product.price === null) return false;
      const min = priceRange.min ? parseInt(priceRange.min) : 0;
      const max = priceRange.max ? parseInt(priceRange.max) : Infinity;
      if (product.price < min || product.price > max) {
        return false;
      }
    }
    return true;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedBrand('all');
    setSelectedYear('all');
    setSelectedHours('all');
    setPriceRange({ min: '', max: '' });
    setSearchParams({});
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || 
    selectedBrand !== 'all' || selectedYear !== 'all' || selectedHours !== 'all' || 
    priceRange.min || priceRange.max;

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedStatus !== 'all',
    selectedBrand !== 'all',
    selectedYear !== 'all',
    selectedHours !== 'all',
    priceRange.min || priceRange.max,
    searchTerm,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Quick Category Tabs */}
      <div className="bg-white border-b border-dark-100 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => handleCategoryChange('excavator')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'excavator'
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
            >
              挖掘机
            </button>
            <button
              onClick={() => handleCategoryChange('parts')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'parts'
                  ? 'bg-accent-orange text-white'
                  : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
              }`}
            >
              配件
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300" size={18} />
            <input
              type="text"
              placeholder="搜索产品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                showFilters ? 'bg-primary-500 text-white border-primary-500' : 'border-dark-200 text-dark-500 hover:border-primary-500'
              }`}
            >
              <Filter size={16} />
              <span>筛选</span>
              {activeFilterCount > 0 && (
                <span className="bg-accent-red text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-accent-red text-accent-red text-sm font-medium hover:bg-accent-red hover:text-white transition-colors"
              >
                <X size={16} />
                <span>清除</span>
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-dark-100 space-y-3">
              <div>
                <label className="block text-xs font-medium text-dark-500 mb-1.5">品牌</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
                >
                  <option value="all">全部品牌</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-500 mb-1.5">状态</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ProductStatus | 'all')}
                  className="w-full px-3 py-2.5 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
                >
                  <option value="all">全部状态</option>
                  <option value="available">在售</option>
                  <option value="sold">已售</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-dark-500 mb-1.5">年份</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-2.5 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
                  >
                    <option value="all">全部</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}年</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-500 mb-1.5">小时</label>
                  <select
                    value={selectedHours}
                    onChange={(e) => setSelectedHours(e.target.value)}
                    className="w-full px-2.5 py-2 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
                  >
                    <option value="all">全部</option>
                    <option value="0-3000">3000以下</option>
                    <option value="3000-5000">3000-5000</option>
                    <option value="5000-8000">5000-8000</option>
                    <option value="8000+">8000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-500 mb-1.5">价格 (万元)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="最低"
                    value={priceRange.min ? (parseInt(priceRange.min) / 10000).toString() : ''}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value ? (parseInt(e.target.value) * 10000).toString() : '' })}
                    className="flex-1 px-3 py-2.5 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <span className="text-dark-300 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="最高"
                    value={priceRange.max ? (parseInt(priceRange.max) / 10000).toString() : ''}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? (parseInt(e.target.value) * 10000).toString() : '' })}
                    className="flex-1 px-3 py-2.5 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-dark-400 text-sm">
            共 <span className="font-bold text-dark-600">{filteredProducts.length}</span> 个产品
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search size={28} className="text-dark-300" />
            </div>
            <h3 className="text-base font-bold text-dark-500 mb-1">未找到相关产品</h3>
            <p className="text-dark-400 text-sm mb-4">请尝试调整筛选条件或搜索关键词</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
