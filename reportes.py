from fastapi import APIRouter, HTTPException, status, Response
from fastapi.responses import StreamingResponse
from typing import List
from bson import ObjectId
from app.database import reportes_collection, encuestas_collection, empresas_collection, usuarios_collection
from app.models.reporte import ReporteCreate, ReporteResponse, FormatoReporte, TipoReporte
from app.utils.report_generator import ReportGenerator
from app.routes.respuestas import obtener_estadisticas_encuesta
from datetime import datetime
import shortuuid
import io

router = APIRouter(prefix="/api/reportes", tags=["Reportes"])

@router.post("/", response_model=ReporteResponse)
async def crear_reporte(reporte_data: ReporteCreate):
    # Verificar que la empresa existe
    empresa = empresas_collection.find_one({"_id": ObjectId(reporte_data.empresa_id)})
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    # Verificar que el usuario existe
    usuario = usuarios_collection.find_one({"_id": ObjectId(reporte_data.usuario_id)})
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar que la encuesta existe
    encuesta = encuestas_collection.find_one({"_id": reporte_data.encuesta_id})
    if not encuesta:
        raise HTTPException(status_code=404, detail="Encuesta no encontrada")

    try:
        # Generar ID único
        reporte_id = shortuuid.uuid()
        
        # Obtener estadísticas para el reporte
        estadisticas = await obtener_estadisticas_encuesta(reporte_data.encuesta_id)
        
        # Crear reporte
        reporte_db = {
            "_id": reporte_id,
            "nombre": reporte_data.nombre,
            "tipo": reporte_data.tipo.value,
            "formato": reporte_data.formato.value,
            "encuesta_id": reporte_data.encuesta_id,
            "empresa_id": reporte_data.empresa_id,
            "usuario_id": reporte_data.usuario_id,
            "creado_en": datetime.now(),
            "url_descarga": f"/api/reportes/{reporte_id}/descargar",
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
            url_descarga=reporte_db["url_descarga"],
            estadisticas=estadisticas
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear reporte: {str(e)}"
        )

@router.get("/{reporte_id}/descargar")
async def descargar_reporte(reporte_id: str):
    try:
        # Buscar reporte
        reporte = reportes_collection.find_one({"_id": reporte_id})
        if not reporte:
            raise HTTPException(status_code=404, detail="Reporte no encontrado")

        estadisticas = reporte["estadisticas"]
        formato = reporte["formato"]
        nombre_archivo = f"{reporte['nombre']}.{formato}"

        # Generar archivo según el formato
        if formato == "xlsx":
            buffer = ReportGenerator.generar_excel(estadisticas, nombre_archivo)
            media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        else:  # PDF
            buffer = ReportGenerator.generar_pdf(estadisticas, nombre_archivo)
            media_type = "application/pdf"

        return StreamingResponse(
            buffer,
            media_type=media_type,
            headers={"Content-Disposition": f"attachment; filename={nombre_archivo}"}
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al descargar reporte: {str(e)}"
        )

@router.get("/empresa/{empresa_id}", response_model=List[ReporteResponse])
async def obtener_reportes_empresa(empresa_id: str):
    try:
        reportes = list(reportes_collection.find({"empresa_id": ObjectId(empresa_id)}))
        
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