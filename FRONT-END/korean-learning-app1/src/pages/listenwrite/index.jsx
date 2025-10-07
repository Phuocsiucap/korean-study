// src/pages/ListenWritePage.jsx
import { useParams } from 'react-router-dom';
import ListenWriteContent from './ListenWriteContent';
import { LessonProvider } from '../../context/LessonContext';

const ListenWritePage = () => {
  const { categoryId } = useParams();

  return (
    <LessonProvider categoryId={categoryId}>
      <ListenWriteContent />
    </LessonProvider>
  );
};

export default ListenWritePage;