# backend/app/models/empresa.py - VERSIÓN SIMPLIFICADA
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class EmpresaBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    telefono: str = Field(..., min_length=1, max_length=20)

class EmpresaCreate(EmpresaBase):
    password: str = Field(..., min_length=6)

class EmpresaResponse(EmpresaBase):
    id: Optional[str] = None  # ✅ Hacerlo opcional
    creado_en: datetime
    
    # Añade esta configuración
    class Config:
        from_attributes = True  # Para Pydantic v2
        # O si es Pydantic v1:
        # orm_mode = True

class EmpresaInDB(EmpresaBase):
    id: Optional[str] = None
    creado_en: datetime = Field(default_factory=datetime.utcnow)