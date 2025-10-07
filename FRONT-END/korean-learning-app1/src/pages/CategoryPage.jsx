// src/pages/CategoryPage.jsx
import {  useParams } from 'react-router-dom';

import CategoryContent from './CategoryContent';
import { LessonProvider } from "../context/LessonContext";
// import { categoriesData } from '../data/categories';


const CategoryPage = () => {
  const { categoryId } = useParams();

  return (
    <LessonProvider categoryId={categoryId}>
      <CategoryContent/>
    </LessonProvider>
  );
};

export default CategoryPage;