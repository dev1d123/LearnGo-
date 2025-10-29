export interface SummaryPromptOptions {
  character?: string;
  languaje_register?: string; // Note: 'languaje' as provided by the API
  language?: string;
  extension?: string;
  include_references?: boolean;
  include_examples?: boolean;
  include_conclusions?: boolean;
}

export interface SummaryPromptRequest extends SummaryPromptOptions {
  files: File[] | FileList;
}

// Replace the previous unknown response type with a structured type
export interface SummaryPayload {
  summary: string;
  references: string[]; // can adjust to unknown[] if API returns mixed types
  examples: string[];   // can adjust to unknown[] if API returns mixed types
  conclusions: string;
}

export interface SummaryResponse {
  summary: SummaryPayload;
}
