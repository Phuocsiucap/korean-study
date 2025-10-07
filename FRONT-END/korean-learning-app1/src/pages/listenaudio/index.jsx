// src/pages/ListenAudioPage.jsx
import { useParams } from 'react-router-dom';
import ListenAudioContent from './ListenAudioContent';
import { LessonProvider } from '../../context/LessonContext';

const ListenAudioPage = () => {
  const { categoryId } = useParams();

  return (
    <LessonProvider categoryId={categoryId}>
      <ListenAudioContent />
    </LessonProvider>
  );
};

export default ListenAudioPage;