import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SAMADHAANAI"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = "sqlite:///./samadhaanai.db"
    
    # Compliance defaults
    DEFAULT_TAX_RATE: float = 0.30  # 30%
    DEFAULT_BANK_RATE: float = 0.0675  # 6.75%
    
    # Gemini API Key
    GEMINI_API_KEY: str | None = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
