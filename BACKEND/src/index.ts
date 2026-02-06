import express, { Request, Response } from 'express';
import cors from "cors";
import { ejecutarCodigo } from "./utils/ejecutador.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/ejecutar', async (req: Request, res: Response) => {
  try {
    const { codigo } = req.body;

    if (!codigo || typeof codigo !== "string") {
      return res.status(400).json({
        error: "Código fuente requerido",
      });
    }

    // Límite preventivo de líneas
    const MAX_LINEAS = 5000;
    const lineas = codigo.split('\n');
    if (lineas.length > MAX_LINEAS) {
      return res.status(400).json({
        error: `El código es demasiado largo (Máximo ${MAX_LINEAS} líneas)`,
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
});

app.get('/', (req: Request, res: Response) => {
  res.json({ mensaje: "Servidor PASCAL a JS funcionando" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
