from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from app.database import empresas_collection, usuarios_collection
from app.models.empresa import EmpresaCreate, EmpresaResponse
from app.models.usuario import UsuarioCreate, RolUsuario, UsuarioInDB
from app.utils.security import get_password_hash
from datetime import datetime

router = APIRouter(prefix="/api/empresas", tags=["Empresas"])

@router.post("/registrar", response_model=EmpresaResponse)
async def registrar_empresa(empresa_data: EmpresaCreate):
    # Verificar si el email ya existe
    existing_empresa = empresas_collection.find_one({"email": empresa_data.email})
    if existing_empresa:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe una empresa con este email"
        )

    try:
        # Crear empresa
        empresa_dict = empresa_data.dict(exclude={"password"})
        empresa_dict["creado_en"] = datetime.utcnow()
        
        result = empresas_collection.insert_one(empresa_dict)
        empresa_id = str(result.inserted_id)

        # Crear usuario admin automáticamente
        usuario_admin = {
            "email": empresa_data.email,
            "nombre": "Admin",
            "apellido": empresa_data.nombre,
            "rol": RolUsuario.ADMIN.value,
            "estado": "activo",
            "empresa_id": str(empresa_id),
            "password_hash": get_password_hash(empresa_data.password),
            "creado_en": datetime.utcnow()
        }
        
        usuarios_collection.insert_one(usuario_admin)

        # Retornar respuesta
        empresa = empresas_collection.find_one({"_id": empresa_id})
        return EmpresaResponse(
            id=empresa_id,  # ← NO DEBE SER None/null
            nombre=empresa_data.nombre,
            email=empresa_data.email,
            telefono=empresa_data.telefono,
            creado_en=datetime.now()
)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar empresa: {str(e)}"
        )

@router.get("/", response_model=list[EmpresaResponse])
async def listar_empresas():
    try:
        empresas = list(empresas_collection.find())
        response = []
        
        for empresa in empresas:
            response.append(EmpresaResponse(
                _id=str(empresa["_id"]),
                nombre=empresa["nombre"],
                email=empresa["email"],
                telefono=empresa["telefono"],
                creado_en=empresa["creado_en"]
            ))
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener empresas: {str(e)}"
        )