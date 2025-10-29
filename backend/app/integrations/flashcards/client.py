from typing import List
from app.integrations.flashcards.templates import flashcards_template
from app.integrations.flashcards.structures import FlashCardSet, FlashCard
from app.integrations.ai_client import AIClient
from app.domain.models import FlashcardRequest

class FlashcardsAIClient(AIClient):
    async def generate_flashcards(self, flashcard_request: FlashcardRequest) -> List[FlashCard]:
        instructions = flashcards_template()
        # Create a model per request (no global model that open and close (that cause the vercel error))
        model = self.new_model()
        # the result follow the model structure from FlashCardSet
        structured_llm = model.with_structured_output(FlashCardSet)
        chain = instructions | structured_llm
        payload = {
            "content": flashcard_request.content,
            "flashcards_count": flashcard_request.flashcards_count,
            "difficulty_level": flashcard_request.difficulty_level,
            "focus_area": flashcard_request.focus_area
        }
        result = await chain.ainvoke(payload)
        if result:
            return result.flashcards
        return []
