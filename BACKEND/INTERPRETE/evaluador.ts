import {
  DerivationNode,
  TipoSG,
  Matriz,
  t_estado,
  t_tipo,
  t_elem_estado,
  InfoOP,
  Resultado,
} from "./tipos.js";

const max_iteraciones = 50;

function escribirMatriz(matriz: Matriz): void {
  let maxEnteros = 8;
  maxEnteros = maxEnteros + 3;

  for (let i = 0; i < matriz.length; i++) {
    let fila = "| ";
    for (let j = 0; j < matriz[0].length; j++) {
      const valorFormateado = matriz[i][j].toFixed(2).padStart(maxEnteros, " ");
      fila += valorFormateado + " ";
    }
    fila += "|";
    console.log(fila);
  }
}

function obtenerElemento(estado: t_estado, id_lexema: string): t_elem_estado {
  const elem = estado.elem.find((e) => e.id_lexema === id_lexema);
  if (!elem) {
    throw new Error(`El identificador ${id_lexema} no está definido.`);
  }
  return elem;
}

function validarTipo(
  elem: t_elem_estado,
  tipoEsperado: t_tipo,
  mensaje: string,
) {
  if (elem.tipo !== tipoEsperado) {
    throw new Error(mensaje);
  }
}

function crearInfoOP(tipo: t_tipo): InfoOP {
  return tipo === t_tipo.Treal_estado
    ? { tipo, valor: 0 }
    : { tipo, valor: [] };
}

function obtener_dimensiones(
  estado: t_estado,
  id_lexema: string,
): { fila: number; columna: number } {
  const elem = obtenerElemento(estado, id_lexema);
  validarTipo(
    elem,
    t_tipo.Tmatriz_estado,
    `El identificador ${id_lexema} no es una matriz.`,
  );
  return { fila: elem.dim_fila, columna: elem.dim_columna };
}

function asignar_valor_matriz(
  estado: t_estado,
  valor: number,
  id_lexema: string,
  fila: number,
  columna: number,
) {
  const elem = obtenerElemento(estado, id_lexema);
  validarTipo(
    elem,
    t_tipo.Tmatriz_estado,
    `El identificador ${id_lexema} no es una matriz.`,
  );
  elem.valor_matriz[fila - 1][columna - 1] = valor;
  elem.inicializado = true;
}

function variable_inicializada(estado: t_estado, id_lexema: string): boolean {
  const elem = obtenerElemento(estado, id_lexema);
  return elem.inicializado;
}

function obtener_valor_real(estado: t_estado, id_lexema: string): number {
  const elem = obtenerElemento(estado, id_lexema);
  validarTipo(
    elem,
    t_tipo.Treal_estado,
    `El identificador ${id_lexema} no es un número real.`,
  );
  return elem.valor_real;
}

function obtener_valor_matriz(estado: t_estado, id_lexema: string): Matriz {
  const elem = obtenerElemento(estado, id_lexema);
  validarTipo(
    elem,
    t_tipo.Tmatriz_estado,
    `El identificador ${id_lexema} no es una matriz.`,
  );
  return elem.valor_matriz;
}

function asignar_matriz(estado: t_estado, id_lexema: string, matriz: Matriz) {
  const elem = obtenerElemento(estado, id_lexema);
  validarTipo(
    elem,
    t_tipo.Tmatriz_estado,
    `El identificador ${id_lexema} no es una matriz.`,
  );
  elem.valor_matriz = matriz;
  elem.inicializado = true;
}

function asignar_real(estado: t_estado, id_lexema: string, valor: number) {
  const elem = obtenerElemento(estado, id_lexema);
  validarTipo(
    elem,
    t_tipo.Treal_estado,
    `El identificador ${id_lexema} no es un número real.`,
  );
  elem.valor_real = valor;
  elem.inicializado = true;
}

function obtener_tipo(estado: t_estado, id_lexema: string): t_tipo {
  const elem = obtenerElemento(estado, id_lexema);
  return elem.tipo;
}

function sumar_matrices(matriz1: Matriz, matriz2: Matriz): Matriz {
  if (
    matriz1.length !== matriz2.length ||
    matriz1[0].length !== matriz2[0].length
  ) {
    throw new Error("Dimensiones de matrices incompatibles.");
  }
  const resultado: Matriz = [];
  for (let i = 0; i < matriz1.length; i++) {
    resultado[i] = [];
    for (let j = 0; j < matriz1[i].length; j++) {
      resultado[i][j] = matriz1[i][j] + matriz2[i][j];
    }
  }
  return resultado;
}

function restar_matrices(matriz1: Matriz, matriz2: Matriz): Matriz {
  if (
    matriz1.length !== matriz2.length ||
    matriz1[0].length !== matriz2[0].length
  ) {
    throw new Error("Dimensiones de matrices incompatibles.");
  }
  const resultado: Matriz = [];
  for (let i = 0; i < matriz1.length; i++) {
    resultado[i] = [];
    for (let j = 0; j < matriz1[i].length; j++) {
      resultado[i][j] = matriz1[i][j] - matriz2[i][j];
    }
  }
  return resultado;
}

