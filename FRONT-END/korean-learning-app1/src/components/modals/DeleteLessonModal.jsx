// src/components/modals/DeleteLessonModal.jsx
import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, BookOpen, Clock } from 'lucide-react';

const DeleteLessonModal = ({ isOpen, onClose, onDelete, lesson, categoryName }) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(lesson.id);
      onClose();
      setConfirmText(''); // Reset confirm text
    } catch (error) {
      console.error('Error deleting lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmText(''); // Reset confirm text when closing
      onClose();
    }
  };

  // Check if user typed "XÓA" to enable delete button
  const canDelete = confirmText.toUpperCase() === 'XÓA';

  if (!isOpen || !lesson) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Xóa bài học</h2>
              <p className="text-sm text-gray-600">Hành động này không thể hoàn tác</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Lesson Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{lesson.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{lesson.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{lesson.word_count || lesson.wordCount} từ</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{lesson.estimatedTime}</span>
                  </div>
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                    {lesson.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Cảnh báo:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Bài học sẽ bị xóa vĩnh viễn khỏi <span className="font-medium">{categoryName}</span></li>
                    <li>• Tất cả dữ liệu học tập và tiến trình sẽ mất</li>
                    <li>• Điểm số và lịch sử học tập sẽ không thể khôi phục</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Để xác nhận, vui lòng nhập <span className="font-bold text-red-600">"XÓA"</span> vào ô bên dưới:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nhập XÓA để xác nhận"
              disabled={loading}
            />
          </div>

          {/* Additional Info */}
          {lesson.completed && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">!</span>
                </div>
                <p className="text-sm text-yellow-800">
                  Bài học này đã hoàn thành với điểm số <span className="font-medium">{lesson.score}/100</span>.
                  Bạn có chắc chắn muốn xóa?
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || !canDelete}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Xóa bài học</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLessonModal;