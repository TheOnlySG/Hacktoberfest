from fastapi import APIRouter, HTTPException
from backend.router.org_router import load_org_profiles

router = APIRouter()

@router.get("")
async def list_orgs():
    profiles = load_org_profiles()
    return list(profiles.values())

@router.get("/{slug}")
async def get_org(slug: str):
    profiles = load_org_profiles()
    if slug in profiles:
        return profiles[slug]
    raise HTTPException(status_code=404, detail="Organization profile not found")
