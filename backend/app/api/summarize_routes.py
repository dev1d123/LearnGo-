from fastapi import APIRouter, File, UploadFile, Form
from typing import List
from pydantic import BaseModel
from app.services.summarize_service import summarize_content
from app.infrastructure.files.file_manager import extract_file_contents
from app.domain.models import SummaryOptions

router = APIRouter(prefix="/summarize", tags=["Summaries"])

@router.post("/", response_model=dict)
async def summarize(
    files: List[UploadFile] = File(..., description="PDFs to be summarized"),
    character: str = Form("review"),
    language_register: str = Form("formal"),
    language: str = Form("English"),
    extension: str = Form("medium"),
    include_references: bool = Form(False),
    include_examples: bool = Form(False),
    include_conclusions: bool = Form(False)
):
    options = SummaryOptions(
        character=character,
        language_register=language_register,
        language=language,
        extension=extension,
        include_references=include_references,
        include_examples=include_examples,
        include_conclusions=include_conclusions
    )

    # Content extraction
    data = await extract_file_contents(files)    
    joined_content = "\n\n".join("\n\n".join(page for page in file_content) for file_content in data)

    # Summary generation
    summary = await summarize_content(joined_content, options)
    return {"summary": summary}
