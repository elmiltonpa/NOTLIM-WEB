import { ejecutarCodigo } from "../utils/ejecutador";

export const interpreterController = async (req: any, res: any) => {
  try {
    const { codigo } = req.body;

    if (!codigo || typeof codigo !== "string") {
      return res.status(400).json({
        error: "Código fuente requerido",
      });
    }

    const resultado = await ejecutarCodigo(codigo);

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      error: "Error interno del servidor",
      detalle: error instanceof Error ? error.message : String(error),
    });
  }
};
