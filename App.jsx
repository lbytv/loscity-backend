import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ApplicationsSection from './components/ApplicationsSection';
import RulesSection from './components/RulesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import UserDashboard from './components/UserDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('https://zmhqivcgezjl.manus.space/api/auth/check', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('خطأ في التحقق من حالة تسجيل الدخول:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('https://zmhqivcgezjl.manus.space/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setShowDashboard(false);
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };

  const handleLoginRequired = () => {
    console.log('🔑 Login required triggered!');
    setShowAuthModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (showDashboard && user) {
    return (
      <UserDashboard 
        user={user} 
        onLogout={() => {
          handleLogout();
          setShowDashboard(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header 
        user={user}
        onLoginClick={() => {
          console.log('🔐 Header login button clicked!');
          setShowAuthModal(true);
        }}
        onLogout={handleLogout}
        onShowDashboard={() => setShowDashboard(true)}
      />
      
      <main>
        <HeroSection onLoginClick={() => {
          console.log('🏠 Hero login button clicked!');
          setShowAuthModal(true);
        }} />
        <AboutSection />
        <ApplicationsSection 
          user={user}
          onLoginRequired={handleLoginRequired}
        />
        <RulesSection />
        <ContactSection />
      </main>
      
      <Footer />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;

