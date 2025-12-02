from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class RespuestaBase(BaseModel):
    respuesta: str = Field(..., min_length=1)

class RespuestaCreate(RespuestaBase):
    pregunta_id: str
    encuesta_id: str
    contacto_whatsapp: Optional[str] = None

class RespuestaResponse(RespuestaBase):
    id: str
    pregunta_id: str
    encuesta_id: str
    contacto_whatsapp: Optional[str] = None
    respondido_en: datetime

class RespuestaInDB(RespuestaBase):
    id: Optional[str] = None
    pregunta_id: str
    encuesta_id: str
    contacto_whatsapp: Optional[str] = None
    respondido_en: datetime = Field(default_factory=datetime.now)