from pydantic import BaseModel, Field
from typing import List, Union

class Word(BaseModel):
    word: str
    clue: str

class WordSearch(BaseModel):
    title: str = Field(description="The title of the word search puzzle.")
    words: List[str] = Field(description="A list of words to find in the puzzle.")
    category: str = Field(description="The category of the words.")

class Crossword(BaseModel):
    title: str = Field(description="The title of the crossword puzzle.")
    words: List[Word] = Field(description="A list of words with their clues and IDs.")
    category: str = Field(description="The category of the words.")

