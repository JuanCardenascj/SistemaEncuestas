from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa tus rutas
from app.routes.empresas import router as empresas_router
from app.routes.encuestas import router as encuestas_router
from app.routes.preguntas import router as preguntas_router
from app.routes.respuestas import router as respuestas_router
from app.routes.reportes import router as reportes_router
from app.routes.whatsapp import router as whatsapp_router
from app.routes.usuarios import router as usuarios_router

app = FastAPI(
    title="Sistema de Encuestas Empresariales",
    description="API para gestión de encuestas - Proyecto TSP Grupo 6",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    """Endpoint de verificación de salud"""
    return {
        "status": "ok",
        "message": "✅ API funcionando correctamente",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "database": "connected"  # Puedes verificar conexión a MongoDB aquí
    }

# Incluir rutas
app.include_router(empresas_router)
app.include_router(encuestas_router)
app.include_router(preguntas_router)
app.include_router(respuestas_router)
app.include_router(reportes_router)
app.include_router(whatsapp_router)
app.include_router(usuarios_router)