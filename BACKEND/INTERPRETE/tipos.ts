export enum TipoSG {
  Tprogram = "Tprogram",
  Tid = "Tid",
  Tpuntoyc = "Tpuntoyc",
  Tllavea = "Tllavea",
  Tllavec = "Tllavec",
  Tdef = "Tdef",
  Tdosp = "Tdosp",
  Tmatriz = "Tmatriz",
  Tcorchetea = "Tcorchetea",
  Tcorchetec = "Tcorchetec",
  Treal = "Treal",
  Tasig = "Tasig",
  Tmas = "Tmas",
  Tmenos = "Tmenos",
  Tmulti = "Tmulti",
  Tdivi = "Tdivi",
  Texpo = "Texpo",
  Tcreal = "Tcreal",
  Tfilas = "Tfilas",
  Ttras = "Ttras",
  Tparentesisa = "Tparentesisa",
  Tparentesisc = "Tparentesisc",
  Tcolumnas = "Tcolumnas",
  Tcoma = "Tcoma",
  Tleer = "Tleer",
  Tcadena = "Tcadena",
  Tescribir = "Tescribir",
  Tif = "Tif",
  Telse = "Telse",
  Twhile = "Twhile",
  Tnot = "Tnot",
  Tand = "Tand",
  Tor = "Tor",
  Tigual = "Tigual",
  Tdiferente = "Tdiferente",
  Tmayor = "Tmayor",
  Tmenor = "Tmenor",
  Tmayori = "Tmayori",
  Tpregunta = "Tpregunta",
  Tmenori = "Tmenori",
  pesos = "pesos",
  ErrorLexico = "ErrorLexico",
  Vprograma = "Vprograma",
  Vdefiniciones = "Vdefiniciones",
  Vlistadefiniciones = "Vlistadefiniciones",
  Vmasdefiniciones = "Vmasdefiniciones",
  Vdefinicion = "Vdefinicion",
  Vtipo = "Vtipo",
  Vcuerpo = "Vcuerpo",
  Vsentencias = "Vsentencias",
  Vasignacion = "Vasignacion",
  Vasignacionp = "Vasignacionp",
  Vasignacionpp = "Vasignacionpp",
  Vop = "Vop",
  Vopp = "Vopp",
  Vop2 = "Vop2",
  Vop2p = "Vop2p",
  Vop3 = "Vop3",
  Vop3p = "Vop3p",
  Vop4 = "Vop4",
  Vop4p = "Vop4p",
  Vcmatriz = "Vcmatriz",
  Vfilas = "Vfilas",
  Vfilasextra = "Vfilasextra",
  Vfila = "Vfila",
  Vnumeros = "Vnumeros",
  Vnumerosp = "Vnumerosp",
  Vleer = "Vleer",
  Vescribir = "Vescribir",
  Vlista = "Vlista",
  Vlistap = "Vlistap",
  Velemento = "Velemento",
  Vcondicional = "Vcondicional",
  Vsino = "Vsino",
  Vciclo = "Vciclo",
  Vcondicion = "Vcondicion",
  Vexpresionl = "Vexpresionl",
  Vexpresionlp = "Vexpresionlp",
  Vexpresionr = "Vexpresionr",
  Vcomparacion = "Vcomparacion",
}

export class TAarchivo {
  buffer: string = "";
  position: number = 0;
  eof: boolean = true;

  assign(content: string): void {
    this.buffer = content;
    this.position = 0;
    this.eof = content.length === 0;
  }
}

export interface ElementoTS {
  complex: TipoSG;
  lexema: string;
}

export class Tabla_Simbolos {
  elem: ElementoTS[] = [];
  cant: 0 = 0;

  cargarTS() {
    this.cant++;
    this.elem.push({ lexema: "while", complex: TipoSG.Twhile });

    this.cant++;
    this.elem.push({ lexema: "if", complex: TipoSG.Tif });

    this.cant++;
    this.elem.push({ lexema: "def", complex: TipoSG.Tdef });

    this.cant++;
    this.elem.push({ lexema: "program", complex: TipoSG.Tprogram });

    this.cant++;
    this.elem.push({ lexema: "leer", complex: TipoSG.Tleer });

    this.cant++;
    this.elem.push({ lexema: "escribir", complex: TipoSG.Tescribir });

    this.cant++;
    this.elem.push({ lexema: "else", complex: TipoSG.Telse });

    this.cant++;
    this.elem.push({ lexema: "matriz", complex: TipoSG.Tmatriz });

    this.cant++;
    this.elem.push({ lexema: "real", complex: TipoSG.Treal });

    this.cant++;
    this.elem.push({ lexema: "columnas", complex: TipoSG.Tcolumnas });

    this.cant++;
    this.elem.push({ lexema: "filas", complex: TipoSG.Tfilas });

    this.cant++;
    this.elem.push({ lexema: "tras", complex: TipoSG.Ttras });
  }

  agregarTS(lexema: string): TipoSG {
    let encontrado = false;
    let i = 0;
    let complex: TipoSG = TipoSG.ErrorLexico;

    while (i < this.cant && !encontrado) {
      if (this.elem[i].lexema == lexema) {
        complex = this.elem[i].complex;
        encontrado = true;
      } else {
        i++;
      }
    }

    if (!encontrado) {
      const nuevoElemento: ElementoTS = {
        lexema: lexema,
        complex: TipoSG.Tid,
      };

      this.elem.push(nuevoElemento);
      this.cant++;
      complex = TipoSG.Tid;
    }

    return complex;
  }
}

export interface Produccion {
  elem: TipoSG[];
  cant: number;
}

export class DerivationNode {
  simbolo: string;
  lexema: string;
  hijos: DerivationNode[];

  constructor(simbolo: string = "", lexema: string = "") {
    this.simbolo = simbolo;
    this.lexema = lexema;
    this.hijos = [];
  }

  agregarHijo(hijo: DerivationNode) {
    this.hijos.unshift(hijo);
  }
}

export interface ElementoPila {
  simbolo: TipoSG;
  nArbol: DerivationNode | null;
}

export interface NodoPila {
  info: ElementoPila;
  sig: NodoPila | null;
}

export class Pila {
  tope: NodoPila | null = null;
  tam: number = 0;

  constructor() {
    this.tope = null;
    this.tam = 0;
  }

  apilar(simbolo: TipoSG, nArbol: DerivationNode | null): void {
    const nuevoNodo: NodoPila = {
      info: { simbolo, nArbol },
      sig: this.tope,
    };
    this.tope = nuevoNodo;
    this.tam++;
  }

  desapilar(): ElementoPila {
    if (this.tope === null) {
      throw new Error("Pila vacía");
    }
    const elemento = this.tope.info;
    this.tope = this.tope.sig;
    this.tam--;
    return elemento;
  }
}

export interface Resultado {
  valor: boolean;
}

export enum t_tipo {
  Treal_estado,
  Tmatriz_estado,
}

export type Matriz = number[][];

export interface t_elem_estado {
  id_lexema: string;
  valor_real: number;
  tipo: t_tipo;
  valor_matriz: Matriz;
  dim_fila: number;
  dim_columna: number;
  inicializado: boolean;
}

export interface t_estado {
  elem: t_elem_estado[];
}

export type InfoOP =
  | {
      tipo: t_tipo.Treal_estado;
      valor: number;
    }
  | {
      tipo: t_tipo.Tmatriz_estado;
      valor: Matriz;
    };
