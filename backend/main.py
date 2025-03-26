from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from PIL import Image
from io import BytesIO
from ultralytics import YOLO

app = FastAPI()

# Configurer CORS pour autoriser le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Autorise React (Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Charger le modèle YOLOv8
model = YOLO("weights/best.pt")  # Remplace par le chemin correct

@app.post("/analyse")
async def analyse_image(file: UploadFile = File(...)):
    """
    Cette route reçoit une image, la traite avec YOLOv8 et retourne une image annotée.
    """
    # Lire l'image
    image_data = await file.read()
    image = Image.open(BytesIO(image_data))
    image = np.array(image)

    # Vérifier si l'image est en niveaux de gris
    if len(image.shape) == 2:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)

    # Redimensionner pour YOLOv8
    image_resized = cv2.resize(image, (640, 480))

    # Appliquer YOLO pour détecter les objets
    results = model(image_resized)

    # Dessiner les boîtes de détection
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
            confidence = box.conf[0].item()
            class_id = box.cls[0].item()
            class_name = model.names[class_id]

            cv2.rectangle(image_resized, (x1, y1), (x2, y2), (0, 255, 0), 2)
            label = f"{class_name}: {confidence:.2f}"
            cv2.putText(image_resized, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 
                        0.5, (0, 255, 0), 2, cv2.LINE_AA)

    # Encoder l'image annotée en PNG
    _, img_encoded = cv2.imencode(".png", image_resized)
    img_bytes = img_encoded.tobytes()

    return StreamingResponse(BytesIO(img_bytes), media_type="image/png")


