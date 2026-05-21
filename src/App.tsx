/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function Navbar() {
  return (
    <nav className="border-b border-[var(--border)] px-8 h-14 flex items-center justify-between bg-[var(--bg)] sticky top-0 z-10">
      <Link id="nav-logo" className="font-sans text-base font-bold flex items-center gap-2 text-[var(--text)] no-underline tracking-tight" to="/">
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse-custom shrink-0"></span>
        炎上<em className="not-italic text-[var(--accent)]">チェッカー</em>
      </Link>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-8 py-8 md:py-6 text-xs text-[var(--text3)]">
      <div className="flex justify-center gap-8 mb-5 flex-wrap">
        <Link id="footer-terms" to="/terms" className="text-[var(--text3)] no-underline transition-colors hover:text-[var(--text2)] border-b border-transparent hover:border-b-[var(--border2)]">利用規約</Link>
        <Link id="footer-privacy" to="/privacy" className="text-[var(--text3)] no-underline transition-colors hover:text-[var(--text2)] border-b border-transparent hover:border-b-[var(--border2)]">プライバシーポリシー</Link>
      </div>
      <div className="text-center font-mono text-[10px] tracking-widest">© 2026 asaki All Rights Reserved.</div>
    </footer>
  );
}

function ServerSideBanner() {
  const location = useLocation();
  if (location.pathname !== '/') {
    return null;
  }
  return (
    <div className="bg-[#1a1200] border-b border-[#3d2e00] px-8 py-2 font-mono text-[11px] text-[#d4a017] flex items-center gap-2">
      🛠 SERVER SIDE — <span className="opacity-60">APIキーはサーバー側で安全に管理されています</span>
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
  return (
    <div className="min-h-screen flex flex-col">
      <ServerSideBanner />
      <Navbar />
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
