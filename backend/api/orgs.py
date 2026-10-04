from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("")
async def list_orgs():
    return [{"slug": "shopmart", "name": "ShopMart"}]

@router.get("/{slug}")
async def get_org(slug: str):
    return {"slug": slug, "name": "Organization Name"}
