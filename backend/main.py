import os
import json

import cloudinary
import cloudinary.uploader

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
import httpx
from datetime import datetime, timedelta
from fastapi_utils.tasks import repeat_every
from config.db import SessionLocal
from models.paste import Paste as PasteModel


from routes.paste import paste

BACKEND_API_URL = os.getenv("BACKEND_API_URL")
DATABASE_URL = os.getenv("DATABASE_URL")

#TODO una vez que hiciste un fetch y cambiaste el id no podes borrar el file que trajiste
app = FastAPI()

# cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pastealo-frans-projects-6a36b969.vercel.app",
        "https://pastealo.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET"),
)

app.include_router(paste, prefix="/paste")

# migracion para añadir la col que me falta en bd de prod

#def run_migration():
#    engine = create_engine(DATABASE_URL)
#    with engine.connect() as conn:
#        try:
#            # veo si existe la columna
#            check_column = text("""
#                SELECT COUNT(*) 
#                FROM information_schema.COLUMNS 
#                WHERE TABLE_NAME = 'pastes' 
#                AND COLUMN_NAME = 'attachments'
#                AND TABLE_SCHEMA = DATABASE()
#            """)
#
#            result = conn.execute(check_column).scalar()
#
#            # añado la col si no existe
#            if result == 0:
#                conn.execute(
#                    text("ALTER TABLE pastes ADD COLUMN attachments TEXT NULL")
#                )
#                conn.commit()
#                print("Migracion hecha")
#            else:
#                print("Migracion no necesaria")
#
#        except Exception as e:
#            print(f"Migration error: {e}")
#run_migration()

# task scheduler para evitar que el backend entre en idle
@app.on_event("startup")
@repeat_every(seconds=540)  # cada 9 minutos
async def ping_despierto():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(BACKEND_API_URL + "/mantenerdespierto")
            print(response.text)
        except Exception as e:
            print(e)


@app.on_event("startup")
@repeat_every(seconds=60 * 60 * 24)  # cada 24 hs
def borrar_pastes_vencidos():
    with SessionLocal() as db:
        tiempo_para_vencer = datetime.now() - timedelta(days=5)
        try:
            query = db.query(PasteModel).filter(
                PasteModel.last_used < tiempo_para_vencer
            )
            pastes_vencidos = query.all() #lista de los pastes para luego sacarles el id del url y borrarlos de cloudinary
            print(pastes_vencidos)
            for paste in pastes_vencidos:
                if paste.attachments != "[]":
                    parsedPaste = json.loads(paste.attachments)
                    for attachment in parsedPaste:
                        public_id = attachment["url"][-20:] #me quedo con el id del url
                        try:
                            res = cloudinary.uploader.destroy(f"pastealo/{public_id}", resource_type=attachment["type"])
                            print(f"eliminado de cloudinary el {public_id} vencido: {res}")
                        except Exception as e:
                            print(f"Error eliminando {public_id} de cloudinary: {e}")
            query.delete()
            db.commit()
        except Exception as e:
            print(f"error: {e}")
        print("pastes vencidos eliminados")


@app.get("/")
def read_root():
    return "servidor vivo"


@app.get("/mantenerdespierto")
def mantener_despierto():
    print("Vivo por 9min")
