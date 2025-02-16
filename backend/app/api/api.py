from fastapi import APIRouter
from .endpoints import rules, annotations, conversations

api_router = APIRouter(prefix="/api")
api_router.include_router(rules.router, prefix="/rules", tags=["rules"])
api_router.include_router(annotations.router, prefix="/annotations", tags=["annotations"])
api_router.include_router(conversations.router, prefix="/conversations", tags=["conversations"])