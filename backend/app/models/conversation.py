from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from .base import PyObjectId

class Message(BaseModel):
    author: str
    message: str
    timestamp: datetime

class ConversationBase(BaseModel):
    title: str
    categories: List[str]
    conversation: List[Message]
    post_url: str
    length: int = Field(...)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class ConversationCreate(ConversationBase):
    pass

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    categories: Optional[List[str]] = None
    conversation: Optional[List[Message]] = None
    post_url: Optional[str] = None
    last_updated: Optional[datetime] = None

class ConversationInDB(ConversationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "title": "Example Conversation",
                "categories": ["ethical", "social"],
                "conversation": [
                    {
                        "author": "user1",
                        "message": "Hello world",
                        "timestamp": "2024-02-20T12:00:00Z"
                    }
                ],
                "post_url": "https://example.com/post",
                "length": 1,
                "last_updated": "2024-02-20T12:00:00Z"
            }
        }