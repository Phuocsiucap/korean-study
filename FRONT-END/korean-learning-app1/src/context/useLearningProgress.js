// src/context/useLearningProgress.js
import { useState, useEffect, useCallback } from 'react';
import { mergeWords } from '../utils/filterUtils';

/**
 * Custom hook để quản lý tiến độ học tập
 * @param {Object} lesson - Lesson đã filter (chỉ chứa words muốn học)
 * @param {Object} originalLesson - Lesson gốc (chứa TẤT CẢ words)
 * @param {string} categoryId
 * @param {string} lessonId
 * @param {Function} editLesson
 */
export const useLearningProgress = (lesson, originalLesson, categoryId, lessonId, editLesson) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredCards, setMasteredCards] = useState(new Set());
  const [difficultCards, setDifficultCards] = useState(new Set());
  const [showResult, setShowResult] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewWords, setReviewWords] = useState([]);
  const [updatedWords, setUpdatedWords] = useState({});
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [finalStudyTime, setFinalStudyTime] = useState(0); // 🔥 Thêm state để lưu thời gian cuối cùng
  
  // Khởi tạo updatedWords từ lesson.words (chỉ từ đã filter)
  useEffect(() => {
    if (lesson && lesson.words) {
      setStartTime(Date.now());
      const initialWords = {};
      lesson.words.forEach(word => {
        initialWords[word.id] = { ...word };
      });
      setUpdatedWords(initialWords);
    }
  }, [lesson]);

  // Lấy danh sách từ hiện tại (bình thường hoặc review)
  const currentWords = isReviewMode ? reviewWords : lesson?.words || [];
  const currentCard = currentWords[currentIndex];
  const progress = currentWords.length > 0 ? ((currentIndex + 1) / currentWords.length) * 100 : 0;

  // --- Helper: tạo snapshot updatedWords khi cập nhật 1 từ ---
  const makeUpdatedWordsSnapshot = useCallback((wordId, newFields) => {
    const prevWord = updatedWords[wordId] || currentWords.find(w => w.id === wordId) || {};
    const newWord = {
      ...prevWord,
      ...newFields,
      lastStudied: new Date().toISOString()
    };
    const newSnapshot = {
      ...updatedWords,
      [wordId]: newWord
    };
    setUpdatedWords(newSnapshot);
    return newSnapshot;
  }, [updatedWords, currentWords]);

  // Xử lý khi trả lời đúng
  const handleCorrectAnswer = useCallback(() => {
    if (!currentCard) return { finalMasteredCards: new Set(masteredCards), updatedWordsSnapshot: updatedWords };

    const prevWord = updatedWords[currentCard.id] || currentCard;
    const newStreak = (prevWord.streak || 0) + 1;
    const newLearned = newStreak >= 4;

    // Tạo snapshot mới (đảm bảo updatedWords bao gồm lần cập nhật này ngay lập tức)
    const newUpdatedWords = makeUpdatedWordsSnapshot(currentCard.id, {
      streak: newStreak,
      learned: newLearned,
      difficulty: isReviewMode ? 1 : (prevWord.difficulty || 1)
    });

    // Cập nhật mastered set (tạo bản sao mới)
    const newMastered = new Set(masteredCards);
    newMastered.add(currentCard.id);
    setMasteredCards(newMastered);

    // Nếu trước đó là difficult, remove nó
    setDifficultCards(prev => {
      const copy = new Set(prev);
      copy.delete(currentCard.id);
      return copy;
    });

    return { finalMasteredCards: newMastered, updatedWordsSnapshot: newUpdatedWords };
  }, [currentCard, updatedWords, masteredCards, isReviewMode, makeUpdatedWordsSnapshot]);

  // Xử lý khi trả lời sai
  const handleWrongAnswer = useCallback(() => {
    if (!currentCard) return { finalMasteredCards: new Set(masteredCards), updatedWordsSnapshot: updatedWords };

    const prevWord = updatedWords[currentCard.id] || currentCard;

    // Tạo snapshot mới với streak reset về 0 và learned = false; difficulty tăng nếu không trong review
    const newDifficulty = isReviewMode ? prevWord.difficulty : Math.min((prevWord.difficulty || 1) + 1, 5);
    const newUpdatedWords = makeUpdatedWordsSnapshot(currentCard.id, {
      streak: 0,
      learned: false,
      difficulty: newDifficulty
    });

    // Add vào difficult set
    const newDifficult = new Set(difficultCards);
    newDifficult.add(currentCard.id);
    setDifficultCards(newDifficult);

    // Nếu đang trong mastered thì remove
    const newMastered = new Set(masteredCards);
    if (newMastered.has(currentCard.id)) newMastered.delete(currentCard.id);
    setMasteredCards(newMastered);

    return { finalMasteredCards: newMastered, updatedWordsSnapshot: newUpdatedWords };
  }, [currentCard, updatedWords, difficultCards, masteredCards, isReviewMode, makeUpdatedWordsSnapshot]);

  // Kiểm tra xem có cần review không
  const checkForReview = useCallback((finalMasteredCards, updatedWordsSnapshot = updatedWords) => {
    if (!lesson?.words) return false;

    const wordsToReview = lesson.words.filter(word => {
      const wordData = updatedWordsSnapshot[word.id] || word;
      return difficultCards.has(word.id) || (wordData.difficulty > word.difficulty);
    });

    if (wordsToReview.length > 0) {
      setIsReviewMode(true);
      setReviewWords(wordsToReview);
      setCurrentIndex(0);
      setMasteredCards(new Set());
      setDifficultCards(new Set());
      return true;
    } else {
      finishLessonWithScore(finalMasteredCards, updatedWordsSnapshot);
      return false;
    }
  }, [lesson, updatedWords, difficultCards]); // finishLessonWithScore declared later but it's stable via useCallback below

  // Kết thúc bài học và tính điểm
  const finishLessonWithScore = useCallback(async (finalMasteredCards, updatedWordsSnapshot = updatedWords) => {
    if (!lesson?.words || !originalLesson?.words) return;

    const totalWords = lesson.words.length;
    const calculatedScore = totalWords > 0
      ? Math.round((finalMasteredCards.size / totalWords) * 100)
      : 0;

    // 🕒 Tính thời gian học TRƯỚC KHI setShowResult
    const endTime = Date.now();
    const elapsedSeconds = startTime ? Math.round((endTime - startTime) / 1000) : 0;
    
    setFinalStudyTime(elapsedSeconds); // 🔥 Lưu thời gian vào state
    setScore(calculatedScore);
    setShowResult(true);

    const mergedWords = mergeWords(originalLesson.words, updatedWordsSnapshot);

    const updatedLesson = {
      ...originalLesson,
      completed: true,
      score: calculatedScore,
      lastStudied: new Date().toISOString(),
      studyTime: (originalLesson.studyTime || 0) + elapsedSeconds, // cộng dồn
      words: mergedWords
    };

    if (editLesson) {
      await editLesson(categoryId, parseInt(lessonId, 10), updatedLesson);
    }
  }, [lesson, originalLesson, updatedWords, categoryId, lessonId, editLesson, startTime]);


  // Xử lý kết thúc sớm
  const handleFinishEarly = useCallback(async (navigate) => {
    if (!lesson?.words || !originalLesson?.words) return;

    const mergedWords = mergeWords(originalLesson.words, updatedWords);

    const currentScore = lesson.words.length > 0
      ? Math.round((masteredCards.size / lesson.words.length) * 100)
      : 0;

    // 🕒 tính thời gian học
    const endTime = Date.now();
    const elapsedSeconds = startTime ? Math.round((endTime - startTime) / 1000) : 0;

    const updatedLesson = {
      ...originalLesson,
      completed: false,
      score: currentScore,
      lastStudied: new Date().toISOString(),
      study_time: (originalLesson.study_time || 0) + elapsedSeconds,
      words: mergedWords
    };

    if (editLesson) {
      await editLesson(categoryId, parseInt(lessonId, 10), updatedLesson);
    }

    if (navigate) {
      navigate(`/category/${categoryId}`);
    }
  }, [lesson, originalLesson, updatedWords, masteredCards, categoryId, lessonId, editLesson, startTime]);

  // Xử lý khi trả lời (tự động chuyển câu hoặc kết thúc)
  const handleAnswer = useCallback((isCorrect) => {
    // Lấy kết quả chứa snapshot mới và set mới của mastered
    const result = isCorrect ? handleCorrectAnswer() : handleWrongAnswer();
    const finalMasteredCards = result?.finalMasteredCards ?? new Set(masteredCards);
    const updatedWordsSnapshot = result?.updatedWordsSnapshot ?? updatedWords;

    if (currentIndex === currentWords.length - 1) {
      // Nếu là thẻ cuối cùng
      if (isReviewMode) {
        finishLessonWithScore(finalMasteredCards, updatedWordsSnapshot);
      } else {
        checkForReview(finalMasteredCards, updatedWordsSnapshot);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, currentWords, isReviewMode, handleCorrectAnswer, handleWrongAnswer, checkForReview, finishLessonWithScore, masteredCards, updatedWords]);

  // Reset toàn bộ trạng thái (cho nút "Học lại")
  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setMasteredCards(new Set());
    setDifficultCards(new Set());
    setShowResult(false);
    setIsReviewMode(false);
    setReviewWords([]);
    setScore(0);
    setFinalStudyTime(0); // 🔥 Reset thời gian
    setStartTime(Date.now()); // 🔥 Reset lại startTime cho lần học mới

    if (lesson?.words) {
      const initialWords = {};
      lesson.words.forEach(word => {
        initialWords[word.id] = { ...word };
      });
      setUpdatedWords(initialWords);
    }
  }, [lesson]);

  const nextCard = useCallback(() => {
    if (currentIndex < currentWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, currentWords]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Utility
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-700 border-green-300';
      case 2: return 'bg-blue-100 text-blue-700 border-blue-300';
      case 3: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 4: return 'bg-orange-100 text-orange-700 border-orange-300';
      case 5: return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 1: return 'Dễ';
      case 2: return 'TB';
      case 3: return 'Khá';
      case 4: return 'Khó';
      case 5: return 'RKhó';
      default: return 'N/A';
    }
  };

  return {
    // State
    currentIndex,
    masteredCards,
    difficultCards,
    showResult,
    isReviewMode,
    reviewWords,
    updatedWords,
    score,
    startTime,
    finalStudyTime, // 🔥 Export finalStudyTime
    currentWords,
    currentCard,
    progress,

    // Actions
    handleAnswer,
    handleCorrectAnswer,
    handleWrongAnswer,
    handleFinishEarly,
    handleRestart,
    nextCard,
    prevCard,

    // Utilities
    getDifficultyColor,
    getDifficultyLabel
  };
};