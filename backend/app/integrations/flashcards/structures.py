from typing import List, Optional
from pydantic import BaseModel, Field

class FlashCard(BaseModel):
    topic: str = Field(description="Main topic or subject this flashcard belongs to.")
    subtopic: Optional[str] = Field(None, description="Optional subtopic or section of the document.")
    
    question: str = Field(description="Question or prompt for the flashcard.")
    answer: str = Field(description="Main answer text for the flashcard.")
    
    key_terms: List[str] = Field(default_factory=list, description="Important terms or keywords relevant to the question.")
    difficulty: Optional[str] = Field(description="Difficulty level: easy, medium, or hard.")
    
    explanation: Optional[str] = Field(description="Expanded explanation or context behind the answer.")
        
    tags: List[str] = Field(default_factory=list, description="Tags or categories to help organize the flashcard.")

class FlashCardSet(BaseModel):
    flashcards: List[FlashCard] = Field(description="List of flashcards in this set.")
