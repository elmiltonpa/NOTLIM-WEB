export const validarFuncionesLectura = (
  codigo: string,
): { valido: boolean; error?: string } => {
  const patronesLectura = [/leer\s*\(/i];

  for (const patron of patronesLectura) {
    if (patron.test(codigo)) {
      return {
        valido: false,
        error:
          "Las funciones de entrada de usuario no están disponibles en el intérprete web. Por favor, use valores constantes en su lugar.",
      };
    }
  }

  return { valido: true };
};
