from langchain_core.prompts import PromptTemplate

def flashcards_template():
    return PromptTemplate.from_template("""
    You are an expert educator and instructional designer.
    Your task is to generate {flashcards_count} high-quality flashcards from a given document, text or topic.The difficulty level of the flashcards is {difficulty_level}.
    The flashcards should focus on {focus_area}.

    This is the document content or topic:
    {content}
    """)
