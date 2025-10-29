from fastapi import APIRouter, File, UploadFile, Form
from typing import List
from app.services.learning_path_service import generate_learning_path
from app.infrastructure.files.file_manager import extract_file_contents

router = APIRouter(prefix="/learning-path", tags=["Learning Path"])

@router.post("/generate", response_model=dict)
async def generate_learning_path_endpoint(
    files: List[UploadFile] = File(..., description="PDF or DOCX files"),
    difficulty: str = Form("intermediate"),
    total_duration: str = Form("4 weeks"),
    modules_count: int = Form(2, ge=1, le=10),
    sessions_per_module: int = Form(2, ge=1, le=8),
    topics_per_session: int = Form(2, ge=1, le=5),
    flashcards_per_topic: int = Form(3, ge=2, le=10),
    questions_per_topic: int = Form(3, ge=2, le=10),
    include_theory: bool = Form(True),
    language: str = Form("Spanish"),
    # Nuevos parámetros
    auto_structure: bool = Form(False, description="Let AI decide optimal structure"),
    learning_approach: str = Form("balanced", description="theoretical/practical/balanced/project-based/fast"),
    language_register: str = Form("neutral", description="formal/neutral/informal/technical/beginner/advanced"),
    detail_level: str = Form("intermediate", description="basic/intermediate/advanced/expert/master"),
    generate_full_content: bool = Form(False, description="Generate complete content for all sessions")
):
    """Generate learning path from files with advanced customization options"""
    
    try:
        # Extract content (same as Summarizer)
        data = await extract_file_contents(files)
        joined_content = "\n\n".join("\n\n".join(page for page in file_content) for file_content in data)
        
        # Generate learning path
        learning_path = await generate_learning_path(
            content=joined_content,
            difficulty=difficulty,
            total_duration=total_duration,
            modules_count=modules_count,
            sessions_per_module=sessions_per_module,
            topics_per_session=topics_per_session,
            flashcards_per_topic=flashcards_per_topic,
            questions_per_topic=questions_per_topic,
            include_theory=include_theory,
            language=language,
            auto_structure=auto_structure,
            learning_approach=learning_approach,
            language_register=language_register,
            detail_level=detail_level,
            generate_full_content=generate_full_content
        )
        
        if "error" in learning_path:
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail=learning_path["error"])
        
        return {"learning_path": learning_path}
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "learning-path"}
