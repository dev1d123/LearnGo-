export const multipleChoiceStructure = `[
   {
     "topic": "string (optional, e.g. 'Mathematics')",
     "difficulty": "string (optional, one of: Easy, Medium, Hard)",
     "question": "string (the exercise question)",
     "choices": [
       { "label": "A", "text": "string", "is_correct": true/false },
       { "label": "B", "text": "string", "is_correct": true/false }
     ],
     "explanation": "string (optional, why the answer is correct)",
     "learning_objective": "string (optional, the learning objective tested)"
   }
 ]`