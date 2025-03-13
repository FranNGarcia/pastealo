from pydantic import BaseModel

class Attachment(BaseModel):
    name: str
    url: str
    type: str