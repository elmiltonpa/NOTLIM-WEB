import { TAarchivo, Tabla_Simbolos, TipoSG } from "./tipos.js";

type SigmaId = "L" | "D" | "O";
type EstadoId = 0 | 1 | 2 | 3;

function carASimboloId(car: string): SigmaId {
  return /[a-zA-Z]/.test(car) ? "L" : /\d/.test(car) ? "D" : "O";
}

export function es_id(
  fuente: TAarchivo,
  control: number,
): { esId: boolean; lexema: string; nuevoControl: number } {
  const delta: Record<EstadoId, Record<SigmaId, EstadoId>> = {
    0: { L: 1, D: 3, O: 3 },
    1: { L: 1, D: 1, O: 2 },
    2: { L: 2, D: 2, O: 2 },
    3: { L: 3, D: 3, O: 3 },
  };

  const F = new Set<EstadoId>([2]);

  let estadoActual: EstadoId = 0;
  let lexema = "";
  let pos = control;

  while (
    estadoActual !== 2 &&
    estadoActual !== 3 &&
    pos < fuente.buffer.length
  ) {
    const car = fuente.buffer[pos];
    const simbolo = carASimboloId(car);
    estadoActual = delta[estadoActual][simbolo];
    pos++;

    if (estadoActual !== 2 && estadoActual !== 3) {
      lexema = lexema + car;
    }
  }

  if (pos >= fuente.buffer.length && estadoActual === 1) {
    estadoActual = 2;
  }

  const esIdentificador = F.has(estadoActual);

  return {
    esId: esIdentificador,
    lexema: esIdentificador ? lexema : "",
    nuevoControl: esIdentificador ? pos - 1 : control,
  };
}

type SigmaReal = "D" | "P" | "O";
type EstadoReal = 0 | 1 | 2 | 3 | 4 | 5;

function carASimboloReal(car: string): SigmaReal {
  switch (true) {
    case /[0-9]/.test(car):
      return "D";
    case car === ".":
      return "P";
    default:
      return "O";
  }
}

export function es_constante_real(
  fuente: TAarchivo,
  control: number,
): { esReal: boolean; lexema: string; nuevoControl: number } {
  const delta: Record<EstadoReal, Record<SigmaReal, EstadoReal>> = {
    0: { D: 1, P: 4, O: 4 },
    1: { D: 1, P: 2, O: 5 },
    2: { D: 3, P: 4, O: 4 },
    3: { D: 3, P: 4, O: 5 },
    4: { D: 4, P: 4, O: 4 },
    5: { D: 5, P: 5, O: 5 },
  };

  const F = new Set<EstadoReal>([5]);

  let estadoActual: EstadoReal = 0;
  let lexema = "";
  let pos = control;

  while (
    estadoActual !== 4 &&
    estadoActual !== 5 &&
    pos < fuente.buffer.length
  ) {
    const car = fuente.buffer[pos];
    const simbolo = carASimboloReal(car);
    estadoActual = delta[estadoActual][simbolo];
    pos++;

    if (estadoActual !== 4 && estadoActual !== 5) {
      lexema += car;
    }
  }

  if (
    pos >= fuente.buffer.length &&
    (estadoActual === 1 || estadoActual === 3)
  ) {
    estadoActual = 5;
  }

  const esReal = F.has(estadoActual);

  return {
    esReal: esReal,
    lexema: esReal ? lexema : "",
    nuevoControl: esReal ? pos - 1 : control,
  };
}

type SigmaCadena = "C" | "O";
type EstadoCadena = 0 | 1 | 2 | 3;

function carASimbolo(car: string): SigmaCadena {
  return car === "'" ? "C" : "O";
}

export function es_cadena(
  fuente: TAarchivo,
  control: number,
): { esCadena: boolean; lexema: string; nuevoControl: number } {
  const delta: Record<EstadoCadena, Record<SigmaCadena, EstadoCadena>> = {
    0: { C: 1, O: 3 },
    1: { C: 2, O: 1 },
    2: { C: 2, O: 2 },
    3: { C: 3, O: 3 },
  };

  let estadoActual: EstadoCadena = 0;
  let lexema = "";
  let pos = control;

  while (
    estadoActual !== 2 &&
    estadoActual !== 3 &&
    pos < fuente.buffer.length
  ) {
    const car = fuente.buffer[pos];
    const simbolo = carASimbolo(car);
    estadoActual = delta[estadoActual][simbolo];
    pos++;

    if (estadoActual in [0, 1, 2]) {
      lexema += car;
    }
  }

  if (pos >= fuente.buffer.length && estadoActual === 1) {
    estadoActual = 3;
  }

  const esCadena = estadoActual === 2;

  return {
    esCadena: esCadena,
    lexema: esCadena ? lexema : "",
    nuevoControl: esCadena ? pos : control,
  };
}

