from fastapi import APIRouter
from pydantic import BaseModel
from app.domain.models import RoadmapOptions
from app.services.roadmap_service import generate_roadmap

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

class RoadmapRequest(BaseModel):
    topic: str
    complexity_level: str
    duration: str
    include_resources: bool

@router.post("/", response_model=dict)
async def create_roadmap(request: RoadmapRequest):
    options = RoadmapOptions(
        topic=request.topic,
        complexity_level=request.complexity_level,
        duration=request.duration,
        include_resources=request.include_resources
    )
    roadmap = await generate_roadmap(options)
    return {"roadmap": roadmap}
