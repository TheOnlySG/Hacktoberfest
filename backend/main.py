from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Passage API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

from backend.api import passages, orgs, webhooks, sandbox, questions

app.include_router(passages.router, prefix="/api/passages", tags=["Passages"])
app.include_router(orgs.router, prefix="/api/orgs", tags=["Organizations"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])
app.include_router(questions.router, prefix="/api", tags=["Questions & Relay"])
app.include_router(sandbox.router, prefix="/sandbox", tags=["Sandbox Controls"])
