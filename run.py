"""
NyayMitra (NyayMitra) Server Runner
Starts the FastAPI application and opens the web application.
"""

import os
import sys
import uvicorn
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Add backend directory to Python path
BASE_DIR = Path(__file__).resolve().parent
BACKEND_DIR = BASE_DIR / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from config import settings

def main():
    print("=" * 65)
    print("NyayMitra - AI Legal Justice & Document Automation")
    print(f"Starting server on http://{settings.HOST}:{settings.PORT}")
    print(f"Default Model: {settings.DEFAULT_MODEL}")
    print("=" * 65)
    
    uvicorn.run(
        "app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False,
        app_dir=str(BACKEND_DIR)
    )

if __name__ == "__main__":
    main()
