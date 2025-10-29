import app.integrations.games.structures as structures
from app.domain.games_models import GameOptions
from app.integrations.games.templates import game_template
from app.integrations.ai_client import AIClient

class GameAIClient(AIClient):
    async def generate_game(self, options: GameOptions) -> dict:
        if options.game_type == "word_search":
            game_structure = structures.WordSearch
        elif options.game_type == "crossword":
            game_structure = structures.Crossword
        else:
            raise ValueError(f"Unsupported game type: {options.game_type}") 

        instructions = game_template()
        model = self.new_model()

        structured_llm = model.with_structured_output(game_structure)
        chain = instructions | structured_llm

        payload = {
            "topic": options.topic,
            "game_type": options.game_type,
            "language": options.language,
        }

        result = await chain.ainvoke(payload)

        if not result:
            return {"error": "No game could be generated."}
        
        return result.model_dump()
