from pydantic import BaseModel
from typing import List

class SummaryRequest(BaseModel):
    files: List[str] 

class SummaryResponse(BaseModel):
    summary: str

class SummaryOptions(BaseModel):
    character: str = 'review'
    language_register: str = 'formal'
    language: str = 'English'
    extension: str = 'medium'
    include_references: bool = False
    include_examples: bool = False
    include_conclusions: bool = False

class FlashcardRequest(BaseModel):
    content: str
    flashcards_count: int = 5
    difficulty_level: str = 'medium'
    focus_area: str = 'key concepts'

class RoadmapOptions(BaseModel):
    topic: str
    complexity_level: str = 'intermediate'
    duration: str = 'Recommend a duration'
    include_resources: bool = True