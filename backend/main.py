from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware #para hacer peticiones desde el frontend
from routes.paste import paste


app = FastAPI()

#cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://pastealo-frans-projects-6a36b969.vercel.app",
        "https://pastealo.vercel.app",
        "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(paste, prefix="/paste")

@app.get("/")
def read_root():
    return "ase"

