// src/pages/ListenWritePage.jsx
import { useParams } from 'react-router-dom';
import ClozeTestScreen from './ClozeTestScreen';
import { LessonProvider } from '../../../context/LessonContext';

const ClozeTestPage = () => {
  const { categoryId } = useParams();
  console.log('ClozeTestPage categoryId:', categoryId);
  
  return (  // ✅ Phải có return
    <LessonProvider categoryId={categoryId}>
      <ClozeTestScreen />
    </LessonProvider>
  );
};
export default ClozeTestPage;