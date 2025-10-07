// src/pages/FlashcardPage.jsx
import { useParams } from 'react-router-dom';
import ListenChoiceContent from './ListenChoiceContent';
import { LessonProvider } from '../../context/LessonContext';

const ListenChoicePage = () => {
  const { categoryId } = useParams();

  return (
    <LessonProvider categoryId={categoryId}>
      <ListenChoiceContent />
    </LessonProvider>
  );
};

export default ListenChoicePage;