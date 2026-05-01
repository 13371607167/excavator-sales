import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Wrench, Phone, MessageCircle, MapPin, Clock, Shield, Eye, Award, Headphones, CheckCircle } from 'lucide-react';
import { useStore } from '@/store';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/hooks/useLanguage';

export default function Home() {
  const { products, contact } = useStore();
  const { t } = useLanguage();
  
  const featuredProducts = products.filter(p => p.status === 'available').slice(0, 4);
  const excavatorCount = products.filter(p => p.category === 'excavator' && p.status === 'available').length;
  const partsCount = products.filter(p => p.category === 'parts' && p.status === 'available').length;
  
  const brands = [...new Set(products.map(p => p.specifications.brand).filter(Boolean))];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yellow%20excavator%20construction%20site%20sunset%20dramatic%20lighting%20professional%20photography&image_size=landscape_16_9')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-600/70 via-dark-600/50 to-dark-600/80" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-base text-dark-100 mb-6 max-w-sm mx-auto">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/products?category=excavator"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 p-5 text-white hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Truck size={100} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <Truck size={24} />
                </div>
                <h3 className="text-lg font-bold mb-1">{t('filterExcavator')}</h3>
                <p className="text-white/80 text-xs mb-2">{t('trustFeatures.quality.title')}</p>
                <span className="inline-block bg-white/20 px-2 py-0.5 rounded-full text-xs">{excavatorCount}</span>
              </div>
            </Link>

            <Link
              to="/products?category=parts"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-accent-orange to-orange-600 p-5 text-white hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Wrench size={100} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                  <Wrench size={24} />
                </div>
                <h3 className="text-lg font-bold mb-1">{t('filterParts')}</h3>
                <p className="text-white/80 text-xs mb-2">{t('trustFeatures.quality.title')}</p>
                <span className="inline-block bg-white/20 px-2 py-0.5 rounded-full text-xs">{partsCount}</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-dark-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="text-primary-500" size={20} />
              </div>
              <h3 className="font-bold text-dark-600 text-sm">{t('trustFeatures.quality.title')}</h3>
              <p className="text-dark-400 text-xs">{t('trustFeatures.quality.desc')}</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="text-accent-green" size={20} />
              </div>
              <h3 className="font-bold text-dark-600 text-sm">{t('trustFeatures.delivery.title')}</h3>
              <p className="text-dark-400 text-xs">{t('trustFeatures.delivery.desc')}</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="text-accent-orange" size={20} />
              </div>
              <h3 className="font-bold text-dark-600 text-sm">{t('trustFeatures.quality.title')}</h3>
              <p className="text-dark-400 text-xs">{t('trustFeatures.quality.desc')}</p>
            </div>

            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="w-10 h-10 bg-accent-red/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Headphones className="text-accent-red" size={20} />
              </div>
              <h3 className="font-bold text-dark-600 text-sm">{t('trustFeatures.delivery.title')}</h3>
              <p className="text-dark-400 text-xs">{t('trustFeatures.delivery.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="py-8 bg-white border-y border-dark-100">
          <div className="container mx-auto px-4">
            <p className="text-center text-dark-400 mb-4 text-xs">{t('brandShowcase')}</p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {brands.map((brand) => (
                <div key={brand} className="text-center">
                  <span className="text-lg font-bold text-dark-300 hover:text-primary-500 transition-colors cursor-pointer">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-8 bg-dark-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark-600">{t('featuredProducts')}</h2>
            <Link
              to="/products"
              className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              {t('viewDetails')}
              <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-8 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg font-bold mb-2">{t('trustTitle')}</h2>
          <p className="text-white/80 text-sm mb-4">
            {t('trustFeatures.quality.desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-white/80" />
              <span className="text-sm">{t('trustFeatures.quality.title')}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle size={14} className="text-white/80" />
              <span className="text-sm">{t('trustFeatures.delivery.title')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-8 bg-dark-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-bold text-center mb-6">{t('contactInfo')}</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${contact.phone}`}
              className="bg-dark-500 rounded-xl p-4 text-center hover:bg-dark-400 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Phone size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1">{t('phone')}</h3>
              <p className="text-dark-200 text-xs">{contact.phone}</p>
            </a>

            <div className="bg-dark-500 rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1">{t('weChat')}</h3>
              <p className="text-dark-200 text-xs">{contact.wechat}</p>
            </div>

            <div className="bg-dark-500 rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-accent-orange rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1">{t('contact')}</h3>
              <p className="text-dark-200 text-xs">{contact.address}</p>
            </div>

            <div className="bg-dark-500 rounded-xl p-4 text-center">
              <div className="w-10 h-10 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock size={18} />
              </div>
              <h3 className="font-bold text-sm mb-1">{t('about')}</h3>
              <p className="text-dark-200 text-xs">{contact.businessHours}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
