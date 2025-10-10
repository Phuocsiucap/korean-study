// src/pages/CategoryPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, BookOpen, Clock, Trophy, Plus, Edit, Trash2, Star } from 'lucide-react';
import AddLessonModal from '../../components/modals/AddLessonModal';
import EditLessonModal from '../../components/modals/EditLessonModal';
import DeleteLessonModal from '../../components/modals/DeleteLessonModal';
import { useLessons } from '../../context/LessonContext';
import { useCategories } from '../../context/CategoryContext';
import { formatTimeAgo } from '../../utils/dateUtils';

const CategoryContent = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { categories } = useCategories();

  const category = categories.find(cat => cat.id === parseInt(categoryId));
 
  const { lessons, addLesson, editLesson, removeLesson, loading } = useLessons(categoryId);
 
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleBack = () => {
    navigate('/');
  };

  const handleStartLesson = (lesson) => {
    navigate(`/lesson-mode/${categoryId}/${lesson.id}`);
    // navigate(`/flashcard/${lesson.category}/${lesson.id}`);
  };

  const handleAddLesson = () => {
    setShowAddLessonModal(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowEditLessonModal(true);
  };

  const handleDeleteLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowDeleteLessonModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddLessonModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditLessonModal(false);
    setSelectedLesson(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteLessonModal(false);
    setSelectedLesson(null);
  };

  const handleSaveLesson = async (newLesson) => {
    await addLesson(categoryId, newLesson);
    setShowAddLessonModal(false);
    console.log('New lesson saved:', newLesson);
  };

  const handleUpdateLesson = async (updatedLesson) => {
    await editLesson(categoryId, updatedLesson.id, updatedLesson);
    setShowEditLessonModal(false);
    setSelectedLesson(null);
    console.log('Lesson updated:', updatedLesson);
  };

  const handleConfirmDelete = async (lessonId) => {
    await removeLesson(categoryId, lessonId);
    setShowDeleteLessonModal(false);
    setSelectedLesson(null);
    console.log('Lesson deleted:', lessonId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Dễ':
        return 'bg-green-100 text-green-800';
      case 'Trung bình':
        return 'bg-yellow-100 text-yellow-800';
      case 'Khó':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!category) {
    return <div>Loading...</div>;
  }

  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const totalWords = lessons.reduce((sum, lesson) => sum + lesson.word_count, 0);
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Quay lại</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-800">
              {category.name}
            </h1>
            
            <button
              onClick={handleAddLesson}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm bài</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Overview */}
        <div className={`bg-${category.color}-50 rounded-2xl p-8 mb-8 border-2 border-opacity-20`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{category.icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h2>
                <p className="text-gray-600 text-lg mb-4">{category.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{totalLessons} bài học</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{totalWords} từ vựng</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span>{completedLessons} bài hoàn thành</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-4xl font-bold text-${category.color}-700 mb-1`}>
                {progressPercentage}%
              </div>
              <div className="text-sm text-gray-500">Hoàn thành</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-white bg-opacity-50 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r from-${category.color}-500 to-${category.color}-700 h-3 rounded-full transition-all duration-500`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Danh sách bài học</h3>
            <div className="text-sm text-gray-600">
              {completedLessons}/{totalLessons} bài hoàn thành
            </div>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có bài học nào
              </h4>
              <p className="text-gray-600 mb-4">
                Hãy thêm bài học đầu tiên cho cấp độ này
              </p>
              <button
                onClick={handleAddLesson}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Thêm bài học đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
                >
                  {/* Lesson Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{lesson.icon}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-purple-600">
                            Bài {index + 1}
                          </span>
                          {lesson.completed && (
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleEditLesson(lesson)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLesson(lesson)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {lesson.description}
                  </p>

                  {/* Lesson Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-3">
                      <span>{lesson.word_count} từ</span>
                      <span>•</span>
                      <span>{lesson.word_count/2} phút</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </span>
                  </div>

                  {/* Score or Status */}
                  {lesson.completed ? (
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Hoàn thành
                      </div>
                      <div className="text-sm text-gray-500">
                        Điểm: {lesson.score}/100
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="text-sm text-gray-500">
                        Chưa học
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartLesson(lesson)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                      lesson.completed 
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                        : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>
                      {lesson.completed ? 'Ôn lại' : 'Bắt đầu'}
                    </span>
                  </button>

                  {/* Last Studied */}
                  {lesson.lastStudied && (
                    <div className="mt-3 text-xs text-gray-400 text-center">
                      Học lần cuối: {formatTimeAgo(lesson.lastStudied)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Statistics */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Bài hoàn thành</h4>
                <p className="text-2xl font-bold text-green-600">{completedLessons}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Từ đã học</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {lessons.filter(l => l.completed).reduce((sum, l) => sum + (l.word_count || l.wordCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Điểm trung bình</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {completedLessons > 0 
                    ? Math.round(lessons.filter(l => l.completed).reduce((sum, l) => sum + (l.score || 0), 0) / completedLessons)
                    : 0
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddLessonModal
        isOpen={showAddLessonModal}
        onClose={handleCloseAddModal}
        onSave={handleSaveLesson}
        categoryName={category?.name}
      />

      <EditLessonModal
        isOpen={showEditLessonModal}
        onClose={handleCloseEditModal}
        onSave={handleUpdateLesson}
        lesson={selectedLesson}
        categoryName={category?.name}
      />

      <DeleteLessonModal
        isOpen={showDeleteLessonModal}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
        lesson={selectedLesson}
        categoryName={category?.name}
      />
    </div>
  );
};

export default CategoryContent;