// src/App.js
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";
import { AuthProvider } from "./context/AuthContext";
import { AIgenContextProvider } from './context/AIgen';
import { LessonProvider } from './context/LessonContext';
// import { AppProvider } from "./context/AppContext";
// import { ProgressProvider } from "./context/ProgressContext";

// Pages
import HomePage from "./pages/home";

import ProfilePage from "./pages/user/ProfilePage";

import GrammarPage from "./pages/grammar";
import LessonModeSelector from './pages/lessonModeSelector';
import FlashcardPage from "./pages/flashcard";
import ListenChoicePage from "./pages/listenchoice";
import ListenWritePage from "./pages/listenwrite";
import ListenAudioPage from "./pages/listenaudio";
import CategoryPage from "./pages/category";
import AddCategoryPage from "./pages/home/AddCategoryPage";


// testing
import ClozeTestScreen from "./pages/test/cloze";
import ListeningTestScreen from "./pages/test/listening";
import PronunciationTestScreen from "./pages/test/pronunciation";
// Styles (Tailwind or CSS global)
import "./styles/globals.css";

function App() {
  
  return (
    <AuthProvider>
      <CategoryProvider>
        <AIgenContextProvider>
          <Router>
            <Routes>
              {/* Trang chủ */}
              <Route path="/" element={<HomePage />} />

              {/* Fallback route (nếu URL không tồn tại thì về HomePage) */}
              <Route path="*" element={<HomePage />} />

              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/gammar" element={<GrammarPage />} />
              <Route path="/lesson-mode/:categoryId/:lessonId" element={<LessonModeSelector />} />
              
              <Route path="/flashcard/:categoryId/:lessonId" element={<FlashcardPage />} />
              <Route path="/listen-choice/:categoryId/:lessonId" element={<ListenChoicePage />} />
              <Route path="/listen-write/:categoryId/:lessonId" element={<ListenWritePage />} />
              <Route path="/listen-audio/:categoryId/:lessonId" element={<ListenAudioPage />} />
              <Route path="/cloze-test/:categoryId/:lessonId" element={<ClozeTestScreen />} />
              <Route path="/listening-test/:categoryId/:lessonId" element={<ListeningTestScreen />} />
              <Route path="/pronunciation-test/:categoryId/:lessonId" element={<PronunciationTestScreen />} />

              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/category/:categoryId/*" element={<CategoryPage />} />
              <Route path="/add-category" element={<AddCategoryPage />} />
            </Routes>
          </Router>
        </AIgenContextProvider>
      </CategoryProvider>
     </AuthProvider>
  );
}

export default App;
