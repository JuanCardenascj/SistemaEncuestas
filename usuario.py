from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class RolUsuario(str, Enum):
    ADMIN = "admin"
    CREADOR = "creador" 
    ANALISTA = "analista"

class EstadoUsuario(str, Enum):
    ACTIVO = "activo"
    INACTIVO = "inactivo"

class UsuarioBase(BaseModel):
    email: EmailStr
    nombre: str = Field(..., min_length=1, max_length=100)
    apellido: str = Field(..., min_length=1, max_length=100)
    rol: RolUsuario
    estado: EstadoUsuario = EstadoUsuario.ACTIVO

class UsuarioCreate(UsuarioBase):
    password: str = Field(..., min_length=6)
    empresa_id: str

class UsuarioResponse(UsuarioBase):
    id: str
    empresa_id: str
    creado_en: datetime

class UsuarioInDB(UsuarioBase):
    id: Optional[str] = None
    empresa_id: str
    password_hash: str
    creado_en: datetime = Field(default_factory=datetime.now)