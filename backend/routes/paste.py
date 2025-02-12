from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import SessionLocal
from models.paste import Paste as PasteModel
from schemas.paste import Paste
from typing import List
from sqlalchemy import text

paste = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@paste.get("/", response_model=List[Paste])
def read_pastes(db: Session = Depends(get_db)):
    pastes = db.query(PasteModel).all()
    return pastes


@paste.get("/{paste_key}", response_model=Paste)
def read_paste(paste_key: str, db: Session = Depends(get_db)):
    paste = db.query(PasteModel).filter(PasteModel.paste_key == paste_key).first()
    if paste is None:
        raise HTTPException(status_code=404, detail="Paste not found")
    return paste


@paste.post("/", response_model=Paste)
def create_paste(paste: Paste, db: Session = Depends(get_db)):
    stmt = text("""
        INSERT INTO pastes (paste_key, text, last_used)
        VALUES (:paste_key, :text, :last_used)
        ON DUPLICATE KEY UPDATE text = :text, last_used = :last_used
    """)
    db.execute(stmt, {
        'paste_key': paste.paste_key,
        'text': paste.text,
        'last_used': paste.last_used
    })
    db.commit()
    return paste


@paste.put("/{paste_key}", response_model=Paste)
def update_paste(paste_key: str, text: str, db: Session = Depends(get_db)):
    db_paste = db.query(PasteModel).filter(PasteModel.paste_key == paste_key).first()
    if db_paste is None:
        raise HTTPException(status_code=404, detail="Paste not found")
    db_paste.text = text
    db.commit()
    return db_paste


@paste.delete("/{paste_key}")
def delete_paste(paste_key: str, db: Session = Depends(get_db)):
    db_paste = db.query(PasteModel).filter(PasteModel.paste_key == paste_key).first()
    if db_paste is None:
        raise HTTPException(status_code=404, detail="Paste not found")
    db.delete(db_paste)
    db.commit()
    return paste_key + " borrado"


# @paste.post("/", response_model=Paste)
# def create_paste(paste: Paste):
#    query = PasteModel.__table__.insert().values(paste_key=paste.paste_key, text=paste.text, last_used=paste.last_used)
#    conn.execute(query)
#    conn.commit()
#    return paste
