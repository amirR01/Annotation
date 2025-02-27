from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...db.mongodb import get_database
from ...models.annotation import AnnotationCreate, AnnotationInDB
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[AnnotationInDB])
async def get_annotations(
    conversation_id: str = None,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    query = {}
    if conversation_id:
        query["conversation_id"] = conversation_id
    
    annotations = await db.annotations.find(query).to_list(1000)
    # Convert ObjectId to string for each annotation
    for annotation in annotations:
        annotation["_id"] = str(annotation["_id"])
    return annotations

@router.post("/", response_model=AnnotationInDB)
async def create_annotation(
    annotation: AnnotationCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    annotation_dict = annotation.model_dump()
    result = await db.annotations.insert_one(annotation_dict)
    created_annotation = await db.annotations.find_one({"_id": result.inserted_id})
    created_annotation["_id"] = str(created_annotation["_id"])
    return created_annotation