# app/database.py - SOLO ESTO DEBE QUEDAR
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# Configuración MongoDB
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "SistemaEncuesta")

# Conexión síncrona
client = MongoClient(MONGODB_URL)
database = client[DATABASE_NAME]

# Colecciones
empresas_collection = database["empresas"]
usuarios_collection = database["usuarios"] 
encuestas_collection = database["encuestas"]
preguntas_collection = database["preguntas"]
respuestas_collection = database["respuestas"]
reportes_collection = database["reportes"]

print(f"✅ Conectado a MongoDB Atlas: {DATABASE_NAME}")

def get_database():
    return database