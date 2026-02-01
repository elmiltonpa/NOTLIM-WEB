# NOTLIM-WEB Backend

> **El corazón del intérprete: Análisis léxico, sintáctico y evaluación semántica**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-ES2022-339933?logo=nodedotjs)](https://nodejs.org/)

---

## Descripción General

Este backend contiene la implementación completa de un **intérprete de lenguaje de programación** expuesto a través de una API REST. El intérprete procesa código fuente del lenguaje NOTLIM y devuelve los resultados de la ejecución.

Todo el pipeline de compilación está implementado **desde cero**, sin utilizar herramientas de generación automática como Lex/Yacc o ANTLR.

---

## Arquitectura del Intérprete

```
Código Fuente (string)
        │
        ↓
┌───────────────────────────────────────┐
│     1. ANALIZADOR LÉXICO (Scanner)    │
│  ┌─────────────────────────────────┐  │
│  │  Autómatas Finitos Deterministas│  │
│  │  • es_id()        → Identificadores
│  │  • es_constante_real() → Números│  │
│  │  • es_cadena()    → Strings     │  │
│  │  • es_simbolo_especial() → Ops  │  │
│  └─────────────────────────────────┘  │
│            ↓ Array de Tokens          │
└───────────────────────────────────────┘
        │
        ↓
┌───────────────────────────────────────┐
│   2. ANALIZADOR SINTÁCTICO (Parser)   │
│  ┌─────────────────────────────────┐  │
│  │  Parser LL(1) Predictivo        │  │
│  │  • Tabla de Análisis (TAS)      │  │
│  │  • Pila de símbolos             │  │
│  │  • Gramática libre de contexto  │  │
│  └─────────────────────────────────┘  │
│       ↓ Árbol de Derivación (AST)     │
└───────────────────────────────────────┘
        │
        ↓
┌───────────────────────────────────────┐
│        3. EVALUADOR (Interpreter)     │
│  ┌─────────────────────────────────┐  │
│  │  Tree-Walking Interpreter       │  │
│  │  • Recorrido recursivo del AST  │  │
│  │  • Sistema de tipos dinámico    │  │
│  │  • Estado de variables          │  │
│  │  • Operaciones matriciales      │  │
│  └─────────────────────────────────┘  │
│            ↓ Resultado/Output         │
└───────────────────────────────────────┘
```

---

## Estructura del Proyecto

```
BACKEND/
├── INTERPRETE/                      # Núcleo del compilador
│   ├── tipos.ts                     # Sistema de tipos y estructuras de datos
│   ├── analizador_lexico.ts         # Scanner con AFDs
│   ├── analizador_sintactico.ts     # Parser LL(1) Table-Driven
│   ├── evaluador.ts                 # Tree-Walking Interpreter
│   └── principal.ts                 # Entry point (standalone, no web)
│
├── src/
│   ├── index.ts                     # Servidor Express
│   ├── controllers/
│   │   └── interpreteController.ts  # Controlador de la API
│   └── utils/
│       └── ejecutador.ts            # Orquestador del pipeline
│
├── Ejemplos/                        # Programas de ejemplo en NOTLIM
├── package.json
└── tsconfig.json
```

---

## Conceptos Técnicos Implementados

### 1. Análisis Léxico (Scanner)

**Archivo:** `INTERPRETE/analizador_lexico.ts`

El analizador léxico convierte el código fuente en una secuencia de tokens utilizando **Autómatas Finitos Deterministas (AFD)**.

#### AFDs Implementados:

| Función | Reconoce | Patrón |
|---------|----------|--------|
| `es_id()` | Identificadores | `[a-zA-Z][a-zA-Z0-9]*` |
| `es_constante_real()` | Números reales | `[0-9]+(\.[0-9]+)?` |
| `es_cadena()` | Strings | `'[^']*'` |
| `es_simbolo_especial()` | Operadores y símbolos | `+`, `-`, `:=`, `==`, etc. |

#### Tabla de Símbolos:
- Almacena palabras reservadas con su token correspondiente
- Registra identificadores definidos por el usuario
- Permite lookup O(1) para clasificación de tokens

```typescript
// Ejemplo de token generado
{
  token: Tokens.ID,      // Tipo de token
  atributo: "miVariable" // Valor/lexema
}
```

### 2. Análisis Sintáctico (Parser)

**Archivo:** `INTERPRETE/analizador_sintactico.ts`

Implementación de un **parser LL(1) predictivo dirigido por tabla** que construye el árbol de derivación.

#### Características:

| Aspecto | Implementación |
|---------|----------------|
| **Tipo de Parser** | LL(1) Predictivo |
| **Estructura de datos** | Pila explícita |
| **Tabla de Análisis** | TAS precalculada (80+ reglas) |
| **Salida** | Árbol de derivación (DerivationNode) |

#### Gramática (Producciones principales):

```bnf
<Programa>    → program id ; <Definiciones> { <Cuerpo> }
<Definiciones> → def <ListaDef> | ε
<Tipo>        → matriz [ creal ] [ creal ] | real
<Cuerpo>      → <Sentencias> ; <Cuerpo> | ε
<Sentencias>  → <Asignacion> | <Leer> | <Escribir> | <Condicional> | <Ciclo>
<Expresion>   → <OP2> <OP'>   // Precedencia de operadores
<Condicion>   → ( <ExpresionL> )
```

#### Tabla de Análisis Sintáctico (TAS):

La TAS fue calculada manualmente a partir de los conjuntos FIRST y FOLLOW de la gramática. Contiene las producciones a aplicar para cada combinación (no-terminal, terminal).

```typescript
// Estructura de la TAS
TAS[NoTerminal][Terminal] = número_de_producción
```

### 3. Evaluador (Interpreter)

**Archivo:** `INTERPRETE/evaluador.ts`

Un **Tree-Walking Interpreter** que recorre el árbol de derivación y ejecuta la semántica del programa.

#### Sistema de Tipos en Runtime:

```typescript
type InfoOP =
  | { tipo: 'real'; valor: number }
  | { tipo: 'matriz'; valor: number[][] }
```

#### Operaciones Matriciales Nativas:

| Operación | Descripción |
|-----------|-------------|
| `A + B` | Suma de matrices (validación de dimensiones) |
| `A - B` | Resta de matrices |
| `A * B` | Multiplicación matriz × matriz |
| `A * n` | Multiplicación matriz × escalar |
| `A ^ n` | Potenciación de matrices |
| `tras(A)` | Transposición |
| `filas(A)` | Número de filas |
| `columnas(A)` | Número de columnas |

#### Manejo de Estado:

```typescript
// Estado de una variable
interface EstadoVariable {
  tipo: 'real' | 'matriz';
  valor: number | number[][];
  inicializado: boolean;
  dimensiones?: { filas: number; columnas: number };
}
```

### 4. API REST

**Archivo:** `src/index.ts`

Servidor Express que expone el intérprete como servicio.

#### Endpoint:

```
POST /ejecutar
Content-Type: application/json

Request:
{
  "codigo": "program test; { escribir('Hola Mundo'); }"
}

Response:
{
  "exito": true,
  "salida": ["Hola Mundo"],
  "error": null
}
```

---

## Manejo de Errores

El sistema diferencia entre tres tipos de errores:

| Tipo | Fase | Ejemplo |
|------|------|---------|
| **Error Léxico** | Scanner | Token no reconocido |
| **Error Sintáctico** | Parser | Estructura gramatical inválida |
| **Error de Ejecución** | Evaluador | División por cero, tipos incompatibles |

```typescript
// Errores personalizados
class ErrorLexico extends Error { /* ... */ }
class ErrorSintactico extends Error { /* ... */ }
class ErrorEjecucion extends Error { /* ... */ }
```

---

## Seguridad y Límites

- **Límite de iteraciones:** Máximo 50 iteraciones por bucle (protección contra bucles infinitos)
- **Función `leer()` deshabilitada:** En la versión web no hay entrada interactiva
- **CORS configurado:** Permite solicitudes del frontend

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **TypeScript** | 5.8.3 | Tipado estático |
| **Express** | 5.1.0 | Framework web |
| **Node.js** | ES2022 | Runtime |
| **cors** | 2.8.5 | Middleware CORS |

---

## Ejecutar

```bash
# Instalar dependencias
pnpm install

# Desarrollo (con hot reload)
pnpm run dev

# Producción
pnpm run build
pnpm start
```

El servidor inicia en `http://localhost:3000`.

---

## Habilidades Demostradas

✅ **Teoría de Compiladores** - Implementación completa del pipeline de compilación  
✅ **Estructuras de Datos** - Pilas, árboles, tablas hash  
✅ **Algoritmos** - AFDs, parsing LL(1), recorrido de árboles  
✅ **TypeScript Avanzado** - Tipos discriminados, genéricos, type guards  
✅ **API Design** - REST endpoints bien estructurados  
✅ **Manejo de Errores** - Errores específicos por fase de compilación

---

<p align="center">
  <i>El intérprete fue implementado completamente desde cero, demostrando conocimiento profundo de teoría de lenguajes de programación.</i>
</p>
