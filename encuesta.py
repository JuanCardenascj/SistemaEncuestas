from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum

class EstadoEncuesta(str, Enum):
    ACTIVA = "activa"
    INACTIVA = "inactiva"
    FINALIZADA = "finalizada"

class EncuestaBase(BaseModel):
    titulo: str = Field(..., min_length=1, max_length=255)
    descripcion: Optional[str] = Field(None, max_length=500)
    fecha_inicio: datetime
    fecha_fin: datetime
    estado: EstadoEncuesta = EstadoEncuesta.ACTIVA

class EncuestaCreate(EncuestaBase):
    empresa_id: str
    usuario_id: str

class EncuestaResponse(EncuestaBase):
    id: str
    empresa_id: str
    usuario_id: str
    creado_en: datetime
    enlace_largo: Optional[str] = None
    enlace_corto: Optional[str] = None
    codigo_qr: Optional[str] = None
    total_respuestas: int = 0
    total_preguntas: int = 0

class EncuestaUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=1, max_length=255)
    descripcion: Optional[str] = Field(None, max_length=500)
    fecha_inicio: Optional[datetime] = None
    fecha_fin: Optional[datetime] = None
    estado: Optional[EstadoEncuesta] = None

class EncuestaInDB(EncuestaBase):
    id: Optional[str] = None
    empresa_id: str
    usuario_id: str
    creado_en: datetime = Field(default_factory=datetime.now)
    enlace_largo: Optional[str] = None
    enlace_corto: Optional[str] = None
    codigo_qr: Optional[str] = None