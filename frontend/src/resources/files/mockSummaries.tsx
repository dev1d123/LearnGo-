import { SummaryRecord } from '../../types/SummaryRecord';

export const mockSummaries: SummaryRecord[] = [
  {
    id: 'summary_001',
    title: 'Resumen de Biología - Fotosíntesis',
    date: '2025-10-20T14:32:00.000Z',
    files: [
      { name: 'biologia.pdf', type: 'application/pdf', size: 204800 },
    ],
    response: `
# 🌿 Resumen: La Fotosíntesis

La **fotosíntesis** es el proceso mediante el cual las plantas, algas y algunas bacterias **transforman la energía solar en energía química**.

## Etapas principales
1. **Fase luminosa**: ocurre en los tilacoides, donde la luz se convierte en energía (ATP y NADPH).  
2. **Fase oscura (Ciclo de Calvin)**: el dióxido de carbono se transforma en glucosa utilizando la energía generada antes.

> En resumen, las plantas convierten luz y CO₂ en alimento, liberando oxígeno al ambiente.
    `.trim(),
  },
  {
    id: 'summary_002',
    title: 'Resumen de Química - Teoría Atómica Moderna',
    date: '2025-10-21T09:15:00.000Z',
    files: [],
    response: `
# ⚛️ Resumen: La Teoría Atómica Moderna

La **teoría atómica moderna** propone que la materia está compuesta por átomos que contienen **protones, neutrones y electrones**.

## Modelos relevantes
- **Bohr (1913)**: los electrones giran en órbitas específicas.  
- **Modelo cuántico (Schrödinger)**: los electrones se comportan como ondas y partículas.

> La mecánica cuántica describe con precisión el comportamiento de los electrones dentro del átomo.
    `.trim(),
  },
  {
    id: 'summary_003',
    title: 'Resumen de Historia - La Revolución Francesa',
    date: '2025-10-21T18:45:00.000Z',
    files: [
      { name: 'revolucion_francesa.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 51200 },
    ],
    response: `
# 🇫🇷 Resumen: La Revolución Francesa

La **Revolución Francesa (1789–1799)** transformó radicalmente la estructura política y social de Francia.

## Causas principales
- Crisis económica y desigualdad social.  
- Ideas ilustradas sobre libertad e igualdad.  
- Débil liderazgo del rey Luis XVI.

## Consecuencias
- Fin de la monarquía absoluta.  
- Surgimiento de la república y los derechos ciudadanos.  
- Influencia en movimientos democráticos posteriores.

> “Libertad, igualdad, fraternidad” fue más que un lema: fue una revolución global.
    `.trim(),
  },
  {
    id: 'summary_004',
    title: 'Resumen de Tecnología - Aprendizaje Automático',
    date: '2025-10-22T10:00:00.000Z',
    files: [],
    response: `
# 🧠 Resumen: Aprendizaje Automático (Machine Learning)

El **aprendizaje automático** permite que las máquinas **mejoren su rendimiento** a partir de los datos sin ser programadas explícitamente.

## Tipos de aprendizaje
- **Supervisado:** el modelo aprende de ejemplos etiquetados.  
- **No supervisado:** busca patrones en datos sin etiquetas.  
- **Por refuerzo:** aprende mediante prueba y error con recompensas.

\`\`\`python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)
\`\`\`

> Machine Learning es la base de muchas aplicaciones modernas de IA.
    `.trim(),
  },
  {
    id: 'summary_005',
    title: 'Resumen de Literatura - Poesía Contemporánea',
    date: '2025-10-22T14:10:00.000Z',
    files: [
      { name: 'poesia_contemporanea.txt', type: 'text/plain', size: 10240 },
    ],
    response: `
# ✍️ Resumen: Poesía Contemporánea

La **poesía contemporánea** se caracteriza por la libertad expresiva, la experimentación formal y la mezcla de géneros.

## Rasgos principales
- Ruptura con la métrica tradicional.  
- Tono íntimo, urbano y emocional.  
- Uso del lenguaje cotidiano.

> “Escribo para no olvidar lo que el silencio calla.” — Fragmento anónimo.
    `.trim(),
  },
];