export function es_simbolo_especial(
  fuente: TAarchivo,
  control: number,
): {
  esEspecial: boolean;
  lexema: string;
  nuevoControl: number;
  complex: TipoSG;
} {
  let car = fuente.buffer[control];
  control++;
  let lexema = car;
  let esEspecial = true;
  let complex = TipoSG.ErrorLexico;

  switch (car) {
    case ";":
      complex = TipoSG.Tpuntoyc;
      break;
    case ",":
      complex = TipoSG.Tcoma;
      break;
    case "{":
      complex = TipoSG.Tllavea;
      break;
    case "}":
      complex = TipoSG.Tllavec;
      break;
    case "(":
      complex = TipoSG.Tparentesisa;
      break;
    case ")":
      complex = TipoSG.Tparentesisc;
      break;
    case "[":
      complex = TipoSG.Tcorchetea;
      break;
    case "]":
      complex = TipoSG.Tcorchetec;
      break;
    case "+":
      complex = TipoSG.Tmas;
      break;
    case "-":
      complex = TipoSG.Tmenos;
      break;
    case "*":
      complex = TipoSG.Tmulti;
      break;
    case "/":
      complex = TipoSG.Tdivi;
      break;
    case "^":
      complex = TipoSG.Texpo;
      break;
    case "?":
      complex = TipoSG.Tpregunta;
      break;
    case "&":
      car = fuente.buffer[control];
      if (car === "&") {
        lexema = "&&";
        control++;
        complex = TipoSG.Tand;
      } else {
        control--;
        esEspecial = false;
      }
      break;
    case ":":
      car = fuente.buffer[control];
      if (car === "=") {
        lexema = ":=";
        control++;
        complex = TipoSG.Tasig;
      } else {
        complex = TipoSG.Tdosp;
      }
      break;
    case "=":
      car = fuente.buffer[control];
      if (car === "=") {
        lexema = "==";
        control++;
        complex = TipoSG.Tigual;
      } else {
        control--;
        esEspecial = false;
      }
      break;
    case "!":
      car = fuente.buffer[control];
      if (car === "=") {
        lexema = "!=";
        control++;
        complex = TipoSG.Tdiferente;
      } else {
        complex = TipoSG.Tnot;
      }
      break;
    case "|":
      car = fuente.buffer[control];
      if (car === "|") {
        lexema = "||";
        control++;
        complex = TipoSG.Tor;
      } else {
        control--;
        esEspecial = false;
      }
      break;
    case "<":
      car = fuente.buffer[control];
      if (car === "=") {
        lexema = "<=";
        control++;
        complex = TipoSG.Tmenori;
      } else {
        complex = TipoSG.Tmenor;
      }
      break;
    case ">":
      car = fuente.buffer[control];
      if (car === "=") {
        lexema = ">=";
        control++;
        complex = TipoSG.Tmayori;
      } else {
        complex = TipoSG.Tmayor;
      }
      break;
    default:
      esEspecial = false;
  }

  return {
    esEspecial: esEspecial,
    lexema: esEspecial ? lexema : "",
    nuevoControl: control,
    complex: complex,
  };
}

export function obtener_siguiente_complex(
  fuente: TAarchivo,
  control: number,
  ts: Tabla_Simbolos,
): { control: number; complex: TipoSG; lexema: string } {
  while (
    control < fuente.buffer.length &&
    /[\s\t\n]/.test(fuente.buffer[control])
  ) {
    control++;
  }

  if (control >= fuente.buffer.length) {
    return { control, complex: TipoSG.pesos, lexema: "$" };
  }

  let lexema = "";
  let complex = TipoSG.ErrorLexico;
  const initialControl = control;

  let esId = es_id(fuente, control);
  if (esId.esId) {
    control = esId.nuevoControl;
    lexema = esId.lexema;
    complex = ts.agregarTS(lexema);
  } else {
    let esReal = es_constante_real(fuente, control);
    if (esReal.esReal) {
      lexema = esReal.lexema;
      control = esReal.nuevoControl;
      complex = TipoSG.Tcreal;
    } else {
      let esCadena = es_cadena(fuente, control);
      if (esCadena.esCadena) {
        lexema = esCadena.lexema;
        control = esCadena.nuevoControl;
        complex = TipoSG.Tcadena;
      } else {
        let esEspecial = es_simbolo_especial(fuente, control);
        if (esEspecial.esEspecial) {
          lexema = esEspecial.lexema;
          control = esEspecial.nuevoControl;
          complex = esEspecial.complex;
        }
      }
    }
  }

  if (complex === TipoSG.ErrorLexico) {
    lexema = fuente.buffer[initialControl];
    control = initialControl + 1;
  }

  return {
    control: control,
    complex: complex,
    lexema: lexema,
  };
}
