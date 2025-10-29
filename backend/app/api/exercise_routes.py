from fastapi import APIRouter, File, UploadFile, Form
from typing import List
from app.services.exercise_generation_service import generate_exercises
from app.infrastructure.files.file_manager import extract_file_contents
from app.domain.exercises_models import ExercisesByTopicRequest, ExerciseType

router = APIRouter(prefix="/generate-exercises", tags=["Generate Exercises"])


@router.post("/", response_model=dict)
async def exercises(
    files: List[UploadFile] = File(default=[], description="Files to be summarized"),
    exercises_count: int = Form(5, description="Number of exercises to generate"),
    exercises_difficulty: str = Form("medium", description="Difficulty level of the exercises"),
    exercises_types: ExerciseType = Form(ExerciseType.multiple_choice, description="Types of exercises to generate"),
):
    # Content extraction
    data = await extract_file_contents(files)
    joined_content = "\n\n".join(
        "\n\n".join(page for page in file_content) for file_content in data
    )

    # Exercises Generation
    exercises = await generate_exercises(
        joined_content, exercises_count, exercises_difficulty, exercises_types
    )

    return {"exercises": exercises}


@router.post(
    "/by_topic",
    response_model=dict,
    description="""
Generate exercises based on a specific topic.

Parameters:
- topic: The topic to generate exercises for.
- exercises_count: Number of exercises to generate (default: 5).
- exercises_difficulty: Difficulty level of the exercises (default: medium).
- exercises_types: Types of exercises to generate (default: multiple_choice):
    - multiple_choice
    - fill_in_the_blank
    - true_false
    - short_answer
    - matching
""",
)
async def exercises_by_topic(request: ExercisesByTopicRequest):
    # Exercises Generation
    exercises = await generate_exercises(
        request.topic,
        request.exercises_count,
        request.exercises_difficulty,
        request.exercises_types
    )

    return {"exercises": exercises}
