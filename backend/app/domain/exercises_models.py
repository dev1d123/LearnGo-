from pydantic import BaseModel, Field
from enum import Enum
from typing import List

from app.integrations.exercises.structures import MultipleChoiceExercise

class ExerciseType(str, Enum):
    multiple_choice = "multiple_choice"
    fill_in_the_blank = "fill_in_the_blank"
    true_false = "true_false"
    short_answer = "short_answer"
    matching = "matching"

class ExercisesByTopicRequest(BaseModel):
    topic: str
    exercises_count: int = 5
    exercises_difficulty: str = "medium"
    exercises_types: ExerciseType = ExerciseType.multiple_choice

class MultipleChoiceExerciseSet(BaseModel):
    """Un contenedor para una lista de ejercicios de opción múltiple."""
    exercises: List[MultipleChoiceExercise] = Field(description="Lista de ejercicios de opción múltiple")