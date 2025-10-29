from typing import List, Optional, Union, Dict
from pydantic import BaseModel, Field

# --- Structures for Multiple Choice ---

class Choice(BaseModel):
    """Defines an answer option for a multiple-choice question."""
    text: str = Field(description="The text of the option")
    is_correct: bool = Field(description="Indicates whether this option is the correct answer")

class MultipleChoiceExercise(BaseModel):
    """Defines a multiple-choice exercise."""
    topic: Optional[str] = Field(description="The topic or subject area of the exercise")
    difficulty: Optional[str] = Field(description="Difficulty level (Easy, Medium, Hard)")
    question: str = Field(description="The question of the exercise")
    choices: List[Choice] = Field(description="List of possible answer choices")
    explanation: Optional[str] = Field(description="Explanation of why the answer is correct")
    learning_objective: Optional[str] = Field(description="The learning objective tested by the exercise")

# --- Structures for other types of exercises ---

class FillInTheBlankExercise(BaseModel):
    """Defines a fill-in-the-blank exercise."""
    topic: Optional[str] = Field(description="The topic or subject area of the exercise")
    difficulty: Optional[str] = Field(description="Difficulty level (Easy, Medium, Hard)")
    question: str = Field(description="The question with a blank space (e.g., 'The capital of France is __.')")
    answer: str = Field(description="The correct answer text")
    explanation: Optional[str] = Field(description="Explanation of why the answer is correct")
    learning_objective: Optional[str] = Field(description="The learning objective tested by the exercise")

class TrueFalseExercise(BaseModel):
    """Defines a true/false exercise."""
    topic: Optional[str] = Field(description="The topic or subject area of the exercise")
    difficulty: Optional[str] = Field(description="Difficulty level (Easy, Medium, Hard)")
    statement: str = Field(description="The statement to be evaluated")
    is_true: bool = Field(description="Indicates whether the statement is true")
    explanation: Optional[str] = Field(description="Explanation of why the statement is true or false")
    learning_objective: Optional[str] = Field(description="The learning objective tested by the exercise")

class ShortAnswerExercise(BaseModel):
    """Defines a short-answer exercise."""
    topic: Optional[str] = Field(description="The topic or subject area of the exercise")
    difficulty: Optional[str] = Field(description="Difficulty level (Easy, Medium, Hard)")
    question: str = Field(description="The question of the exercise")
    answer: str = Field(description="The ideal or correct short answer")
    explanation: Optional[str] = Field(description="Explanation of why the answer is correct")
    learning_objective: Optional[str] = Field(description="The learning objective tested by the exercise")

class MatchingExercise(BaseModel):
    """Defines a matching exercise (column pairing)."""
    topic: Optional[str] = Field(description="The topic or subject area of the exercise")
    difficulty: Optional[str] = Field(description="Difficulty level (Easy, Medium, Hard)")
    instructions: str = Field(description="Instructions, e.g., 'Match the concepts with their definitions.'")
    premises: List[str] = Field(description="Column A: The list of items to be matched")
    responses: List[str] = Field(description="Column B: The list of matching options")
    correct_matches: Dict[str, str] = Field(description="A dictionary where the key is an item from 'premises' and the value is the corresponding item from 'responses'")
    explanation: Optional[str] = Field(description="General explanation of the correct matches")
    learning_objective: Optional[str] = Field(description="The learning objective tested by the exercise")

# --- Union definition and Exercise Set container ---

Exercise = Union[
    MultipleChoiceExercise,
    FillInTheBlankExercise,
    TrueFalseExercise,
    ShortAnswerExercise,
    MatchingExercise
]
"""A 'Union' type that can represent any defined exercise type."""

class ExerciseSet(BaseModel):
    """A container for a list of exercises of any type."""
    exercises: List[Exercise] = Field(description="List of exercises in the set")





# --- Set of specific exercise types ---

class MultipleChoiceExerciseSet(BaseModel):
    exercises: List[MultipleChoiceExercise]

class FillInTheBlankExerciseSet(BaseModel):
    exercises: List[FillInTheBlankExercise]

class TrueFalseExerciseSet(BaseModel):
    exercises: List[TrueFalseExercise]

class ShortAnswerExerciseSet(BaseModel):
    exercises: List[ShortAnswerExercise]

class MatchingExerciseSet(BaseModel):
    exercises: List[MatchingExercise]