function multiplicar_matrices(matriz1: Matriz, matriz2: Matriz): Matriz {
  if (matriz1[0].length !== matriz2.length) {
    throw new Error("Dimensiones de matrices incompatibles.");
  }
  const resultado: Matriz = [];
  for (let i = 0; i < matriz1.length; i++) {
    resultado[i] = [];
    for (let j = 0; j < matriz2[0].length; j++) {
      resultado[i][j] = 0;
      for (let k = 0; k < matriz1[i].length; k++) {
        resultado[i][j] += matriz1[i][k] * matriz2[k][j];
      }
    }
  }
  return resultado;
}

function multiplicar_matriz_por_real(matriz: Matriz, real: number): Matriz {
  const resultado: Matriz = [];
  for (let i = 0; i < matriz.length; i++) {
    resultado[i] = [];
    for (let j = 0; j < matriz[i].length; j++) {
      resultado[i][j] = matriz[i][j] * real;
    }
  }
  return resultado;
}

function elevar_matriz_a_potencia(matriz: Matriz, exponente: number): Matriz {
  if (exponente < 0) {
    throw new Error("Exponente negativo no permitido.");
  }
  let resultado = matriz;
  for (let i = 1; i < exponente; i++) {
    resultado = multiplicar_matrices(resultado, matriz);
  }
  return resultado;
}

function pasar_a_real(valor: string): number {
  const numero = parseFloat(valor);
  if (isNaN(numero)) {
    throw new Error("Valor no numérico.");
  }
  return numero;
}

function trasponer_matriz(matriz: Matriz): Matriz {
  const filas = matriz.length;
  const columnas = matriz[0].length;
  const resultado: Matriz = Array.from({ length: columnas }, () =>
    Array(filas).fill(0),
  );

  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      resultado[j][i] = matriz[i][j];
    }
  }
  return resultado;
}

/*
export function leer_entrada(cadena: string): Promise<string> {
    return new Promise((resolve) => {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(cadena, (input: string) => {
            rl.close();
            resolve(input);
        });
    });
}
*/

function pasar_a_matriz(valor: string): { matriz: Matriz; esMatriz: boolean } {
  let matriz: Matriz = [];
  let esMatriz = true;

  try {
    const parsed = JSON.parse(valor);

    if (
      Array.isArray(parsed) &&
      parsed.every(
        (fila) =>
          Array.isArray(fila) && fila.every((n) => typeof n === "number"),
      )
    ) {
      matriz = parsed;
    } else {
      esMatriz = false;
    }
  } catch (e) {
    esMatriz = false;
  }

  return { matriz, esMatriz };
}

function agregar_real(estado: t_estado, id_lexema: string, tipo: t_tipo) {
  const elem: t_elem_estado = {
    id_lexema,
    valor_real: 0,
    tipo,
    valor_matriz: [],
    dim_fila: 0,
    dim_columna: 0,
    inicializado: false,
  };
  estado.elem.push(elem);
}

function agregar_matriz(
  estado: t_estado,
  id_lexema: string,
  tipo: t_tipo,
  filas: number,
  columnas: number,
) {
  const matriz: Matriz = Array.from({ length: filas }, () =>
    Array(columnas).fill(0),
  );
  const elem: t_elem_estado = {
    id_lexema,
    valor_real: 0,
    tipo,
    valor_matriz: matriz,
    dim_fila: filas,
    dim_columna: columnas,
    inicializado: false,
  };
  estado.elem.push(elem);
}

// <Programa> ::= "program" "id" ";" <Definiciones> "{" <Cuerpo> "}"
export async function evaluar_programa(
  arbol: DerivationNode,
  estado: t_estado,
) {
  const iteraciones = { value: 0 }; // Contador global de iteraciones

  await evaluar_definiciones(arbol.hijos[3], estado);
  await evaluar_cuerpo(arbol.hijos[5], estado, iteraciones);
}

// <Definiciones> ::= "def" <ListaDefiniciones> | eps
async function evaluar_definiciones(arbol: DerivationNode, estado: t_estado) {
  if (arbol.hijos.length > 0) {
    await evaluar_lista_definiciones(arbol.hijos[1], estado);
  }
}

// <ListaDefiniciones> ::= <Definicion> ";" <MasDefiniciones>
async function evaluar_lista_definiciones(
  arbol: DerivationNode,
  estado: t_estado,
) {
  await evaluar_definicion(arbol.hijos[0], estado);
  await evaluar_mas_definiciones(arbol.hijos[2], estado);
}

// <MasDefiniciones> ::= <ListaDefiniciones> | eps
async function evaluar_mas_definiciones(
  arbol: DerivationNode,
  estado: t_estado,
) {
  if (arbol.hijos.length > 0) {
    await evaluar_lista_definiciones(arbol.hijos[0], estado);
  }
}

// <Definicion> ::= "id" ":" <Tipo>
async function evaluar_definicion(arbol: DerivationNode, estado: t_estado) {
  await evaluar_tipo(arbol.hijos[2], estado, arbol.hijos[0].lexema);
}

