from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    APP_SETTING: str = "default_value"
    GEMINI_API_KEY: str
    GEMINI_MODEL: str
    GEMINI_MODEL_PRO: str

# avoid reloading settings
@lru_cache()
def get_settings():
    return Settings()