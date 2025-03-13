import os
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.paste import Paste as PasteModel
from schemas.paste import Paste
from typing import List
from sqlalchemy import text
import json
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET"),
)

paste = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# funcion para serializar el paste traido de la db a un dict
def serialize_paste(paste_model):
    return {
        "paste_key": paste_model.paste_key,
        "text": paste_model.text,
        "last_used": paste_model.last_used,
        "attachments": json.loads(paste_model.attachments)
        if paste_model.attachments
        else [],
    }


# http methods de los pastes
@paste.get("/", response_model=List[Paste])
def read_pastes(db: Session = Depends(get_db)):
    pastes = db.query(PasteModel).all()
    serialized_pastes: List[Paste] = []
    for paste in pastes:
        serialized_pastes.append(serialize_paste(paste))
    return serialized_pastes


@paste.get("/{paste_key}", response_model=Paste)
def read_paste(paste_key: str, db: Session = Depends(get_db)):
    paste = db.query(PasteModel).filter(PasteModel.paste_key == paste_key).first()
    if paste is None:
        raise HTTPException(status_code=404, detail="Paste not found")
    paste_dict = serialize_paste(paste)
    return paste_dict


@paste.post("/", response_model=Paste)
def create_paste(paste: Paste, db: Session = Depends(get_db)):
    stmt = text("""
        INSERT INTO pastes (paste_key, text, last_used, attachments)
        VALUES (:paste_key, :text, :last_used, :attachments)
        ON DUPLICATE KEY UPDATE text = :text, last_used = :last_used, attachments = :attachments
    """)

    # paso los attachment json para almacenarlos en la columna TEXT
    attachments_json = None
    if paste.attachments and len(paste.attachments) > 0:
        try:
            attachments_data = []
            for att in paste.attachments:
                # aseguro de que hay nombre, url y tipo
                att_dict = {
                    "name": str(att.name) if hasattr(att, "name") else "unnamed",
                    "url": str(att.url) if hasattr(att, "url") else "",
                    "type": str(att.type) if hasattr(att, "type") else "",
                }
                attachments_data.append(att_dict)

            attachments_json = json.dumps(attachments_data)
            print(f"Attachments JSON: {attachments_json}")
        except Exception as e:
            print(f"Error serializando adjuntos: {e}")
            attachments_json = "[]"  # si falla uso un array vacio
    else:
        attachments_json = "[]"

    db.execute(
        stmt,
        {
            "paste_key": paste.paste_key,
            "text": paste.text,
            "last_used": paste.last_used,
            "attachments": attachments_json,
        },
    )
    db.commit()
    return paste


#!el metodo put no lo estoy usando porque el post ya hace el upsert!
@paste.put("/{paste_key}", response_model=Paste)
def update_paste(paste_key: str, text: str, db: Session = Depends(get_db)):
    db_paste = db.query(PasteModel).filter(PasteModel.paste_key == paste_key).first()
    if db_paste is None:
        raise HTTPException(status_code=404, detail="Paste no encontrada")
    db_paste.text = text
    db.commit()
    return db_paste


@paste.delete("/{paste_key}")
def delete_paste(paste_key: str, db: Session = Depends(get_db)):
    db_paste = db.query(PasteModel).filter(PasteModel.paste_key == paste_key).first()
    if db_paste is None:
        raise HTTPException(status_code=404, detail="Paste no encontrada")
    db.delete(db_paste)
    db.commit()
    return paste_key + " borrado"


# HTTP METHODS DE LOS ARCHIVOS


@paste.post("/upload", response_model=dict)
async def upload_file(file: UploadFile = File(...)):
    try:
        # sube el archivo a cloudinary
        result = cloudinary.uploader.upload(
            file.file, resource_type="auto", folder="pastealo"
        )

        return {
            "success": True,
            "file_info": {
                "name": file.filename,
                "url": result["secure_url"],
                "type": file.content_type,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")


@paste.delete("/deletefile/")
async def delete_file(public_id: str, resource_type: str):
    try:
        result = cloudinary.uploader.destroy(
            "pastealo/" + public_id, resource_type=resource_type, invalidate=True
        )
        return {"success": True, "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting file: {str(e)}")


# @paste.post("/", response_model=Paste)
# def create_paste(paste: Paste):
#    query = PasteModel.__table__.insert().values(paste_key=paste.paste_key, text=paste.text, last_used=paste.last_used)
#    conn.execute(query)
#    conn.commit()
#    return paste
