import { analizador_predictivo } from "../../INTERPRETE/analizador_sintactico.js";
import { DerivationNode, t_estado } from "../../INTERPRETE/tipos.js";
import { evaluar_programa } from "../../INTERPRETE/evaluador.js";

export interface ResultadoEjecucion {
  exito: boolean;
  error?: string;
  salida?: string[];
}

export const ejecutarCodigo = async (
  codigoFuente: string,
): Promise<ResultadoEjecucion> => {
  try {
    let arbol = new DerivationNode();
    let estado: t_estado = {
      elem: [],
    };

    // Capturar salida de console.log
    const salida: string[] = [];
    const originalConsoleLog = console.log;

    console.log = (...args: any[]) => {
      salida.push(args.join(" "));
      originalConsoleLog(...args);
    };

    const respuesta = analizador_predictivo(codigoFuente, arbol);

    if (respuesta.error) {
      console.log = originalConsoleLog;
      return {
        exito: false,
        error: respuesta.message,
        salida,
      };
    }

    await evaluar_programa(arbol, estado);

    console.log = originalConsoleLog;
    return {
      exito: true,
      salida,
    };
  } catch (error) {
    return {
      exito: false,
      error: `Error de ejecución: ${error instanceof Error ? error.message : String(error)}`,
      salida: [],
    };
  }
};
