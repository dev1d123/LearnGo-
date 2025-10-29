from fastapi import APIRouter
from app.api.summarize_routes import router as summarize_router
from app.api.exercise_routes import router as exercise_router
from app.api.flashcard_routes import router as flashcard_router
from app.api.roadmap_routes import router as roadmap_router
from app.api.game_routes import router as game_router
from app.api.learning_path_routes import router as learning_path_router

router = APIRouter()
router.include_router(summarize_router)
router.include_router(exercise_router)
router.include_router(flashcard_router)
router.include_router(roadmap_router)
router.include_router(game_router)
router.include_router(learning_path_router)