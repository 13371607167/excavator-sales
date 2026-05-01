import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Settings } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { contact } = useStore();
  const isAdminPage = location.pathname.startsWith('/admin');

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/products?category=excavator', label: '挖掘机' },
    { path: '/products?category=parts', label: '配件' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">挖</span>
            </div>
            <span className="font-bold text-xl text-dark-600 hidden sm:block">
              挖掘机销售平台
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-dark-500 hover:text-primary-500 transition-colors font-medium ${
                  location.pathname === link.path.split('?')[0]
                    ? 'text-primary-500'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors"
            >
              <Phone size={18} />
              <span className="font-medium">{contact.phone}</span>
            </a>
            <Link
              to="/admin"
              className="flex items-center gap-2 text-dark-400 hover:text-dark-600 transition-colors"
            >
              <Settings size={18} />
              <span>管理</span>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-dark-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-100">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-dark-500 hover:text-primary-500 transition-colors font-medium py-2 ${
                    location.pathname === link.path.split('?')[0]
                      ? 'text-primary-500'
                      : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-dark-100" />
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-primary-500 py-2"
              >
                <Phone size={18} />
                <span className="font-medium">{contact.phone}</span>
              </a>
              <Link
                to="/admin"
                className="flex items-center gap-2 text-dark-400 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings size={18} />
                <span>管理后台</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
