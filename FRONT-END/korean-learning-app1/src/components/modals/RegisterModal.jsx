import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const { Register, sendOtp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Tên không được để trống';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Tên phải có ít nhất 2 ký tự';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (!formData.verificationCode) {
      newErrors.verificationCode = 'Vui lòng nhập mã xác nhận';
    } else if (formData.verificationCode.length !== 6) {
      newErrors.verificationCode = 'Mã xác nhận phải có 6 ký tự';
    }
    
    return newErrors;
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setErrors({ ...errors, email: 'Vui lòng nhập email' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ ...errors, email: 'Email không hợp lệ' });
      return;
    }

    setIsSendingCode(true);
    
    // Đợi một chút để animation hiển thị
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const response = await sendOtp({ email: formData.email });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ ...errors, email: data.error || 'Không thể gửi mã xác nhận' });
        setIsSendingCode(false);
        return;
      }
      
      setIsCodeSent(true);
      setCountdown(60);
      setErrors({ ...errors, email: '' });
      setIsSendingCode(false);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setErrors({ ...errors, email: 'Không thể gửi mã xác nhận. Vui lòng thử lại' });
      console.error('Error sending OTP:', error);
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await Register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        verification_code: formData.verificationCode
      });
      onClose();
    } catch(error) {
      const msg = error.response?.data?.error || "Đăng ký thất bại!";
      setErrors({ ...errors, general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative max-h-[95vh] overflow-y-auto scrollbar-hide">
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        {/* Header với gradient */}
        {/* Header với gradient - giảm chiều cao và padding */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-5 rounded-t-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-8 -mb-8"></div>
          
          {/* <div
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full cursor-pointer z-20"
          >
            ✕
          </div> */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hover:text-gray-600 text-2xl z-20"
          >
            ✕
          </button>



          <div className="text-center relative z-10">
            <div className="text-5xl mb-2">🇰🇷</div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Tạo tài khoản
            </h2>
            <p className="text-white text-opacity-90 text-sm">
              Bắt đầu hành trình học tiếng Hàn ngay hôm nay!
            </p>
          </div>
        </div>


        {/* Form */}
        <div className="p-8 space-y-5">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {/* Tên */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên của bạn
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="Nguyễn Văn A"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.name}
              </p>
            )}
          </div>

          {/* Email & OTP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.email}
              </p>
            )}
          </div>

          {/* Mã xác nhận */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mã xác nhận
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  maxLength={6}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    errors.verificationCode ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Nhập mã 6 số"
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0 || isSendingCode}
                className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  countdown > 0 || isSendingCode
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {countdown > 0 ? (
                  <span>{countdown}s</span>
                ) : (
                  <>
                    <Send className={`w-4 h-4 ${isSendingCode ? 'animate-spin' : ''}`} />
                    {isCodeSent ? 'Gửi lại' : 'Gửi mã'}
                  </>
                )}
              </button>
            </div>
            {errors.verificationCode && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.verificationCode}
              </p>
            )}
            {isCodeSent && !errors.verificationCode && (
              <p className="text-green-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Mã xác nhận đã được gửi đến email của bạn
              </p>
            )}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.password}
              </p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
                <span className="text-base">⚠</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-3.5 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              'Đăng ký ngay'
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 text-center">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-600 text-sm">
              Đã có tài khoản?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-bold hover:underline"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;