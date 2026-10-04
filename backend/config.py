import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    USE_CACHED_AI: bool = True
    DATABASE_URL: str = "sqlite:///./passage.db"
    
    class Config:
        env_file = ".env"

settings = Settings()
