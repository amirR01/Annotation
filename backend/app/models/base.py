from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v, str):
            raise TypeError('ObjectId required')
        return str(v)