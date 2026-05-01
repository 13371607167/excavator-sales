import { Link } from 'react-router-dom';
import { Clock, Calendar, Gauge } from 'lucide-react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = () => {
    if (product.status === 'sold') {
      return '已售';
    }
    if (product.priceType === 'negotiable' || product.price === null) {
      return '价格面议';
    }
    return `¥${product.price.toLocaleString()}`;
  };

  const getStatusClass = () => {
    if (product.status === 'sold') return 'status-sold';
    if (product.priceType === 'negotiable' || product.price === null) return 'status-negotiable';
    return 'status-available';
  };

  const getCategoryLabel = () => {
    return product.category === 'excavator' ? '挖掘机' : '配件';
  };

  const getCategoryClass = () => {
    return product.category === 'excavator' 
      ? 'bg-primary-500 text-white' 
      : 'bg-accent-orange text-white';
  };

  return (
    <Link to={`/products/${product.id}`} className="card block group">
      <div className="relative aspect-[4/3] overflow-hidden bg-dark-100">
        <img
          src={product.images[0] || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getCategoryClass()}`}>
            {getCategoryLabel()}
          </span>
        </div>
        
        <div className="absolute top-2 right-2">
          <span className={getStatusClass()} style={{ fontSize: '10px', padding: '2px 8px' }}>{formatPrice()}</span>
        </div>
        
        {product.status === 'sold' && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-accent-red text-white px-4 py-1 rounded font-bold text-sm transform -rotate-12">
              已售出
            </span>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-bold text-dark-600 text-sm mb-1 line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {product.specifications.brand && (
            <span className="bg-dark-100 text-dark-500 text-[10px] px-1.5 py-0.5 rounded">
              {product.specifications.brand}
            </span>
          )}
          {product.specifications.model && (
            <span className="bg-dark-100 text-dark-500 text-[10px] px-1.5 py-0.5 rounded">
              {product.specifications.model}
            </span>
          )}
        </div>
        
        <p className="text-dark-400 text-xs line-clamp-1 mb-2">{product.description}</p>
        
        <div className="flex items-center gap-3 text-[10px] text-dark-300 border-t border-dark-100 pt-2">
          {product.specifications.year && (
            <div className="flex items-center gap-1">
              <Calendar size={10} />
              <span>{product.specifications.year}年</span>
            </div>
          )}
          {product.specifications.hours !== undefined && (
            <div className="flex items-center gap-1">
              <Gauge size={10} />
              <span>{product.specifications.hours.toLocaleString()}小时</span>
            </div>
          )}
          {!product.specifications.year && !product.specifications.hours && product.category === 'parts' && (
            <div className="flex items-center gap-1">
              <span className="text-accent-green">现货供应</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
