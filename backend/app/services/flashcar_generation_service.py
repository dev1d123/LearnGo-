from app.integrations.flashcards.client import FlashcardsAIClient
from app.domain.models import FlashcardRequest

ai_client = FlashcardsAIClient()

async def generate_flashcards(flashcard_request) -> list:
    return await ai_client.generate_flashcards(flashcard_request)