// <Tipo> ::=  "matriz" "[" "creal" "]" "["  "creal" "]" | "real"
async function evaluar_tipo(
  arbol: DerivationNode,
  estado: t_estado,
  id_lexema: string,
) {
  const simbolo = arbol.hijos[0].simbolo;

  switch (simbolo) {
    case TipoSG.Treal:
      agregar_real(estado, id_lexema, t_tipo.Treal_estado);
      break;
    case TipoSG.Tmatriz:
      const fila_aux = pasar_a_real(arbol.hijos[2]?.lexema);
      const columna_aux = pasar_a_real(arbol.hijos[5]?.lexema);
      if (fila_aux <= 0 || columna_aux <= 0) {
        throw new Error("Dimensiones inválidas para matriz.");
      }

      const fila = Math.trunc(fila_aux);
      const columna = Math.trunc(columna_aux);

      agregar_matriz(estado, id_lexema, t_tipo.Tmatriz_estado, fila, columna);
      break;
  }
}

// <Cuerpo> ::= <Sentencias> ";" <Cuerpo> | eps
async function evaluar_cuerpo(
  arbol: DerivationNode,
  estado: t_estado,
  iteraciones?: { value: number },
) {
  if (arbol.hijos.length > 0) {
    await evaluar_sentencias(arbol.hijos[0], estado, iteraciones);
    await evaluar_cuerpo(arbol.hijos[2], estado, iteraciones);
  }
}

// <Sentencias> ::= <Asignacion> | <Leer>| <Escribir> | <Condicinal> | <Ciclo>
async function evaluar_sentencias(
  arbol: DerivationNode,
  estado: t_estado,
  iteraciones?: { value: number },
) {
  const simbolo = arbol.hijos[0].simbolo;
  switch (simbolo) {
    case TipoSG.Vasignacion:
      await evaluar_asignacion(arbol.hijos[0], estado);
      break;
    case TipoSG.Vleer:
      await evaluar_leer(arbol.hijos[0], estado);
      break;
    case TipoSG.Vescribir:
      await evaluar_escribir(arbol.hijos[0], estado);
      break;
    case TipoSG.Vcondicional:
      await evaluar_condicional(arbol.hijos[0], estado, iteraciones);
      break;
    case TipoSG.Vciclo:
      if (!iteraciones) {
        iteraciones = { value: 0 };
      }
      await evaluar_ciclo(arbol.hijos[0], estado, iteraciones);
      break;
  }
}

// <Asignacion> ::= "id" <Asingacion'>
async function evaluar_asignacion(arbol: DerivationNode, estado: t_estado) {
  const id_lexema = arbol.hijos[0].lexema;
  await evaluar_asignacion_prima(arbol.hijos[1], estado, id_lexema);
}

// <Asigancion'> ::= ":=" <Asignacion''> | "[" <OP>"]""["<OP> "]" := <OP>
async function evaluar_asignacion_prima(
  arbol: DerivationNode,
  estado: t_estado,
  id_lexema: string,
) {
  const simbolo = arbol.hijos[0].simbolo;

  const tipo = obtener_tipo(estado, id_lexema);

  let info = crearInfoOP(t_tipo.Treal_estado);

  switch (simbolo) {
    case TipoSG.Tasig:
      await evaluar_asignacion_prima_prima(
        arbol.hijos[1],
        estado,
        info,
        id_lexema,
      );

      switch (info.tipo) {
        case t_tipo.Treal_estado:
          if (tipo == t_tipo.Treal_estado) {
            asignar_real(estado, id_lexema, info.valor);
          } else {
            throw new Error("Tipos incompatibles en la asignación de real.");
          }
          break;
        case t_tipo.Tmatriz_estado:
          if (tipo == t_tipo.Tmatriz_estado) {
            asignar_matriz(estado, id_lexema, info.valor);
          } else {
            throw new Error("Tipos incompatibles en la asignación de matriz.");
          }
      }
      break;
    case TipoSG.Tcorchetea:
      const OP1 = crearInfoOP(t_tipo.Treal_estado);
      await evaluar_op(arbol.hijos[1], estado, OP1);
      const OP2 = crearInfoOP(t_tipo.Treal_estado);
      await evaluar_op(arbol.hijos[4], estado, OP2);

      const OP3 = crearInfoOP(t_tipo.Treal_estado);
      await evaluar_op(arbol.hijos[7], estado, OP3);

      let { fila, columna } = obtener_dimensiones(estado, id_lexema);
      if (
        OP1.tipo == t_tipo.Treal_estado &&
        OP2.tipo == t_tipo.Treal_estado &&
        OP3.tipo == t_tipo.Treal_estado
      ) {
        if (
          OP1.valor > 0 &&
          OP2.valor > 0 &&
          OP1.valor <= fila &&
          OP2.valor <= columna
        ) {
          fila = Math.trunc(OP1.valor);
          columna = Math.trunc(OP2.valor);

          if (
            tipo == t_tipo.Tmatriz_estado &&
            OP3.tipo == t_tipo.Treal_estado
          ) {
            asignar_valor_matriz(estado, OP3.valor, id_lexema, fila, columna);
          } else {
            throw new Error(
              "Tipos incompatibles en la asignación de matriz 1.",
            );
          }
        } else {
          throw new Error("Índices fuera de rango en la asignación de matriz.");
        }
      } else {
        throw new Error("Tipos incompatibles en la asignación de matriz 2.");
      }
      break;
  }
}

