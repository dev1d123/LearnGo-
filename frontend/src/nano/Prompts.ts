import { PropType } from "@/nano/gobal";

export function getPromptByType(type: PropType, content: string): string {
   switch (type.name) {
      case 'summarize':
         return `Summarize the following content: ${content}`;
      case 'generate-exercises':
         return `Generate exercises based on the following content: ${content}.
          Return ONLY valid JSON in the following format:
          
          
          Do not include any text outside the JSON.`;


      case 'generate-exercises-by-topic':
         return `Generate exercises based on the following topic: ${content}`;
      case 'flashcards':
         return `Create flashcards based on the following content: ${content}`;
      case 'flashcards-by-topic':
         return `Create flashcards based on the following topic: ${content}`;
      case 'roadmap':
         return `Create a roadmap based on the following content: ${content}`;
      case 'games':
         return `Create a game based on the following content: ${content}`;
      default:
         return "Unknown prompt type.";
   }
}
