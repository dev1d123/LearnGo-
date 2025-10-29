from app.integrations.learning_path.templates import (
    learning_path_generation_template,
    get_structure_instructions,
    get_content_instructions
)
from app.integrations.learning_path.structures import LearningPathOutput
from app.integrations.ai_client import AIClient
from datetime import datetime
import uuid

class LearningPathAIClient(AIClient):
    """AI Client for learning paths - exactly like SummarizeAIClient"""
    
    async def generate_learning_path(
        self,
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
        """Generate learning path with advanced customization"""
        
        # Get dynamic instructions
        structure_instr = get_structure_instructions(
            auto_structure, modules_count, sessions_per_module,
            topics_per_session, flashcards_per_topic, questions_per_topic
        )
        content_instr = get_content_instructions(generate_full_content, learning_approach, detail_level)
        
        instructions = learning_path_generation_template()
        
        # Determine output format based on mode
        if generate_full_content:
            output_format_text = """Respond with a JSON object: {"title": "...", "description": "...", "modules": [...]}"""
        else:
            output_format_text = """Respond with: {"title": "...", "description": "...", "modules_json": "[...]"}"""
        
        # Create a model per request with JSON mode for full content generation
        # When generating full content, use JSON mode instead of structured output
        # to avoid escaping issues with complex content
        from langchain_google_genai import ChatGoogleGenerativeAI
        
        if generate_full_content:
            # Use JSON mode for full content - directly request JSON without structured output
            model = ChatGoogleGenerativeAI(
                model=self.model_name,
                api_key=self.api_key,
                max_retries=self.max_retries,
                response_mime_type="application/json"  # Force valid JSON output
            )
            
            # Use the model directly (no structured output)
            chain = instructions | model
            
            response = await chain.ainvoke({
                "content": content,
                "difficulty": difficulty,
                "modules_count": modules_count,
                "sessions_per_module": sessions_per_module,
                "topics_per_session": topics_per_session,
                "flashcards_per_topic": flashcards_per_topic,
                "questions_per_topic": questions_per_topic,
                "language": language,
                "auto_structure": "YES - Analyze and decide optimal structure" if auto_structure else "NO - Use specified counts",
                "learning_approach": learning_approach,
                "language_register": language_register,
                "detail_level": detail_level,
                "generate_full_content": "YES - Generate complete content" if generate_full_content else "NO - Generate structure only",
                "structure_instructions": structure_instr,
                "content_instructions": content_instr,
                "content_field": "Complete detailed content with examples and explanations",
                "output_format": output_format_text
            })
            
            # Parse the JSON response manually
            import json
            try:
                result_dict = json.loads(response.content)
                # Create a mock result object with the expected structure
                class MockResult:
                    def __init__(self, data):
                        self.title = data.get("title", "Learning Path")
                        self.description = data.get("description", "")
                        self.modules_json = json.dumps(data.get("modules", []))
                
                result = MockResult(result_dict)
            except Exception as e:
                print(f"[ERROR] Failed to parse JSON mode response: {e}")
                return {"error": f"Failed to parse response: {e}"}
                
        else:
            # Use standard structured output for structure-only (faster)
            model = self.new_model()
            structured_llm = model.with_structured_output(LearningPathOutput)
            chain = instructions | structured_llm
            
            result = await chain.ainvoke({
                "content": content,
                "difficulty": difficulty,
                "modules_count": modules_count,
                "sessions_per_module": sessions_per_module,
                "topics_per_session": topics_per_session,
                "flashcards_per_topic": flashcards_per_topic,
                "questions_per_topic": questions_per_topic,
                "language": language,
                "auto_structure": "YES - Analyze and decide optimal structure" if auto_structure else "NO - Use specified counts",
                "learning_approach": learning_approach,
                "language_register": language_register,
                "detail_level": detail_level,
                "generate_full_content": "NO - Generate structure only",
                "structure_instructions": structure_instr,
                "content_instructions": content_instr,
                "content_field": "Brief description",
                "output_format": output_format_text
            })
        
        if not result:
            return {"error": "No learning path could be generated."}
        
        try:
            # Parse JSON and add IDs
            import json
            import re
            
            modules_json = result.modules_json if result.modules_json else "[]"
            
            # Clean JSON string before parsing (common AI mistakes)
            def clean_json(json_str: str) -> str:
                """Clean and fix common JSON formatting issues from AI output"""
                # Remove any markdown code blocks
                json_str = re.sub(r'```json\s*', '', json_str)
                json_str = re.sub(r'```\s*$', '', json_str)
                
                # Remove any leading/trailing whitespace
                json_str = json_str.strip()
                
                # Fix unescaped quotes in string values using a more sophisticated approach
                # This regex finds "key": "value" pairs and escapes quotes inside the value
                def fix_value_quotes(match):
                    key = match.group(1)
                    value = match.group(2)
                    # Escape unescaped quotes in the value
                    # But be careful not to double-escape already escaped quotes
                    value = value.replace('\\"', '___ALREADY_ESCAPED___')
                    value = value.replace('"', '\\"')
                    value = value.replace('___ALREADY_ESCAPED___', '\\"')
                    return f'"{key}": "{value}"'
                
                # Pattern to match "key": "value" where value might contain unescaped quotes
                # This is a simplified approach - match field: string pairs
                pattern = r'"(content|question|answer|title|description)"\s*:\s*"((?:[^"\\]|\\.)*)(?<!\\)"'
                
                try:
                    # Try to fix quote issues in content fields
                    json_str = re.sub(pattern, fix_value_quotes, json_str)
                except:
                    pass  # If regex fails, continue with original
                
                return json_str
            
            # Clean the JSON first
            modules_json = clean_json(modules_json)
            
            # Parse with fallback
            try:
                decoder = json.JSONDecoder()
                modules, _ = decoder.raw_decode(modules_json)
            except json.JSONDecodeError as e:
                print(f"[WARNING] JSONDecoder failed: {e}")
                print(f"[DEBUG] First 500 chars of JSON: {modules_json[:500]}")
                print(f"[DEBUG] Problem area: {modules_json[max(0, e.pos-100):e.pos+100]}")
                
                # Try standard json.loads
                try:
                    modules = json.loads(modules_json)
                except json.JSONDecodeError as e2:
                    print(f"[ERROR] json.loads also failed: {e2}")
                    # Last resort: try to extract array from the string
                    match = re.search(r'\[.*\]', modules_json, re.DOTALL)
                    if match:
                        modules = json.loads(match.group(0))
                    else:
                        raise
            
            # Ensure it's a list
            modules = modules if isinstance(modules, list) else []
            
            # Add IDs and format for frontend
            return self._format_output({
                "title": result.title,
                "description": result.description,
                "modules": modules
            }, total_duration, difficulty)
        except Exception as e:
            import traceback
            print(f"[ERROR] Failed to format learning path: {e}")
            traceback.print_exc()
            return {"error": f"Failed to format learning path: {str(e)}"}
    
    def _format_output(self, data: dict, total_duration: str, difficulty: str) -> dict:
        """Add IDs and metadata to the output"""
        
        learning_path_id = str(uuid.uuid4())
        modules = data.get("modules", [])
        
        # Add IDs to all nested structures
        for module_idx, module in enumerate(modules):
            if not isinstance(module, dict):
                continue
                
            module["id"] = f"module_{module_idx + 1}"
            
            for session_idx, session in enumerate(module.get("sessions", [])):
                if not isinstance(session, dict):
                    continue
                    
                session["id"] = f"{module['id']}_session_{session_idx + 1}"
                
                # Add IDs to topics (topics only have title and content now)
                for topic_idx, topic in enumerate(session.get("topics", [])):
                    if not isinstance(topic, dict):
                        continue
                        
                    topic["id"] = f"{session['id']}_topic_{topic_idx + 1}"
                
                # Add IDs to flashcards (at session level)
                for fc_idx, flashcard in enumerate(session.get("flashcards", [])):
                    if isinstance(flashcard, dict):
                        flashcard["id"] = f"{session['id']}_flashcard_{fc_idx + 1}"
                
                # Add IDs to practice questions (at session level)
                for q_idx, question in enumerate(session.get("practice", [])):
                    if isinstance(question, dict):
                        question["id"] = f"{session['id']}_question_{q_idx + 1}"
        
        return {
            "id": learning_path_id,
            "title": data.get("title", "Learning Path"),
            "description": data.get("description", ""),
            "totalDuration": total_duration,
            "difficulty": difficulty,
            "createdAt": datetime.utcnow().isoformat() + "Z",
            "modules": modules
        }


