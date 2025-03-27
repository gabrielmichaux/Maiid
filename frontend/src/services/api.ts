export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Erreur d’analyse");

    const blob = await response.blob();
    return URL.createObjectURL(blob);
}
