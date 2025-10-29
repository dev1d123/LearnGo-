from typing import Optional
from pydantic import BaseModel, Field

class Summary(BaseModel):
    summary: str = Field(description="The text summary")
    references: Optional[list[str]] = Field(description="The list of refferences")
    examples: Optional[list[str]] = Field(description="The list of examples")
    conclusions: Optional[str] = Field(description="The summary conclusions")
