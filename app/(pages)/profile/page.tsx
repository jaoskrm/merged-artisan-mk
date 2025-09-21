'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  location: string;
  bio: string;
  website: string;
  joinDate: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: false
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const router = useRouter();

  useEffect(() => {
    // Load user data from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        const fullUserData: User = {
          id: userData.id || '',
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'artist',
          phone: userData.phone || '',
          location: userData.location || 'Chennai, India',
          bio: userData.bio || '',
          website: userData.website || '',
          joinDate: userData.joinDate || '2025-09-01'
        };
        setUser(fullUserData);
        setFormData(fullUserData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? {
      ...prev,
      [name]: value
    } : null);
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      setTimeout(() => {
        const updatedUser: User = { ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess('Profile updated successfully!');
        setIsLoading(false);
        
        setTimeout(() => setSuccess(''), 3000);
      }, 1000);
    } catch (error) {
      setError('Failed to update profile');
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      setTimeout(() => {
        setSuccess('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsLoading(false);
        
        setTimeout(() => setSuccess(''), 3000);
      }, 1000);
    } catch (error) {
      setError('Failed to update password');
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user || !formData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="font-sans min-h-screen bg-background">
        <Header />
        
        {/* Profile Header */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {getInitials(user.name)}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  {user.name}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-1">{user.email}</p>
                <p className="text-sm text-neutral-500">
                  Member since {new Date(user.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-200 dark:border-neutral-800">
            {[
              { id: 'personal', name: 'Personal Info', icon: '👤' },
              { id: 'security', name: 'Security', icon: '🔒' },
              { id: 'notifications', name: 'Notifications', icon: '🔔' },
              { id: 'preferences', name: 'Preferences', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-t-2xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-stone-50 dark:hover:bg-neutral-900'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              {error}
            </div>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-stone-200/60 dark:border-neutral-800/60">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Personal Information</h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-stone-200/60 dark:border-neutral-800/60">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Change Password</h2>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                      minLength={6}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 text-neutral-900 dark:text-neutral-100"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-red-200/60 dark:border-red-800/60">
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-stone-200/60 dark:border-neutral-800/60">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                {[
                  { key: 'emailNotifications' as keyof NotificationSettings, title: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'orderUpdates' as keyof NotificationSettings, title: 'Order Updates', description: 'Get notified about order status changes' },
                  { key: 'promotions' as keyof NotificationSettings, title: 'Promotions', description: 'Receive promotional offers and discounts' },
                  { key: 'newsletter' as keyof NotificationSettings, title: 'Newsletter', description: 'Monthly newsletter with updates and tips' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-stone-50 dark:bg-neutral-800 rounded-2xl">
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{item.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(item.key)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        notifications[item.key] ? 'bg-primary' : 'bg-stone-300 dark:bg-neutral-700'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                        notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-stone-200/60 dark:border-neutral-800/60">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Preferences</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-stone-50 dark:bg-neutral-800 rounded-2xl">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Language</h3>
                  <select className="w-full px-4 py-3 bg-white dark:bg-neutral-700 border border-stone-200 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-neutral-100">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                  </select>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-neutral-800 rounded-2xl">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Currency</h3>
                  <select className="w-full px-4 py-3 bg-white dark:bg-neutral-700 border border-stone-200 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-neutral-100">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-neutral-800 rounded-2xl">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Time Zone</h3>
                  <select className="w-full px-4 py-3 bg-white dark:bg-neutral-700 border border-stone-200 dark:border-neutral-600 rounded-xl text-neutral-900 dark:text-neutral-100">
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
