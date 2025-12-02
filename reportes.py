# app/routes/reportes.py - VERSIÓN CORREGIDA
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional, Dict, Any
from app.database import reportes_collection, encuestas_collection, respuestas_collection, preguntas_collection
from app.models.reporte import ReporteCreate, ReporteResponse, FormatoReporte, TipoReporte
from datetime import datetime
from bson import ObjectId
import shortuuid

router = APIRouter(prefix="/api/reportes", tags=["Reportes"])

def obtener_estadisticas_encuesta(encuesta_id: str) -> Dict[str, Any]:
    """Función síncrona para obtener estadísticas"""
    try:
        # Contar respuestas
        total_respuestas = respuestas_collection.count_documents({"encuesta_id": encuesta_id})
        
        # Obtener preguntas
        preguntas = list(preguntas_collection.find({"encuesta_id": encuesta_id}))
        
        estadisticas = {
            "total_respuestas": total_respuestas,
            "total_preguntas": len(preguntas),
            "preguntas": []
        }
        
        # Para cada pregunta, contar respuestas
        for pregunta in preguntas:
            respuestas_pregunta = list(respuestas_collection.find({
                "encuesta_id": encuesta_id,
                "pregunta_id": str(pregunta["_id"])
            }))
            
            estadisticas["preguntas"].append({
                "id": str(pregunta["_id"]),
                "texto": pregunta["texto"],
                "tipo": pregunta["tipo"],
                "total_respuestas": len(respuestas_pregunta)
            })
        
        return estadisticas
    except Exception as e:
        print(f"Error obteniendo estadísticas: {e}")
        return {}

@router.post("/", response_model=ReporteResponse)
def crear_reporte(reporte_data: ReporteCreate):
    try:
        # Verificar que la encuesta existe
        encuesta = encuestas_collection.find_one({"_id": reporte_data.encuesta_id})
        if not encuesta:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")

        # Obtener estadísticas
        estadisticas = obtener_estadisticas_encuesta(reporte_data.encuesta_id)
        
        # Crear reporte
        reporte_id = shortuuid.uuid()
        url_descarga = f"/api/reportes/{reporte_id}/descargar"
        
        reporte_db = {
            "_id": reporte_id,
            "nombre": reporte_data.nombre,
            "tipo": reporte_data.tipo.value,
            "formato": reporte_data.formato.value,
            "encuesta_id": reporte_data.encuesta_id,
            "empresa_id": reporte_data.empresa_id,
            "usuario_id": reporte_data.usuario_id,
            "creado_en": datetime.now(),
            "url_descarga": url_descarga,
            "estadisticas": estadisticas
        }
        
        reportes_collection.insert_one(reporte_db)

        return ReporteResponse(
            id=reporte_id,
            nombre=reporte_data.nombre,
            tipo=reporte_data.tipo,
            formato=reporte_data.formato,
            encuesta_id=reporte_data.encuesta_id,
            empresa_id=reporte_data.empresa_id,
            usuario_id=reporte_data.usuario_id,
            creado_en=reporte_db["creado_en"],
            url_descarga=url_descarga,
            estadisticas=estadisticas
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear reporte: {str(e)}"
        )

@router.get("/encuesta/{encuesta_id}", response_model=List[ReporteResponse])
def obtener_reportes_encuesta(encuesta_id: str):
    try:
        reportes = list(reportes_collection.find({"encuesta_id": encuesta_id}))
        
        response = []
        for reporte in reportes:
            response.append(ReporteResponse(
                id=str(reporte["_id"]),
                nombre=reporte["nombre"],
                tipo=reporte["tipo"],
                formato=reporte["formato"],
                encuesta_id=reporte["encuesta_id"],
                empresa_id=reporte["empresa_id"],
                usuario_id=reporte["usuario_id"],
                creado_en=reporte["creado_en"],
                url_descarga=reporte.get("url_descarga"),
                estadisticas=reporte.get("estadisticas")
            ))
        
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener reportes: {str(e)}"
        )

@router.get("/{reporte_id}", response_model=ReporteResponse)
def obtener_reporte(reporte_id: str):
    try:
        reporte = reportes_collection.find_one({"_id": reporte_id})
        if not reporte:
            raise HTTPException(status_code=404, detail="Reporte no encontrado")

        return ReporteResponse(
            id=str(reporte["_id"]),
            nombre=reporte["nombre"],
            tipo=reporte["tipo"],
            formato=reporte["formato"],
            encuesta_id=reporte["encuesta_id"],
            empresa_id=reporte["empresa_id"],
            usuario_id=reporte["usuario_id"],
            creado_en=reporte["creado_en"],
            url_descarga=reporte.get("url_descarga"),
            estadisticas=reporte.get("estadisticas")
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener reporte: {str(e)}"
        )