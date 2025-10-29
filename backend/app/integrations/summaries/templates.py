from langchain_core.prompts import PromptTemplate

def summarize_template():
    return PromptTemplate.from_template("""
    You are an expert AI assistant specialized in summarizing documents.
    Given the following document content, your task is to generate summary that captures the main points and key information.
    The summary should be written in {language} with a {language_register} tone and a {character} style.
    The summary should be of {extension} length.
    ️### ADDITIONAL INSTRUCTIONS:
    - If {include_references} is true, include a list of references used in the summary.
    - If {include_examples} is true, provide relevant examples to illustrate key points.
    - If {include_conclusions} is true, add a conclusion section summarizing the overall insights.
    Content:
    {content}
    """)
