import { useState } from "react";

function App() {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Affichage de l’image
        }
    };

    const handleUpload = async () => {
        if (!image) return;
        const formData = new FormData();
        formData.append("file", image);

        try {
            const response = await fetch("http://127.0.0.1:8000/analyse", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Erreur d'analyse");

            const blob = await response.blob();
            setResult(URL.createObjectURL(blob));
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Insect Detection App</h1>

            <input type="file" accept="image/*" onChange={handleFileChange} />

            {preview && <img src={preview} alt="Uploaded" style={{ width: "300px", marginTop: "10px" }} />}

            {image && <button onClick={handleUpload}>Analyser</button>}

            {result && <img src={result} alt="Résultat analyse" style={{ width: "300px", marginTop: "20px" }} />}
        </div>
    );
}

export default App;
