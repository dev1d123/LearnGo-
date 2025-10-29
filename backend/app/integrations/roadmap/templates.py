from langchain_core.prompts import PromptTemplate

def roadmap_template():
    return PromptTemplate.from_template("""
    You are an expert AI assistant specialized in creating detailed roadmaps for topics.
    Your task is to generate a comprehensive roadmap based on the provided topic and objective goals.
    The roadmap should be structured with clear milestones, timelines, and key deliverables.
    The roadmap should cover a duration of {duration}.

    ### ADDITIONAL INSTRUCTIONS:
    - If {include_resources} is true, provide a list of helper resources and tools.

    Topic:
    {topic}

    """)