// <Asignacin''> :=  <OP> | <CMatriz>
async function evaluar_asignacion_prima_prima(
  arbol: DerivationNode,
  estado: t_estado,
  info: InfoOP,
  id_lexema: string,
) {
  const simbolo = arbol.hijos[0].simbolo;

  switch (simbolo) {
    case TipoSG.Vop:
      await evaluar_op(arbol.hijos[0], estado, info);
      break;
    case TipoSG.Vcmatriz:
      const { fila, columna } = obtener_dimensiones(estado, id_lexema);
      info.tipo = t_tipo.Tmatriz_estado;
      info.valor = Array.from({ length: fila }, () => Array(columna).fill(0));
      await evaluar_cmatriz(arbol.hijos[0], estado, info.valor);
      break;
  }
}

// <OP> ::= <OP2> <OP'>
async function evaluar_op(
  arbol: DerivationNode,
  estado: t_estado,
  info: InfoOP,
) {
  await evaluar_op_2(arbol.hijos[0], estado, info);
  await evaluar_op_prima(arbol.hijos[1], estado, info);
}

// <OP'> ::= "+" <OP2> <OP'> | "-" <OP2> <OP'> | eps
// MATRIZ + MATRIZ || MATRIZ - MATRIZ || REAL + REAL || REAL - REAL
async function evaluar_op_prima(
  arbol: DerivationNode,
  estado: t_estado,
  info: InfoOP,
) {
  if (arbol.hijos.length > 0) {
    const simbolo = arbol.hijos[0].simbolo;

    let info2 = crearInfoOP(info.tipo);

    await evaluar_op_2(arbol.hijos[1], estado, info2);
    if (info.tipo == info2.tipo) {
      switch (simbolo) {
        case TipoSG.Tmas:
          if (
            info.tipo == t_tipo.Treal_estado &&
            info2.tipo == t_tipo.Treal_estado
          ) {
            info.valor += info2.valor;
          } else if (
            info.tipo == t_tipo.Tmatriz_estado &&
            info2.tipo == t_tipo.Tmatriz_estado
          ) {
            info.valor = sumar_matrices(info.valor, info2.valor);
          }
          break;
        case TipoSG.Tmenos:
          if (
            info.tipo == t_tipo.Treal_estado &&
            info2.tipo == t_tipo.Treal_estado
          ) {
            info.valor -= info2.valor;
          } else if (
            info.tipo == t_tipo.Tmatriz_estado &&
            info2.tipo == t_tipo.Tmatriz_estado
          ) {
            info.valor = restar_matrices(info.valor, info2.valor);
          }
      }
    } else {
      throw new Error("Tipos incompatibles en la operación.");
    }
    await evaluar_op_prima(arbol.hijos[2], estado, info);
  }
}

// <OP2> ::= <OP3> <OP2'>
async function evaluar_op_2(
  arbol: DerivationNode,
  estado: t_estado,
  info: InfoOP,
) {
  await evaluar_op_3(arbol.hijos[0], estado, info);
  await evaluar_op_2_prima(arbol.hijos[1], estado, info);
}

// <OP2'> ::= "*" <OP3> <OP2'> | "/" <OP3> <OP2'> | eps
// MATRIZ * MATRIZ  || REAL * REAL || REAL / REAL || MATRIZ * REAL || REAL * MATRIZ
async function evaluar_op_2_prima(
  arbol: DerivationNode,
  estado: t_estado,
  info: InfoOP,
) {
  if (arbol.hijos.length > 0) {
    const simbolo = arbol.hijos[0].simbolo;

    let info2 = crearInfoOP(info.tipo);

    await evaluar_op_3(arbol.hijos[1], estado, info2);

    if (info.tipo == info2.tipo) {
      switch (simbolo) {
        case TipoSG.Tmulti:
          if (
            info.tipo == t_tipo.Treal_estado &&
            info2.tipo == t_tipo.Treal_estado
          ) {
            info.valor *= info2.valor;
          } else if (
            info.tipo == t_tipo.Tmatriz_estado &&
            info2.tipo == t_tipo.Tmatriz_estado
          ) {
            info.valor = multiplicar_matrices(info.valor, info2.valor);
          } else if (
            info.tipo == t_tipo.Treal_estado &&
            info2.tipo == t_tipo.Tmatriz_estado
          ) {
            const aux = crearInfoOP(t_tipo.Tmatriz_estado);
            aux.valor = multiplicar_matriz_por_real(info2.valor, info.valor);
            info = aux;
          } else if (
            info.tipo == t_tipo.Tmatriz_estado &&
            info2.tipo == t_tipo.Treal_estado
          ) {
            info.valor = multiplicar_matriz_por_real(info.valor, info2.valor);
          }
          break;
        case TipoSG.Tdivi:
          if (
            info.tipo == t_tipo.Treal_estado &&
            info2.tipo == t_tipo.Treal_estado
          ) {
            if (info2.valor !== 0) {
              info.valor /= info2.valor;
            } else {
              throw new Error("División por cero.");
            }
          } else {
            throw new Error("Operación inválida entre matrices y reales.");
          }
      }
    } else {
      throw new Error("Tipos incompatibles en la operación.");
    }

    await evaluar_op_2_prima(arbol.hijos[2], estado, info);
  }
}

