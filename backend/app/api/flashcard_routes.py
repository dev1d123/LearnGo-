from fastapi import APIRouter, File, Form, UploadFile
from typing import List
from pydantic import BaseModel
from app.services.flashcar_generation_service import generate_flashcards
from app.infrastructure.files.file_manager import extract_file_contents
from app.domain.models import FlashcardRequest


router = APIRouter(prefix="/flashcard", tags=["Flashcards"])

class FlashcardByTopicRequest(BaseModel):
    topic: str
    flashcards_count: int = 5
    difficulty_level: str = "medium"
    focus_area: str = "key concepts"

@router.post("/", response_model=dict)
async def flashcard(
    files: List[UploadFile] = File(default=[], description="Files to be summarized"),
    flashcards_count: int = Form(default=5),
    difficulty_level: str = Form(default="medium"),
    focus_area: str = Form(default="key concepts")
):

    # Content extraction
    data = await extract_file_contents(files)
    joined_content = "\n\n".join("\n\n".join(page for page in file_content) for file_content in data)

    #Flashcard Request Construction
    flashcard_request = FlashcardRequest(
        content=joined_content,
        flashcards_count=flashcards_count,
        difficulty_level=difficulty_level,
        focus_area=focus_area
    )

    # Flashcard Generation
    flashcards = await generate_flashcards(flashcard_request)

    return {"flashcards": flashcards}

@router.post("/by_topic",response_model=dict)
async def flashcard_by_topic(request: FlashcardByTopicRequest):
    # Flashcard Request Construction
    flashcard_request = FlashcardRequest(
        content=request.topic,
        flashcards_count=request.flashcards_count,
        difficulty_level=request.difficulty_level,
        focus_area=request.focus_area
    )

    # Flashcard Generation
    flashcards = await generate_flashcards(flashcard_request)

    return {"flashcards": flashcards}