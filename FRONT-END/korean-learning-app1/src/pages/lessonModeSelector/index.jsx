// src/pages/FlashcardPage.jsx
import { useParams } from 'react-router-dom';
import LessonModeSelector from './LessonModeSelector';
import { LessonProvider } from '../../context/LessonContext';

const FlashcardPage = () => {
  const { categoryId } = useParams();

  return (
    <LessonProvider categoryId={categoryId}>
      <LessonModeSelector />
    </LessonProvider>
  );
};

export default FlashcardPage;