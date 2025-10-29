from typing import List
from app.domain.exercises_models import ExerciseType
import app.integrations.exercises.templates as templates
import app.integrations.exercises.structures as structures

from app.integrations.ai_client import AIClient

class ExercisesAIClient(AIClient):
    async def generate_exercises(self, content: str, exercises_count: int = 5, exercises_difficulty: str = "medium", exercises_types: ExerciseType = ExerciseType.multiple_choice):

        if exercises_types == ExerciseType.multiple_choice:
            exercises_template = templates.multiple_choice_exercises_template
            ExerciseSet = structures.MultipleChoiceExerciseSet
        elif exercises_types == ExerciseType.fill_in_the_blank:
            exercises_template = templates.fill_in_the_blank_exercises_template
            ExerciseSet = structures.FillInTheBlankExerciseSet

        elif exercises_types == ExerciseType.true_false:
            exercises_template = templates.true_false_exercises_template
            ExerciseSet = structures.TrueFalseExerciseSet

        elif exercises_types == ExerciseType.short_answer:
            exercises_template = templates.short_answer_exercises_template
            ExerciseSet = structures.ShortAnswerExerciseSet

        elif exercises_types == ExerciseType.matching:
            exercises_template = templates.matching_exercises_template
            ExerciseSet = structures.MatchingExerciseSet
        else:
            raise ValueError(f"Unsupported exercise type: {exercises_types}")   
        
        #model instance per req
        model = self.new_model()

        instructions = exercises_template()
        structured_llm = model.with_structured_output(ExerciseSet)
        chain = instructions | structured_llm
        result = await chain.ainvoke({"content": content, "exercises_count": exercises_count, "exercises_difficulty": exercises_difficulty})
        if result:
            return result.model_dump()
        return []
