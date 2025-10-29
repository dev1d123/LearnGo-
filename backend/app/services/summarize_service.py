from app.integrations.summaries.client import SummarizeAIClient
from app.domain.models import SummaryOptions

ai_client = SummarizeAIClient()

async def summarize_content(content: str, options: SummaryOptions):
    return await ai_client.summarize_text(content, options)