// <OP3> ::= <OP4> <OP3'>
async function evaluar_op_3(
  arbol: DerivationNode,
  estado: t_estado,
  info: InfoOP,
) {
  await evaluar_op_4(arbol.hijos[0], estado, info);
  await evaluar_op_3_prima(arbol.hijos[1], estado, info);
}

// <OP3'> ::= "^" <OP4> <OP3'> | eps
// REAL ^ REAL || MATRIZ ^ REAL
async function evaluar_op_3_prima(
  arbol: DerivationNode,
  estado: t_estado,
  info: InfoOP,
) {
  if (arbol.hijos.length > 0) {
    let info2 = crearInfoOP(info.tipo);

    await evaluar_op_4(arbol.hijos[1], estado, info2);

    if (
      info.tipo === t_tipo.Treal_estado &&
      info2.tipo === t_tipo.Treal_estado
    ) {
      info.valor = Math.pow(info.valor, info2.valor);
    } else if (
      info.tipo === t_tipo.Tmatriz_estado &&
      info2.tipo === t_tipo.Treal_estado
    ) {
      info.valor = elevar_matriz_a_potencia(info.valor, info2.valor);
    } else {
      throw new Error("Tipos incompatibles para la operación de potencia.");
    }

    await evaluar_op_3_prima(arbol.hijos[2], estado, info);
  }
}

// <OP4> ::= "id" <OP4'> | "creal" | "filas" "(" "id" ")" | "columnas" "(" "id" ")" |
//                   "tras" "(" "id" ")"  | "-" <OP4> | "(" <OP> ")"
async function evaluar_op_4(
  arbol: DerivationNode,
  estado: t_estado,
  info: InfoOP,
) {
  const simbolo = arbol.hijos[0].simbolo;

  switch (simbolo) {
    case TipoSG.Tid:
      const id_lexema = arbol.hijos[0].lexema;
      const tipo = obtener_tipo(estado, id_lexema);
      if (!variable_inicializada(estado, id_lexema)) {
        throw new Error(
          `El identificador ${id_lexema} no ha sido inicializado.`,
        );
      }

      if (tipo == t_tipo.Treal_estado) {
        info.tipo = t_tipo.Treal_estado;
        info.valor = obtener_valor_real(estado, id_lexema);
      } else if (tipo == t_tipo.Tmatriz_estado) {
        info.tipo = t_tipo.Tmatriz_estado;
        info.valor = obtener_valor_matriz(estado, id_lexema);
      } else {
        throw new Error(`El identificador ${id_lexema} no está definido.`);
      }
      await evaluar_op_4_prima(arbol.hijos[1], estado, info);
      break;
    case TipoSG.Tcreal:
      info.tipo = t_tipo.Treal_estado;
      info.valor = pasar_a_real(arbol.hijos[0].lexema);
      break;
    case TipoSG.Tfilas:
      const id_filas = arbol.hijos[2].lexema;
      const filas = obtener_dimensiones(estado, id_filas).fila;
      info.tipo = t_tipo.Treal_estado;
      info.valor = filas;
      break;
    case TipoSG.Tcolumnas:
      const id_columnas = arbol.hijos[2].lexema;
      const columnas = obtener_dimensiones(estado, id_columnas).columna;
      info.tipo = t_tipo.Treal_estado;
      info.valor = columnas;
      break;
    case TipoSG.Ttras:
      const id_tras = arbol.hijos[2].lexema;
      if (!variable_inicializada(estado, id_tras)) {
        throw new Error(`El identificador ${id_tras} no ha sido inicializado.`);
      }
      if (obtener_tipo(estado, id_tras) != t_tipo.Tmatriz_estado) {
        throw new Error(`El identificador ${id_tras} no es una matriz.`);
      }
      info.tipo = t_tipo.Tmatriz_estado;
      info.valor = trasponer_matriz(obtener_valor_matriz(estado, id_tras));
      break;
    case TipoSG.Tmenos:
      await evaluar_op_4(arbol.hijos[1], estado, info);
      if (info.tipo == t_tipo.Treal_estado) {
        info.valor *= -1; // Negar el valor real
      } else if (info.tipo == t_tipo.Tmatriz_estado) {
        info.valor = multiplicar_matriz_por_real(info.valor, -1);
      }
      break;
    case TipoSG.Tparentesisa:
      await evaluar_op(arbol.hijos[1], estado, info);
      break;
  }
}

