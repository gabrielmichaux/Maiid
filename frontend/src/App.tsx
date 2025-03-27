import React from 'react';
import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <div className="main-content-wrapper"> {/* Ajouté un wrapper pour le contenu principal */}
        <MainContent />
      </div>
      <Footer />
    </div>
  );
};

export default App;