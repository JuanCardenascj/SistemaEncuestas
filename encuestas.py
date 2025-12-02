from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional, Dict, Any
from app.database import encuestas_collection, preguntas_collection, empresas_collection, usuarios_collection, respuestas_collection
from app.models.encuesta import EncuestaCreate, EncuestaResponse, EncuestaUpdate, EstadoEncuesta
from app.models.pregunta import PreguntaCreate
from datetime import datetime
from bson import ObjectId
import shortuuid
import qrcode
import io
import base64

router = APIRouter(prefix="/api/encuestas", tags=["Encuestas"])

def generar_qr_code(url: str) -> str:
    """Genera código QR en base64"""
    try:
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")
        
        buffer = io.BytesIO()
        qr_img.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode()
    except:
        return None

@router.post("/", response_model=EncuestaResponse)
def crear_encuesta(encuesta_data: EncuestaCreate):
    # Verificar que la empresa existe
    empresa = empresas_collection.find_one({"_id": ObjectId(encuesta_data.empresa_id)})
    if not empresa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa no encontrada"
        )

    # Verificar que el usuario existe
    usuario = usuarios_collection.find_one({"_id": ObjectId(encuesta_data.usuario_id)})
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    try:
        # Generar enlaces únicos
        encuesta_id = shortuuid.uuid()
        enlace_largo = f"http://localhost:3000/encuesta/{encuesta_id}"
        enlace_corto = f"http://localhost:3000/e/{shortuuid.ShortUUID().random(length=8)}"
        
        # Generar QR code
        codigo_qr = generar_qr_code(enlace_largo)

        # Crear encuesta
        encuesta_db = {
            "titulo": encuesta_data.titulo,
            "descripcion": encuesta_data.descripcion,
            "fecha_inicio": encuesta_data.fecha_inicio,
            "fecha_fin": encuesta_data.fecha_fin,
            "estado": encuesta_data.estado.value,
            "empresa_id": encuesta_data.empresa_id,
            "usuario_id": encuesta_data.usuario_id,
            "_id": encuesta_id,
            "creado_en": datetime.now(),
            "enlace_largo": enlace_largo,
            "enlace_corto": enlace_corto,
            "codigo_qr": codigo_qr,
            "total_respuestas": 0
        }
        
        encuestas_collection.insert_one(encuesta_db)

        # Contar preguntas (inicialmente 0)
        total_preguntas = 0

        # Retornar respuesta
        return EncuestaResponse(
            id=encuesta_id,
            titulo=encuesta_data.titulo,
            descripcion=encuesta_data.descripcion,
            fecha_inicio=encuesta_data.fecha_inicio,
            fecha_fin=encuesta_data.fecha_fin,
            estado=encuesta_data.estado,
            empresa_id=encuesta_data.empresa_id,
            usuario_id=encuesta_data.usuario_id,
            creado_en=encuesta_db["creado_en"],
            enlace_largo=enlace_largo,
            enlace_corto=enlace_corto,
            codigo_qr=codigo_qr,
            total_respuestas=0,
            total_preguntas=total_preguntas
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear encuesta: {str(e)}"
        )

@router.get("/empresa/{empresa_id}", response_model=List[EncuestaResponse])
def obtener_encuestas_empresa(empresa_id: str):
    try:
        encuestas = list(encuestas_collection.find({"empresa_id": empresa_id}))
        
        response = []
        for encuesta in encuestas:
            # Contar preguntas y respuestas para cada encuesta
            total_preguntas = preguntas_collection.count_documents({"encuesta_id": encuesta["_id"]})
            total_respuestas = respuestas_collection.count_documents({"encuesta_id": encuesta["_id"]})
            
            response.append(EncuestaResponse(
                id=str(encuesta["_id"]),
                titulo=encuesta["titulo"],
                descripcion=encuesta.get("descripcion"),
                fecha_inicio=encuesta["fecha_inicio"],
                fecha_fin=encuesta["fecha_fin"],
                estado=encuesta["estado"],
                empresa_id=encuesta["empresa_id"],
                usuario_id=encuesta["usuario_id"],
                creado_en=encuesta["creado_en"],
                enlace_largo=encuesta.get("enlace_largo"),
                enlace_corto=encuesta.get("enlace_corto"),
                codigo_qr=encuesta.get("codigo_qr"),
                total_respuestas=total_respuestas,
                total_preguntas=total_preguntas
            ))
        
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener encuestas: {str(e)}"
        )

