import { ExerciseOptions } from "@/nano/gobal";
import { multipleChoiceStructure } from "@/nano/exercises/Structures";

export function getExerciseTemplate(exerciseOptions: ExerciseOptions): string {
   let exerciseStructure = "";
   if (exerciseOptions.exercises_types === 'multiple-choice') {
      exerciseStructure = multipleChoiceStructure;
   }

   return `Generate ${exerciseOptions.exercises_count} exercises in a ${exerciseOptions.exercises_difficulty} difficulty level based on the following content or topic: ${exerciseOptions.topic}.
   Return ONLY valid JSON in the following format:
   ${multipleChoiceStructure}
   Return ONLY valid JSON in the following format:`
}