from fastapi import APIRouter, HTTPException
from app.database import usuarios_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])

@router.post("/")
async def crear_usuario(usuario_data: dict):
    try:
        usuario_id = ObjectId()
        usuario = {
            "_id": usuario_id,
            "nombre": usuario_data.get("nombre", "Usuario Default"),
            "email": usuario_data.get("email", "usuario@default.com"),
            "creado_en": datetime.now()
        }
        
        usuarios_collection.insert_one(usuario)
        return {"id": str(usuario_id), "mensaje": "Usuario creado exitosamente"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear usuario: {str(e)}")

@router.get("/")
async def listar_usuarios():
    try:
        usuarios = list(usuarios_collection.find())
        return [{"id": str(u["_id"]), "nombre": u.get("nombre", "Sin nombre"), "email": u.get("email", "")} for u in usuarios]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al listar usuarios: {str(e)}")