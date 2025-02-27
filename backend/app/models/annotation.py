from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from .base import PyObjectId

class Selection(BaseModel):
    message_index: int
    start_offset: int
    end_offset: int
    rule_id: str
    type: str
    comment: str
    violation_type: Optional[str] = None
    replacement_suggestion: Optional[str] = None

class AnnotationBase(BaseModel):
    conversation_id: str
    selection: Selection
    annotator: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AnnotationCreate(AnnotationBase):
    pass

class AnnotationInDB(AnnotationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "conversation_id": "123",
                "selection": {
                    "message_index": 0,
                    "start_offset": 0,
                    "end_offset": 12,
                    "rule_id": "456",
                    "type": "violation",
                    "violation_type": "text",
                    "comment": "This violates the rule",
                    "replacement_suggestion": "suggested text"
                },
                "annotator": "user123",
                "timestamp": "2024-02-20T12:00:00Z"
            }
        }