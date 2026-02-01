import {
  DerivationNode,
  Pila,
  Tabla_Simbolos,
  TipoSG,
  ElementoPila,
  TAarchivo,
  Produccion,
} from "./tipos.js";
import { obtener_siguiente_complex } from "./analizador_lexico.js";

function crearNodoArbol(simbolo: TipoSG): DerivationNode {
  return new DerivationNode(simbolo.toString());
}

function apilar_todos(
  celda: Produccion | undefined,
  padre: DerivationNode | null,
  pila: Pila,
): void {
  if (!celda || !padre) return;

  for (let i = celda.cant - 1; i >= 0; i--) {
    const simbolo = celda.elem[i];
    const hijo = crearNodoArbol(simbolo);

    padre.agregarHijo(hijo);

    pila.apilar(simbolo, hijo);
  }
}

export function agregarProduccion(
  variable: string,
  terminal: string,
  produccion: Produccion,
  TAS: Map<string, Map<string, Produccion>>,
) {
  if (!TAS.has(variable)) {
    TAS.set(variable, new Map());
  }
  TAS.get(variable)!.set(terminal, produccion);
}

export function cargarTAS(TAS: Map<string, Map<string, Produccion>>) {
  // Vprograma
  agregarProduccion(
    TipoSG.Vprograma,
    TipoSG.Tprogram,
    {
      elem: [
        TipoSG.Tprogram,
        TipoSG.Tid,
        TipoSG.Tpuntoyc,
        TipoSG.Vdefiniciones,
        TipoSG.Tllavea,
        TipoSG.Vcuerpo,
        TipoSG.Tllavec,
      ],
      cant: 7,
    },
    TAS,
  );

  // Vdefiniciones
  agregarProduccion(
    TipoSG.Vdefiniciones,
    TipoSG.Tllavea,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vdefiniciones,
    TipoSG.Tdef,
    { elem: [TipoSG.Tdef, TipoSG.Vlistadefiniciones], cant: 2 },
    TAS,
  );

  // Vlistadefiniciones
  agregarProduccion(
    TipoSG.Vlistadefiniciones,
    TipoSG.Tid,
    {
      elem: [TipoSG.Vdefinicion, TipoSG.Tpuntoyc, TipoSG.Vmasdefiniciones],
      cant: 3,
    },
    TAS,
  );

  // Vmasdefiniciones
  agregarProduccion(
    TipoSG.Vmasdefiniciones,
    TipoSG.Tid,
    { elem: [TipoSG.Vlistadefiniciones], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vmasdefiniciones,
    TipoSG.Tllavea,
    { elem: [], cant: 0 },
    TAS,
  );

  // Vdefinicion
  agregarProduccion(
    TipoSG.Vdefinicion,
    TipoSG.Tid,
    { elem: [TipoSG.Tid, TipoSG.Tdosp, TipoSG.Vtipo], cant: 3 },
    TAS,
  );

  // Vtipo
  agregarProduccion(
    TipoSG.Vtipo,
    TipoSG.Tmatriz,
    {
      elem: [
        TipoSG.Tmatriz,
        TipoSG.Tcorchetea,
        TipoSG.Tcreal,
        TipoSG.Tcorchetec,
        TipoSG.Tcorchetea,
        TipoSG.Tcreal,
        TipoSG.Tcorchetec,
      ],
      cant: 7,
    },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vtipo,
    TipoSG.Treal,
    { elem: [TipoSG.Treal], cant: 1 },
    TAS,
  );

  // Vcuerpo
  agregarProduccion(
    TipoSG.Vcuerpo,
    TipoSG.Tid,
    { elem: [TipoSG.Vsentencias, TipoSG.Tpuntoyc, TipoSG.Vcuerpo], cant: 3 },
    TAS,
  );
  agregarProduccion(TipoSG.Vcuerpo, TipoSG.Tllavec, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vcuerpo,
    TipoSG.Tleer,
    { elem: [TipoSG.Vsentencias, TipoSG.Tpuntoyc, TipoSG.Vcuerpo], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vcuerpo,
    TipoSG.Tescribir,
    { elem: [TipoSG.Vsentencias, TipoSG.Tpuntoyc, TipoSG.Vcuerpo], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vcuerpo,
    TipoSG.Tif,
    { elem: [TipoSG.Vsentencias, TipoSG.Tpuntoyc, TipoSG.Vcuerpo], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vcuerpo,
    TipoSG.Twhile,
    { elem: [TipoSG.Vsentencias, TipoSG.Tpuntoyc, TipoSG.Vcuerpo], cant: 3 },
    TAS,
  );

  // Vsentencias
  agregarProduccion(
    TipoSG.Vsentencias,
    TipoSG.Tid,
    { elem: [TipoSG.Vasignacion], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vsentencias,
    TipoSG.Tleer,
    { elem: [TipoSG.Vleer], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vsentencias,
    TipoSG.Tescribir,
    { elem: [TipoSG.Vescribir], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vsentencias,
    TipoSG.Tif,
    { elem: [TipoSG.Vcondicional], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vsentencias,
    TipoSG.Twhile,
    { elem: [TipoSG.Vciclo], cant: 1 },
    TAS,
  );

  // Vasignacion
  agregarProduccion(
    TipoSG.Vasignacion,
    TipoSG.Tid,
    { elem: [TipoSG.Tid, TipoSG.Vasignacionp], cant: 2 },
    TAS,
  );

  // Vasignacionp
  agregarProduccion(
    TipoSG.Vasignacionp,
    TipoSG.Tcorchetea,
    {
      elem: [
        TipoSG.Tcorchetea,
        TipoSG.Vop,
        TipoSG.Tcorchetec,
        TipoSG.Tcorchetea,
        TipoSG.Vop,
        TipoSG.Tcorchetec,
        TipoSG.Tasig,
        TipoSG.Vop,
      ],
      cant: 8,
    },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vasignacionp,
    TipoSG.Tasig,
    { elem: [TipoSG.Tasig, TipoSG.Vasignacionpp], cant: 2 },
    TAS,
  );

  // Vasignacionpp
  agregarProduccion(
    TipoSG.Vasignacionpp,
    TipoSG.Tid,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vasignacionpp,
    TipoSG.Tcorchetea,
    { elem: [TipoSG.Vcmatriz], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vasignacionpp,
    TipoSG.Tmenos,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vasignacionpp,
    TipoSG.Tcreal,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vasignacionpp,
    TipoSG.Tfilas,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vasignacionpp,
    TipoSG.Tparentesisa,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vasignacionpp,
    TipoSG.Ttras,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vasignacionpp,
    TipoSG.Tcolumnas,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );

  // Vop
  agregarProduccion(
    TipoSG.Vop,
    TipoSG.Tid,
    { elem: [TipoSG.Vop2, TipoSG.Vopp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop,
    TipoSG.Tmenos,
    { elem: [TipoSG.Vop2, TipoSG.Vopp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop,
    TipoSG.Tcreal,
    { elem: [TipoSG.Vop2, TipoSG.Vopp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop,
    TipoSG.Tfilas,
    { elem: [TipoSG.Vop2, TipoSG.Vopp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop,
    TipoSG.Tparentesisa,
    { elem: [TipoSG.Vop2, TipoSG.Vopp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop,
    TipoSG.Ttras,
    { elem: [TipoSG.Vop2, TipoSG.Vopp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop,
    TipoSG.Tcolumnas,
    { elem: [TipoSG.Vop2, TipoSG.Vopp], cant: 2 },
    TAS,
  );

  // Vopp
  agregarProduccion(TipoSG.Vopp, TipoSG.Tpuntoyc, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vopp, TipoSG.Tcorchetec, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vopp,
    TipoSG.Tmas,
    { elem: [TipoSG.Tmas, TipoSG.Vop2, TipoSG.Vopp], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vopp,
    TipoSG.Tmenos,
    { elem: [TipoSG.Tmenos, TipoSG.Vop2, TipoSG.Vopp], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vopp,
    TipoSG.Tparentesisc,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vopp, TipoSG.Tcoma, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vopp, TipoSG.Tigual, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vopp, TipoSG.Tdiferente, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vopp, TipoSG.Tmayor, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vopp, TipoSG.Tmenor, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vopp, TipoSG.Tmayori, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vopp, TipoSG.Tmenori, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vopp, TipoSG.Tpregunta, { elem: [], cant: 0 }, TAS);

  // Vop2
  agregarProduccion(
    TipoSG.Vop2,
    TipoSG.Tid,
    { elem: [TipoSG.Vop3, TipoSG.Vop2p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop2,
    TipoSG.Tmenos,
    { elem: [TipoSG.Vop3, TipoSG.Vop2p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop2,
    TipoSG.Tcreal,
    { elem: [TipoSG.Vop3, TipoSG.Vop2p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop2,
    TipoSG.Tfilas,
    { elem: [TipoSG.Vop3, TipoSG.Vop2p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop2,
    TipoSG.Tparentesisa,
    { elem: [TipoSG.Vop3, TipoSG.Vop2p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop2,
    TipoSG.Ttras,
    { elem: [TipoSG.Vop3, TipoSG.Vop2p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop2,
    TipoSG.Tcolumnas,
    { elem: [TipoSG.Vop3, TipoSG.Vop2p], cant: 2 },
    TAS,
  );

  // Vop2p
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tpuntoyc, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vop2p,
    TipoSG.Tcorchetec,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tmas, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tmenos, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vop2p,
    TipoSG.Tmulti,
    { elem: [TipoSG.Tmulti, TipoSG.Vop3, TipoSG.Vop2p], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop2p,
    TipoSG.Tdivi,
    { elem: [TipoSG.Tdivi, TipoSG.Vop3, TipoSG.Vop2p], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop2p,
    TipoSG.Tparentesisc,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tcoma, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tigual, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vop2p,
    TipoSG.Tdiferente,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tmayor, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tmenor, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tmayori, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tmenori, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop2p, TipoSG.Tpregunta, { elem: [], cant: 0 }, TAS);

  // Vop3
  agregarProduccion(
    TipoSG.Vop3,
    TipoSG.Tid,
    { elem: [TipoSG.Vop4, TipoSG.Vop3p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop3,
    TipoSG.Tmenos,
    { elem: [TipoSG.Vop4, TipoSG.Vop3p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop3,
    TipoSG.Tcreal,
    { elem: [TipoSG.Vop4, TipoSG.Vop3p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop3,
    TipoSG.Tfilas,
    { elem: [TipoSG.Vop4, TipoSG.Vop3p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop3,
    TipoSG.Tparentesisa,
    { elem: [TipoSG.Vop4, TipoSG.Vop3p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop3,
    TipoSG.Ttras,
    { elem: [TipoSG.Vop4, TipoSG.Vop3p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop3,
    TipoSG.Tcolumnas,
    { elem: [TipoSG.Vop4, TipoSG.Vop3p], cant: 2 },
    TAS,
  );

  // Vop3p
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tpuntoyc, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vop3p,
    TipoSG.Tcorchetec,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tmas, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tmenos, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tmulti, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tdivi, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vop3p,
    TipoSG.Texpo,
    { elem: [TipoSG.Texpo, TipoSG.Vop4, TipoSG.Vop3p], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop3p,
    TipoSG.Tparentesisc,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tcoma, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tigual, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vop3p,
    TipoSG.Tdiferente,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tmayor, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tmenor, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tmayori, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tmenori, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop3p, TipoSG.Tpregunta, { elem: [], cant: 0 }, TAS);

  // Vop4
  agregarProduccion(
    TipoSG.Vop4,
    TipoSG.Tid,
    { elem: [TipoSG.Tid, TipoSG.Vop4p], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop4,
    TipoSG.Tmenos,
    { elem: [TipoSG.Tmenos, TipoSG.Vop4], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop4,
    TipoSG.Tcreal,
    { elem: [TipoSG.Tcreal], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop4,
    TipoSG.Tfilas,
    {
      elem: [
        TipoSG.Tfilas,
        TipoSG.Tparentesisa,
        TipoSG.Tid,
        TipoSG.Tparentesisc,
      ],
      cant: 4,
    },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop4,
    TipoSG.Tparentesisa,
    { elem: [TipoSG.Tparentesisa, TipoSG.Vop, TipoSG.Tparentesisc], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop4,
    TipoSG.Ttras,
    {
      elem: [
        TipoSG.Ttras,
        TipoSG.Tparentesisa,
        TipoSG.Tid,
        TipoSG.Tparentesisc,
      ],
      cant: 4,
    },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop4,
    TipoSG.Tcolumnas,
    {
      elem: [
        TipoSG.Tcolumnas,
        TipoSG.Tparentesisa,
        TipoSG.Tid,
        TipoSG.Tparentesisc,
      ],
      cant: 4,
    },
    TAS,
  );

  // Vop4p
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tpuntoyc, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vop4p,
    TipoSG.Tcorchetea,
    {
      elem: [
        TipoSG.Tcorchetea,
        TipoSG.Vop,
        TipoSG.Tcorchetec,
        TipoSG.Tcorchetea,
        TipoSG.Vop,
        TipoSG.Tcorchetec,
      ],
      cant: 6,
    },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vop4p,
    TipoSG.Tcorchetec,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tmas, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tmenos, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tmulti, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tdivi, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop4p, TipoSG.Texpo, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vop4p,
    TipoSG.Tparentesisc,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tcoma, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tigual, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vop4p,
    TipoSG.Tdiferente,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tmayor, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tmenor, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tmayori, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tmenori, { elem: [], cant: 0 }, TAS);
  agregarProduccion(TipoSG.Vop4p, TipoSG.Tpregunta, { elem: [], cant: 0 }, TAS);

  // Vcmatriz
  agregarProduccion(
    TipoSG.Vcmatriz,
    TipoSG.Tcorchetea,
    { elem: [TipoSG.Tcorchetea, TipoSG.Vfilas, TipoSG.Tcorchetec], cant: 3 },
    TAS,
  );

  // Vfilas
  agregarProduccion(
    TipoSG.Vfilas,
    TipoSG.Tcorchetea,
    { elem: [TipoSG.Vfila, TipoSG.Vfilasextra], cant: 2 },
    TAS,
  );

  // Vfilasextra
  agregarProduccion(
    TipoSG.Vfilasextra,
    TipoSG.Tcorchetec,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vfilasextra,
    TipoSG.Tcoma,
    { elem: [TipoSG.Tcoma, TipoSG.Vfilas], cant: 2 },
    TAS,
  );

  // Vfila
  agregarProduccion(
    TipoSG.Vfila,
    TipoSG.Tcorchetea,
    { elem: [TipoSG.Tcorchetea, TipoSG.Vnumeros, TipoSG.Tcorchetec], cant: 3 },
    TAS,
  );

  // Vnumeros
  agregarProduccion(
    TipoSG.Vnumeros,
    TipoSG.Tid,
    { elem: [TipoSG.Vop4, TipoSG.Vnumerosp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vnumeros,
    TipoSG.Tmenos,
    { elem: [TipoSG.Vop4, TipoSG.Vnumerosp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vnumeros,
    TipoSG.Tcreal,
    { elem: [TipoSG.Vop4, TipoSG.Vnumerosp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vnumeros,
    TipoSG.Tfilas,
    { elem: [TipoSG.Vop4, TipoSG.Vnumerosp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vnumeros,
    TipoSG.Tparentesisa,
    { elem: [TipoSG.Vop4, TipoSG.Vnumerosp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vnumeros,
    TipoSG.Ttras,
    { elem: [TipoSG.Vop4, TipoSG.Vnumerosp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vnumeros,
    TipoSG.Tcolumnas,
    { elem: [TipoSG.Vop4, TipoSG.Vnumerosp], cant: 2 },
    TAS,
  );

  // Vnumerosp
  agregarProduccion(
    TipoSG.Vnumerosp,
    TipoSG.Tcorchetec,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vnumerosp,
    TipoSG.Tcoma,
    { elem: [TipoSG.Tcoma, TipoSG.Vnumeros], cant: 2 },
    TAS,
  );

  // Vleer
  agregarProduccion(
    TipoSG.Vleer,
    TipoSG.Tleer,
    {
      elem: [
        TipoSG.Tleer,
        TipoSG.Tparentesisa,
        TipoSG.Tcadena,
        TipoSG.Tcoma,
        TipoSG.Tid,
        TipoSG.Tparentesisc,
      ],
      cant: 6,
    },
    TAS,
  );

  // Vescribir
  agregarProduccion(
    TipoSG.Vescribir,
    TipoSG.Tescribir,
    {
      elem: [
        TipoSG.Tescribir,
        TipoSG.Tparentesisa,
        TipoSG.Vlista,
        TipoSG.Tparentesisc,
      ],
      cant: 4,
    },
    TAS,
  );

  // Vlista
  agregarProduccion(
    TipoSG.Vlista,
    TipoSG.Tid,
    { elem: [TipoSG.Velemento, TipoSG.Vlistap], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vlista,
    TipoSG.Tmenos,
    { elem: [TipoSG.Velemento, TipoSG.Vlistap], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vlista,
    TipoSG.Tcreal,
    { elem: [TipoSG.Velemento, TipoSG.Vlistap], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vlista,
    TipoSG.Tfilas,
    { elem: [TipoSG.Velemento, TipoSG.Vlistap], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vlista,
    TipoSG.Tparentesisa,
    { elem: [TipoSG.Velemento, TipoSG.Vlistap], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vlista,
    TipoSG.Ttras,
    { elem: [TipoSG.Velemento, TipoSG.Vlistap], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vlista,
    TipoSG.Tcolumnas,
    { elem: [TipoSG.Velemento, TipoSG.Vlistap], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vlista,
    TipoSG.Tcadena,
    { elem: [TipoSG.Velemento, TipoSG.Vlistap], cant: 2 },
    TAS,
  );

  // Vlistap
  agregarProduccion(
    TipoSG.Vlistap,
    TipoSG.Tparentesisc,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vlistap,
    TipoSG.Tcoma,
    { elem: [TipoSG.Tcoma, TipoSG.Vlista], cant: 2 },
    TAS,
  );

  // Velemento
  agregarProduccion(
    TipoSG.Velemento,
    TipoSG.Tid,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Velemento,
    TipoSG.Tmenos,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Velemento,
    TipoSG.Tcreal,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Velemento,
    TipoSG.Tfilas,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Velemento,
    TipoSG.Tparentesisa,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Velemento,
    TipoSG.Ttras,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Velemento,
    TipoSG.Tcolumnas,
    { elem: [TipoSG.Vop], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Velemento,
    TipoSG.Tcadena,
    { elem: [TipoSG.Tcadena], cant: 1 },
    TAS,
  );

  // Vcondicional
  agregarProduccion(
    TipoSG.Vcondicional,
    TipoSG.Tif,
    {
      elem: [
        TipoSG.Tif,
        TipoSG.Vcondicion,
        TipoSG.Tllavea,
        TipoSG.Vcuerpo,
        TipoSG.Tllavec,
        TipoSG.Vsino,
      ],
      cant: 6,
    },
    TAS,
  );

  // Vsino
  agregarProduccion(TipoSG.Vsino, TipoSG.Tpuntoyc, { elem: [], cant: 0 }, TAS);
  agregarProduccion(
    TipoSG.Vsino,
    TipoSG.Telse,
    {
      elem: [TipoSG.Telse, TipoSG.Tllavea, TipoSG.Vcuerpo, TipoSG.Tllavec],
      cant: 4,
    },
    TAS,
  );

  // Vciclo
  agregarProduccion(
    TipoSG.Vciclo,
    TipoSG.Twhile,
    {
      elem: [
        TipoSG.Twhile,
        TipoSG.Vcondicion,
        TipoSG.Tllavea,
        TipoSG.Vcuerpo,
        TipoSG.Tllavec,
      ],
      cant: 5,
    },
    TAS,
  );

  // Vcondicion
  agregarProduccion(
    TipoSG.Vcondicion,
    TipoSG.Tparentesisa,
    {
      elem: [TipoSG.Tparentesisa, TipoSG.Vexpresionl, TipoSG.Tparentesisc],
      cant: 3,
    },
    TAS,
  );

  // Vexpresionl
  agregarProduccion(
    TipoSG.Vexpresionl,
    TipoSG.Tparentesisa,
    { elem: [TipoSG.Vexpresionr, TipoSG.Vexpresionlp], cant: 2 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vexpresionl,
    TipoSG.Tnot,
    {
      elem: [
        TipoSG.Tnot,
        TipoSG.Tparentesisa,
        TipoSG.Vexpresionl,
        TipoSG.Tparentesisc,
      ],
      cant: 4,
    },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vexpresionl,
    TipoSG.Tpregunta,
    { elem: [TipoSG.Vexpresionr, TipoSG.Vexpresionlp], cant: 2 },
    TAS,
  );

  // Vexpresionlp
  agregarProduccion(
    TipoSG.Vexpresionlp,
    TipoSG.Tparentesisc,
    { elem: [], cant: 0 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vexpresionlp,
    TipoSG.Tand,
    { elem: [TipoSG.Tand, TipoSG.Vexpresionr, TipoSG.Vexpresionlp], cant: 3 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vexpresionlp,
    TipoSG.Tor,
    { elem: [TipoSG.Tor, TipoSG.Vexpresionr, TipoSG.Vexpresionlp], cant: 3 },
    TAS,
  );

  // Vexpresionr
  agregarProduccion(
    TipoSG.Vexpresionr,
    TipoSG.Tparentesisa,
    {
      elem: [TipoSG.Tparentesisa, TipoSG.Vexpresionl, TipoSG.Tparentesisc],
      cant: 3,
    },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vexpresionr,
    TipoSG.Tpregunta,
    {
      elem: [
        TipoSG.Tpregunta,
        TipoSG.Vop,
        TipoSG.Vcomparacion,
        TipoSG.Vop,
        TipoSG.Tpregunta,
      ],
      cant: 5,
    },
    TAS,
  );

  // Vcomparacion
  agregarProduccion(
    TipoSG.Vcomparacion,
    TipoSG.Tigual,
    { elem: [TipoSG.Tigual], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vcomparacion,
    TipoSG.Tdiferente,
    { elem: [TipoSG.Tdiferente], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vcomparacion,
    TipoSG.Tmayor,
    { elem: [TipoSG.Tmayor], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vcomparacion,
    TipoSG.Tmenor,
    { elem: [TipoSG.Tmenor], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vcomparacion,
    TipoSG.Tmayori,
    { elem: [TipoSG.Tmayori], cant: 1 },
    TAS,
  );
  agregarProduccion(
    TipoSG.Vcomparacion,
    TipoSG.Tmenori,
    { elem: [TipoSG.Tmenori], cant: 1 },
    TAS,
  );
}

function esVariable(simbolo: TipoSG): boolean {
  const variables: TipoSG[] = [
    TipoSG.Vprograma,
    TipoSG.Vdefiniciones,
    TipoSG.Vlistadefiniciones,
    TipoSG.Vmasdefiniciones,
    TipoSG.Vdefinicion,
    TipoSG.Vtipo,
    TipoSG.Vcuerpo,
    TipoSG.Vsentencias,
    TipoSG.Vasignacion,
    TipoSG.Vasignacionp,
    TipoSG.Vasignacionpp,
    TipoSG.Vop,
    TipoSG.Vopp,
    TipoSG.Vop2,
    TipoSG.Vop2p,
    TipoSG.Vop3,
    TipoSG.Vop3p,
    TipoSG.Vop4,
    TipoSG.Vop4p,
    TipoSG.Vcmatriz,
    TipoSG.Vfilas,
    TipoSG.Vfilasextra,
    TipoSG.Vfila,
    TipoSG.Vnumeros,
    TipoSG.Vnumerosp,
    TipoSG.Vleer,
    TipoSG.Vescribir,
    TipoSG.Vlista,
    TipoSG.Vlistap,
    TipoSG.Velemento,
    TipoSG.Vcondicional,
    TipoSG.Vsino,
    TipoSG.Vciclo,
    TipoSG.Vcondicion,
    TipoSG.Vexpresionl,
    TipoSG.Vexpresionlp,
    TipoSG.Vexpresionr,
    TipoSG.Vcomparacion,
  ];
  return variables.includes(simbolo);
}

function esTerminal(simbolo: TipoSG): boolean {
  const terminales: TipoSG[] = [
    TipoSG.Tprogram,
    TipoSG.Tid,
    TipoSG.Tpuntoyc,
    TipoSG.Tllavea,
    TipoSG.Tllavec,
    TipoSG.Tdef,
    TipoSG.Tdosp,
    TipoSG.Tmatriz,
    TipoSG.Tcorchetea,
    TipoSG.Tcorchetec,
    TipoSG.Treal,
    TipoSG.Tasig,
    TipoSG.Tmas,
    TipoSG.Tmenos,
    TipoSG.Tmulti,
    TipoSG.Tdivi,
    TipoSG.Texpo,
    TipoSG.Tcreal,
    TipoSG.Tfilas,
    TipoSG.Ttras,
    TipoSG.Tparentesisa,
    TipoSG.Tparentesisc,
    TipoSG.Tcolumnas,
    TipoSG.Tcoma,
    TipoSG.Tleer,
    TipoSG.Tcadena,
    TipoSG.Tescribir,
    TipoSG.Tif,
    TipoSG.Telse,
    TipoSG.Twhile,
    TipoSG.Tnot,
    TipoSG.Tand,
    TipoSG.Tor,
    TipoSG.Tigual,
    TipoSG.Tdiferente,
    TipoSG.Tmayor,
    TipoSG.Tmenor,
    TipoSG.Tmayori,
    TipoSG.Tpregunta,
    TipoSG.Tmenori,
  ];
  return terminales.includes(simbolo);
}

export function analizador_predictivo(
  ruta_fuente: string,
  arbol: DerivationNode,
): { error: boolean; message: string } {
  let error: boolean = false;
  let TS = new Tabla_Simbolos();
  let TAS = new Map<string, Map<string, Produccion>>();

  cargarTAS(TAS);

  let pila = new Pila();
  enum tipoEstado {
    proceso,
    error_lexico,
    error_sintactico,
    exito,
  }
  let fuente = new TAarchivo();

  let contenido = ruta_fuente;
  fuente.assign(contenido);

  TS.cargarTS();

  arbol.simbolo = TipoSG.Vprograma.toString();
  arbol.lexema = "";
  arbol.hijos = [];

  let elem: ElementoPila = {
    simbolo: TipoSG.pesos,
    nArbol: null,
  };

  pila.apilar(elem.simbolo, elem.nArbol);

  elem = {
    simbolo: TipoSG.Vprograma,
    nArbol: arbol,
  };
  pila.apilar(elem.simbolo, elem.nArbol);

  let control = 0;
  let resultado = obtener_siguiente_complex(fuente, control, TS);
  let controlNuevo = resultado.control;
  let complex = resultado.complex;
  let lexema = resultado.lexema;
  let estado = tipoEstado.proceso;

  let mensaje = "";

  while (estado == tipoEstado.proceso) {
    elem = pila.desapilar();
    if (esTerminal(elem.simbolo)) {
      if (elem.simbolo == complex) {
        if (elem.nArbol) {
          elem.nArbol.lexema = lexema;
        }
        let resultado = obtener_siguiente_complex(fuente, controlNuevo, TS);
        controlNuevo = resultado.control;
        complex = resultado.complex;
        lexema = resultado.lexema;
      } else {
        estado = tipoEstado.error_sintactico;
        mensaje = `Error sintáctico: se esperaba ${elem.simbolo} pero se encontró ${lexema}`;
        error = true;
      }
    }
    if (esVariable(elem.simbolo)) {
      if (!TAS.get(elem.simbolo)?.get(complex)) {
        estado = tipoEstado.error_sintactico;
        mensaje = `Error sintáctico: no se encontró producción para ${elem.simbolo} con el símbolo ${complex}`;
        error = true;
      } else {
        apilar_todos(TAS.get(elem.simbolo)!.get(complex), elem.nArbol, pila);
      }
    } else {
      if (complex == TipoSG.pesos && elem.simbolo == TipoSG.pesos) {
        estado = tipoEstado.exito;
        error = false;
      }
    }
  }

  return { error, message: mensaje };
}
