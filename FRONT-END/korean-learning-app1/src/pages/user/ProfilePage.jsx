import React, { useState } from 'react';
import { BookOpen, Clock, Target, Award, Calendar, TrendingUp, Edit2, Camera, Trophy, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
const ProfilePage = () => {
  const {user} = useAuth();
  console.log(user);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  KL
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Korean Learner</h1>
                <p className="text-gray-500 mt-1">Thành viên từ tháng 10, 2025</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    Cấp độ: Sơ cấp
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    Rank: #1,234
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{user.wordsLearned}</div>
            <div className="text-sm text-gray-500 mt-1">Từ đã học</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{user.streak}</div>
            <div className="text-sm text-gray-500 mt-1">Ngày streak</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{user.points}</div>
            <div className="text-sm text-gray-500 mt-1">Điểm số</div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{user.studyTime}h</div>
            <div className="text-sm text-gray-500 mt-1">Thời gian học</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learning Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-purple-600" />
              Tiến độ học tập
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Sơ cấp 1</span>
                  <span className="text-purple-600 font-semibold">0/3 bài</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Trung cấp 4</span>
                  <span className="text-purple-600 font-semibold">0/80 bài</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{width: '0%'}}></div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tổng tiến độ</span>
                  <span className="text-2xl font-bold text-purple-600">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-600" />
              Thành tích
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-100 rounded-xl opacity-50">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-xs text-gray-600">Streak 7 ngày</div>
              </div>
              
              <div className="text-center p-4 bg-gray-100 rounded-xl opacity-50">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-xs text-gray-600">100 từ vựng</div>
              </div>
              
              <div className="text-center p-4 bg-gray-100 rounded-xl opacity-50">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-xs text-gray-600">1000 điểm</div>
              </div>
              
              <div className="text-center p-4 bg-gray-100 rounded-xl opacity-50">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-xs text-gray-600">Hoàn thành cấp 1</div>
              </div>
              
              <div className="text-center p-4 bg-gray-100 rounded-xl opacity-50">
                <div className="text-3xl mb-2">💪</div>
                <div className="text-xs text-gray-600">Streak 30 ngày</div>
              </div>
              
              <div className="text-center p-4 bg-gray-100 rounded-xl opacity-50">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-xs text-gray-600">Top 100</div>
              </div>
            </div>
          </div>

          {/* Study Calendar */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              Lịch học tập
            </h2>
            
            <div className="text-center text-gray-500 py-8">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Bắt đầu học để xem lịch học tập của bạn</p>
            </div>
          </div>

          {/* Learning Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Thống kê
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Độ chính xác trung bình</span>
                <span className="text-lg font-bold text-green-600">0%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bài học hoàn thành</span>
                <span className="text-lg font-bold text-blue-600">0</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Thời gian học/ngày</span>
                <span className="text-lg font-bold text-purple-600">0 phút</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ngày học liên tiếp</span>
                <span className="text-lg font-bold text-orange-600">0 ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;