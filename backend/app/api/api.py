from fastapi import APIRouter
from .endpoints import rules, annotations

api_router = APIRouter(prefix="/api")  # Add the prefix here
api_router.include_router(rules.router, prefix="/rules", tags=["rules"])
api_router.include_router(annotations.router, prefix="/annotations", tags=["annotations"])