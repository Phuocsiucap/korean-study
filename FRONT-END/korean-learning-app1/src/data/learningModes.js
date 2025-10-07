import { BookOpen, Headphones, PenTool, Volume2 } from 'lucide-react';

export const learningModes = [
  {
    id: 'flashcard',
    name: 'Flashcard',
    description: 'Học từ vựng với thẻ ghi nhớ',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'listen-choice',
    name: 'Nghe & Chọn',
    description: 'Nghe và chọn đáp án đúng',
    icon: <Headphones className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'listen-write', 
    name: 'Nghe & Viết',
    description: 'Nghe và viết đáp án',
    icon: <PenTool className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'listen-audio',
    name: 'Chọn Audio',
    description: 'Nghe và chọn âm thanh đúng',
    icon: <Volume2 className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-600'
  }
];