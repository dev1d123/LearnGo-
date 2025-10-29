export interface SummaryRecord {
    id: string;           // identifier
    title: string;      // Title
    date: string;         // ISO date
    files: {
      name: string;
      type: string;
      size: number;
    }[];                  // Files adjunted
    response: string;     // Final edited response
}
  