// <OP4'> ::= "[" <OP> "]" "[" <OP> "]" | eps
async function evaluar_op_4_prima(
  arbol: DerivationNode,
  estado: t_estado,
  info: InfoOP,
) {
  if (arbol.hijos.length > 0) {
    const OP1 = crearInfoOP(t_tipo.Treal_estado);
    await evaluar_op(arbol.hijos[1], estado, OP1);
    const OP2 = crearInfoOP(t_tipo.Treal_estado);
    await evaluar_op(arbol.hijos[4], estado, OP2);

    const OPaux = crearInfoOP(t_tipo.Treal_estado);

    const aux = info;

    if (OP1.tipo == t_tipo.Treal_estado && OP2.tipo == t_tipo.Treal_estado) {
      if (aux.tipo == t_tipo.Tmatriz_estado) {
        const fila = Math.trunc(OP1.valor);
        const columna = Math.trunc(OP2.valor);

        if (fila > 0 && columna > 0) {
          OPaux.valor = aux.valor[fila - 1][columna - 1];
        } else {
          throw new Error("Índices fuera de rango.");
        }
      } else {
        throw new Error("Operación inválida entre reales y matrices.");
      }
    } else {
      throw new Error("Tipos incompatibles en la operación.");
    }

    info.tipo = t_tipo.Treal_estado;
    info.valor = OPaux.valor;
  }
}

// <CMatriz> ::= "[" <Filas> "]"
async function evaluar_cmatriz(
  arbol: DerivationNode,
  estado: t_estado,
  matriz: Matriz,
) {
  let fila_aux = 1;
  let columna_aux = 1;
  await evaluar_filas(arbol.hijos[1], estado, matriz, fila_aux, columna_aux);
}

// <Filas> ::= <Fila> <FilasExtra>
async function evaluar_filas(
  arbol: DerivationNode,
  estado: t_estado,
  matriz: Matriz,
  fila: number,
  columna: number,
) {
  let columnas_aux = 0;
  await evaluar_fila(arbol.hijos[0], estado, matriz, fila, columna);

  if (columnas_aux > 0) {
    if (columna !== columnas_aux) {
      throw new Error("Filas de matriz inconsistente.");
    }
  } else {
    columnas_aux = columna;
  }
  await evaluar_fila_extra(arbol.hijos[1], estado, matriz, fila, columna);
}

// <FilasExtra> ::= "," <Filas> | eps
async function evaluar_fila_extra(
  arbol: DerivationNode,
  estado: t_estado,
  matriz: Matriz,
  fila: number,
  columna: number,
) {
  if (arbol.hijos.length > 0) {
    fila += 1;
    columna = 1;
    await evaluar_filas(arbol.hijos[1], estado, matriz, fila, columna);
  }
}

// <Fila> ::= "[" <Numeros> "]"
async function evaluar_fila(
  arbol: DerivationNode,
  estado: t_estado,
  matriz: Matriz,
  fila: number,
  columna: number,
) {
  await evaluar_numeros(arbol.hijos[1], estado, matriz, fila, columna);
}

// <Numeros> ::= <OP4> <Numeros'>
async function evaluar_numeros(
  arbol: DerivationNode,
  estado: t_estado,
  matriz: Matriz,
  fila: number,
  columna: number,
) {
  const info = crearInfoOP(t_tipo.Treal_estado);
  await evaluar_op_4(arbol.hijos[0], estado, info);

  if (info.tipo == t_tipo.Treal_estado) {
    matriz[fila - 1][columna - 1] = info.valor;
  } else {
    throw new Error("Tipo de dato no válido para la matriz.");
  }
  await evaluar_numeros_prima(arbol.hijos[1], estado, matriz, fila, columna);
}

// <Numeros'> ::= "," <Numeros> | eps
async function evaluar_numeros_prima(
  arbol: DerivationNode,
  estado: t_estado,
  matriz: Matriz,
  fila: number,
  columna: number,
) {
  if (arbol.hijos.length > 0) {
    columna += 1;
    await evaluar_numeros(arbol.hijos[1], estado, matriz, fila, columna);
  }
}

// <Leer> ::= "leer" "(" "cadena" "," "id" ")"
async function evaluar_leer(arbol: DerivationNode, estado: t_estado) {
  throw new Error(
    "La instrucción 'leer' no está disponible en la versión web. Por favor, asigna los valores directamente.",
  );
  /*
    const cadena = arbol.hijos[2].lexema.slice(1, -1);
    const lexema = arbol.hijos[4].lexema;
    const tipo = obtener_tipo(estado, lexema);

    const valorLeido = await leer_entrada(cadena);

    if (tipo == t_tipo.Treal_estado) {
        const info = crearInfoOP(t_tipo.Treal_estado);
        info.valor = pasar_a_real(valorLeido);
        asignar_real(estado, lexema, info.valor);
    } else if (tipo == t_tipo.Tmatriz_estado) {
        const info = crearInfoOP(t_tipo.Tmatriz_estado);
        let respuesta = pasar_a_matriz(valorLeido)

        let esMatriz = respuesta.esMatriz;
        info.valor = respuesta.matriz;
        if (esMatriz) {
            const {fila:fila_c, columna:columna_c} = obtener_dimensiones(estado, lexema);
            if (fila_c > 0 && columna_c > 0 && fila_c <= info.valor.length && columna_c <= info.valor[0].length) {
                asignar_matriz(estado, lexema, info.valor);
            } else {
                throw new Error(`Error de índices en la asignación de ${lexema}`);
            }
        } else {
            throw new Error("Formato de matriz inválido.");
        }
    }
    */
}

