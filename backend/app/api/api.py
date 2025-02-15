from fastapi import APIRouter
from .endpoints import rules, annotations

api_router = APIRouter()
api_router.include_router(rules.router, prefix="/rules", tags=["rules"])
api_router.include_router(annotations.router, prefix="/annotations", tags=["annotations"])