from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import httpx
from datetime import datetime, timedelta
from fastapi_utils.tasks import repeat_every
from config.db import SessionLocal
from models.paste import Paste as PasteModel


from routes.paste import paste

BACKEND_API_URL = os.getenv("BACKEND_API_URL")

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

app.include_router(paste, prefix="/paste")


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
