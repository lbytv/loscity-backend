import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, FileText, Clock, CheckCircle, XCircle, LogOut } from 'lucide-react';

const UserDashboard = ({ user, onLogout }) => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserApplications();
  }, []);

  const fetchUserApplications = async () => {
    try {
      const response = await fetch('https://loscity-backend.onrender.com', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      } else {
        setError('حدث خطأ في جلب التقديمات');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'مقبول';
      case 'rejected':
        return 'مرفوض';
      default:
        return 'قيد المراجعة';
    }
  };

  const getDepartmentName = (department) => {
    const names = {
      'police': 'الشرطة',
      'ambulance': 'الإسعاف',
      'fire': 'الإطفاء',
      'gang': 'العصابات',
      'civilian': 'الوظائف المدنية'
    };
    return names[department] || department;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="bg-purple-600 rounded-full p-3">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">مرحباً، {user.username}</h1>
                <p className="text-gray-400">لوحة التحكم الشخصية</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 space-x-reverse bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">معلومات الحساب</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">اسم المستخدم:</span>
                <span className="text-white mr-2">{user.username}</span>
              </div>
              <div>
                <span className="text-gray-400">البريد الإلكتروني:</span>
                <span className="text-white mr-2">{user.email}</span>
              </div>
              <div>
                <span className="text-gray-400">روبلوكس:</span>
                <span className="text-white mr-2">{user.roblox_username}</span>
              </div>
              <div>
                <span className="text-gray-400">ديسكورد:</span>
                <span className="text-white mr-2">{user.discord_username}</span>
              </div>
              <div>
                <span className="text-gray-400">العمر:</span>
                <span className="text-white mr-2">{user.age} سنة</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">إحصائيات التقديمات</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">إجمالي التقديمات:</span>
                <span className="text-white">{applications.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">قيد المراجعة:</span>
                <span className="text-yellow-500">
                  {applications.filter(app => app.status === 'pending').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">مقبولة:</span>
                <span className="text-green-500">
                  {applications.filter(app => app.status === 'approved').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">مرفوضة:</span>
                <span className="text-red-500">
                  {applications.filter(app => app.status === 'rejected').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <FileText className="ml-2" size={24} />
            تقديماتي
          </h2>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">جاري تحميل التقديمات...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">لا توجد تقديمات حتى الآن</p>
              <p className="text-gray-500 text-sm mt-2">قم بتقديم طلب للانضمام إلى أحد الأقسام</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <motion.div
                  key={application.id}
                  className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {getDepartmentName(application.department)}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        تاريخ التقديم: {new Date(application.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getStatusIcon(application.status)}
                      <span className={`text-sm font-medium ${
                        application.status === 'approved' ? 'text-green-500' :
                        application.status === 'rejected' ? 'text-red-500' :
                        'text-yellow-500'
                      }`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-400 text-sm">خبرة الرول بلاي:</span>
                      <p className="text-white text-sm mt-1">{application.experience}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">سبب الرغبة في الانضمام:</span>
                      <p className="text-white text-sm mt-1">{application.reason}</p>
                    </div>
                    {application.admin_notes && (
                      <div>
                        <span className="text-gray-400 text-sm">ملاحظات الإدارة:</span>
                        <p className="text-yellow-400 text-sm mt-1">{application.admin_notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

