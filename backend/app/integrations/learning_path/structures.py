from typing import Optional
from pydantic import BaseModel, Field

class LearningPathOutput(BaseModel):
    """Learning Path output - simple structure like Summarizer"""
    title: str = Field(description="Title of the learning path")
    description: str = Field(description="Brief overview")
    modules_json: str = Field(description="Complete modules structure as JSON string")

