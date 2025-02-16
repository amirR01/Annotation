from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...db.mongodb import get_database
from ...models.conversation import ConversationCreate, ConversationUpdate, ConversationInDB
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[ConversationInDB])
async def get_conversations(db: AsyncIOMotorDatabase = Depends(get_database)):
    conversations = await db.conversations.find().to_list(1000)
    for conversation in conversations:
        conversation["_id"] = str(conversation["_id"])
    return conversations

@router.get("/{conversation_id}", response_model=ConversationInDB)
async def get_conversation(conversation_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    try:
        object_id = ObjectId(conversation_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid conversation ID format")
    
    conversation = await db.conversations.find_one({"_id": object_id})
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conversation["_id"] = str(conversation["_id"])
    return conversation

@router.post("/", response_model=ConversationInDB)
async def create_conversation(
    conversation: ConversationCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    conversation_dict = conversation.model_dump()
    conversation_dict["length"] = len(conversation_dict["conversation"])
    
    result = await db.conversations.insert_one(conversation_dict)
    created_conversation = await db.conversations.find_one({"_id": result.inserted_id})
    created_conversation["_id"] = str(created_conversation["_id"])
    return created_conversation

@router.put("/{conversation_id}", response_model=ConversationInDB)
async def update_conversation(
    conversation_id: str,
    conversation: ConversationUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        object_id = ObjectId(conversation_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid conversation ID format")

    update_data = {k: v for k, v in conversation.model_dump().items() if v is not None}
    if "conversation" in update_data:
        update_data["length"] = len(update_data["conversation"])
    
    result = await db.conversations.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )
    if not result.modified_count:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    updated_conversation = await db.conversations.find_one({"_id": object_id})
    updated_conversation["_id"] = str(updated_conversation["_id"])
    return updated_conversation

@router.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    try:
        object_id = ObjectId(conversation_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid conversation ID format")

    result = await db.conversations.delete_one({"_id": object_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted successfully"}