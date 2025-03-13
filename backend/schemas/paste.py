from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .attachment import Attachment

class Paste(BaseModel):
    paste_key: str
    text: str
    last_used: datetime
    attachments: Optional[List[Attachment]] = []
