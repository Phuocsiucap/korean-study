// src/utils/filterUtils.js

/**
 * Lọc từ vựng dựa trên các tiêu chí đã chọn
 * @param {Array} words - Mảng từ vựng gốc
 * @param {Object} filters - Bộ lọc
 * @returns {Array} - Mảng từ vựng đã lọc và giới hạn số lượng
 */
export const filterWords = (words, filters) => {
  if (!words || words.length === 0) return [];

  let filteredWords = [...words];

  // Lọc theo độ khó
  if (filters.difficulty && filters.difficulty.length > 0) {
    filteredWords = filteredWords.filter(word => 
      filters.difficulty.includes(word.difficulty)
    );
  }

  // Lọc theo streak
  if (filters.streak && filters.streak !== 'all') {
    switch (filters.streak) {
      case 'low':
        filteredWords = filteredWords.filter(word => 
          (word.streak || 0) <= 1
        );
        break;
      case 'medium':
        filteredWords = filteredWords.filter(word => 
          (word.streak || 0) >= 2 && (word.streak || 0) <= 3
        );
        break;
      case 'high':
        filteredWords = filteredWords.filter(word => 
          (word.streak || 0) >= 4
        );
        break;
    }
  }

  // Lọc theo trạng thái học
  if (!filters.includeUnlearned && !filters.includeLearned) {
    // Nếu không chọn gì, mặc định lấy tất cả
  } else if (filters.includeUnlearned && !filters.includeLearned) {
    filteredWords = filteredWords.filter(word => !word.learned);
  } else if (!filters.includeUnlearned && filters.includeLearned) {
    filteredWords = filteredWords.filter(word => word.learned);
  }
  // Nếu cả 2 đều chọn thì lấy tất cả (không cần filter)

  // Xáo trộn ngẫu nhiên
  filteredWords = shuffleArray(filteredWords);

  // Giới hạn số lượng
  if (filters.wordLimit && filters.wordLimit > 0) {
    filteredWords = filteredWords.slice(0, filters.wordLimit);
  }

  return filteredWords;
};

/**
 * Xáo trộn mảng ngẫu nhiên (Fisher-Yates algorithm)
 * @param {Array} array - Mảng cần xáo trộn
 * @returns {Array} - Mảng đã xáo trộn
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Parse filter params từ URL
 * @param {URLSearchParams} searchParams - URL search params
 * @returns {Object} - Filter object
 */
export const parseFilterParams = (searchParams) => {
  const filters = {
    difficulty: [],
    streak: 'all',
    wordLimit: 20,
    includeUnlearned: true,
    includeLearned: false
  };

  const difficultyParam = searchParams.get('difficulty');
  if (difficultyParam) {
    filters.difficulty = difficultyParam
      .split(',')
      .filter(d => d) // Remove empty strings
      .map(d => parseInt(d));
  }

  const streakParam = searchParams.get('streak');
  if (streakParam) {
    filters.streak = streakParam;
  }

  const wordLimitParam = searchParams.get('wordLimit');
  if (wordLimitParam) {
    filters.wordLimit = parseInt(wordLimitParam);
  }

  const includeUnlearnedParam = searchParams.get('includeUnlearned');
  if (includeUnlearnedParam !== null) {
    filters.includeUnlearned = includeUnlearnedParam === 'true';
  }

  const includeLearnedParam = searchParams.get('includeLearned');
  if (includeLearnedParam !== null) {
    filters.includeLearned = includeLearnedParam === 'true';
  }

  return filters;
};

/**
 * Merge updated words với original words để không mất dữ liệu
 * @param {Array} originalWords - Mảng từ vựng gốc (tất cả từ trong lesson)
 * @param {Object} updatedWords - Object chứa từ đã update (key: wordId)
 * @returns {Array} - Mảng từ vựng đã merge
 */
export const mergeWords = (originalWords, updatedWords) => {
  if (!originalWords || originalWords.length === 0) return [];
  
  return originalWords.map(word => {
    // Nếu từ này có trong updatedWords thì merge, không thì giữ nguyên
    if (updatedWords[word.id]) {
      return {
        ...word,
        ...updatedWords[word.id]
      };
    }
    return word;
  });
};