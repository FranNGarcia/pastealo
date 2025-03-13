from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# variables de entorno
load_dotenv()
#!
DATABASE_URL = os.getenv("DATABASE_URL")

# engine con parametros ssl
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Remove in production
    connect_args={
        "ssl": {
            "ca": "./certs/ca.pem"  # certificado CA de Aiven 
        }
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
meta = MetaData()

try:
    conn = engine.connect()
    print("conectado a la bd de Aiven")
except Exception as e:
    print(f"fallo la conexion: {e}")