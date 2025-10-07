import React, { useState } from 'react';
import { BookOpen, Clock, CheckCircle, ArrowLeft, Play, Award, Plus } from 'lucide-react';
import GrammarCard from '../../components/navigation/GammarCard';

const GrammarContent = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGrammar, setSelectedGrammar] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGrammar, setNewGrammar] = useState({
    title: '',
    type: 'verb',
    level: 'beginner',
    description: '',
    duration: '15',
    exercises: '10',
    rules: ['', '', ''],
    examples: ['', '', '']
  });

  const [grammarTypes, setGrammarTypes] = useState([
    { id: 'all', name: 'Tất cả', color: 'gray' },
    { id: 'verb', name: 'Động từ', color: 'green' },
    { id: 'adjective', name: 'Tính từ', color: 'blue' },
    { id: 'noun', name: 'Danh từ', color: 'purple' },
    { id: 'particle', name: 'Trợ từ', color: 'pink' },
    { id: 'sentence', name: 'Mẫu câu', color: 'orange' }
  ]);

  const levels = [
    { id: 'all', name: 'Tất cả cấp độ' },
    { id: 'beginner', name: 'Sơ cấp' },
    { id: 'intermediate', name: 'Trung cấp' },
    { id: 'advanced', name: 'Nâng cao' }
  ];

  const allGrammarTopics = [
    {
      id: 1,
      title: "이다 / 아니다",
      type: "verb",
      typeName: "Động từ",
      level: "beginner",
      levelName: "Sơ cấp",
      description: "Động từ 'là' và 'không là' trong tiếng Hàn - Cách sử dụng cơ bản nhất",
      duration: "15 phút",
      exercises: 12,
      progress: 75,
      completed: false,
      content: {
        rules: [
          "이다: Dùng sau danh từ kết thúc bằng phụ âm (학생이다 = là học sinh)",
          "아니다: Phủ định của 이다, nghĩa là 'không phải là'",
          "Chia theo thì: 이에요/예요 (hiện tại lịch sự), 입니다/아닙니다 (trang trọng)"
        ],
        examples: [
          "저는 학생이에요. (Tôi là học sinh)",
          "이것은 책이 아니에요. (Đây không phải là sách)",
          "그 사람은 선생님입니다. (Người đó là giáo viên)"
        ]
      }
    },
    {
      id: 2,
      title: "하다 Động từ",
      type: "verb",
      typeName: "Động từ",
      level: "beginner",
      levelName: "Sơ cấp",
      description: "Động từ 'làm' - Kết hợp với danh từ để tạo động từ mới",
      duration: "20 phút",
      exercises: 15,
      progress: 0,
      completed: false,
      content: {
        rules: [
          "하다 = làm, kết hợp với danh từ: 공부하다 (học bài), 일하다 (làm việc)",
          "Chia theo thì: 해요 (hiện tại), 했어요 (quá khứ), 할 거예요 (tương lai)",
          "Có thể tách: 공부를 하다 hoặc 공부하다 (cả hai đều đúng)"
        ],
        examples: [
          "저는 한국어를 공부해요. (Tôi học tiếng Hàn)",
          "어제 운동했어요. (Hôm qua tôi đã tập thể dục)",
          "내일 쇼핑할 거예요. (Ngày mai tôi sẽ đi mua sắm)"
        ]
      }
    },
    {
      id: 3,
      title: "ㅂ/습니다 Kết thúc",
      type: "sentence",
      typeName: "Mẫu câu",
      level: "beginner",
      levelName: "Sơ cấp",
      description: "Cách kết thúc câu trang trọng trong tiếng Hàn",
      duration: "18 phút",
      exercises: 10,
      progress: 100,
      completed: true,
      content: {
        rules: [
          "Dùng -습니다 sau động từ/tính từ kết thúc bằng phụ âm",
          "Dùng -ㅂ니다 sau động từ/tính từ kết thúc bằng nguyên âm",
          "Phủ định: -지 않습니다 hoặc 안 + động từ"
        ],
        examples: [
          "저는 학생입니다. (Tôi là học sinh - trang trọng)",
          "한국어를 공부합니다. (Tôi học tiếng Hàn)",
          "영화를 봅니다. (Tôi xem phim)"
        ]
      }
    },
    {
      id: 4,
      title: "이/가 Trợ từ chủ ngữ",
      type: "particle",
      typeName: "Trợ từ",
      level: "beginner",
      levelName: "Sơ cấp",
      description: "Trợ từ đánh dấu chủ ngữ trong câu",
      duration: "25 phút",
      exercises: 18,
      progress: 30,
      completed: false,
      content: {
        rules: [
          "Dùng 이 sau danh từ kết thúc bằng phụ âm (책이)",
          "Dùng 가 sau danh từ kết thúc bằng nguyên âm (나가)",
          "Nhấn mạnh chủ ngữ, thường dùng với câu hỏi ai/cái gì"
        ],
        examples: [
          "사과가 맛있어요. (Táo ngon)",
          "누가 왔어요? (Ai đã đến?)",
          "책이 어디에 있어요? (Sách ở đâu?)"
        ]
      }
    },
    {
      id: 5,
      title: "은/는 Trợ từ chủ đề",
      type: "particle",
      typeName: "Trợ từ",
      level: "beginner",
      levelName: "Sơ cấp",
      description: "Trợ từ đánh dấu chủ đề của câu",
      duration: "30 phút",
      exercises: 20,
      progress: 0,
      completed: false,
      content: {
        rules: [
          "Dùng 은 sau danh từ kết thúc bằng phụ âm (저는)",
          "Dùng 는 sau danh từ kết thúc bằng nguyên âm (나는)",
          "Đưa ra thông tin chung, so sánh, hoặc nhấn mạnh chủ đề"
        ],
        examples: [
          "저는 학생이에요. (Còn tôi thì là học sinh)",
          "오늘은 날씨가 좋아요. (Hôm nay thời tiết đẹp)",
          "한국어는 어려워요. (Tiếng Hàn thì khó)"
        ]
      }
    },
    {
      id: 6,
      title: "을/를 Trợ từ tân ngữ",
      type: "particle",
      typeName: "Trợ từ",
      level: "beginner",
      levelName: "Sơ cấp",
      description: "Trợ từ đánh dấu tân ngữ trực tiếp",
      duration: "28 phút",
      exercises: 16,
      progress: 50,
      completed: false,
      content: {
        rules: [
          "Dùng 을 sau danh từ kết thúc bằng phụ âm (밥을)",
          "Dùng 를 sau danh từ kết thúc bằng nguyên âm (커피를)",
          "Đánh dấu đối tượng trực tiếp của hành động"
        ],
        examples: [
          "밥을 먹어요. (Ăn cơm)",
          "커피를 마셔요. (Uống cà phê)",
          "음악을 들어요. (Nghe nhạc)"
        ]
      }
    },
    {
      id: 7,
      title: "았/었/였 Thì quá khứ",
      type: "verb",
      typeName: "Động từ",
      level: "intermediate",
      levelName: "Trung cấp",
      description: "Cách chia động từ/tính từ ở thì quá khứ",
      duration: "22 phút",
      exercises: 14,
      progress: 0,
      completed: false,
      content: {
        rules: [
          "Dùng 았어요 với nguyên âm dương (ㅏ, ㅗ): 가다 → 갔어요",
          "Dùng 었어요 với nguyên âm âm khác: 먹다 → 먹었어요",
          "Dùng 였어요 với 하다: 공부하다 → 공부했어요"
        ],
        examples: [
          "어제 학교에 갔어요. (Hôm qua tôi đã đến trường)",
          "아침을 먹었어요. (Tôi đã ăn sáng)",
          "친구를 만났어요. (Tôi đã gặp bạn)"
        ]
      }
    },
    {
      id: 8,
      title: "고 싶다 Muốn làm gì",
      type: "sentence",
      typeName: "Mẫu câu",
      level: "intermediate",
      levelName: "Trung cấp",
      description: "Biểu đạt mong muốn làm việc gì đó",
      duration: "20 phút",
      exercises: 12,
      progress: 0,
      completed: false,
      content: {
        rules: [
          "Gốc động từ + 고 싶다 = muốn làm gì",
          "Chỉ dùng cho mong muốn của người nói (ngôi thứ nhất)",
          "Phủ định: 고 싶지 않다 (không muốn)"
        ],
        examples: [
          "한국에 가고 싶어요. (Tôi muốn đi Hàn Quốc)",
          "영화를 보고 싶어요. (Tôi muốn xem phim)",
          "쉬고 싶어요. (Tôi muốn nghỉ ngơi)"
        ]
      }
    }
  ];

  const filteredGrammar = allGrammarTopics.filter(g => {
    const matchLevel = selectedLevel === 'all' || g.level === selectedLevel;
    const matchType = selectedType === 'all' || g.type === selectedType;
    return matchLevel && matchType;
  });

  const stats = {
    completed: allGrammarTopics.filter(g => g.completed).length,
    inProgress: allGrammarTopics.filter(g => g.progress > 0 && !g.completed).length,
    total: allGrammarTopics.length
  };

  if (selectedGrammar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedGrammar(null)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{selectedGrammar.title}</h1>
                  <p className="text-blue-100 mt-1">{selectedGrammar.levelName} • {selectedGrammar.typeName}</p>
                </div>
              </div>
              <p className="text-blue-50">{selectedGrammar.description}</p>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-purple-600" />
                  Quy tắc ngữ pháp
                </h2>
                <div className="space-y-3">
                  {selectedGrammar.content.rules.map((rule, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-purple-50 p-4 rounded-lg">
                      <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Play className="w-6 h-6 mr-2 text-blue-600" />
                  Ví dụ minh họa
                </h2>
                <div className="space-y-3">
                  {selectedGrammar.content.examples.map((example, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                      <p className="text-gray-800 font-medium">{example}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                  Bắt đầu học
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  Làm bài tập
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📖 Học ngữ pháp tiếng Hàn</h1>
          <p className="text-gray-600">Nắm vững kiến thức ngữ pháp từ cơ bản đến nâng cao</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">Đã hoàn thành</p>
                <p className="text-4xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Đang học</p>
                <p className="text-4xl font-bold">{stats.inProgress}</p>
              </div>
              <Clock className="w-12 h-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-1">Tổng chủ đề</p>
                <p className="text-4xl font-bold">{stats.total}</p>
              </div>
              <BookOpen className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Grammar Type Filter */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Dạng ngữ pháp</h3>
          <div className="flex flex-wrap gap-3">
            {grammarTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedType === type.id
                    ? `bg-${type.color}-600 text-white shadow-lg transform scale-105`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {type.name}
              </button>
            ))}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm dạng mới</span>
            </button>
          </div>
        </div>

        {/* Level Filter */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Cấp độ</h3>
          <div className="flex flex-wrap gap-3">
            {levels.map(level => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedLevel === level.id
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grammar Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGrammar.map(grammar => (
            <GrammarCard 
              key={grammar.id}
              grammar={grammar}
              onSelectGrammar={setSelectedGrammar}
            />
          ))}
        </div>

        {/* Add Grammar Type Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold">Thêm dạng ngữ pháp mới</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên dạng ngữ pháp
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Thể khiến khích, Thể bị động..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={newGrammar.title}
                    onChange={(e) => setNewGrammar({...newGrammar, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loại
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={newGrammar.type}
                    onChange={(e) => setNewGrammar({...newGrammar, type: e.target.value})}
                  >
                    {grammarTypes.filter(t => t.id !== 'all').map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cấp độ
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={newGrammar.level}
                    onChange={(e) => setNewGrammar({...newGrammar, level: e.target.value})}
                  >
                    {levels.filter(l => l.id !== 'all').map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    placeholder="Mô tả ngắn gọn về dạng ngữ pháp này"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={newGrammar.description}
                    onChange={(e) => setNewGrammar({...newGrammar, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thời gian (phút)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={newGrammar.duration}
                      onChange={(e) => setNewGrammar({...newGrammar, duration: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số bài tập
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={newGrammar.exercises}
                      onChange={(e) => setNewGrammar({...newGrammar, exercises: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      // Logic thêm dạng mới vào database
                      console.log('New grammar:', newGrammar);
                      setShowAddModal(false);
                      // Reset form
                      setNewGrammar({
                        title: '',
                        type: 'verb',
                        level: 'beginner',
                        description: '',
                        duration: '15',
                        exercises: '10',
                        rules: ['', '', ''],
                        examples: ['', '', '']
                      });
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarContent;