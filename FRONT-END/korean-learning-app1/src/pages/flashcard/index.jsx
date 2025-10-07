// src/pages/FlashcardPage.jsx
import { useParams } from 'react-router-dom';
import FlashcardContent from './FlashcardContent';
import { LessonProvider } from '../../context/LessonContext';

const FlashcardPage = () => {
  const { categoryId } = useParams();

  return (
    <LessonProvider categoryId={categoryId}>
      <FlashcardContent />
    </LessonProvider>
  );
};

export default FlashcardPage;