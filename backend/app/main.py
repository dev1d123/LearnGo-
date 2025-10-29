from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as api_router

def create_app() -> FastAPI:
    app = FastAPI(title="Chrome IA System", version="1.0.0")

    # CORS settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    async def home():
        return {"message": "Welcome to the Chrome IA System API"}

    app.include_router(api_router, prefix="/api")
    
    return app

app = create_app()