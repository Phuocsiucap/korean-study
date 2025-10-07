// src/App.js
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext";
import { AuthProvider } from "./context/AuthContext";
// import { AppProvider } from "./context/AppContext";
// import { ProgressProvider } from "./context/ProgressContext";

// Pages
import HomePage from "./pages/HomePage";

import ProfilePage from "./pages/user/ProfilePage";

import GrammarPage from "./pages/grammar";
import LessonModeSelector from './pages/lessonModeSelector';
import FlashcardPage from "./pages/flashcard";
import ListenChoicePage from "./pages/listenchoice";
import ListenWritePage from "./pages/listenwrite";
import ListenAudioPage from "./pages/listenaudio";
import CategoryPage from "./pages/CategoryPage";
import AddCategoryPage from "./pages/AddCategoryPage";

// Styles (Tailwind or CSS global)
import "./styles/globals.css";

function App() {
  
  return (
    <AuthProvider>
      <CategoryProvider>
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
              

              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/add-category" element={<AddCategoryPage />} />
            </Routes>
          </Router>
      </CategoryProvider>
     </AuthProvider>
  );
}

export default App;
