import React from 'react';
import { BookOpen, Trophy, Star, Clock } from 'lucide-react';

const StatsOverview = ({ userStats }) => {
  
  const stats = [
    { label: 'Từ đã học', value: userStats.wordsLearned , icon: BookOpen, color: 'text-blue-600' },
    { label: 'Ngày streak', value: userStats.streak, icon: Trophy, color: 'text-orange-600' },
    { label: 'Điểm số', value: userStats.points, icon: Star, color: 'text-yellow-600' },
    { label: 'Thời gian học', value: `${(userStats.studyTime/3600).toFixed(4)} h`, icon: Clock, color: 'text-green-600' }
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;