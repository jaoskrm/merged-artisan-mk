'use client'

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Info, Edit3, ShoppingBag, Calendar, Sun, Moon, 
  User, LogOut, LogIn, Menu, X, ChevronRight
} from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: <Home className="w-6 h-6" /> },
  { name: 'About', href: '/about', icon: <Info className="w-6 h-6" /> },
  { name: 'For Artists', href: '/for-artists', icon: <Edit3 className="w-6 h-6" /> },
  { name: 'Marketplace', href: '/marketplace', icon: <ShoppingBag className="w-6 h-6" /> },
  { name: 'Events', href: '/events', icon: <Calendar className="w-6 h-6" /> }
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
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const activeItem = navItems.find(item => 
    pathname === item.href || (pathname === '/' && item.name === 'Home')
  )?.name || 'Home';

  const checkAuthStatus = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');
      if (authToken && userStr) {
        setUser(JSON.parse(userStr));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
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

    checkAuthStatus();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') checkAuthStatus();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('storage', handleStorageChange);
    if (showUserMenu) document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    const interval = setInterval(checkAuthStatus, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
      clearInterval(interval);
    };
  }, [isMenuOpen, showUserMenu]);

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
    setIsMenuOpen(false);
    router.push('/');
  };

  const handleNavigation = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const getInitials = (name: string) => 
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b border-stone-200/60 dark:border-neutral-800/60 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 dark:bg-neutral-950/95 py-2.5' : 'bg-white/90 dark:bg-neutral-950/90 py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          
          <Link href="/" className="flex items-center gap-3 no-underline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <div>
              <div className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50">Artisans Marketplace</div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Discover • Create • Connect</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`flex items-center gap-2 px-4 py-2.5 font-semibold rounded-xl transition-all duration-300 no-underline ${
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 hover:bg-stone-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-xl transition-all duration-300"
                >
                  <div className="w-9 h-9 bg-primary/10 text-primary font-semibold rounded-xl flex items-center justify-center border-2 border-primary/20">
                    {getInitials(user.name)}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 capitalize">{user.role}</div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-stone-200 dark:border-neutral-800">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">{user.name}</div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</div>
                    </div>
                    
                    <Link 
                      href="/profile" 
                      onClick={() => {
                        setShowUserMenu(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors no-underline text-neutral-700 dark:text-neutral-300"
                    >
                      <User className="w-5 h-5" />
                      My Profile
                    </Link>
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-red-600 dark:text-red-400">
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 no-underline">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 hover:bg-stone-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Full Screen Overlay */}
          <div className="fixed inset-0 bg-white dark:bg-neutral-900 z-50 md:hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-neutral-800">
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Menu</div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-stone-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex flex-col h-[calc(100vh-80px)]">
              
              {/* User Profile Section */}
              <div className="p-6 border-b border-stone-100 dark:border-neutral-800">
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 text-white font-bold rounded-full flex items-center justify-center text-xl shadow-lg">
                        {getInitials(user.name)}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xl text-neutral-900 dark:text-neutral-100">{user.name}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400 capitalize">{user.role}</div>
                        <div className="text-sm text-neutral-400 dark:text-neutral-500">{user.email}</div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleNavigation('/profile')}
                        className="flex-1 bg-stone-50 dark:bg-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-700 px-4 py-3 rounded-xl text-center font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-3 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl font-medium transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleNavigation('/auth')}
                    className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <LogIn className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg">Sign In</div>
                      <div className="text-sm opacity-90">Access your account</div>
                    </div>
                    <ChevronRight className="w-6 h-6 ml-auto" />
                  </button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-2 px-6">
                  {navItems.map((item, index) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-semibold transition-all duration-200 group ${
                        activeItem === item.name
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className={`p-3 rounded-lg transition-colors ${
                        activeItem === item.name 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-stone-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-stone-200 dark:group-hover:bg-neutral-700'
                      }`}>
                        {item.icon}
                      </div>
                      <span className="flex-1 text-left text-lg">{item.name}</span>
                      <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                        activeItem === item.name ? 'text-primary' : 'text-neutral-400'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle - Stays Open */}
              <div className="p-6 border-t border-stone-100 dark:border-neutral-800">
                <button
                  onClick={toggleDarkMode}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-xl font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-all duration-200 group"
                >
                  <div className="p-3 rounded-lg bg-stone-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-stone-200 dark:group-hover:bg-neutral-700 transition-colors">
                    {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                  </div>
                  <span className="flex-1 text-left text-lg">{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                  <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${isDark ? 'bg-primary' : 'bg-stone-300'} relative`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
