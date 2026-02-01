# FRONT-NOTLIM 🚀

Una interfaz web moderna y potente para el intérprete de lenguaje personalizado, diseñada para escribir, validar y ejecutar código de forma interactiva.

Este proyecto nace como la evolución visual y funcional del intérprete desarrollado en [PROYECTO-SINTAXIS](https://github.com/elmiltonpa/PROYECTO-SINTAXIS).

## Características

- **Editor Inteligente:** Implementación de CodeMirror 6 con:
  - Resaltado de sintaxis personalizado.
  - Autocompletado de palabras clave del lenguaje (`program`, `while`, `if`, `leer`, `escribir`, etc.).
  - Soporte para indentación con tabulación.
- **Ejecución en Tiempo Real:** Comunicación fluida con el backend para procesar scripts y mostrar resultados instantáneos.
- **Panel de Salida Dinámico:** Visualización clara de errores de sintaxis, mensajes de ejecución y resultados de algoritmos.
- **Biblioteca de Ejemplos:** Acceso rápido a algoritmos complejos como:
  - Resolución de Sistemas de Ecuaciones Lineales (SEL).
  - Normalización de matrices.
  - Algoritmos de ordenamiento (Selección).

## Instalación y Uso

Asegúrate de tener instalado [Node.js](https://nodejs.org/) y [pnpm](https://pnpm.io/).

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/FRONT-NOTLIM.git
   cd FRONT-NOTLIM
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto y añade la URL de tu backend:
   ```env
   VITE_URL=https://tu-api-backend.com
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

## Origen e Inspiración

Este proyecto es la interfaz oficial para el motor de interpretación definido en el repositorio **PROYECTO-SINTAXIS**. Proporciona una capa de usuario (UX) mejorada, permitiendo a los desarrolladores y estudiantes probar su lógica sin necesidad de configurar entornos locales complejos.
