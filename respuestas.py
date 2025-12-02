from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional, Dict, Any
from app.database import respuestas_collection, preguntas_collection, encuestas_collection
from app.models.respuesta import RespuestaCreate, RespuestaResponse
from datetime import datetime
import shortuuid

router = APIRouter(prefix="/api/respuestas", tags=["Respuestas"])

@router.post("/", response_model=RespuestaResponse)
def crear_respuesta(respuesta_data: RespuestaCreate):
    # Verificar que la pregunta existe
    pregunta = preguntas_collection.find_one({"_id": respuesta_data.pregunta_id})
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

    # Verificar que la encuesta existe
    encuesta = encuestas_collection.find_one({"_id": respuesta_data.encuesta_id})
    if not encuesta:
        raise HTTPException(status_code=404, detail="Encuesta no encontrada")

    try:
        # Generar ID único
        respuesta_id = shortuuid.uuid()
        
        # Crear respuesta
        respuesta_db = {
            "_id": respuesta_id,
            "respuesta": respuesta_data.respuesta,
            "pregunta_id": respuesta_data.pregunta_id,
            "encuesta_id": respuesta_data.encuesta_id,
            "contacto_whatsapp": respuesta_data.contacto_whatsapp,
            "respondido_en": datetime.now()
        }
        
        respuestas_collection.insert_one(respuesta_db)

        # Actualizar contador de respuestas en la encuesta
        total_respuestas = respuestas_collection.count_documents({"encuesta_id": respuesta_data.encuesta_id})
        encuestas_collection.update_one(
            {"_id": respuesta_data.encuesta_id},
            {"$set": {"total_respuestas": total_respuestas}}
        )

        return RespuestaResponse(
            id=respuesta_id,
            respuesta=respuesta_data.respuesta,
            pregunta_id=respuesta_data.pregunta_id,
            encuesta_id=respuesta_data.encuesta_id,
            contacto_whatsapp=respuesta_data.contacto_whatsapp,
            respondido_en=respuesta_db["respondido_en"]
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear respuesta: {str(e)}"
        )

@router.get("/encuesta/{encuesta_id}", response_model=List[RespuestaResponse])
def obtener_respuestas_encuesta(encuesta_id: str):
    try:
        respuestas = list(respuestas_collection.find({"encuesta_id": encuesta_id}))
        
        response = []
        for respuesta in respuestas:
            response.append(RespuestaResponse(
                id=str(respuesta["_id"]),
                respuesta=respuesta["respuesta"],
                pregunta_id=respuesta["pregunta_id"],
                encuesta_id=respuesta["encuesta_id"],
                contacto_whatsapp=respuesta.get("contacto_whatsapp"),
                respondido_en=respuesta["respondido_en"]
            ))
        
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener respuestas: {str(e)}"
        )

@router.get("/pregunta/{pregunta_id}", response_model=List[RespuestaResponse])
def obtener_respuestas_pregunta(pregunta_id: str):
    try:
        respuestas = list(respuestas_collection.find({"pregunta_id": pregunta_id}))
        
        response = []
        for respuesta in respuestas:
            response.append(RespuestaResponse(
                id=str(respuesta["_id"]),
                respuesta=respuesta["respuesta"],
                pregunta_id=respuesta["pregunta_id"],
                encuesta_id=respuesta["encuesta_id"],
                contacto_whatsapp=respuesta.get("contacto_whatsapp"),
                respondido_en=respuesta["respondido_en"]
            ))
        
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener respuestas: {str(e)}"
        )

@router.get("/encuesta/{encuesta_id}/estadisticas")
def obtener_estadisticas_encuesta(encuesta_id: str):
    try:
        # Verificar que la encuesta existe
        encuesta = encuestas_collection.find_one({"_id": encuesta_id})
        if not encuesta:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")

        # Obtener todas las preguntas de la encuesta
        preguntas = list(preguntas_collection.find({"encuesta_id": encuesta_id}))
        
        estadisticas = {
            "encuesta_id": encuesta_id,
            "titulo_encuesta": encuesta["titulo"],
            "total_respuestas": respuestas_collection.count_documents({"encuesta_id": encuesta_id}),
            "preguntas": []
        }

        # Calcular estadísticas por pregunta
        for pregunta in preguntas:
            respuestas_pregunta = list(respuestas_collection.find({"pregunta_id": pregunta["_id"]}))
            
            if pregunta["tipo"] == "opcion_multiple":
                # Conteo por opción
                conteo_opciones = {}
                for respuesta in respuestas_pregunta:
                    opcion = respuesta["respuesta"]
                    conteo_opciones[opcion] = conteo_opciones.get(opcion, 0) + 1
                
                estadisticas_pregunta = {
                    "pregunta_id": str(pregunta["_id"]),
                    "texto_pregunta": pregunta["texto"],
                    "tipo": pregunta["tipo"],
                    "total_respuestas": len(respuestas_pregunta),
                    "conteo_opciones": conteo_opciones
                }
            else:
                # Para otros tipos de pregunta, mostrar las respuestas
                respuestas_texto = [r["respuesta"] for r in respuestas_pregunta]
                estadisticas_pregunta = {
                    "pregunta_id": str(pregunta["_id"]),
                    "texto_pregunta": pregunta["texto"],
                    "tipo": pregunta["tipo"],
                    "total_respuestas": len(respuestas_pregunta),
                    "respuestas": respuestas_texto
                }
            
            estadisticas["preguntas"].append(estadisticas_pregunta)

        return estadisticas

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener estadísticas: {str(e)}"
        )