import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '@/hooks/useLanguage';
import { useEffect } from 'react';

export default function Layout() {
  const { dir, language } = useLanguage();

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
