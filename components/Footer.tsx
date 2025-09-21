'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Search, 
  Edit3, 
  Mail, 
  Info, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin,
  Shield,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDark(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches));
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setMessageType('success');
        setEmail(''); // Clear the input
      } else {
        setMessage(data.message);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again later.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const quickLinks = [
    { 
      name: 'Browse Art', 
      href: '/marketplace',
      icon: <Search className="w-4 h-4" />
    },
    { 
      name: 'Start Selling', 
      href: '/for-artists',
      icon: <Edit3 className="w-4 h-4" />
    },
    { 
      name: 'Contact Us', 
      href: '/contact',
      icon: <Mail className="w-4 h-4" />
    },
    { 
      name: 'About Us', 
      href: '/about',
      icon: <Info className="w-4 h-4" />
    }
  ];

  const socialLinks = [
    { 
      name: 'Instagram', 
      href: '#',
      icon: <Instagram className="w-5 h-5" />
    },
    { 
      name: 'Twitter', 
      href: '#',
      icon: <Twitter className="w-5 h-5" />
    },
    { 
      name: 'Facebook', 
      href: '#',
      icon: <Facebook className="w-5 h-5" />
    },
    { 
      name: 'LinkedIn', 
      href: '#',
      icon: <Linkedin className="w-5 h-5" />
    }
  ];

  return (
    <footer className="border-t border-stone-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 gap-10 mb-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 no-underline">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <div>
                <div className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50">Artisans Marketplace</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Discover • Create • Connect</div>
              </div>
            </Link>
            
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 max-w-md">
              Connecting talented artisans with art lovers worldwide. Discover unique handcrafted pieces and support creative communities.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-5 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-all duration-300 group no-underline"
                  >
                    <div className="text-neutral-500 dark:text-neutral-500 group-hover:text-primary transition-colors duration-300">
                      {link.icon}
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-5 uppercase tracking-wider text-sm">Connect</h4>
            <ul className="space-y-3">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <Link 
                    href={social.href}
                    className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-all duration-300 group no-underline"
                  >
                    <div className="text-neutral-500 dark:text-neutral-500 group-hover:text-primary transition-colors duration-300">
                      {social.icon}
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{social.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-5 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 leading-relaxed">
              Get updates on new artists and exclusive offers.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 text-sm disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>

            {/* Success/Error Message */}
            {message && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                messageType === 'success' 
                  ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-6 border-t border-stone-200 dark:border-neutral-800">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">
              © 2025 Artisans Marketplace. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors duration-300 no-underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors duration-300 no-underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 font-medium transition-colors duration-300 no-underline">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
