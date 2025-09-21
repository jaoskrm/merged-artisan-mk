'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
  { name: 'About', href: '/about', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  { name: 'For Artists', href: '/for-artists', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> },
  { name: 'Marketplace', href: '/marketplace', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg> },
  { name: 'Events', href: '/events', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> }
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const activeItem = navItems.find(item => 
    pathname === item.href || (pathname === '/' && item.name === 'Home')
  )?.name || 'Home';

  // Check authentication status
  const checkAuthStatus = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      
      if (authToken && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Check auth status on mount and set up storage listener
    checkAuthStatus();
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('storage', handleStorageChange);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isMenuOpen]);

  // Listen for auth changes from within the same tab
  useEffect(() => {
    const interval = setInterval(checkAuthStatus, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setShowUserMenu(false);
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b border-stone-200/60 dark:border-neutral-800/60 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-neutral-950/95 py-3' : 'bg-white/90 dark:bg-neutral-950/90 py-4'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <div className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50">Artisans Marketplace</div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Discover • Create • Connect</div>
            </div>
          </Link>

          {/* Desktop Navigation with Icons */}
          <nav className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 font-semibold rounded-2xl transition-all duration-300 no-underline ${
                  activeItem === item.name
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-stone-50 dark:hover:bg-neutral-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 hover:bg-stone-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-2xl transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              )}
            </button>

            {/* Auth Section */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-2xl transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-primary/10 text-primary font-semibold rounded-xl flex items-center justify-center border-2 border-primary/20">
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 capitalize">{user.role}</div>
                  </div>
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-stone-200 dark:border-neutral-800">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</div>
                    </div>
                    
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors no-underline text-neutral-700 dark:text-neutral-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      My Profile
                    </Link>
                    
                    <Link href="/for-artists" className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors no-underline text-neutral-700 dark:text-neutral-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                      Artist Studio
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-red-600 dark:text-red-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 no-underline"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 hover:bg-stone-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-2xl transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-t border-stone-200/60 dark:border-neutral-800/60">
            <nav className="px-6 py-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold transition-all duration-300 no-underline ${
                    activeItem === item.name
                      ? 'text-primary bg-primary/10 border border-primary/20'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-900'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-stone-200 dark:border-neutral-800">
                  <Link
                    href="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 no-underline"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                    </svg>
                    Sign In
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
