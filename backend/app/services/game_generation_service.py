from app.domain.games_models import GameOptions
from app.integrations.games.client import GameAIClient

ai_client = GameAIClient()

async def generate_game(options: GameOptions):
    return await ai_client.generate_game(options)
