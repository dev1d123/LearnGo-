export interface SummaryRecord {
    id: string;           // ID único
    title: string;      // Título del resumen
    date: string;         // Fecha ISO
    files: {
      name: string;
      type: string;
      size: number;
    }[];                  // Archivos adjuntos
    response: string;     // Resumen final editable
}
  