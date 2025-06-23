import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [currentView, setCurrentView] = useState('selection'); // selection, login, register
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({
    username_or_email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    roblox_username: '',
    discord_username: '',
    age: ''
  });

  console.log('🪟 AuthModal rendered, isOpen:', isOpen, 'currentView:', currentView);

  // إعادة تعيين العرض عند فتح النافذة
  useEffect(() => {
    if (isOpen) {
      console.log('✅ AuthModal opened successfully!');
      setCurrentView('selection');
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    console.log('❌ AuthModal is closed, not rendering');
    return null;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 زر تسجيل الدخول في النموذج اشتغل!');
    setIsLoading(true);
    setError('');

    try {
      console.log('📡 إرسال بيانات تسجيل الدخول...');
      const response = await fetch(("https://loscity-backend.onrender.com/auth/ping"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginData)
      });

      console.log('📨 استلام رد تسجيل الدخول:', response.status);
      const data = await response.json();

      if (response.ok) {
        console.log('✅ تم تسجيل الدخول بنجاح!');
        onAuthSuccess(data.user);
        onClose();
      } else {
        console.log('❌ خطأ في تسجيل الدخول:', data.error);
        setError(data.error || 'حدث خطأ في تسجيل الدخول');
      }
    } catch (error) {
      console.log('🚨 خطأ في الاتصال:', error);
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 زر إنشاء حساب في النموذج اشتغل!');
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      console.log('❌ كلمات المرور غير متطابقة');
      setError('كلمات المرور غير متطابقة');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📡 إرسال بيانات إنشاء الحساب...');
      const response = await fetch(("https://loscity-backend.onrender.com/auth/ping"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          roblox_username: registerData.roblox_username,
          discord_username: registerData.discord_username,
          age: parseInt(registerData.age)
        })
      });

      console.log('📨 استلام رد إنشاء الحساب:', response.status);
      const data = await response.json();

      if (response.ok) {
        console.log('✅ تم إنشاء الحساب بنجاح!');
        onAuthSuccess(data.user);
        onClose();
      } else {
        console.log('❌ خطأ في إنشاء الحساب:', data.error);
        setError(data.error || 'حدث خطأ في إنشاء الحساب');
      }
    } catch (error) {
      console.log('🚨 خطأ في الاتصال:', error);
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNormalLoginClick = () => {
    console.log('🔐 تم النقر على تسجيل دخول عادي!');
    setCurrentView('login');
  };

  const handleAdminLoginClick = () => {
    console.log('👑 تم النقر على دخول الإدارة!');
    // يمكن إضافة منطق دخول الإدارة هنا
    setError('دخول الإدارة غير متاح حالياً');
  };

  const handleGoogleLoginClick = () => {
    console.log('🔍 تم النقر على تسجيل الدخول بـ Google!');
    setError('تسجيل الدخول بـ Google سيتم تفعيله قريباً');
  };

  const renderSelectionView = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full inline-block mb-4">
          <span className="text-white text-2xl">→</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h2>
        <p className="text-gray-400">اختر طريقة تسجيل الدخول المناسبة</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleNormalLoginClick}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-lg"
        >
          تسجيل دخول عادي
        </button>
        
        <button
          onClick={handleAdminLoginClick}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-lg"
        >
          دخول الإدارة
        </button>
        
        <button
          onClick={handleGoogleLoginClick}
          className="w-full bg-white text-gray-800 py-4 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 text-lg flex items-center justify-center space-x-2 space-x-reverse"
        >
          <span>G</span>
          <span>تسجيل الدخول بـ Google</span>
        </button>
      </div>

      <p className="text-center text-gray-400 text-sm mt-6">
        سيتم تفعيل تسجيل الدخول بـ Google قريباً
      </p>
    </div>
  );

  const renderLoginView = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentView('selection')}
          className="text-gray-400 hover:text-white mr-4"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-white">تسجيل الدخول</h2>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex mb-6">
        <button
          onClick={() => setCurrentView('login')}
          className="flex-1 py-2 px-4 rounded-l-lg bg-purple-600 text-white"
        >
          تسجيل الدخول
        </button>
        <button
          onClick={() => setCurrentView('register')}
          className="flex-1 py-2 px-4 rounded-r-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          إنشاء حساب
        </button>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={loginData.username_or_email}
            onChange={(e) => setLoginData({...loginData, username_or_email: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="اسم المستخدم أو البريد الإلكتروني"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="كلمة المرور"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </div>
  );

  const renderRegisterView = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentView('selection')}
          className="text-gray-400 hover:text-white mr-4"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-white">إنشاء حساب</h2>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="flex mb-6">
        <button
          onClick={() => setCurrentView('login')}
          className="flex-1 py-2 px-4 rounded-l-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
        >
          تسجيل الدخول
        </button>
        <button
          onClick={() => setCurrentView('register')}
          className="flex-1 py-2 px-4 rounded-r-lg bg-purple-600 text-white"
        >
          إنشاء حساب
        </button>
      </div>

      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={registerData.username}
            onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="اسم المستخدم"
            required
          />
        </div>
        <div>
          <input
            type="email"
            value={registerData.email}
            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="البريد الإلكتروني"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="كلمة المرور"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="أعد إدخال كلمة المرور"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={registerData.roblox_username}
            onChange={(e) => setRegisterData({...registerData, roblox_username: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="اسم المستخدم في روبلوكس"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={registerData.discord_username}
            onChange={(e) => setRegisterData({...registerData, discord_username: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="اسم المستخدم في ديسكورد"
            required
          />
        </div>
        <div>
          <input
            type="number"
            value={registerData.age}
            onChange={(e) => setRegisterData({...registerData, age: e.target.value})}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            placeholder="العمر"
            required
            min="13"
            max="100"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
        </button>
      </form>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {currentView === 'selection' && renderSelectionView()}
          {currentView === 'login' && renderLoginView()}
          {currentView === 'register' && renderRegisterView()}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

