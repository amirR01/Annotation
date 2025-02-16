from typing import Optional
from pydantic import BaseModel, Field
from .base import PyObjectId

class RuleBase(BaseModel):
    domain: str = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    category: str = Field(...)

class RuleCreate(RuleBase):
    pass

class RuleUpdate(BaseModel):
    domain: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None

class RuleInDB(RuleBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "507f1f77bcf86cd799439011",
                "domain": "Education",
                "name": "Respectful Communication",
                "description": "Communication should be respectful and avoid harmful language.",
                "category": "Ethics"
            }
        }