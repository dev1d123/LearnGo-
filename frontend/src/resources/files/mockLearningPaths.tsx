import { LearningPath, Session, Topic, FlashCardData, Question } from '@/types/LearningPath';

// ============================================
// TOPICS DATA
// ============================================

export const topicsData: Topic[] = [
  {
    id: "1",
    title: "let, const y var",
    duration: "8 min",
    theory: `# Declaración de Variables en JavaScript

JavaScript ofrece tres formas de declarar variables: **let**, **const** y **var**. Cada una tiene características específicas que las hacen apropiadas para diferentes situaciones.

## var (Legacy)
La palabra clave más antigua para declarar variables. Tiene alcance de función (function scope) y permite redeclaración.

\`\`\`javascript
var nombre = "Juan";
var nombre = "Pedro"; // ✅ Permitido
console.log(nombre); // "Pedro"
\`\`\`

**Problemas con var:**
- No tiene block scope
- Se puede redeclarar accidentalmente
- Causa confusión con el hoisting

## let (Moderno - ES6)
Introducido en ES6, tiene alcance de bloque (block scope) y no permite redeclaración.

\`\`\`javascript
let edad = 25;
edad = 26; // ✅ Permitido (reasignación)
let edad = 27; // ❌ Error: ya fue declarada
\`\`\`

**Características de let:**
- Block scope: solo existe dentro del bloque {}
- No se puede redeclarar en el mismo scope
- Se puede reasignar
- Ideal para variables que cambiarán

## const (Constante - ES6)
Similar a let, pero la variable no puede ser reasignada después de su declaración inicial.

\`\`\`javascript
const PI = 3.14159;
PI = 3.14; // ❌ Error: no se puede reasignar

const usuario = { nombre: "Ana" };
usuario.nombre = "María"; // ✅ Permitido (modificar propiedades)
usuario = {}; // ❌ Error: no se puede reasignar el objeto
\`\`\`

**Características de const:**
- Block scope
- No se puede reasignar
- **Importante:** En objetos y arrays, se pueden modificar sus propiedades/elementos
- Usar por defecto, cambiar a let solo si es necesario

## Mejores Prácticas

1. **Preferir const por defecto**: Hace el código más predecible
2. **Usar let cuando sea necesario**: Solo si la variable cambiará
3. **Evitar var**: Es legacy y puede causar bugs

\`\`\`javascript
// ✅ Buena práctica
const MAX_USERS = 100;
let contador = 0;

for (let i = 0; i < 10; i++) {
  contador += i;
}

// ❌ Mala práctica
var total = 0;
var MAX = 100; // Debería ser const
\`\`\``,
    flashcards: [
      {
        id: "1",
        question: "¿Cuál es la diferencia principal entre let y const?",
        answer: "let permite reasignación de valores, mientras que const no. Ambos tienen block scope."
      },
      {
        id: "2",
        question: "¿Por qué se recomienda evitar var?",
        answer: "var tiene function scope en lugar de block scope, permite redeclaración y puede causar bugs por hoisting."
      }
    ],
    practice: [
      {
        id: "1",
        type: "multiple-choice",
        question: "¿Cuál de las siguientes declaraciones es correcta para una constante?",
        options: ["var PI = 3.14", "let PI = 3.14", "const PI = 3.14", "PI = 3.14"],
        correctAnswer: "const PI = 3.14",
        explanation: "const es la palabra clave correcta para declarar constantes que no cambiarán."
      }
    ]
  },
  {
    id: "2",
    title: "Tipos Primitivos: Number y String",
    duration: "12 min",
    theory: `# Tipos Primitivos: Number y String

JavaScript tiene tipos de datos primitivos que son inmutables y se comparan por valor. Vamos a explorar los dos más comunes: **Number** y **String**.

## Number
JavaScript tiene un único tipo numérico que representa tanto enteros como decimales (punto flotante de 64 bits - IEEE 754).

### Números Enteros y Decimales
\`\`\`javascript
const entero = 42;
const decimal = 3.14159;
const negativo = -100;
const cientifico = 2.5e6; // 2,500,000

console.log(typeof entero); // "number"
console.log(typeof decimal); // "number"
\`\`\`

### Operaciones Matemáticas
\`\`\`javascript
const suma = 10 + 5;        // 15
const resta = 10 - 5;       // 5
const multiplicacion = 10 * 5; // 50
const division = 10 / 5;    // 2
const modulo = 10 % 3;      // 1 (resto)
const potencia = 2 ** 3;    // 8 (2^3)
\`\`\`

### Valores Especiales
\`\`\`javascript
const infinito = Infinity;
const noEsNumero = NaN; // Not a Number
const negInfinito = -Infinity;

console.log(10 / 0);        // Infinity
console.log("texto" * 5);   // NaN
console.log(isNaN(NaN));    // true
console.log(Number.isFinite(100)); // true
\`\`\`

### Métodos Útiles
\`\`\`javascript
const num = 123.456;

num.toFixed(2);          // "123.46" (redondeo)
num.toPrecision(4);      // "123.5"
parseInt("123.45");      // 123
parseFloat("123.45");    // 123.45
Math.round(num);         // 123
Math.ceil(num);          // 124
Math.floor(num);         // 123
\`\`\`

## String
Representa texto y puede ser declarado con comillas simples, dobles o backticks.

### Declaración de Strings
\`\`\`javascript
const simple = 'Hola';
const doble = "Mundo";
const template = \`Hola \${simple}\`; // Template literals

console.log(typeof simple); // "string"
\`\`\`

### Propiedades y Métodos Comunes
\`\`\`javascript
const texto = "JavaScript";

// Propiedad
console.log(texto.length); // 10

// Métodos de búsqueda
texto.charAt(0);           // "J"
texto.indexOf("Script");   // 4
texto.includes("Java");    // true
texto.startsWith("Java");  // true
texto.endsWith("Script");  // true

// Métodos de transformación
texto.toUpperCase();       // "JAVASCRIPT"
texto.toLowerCase();       // "javascript"
texto.trim();              // Elimina espacios al inicio/fin
texto.replace("Java", "Type"); // "TypeScript"

// Métodos de división y unión
texto.split("");           // ["J","a","v","a","S","c","r","i","p","t"]
texto.slice(0, 4);         // "Java"
texto.substring(4, 10);    // "Script"
\`\`\`

### Template Literals (ES6)
Permiten interpolación de variables y strings multilínea.

\`\`\`javascript
const nombre = "Ana";
const edad = 25;

// Interpolación
const mensaje = \`Hola, soy \${nombre} y tengo \${edad} años\`;

// Multilínea
const html = \`
  <div>
    <h1>\${nombre}</h1>
    <p>Edad: \${edad}</p>
  </div>
\`;

// Expresiones
const precio = 100;
console.log(\`Total con IVA: \${precio * 1.16}\`); // "Total con IVA: 116"
\`\`\`

### Concatenación
\`\`\`javascript
// Forma tradicional
const saludo1 = "Hola" + " " + "Mundo"; // "Hola Mundo"

// Forma moderna (preferida)
const saludo2 = \`Hola \${"Mundo"}\`; // "Hola Mundo"
\`\`\`

## Conversión entre Tipos

\`\`\`javascript
// String a Number
const strNum = "123";
const num1 = Number(strNum);      // 123
const num2 = parseInt(strNum);    // 123
const num3 = parseFloat("123.45"); // 123.45
const num4 = +strNum;             // 123 (conversión unaria)

// Number a String
const numero = 123;
const str1 = String(numero);      // "123"
const str2 = numero.toString();   // "123"
const str3 = \`\${numero}\`;        // "123"
\`\`\``,
    flashcards: [
      {
        id: "3",
        question: "¿Cuál es el tipo de dato de NaN?",
        answer: "Sorprendentemente, typeof NaN devuelve \"number\". NaN significa \"Not a Number\" pero es de tipo number."
      }
    ],
    practice: [
      {
        id: "2",
        type: "true-false",
        question: "JavaScript tiene tipos separados para enteros y decimales",
        correctAnswer: "false",
        explanation: "JavaScript solo tiene un tipo Number que representa tanto enteros como decimales usando IEEE 754."
      },
      {
        id: "3",
        type: "fill-blank",
        question: "JavaScript usa el estándar ________ para representar números de punto flotante.",
        correctAnswer: ["IEEE 754", "IEEE-754"],
        explanation: "JavaScript implementa el estándar IEEE 754 para números de punto flotante de 64 bits."
      }
    ]
  },
  {
    id: "3",
    title: "Boolean y valores falsy/truthy",
    duration: "10 min",
    theory: `# Boolean y Valores Falsy/Truthy

Los booleanos son fundamentales para la lógica de programación, representando verdadero (true) o falso (false). JavaScript también tiene el concepto de valores "falsy" y "truthy".

## Boolean Básico

El tipo Boolean solo tiene dos valores posibles: **true** y **false**.

\`\`\`javascript
const isActive = true;
const isCompleted = false;

console.log(typeof isActive); // "boolean"
\`\`\`

### Operadores de Comparación
Devuelven valores booleanos:

\`\`\`javascript
// Igualdad
5 == "5"   // true (conversión de tipos)
5 === "5"  // false (sin conversión - estricto)
5 != "5"   // false
5 !== "5"  // true

// Comparación
10 > 5     // true
10 < 5     // false
10 >= 10   // true
10 <= 5    // false
\`\`\`

**Recomendación:** Siempre usar **===** y **!==** (comparación estricta).

### Operadores Lógicos
Combinan expresiones booleanas:

\`\`\`javascript
const edad = 25;
const tieneLicencia = true;

// AND (&&) - Ambos deben ser true
console.log(edad >= 18 && tieneLicencia); // true

// OR (||) - Al menos uno debe ser true
console.log(edad >= 18 || tieneLicencia); // true

// NOT (!) - Invierte el valor
console.log(!tieneLicencia); // false
console.log(!!tieneLicencia); // true (doble negación para convertir a boolean)
\`\`\`

## Valores Falsy

En JavaScript, estos valores se consideran **false** en contextos booleanos:

1. **false** - El boolean falso
2. **0** - El número cero
3. **-0** - Cero negativo
4. **""** o **''** o **\`\`** - String vacío
5. **null** - Ausencia intencional de valor
6. **undefined** - Variable no definida
7. **NaN** - Not a Number

\`\`\`javascript
// Ejemplos de falsy
if (false) { /* No se ejecuta */ }
if (0) { /* No se ejecuta */ }
if ("") { /* No se ejecuta */ }
if (null) { /* No se ejecuta */ }
if (undefined) { /* No se ejecuta */ }
if (NaN) { /* No se ejecuta */ }

// Prueba de valores falsy
console.log(Boolean(false));     // false
console.log(Boolean(0));         // false
console.log(Boolean(""));        // false
console.log(Boolean(null));      // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN));       // false
\`\`\`

## Valores Truthy

**Todos los demás valores** son truthy, incluyendo:

- Números diferentes de 0 (positivos y negativos)
- Strings no vacíos (incluso **" "** con espacio)
- Arrays (incluso vacíos **[]**)
- Objetos (incluso vacíos **{}**)
- Funciones
- La palabra **"false"** (es un string, no boolean)

\`\`\`javascript
// Ejemplos de truthy
if (true) { /* Sí se ejecuta */ }
if (1) { /* Sí se ejecuta */ }
if (-1) { /* Sí se ejecuta */ }
if ("0") { /* Sí se ejecuta - string no vacío */ }
if ("false") { /* Sí se ejecuta - string no vacío */ }
if ([]) { /* Sí se ejecuta - array vacío */ }
if ({}) { /* Sí se ejecuta - objeto vacío */ }
if (function() {}) { /* Sí se ejecuta */ }

// Prueba de valores truthy
console.log(Boolean(1));         // true
console.log(Boolean("hola"));    // true
console.log(Boolean([]));        // true
console.log(Boolean({}));        // true
console.log(Boolean("false"));   // true ⚠️
\`\`\`

## Conversión a Boolean

### Función Boolean()
\`\`\`javascript
Boolean(1);          // true
Boolean(0);          // false
Boolean("texto");    // true
Boolean("");         // false
Boolean([]);         // true
Boolean(null);       // false
\`\`\`

### Doble Negación (!!)
Un truco común para convertir cualquier valor a boolean:

\`\`\`javascript
const valor = "hola";
const esBoolean = !!valor; // true

console.log(!!"");           // false
console.log(!!0);            // false
console.log(!!"texto");      // true
console.log(!!42);           // true
console.log(!!null);         // false
console.log(!!undefined);    // false
\`\`\`

## Casos Prácticos

### Valores por Defecto (Fallback)
\`\`\`javascript
// Usando OR (||) para valores por defecto
const nombre = usuarioNombre || "Invitado";
const edad = usuarioEdad || 18;

// Con nullish coalescing (??) - ES2020
// Solo considera null y undefined como falsy
const cantidad = 0 ?? 10;  // 0 (porque 0 no es null/undefined)
const cantidad2 = null ?? 10; // 10
\`\`\`

### Short-circuit Evaluation
\`\`\`javascript
// AND (&&) - Ejecuta solo si el primero es truthy
const usuario = { nombre: "Ana" };
usuario && console.log(usuario.nombre); // "Ana"

// OR (||) - Ejecuta solo si el primero es falsy
const mensaje = errorMsg || "Sin errores";
\`\`\`

### Validación de Formularios
\`\`\`javascript
function validarFormulario(nombre, email, edad) {
  // Validar que todos los campos tengan valor
  if (!nombre || !email || !edad) {
    return "Todos los campos son requeridos";
  }
  
  // Validar edad mínima
  if (edad < 18) {
    return "Debes ser mayor de edad";
  }
  
  return true; // Validación exitosa
}
\`\`\`

## Mejores Prácticas

1. **Comparación estricta**: Usar **===** en lugar de **==**
2. **Valores por defecto**: Usar **??** para null/undefined, **||** para valores falsy
3. **Conversión explícita**: Usar **Boolean()** o **!!** para claridad
4. **Validaciones claras**: Ser explícito con las condiciones

\`\`\`javascript
// ✅ Buena práctica
if (usuario !== null && usuario !== undefined) {
  console.log(usuario.nombre);
}

// ✅ Mejor con optional chaining
console.log(usuario?.nombre);

// ❌ Mala práctica (ambigua)
if (usuario) {
  console.log(usuario.nombre);
}
\`\`\``,
    flashcards: [
      {
        id: "4",
        question: "¿Qué es un valor \"falsy\" en JavaScript?",
        answer: "Son valores que se evalúan como false en contextos booleanos: false, 0, \"\", null, undefined, NaN"
      }
    ],
    practice: [
      {
        id: "4",
        type: "multiple-choice",
        question: "¿Cuál de los siguientes NO es un valor falsy?",
        options: ["0", "\"\"", "[]", "null"],
        correctAnswer: "[]",
        explanation: "Un array vacío [] es truthy. Los valores falsy son: false, 0, \"\", null, undefined, NaN."
      },
      {
        id: "5",
        type: "relationship",
        question: "Relaciona cada palabra clave con su característica:",
        pairs: [
          { left: "var", right: "Function scope y permite redeclaración" },
          { left: "let", right: "Block scope y permite reasignación" },
          { left: "const", right: "Block scope sin reasignación" },
          { left: "template literal", right: "Strings con interpolación usando ${}" }
        ],
        correctAnswer: [
          "Function scope y permite redeclaración",
          "Block scope y permite reasignación",
          "Block scope sin reasignación",
          "Strings con interpolación usando ${}"
        ]
      }
    ]
  }
];

