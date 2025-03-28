import io
import base64
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from ultralytics import YOLO 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],  # Frontend React (port 8000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("weights/best.pt")

# Définir un modèle Pydantic pour structurer la réponse
class DetectionResponse(BaseModel):
    species: str
    confidence: float
    bounding_box: list

class ImageResponse(BaseModel):
    image: str
    detections: list[DetectionResponse]

@app.post("/analyse", response_model=ImageResponse)
async def analyse_image(file: UploadFile = File(...)):
    print("Requête reçue")
    # Lire l'image
    image_data = await file.read()
    image = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)

    if image is None:
        return JSONResponse(status_code=400, content={"message": "Erreur lors de la lecture de l'image"})

    # Analyser l'image avec YOLOv8
    results = model(image)  # Analyser l'image avec le modèle YOLOv8

    # Liste pour stocker les détections
    detections = []

    # Parcourir les résultats de la détection
    for result in results.xywh[0]:  # results.xywh[0] contient les coordonnées et la confiance
        x1, y1, w, h, confidence, class_id = result.tolist()
        class_name = model.names[int(class_id)]  # Nom de l'espèce détectée

        # Ajouter les résultats de détection à la liste
        detections.append({
            "species": class_name,
            "confidence": confidence,
            "bounding_box": [x1, y1, x1 + w, y1 + h]  # Transformer les coordonnées XYWH en XYXY
        })

    # Convertir l'image en base64 pour l'envoyer au frontend
    _, buffer = cv2.imencode('.png', image)  # Convertir l'image en format PNG
    img_base64 = base64.b64encode(buffer).decode('utf-8')  # Encoder l'image en base64

    # Retourner les résultats (image en base64 et détections)
    return ImageResponse(image=img_base64, detections=detections)
