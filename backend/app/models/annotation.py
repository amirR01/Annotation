from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from .base import PyObjectId

class Selection(BaseModel):
    text: str
    start_offset: int
    end_offset: int
    rule_id: str
    type: str
    comment: str

class AnnotationBase(BaseModel):
    conversation_id: str
    selections: List[Selection]
    annotator: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AnnotationCreate(AnnotationBase):
    pass

class AnnotationInDB(AnnotationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        json_encoders = {PyObjectId: str}
        populate_by_name = True