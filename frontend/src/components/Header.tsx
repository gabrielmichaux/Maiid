import React from 'react';
import '../assets/Header.css';

const Header: React.FC = () => {
    return (
      <header className="header">
        <nav>
          <ul>
            <li><a href="/">ACCUEIL</a></li>
            <li><a href="/api">API</a></li>
            <li><a href="/inscription">INSCRIPTION</a></li>
            <li><a href="/connexion">CONNEXION</a></li>
          </ul>
        </nav>
      </header>
    );
  };

export default Header;
