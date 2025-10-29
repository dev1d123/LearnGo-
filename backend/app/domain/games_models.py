from pydantic import BaseModel, Field
from typing import Literal

class GameOptions(BaseModel):
    topic: str = "any topic"
    game_type: Literal["word_search", "crossword"] = "word_search"
    language: str = "Spanish"
