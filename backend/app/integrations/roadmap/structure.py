from typing import Optional
from pydantic import BaseModel, Field

class Roadmap(BaseModel):
    title: str = Field(description="The title of the roadmap")
    description: Optional[str] = Field(description="A brief description of the roadmap")
    steps: list[str] = Field(description="A list of steps in the roadmap")
    estimated_time: Optional[str] = Field(description="Estimated time to complete the roadmap")
    resources: Optional[list[str]] = Field(description="A list of helper resources and tools")