// <Escribir> ::= "escribir" "(" <Lista> ")"

async function evaluar_escribir(arbol: DerivationNode, estado: t_estado) {
  const resultado = await evaluar_lista(arbol.hijos[2], estado);

  if (resultado.matrices.length > 0) {
    if (resultado.texto.trim() !== "") {
      console.log(resultado.texto);
    }

    for (const matriz of resultado.matrices) {
      escribirMatriz(matriz);
    }
  } else {
    console.log(resultado.texto);
  }
}

// <Lista> ::= <Elemento> <Lista'>
async function evaluar_lista(
  arbol: DerivationNode,
  estado: t_estado,
): Promise<{ texto: string; matrices: Matriz[] }> {
  let resultado = await evaluar_elemento(arbol.hijos[0], estado);
  let resto = await evaluar_lista_prima(arbol.hijos[1], estado);
  return {
    texto: resultado.texto + resto.texto,
    matrices: resultado.matrices.concat(resto.matrices),
  };
}

// <Lista'> ::= "," <Lista> | ε
async function evaluar_lista_prima(
  arbol: DerivationNode,
  estado: t_estado,
): Promise<{ texto: string; matrices: Matriz[] }> {
  if (arbol.hijos.length > 0) {
    return await evaluar_lista(arbol.hijos[1], estado);
  }
  return { texto: "", matrices: [] };
}

// <Elemento> ::= "cadena" | <OP>
async function evaluar_elemento(
  arbol: DerivationNode,
  estado: t_estado,
): Promise<{ texto: string; matrices: Matriz[] }> {
  const simbolo = arbol.hijos[0].simbolo;
  switch (simbolo) {
    case TipoSG.Tcadena:
      return { texto: arbol.hijos[0].lexema.slice(1, -1) + " ", matrices: [] };
    case TipoSG.Vop:
      let info = crearInfoOP(t_tipo.Treal_estado);
      await evaluar_op(arbol.hijos[0], estado, info);
      if (info.tipo == t_tipo.Treal_estado) {
        return { texto: info.valor + " ", matrices: [] };
      } else if (info.tipo == t_tipo.Tmatriz_estado) {
        return { texto: "", matrices: [info.valor] };
      }
  }
  return { texto: "", matrices: [] };
}

// <Condicional> ::= "if" <Condicion> "{" <Cuerpo> "}" <SiNo>
async function evaluar_condicional(
  arbol: DerivationNode,
  estado: t_estado,
  iteraciones?: { value: number },
) {
  let resultado_condicion: Resultado = { valor: false };

  await evaluar_condicion(arbol.hijos[1], estado, resultado_condicion);

  if (resultado_condicion.valor) {
    await evaluar_cuerpo(arbol.hijos[3], estado, iteraciones);
  } else {
    await evaluar_si_no(arbol.hijos[5], estado, iteraciones);
  }
}

// <SiNo> ::= "else" "{" <Cuerpo> "}" | eps
async function evaluar_si_no(
  arbol: DerivationNode,
  estado: t_estado,
  iteraciones?: { value: number },
) {
  if (arbol.hijos.length > 0) {
    await evaluar_cuerpo(arbol.hijos[2], estado, iteraciones);
  }
}

// <Ciclo> ::= "while" <Condicion> "{" <Cuerpo> "}"
async function evaluar_ciclo(
  arbol: DerivationNode,
  estado: t_estado,
  iteraciones: { value: number },
) {
  let resultado_condicion: Resultado = { valor: false };

  do {
    // Verificar límite de iteraciones antes de cada iteración
    if (iteraciones.value >= max_iteraciones) {
      throw new Error(
        "Bucle infinito detectado: excedido el límite de iteraciones",
      );
    }

    await evaluar_condicion(arbol.hijos[1], estado, resultado_condicion);
    iteraciones.value += 1; // Incrementa el contador de iteraciones

    if (resultado_condicion.valor) {
      await evaluar_cuerpo(arbol.hijos[3], estado);
    }
  } while (resultado_condicion.valor);
}

// <Condicion> ::= "("  <ExpresionL>  ")"
async function evaluar_condicion(
  arbol: DerivationNode,
  estado: t_estado,
  resultado_condicion: Resultado,
) {
  await evaluar_expresion_l(arbol.hijos[1], estado, resultado_condicion);
}

