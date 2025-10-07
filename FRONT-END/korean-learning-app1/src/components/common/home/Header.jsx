import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trophy, Settings, User, LogOut, UserPlus } from 'lucide-react';
import LoginModal from '../../modals/LoginModal';
import RegisterModal from '../../modals/RegisterModal';

import { useAuth } from '../../../context/AuthContext';
// Updated Header Component with Auth
const Header = ({ userStats }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, Logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleLogout = () => {
    Logout();
    setShowDropdown(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🇰🇷 Korean Learn
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {isAuthenticated && (
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-700 font-semibold">{userStats.points}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-orange-50 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-700 font-semibold">{userStats.streak}</span>
                  </div>
                </div>
              )}
              
              {/* <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings className="w-5 h-5 text-gray-600" />
              </button> */}
              
              <div className="relative">
                <button 
                  onClick={handleProfileClick}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  {isAuthenticated && user?.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {isAuthenticated && showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/profile")
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Trang cá nhân</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Cài đặt</span>
                    </button>
                    <div className="border-t mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {!isAuthenticated && (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </>
  );
};

export default Header;