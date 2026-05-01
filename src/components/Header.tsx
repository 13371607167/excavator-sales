import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Settings } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/hooks/useLanguage';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { contact } = useStore();
  const { t, dir } = useLanguage();
  const isAdminPage = location.pathname.startsWith('/admin');

  const navLinks = [
    { path: '/', label: t('home') },
    { path: '/products?category=excavator', label: t('filterExcavator') },
    { path: '/products?category=parts', label: t('filterParts') },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" dir="ltr">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">挖</span>
              </div>
              <span className="font-bold text-xl text-dark-600 hidden sm:block">
                {t('excavatorSales')}
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 mx-auto" dir={dir}>
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

          <div className="hidden md:flex items-center gap-4 ml-auto" dir="ltr">
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
              <span>{t('admin')}</span>
            </Link>
            <LanguageSelector />
          </div>

          <button
            className="md:hidden p-2 text-dark-600 ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-100" dir={dir}>
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
                <span>{t('admin')}</span>
              </Link>
              <div className="py-2" dir="ltr">
                <LanguageSelector />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
