from sqlalchemy import Column, String, DateTime, JSON, TEXT
from config.db import engine
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Paste(Base):
    __tablename__ = "pastes"
    paste_key = Column(String(25), primary_key=True, index=True)
    text = Column(String(500), nullable=False)
    last_used = Column(DateTime, nullable=True)
    attachments = Column(TEXT, default=[])

Base.metadata.create_all(engine)