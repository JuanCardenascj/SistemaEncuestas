from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class FormatoReporte(str, Enum):
    PDF = "pdf"
    XLSX = "xlsx"

class TipoReporte(str, Enum):
    RESUMEN = "resumen"
    DETALLADO = "detallado"
    COMPARATIVO = "comparativo"

class ReporteBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=255)
    tipo: TipoReporte
    formato: FormatoReporte
    encuesta_id: str

class ReporteCreate(ReporteBase):
    empresa_id: str
    usuario_id: str

class ReporteResponse(ReporteBase):
    id: str
    empresa_id: str
    usuario_id: str
    creado_en: datetime
    url_descarga: Optional[str] = None
    estadisticas: Optional[Dict[str, Any]] = None

class ReporteInDB(ReporteBase):
    id: Optional[str] = None
    empresa_id: str
    usuario_id: str
    creado_en: datetime = Field(default_factory=datetime.now)
    url_descarga: Optional[str] = None
    estadisticas: Optional[Dict[str, Any]] = None