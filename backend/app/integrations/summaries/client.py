from app.domain.models import SummaryOptions
from app.integrations.summaries.templates import summarize_template
from app.integrations.summaries.structures import Summary
from app.integrations.ai_client import AIClient

class SummarizeAIClient(AIClient):
    async def summarize_text(self, content: str, options: SummaryOptions) -> dict:
        instructions = summarize_template()

        # Create a model per request (no global model that open and close (that cause the vercel error))
        model = self.new_model()

        structured_llm = model.with_structured_output(Summary)
        chain = instructions | structured_llm
        result = await chain.ainvoke({
            "content": content,
            "character": options.character,
            "language_register": options.language_register,
            "language": options.language,
            "extension": options.extension,
            "include_references": options.include_references,
            "include_examples": options.include_examples,
            "include_conclusions": options.include_conclusions
        })

        if not result:
            return {"error": "No summary could be generated."}
        return result.model_dump()