@router.put("/{encuesta_id}", response_model=EncuestaResponse)
def actualizar_encuesta(encuesta_id: str, encuesta_data: EncuestaUpdate):
    try:
        # Verificar que la encuesta existe
        encuesta = encuestas_collection.find_one({"_id": encuesta_id})
        if not encuesta:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")

        # Preparar datos para actualizar
        update_data = {}
        if encuesta_data.titulo is not None:
            update_data["titulo"] = encuesta_data.titulo
        if encuesta_data.descripcion is not None:
            update_data["descripcion"] = encuesta_data.descripcion
        if encuesta_data.fecha_inicio is not None:
            update_data["fecha_inicio"] = encuesta_data.fecha_inicio
        if encuesta_data.fecha_fin is not None:
            update_data["fecha_fin"] = encuesta_data.fecha_fin
        if encuesta_data.estado is not None:
            update_data["estado"] = encuesta_data.estado.value

        update_data["actualizado_en"] = datetime.now()

        # Actualizar encuesta
        encuestas_collection.update_one(
            {"_id": encuesta_id},
            {"$set": update_data}
        )

        # Obtener encuesta actualizada
        encuesta_actualizada = encuestas_collection.find_one({"_id": encuesta_id})
        
        # Contar preguntas y respuestas
        total_preguntas = preguntas_collection.count_documents({"encuesta_id": encuesta_id})
        total_respuestas = respuestas_collection.count_documents({"encuesta_id": encuesta_id})

        return EncuestaResponse(
            id=encuesta_id,
            titulo=encuesta_actualizada["titulo"],
            descripcion=encuesta_actualizada.get("descripcion"),
            fecha_inicio=encuesta_actualizada["fecha_inicio"],
            fecha_fin=encuesta_actualizada["fecha_fin"],
            estado=encuesta_actualizada["estado"],
            empresa_id=encuesta_actualizada["empresa_id"],
            usuario_id=encuesta_actualizada["usuario_id"],
            creado_en=encuesta_actualizada["creado_en"],
            enlace_largo=encuesta_actualizada["enlace_largo"],
            enlace_corto=encuesta_actualizada["enlace_corto"],
            codigo_qr=encuesta_actualizada.get("codigo_qr"),
            total_respuestas=total_respuestas,
            total_preguntas=total_preguntas
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar encuesta: {str(e)}"
        )

@router.delete("/{encuesta_id}")
def eliminar_encuesta(encuesta_id: str):
    try:
        # Verificar que la encuesta existe
        encuesta = encuestas_collection.find_one({"_id": encuesta_id})
        if not encuesta:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")

        # Eliminar encuesta y sus preguntas relacionadas
        encuestas_collection.delete_one({"_id": encuesta_id})
        preguntas_collection.delete_many({"encuesta_id": encuesta_id})
        
        # También eliminar respuestas relacionadas
        respuestas_collection.delete_many({"encuesta_id": encuesta_id})

        return {"message": "Encuesta eliminada exitosamente"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar encuesta: {str(e)}"
        )

@router.post("/{encuesta_id}/duplicar", response_model=EncuestaResponse)
def duplicar_encuesta(encuesta_id: str):
    try:
        # Buscar encuesta original
        encuesta_original = encuestas_collection.find_one({"_id": encuesta_id})
        if not encuesta_original:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")

        # Buscar preguntas originales
        preguntas_originales = list(preguntas_collection.find({"encuesta_id": encuesta_id}))

        # Generar nuevo ID
        nueva_encuesta_id = shortuuid.uuid()
        nuevo_enlace_largo = f"http://localhost:3000/encuesta/{nueva_encuesta_id}"
        nuevo_enlace_corto = f"http://localhost:3000/e/{shortuuid.ShortUUID().random(length=8)}"
        nuevo_qr = generar_qr_code(nuevo_enlace_largo)

        # Crear nueva encuesta (copia)
        nueva_encuesta = {
            "_id": nueva_encuesta_id,
            "titulo": f"{encuesta_original['titulo']} (Copia)",
            "descripcion": encuesta_original.get("descripcion"),
            "fecha_inicio": encuesta_original["fecha_inicio"],
            "fecha_fin": encuesta_original["fecha_fin"],
            "estado": EstadoEncuesta.ACTIVA.value,
            "empresa_id": encuesta_original["empresa_id"],
            "usuario_id": encuesta_original["usuario_id"],
            "creado_en": datetime.now(),
            "enlace_largo": nuevo_enlace_largo,
            "enlace_corto": nuevo_enlace_corto,
            "codigo_qr": nuevo_qr,
            "total_respuestas": 0
        }
        
        encuestas_collection.insert_one(nueva_encuesta)

        # Duplicar preguntas
        if preguntas_originales:
            nuevas_preguntas = []
            for pregunta in preguntas_originales:
                nueva_pregunta = pregunta.copy()
                nueva_pregunta["_id"] = shortuuid.uuid()
                nueva_pregunta["encuesta_id"] = nueva_encuesta_id
                # Remover _id original si existe
                nueva_pregunta.pop("_id", None)
                nuevas_preguntas.append(nueva_pregunta)
            
            if nuevas_preguntas:
                preguntas_collection.insert_many(nuevas_preguntas)

        # Contar preguntas duplicadas
        total_preguntas = len(preguntas_originales)

        return EncuestaResponse(
            id=nueva_encuesta_id,
            titulo=nueva_encuesta["titulo"],
            descripcion=nueva_encuesta.get("descripcion"),
            fecha_inicio=nueva_encuesta["fecha_inicio"],
            fecha_fin=nueva_encuesta["fecha_fin"],
            estado=EstadoEncuesta.ACTIVA,
            empresa_id=nueva_encuesta["empresa_id"],
            usuario_id=nueva_encuesta["usuario_id"],
            creado_en=nueva_encuesta["creado_en"],
            enlace_largo=nuevo_enlace_largo,
            enlace_corto=nuevo_enlace_corto,
            codigo_qr=nuevo_qr,
            total_respuestas=0,
            total_preguntas=total_preguntas
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al duplicar encuesta: {str(e)}"
        )