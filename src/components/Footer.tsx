import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useStore } from '@/store';

export default function Footer() {
  const { contact } = useStore();

  return (
    <footer className="bg-dark-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">挖</span>
              </div>
              <span className="font-bold text-xl">挖掘机销售平台</span>
            </div>
            <p className="text-dark-200 text-sm leading-relaxed">
              专业挖掘机及配件销售信息展示平台，为您提供优质的工程机械交易服务。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">快速导航</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-dark-200 hover:text-primary-400 transition-colors">
                首页
              </Link>
              <Link to="/products?category=excavator" className="text-dark-200 hover:text-primary-400 transition-colors">
                挖掘机
              </Link>
              <Link to="/products?category=parts" className="text-dark-200 hover:text-primary-400 transition-colors">
                配件
              </Link>
              <Link to="/admin" className="text-dark-200 hover:text-primary-400 transition-colors">
                管理后台
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">联系我们</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 text-dark-200 hover:text-primary-400 transition-colors"
              >
                <Phone size={18} />
                <span>{contact.phone}</span>
              </a>
              <div className="flex items-center gap-3 text-dark-200">
                <MessageCircle size={18} />
                <span>微信: {contact.wechat}</span>
              </div>
              <div className="flex items-start gap-3 text-dark-200">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-3 text-dark-200">
                <Clock size={18} />
                <span>{contact.businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-500 mt-8 pt-8 text-center text-dark-300 text-sm">
          <p>&copy; {new Date().getFullYear()} 挖掘机销售平台 版权所有</p>
        </div>
      </div>
    </footer>
  );
}
