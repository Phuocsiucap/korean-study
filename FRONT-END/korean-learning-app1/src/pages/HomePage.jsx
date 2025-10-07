import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '../components/common/home/Header';
import StatsOverview from '../components/common/home/StatsOverview';
import CategoryCard from '../components/navigation/CategoryCard';
import ModeSelector from '../components/navigation/ModeSelector';
import ProgressBar from '../components/common/home/ProgressBar';
import GrammarSection from '../components/common/GrammarSection';
import { useCategories } from '../context/CategoryContext';
import { learningModes } from '../data/learningModes';
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { categories } = useCategories();
  const { user} = useAuth();
  const navigate = useNavigate();

  // const [selectedMode, setSelectedMode] = useState(null);
  const [delayLoaded, setDelayLoaded] = useState(false); // ✅ trạng thái chờ 1.5s

  // ✅ Thêm 1.5 giây delay để đảm bảo dữ liệu context sẵn sàng
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectCategory = (category) => {
    console.log('Selected category:', category);
    navigate(`/category/${category.id}`);
  };


  const handleAddCategory = () => {
    navigate('/add-category');
  };

  const handleSelectMode = (mode) => {
    return;
  }

  // ✅ Chờ dữ liệu và delay
  if (!delayLoaded  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="text-lg font-medium text-gray-700 animate-pulse">
          Đang tải dữ liệu, vui lòng chờ...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <Header userStats={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Learning Modes */}
         <StatsOverview userStats={user} />

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Chế độ học tập</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningModes.map(mode => (
              <ModeSelector 
                key={mode.id} 
                mode={mode} 
                onSelectMode={handleSelectMode}
              />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📚 Cấp độ học tập</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Hoàn thành lần lượt từ Sơ cấp 1 → 5
              </div>
              <button
                onClick={handleAddCategory}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Thêm danh mục</span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onSelectCategory={handleSelectCategory}
              />
            ))}
          </div>
        </section>

        {/* <GrammarSection onNavigateToGrammar={() => navigate('/grammar')} /> */}
        {/* Daily Goal Section */}
        <section className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">🎯 Mục tiêu hôm nay</h3>
              <p className="text-gray-600">Học 20 từ mới - Bạn đã hoàn thành 12/20 từ</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">60%</div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar progress={60} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
