from app.integrations.learning_path.client import LearningPathAIClient

ai_client = LearningPathAIClient()

async def generate_learning_path(
    content: str,
    difficulty: str,
    total_duration: str,
    modules_count: int,
    sessions_per_module: int,
    topics_per_session: int,
    flashcards_per_topic: int,
    questions_per_topic: int,
    include_theory: bool,
    language: str,
    auto_structure: bool = False,
    learning_approach: str = "balanced",
    language_register: str = "neutral",
    detail_level: str = "intermediate",
    generate_full_content: bool = False
) -> dict:
    """Generate a complete learning path from document content using AI"""
    return await ai_client.generate_learning_path(
        content=content,
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
