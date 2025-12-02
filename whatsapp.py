from fastapi import APIRouter, HTTPException, status, Request
from typing import Dict, Any
from app.database import encuestas_collection, preguntas_collection, respuestas_collection
from app.models.respuesta import RespuestaCreate
from datetime import datetime
import shortuuid
import re

router = APIRouter(prefix="/api/whatsapp", tags=["WhatsApp"])

#Es para Whatsapp Bussines
"""@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    
    Webhook para recibir mensajes de WhatsApp
    Formato esperado: [encuesta_id] respuesta1, respuesta2, ...
    Ejemplo: "ENC123 Muy satisfecho, Excelente servicio, 5
    
    try:
        data = await request.json()"""

@router.post("/webhook")
async def whatsapp_webhook(request: Request):
    """
    Webhook para recibir mensajes de WhatsApp
    Formato esperado: [encuesta_id] respuesta1, respuesta2, ...
    Ejemplo: "ENC123 Muy satisfecho, Excelente servicio, 5"
    """
    try:
        # Intentar obtener datos como JSON
        try:
            data = await request.json()
        except:
            # Si falla el parsing, usar datos de prueba para testing
            data = {
                "message": "[k5s5nyTV7oLnpuTRVcKmKk] Muy satisfecho, Excelente servicio",
                "from": "whatsapp:+573001234567"
            }
        
        # Extraer mensaje (depende de la API de WhatsApp que uses)
        mensaje = data.get("message", "").strip()
        numero_whatsapp = data.get("from", "").replace("whatsapp:", "")
        
        if not mensaje:
            return {"status": "error", "message": "Mensaje vacío"}
        
        # Procesar formato: [ENCUESTA_ID] respuesta1, respuesta2, ...
        match = re.match(r'\[(\w+)\]\s*(.+)', mensaje)
        if not match:
            return {
                "status": "error", 
                "message": "Formato incorrecto. Use: [ID_ENCUESTA] respuesta1, respuesta2, ..."
            }
        
        encuesta_id = match.group(1)
        respuestas_texto = match.group(2)
        
        # Verificar que la encuesta existe
        encuesta = encuestas_collection.find_one({"_id": encuesta_id})
        if not encuesta:
            return {"status": "error", "message": "Encuesta no encontrada"}
        
        # Verificar que la encuesta está activa
        if encuesta["estado"] != "activa":
            return {"status": "error", "message": "Encuesta no está activa"}
        
        # Obtener preguntas de la encuesta
        preguntas = list(preguntas_collection.find({"encuesta_id": encuesta_id}).sort("_id", 1))
        
        if not preguntas:
            return {"status": "error", "message": "Encuesta no tiene preguntas"}
        
        # Dividir respuestas
        respuestas = [r.strip() for r in respuestas_texto.split(",")]
        
        if len(respuestas) != len(preguntas):
            return {
                "status": "error", 
                "message": f"Número de respuestas incorrecto. Esperadas: {len(preguntas)}, Recibidas: {len(respuestas)}"
            }
        
        # Guardar cada respuesta
        for i, (pregunta, respuesta_texto) in enumerate(zip(preguntas, respuestas)):
            respuesta_data = RespuestaCreate(
                respuesta=respuesta_texto,
                pregunta_id=pregunta["_id"],
                encuesta_id=encuesta_id,
                contacto_whatsapp=numero_whatsapp
            )
            
            # Crear respuesta
            respuesta_id = shortuuid.uuid()
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
        total_respuestas = respuestas_collection.count_documents({"encuesta_id": encuesta_id})
        encuestas_collection.update_one(
            {"_id": encuesta_id},
            {"$set": {"total_respuestas": total_respuestas}}
        )
        
        return {
            "status": "success", 
            "message": f"Encuesta respondida exitosamente. Total respuestas: {total_respuestas}"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar mensaje de WhatsApp: {str(e)}"
        )

@router.get("/encuesta/{encuesta_id}/instrucciones")
async def obtener_instrucciones_whatsapp(encuesta_id: str):
    """
    Obtiene instrucciones para responder encuesta por WhatsApp
    """
    try:
        # Verificar que la encuesta existe
        encuesta = encuestas_collection.find_one({"_id": encuesta_id})
        if not encuesta:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")
        
        # Obtener preguntas
        preguntas = list(preguntas_collection.find({"encuesta_id": encuesta_id}).sort("_id", 1))
        
        instrucciones = {
            "encuesta_id": encuesta_id,
            "titulo": encuesta["titulo"],
            "instrucciones": f"Para responder esta encuesta por WhatsApp, envía un mensaje con el formato:\n\n[{encuesta_id}] respuesta1, respuesta2, ...\n\nPreguntas:",
            "preguntas": []
        }
        
        for i, pregunta in enumerate(preguntas, 1):
            instrucciones["preguntas"].append({
                "numero": i,
                "pregunta": pregunta["texto"],
                "tipo": pregunta["tipo"],
                "opciones": pregunta.get("opciones", [])
            })
        
        return instrucciones
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener instrucciones: {str(e)}"
        )