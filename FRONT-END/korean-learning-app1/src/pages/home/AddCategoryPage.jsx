// src/pages/AddCategoryPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

import { useCategories} from '../../context/CategoryContext';

const AddCategoryPage = () => {
  const { addCategory } = useCategories();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    icon: '📚',
    color: 'purple'
  });

  const iconOptions = [
    '📚', '🌱', '🌟', '🎯', '🚀', '💎', '🏆', '🎨', 
    '🎵', '💼', '🔥', '⚡', '🌈', '🎪', '🎭', '🎮'
  ];

  const colorOptions = [
    { name: 'Purple', value: 'purple' },
    { name: 'Blue', value: 'blue' },
    { name: 'Green', value: 'green' },
    { name: 'Red', value: 'red' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Pink', value: 'pink' },
    { name: 'Indigo', value: 'indigo' },
    { name: 'Gray', value: 'gray' },
    { name: 'Orange', value: 'orange' },
    { name: 'Teal', value: 'teal' },
    { name: 'Cyan', value: 'cyan' },
    { name: 'Black', value: 'black' }
  ];

  const handleBack = () => {
    navigate('/');
  };

  const handleInputChange = (field, value) => {
    setCategoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    // Validate
    if (!categoryData.name.trim()) {
      alert('Vui lòng nhập tên danh mục');
      return;
    }
    
    if (!categoryData.description.trim()) {
      alert('Vui lòng nhập mô tả danh mục');
      return;
    }

    // Create category object
    const newCategory = {
      name: categoryData.name.trim(),
      description: categoryData.description.trim(),
      icon: categoryData.icon,
      color: categoryData.color
    };
    await addCategory(newCategory);
    // TODO: Save to backend/localStorage
    console.log('New category created:', newCategory);
    
    alert('Danh mục đã được tạo thành công!');
    navigate('/');
  };

  // Helper function to get background color class
  const getBackgroundColor = (color) => {
    const colorMap = {
      purple: 'bg-purple-50',
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      red: 'bg-red-50',
      yellow: 'bg-yellow-50',
      pink: 'bg-pink-50',
      indigo: 'bg-indigo-50',
      gray: 'bg-gray-50',
      orange: 'bg-orange-50',
      teal: 'bg-teal-50',
      cyan: 'bg-cyan-50',
      black: 'bg-gray-100'
    };
    return colorMap[color] || 'bg-purple-50';
  };

  // Helper function to get border color class
  const getBorderColor = (color) => {
    const colorMap = {
      purple: 'border-purple-200',
      blue: 'border-blue-200',
      green: 'border-green-200',
      red: 'border-red-200',
      yellow: 'border-yellow-200',
      pink: 'border-pink-200',
      indigo: 'border-indigo-200',
      gray: 'border-gray-200',
      orange: 'border-orange-200',
      teal: 'border-teal-200',
      cyan: 'border-cyan-200',
      black: 'border-gray-300'
    };
    return colorMap[color] || 'border-purple-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-800">
              Tạo danh mục mới
            </h1>
            
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Thông tin danh mục</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  value={categoryData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="VD: Sơ cấp 1, Trung cấp 2, Nâng cao..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả danh mục *
                </label>
                <textarea
                  value={categoryData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Mô tả về nội dung và mức độ của danh mục này..."
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon danh mục
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleInputChange('icon', icon)}
                      className={`w-10 h-10 text-lg border-2 rounded-lg transition-colors ${
                        categoryData.icon === icon 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map(colorOption => (
                    <button
                      key={colorOption.value}
                      type="button"
                      onClick={() => handleInputChange('color', colorOption.value)}
                      className={`p-2 text-xs border-2 rounded-lg transition-all ${
                        categoryData.color === colorOption.value 
                          ? 'border-purple-500 ring-2 ring-purple-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${getBackgroundColor(colorOption.value)}`}
                    >
                      {colorOption.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Xem trước</h2>
            <div className={`${getBackgroundColor(categoryData.color)} ${getBorderColor(categoryData.color)} rounded-lg p-4 border-2`}>
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{categoryData.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {categoryData.name || 'Tên danh mục'}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {categoryData.description || 'Mô tả danh mục'}
                  </p>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                    <span>0 bài học</span>
                    <span>•</span>
                    <span>Màu: {colorOptions.find(c => c.value === categoryData.color)?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Tạo danh mục</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddCategoryPage;