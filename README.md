# NOTLIM-WEB

> **Un intérprete de lenguaje de programación propio ejecutable desde el navegador**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)

---

## Sobre el Proyecto

**NOTLIM-WEB** es la evolución de un proyecto académico originalmente desarrollado en Pascal ([PROYECTO-SINTAXIS](https://github.com/elmiltonpa/PROYECTO-SINTAXIS)). La idea fue migrar un **compilador/intérprete completo** a **TypeScript** para poder ejecutar el lenguaje personalizado directamente desde una página web.

El proyecto demuestra la implementación completa de un intérprete de lenguaje de programación, incluyendo:
- Análisis léxico mediante **Autómatas Finitos Deterministas (AFD)**
- Análisis sintáctico con un parser **LL(1) predictivo dirigido por tabla**
- Evaluación del árbol de derivación (**Tree-Walking Interpreter**)

### ¿Por qué este proyecto?

El objetivo no era crear "otro lenguaje de programación", sino demostrar un **dominio profundo de los fundamentos de compiladores y teoría de lenguajes**. Toda la implementación fue hecha "a mano" sin utilizar herramientas de generación automática como Lex/Yacc o ANTLR.

---

## Conceptos y Habilidades Demostradas

### Teoría de Compiladores
| Concepto | Implementación |
|----------|----------------|
| **Análisis Léxico** | AFDs programados manualmente para reconocimiento de tokens |
| **Análisis Sintáctico** | Parser LL(1) con tabla de análisis calculada a mano |
| **Árbol de Sintaxis** | Estructura de datos de árbol de derivación (AST) |
| **Evaluación Semántica** | Intérprete que recorre el árbol y ejecuta la semántica |
| **Sistema de Tipos** | Verificación de tipos en tiempo de ejecución |
| **Manejo de Errores** | Errores léxicos, sintácticos y de ejecución diferenciados |

### Desarrollo Full Stack
| Tecnología | Uso |
|------------|-----|
| **TypeScript** | Tipado estático en todo el proyecto (frontend y backend) |
| **React 19** | UI moderna con hooks personalizados |
| **Express 5** | API REST para ejecutar código |
| **CodeMirror 6** | Editor de código con autocompletado personalizado |
| **Vite** | Build tool con HMR para desarrollo rápido |
| **Tailwind CSS** | Estilos utilitarios para diseño responsive |

### Patrones de Diseño
- **Interpreter Pattern** - Núcleo del intérprete
- **Table-Driven Parser** - Análisis sintáctico dirigido por tabla
- **State Management** - Manejo del estado de variables durante ejecución
- **Custom Hooks** - Abstracción de lógica del editor (useCodeMirror)
- **Service Layer** - Separación de lógica de API en el frontend

---

## El Lenguaje NOTLIM

Un lenguaje diseñado para operaciones matemáticas y matriciales:

```notlim
program ejemplo;
    def A:matriz[2][2]; x:real; i:real;
{
    A := [[1,2],[3,4]];
    x := 10;
    i := 1;
    
    while ( ? i <= filas(A) ? ) {
        escribir('Fila: ', i, ' Valor: ', A[i][1]);
        i := i + 1;
    };
    
    if ( ? x > 5 ? ) {
        escribir('x es mayor que 5');
    } else {
        escribir('x no es mayor que 5');
    };
    
    escribir('Matriz transpuesta: ', tras(A));
}
```

### Características del Lenguaje
- **Tipos de datos:** `real` (números) y `matriz[filas][columnas]`
- **Operadores:** Aritméticos (`+`, `-`, `*`, `/`, `^`), Comparación, Lógicos
- **Estructuras de control:** `if/else`, `while`
- **Funciones built-in:** `filas()`, `columnas()`, `tras()`, `escribir()`, `leer()`
- **Operaciones matriciales nativas:** Suma, resta, multiplicación, potencia, transposición

---

## Cómo Ejecutar

### Requisitos
- Node.js 18+
- pnpm (o npm/yarn)

### Backend
```bash
cd BACKEND
pnpm install
pnpm run dev    # Desarrollo
# o
pnpm run build && pnpm start  # Producción
```

### Frontend
```bash
cd FRONTEND
pnpm install
pnpm run dev    # http://localhost:5173
```

---

## Proyecto Original (Pascal)

Este proyecto es una evolución de [PROYECTO-SINTAXIS](https://github.com/elmiltonpa/PROYECTO-SINTAXIS), donde el mismo intérprete fue implementado en Pascal. La migración a TypeScript permitió:

1. **Accesibilidad** - Ejecutar el lenguaje desde cualquier navegador
2. **UI moderna** - Editor de código con syntax highlighting y autocompletado
3. **Mejor mantenibilidad** - TypeScript provee tipado estático
4. **Demostrar versatilidad** - Mismo concepto, diferentes tecnologías

---

<p align="center">
  <i>Este proyecto demuestra conocimientos en teoría de compiladores, desarrollo full stack y diseño de sistemas.</i>
</p>
