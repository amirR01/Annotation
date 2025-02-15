from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...db.mongodb import get_database
from ...models.rule import RuleCreate, RuleUpdate, RuleInDB

router = APIRouter()

@router.get("/", response_model=List[RuleInDB])
async def get_rules(db: AsyncIOMotorDatabase = Depends(get_database)):
    rules = await db.rules.find().to_list(1000)
    return rules

@router.post("/", response_model=RuleInDB)
async def create_rule(rule: RuleCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    rule_dict = rule.model_dump()
    result = await db.rules.insert_one(rule_dict)
    created_rule = await db.rules.find_one({"_id": result.inserted_id})
    return created_rule

@router.put("/{rule_id}", response_model=RuleInDB)
async def update_rule(
    rule_id: str,
    rule: RuleUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    update_data = {k: v for k, v in rule.model_dump().items() if v is not None}
    result = await db.rules.update_one(
        {"_id": rule_id},
        {"$set": update_data}
    )
    if not result.modified_count:
        raise HTTPException(status_code=404, detail="Rule not found")
    return await db.rules.find_one({"_id": rule_id})

@router.delete("/{rule_id}")
async def delete_rule(rule_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    result = await db.rules.delete_one({"_id": rule_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Rule not found")
    return {"message": "Rule deleted successfully"}