// <ExpresionL> ::= <ExpresionR> <ExpresionL'>
//                | "!" "(" <ExpresionL> ")"
async function evaluar_expresion_l(
  arbol: DerivationNode,
  estado: t_estado,
  resultado_condicion: Resultado,
) {
  const simbolo = arbol.hijos[0].simbolo;

  switch (simbolo) {
    case TipoSG.Vexpresionr:
      await evaluar_expresion_r(arbol.hijos[0], estado, resultado_condicion);
      await evaluar_expresion_l_prima(
        arbol.hijos[1],
        estado,
        resultado_condicion,
      );
      break;
    case TipoSG.Tnot:
      await evaluar_expresion_l(arbol.hijos[2], estado, resultado_condicion);
      resultado_condicion.valor = !resultado_condicion.valor;
      break;
  }
}

// <ExpresionL'> ::= "&&" <ExpresionR> <ExpresionL'>
//                 | "||" <ExpresionR> <ExpresionL'>
//                 | eps
async function evaluar_expresion_l_prima(
  arbol: DerivationNode,
  estado: t_estado,
  resultado_condicion: Resultado,
) {
  if (arbol.hijos.length > 0) {
    let resultado_condicion_der: Resultado = { valor: false };
    const simbolo = arbol.hijos[0].simbolo;

    switch (simbolo) {
      case TipoSG.Tand:
        await evaluar_expresion_r(
          arbol.hijos[1],
          estado,
          resultado_condicion_der,
        );
        resultado_condicion.valor =
          resultado_condicion.valor && resultado_condicion_der.valor;
        break;
      case TipoSG.Tor:
        await evaluar_expresion_r(
          arbol.hijos[1],
          estado,
          resultado_condicion_der,
        );
        resultado_condicion.valor =
          resultado_condicion.valor || resultado_condicion_der.valor;
        break;
    }
    await evaluar_expresion_l_prima(
      arbol.hijos[2],
      estado,
      resultado_condicion,
    );
  }
}

// <ExpresionR> ::= "?" <OP> <Comparacion> <OP> "?" | "(" <ExpresionL> ")"
async function evaluar_expresion_r(
  arbol: DerivationNode,
  estado: t_estado,
  resultado_condicion: Resultado,
) {
  const simbolo = arbol.hijos[0].simbolo;

  switch (simbolo) {
    case TipoSG.Tpregunta:
      const OP1 = crearInfoOP(t_tipo.Treal_estado);
      const OP2 = crearInfoOP(t_tipo.Treal_estado);
      await evaluar_op(arbol.hijos[1], estado, OP1);
      await evaluar_op(arbol.hijos[3], estado, OP2);
      await evaluar_comparacion(arbol.hijos[2], OP1, OP2, resultado_condicion);
      break;
    case TipoSG.Tparentesisa:
      await evaluar_expresion_l(arbol.hijos[1], estado, resultado_condicion);
      break;
  }
}

// <Comparacion> ::= "==" | "!=" | ">" | "<" | " >==" | "<="
async function evaluar_comparacion(
  arbol: DerivationNode,
  OP1: InfoOP,
  OP2: InfoOP,
  resultado_condicion: Resultado,
) {
  if (OP1.tipo !== OP2.tipo) {
    throw new Error("Tipos incompatibles en la comparación.");
  }

  const simbolo = arbol.hijos[0].simbolo;

  switch (simbolo) {
    case TipoSG.Tigual:
      if (OP1.tipo == t_tipo.Treal_estado) {
        resultado_condicion.valor = OP1.valor === OP2.valor;
      } else {
        resultado_condicion.valor =
          JSON.stringify(OP1.valor) === JSON.stringify(OP2.valor);
      }
      break;
    case TipoSG.Tdiferente:
      if (OP1.tipo == t_tipo.Treal_estado) {
        resultado_condicion.valor = OP1.valor !== OP2.valor;
      } else {
        resultado_condicion.valor =
          JSON.stringify(OP1.valor) !== JSON.stringify(OP2.valor);
      }
      break;
    case TipoSG.Tmayor:
      if (OP1.tipo == t_tipo.Treal_estado && OP2.tipo == t_tipo.Treal_estado) {
        resultado_condicion.valor = OP1.valor > OP2.valor;
      } else {
        throw new Error("Operación inválida entre matrices y reales.");
      }
      break;
    case TipoSG.Tmenor:
      if (OP1.tipo == t_tipo.Treal_estado && OP2.tipo == t_tipo.Treal_estado) {
        resultado_condicion.valor = OP1.valor < OP2.valor;
      } else {
        throw new Error("Operación inválida entre matrices y reales.");
      }
      break;
    case TipoSG.Tmayori:
      if (OP1.tipo == t_tipo.Treal_estado && OP2.tipo == t_tipo.Treal_estado) {
        resultado_condicion.valor = OP1.valor >= OP2.valor;
      } else {
        throw new Error("Operación inválida entre matrices y reales.");
      }
      break;
    case TipoSG.Tmenori:
      if (OP1.tipo == t_tipo.Treal_estado && OP2.tipo == t_tipo.Treal_estado) {
        resultado_condicion.valor = OP1.valor <= OP2.valor;
      } else {
        throw new Error("Operación inválida entre matrices y reales.");
      }
      break;
  }
}
