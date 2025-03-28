import React, { useState } from 'react';
import axios from 'axios';
import '../assets/MainContent.css';

const MainContent: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<{
    fileName: string;
    detectedImage: string;
    detections: Array<{
      className: string;
      confidence: number;
    }>;
  }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction de gestion du changement de fichier
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImages(Array.from(files)); // Récupère les fichiers sélectionnés
    }
  };
  

  // Fonction de traitement de l'analyse des images
  const handleAnalyze = async () => {
    if (images.length === 0) {
      setError('Veuillez sélectionner au moins une image');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const resultsPromises = images.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await axios.post('http://localhost:8000/analyse', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('Réponse du backend:', response);

          // Les données renvoyées contiendront l'image analysée (en base64) et les détections
          return {
            fileName: file.name,
            detectedImage: `data:image/png;base64,${response.data.image}`, // Image analysée en base64
            detections: response.data.detections.map((detection: any) => ({
              className: detection.species, // Nom de l'espèce détectée
              confidence: detection.confidence // Confiance de la détection
            }))
          };
        } catch (apiError) {
          console.error('Erreur lors de l\'analyse:', apiError);
          return {
            fileName: file.name,
            detectedImage: '',
            detections: []
          };
        }
      });

      const results = await Promise.all(resultsPromises);
      setAnalysisResults(results);
    } catch (error) {
      setError('Une erreur est survenue lors de l\'analyse');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
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
                {result.detectedImage && (
                  <img 
                    src={result.detectedImage} 
                    alt="Image analysée" 
                    className="analyzed-image"
                  />
                )}
                {result.detections.length > 0 && (
                  <div>
                    <strong>Détections :</strong>
                    {result.detections.map((detection, detIndex) => (
                      <p key={detIndex}>
                        {detection.className}: {(detection.confidence * 100).toFixed(2)}%
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;
