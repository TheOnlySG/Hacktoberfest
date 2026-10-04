import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    USE_CACHED_AI: bool = False
    GROQ_MODEL: str = "openai/gpt-oss-120b"
    DATABASE_URL: str = "sqlite:///./passage.db"
    
    class Config:
        env_file = os.path.join(os.path.dirname(__file__), ".env")
        extra = "allow"

settings = Settings()
