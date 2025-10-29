from app.core.settings import get_settings 
from langchain_google_genai import ChatGoogleGenerativeAI

settings = get_settings()

class AIClient:
    def __init__(self):
        self.model_name = settings.GEMINI_MODEL
        self.api_key = settings.GEMINI_API_KEY
        self.max_retries = 7

        self.model = ChatGoogleGenerativeAI(
            model=self.model_name,
            api_key=self.api_key,
            max_retries=self.max_retries
        )

    def new_model(self):
        return ChatGoogleGenerativeAI(
            model=self.model_name,
            api_key=self.api_key,
            max_retries=self.max_retries
        )
