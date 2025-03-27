import React, { useState } from 'react';
import '../assets/MainContent.css';

const MainContent: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<{
    fileName: string;
    genre: string;
    score: number;
  }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles) {
      const fileArray = Array.from(uploadedFiles);
      const limitedFiles = fileArray.slice(0, 50);
      setImages(limitedFiles);
      setError(null);
    }
  };

  const handleAnalyze = () => {
    if (images.length === 0) {
      setError('Veuillez sélectionner au moins une image');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      const mockResults = images.map(file => ({
        fileName: file.name,
        genre: file.name.includes('AN') ? 'Aedes' : 'Culex',
        score: Math.random() * 0.03 + 0.96
      }));
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <main className="main-content-mosquito">
      <div className="mosquito-container">
        <div className="mosquito-header">
          <h1>MAAID</h1>
          <p>Mosquito Identification and Characterization Knowledge System based on Artificial Intelligence</p>
        </div>

        <div className="mosquito-objective">
          <h2>OBJECTIF :</h2>
          <p>
            MAAID est un outil conçu pour fournir une identification précise et 
            rapide des différentes espèces taxonomiques de moustiques. Cette 
            solution utilise des techniques de reconnaissance d'images avancées 
            pour analyser des photos de moustiques fournies par les utilisateurs.
          </p>
        </div>

        <div className="mosquito-upload-section">
          <h2>TESTER LE SERVICE :</h2>
          <p>Pour lancer une analyse : Sélectionner ou déposer une ou plusieurs image(s) ici</p>
          <p>Types de fichiers autorisés : JPEG et PNG avec une taille maximale de 5Mo par image</p>
          <p>La version de démonstration est limitée à 5 requêtes par heure</p>
          
          <input 
            type="file" 
            multiple 
            accept="image/jpeg, image/png" 
            onChange={handleImageUpload} 
            className="file-input"
          />

          {error && <div className="error-message">{error}</div>}

          <button 
            onClick={handleAnalyze} 
            disabled={images.length === 0 || isAnalyzing}
            className="analyze-button"
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
          </button>
        </div>

        {isAnalyzing && (
          <div className="analyzing-message">
            Analyse en cours, veuillez patienter…
          </div>
        )}

        {analysisResults.length > 0 && !isAnalyzing && (
          <div className="mosquito-results">
            <h2>RÉSULTATS D'ANALYSE</h2>
            {analysisResults.map((result, index) => (
              <div key={index} className="result-item">
                <p><strong>Nom du fichier :</strong> {result.fileName}</p>
                <p><strong>Genre détecté :</strong> {result.genre}</p>
                <p><strong>Score :</strong> {result.score.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;