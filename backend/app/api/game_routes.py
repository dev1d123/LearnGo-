from fastapi import APIRouter
from app.domain.games_models import GameOptions
from app.services.game_generation_service import generate_game

router = APIRouter(prefix="/games", tags=["Games"])


@router.post(
        "/",
        response_model=dict,
        description="""
Generate a game based on the provided options.
Parameters:
- topic: The topic for the game (default: "any topic").
- game_type: The type of game to generate, either "word_search" or "crossword" (default: "word_search").
- language: The language for the game (default: "English").
"""
)
async def create_game(options: GameOptions):
    result = await generate_game(options)
    return result
