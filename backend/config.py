import os
from pathlib import Path
from dotenv import load_dotenv

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR / "frontend"

# Load .env file
ENV_FILE = BASE_DIR / ".env"
if ENV_FILE.exists():
    load_dotenv(ENV_FILE, override=False)
else:
    load_dotenv(override=False)

class Settings:
    PROJECT_NAME: str = "NyayaMitra AI (न्यायमित्र AI)"
    PROJECT_DESCRIPTION: str = "AI-Powered Citizen Legal Justice, Welfare Schemes & Civic Action Platform"
    VERSION: str = "1.0.0"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEFAULT_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.7-flash")
    FALLBACK_MODEL: str = "gemini-3.5-flash-lite"
    
    # Max file upload size (10 MB)
    MAX_FILE_SIZE_MB: int = 10

settings = Settings()

def get_masked_api_key() -> str:
    key = settings.GEMINI_API_KEY.strip()
    if not key:
        return "Not Configured"
    if len(key) <= 8:
        return "••••••••"
    return f"{key[:6]}••••••••{key[-4:]}"

def update_api_key(new_key: str = "", model: str = None):
    """Dynamically update API key and model in memory and .env file."""
    if new_key:
        settings.GEMINI_API_KEY = new_key.strip()
        os.environ["GEMINI_API_KEY"] = new_key.strip()
    if model:
        settings.DEFAULT_MODEL = model.strip()
        os.environ["GEMINI_MODEL"] = model.strip()
        
    try:
        with open(ENV_FILE, "w", encoding="utf-8") as f:
            f.write(f"GEMINI_API_KEY={settings.GEMINI_API_KEY}\n")
            f.write(f"GEMINI_MODEL={settings.DEFAULT_MODEL}\n")
            f.write(f"HOST={settings.HOST}\n")
            f.write(f"PORT={settings.PORT}\n")
    except Exception as e:
        print(f"Warning: Could not save .env: {e}")
