from app.integrations.roadmap.client import RoadmapAIClient
from app.domain.models import RoadmapOptions

ai_client = RoadmapAIClient()

async def generate_roadmap(options: RoadmapOptions) -> str:
    return await ai_client.generate_roadmap(options)