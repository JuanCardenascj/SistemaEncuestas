from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum

class TipoPregunta(str, Enum):
    TEXTO = "texto"
    OPCION_MULTIPLE = "opcion_multiple"
    ESCALA = "escala"
    SI_NO = "si_no"

class PreguntaBase(BaseModel):
    texto: str = Field(..., min_length=1, max_length=1000)
    tipo: TipoPregunta
    opciones: Optional[List[str]] = None
    obligatoria: bool = False

class PreguntaCreate(PreguntaBase):
    encuesta_id: str

class PreguntaResponse(PreguntaBase):
    id: str
    encuesta_id: str
    total_respuestas: int = 0

class PreguntaInDB(PreguntaBase):
    id: Optional[str] = None
    encuesta_id: str