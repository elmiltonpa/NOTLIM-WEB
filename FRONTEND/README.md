# NOTLIM-WEB Frontend

> **Interfaz web moderna para un intérprete de lenguaje de programación**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![CodeMirror](https://img.shields.io/badge/CodeMirror-6-D30707)](https://codemirror.net/)

---

## Descripción General

Este frontend proporciona una **interfaz de usuario moderna y responsive** que permite escribir, editar y ejecutar código del lenguaje NOTLIM directamente desde el navegador.

El proyecto demuestra buenas prácticas en desarrollo frontend con React, incluyendo:
- Arquitectura de componentes bien organizada
- Custom hooks para lógica reutilizable
- Separación de concerns con service layer
- UI/UX enfocada en la experiencia del desarrollador

---

## Características

- **Editor de código profesional** con CodeMirror 6  
- **Autocompletado inteligente** para palabras reservadas del lenguaje  
- **Ejemplos precargados** para facilitar el aprendizaje  
- **Feedback instantáneo** con estados de carga y manejo de errores  
- **Diseño responsive** adaptado a diferentes tamaños de pantalla  
- **Validación en tiempo real** antes de enviar al servidor

---

## Estructura del Proyecto

```
FRONTEND/
├── src/
│   ├── main.tsx                 # Entry point de React
│   ├── App.tsx                  # Componente principal
│   ├── App.css                  # Estilos globales
│   ├── index.css                # Configuración de Tailwind
│   │
│   ├── components/              # Componentes de UI
│   │   ├── CodeEditor.tsx       # Editor de código con CodeMirror
│   │   └── icons/
│   │       └── index.tsx        # Iconos SVG como componentes
│   │
│   ├── hooks/                   # Custom hooks
│   │   └── useCodeMirror.ts     # Hook para manejo del editor
│   │
│   ├── services/                # Capa de servicios (API)
│   │   └── index.ts             # Cliente HTTP con Axios
│   │
│   ├── utils/                   # Utilidades
│   │   └── validators.ts        # Validaciones del código
│   │
│   └── examples/                # Ejemplos de código NOTLIM
│       └── index.ts             # Programas de demostración
│
├── public/                      # Assets estáticos
├── package.json
├── vite.config.ts               # Configuración de Vite
├── tailwind.config.js           # Configuración de Tailwind
└── tsconfig.json                # Configuración de TypeScript
```

---

## Arquitectura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                          App.tsx                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Header                              │  │
│  │  Logo + Título + Descripción                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 Main Content                           │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────┐ │  │
│  │  │  Examples       │  │  CodeEditor.tsx             │ │  │
│  │  │  Selector       │  │  ┌─────────────────────────┐│ │  │
│  │  │                 │  │  │  useCodeMirror Hook    ││ │  │
│  │  │  • SEL          │  │  │  • Editor state        ││ │  │
│  │  │  • Presentación │  │  │  • Autocompletado      ││ │  │
│  │  │  • Normalización│  │  │  • Syntax highlighting ││ │  │
│  │  │  • Selección    │  │  └─────────────────────────┘│ │  │
│  │  └─────────────────┘  └─────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Execute Button                                  │  │  │
│  │  │  • Validación con validators.ts                 │  │  │
│  │  │  • Llamada a services/index.ts                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Output Panel                                    │  │  │
│  │  │  • Resultados de ejecución                      │  │  │
│  │  │  • Mensajes de error                            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Patrones y Prácticas Implementadas

### 1. Custom Hooks

**Archivo:** `hooks/useCodeMirror.ts`

Encapsula toda la lógica del editor CodeMirror en un hook reutilizable.

```typescript
const useCodeMirror = (
  containerRef: RefObject<HTMLDivElement>,
  initialValue: string
) => {
  // Estado del editor
  // Configuración de extensiones
  // Autocompletado personalizado
  // Manejo de cambios
  
  return { value, setValue };
};
```

**Beneficios:**
- Separación de concerns (UI vs lógica)
- Reutilizable en múltiples componentes
- Facilita testing unitario
- Código del componente más limpio

### 2. Service Layer Pattern

**Archivo:** `services/index.ts`

Abstrae las llamadas a la API del resto de la aplicación.

```typescript
// services/index.ts
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL
});

export const ejecutarCodigo = async (codigo: string) => {
  const response = await api.post('/ejecutar', { codigo });
  return response.data;
};
```

**Beneficios:**
- Centralización de configuración HTTP
- Fácil cambio de backend (URL, headers, etc.)
- Interceptors para manejo global de errores
- Tipado fuerte en respuestas

### 3. Validación Pre-envío

**Archivo:** `utils/validators.ts`

Valida el código antes de enviarlo al servidor.

```typescript
// validators.ts
export const validateCode = (code: string): ValidationResult => {
  // Verifica que no use funciones no soportadas en web
  if (code.includes('leer(')) {
    return { 
      valid: false, 
      error: 'La función leer() no está disponible en la versión web' 
    };
  }
  return { valid: true };
};
```

**Beneficios:**
- Feedback inmediato al usuario
- Reduce llamadas innecesarias al servidor
- Mejor UX

### 4. Component Composition

Componentes pequeños y específicos que se componen para formar la UI.

```
App (container)
  └── CodeEditor (presentational)
        └── useCodeMirror (logic)
```

---

## CodeMirror 6 - Editor Profesional

El editor utiliza **CodeMirror 6**, la versión más moderna del popular editor de código.

### Extensiones Utilizadas:

| Extensión | Propósito |
|-----------|-----------|
| `@codemirror/autocomplete` | Sistema de autocompletado |
| `@codemirror/commands` | Keybindings estándar |
| `@codemirror/language` | Framework de lenguajes |
| `@codemirror/state` | Manejo de estado inmutable |
| `@codemirror/view` | Renderizado del editor |

### Autocompletado Personalizado:

El editor sugiere palabras reservadas del lenguaje NOTLIM:

```typescript
const completions = [
  { label: 'program', type: 'keyword' },
  { label: 'while', type: 'keyword' },
  { label: 'if', type: 'keyword' },
  { label: 'def', type: 'keyword' },
  { label: 'escribir', type: 'function' },
  { label: 'matriz', type: 'type' },
  { label: 'real', type: 'type' },
  { label: 'filas', type: 'function' },
  { label: 'columnas', type: 'function' },
  { label: 'tras', type: 'function' },
  // ...
];
```

---

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.4 | Framework UI |
| **TypeScript** | ~5.8.3 | Tipado estático |
| **Vite** | 6.4.1 | Build tool + Dev server |
| **Tailwind CSS** | 4.1.18 | Estilos utilitarios |
| **CodeMirror** | 6.0.2 | Editor de código |
| **Axios** | 1.13.4 | Cliente HTTP |
| **ESLint** | 9.39.2 | Linting |
| **pnpm** | - | Package manager |

---

## Ejemplos Incluidos

El frontend incluye varios programas de ejemplo para demostrar las capacidades del lenguaje:

| Ejemplo | Descripción |
|---------|-------------|
| **SEL** | Sistema de Ecuaciones Lineales con eliminación Gaussiana |
| **Presentación** | Demostración básica de operaciones con matrices |
| **Normalización** | Normalización de datos en matrices |
| **Selección** | Algoritmo de ordenamiento por selección |
| **Test Bucle Infinito** | Prueba del límite de iteraciones |

---

## Ejecutar el Proyecto

```bash
# Instalar dependencias
pnpm install

# Desarrollo con Hot Module Replacement
pnpm run dev

# Build de producción
pnpm run build

# Preview del build
pnpm run preview

# Linting
pnpm run lint
```

El servidor de desarrollo inicia en `http://localhost:5173`.

---

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del frontend:

```env
VITE_URL=https://tu-api-backend.com
```

### Vite Config

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
```

---

## Habilidades Demostradas

| Área | Habilidades |
|------|-------------|
| **React Moderno** | Hooks, functional components, estado |
| **TypeScript** | Tipado fuerte en componentes y servicios |
| **Custom Hooks** | Abstracción de lógica reutilizable |
| **Arquitectura Frontend** | Separación de concerns, service layer |
| **UI/UX** | Interfaz intuitiva con feedback visual |
| **Tooling Moderno** | Vite, ESLint, Tailwind CSS |
| **Integración de Librerías** | CodeMirror 6, Axios |
| **Responsive Design** | Adaptación a diferentes pantallas |

---

## Flujo de Datos

```
Usuario escribe código
        │
        ↓
CodeEditor (useCodeMirror)
        │
        ↓
[Click "Ejecutar"]
        │
        ↓
validators.ts → Validación local
        │
        ↓ (si es válido)
services/index.ts → POST /ejecutar
        │
        ↓
Backend procesa
        │
        ↓
Respuesta → Actualiza estado
        │
        ↓
Output Panel muestra resultados
```

---

## Origen e Inspiración

Este proyecto es la interfaz oficial para el motor de interpretación definido en el repositorio [PROYECTO-SINTAXIS](https://github.com/elmiltonpa/PROYECTO-SINTAXIS). Proporciona una capa de experiencia de usuario (UX) mejorada, permitiendo a desarrolladores y estudiantes probar código sin necesidad de configurar entornos locales complejos.

---

<p align="center">
  <i>Frontend construido con las mejores prácticas de desarrollo React moderno.</i>
</p>
