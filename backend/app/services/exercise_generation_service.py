from app.domain.exercises_models import ExerciseType
from app.integrations.exercises.client import ExercisesAIClient

ai_client = ExercisesAIClient()

async def generate_exercises(content: str, exercises_count: int = 5, exercises_difficulty: str = "medium", exercises_types: ExerciseType = ExerciseType.multiple_choice):
    return await ai_client.generate_exercises(content, exercises_count, exercises_difficulty, exercises_types)