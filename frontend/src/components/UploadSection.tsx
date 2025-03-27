import React, { useState } from "react";
import "../assets/UploadSection.css";

interface UploadSectionProps {
  onUpload: (file: File) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Vérification des formats et taille
      const validFormats = ["image/jpeg", "image/png"];
      if (!validFormats.includes(file.type)) {
        alert("Seuls les formats JPEG et PNG sont acceptés.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("La taille maximale autorisée est de 5 Mo.");
        return;
      }

      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="upload-section">
      <p className="upload-info">Formats acceptés : JPEG, PNG (max 5 Mo)</p>
      <input type="file" accept="image/jpeg, image/png" onChange={handleFileChange} className="upload-input" />
      {preview && <img src={preview} alt="Aperçu" className="uploaded-image" />}
    </div>
  );
};

export default UploadSection;
