'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  // Simulate authentication API call
  const simulateAuth = async (isLoginMode: boolean): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (isLoginMode) {
          // Simulate login validation
          if (formData.email === 'demo@example.com' && formData.password === 'password123') {
            resolve({
              success: true,
              message: 'Login successful!',
              user: {
                id: 'user_123',
                name: 'Demo Artist',
                email: formData.email,
                role: 'artist'
              },
              token: 'demo_jwt_token_' + Date.now()
            });
          } else {
            resolve({
              success: false,
              message: 'Invalid email or password. Try demo@example.com / password123'
            });
          }
        } else {
          // Simulate signup validation
          if (formData.password !== formData.confirmPassword) {
            resolve({
              success: false,
              message: 'Passwords do not match'
            });
          } else if (formData.password.length < 6) {
            resolve({
              success: false,
              message: 'Password must be at least 6 characters long'
            });
          } else if (!formData.email.includes('@')) {
            resolve({
              success: false,
              message: 'Please enter a valid email address'
            });
          } else if (formData.name.trim().length < 2) {
            resolve({
              success: false,
              message: 'Please enter your full name'
            });
          } else {
            resolve({
              success: true,
              message: 'Account created successfully!',
              user: {
                id: 'user_' + Date.now(),
                name: formData.name,
                email: formData.email,
                role: 'artist'
              },
              token: 'demo_jwt_token_' + Date.now()
            });
          }
        }
      }, 1500); // Simulate network delay
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await simulateAuth(isLogin);
      
      if (response.success) {
        setSuccess(response.message);
        
        // Store authentication data in localStorage
        if (response.user && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Show success message briefly, then redirect
          setTimeout(() => {
            router.push(redirectTo);
          }, 1000);
        }
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social authentication
    setTimeout(() => {
      const userData = {
        id: `${provider}_user_${Date.now()}`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        email: `user@${provider}.com`,
        role: 'artist'
      };
      
      const token = `${provider}_jwt_token_${Date.now()}`;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setSuccess(`Successfully signed in with ${provider}!`);
      
      setTimeout(() => {
        router.push(redirectTo);
      }, 1000);
    }, 1000);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="font-sans min-h-screen bg-background">
      <Header />
      
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full">
          {/* Demo Credentials Info */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Demo Credentials</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Email: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">demo@example.com</code><br />
                  Password: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">password123</code>
                </p>
              </div>
            </div>
          </div>

          {/* Auth Toggle */}
          <div className="bg-stone-100 dark:bg-neutral-800 p-1 rounded-2xl mb-8 flex">
            <button
              onClick={toggleAuthMode}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                isLogin 
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm' 
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={toggleAuthMode}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                !isLogin 
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm' 
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-xl border border-stone-200/60 dark:border-neutral-800/60">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {isLogin ? 'Welcome back!' : 'Create your account'}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {isLogin ? 'Sign in to your Artisans Marketplace account' : 'Join the community of talented artisans'}
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-2xl mb-6 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-4 rounded-2xl mb-6 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                    <svg className="absolute left-4 top-4 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 pl-12 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                    placeholder={isLogin ? "demo@example.com" : "Enter your email"}
                    required
                  />
                  <svg className="absolute left-4 top-4 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 pl-12 pr-12 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                    placeholder={isLogin ? "password123" : "Enter your password"}
                    required
                  />
                  <svg className="absolute left-4 top-4 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M12 15v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h3V7a4 4 0 018 0v3h1a2 2 0 012 2v5a2 2 0 01-2 2h-3"/>
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pl-12 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                    <svg className="absolute left-4 top-4 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M12 15v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2h3V7a4 4 0 018 0v3h1a2 2 0 012 2v5a2 2 0 01-2 2h-3"/>
                    </svg>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-stone-300 dark:border-neutral-600 text-primary focus:ring-primary/20" />
                    <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:text-primary/80 font-medium">
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                )}
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-stone-200 dark:border-neutral-800">
              <div className="text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Or continue with
                </p>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => handleSocialAuth('google')}
                    disabled={isLoading}
                    className="flex-1 bg-stone-50 dark:bg-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-700 disabled:opacity-50 border border-stone-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button 
                    onClick={() => handleSocialAuth('facebook')}
                    disabled={isLoading}
                    className="flex-1 bg-stone-50 dark:bg-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-700 disabled:opacity-50 border border-stone-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium py-3 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
