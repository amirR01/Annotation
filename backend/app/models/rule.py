from typing import Optional
from pydantic import BaseModel, Field
from .base import PyObjectId

class RuleBase(BaseModel):
    domain_id: str = Field(...)
    name: str = Field(...)
    description: str = Field(...)
    category: str = Field(...)

class RuleCreate(RuleBase):
    pass

class RuleUpdate(RuleBase):
    domain_id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None

class RuleInDB(RuleBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        json_encoders = {PyObjectId: str}
        populate_by_name = True