from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# variables de entorno
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("Falta la variable de entorno DATABASE_URL")

# Aiven (y Heroku/Render) entregan "postgres://..." o "postgresql://...", pero
# SQLAlchemy 2.x no acepta "postgres://". Lo normalizo para usar psycopg2.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

# Aiven exige TLS. Si la URL no trae sslmode, fuerzo "require".
# (Opcional: poner DB_SSL_ROOT_CERT=ruta/al/ca.pem para verificar el certificado.)
connect_args = {}
if "sslmode=" not in DATABASE_URL:
    connect_args["sslmode"] = "require"
ssl_root_cert = os.getenv("DB_SSL_ROOT_CERT")
if ssl_root_cert:
    connect_args["sslmode"] = "verify-full"
    connect_args["sslrootcert"] = ssl_root_cert

engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
    connect_args=connect_args,
    # El plan free de Aiven PostgreSQL permite solo 20 conexiones y no tiene pooler
    pool_size=5,
    max_overflow=5,
    pool_pre_ping=True,  # reconecta si Aiven apago/reinicio el servicio
    pool_recycle=1800,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
meta = MetaData()

try:
    with engine.connect():
        print("conectado a la bd de Aiven (PostgreSQL)")
except Exception as e:
    print(f"fallo la conexion: {e}")
