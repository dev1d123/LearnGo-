from langchain_core.prompts import PromptTemplate

    # - multiple_choice
    # - fill_in_the_blank
    # - true_false
    # - short_answer
    # - matching

def multiple_choice_exercises_template():
    return PromptTemplate.from_template("""
    You are an expert educational assistant. 
    Given a document content or topic, your task is to create well-structured exercises to help students learn the material.

    ### INSTRUCTIONS:
    - Read the provided topic or document content carefully.
    - Generate {exercises_count} exercises related to the main ideas.
    - You only must to generate multiple choice exercises.
    - Assign a difficulty level {exercises_difficulty}.
    - For each exercise, provide:
        - A clear question.
        - If applicable, 3-5 answer choices (mark which one is correct).
        - The correct answer text.
        - A brief explanation for why that answer is correct.
        - If possible, the learning objective (what concept the question tests).

    This is the document content:
    {content}
    """)

def fill_in_the_blank_exercises_template():
    return PromptTemplate.from_template("""
    You are an expert educational assistant. 
    Given a document content or topic, your task is to create well-structured exercises to help students learn the material.

    ### INSTRUCTIONS:
    - Read the provided topic or document content carefully.
    - Generate {exercises_count} exercises related to the main ideas.
    - You only must to generate fill in the blank exercises.
    - Assign a difficulty level {exercises_difficulty}.
    - For each exercise, provide:
        - A clear question with a blank space.
        - The correct answer text.
        - A brief explanation for why that answer is correct.
    This is the document content:
    {content}
    """)

def true_false_exercises_template():
    return PromptTemplate.from_template("""
    You are an expert educational assistant. 
    Given a document content or topic, your task is to create well-structured exercises to help students learn the material.

    ### INSTRUCTIONS:
    - Read the provided topic or document content carefully.
    - Generate {exercises_count} exercises related to the main ideas.
    - You only must to generate true/false exercises.
    - Assign a difficulty level {exercises_difficulty}.
    - For each exercise, provide:
        - A clear statement.
        - Indicate if it's True or False.
        - A brief explanation for why that answer is correct.
    This is the document content:
    {content}
    """)

def short_answer_exercises_template():
    return PromptTemplate.from_template("""
    You are an expert educational assistant. 
    Given a document content or topic, your task is to create well-structured exercises to help students learn the material.

    ### INSTRUCTIONS:
    - Read the provided topic or document content carefully.
    - Generate {exercises_count} exercises related to the main ideas.
    - You only must to generate short answer exercises.
    - Assign a difficulty level {exercises_difficulty}.
    - For each exercise, provide:
        - A clear question.
        - The correct answer text.
        - A brief explanation for why that answer is correct.
    This is the document content:
    {content}
    """)

def matching_exercises_template():
    return PromptTemplate.from_template("""
    You are an expert educational assistant. 
    Given a document content or topic, your task is to create well-structured exercises to help students learn the material.

    ### INSTRUCTIONS:
    - Read the provided topic or document content carefully.
    - Generate {exercises_count} exercises related to the main ideas.
    - You only must to generate matching exercises.
    - Assign a difficulty level {exercises_difficulty}.
    - For each exercise, provide:
        - A list of items in Column A.
        - A list of items in Column B.
        - The correct matches between Column A and Column B.
        - A brief explanation for why those matches are correct.
    This is the document content:
    {content}
    """)    