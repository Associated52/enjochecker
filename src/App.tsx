/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, FileText, Shield, Home as HomeIcon } from 'lucide-react';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function Navbar({ 
  theme, 
  toggleTheme, 
  isMenuOpen, 
  setIsMenuOpen 
}: { 
  theme: 'light' | 'dark', 
  toggleTheme: () => void, 
  isMenuOpen: boolean, 
  setIsMenuOpen: (o: boolean) => void 
}) {
  return (
    <nav className="border-b border-[var(--border)] px-4 sm:px-8 h-16 flex items-center justify-between bg-[var(--bg)]/90 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <Link id="nav-logo" className="font-sans text-base font-bold flex items-center gap-2 text-[var(--text)] no-underline tracking-tight" to="/">
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse-custom shrink-0"></span>
        <span>炎上<em className="not-italic text-[var(--accent)]">チェッカー</em></span>
      </Link>

      {/* Desktop Navigation Link/Buttons */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/terms" className="text-xs font-medium text-[var(--text2)] hover:text-[var(--text)] transition-colors no-underline">利用規約</Link>
        <Link to="/privacy" className="text-xs font-medium text-[var(--text2)] hover:text-[var(--text)] transition-colors no-underline">プライバシーポリシー</Link>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[var(--bg3)] hover:bg-[var(--border)] text-[var(--text2)] hover:text-[var(--text)] transition-all cursor-pointer"
          title={theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      {/* Mobile Menu Action */}
      <div className="flex items-center gap-2 md:hidden">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[var(--text2)] hover:text-[var(--text)] transition-colors"
          aria-label="テーマ切り替え"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-[var(--text2)] hover:text-[var(--text)] transition-colors"
          aria-label="メニュー開閉"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </nav>
  );
}

function MobileDrawer({
  isMenuOpen,
  setIsMenuOpen,
  theme,
  toggleTheme
}: {
  isMenuOpen: boolean,
  setIsMenuOpen: (o: boolean) => void,
  theme: 'light' | 'dark',
  toggleTheme: () => void
}) {
  const location = useLocation();

  // Close drawer on page navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, setIsMenuOpen]);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-[90] backdrop-blur-sm"
          />
          {/* Menu Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-[var(--bg2)] border-l border-[var(--border)] z-[100] p-6 pt-24 shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-[var(--text3)] font-mono font-bold">Navigation</div>
                <div className="space-y-1">
                  <Link 
                    to="/" 
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors no-underline ${location.pathname === '/' ? 'bg-[rgba(232,68,26,0.06)] text-[var(--accent)]' : 'text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'}`}
                  >
                    <HomeIcon size={16} /> 診断ホーム
                  </Link>
                  <Link 
                    to="/terms" 
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors no-underline ${location.pathname === '/terms' ? 'bg-[rgba(232,68,26,0.06)] text-[var(--accent)]' : 'text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'}`}
                  >
                    <FileText size={16} /> 利用規約
                  </Link>
                  <Link 
                    to="/privacy" 
                    className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors no-underline ${location.pathname === '/privacy' ? 'bg-[rgba(232,68,26,0.06)] text-[var(--accent)]' : 'text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'}`}
                  >
                    <Shield size={16} /> プライバシーポリシー
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] uppercase tracking-widest text-[var(--text3)] font-mono font-bold">Preferences</div>
                <button 
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)] text-sm font-medium cursor-pointer"
                >
                  <span className="flex items-center gap-3 text-[var(--text)]">
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    {theme === 'light' ? 'ダークモード' : 'ライトモード'}
                  </span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-[var(--accent)]' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-4' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center font-mono text-[9px] tracking-wider text-[var(--text3)] py-4 border-t border-[var(--border)]">
              © 2026 asaki
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-4 sm:px-8 py-8 md:py-6 text-xs text-[var(--text3)] bg-[var(--bg)] transition-colors duration-300">
      <div className="flex justify-center gap-6 sm:gap-8 mb-4 flex-wrap">
        <Link id="footer-home" to="/" className="text-[var(--text3)] no-underline transition-colors hover:text-[var(--text2)] border-b border-transparent hover:border-b-[var(--border)]">診断ホーム</Link>
        <Link id="footer-terms" to="/terms" className="text-[var(--text3)] no-underline transition-colors hover:text-[var(--text2)] border-b border-transparent hover:border-b-[var(--border)]">利用規約</Link>
        <Link id="footer-privacy" to="/privacy" className="text-[var(--text3)] no-underline transition-colors hover:text-[var(--text2)] border-b border-transparent hover:border-b-[var(--border)]">プライバシーポリシー</Link>
      </div>
      <div className="text-center font-mono text-[10px] tracking-widest text-gray-500">© 2026 asaki All Rights Reserved.</div>
    </footer>
  );
}

function ServerSideBanner() {
  const location = useLocation();
  if (location.pathname !== '/') {
    return null;
  }
  return (
    <div className="bg-[#1a1200] border-b border-[#3d2e00] px-4 sm:px-8 py-2 font-mono text-[10px] sm:text-[11px] text-[#d4a017] flex items-center gap-2 select-none">
      <span className="shrink-0">🛠 SERVER SIDE</span>
      <span className="opacity-65 truncate">— APIキーはサーバー側で安全に管理されています</span>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Auto dark mode if preferred
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      <ServerSideBanner />
      <Navbar theme={theme} toggleTheme={toggleTheme} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <MobileDrawer theme={theme} toggleTheme={toggleTheme} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <MainLayout />
    </Router>
  );
}
