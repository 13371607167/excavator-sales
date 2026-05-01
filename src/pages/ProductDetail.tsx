import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, ChevronLeft, ChevronRight, Calendar, Gauge, Package, Shield, Eye, CheckCircle } from 'lucide-react';
import { useStore } from '@/store';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, contact } = useStore();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package size={28} className="text-dark-300" />
          </div>
          <h2 className="text-lg font-bold text-dark-600 mb-1">产品不存在</h2>
          <p className="text-dark-400 text-sm mb-4">该产品可能已被删除或链接错误</p>
          <Link to="/products" className="px-6 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium">
            返回产品列表
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = () => {
    if (product.status === 'sold') {
      return '已售出';
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

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.status === 'available')
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-dark-100 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-dark-100 text-dark-600 hover:bg-dark-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base font-medium text-dark-600 flex-1 truncate">{product.name}</h1>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-white">
        <div className="aspect-[4/3] relative">
          <img
            src={product.images[currentImageIndex] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 rounded text-xs font-medium ${getCategoryClass()}`}>
              {getCategoryLabel()}
            </span>
          </div>
          
          <div className="absolute top-3 right-3">
            <span className={getStatusClass()} style={{ fontSize: '10px', padding: '2px 8px' }}>{formatPrice()}</span>
          </div>
          
          {product.status === 'sold' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-accent-red text-white px-6 py-2 rounded-lg font-bold text-lg transform -rotate-12">
                已售出
              </span>
            </div>
          )}
          
          {product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2.5 py-0.5 rounded-full">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </>
          )}
        </div>
        
        {product.images.length > 1 && (
          <div className="px-4 py-3 flex gap-2 overflow-x-auto border-t border-dark-100">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-colors ${
                  currentImageIndex === index ? 'border-primary-500' : 'border-transparent hover:border-dark-200'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="bg-white mt-2 px-4 py-4">
        <h1 className="text-lg font-bold text-dark-600 mb-2">{product.name}</h1>
        <div className="flex items-baseline gap-2 mb-3">
          {product.price !== null && product.status !== 'sold' && (
            <>
              <span className="text-2xl font-bold text-primary-500">
                ¥{product.price.toLocaleString()}
              </span>
              <span className="text-dark-400 text-xs">元</span>
            </>
          )}
          {product.priceType === 'negotiable' && product.status !== 'sold' && (
            <span className="text-base text-dark-400">价格面议</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-dark-300 mb-3">
          <div className="flex items-center gap-1">
            <Shield size={14} className="text-accent-green" />
            <span>品质保证</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} className="text-primary-500" />
            <span>实地看机</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle size={14} className="text-accent-orange" />
            <span>信息真实</span>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white mt-2 px-4 py-4">
        <h3 className="font-bold text-dark-600 mb-3 text-sm">产品规格</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-dark-50 rounded-lg p-3">
            <p className="text-[10px] text-dark-400 mb-0.5">产品分类</p>
            <p className="font-medium text-dark-600 text-sm">{getCategoryLabel()}</p>
          </div>
          {product.specifications.brand && (
            <div className="bg-dark-50 rounded-lg p-3">
              <p className="text-[10px] text-dark-400 mb-0.5">品牌</p>
              <p className="font-medium text-dark-600 text-sm">{product.specifications.brand}</p>
            </div>
          )}
          {product.specifications.model && (
            <div className="bg-dark-50 rounded-lg p-3">
              <p className="text-[10px] text-dark-400 mb-0.5">型号</p>
              <p className="font-medium text-dark-600 text-sm">{product.specifications.model}</p>
            </div>
          )}
          {product.specifications.year && (
            <div className="bg-dark-50 rounded-lg p-3">
              <p className="text-[10px] text-dark-400 mb-0.5">出厂年份</p>
              <p className="font-medium text-dark-600 text-sm">{product.specifications.year}年</p>
            </div>
          )}
          {product.specifications.hours !== undefined && (
            <div className="bg-dark-50 rounded-lg p-3">
              <p className="text-[10px] text-dark-400 mb-0.5">工作小时</p>
              <p className="font-medium text-dark-600 text-sm">{product.specifications.hours.toLocaleString()} 小时</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white mt-2 px-4 py-4">
        <h3 className="font-bold text-dark-600 mb-3 text-sm">产品描述</h3>
        <p className="text-dark-500 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-3 px-4">
          <h3 className="font-bold text-dark-600 mb-3 text-sm">相关推荐</h3>
          <div className="grid grid-cols-2 gap-2">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Fixed Contact Button */}
      {product.status !== 'sold' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-dark-100 px-4 py-3 z-40">
          <div className="flex gap-3">
            <a
              href={`tel:${contact.phone}`}
              className="flex-1 bg-primary-500 text-white rounded-lg py-3 font-medium text-center text-sm flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              <span>电话咨询</span>
            </a>
            <div className="flex-1 bg-accent-green text-white rounded-lg py-3 font-medium text-center text-sm flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              <span>微信咨询</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
