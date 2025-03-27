import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Importation du Router
import './index.css';  // Les styles globaux
import App from './App';  // Le composant principal

// Composants supplémentaires pour la navigation entre les routes
import Header from './components/Header';  // Le composant Header pour la bannière
import OtherPage from './components/OtherPage';  // Un autre composant pour démontrer plusieurs pages

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      {/* Le Header est toujours affiché */}
      <Header />
      
      {/* Définition des routes */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/other" element={<OtherPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
