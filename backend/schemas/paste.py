from pydantic import BaseModel
from datetime import datetime

class Paste(BaseModel):
    paste_key: str
    text: str
    last_used: datetime