// ============================================
// SESSIONS DATA
// ============================================

export const sessionsData: Session[] = [
  {
    id: "sess-1-1",
    name: "Variables y Tipos de Datos",
    description: "Aprende sobre declaración de variables y tipos de datos primitivos en JavaScript",
    duration: "30 min",
    topics: topicsData
  }
];

// ============================================
// LEARNING PATHS DATA
// ============================================

export const mockLearningPaths: LearningPath[] = [
  {
    id: "1",
    title: "Fundamentos de JavaScript",
    description: "Aprende los conceptos fundamentales de JavaScript desde cero",
    totalDuration: "20 horas",
    difficulty: "Principiante",
    createdAt: "2025-10-15",
    modules: [
      {
        id: "mod-1",
        name: "Módulo 1: Introducción a JavaScript",
        description: "Conceptos básicos y fundamentos del lenguaje",
        sessions: [
          {
            id: "sess-1-1",
            name: "Variables y Tipos de Datos",
            description: "Aprende sobre declaración de variables y tipos de datos primitivos",
            duration: "30 min",
            topics: topicsData // Esta sesión tiene contenido completo!
          },
          {
            id: "sess-1-2",
            name: "Configuración del entorno",
            description: "Aprende a configurar tu entorno de desarrollo",
            duration: "30 min",
            topics: []
          },
          {
            id: "sess-1-3",
            name: "Tu primer programa",
            description: "Escribe y ejecuta tu primer programa en JavaScript",
            duration: "40 min",
            topics: []
          }
        ]
      },
      {
        id: "mod-2",
        name: "Módulo 2: Funciones y Scope",
        description: "Aprende a trabajar con funciones y alcance de variables",
        sessions: [
          {
            id: "sess-2-1",
            name: "Declaración de funciones",
            description: "Funciones tradicionales vs arrow functions",
            duration: "50 min",
            topics: []
          },
          {
            id: "sess-2-2",
            name: "Parámetros y retorno",
            description: "Trabajando con parámetros y valores de retorno",
            duration: "55 min",
            topics: []
          },
          {
            id: "sess-2-3",
            name: "Scope y Closures",
            description: "Estructuras de datos fundamentales",
            duration: "60 min",
            topics: []
          }
        ]
      },
      {
        id: "mod-3",
        name: "Módulo 3: Control de Flujo",
        description: "Estructuras condicionales y bucles",
        sessions: [
          {
            id: "sess-3-1",
            name: "Condicionales (if, else, switch)",
            description: "Toma decisiones en tu código",
            duration: "45 min",
            topics: []
          },
          {
            id: "sess-3-2",
            name: "Bucles (for, while, do-while)",
            description: "Repite acciones de manera eficiente",
            duration: "50 min",
            topics: []
          }
        ]
      }
    ]
  }
];

// Helper function to get a learning path by ID
export function getLearningPathById(id: string): LearningPath | undefined {
  return mockLearningPaths.find(path => path.id === id);
}

// Helper function to get a session by ID (searches through all learning paths)
export function getSessionById(sessionId: string): Session | undefined {
  for (const path of mockLearningPaths) {
    for (const module of path.modules) {
      const session = module.sessions.find(s => s.id === sessionId);
      if (session) return session;
    }
  }
  return undefined;
}
