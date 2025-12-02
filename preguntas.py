from fastapi import APIRouter, HTTPException, status
from typing import List
from app.database import preguntas_collection, encuestas_collection
from app.models.pregunta import PreguntaCreate, PreguntaResponse

router = APIRouter(prefix="/api/preguntas", tags=["Preguntas"])

@router.post("/", response_model=PreguntaResponse)
def crear_pregunta(pregunta_data: PreguntaCreate):
    try:
        # Verificar que la encuesta existe
        encuesta = encuestas_collection.find_one({"_id": pregunta_data.encuesta_id})
        if not encuesta:
            raise HTTPException(status_code=404, detail="Encuesta no encontrada")

        # Crear pregunta
        import shortuuid
        pregunta_id = shortuuid.uuid()
        
        pregunta_db = {
            "_id": pregunta_id,
            "texto": pregunta_data.texto,
            "tipo": pregunta_data.tipo.value,
            "opciones": pregunta_data.opciones or [],
            "obligatoria": pregunta_data.obligatoria,
            "encuesta_id": pregunta_data.encuesta_id
        }
        
        preguntas_collection.insert_one(pregunta_db)

        return PreguntaResponse(
            id=pregunta_id,
            texto=pregunta_data.texto,
            tipo=pregunta_data.tipo,
            opciones=pregunta_data.opciones or [],
            obligatoria=pregunta_data.obligatoria,
            encuesta_id=pregunta_data.encuesta_id,
            total_respuestas=0
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear pregunta: {str(e)}"
        )

@router.get("/encuesta/{encuesta_id}", response_model=List[PreguntaResponse])
def obtener_preguntas_encuesta(encuesta_id: str):
    try:
        preguntas = list(preguntas_collection.find({"encuesta_id": encuesta_id}))
        
        response = []
        for pregunta in preguntas:
            response.append(PreguntaResponse(
                id=str(pregunta["_id"]),
                texto=pregunta["texto"],
                tipo=pregunta["tipo"],
                opciones=pregunta.get("opciones", []),
                obligatoria=pregunta.get("obligatoria", False),
                encuesta_id=pregunta["encuesta_id"],
                total_respuestas=0
            ))
        
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener preguntas: {str(e)}"
        )