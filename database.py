# database.py - Versión síncrona (pymongo)
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "SistemaEncuesta")

# Conexión síncrona
client = MongoClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Colecciones
empresas_collection = db.empresas
usuarios_collection = db.usuarios
encuestas_collection = db.encuestas
preguntas_collection = db.preguntas
respuestas_collection = db.respuestas
reportes_collection = db.reportes

print(f"✅ Conectado a MongoDB Atlas: {DATABASE_NAME}")