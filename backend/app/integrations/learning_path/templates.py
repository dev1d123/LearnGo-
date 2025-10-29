from langchain_core.prompts import PromptTemplate

def learning_path_generation_template():
    return PromptTemplate.from_template("""
    You are an expert educational content creator. Create a complete structured learning path from the document content.
    
    CONFIGURATION:
    - Language: {language}
    - Difficulty: {difficulty}
    - Learning Approach: {learning_approach} (theoretical/practical/balanced/project-based/fast)
    - Language Register: {language_register} (formal/neutral/informal/technical/beginner/advanced)
    - Detail Level: {detail_level} (basic/intermediate/advanced/expert/master)
    - Auto Structure: {auto_structure}
    - Generate Full Content: {generate_full_content}
    
    STRUCTURE REQUIREMENTS:
    {structure_instructions}
    
    CONTENT GENERATION:
    {content_instructions}
    
    OUTPUT FORMAT:
    {output_format}
    
    LEARNING APPROACH GUIDELINES:
    - theoretical: Focus on concepts, definitions, and explanations
    - practical: Focus on exercises, examples, and hands-on activities
    - balanced: Mix theory and practice equally
    - project-based: Organize around building real projects
    - fast: Essential concepts only, minimal examples
    
    LANGUAGE REGISTER:
    - formal: Academic and professional tone
    - neutral: Clear and balanced
    - informal: Conversational and friendly
    - technical: Specialized terminology
    - beginner: Simple explanations, avoid jargon
    - advanced: Concise, assumes background knowledge
    
    CRITICAL JSON FORMATTING RULES:
    1. The "modules_json" field MUST be a VALID JSON array
    2. ALL string values MUST escape special characters:
       - Use \\n for newlines (not actual line breaks)
       - Use \\" for quotes inside strings
       - Use \\\\ for backslashes
    3. Do NOT include actual line breaks inside string values
    4. Do NOT use single quotes - only double quotes
    
    EXACT structure required:
    [
      {{
        "title": "Module Title",
        "description": "Brief overview in a single line",
        "estimatedDuration": "2 hours",
        "sessions": [
          {{
            "title": "Session Title",
            "description": "Brief overview in a single line",
            "estimatedDuration": "30 min",
            "topics": [
              {{
                "title": "Topic Title",
                "content": "{content_field}"
              }}
            ],
            "flashcards": [
              {{"question": "Question about ANY topic in this session?", "answer": "Answer without newlines"}}
            ],
            "practice": [
              {{"question": "Question about ANY topic in this session?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 0}}
            ]
          }}
        ]
      }}
    ]
    
    IMPORTANT NOTES:
    - Topics: Only contain title and content (theory with optional code examples)
    - Flashcards & Practice: Are at SESSION level, covering ALL topics in that session
    - Content can include code blocks using: ```language\\ncode\\n```
    - Code in topics is OPTIONAL, only include if relevant to the subject
    
    CONTENT FIELD FORMAT:
    - If brief content: "Brief description in one line"
    - If full content: "Paragraph 1.\\n\\nParagraph 2.\\n\\nCode: ```python\\ncode here\\n```"
    - ALWAYS use \\n for line breaks, NEVER actual newlines
    
    Content to analyze:
    {content}
    """)
    
def get_structure_instructions(auto_structure: bool, modules_count: int, sessions_per_module: int, 
                                topics_per_session: int, flashcards_per_topic: int, questions_per_topic: int):
    """Generate structure instructions based on auto mode"""
    if auto_structure:
        return """
        ANALYZE the content and DECIDE the optimal structure:
        - Number of modules (1-5): Based on major topics
        - Sessions per module (1-10): Based on subtopic complexity
        - Topics per session (1-5): Based on concept grouping
        - Flashcards per topic (2-10): Based on key concepts
        - Practice questions per topic (2-10): Based on learning objectives
        
        Your goal: Create the MOST EFFECTIVE structure for learning this content.
        """
    else:
        return f"""
        Generate EXACTLY:
        - {modules_count} modules
        - {sessions_per_module} sessions per module
        - {topics_per_session} topics per session
        - {flashcards_per_topic} flashcards per topic
        - {questions_per_topic} practice questions per topic
        """

def get_content_instructions(generate_full_content: bool, learning_approach: str, detail_level: str):
    """Generate content instructions based on full content mode"""
    if generate_full_content:
        return f"""
        GENERATE COMPLETE CONTENT for each topic including:
        1. Detailed theoretical explanation (adapt to {learning_approach} approach)
        2. Code examples with comments (OPTIONAL - only if relevant to the subject)
        3. Step-by-step breakdowns
        4. Common pitfalls and best practices
        5. Real-world applications
        
        Content depth: {detail_level}
        - basic: High-level overview, simple examples
        - intermediate: Balanced depth, practical examples
        - advanced: In-depth analysis, complex scenarios
        - expert: Comprehensive coverage, edge cases
        - master: Research-level depth, cutting-edge topics
        
        CRITICAL FOR CONTENT FIELD:
        - Use \\n for line breaks (NOT actual newlines)
        - Escape all quotes: use \\" inside strings
        - Format code blocks as: ```language\\ncode\\n``` (ONLY if code is relevant)
        - Keep content as a SINGLE JSON string value
        
        Example valid content WITH code:
        "El método de Newton-Raphson es un algoritmo iterativo.\\n\\nFórmula:\\n```python\\nx_new = x - f(x)/f'(x)\\n```\\n\\nSe utiliza para encontrar raíces de ecuaciones."
        
        Example valid content WITHOUT code (for non-programming topics):
        "La Revolución Industrial transformó la sociedad.\\n\\nCaracterísticas principales:\\n1. Mecanización de procesos\\n2. Urbanización\\n3. Cambios sociales"
        
        FLASHCARDS & PRACTICE at SESSION level:
        - Generate {detail_level} flashcards covering ALL topics in the session
        - Generate {detail_level} practice questions covering ALL topics in the session
        - Questions should test understanding of the entire session content
        """
    else:
        return """
        Generate ESSENTIAL content only:
        - Topic title and brief description (single line, no special characters)
        - Key concepts list
        - Estimated duration
        - Code is OPTIONAL, only include if relevant
        
        FLASHCARDS & PRACTICE at SESSION level:
        - Generate flashcards covering ALL topics in the session
        - Generate practice questions covering ALL topics in the session
        
        Full content can be generated later per session.
        """


