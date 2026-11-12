import {
  CATEGORIAS,
  FACTOR_TIPO_ARTICULO,
  FORMATION_RULES,
  PARAMS,
  PUNTOS_ARTICULO,
  PUNTOS_CATEGORIA,
  PUNTOS_FORMACION,
  PUNTOS_PRODUCTO_MAX,
  REGLAS_VERSION,
  TOPE_EXPERIENCIA,
  TOPE_PRODUCTIVIDAD,
  calcularCategoriaAutomatica,
  aniosEntre,
  esTituloIngenieria,
  factorAutores,
  hoyLocalISO,
  horasNum,
  puntajeExperienciaIntervalos,
  r2,
  type Categoria,
  type ClasArticulo,
  type NivelExp,
  type TipoArticulo,
} from "./rules";

// --------------------------- Roles y usuarios ---------------------------

export type Rol = "Digitador" | "Administrador";

export interface UsuarioSistema {
  usuario: string;
  nombre: string;
  correo: string;
  dependencia: string;
  iniciales: string;
  rol: Rol;
}

export const USUARIOS_DEMO: (UsuarioSistema & { pass: string })[] = [
  {
    usuario: "digitador",
    pass: "1234",
    nombre: "Carlos Rueda Mora",
    correo: "crueda@unimilitar.edu.co",
    dependencia: "División de Gestión del Talento Humano",
    iniciales: "CR",
    rol: "Digitador",
  },
  {
    usuario: "admin",
    pass: "1234",
    nombre: "María Fernanda Ospina",
    correo: "mfospina@unimilitar.edu.co",
    dependencia: "División de Gestión del Talento Humano",
    iniciales: "MO",
    rol: "Administrador",
  },
];

// --------------------------- Bitácora ---------------------------

export interface BitacoraEntry {
  usuario: string;
  rol: Rol;
  fecha: string;
  accion: string;
  elemento: string;
  detalle?: string;
}

// --------------------------- Modelos ---------------------------

export type Sede = "Sede Calle 100" | "Sede Cajicá";

// Trazabilidad de la segunda valoración (campos opcionales: los registros
// anteriores sin estos datos se interpretan como "Primer envío" y "Vigente").
export type OrigenEnvio = "primer_envio" | "segundo_envio";
export type EstadoRevision = "vigente" | "no_tenido_en_cuenta" | "reemplazado";

export interface TrazaRevision {
  origenEnvio?: OrigenEnvio;
  estadoRevision?: EstadoRevision;
  reemplazaA?: string; // id del registro del primer envío que corrige/reemplaza
  reemplazadoPor?: string; // id del registro que lo reemplaza
}

export interface Formacion extends TrazaRevision {
  id: string;
  nivel: "" | "Pregrado" | "Especialización" | "Maestría" | "Doctorado";
  institucion: string;
  titulo: string;
  tipo: string;
  aniosDuracion: number;
  fechaGrado: string; // Fecha de finalización (obtención del título)
  observacion?: string;
  relacionDirecta?: boolean;
  // Doctorado: ¿el docente tiene Maestría reconocida? (define el tope 80/120)
  conMaestria?: boolean;
  // Clasificación especial de pregrado
  tipoPregrado?: "Pregrado general" | "Medicina Humana" | "Composición Musical";
  // Especialización: ¿es clínica? (define regla general vs. clínica)
  esEspecializacionClinica?: boolean;
  // Especialización clínica: área que aplica la regla especial (15 pts/año, máx. 75)
  areaClinica?: "Medicina Humana" | "Odontología";
  // Lugar de obtención y convalidación
  lugar?: "Colombia" | "Exterior";
  pais?: string;
  convalidado?: "Sí" | "No";
  // Regla de Ingeniería (por título de pregrado, no por facultad)
  fechaMatriculaProfesional?: string;
}

export interface Experiencia extends TrazaRevision {
  id: string;
  entidad: string;
  cargo: string;
  nivel: NivelExp;
  vinculo: string;
  // "Tiempo parcial" se conserva solo para registros anteriores.
  dedicacion: "Tiempo completo" | "Medio tiempo" | "Horas semanales" | "Tiempo parcial";
  horas: string; // horas semanales
  horasTotales?: string; // total reportado; horas se deriva como promedio semanal
  inicio: string;
  fin: string; // vacío cuando la experiencia continúa actualmente
  actualmente?: boolean; // experiencia vigente (sin fecha de finalización)
  observacion?: string;
}

export interface Producto extends TrazaRevision {
  id: string;
  tipo: string;
  nombre: string;
  autores: number;
  observacion?: string;
  requierePares: boolean;
  conceptoPares?: "Pendiente de concepto" | "Registrado";
  puntajePares?: number;
  clasificacion?: ClasArticulo;
  tipoArticulo?: TipoArticulo;
  issn?: string;
  issnSecundario?: string;
  fecha?: string;
  subtipo?: string;
  impacto?: string;
  reconocido?: number;
  // Ámbito geográfico (solo modalidades que la norma diferencia)
  ambito?: "Nacional" | "Internacional";
  pais?: string;
}

export type EstadoGeneral = "En proceso" | "Completada";

// Instantánea de una valoración cerrada (histórico de la primera valoración).
export interface SnapshotValoracion {
  numero: number;
  fecha: string;
  usuario: string;
  categoria: string;
  puntosCategoria: number;
  formacion: number;
  experiencia: number;
  productividad: number;
  total: number;
  registros: { formacion: number; experiencia: number; productividad: number };
}

export interface Expediente {
  id: string;
  docente: {
    nombre: string;
    identificacion: string;
    facultad: string;
    dedicacion: "Tiempo completo" | "Medio tiempo" | "Horas semanales" | "";
    horasDedicacion?: string;
    sede: Sede | "";
  };
  categoria: Categoria | "";
  formacion: Formacion[];
  experiencia: Experiencia[];
  productividad: Producto[];
  comentario: string;
  // Observaciones dirigidas al profesor (salida "Valoración para el profesor").
  observacionProfesor?: string;
  // Número de valoración en curso (1 = primera, 2 = segunda). Por defecto 1.
  numeroValoracion?: number;
  historial?: SnapshotValoracion[];
  estado: EstadoGeneral;
  reglasVersion: string;
  valorPunto: number;
  creado: string;
  bitacora: BitacoraEntry[];
}

// --------------------------- Helpers ---------------------------

export function fmtFecha(iso: string | undefined): string {
  if (!iso) return "—";
  const s = iso.slice(0, 10);
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function nowStr(): string {
  const ahora = new Date();
  return `${fmtFecha(ahora.toISOString())} ${ahora.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}`;
}

// --------------------------- Cálculo ---------------------------

// Un registro participa en la valoración solo si está vigente.
export function esVigente(r: TrazaRevision): boolean {
  return (r.estadoRevision ?? "vigente") === "vigente";
}

export function origenDe(r: TrazaRevision): OrigenEnvio {
  return r.origenEnvio ?? "primer_envio";
}

// Expediente con solo los registros vigentes (base de todo el cálculo).
export function expedienteVigente(e: Expediente): Expediente {
  return {
    ...e,
    formacion: e.formacion.filter(esVigente),
    experiencia: e.experiencia.filter(esVigente),
    productividad: e.productividad.filter(esVigente),
  };
}

export function enSegundaValoracion(e: Expediente): boolean {
  return (e.numeroValoracion ?? 1) >= 2;
}

// ¿Existe una Maestría reconocida (vigente y no pendiente de convalidación)?
export function tieneMaestriaReconocida(formacion: Formacion[]): boolean {
  return formacion.some((f) => f.nivel === "Maestría" && esVigente(f) && !pendienteConvalidacion(f));
}

// ¿El pregrado requiere fecha de matrícula profesional (título de Ingeniería)?
export function requiereMatricula(f: Pick<Formacion, "nivel" | "titulo">): boolean {
  return f.nivel === "Pregrado" && esTituloIngenieria(f.titulo);
}

export interface FechaMinimaExp {
  fecha: string; // fecha mínima efectiva (ISO)
  motivo: "grado" | "matricula";
  fechaGrado: string;
  fechaMatricula?: string;
}

// Fecha mínima de inicio de la experiencia profesional:
// MAX(fecha de grado del pregrado, fecha de matrícula profesional si aplica).
// Con varios pregrados se toma el que habilita el ejercicio más temprano.
export function fechaMinimaExperiencia(formacion: Formacion[]): FechaMinimaExp | null {
  const opciones = formacion
    .filter((f) => f.nivel === "Pregrado" && f.fechaGrado && esVigente(f))
    .map((f): FechaMinimaExp => {
      const mat = requiereMatricula(f) ? f.fechaMatriculaProfesional : undefined;
      const usaMat = !!mat && mat > f.fechaGrado;
      return {
        fecha: usaMat ? mat! : f.fechaGrado,
        motivo: usaMat ? "matricula" : "grado",
        fechaGrado: f.fechaGrado,
        fechaMatricula: mat,
      };
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
  return opciones[0] ?? null;
}

export function mensajeFechaMinima(m: FechaMinimaExp): string {
  return m.motivo === "matricula"
    ? `Para esta valoración, la experiencia profesional no puede iniciar antes de la fecha de matrícula profesional registrada: ${fmtFecha(m.fecha)}.`
    : `La experiencia profesional no puede iniciar antes de la fecha de grado del pregrado registrada: ${fmtFecha(m.fecha)}.`;
}

// Experiencias vigentes incompatibles con la fecha mínima actual.
export function experienciasIncompatibles(e: Expediente): Experiencia[] {
  const min = fechaMinimaExperiencia(e.formacion);
  if (!min) return [];
  return e.experiencia.filter((x) => esVigente(x) && x.inicio && x.inicio < min.fecha);
}

// Pregrados de Ingeniería sin fecha de matrícula profesional.
export function pregradosSinMatricula(e: Expediente): Formacion[] {
  return e.formacion.filter((f) => esVigente(f) && requiereMatricula(f) && !f.fechaMatriculaProfesional);
}

// Puntaje normativo POTENCIAL de un nivel, sin considerar convalidación.
export function potencialFormacionItem(f: Formacion, tieneMaestria: boolean): number {
  switch (f.nivel) {
    case "Pregrado":
      if (f.relacionDirecta === false) return 0;
      return f.tipoPregrado && f.tipoPregrado !== "Pregrado general"
        ? PUNTOS_FORMACION.pregradoMedicinaOMusica
        : PUNTOS_FORMACION.pregrado;
    case "Especialización": {
      // Clínica (Medicina Humana / Odontología): 15 pts/año, máximo 75.
      if (f.esEspecializacionClinica) {
        return Math.min(
          PUNTOS_FORMACION.especializacionClinicaMax,
          Math.floor(f.aniosDuracion) * PUNTOS_FORMACION.especializacionClinicaPorAnio
        );
      }
      // General: sin duración registrada aporta la base (20 pts). Con más de
      // 2 años, +10 por año adicional; tope 30.
      const dur = f.aniosDuracion ?? 0;
      if (dur <= 2) return 20;
      const extra = (Math.floor(dur) - 2) * 10;
      return Math.min(PUNTOS_FORMACION.especializacionMax, 20 + extra);
    }
    case "Maestría":
      return PUNTOS_FORMACION.maestriaMax;
    case "Doctorado": {
      // El tope depende de si el docente tiene Maestría reconocida, determinado
      // automáticamente a partir de los registros añadidos al expediente.
      return tieneMaestria
        ? PUNTOS_FORMACION.doctoradoMax
        : PUNTOS_FORMACION.doctoradoSinMaestriaMax;
    }
    default:
      return 0;
  }
}

// Etiqueta descriptiva de un registro de formación (tipo · subtipo · duración)
// e indicación de si el puntaje es un tope normativo ("hasta").
export function descFormacion(f: Formacion, tieneMaestria?: boolean): { label: string; hasta: boolean } {
  switch (f.nivel) {
    case "Pregrado":
      return { label: `Pregrado — ${f.tipoPregrado ?? "Pregrado general"}`, hasta: false };
    case "Especialización":
      return f.esEspecializacionClinica
        ? {
            label: `Especialización clínica — ${f.areaClinica ?? "—"}${f.aniosDuracion > 0 ? ` — ${Math.floor(f.aniosDuracion)} año(s)` : ""}`,
            hasta: false,
          }
        : { label: "Especialización normal", hasta: true };
    case "Maestría":
      return { label: "Maestría / Magíster", hasta: true };
    case "Doctorado":
      return {
        label: `Doctorado / Ph.D. — ${(tieneMaestria ?? f.conMaestria) ? "Con" : "Sin"} Maestría reconocida`,
        hasta: true,
      };
    default:
      return { label: f.nivel, hasta: false };
  }
}

// Título obtenido en el exterior aún no convalidado: se conserva pero no
// se incorpora al puntaje reconocido.
export function pendienteConvalidacion(f: Formacion): boolean {
  return f.lugar === "Exterior" && f.convalidado === "No";
}

// Puntaje RECONOCIDO de un nivel (0 si está pendiente de convalidación).
export function reconocidoFormacionItem(f: Formacion, tieneMaestria: boolean): number {
  if (pendienteConvalidacion(f)) return 0;
  return potencialFormacionItem(f, tieneMaestria);
}

// ---------------------------------------------------------------------------
// MOTOR DE COMBINACIONES DE FORMACIÓN ACADÉMICA
// Fuente única de verdad para el cálculo de Formación. Reemplaza la sumatoria
// simple anterior. Separa Pregrado (máx. 183) y Posgrados (máx. global 140),
// resuelve el combo aplicable modificando el valor reconocido de cada título
// según el conjunto, respeta el orden CRONOLÓGICO (fecha de grado) y aplica los
// topes específicos antes del tope global. No modifica los datos del título:
// solo determina el puntaje reconocido y explica cómo se obtuvo.
// ---------------------------------------------------------------------------

export type MotivoNoReconocido =
  | "pendiente"
  | "no-mejor-pregrado"
  | "tope-grupo"
  | "tope-combo"
  | "tope-global"
  | "limite-doctorados"
  | null;

export type GrupoPosgrado = "espNormal" | "maestria" | "clinica" | "doctorado";

export interface DesgloseFormacion {
  id: string;
  nivel: Formacion["nivel"];
  grupo: GrupoPosgrado | "pregrado";
  label: string;
  institucion: string;
  fecha: string;
  potencial: number; // valor si estuviera solo (no se sobrescribe nunca)
  reconocido: number; // valor reconocido en el conjunto
  motivo: MotivoNoReconocido; // por qué no aporta (o aporta menos)
}

export interface SubtotalGrupo {
  potencial: number;
  reconocido: number;
  tope: number;
  presente: boolean;
}

export interface ResultadoFormacion {
  pregrado: { potencial: number; reconocido: number; tope: number };
  grupos: {
    espNormales: SubtotalGrupo;
    maestrias: SubtotalGrupo;
    clinicas: SubtotalGrupo;
    doctorados: SubtotalGrupo;
  };
  reglaAplicada: string;
  topeCombinacion: number;
  posgradoBruto: number; // suma potencial de posgrados
  posgradoReconocido: number;
  topeGlobal: number;
  desglose: DesgloseFormacion[];
  total: number;
}

// Fecha de finalización en ms (para relevancia/recencia). Sin fecha => muy antiguo.
function fechaMs(f: Formacion): number {
  return f.fechaGrado ? +new Date(f.fechaGrado) : -Infinity;
}

function esClinica(f: Formacion): boolean {
  return f.nivel === "Especialización" && !!f.esEspecializacionClinica;
}
function esEspecializacionNormal(f: Formacion): boolean {
  return f.nivel === "Especialización" && !f.esEspecializacionClinica;
}

// Puntaje potencial de una especialización normal (individual, sola).
function potencialEspNormal(f: Formacion): number {
  const R = FORMATION_RULES;
  if (f.aniosDuracion <= 2) return R.ESPECIALIZACION_NORMAL_BASE;
  const extra = (Math.floor(f.aniosDuracion) - 2) * R.ESPECIALIZACION_NORMAL_POR_ANIO_ADICIONAL;
  return Math.min(R.ESPECIALIZACION_NORMAL_MAX, R.ESPECIALIZACION_NORMAL_BASE + extra);
}

// Puntaje potencial de una especialización clínica: 15 pts por AÑO ENTERO
// completo (sin fracciones), tope individual 75.
function potencialClinica(f: Formacion): number {
  const R = FORMATION_RULES;
  return Math.min(R.CLINICA_GRUPO_MAX, Math.floor(f.aniosDuracion) * R.CLINICA_POR_ANIO);
}

// Reduce el total de una lista de ítems de trabajo hasta `cap`, recortando el
// puntaje reconocido de los títulos MÁS ANTIGUOS primero (conserva los más
// recientes). Nunca toca el potencial. Marca el motivo indicado.
interface WItem {
  f: Formacion;
  grupo: GrupoPosgrado;
  potencial: number;
  rec: number;
  motivo: MotivoNoReconocido;
}
function reducir(items: WItem[], cap: number, motivo: MotivoNoReconocido, prioridad?: (i: WItem) => number) {
  let exceso = items.reduce((s, i) => s + i.rec, 0) - cap;
  if (exceso <= 0) return;
  // Recorta primero por prioridad de grupo (si se indica) y, dentro de ella,
  // los títulos más antiguos.
  const orden = [...items].sort((a, b) => {
    if (prioridad) {
      const pa = prioridad(a);
      const pb = prioridad(b);
      if (pa !== pb) return pa - pb;
    }
    return fechaMs(a.f) - fechaMs(b.f);
  });
  for (const it of orden) {
    if (exceso <= 0) break;
    const recorte = Math.min(it.rec, exceso);
    if (recorte > 0) {
      it.rec -= recorte;
      exceso -= recorte;
      if (it.motivo == null) it.motivo = motivo;
    }
  }
}

// ---------------------------------------------------------------------------
// MOTOR CENTRAL — única fuente de verdad del puntaje de Formación académica.
// FASES: obtener → separar pregrado/posgrado → filtrar reconocibles → agrupar
// posgrados → potencial individual → subtotal y tope por grupo → reglas de
// combinación / jerarquía → tope de combinación → distribución (recencia) →
// tope global 140 → tope pregrado 183 → total → desglose explicativo.
// ---------------------------------------------------------------------------
export function motorFormacion(titulos: Formacion[]): ResultadoFormacion {
  const R = FORMATION_RULES;

  // FASE 1–3: separar y filtrar reconocibles (no pendientes de convalidación).
  const reconocibles = titulos.filter((t) => !pendienteConvalidacion(t));
  const hayMaestriaReconocible = reconocibles.some((t) => t.nivel === "Maestría");

  // --- PREGRADO (bloque independiente; conserva la lógica individual) ---
  const pregrados = reconocibles.filter((t) => t.nivel === "Pregrado");
  const pregradoPotenciales = pregrados.map((p) => ({ f: p, pot: potencialFormacionItem(p, hayMaestriaReconocible) }));
  // Solo el pregrado de mayor puntaje se reconoce (desempate: más reciente).
  const mejorPregrado = [...pregradoPotenciales].sort((a, b) => b.pot - a.pot || fechaMs(b.f) - fechaMs(a.f))[0];
  const pregradoPotencial = mejorPregrado ? mejorPregrado.pot : 0;
  const pregradoReconocido = Math.min(pregradoPotencial, R.PREGRADO_MAX);

  // FASE 4: agrupar posgrados. Orden de trabajo: más reciente primero (para
  // conservarlos ante recortes).
  const recientes = (arr: Formacion[]) => [...arr].sort((a, b) => fechaMs(b) - fechaMs(a));
  const espNormales = recientes(reconocibles.filter(esEspecializacionNormal));
  const clinicas = recientes(reconocibles.filter(esClinica));
  const maestrias = recientes(reconocibles.filter((t) => t.nivel === "Maestría"));
  const doctorados = recientes(reconocibles.filter((t) => t.nivel === "Doctorado"));

  const hasEsp = espNormales.length > 0;
  const hasClin = clinicas.length > 0;
  const hasMae = maestrias.length > 0;
  const hasDoc = doctorados.length > 0;

  // FASE 5: potencial individual → ítems de trabajo por grupo.
  const wItems: WItem[] = [];

  espNormales.forEach((f) => {
    const pot = potencialEspNormal(f);
    wItems.push({ f, grupo: "espNormal", potencial: pot, rec: pot, motivo: null });
  });
  clinicas.forEach((f) => {
    const pot = potencialClinica(f);
    wItems.push({ f, grupo: "clinica", potencial: pot, rec: pot, motivo: null });
  });
  // Maestrías: primera (más reciente) 40, siguiente 20, resto 0 (grupo ≤ 60).
  maestrias.forEach((f, i) => {
    const pot = R.MAESTRIA_MAX;
    const rec = i === 0 ? R.MAESTRIA_MAX : i === 1 ? R.SEGUNDA_MAESTRIA : 0;
    wItems.push({ f, grupo: "maestria", potencial: pot, rec, motivo: i > 1 ? "tope-grupo" : null });
  });
  // Doctorados: solo 2 participan (mayor potencial; empate → más reciente).
  const docPotencial = hayMaestriaReconocible ? R.DOCTORADO_CON_MAESTRIA : R.DOCTORADO_SIN_MAESTRIA;
  const docsOrdenados = [...doctorados].sort((a, b) => fechaMs(b) - fechaMs(a)); // ya recientes; potencial igual
  docsOrdenados.forEach((f, i) => {
    const pot = docPotencial;
    let rec = 0;
    let motivo: MotivoNoReconocido = null;
    if (i === 0) rec = docPotencial; // principal (80 con maestría / 120 sin)
    else if (i === 1) rec = R.SEGUNDO_DOCTORADO; // adicional
    else motivo = "limite-doctorados";
    wItems.push({ f, grupo: "doctorado", potencial: pot, rec, motivo });
  });

  // FASE 6–7: subtotales potenciales por grupo y tope interno de cada grupo.
  const porGrupo = (g: GrupoPosgrado) => wItems.filter((i) => i.grupo === g);
  reducir(porGrupo("espNormal"), R.ESP_NORMAL_GRUPO_MAX, "tope-grupo");
  reducir(porGrupo("maestria"), R.MAESTRIA_GRUPO_MAX, "tope-grupo");
  reducir(porGrupo("clinica"), R.CLINICA_GRUPO_MAX, "tope-grupo");

  // FASE 8–11: tope de la combinación (regla específica o jerarquía de grupo
  // superior presente). Las reglas explícitas priman sobre la jerarquía.
  let topeCombinacion: number;
  let reglaAplicada: string;
  if (hasDoc) {
    // Cualquier combinación con Doctorado puede llegar a 140, salvo la regla
    // específica Maestría + un solo Doctorado (sin otros grupos) = 120.
    const soloMaeUnDoc = hasMae && doctorados.length === 1 && !hasEsp && !hasClin;
    topeCombinacion = soloMaeUnDoc ? R.MAESTRIA_MAS_UN_DOCTORADO_MAX : R.POSTGRADO_GLOBAL_MAX;
    reglaAplicada = nombreCombo(hasEsp, hasMae, hasClin, hasDoc, doctorados.length);
  } else if (hasClin) {
    // Grupo superior = Especialización clínica → hasta 75.
    topeCombinacion = R.COMBO_CON_CLINICA_MAX;
    reglaAplicada = nombreCombo(hasEsp, hasMae, hasClin, hasDoc, 0);
  } else if (hasMae) {
    // Especialización(es) + Maestría(s) → 60; Maestría(s) solas → 60 de grupo.
    topeCombinacion = hasEsp ? R.COMBO_ESP_MAESTRIA_MAX : R.MAESTRIA_GRUPO_MAX;
    reglaAplicada = nombreCombo(hasEsp, hasMae, hasClin, hasDoc, 0);
  } else if (hasEsp) {
    topeCombinacion = R.ESP_NORMAL_GRUPO_MAX;
    reglaAplicada = espNormales.length > 1 ? "Especializaciones normales" : "Especialización normal";
  } else {
    topeCombinacion = R.POSTGRADO_GLOBAL_MAX;
    reglaAplicada = "Sin posgrados";
  }

  // FASE 12–14: distribuir el reconocimiento al tope de la combinación
  // recortando por importancia de grupo (esp < clínica < maestría < doctorado)
  // y, dentro de cada grupo, los títulos más antiguos primero.
  const importancia: Record<GrupoPosgrado, number> = { espNormal: 1, clinica: 2, maestria: 3, doctorado: 4 };
  reducir(wItems, topeCombinacion, "tope-combo", (i) => importancia[i.grupo]);
  // FASE 14 bis: tope global absoluto de posgrados.
  reducir(wItems, R.POSTGRADO_GLOBAL_MAX, "tope-global", (i) => importancia[i.grupo]);

  const posgradoReconocido = wItems.reduce((s, i) => s + i.rec, 0);
  const posgradoBruto = wItems.reduce((s, i) => s + i.potencial, 0);

  // Subtotales por grupo (para el detalle del cálculo).
  const subtotal = (g: GrupoPosgrado, tope: number, presente: boolean): SubtotalGrupo => {
    const items = porGrupo(g);
    return {
      potencial: items.reduce((s, i) => s + i.potencial, 0),
      reconocido: items.reduce((s, i) => s + i.rec, 0),
      tope,
      presente,
    };
  };

  // FASE 17: desglose explicativo (orden: pregrado, esp, maestrías, clínicas, doctorados).
  const desglose: DesgloseFormacion[] = [];
  for (const { f, pot } of pregradoPotenciales) {
    const esMejor = mejorPregrado && f.id === mejorPregrado.f.id;
    desglose.push({
      id: f.id,
      nivel: "Pregrado",
      grupo: "pregrado",
      label: descFormacion(f, hayMaestriaReconocible).label,
      institucion: f.institucion,
      fecha: f.fechaGrado,
      potencial: pot,
      reconocido: esMejor ? pregradoReconocido : 0,
      motivo: esMejor ? (pot > pregradoReconocido ? "tope-grupo" : null) : "no-mejor-pregrado",
    });
  }
  const ordenGrupo: GrupoPosgrado[] = ["espNormal", "maestria", "clinica", "doctorado"];
  for (const g of ordenGrupo) {
    for (const it of porGrupo(g)) {
      desglose.push({
        id: it.f.id,
        nivel: it.f.nivel,
        grupo: g,
        label: descFormacion(it.f, hayMaestriaReconocible).label,
        institucion: it.f.institucion,
        fecha: it.f.fechaGrado,
        potencial: it.potencial,
        reconocido: it.rec,
        motivo: it.motivo,
      });
    }
  }
  // Títulos pendientes de convalidación: visibles, 0 reconocido.
  for (const t of titulos.filter((x) => pendienteConvalidacion(x))) {
    desglose.push({
      id: t.id,
      nivel: t.nivel,
      grupo: t.nivel === "Pregrado" ? "pregrado" : t.nivel === "Maestría" ? "maestria" : t.nivel === "Doctorado" ? "doctorado" : esClinica(t) ? "clinica" : "espNormal",
      label: descFormacion(t, hayMaestriaReconocible).label,
      institucion: t.institucion,
      fecha: t.fechaGrado,
      potencial: potencialFormacionItem(t, hayMaestriaReconocible),
      reconocido: 0,
      motivo: "pendiente",
    });
  }

  return {
    pregrado: { potencial: pregradoPotencial, reconocido: pregradoReconocido, tope: R.PREGRADO_MAX },
    grupos: {
      espNormales: subtotal("espNormal", R.ESP_NORMAL_GRUPO_MAX, hasEsp),
      maestrias: subtotal("maestria", R.MAESTRIA_GRUPO_MAX, hasMae),
      clinicas: subtotal("clinica", R.CLINICA_GRUPO_MAX, hasClin),
      doctorados: subtotal("doctorado", R.POSTGRADO_GLOBAL_MAX, hasDoc),
    },
    reglaAplicada,
    topeCombinacion,
    posgradoBruto,
    posgradoReconocido,
    topeGlobal: R.POSTGRADO_GLOBAL_MAX,
    desglose,
    total: r2(pregradoReconocido + posgradoReconocido),
  };
}

// Nombre legible del combo según los grupos presentes.
function nombreCombo(esp: boolean, mae: boolean, clin: boolean, doc: boolean, nDoc: number): string {
  const partes: string[] = [];
  if (esp) partes.push("Especialización");
  if (mae) partes.push("Maestría");
  if (clin) partes.push("Especialización clínica");
  if (doc) partes.push(nDoc > 1 ? "Doctorados" : "Doctorado");
  return partes.join(" + ") || "Posgrados";
}

// Puntaje total de Formación (número). Envuelve el motor central: existe UNA
// sola fuente de verdad para la sumatoria de Formación académica.
export function puntajeFormacion(f: Formacion[]): number {
  return motorFormacion(f).total;
}

export function puntajeCategoria(cat: Categoria | "") {
  return cat ? PUNTOS_CATEGORIA[cat] : 0;
}

// Fecha de fin efectiva para los cálculos: hoy si la experiencia sigue vigente.
export function finEfectivo(e: Experiencia): string {
  return e.actualmente ? hoyLocalISO() : e.fin;
}

export function puntajeExperiencia(exp: Experiencia[], cat: Categoria | "") {
  const tope = cat ? TOPE_EXPERIENCIA[cat] : Infinity;
  return puntajeExperienciaIntervalos(
    exp.map((e) => ({
      id: e.id,
      inicio: e.inicio,
      fin: finEfectivo(e),
      horas: horasNum(e.horas),
      nivel: e.nivel,
    })),
    tope
  );
}

export function puntajeProducto(p: Producto): number {
  if (p.requierePares && p.conceptoPares !== "Registrado") return 0;
  // Para productos que requieren pares y ya tienen concepto registrado,
  // usar el puntaje digitado por los pares si está disponible.
  if (p.requierePares && p.conceptoPares === "Registrado" && p.puntajePares != null) {
    return r2(p.puntajePares * factorAutores(p.autores || 1));
  }
  let base = 0;
  if (p.tipo === "Artículo" && p.clasificacion && p.tipoArticulo) {
    base = PUNTOS_ARTICULO[p.clasificacion] * FACTOR_TIPO_ARTICULO[p.tipoArticulo];
  } else if (p.subtipo && p.subtipo in PUNTOS_PRODUCTO_MAX) {
    const max = PUNTOS_PRODUCTO_MAX[p.subtipo];
    base = p.reconocido != null ? Math.min(p.reconocido, max) : max;
  } else if (p.reconocido != null) {
    base = p.reconocido;
  }
  return r2(base * factorAutores(p.autores || 1));
}

export function puntajeProductividad(prod: Producto[], cat: Categoria | "") {
  let total = 0;
  for (const p of prod) {
    total += puntajeProducto(p);
  }
  total = r2(total);
  const tope = cat ? TOPE_PRODUCTIVIDAD[cat] : Infinity;
  return { valor: Math.min(total, tope), sinTope: total, tope };
}

// Calcula años totales de experiencia (calendario) para determinar la categoría.
function aniosExperiencia(exp: Experiencia[]): number {
  return exp.reduce((s, e) => s + aniosEntre(e.inicio, finEfectivo(e)), 0);
}

export function calcularCategoria(e: Expediente): Categoria {
  const v = expedienteVigente(e);
  return calcularCategoriaAutomatica(v.formacion, aniosExperiencia(v.experiencia));
}

// Resumen de puntaje: solo considera los registros VIGENTES (los marcados como
// "no tenido en cuenta" o "reemplazado" se conservan pero no puntúan).
export function resumenPuntaje(expediente: Expediente) {
  const e = expedienteVigente(expediente);
  const cat = calcularCategoria(e);
  const formacionDetalle = motorFormacion(e.formacion);
  const formacion = formacionDetalle.total;
  const categoria = puntajeCategoria(cat);
  const exp = puntajeExperiencia(e.experiencia, cat);
  const prod = puntajeProductividad(e.productividad, cat);
  const total = r2(formacion + categoria + exp.valor + prod.valor);
  return { formacion, formacionDetalle, categoria, categoriaCalculada: cat, experiencia: exp, productividad: prod, total };
}

// Instantánea del resultado actual (se guarda al iniciar la segunda valoración).
export function snapshotValoracion(e: Expediente, usuario: string): SnapshotValoracion {
  const r = resumenPuntaje(e);
  const v = expedienteVigente(e);
  return {
    numero: e.numeroValoracion ?? 1,
    fecha: nowStr(),
    usuario,
    categoria: r.categoriaCalculada,
    puntosCategoria: r.categoria,
    formacion: r.formacion,
    experiencia: r.experiencia.valor,
    productividad: r.productividad.valor,
    total: r.total,
    registros: { formacion: v.formacion.length, experiencia: v.experiencia.length, productividad: v.productividad.length },
  };
}

// Etiquetas de la convención documental de la segunda valoración.
// NEGRO = primer envío · AZUL = segundo envío · ROJO = no tenido en cuenta.
export function etiquetaRevision(r: TrazaRevision): { label: string; tono: "primer" | "segundo" | "excluido" | "reemplazado" } {
  const est = r.estadoRevision ?? "vigente";
  if (est === "no_tenido_en_cuenta") return { label: "No tenido en cuenta", tono: "excluido" };
  if (est === "reemplazado") return { label: "Reemplazado por corrección", tono: "reemplazado" };
  if (origenDe(r) === "segundo_envio")
    return { label: r.reemplazaA ? "Segundo envío · Corregido" : "Segundo envío", tono: "segundo" };
  return { label: "Primer envío", tono: "primer" };
}

// --------------------------- Datos demo ---------------------------

function bit(accion: string, elemento: string, detalle?: string): BitacoraEntry {
  return {
    usuario: "María Fernanda Ospina",
    rol: "Administrador",
    fecha: "11/08/2026 09:14",
    accion,
    elemento,
    detalle,
  };
}

const demo: Expediente[] = [
  // ── TEST-1001 · Ingeniería de Software · EN PROCESO ──────────────────────
  {
    id: "VAL-2026-0001",
    docente: {
      nombre: "Laura Marcela Rincón Torres",
      identificacion: "TEST-1001",
      facultad: "Facultad de Ingeniería",
      dedicacion: "Tiempo completo",
      sede: "Sede Calle 100",
    },
    categoria: "",
    formacion: [
      {
        id: "f101",
        nivel: "Pregrado",
        institucion: "Universidad Metropolitana de Tecnología",
        titulo: "Ingeniería de Sistemas",
        tipo: "Universitario",
        aniosDuracion: 5,
        fechaGrado: "2009-06-15",
        relacionDirecta: true,
        tipoPregrado: "Pregrado general",
        lugar: "Colombia",
        fechaMatriculaProfesional: "2009-09-10",
      },
      {
        id: "f102",
        nivel: "Maestría",
        institucion: "Universidad Metropolitana de Tecnología",
        titulo: "Maestría en Ingeniería de Software",
        tipo: "Investigación",
        aniosDuracion: 2,
        fechaGrado: "2013-06-20",
        lugar: "Colombia",
      },
    ],
    experiencia: [
      {
        id: "e101",
        entidad: "Universidad Metropolitana de Tecnología",
        cargo: "Docente de planta",
        nivel: "Docencia universitaria",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2014-02-01",
        fin: "2020-01-31",
      },
      {
        id: "e102",
        entidad: "Centro de Investigación en Sistemas",
        cargo: "Investigador",
        nivel: "Investigación",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2020-02-01",
        fin: "2023-01-31",
      },
      {
        id: "e103",
        entidad: "Empresa de Tecnología Nacional S.A.",
        cargo: "Líder de Desarrollo de Software",
        nivel: "Profesional calificada (no docente)",
        vinculo: "Contrato",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2023-02-01",
        fin: "2025-01-31",
      },
    ],
    productividad: [
      {
        id: "p101",
        tipo: "Artículo",
        nombre: "Arquitecturas de microservicios para sistemas distribuidos de alta disponibilidad",
        autores: 2,
        clasificacion: "A1",
        tipoArticulo: "Artículo completo",
        issn: "2711-1001",
        fecha: "2021-05-15",
        requierePares: false,
      },
      {
        id: "p102",
        tipo: "Artículo",
        nombre: "Metodologías ágiles en proyectos de ingeniería de software empresarial",
        autores: 3,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2711-1002",
        fecha: "2022-10-20",
        requierePares: false,
      },
      {
        id: "p103",
        tipo: "Artículo",
        nombre: "Detección de vulnerabilidades en aplicaciones web mediante análisis estático",
        autores: 2,
        clasificacion: "A1",
        tipoArticulo: "Artículo completo",
        issn: "2711-1003",
        fecha: "2024-03-12",
        requierePares: false,
      },
    ],
    comentario: "",
    estado: "En proceso",
    reglasVersion: REGLAS_VERSION,
    valorPunto: PARAMS.valorPuntoConfigurado,
    creado: "2026-09-03",
    bitacora: [
      bit("Creación de expediente", "Datos básicos", "Nombre: Laura Marcela Rincón Torres · Sede: Sede Calle 100"),
      bit("Formación añadida", "Formación", "Ingeniería de Sistemas — Universidad Metropolitana de Tecnología"),
      bit("Formación añadida", "Formación", "Maestría en Ingeniería de Software — Universidad Metropolitana de Tecnología"),
      bit("Experiencia añadida", "Experiencia", "Docente de planta · 2014–2020"),
      bit("Experiencia añadida", "Experiencia", "Investigador · Centro de Investigación en Sistemas (2020–2023)"),
      bit("Experiencia añadida", "Experiencia", "Líder de Desarrollo · Empresa de Tecnología Nacional (2023–2025)"),
      bit("Producto añadido", "Productividad", "Artículo A1: Arquitecturas de microservicios"),
      bit("Producto añadido", "Productividad", "Artículo A2: Metodologías ágiles"),
      bit("Producto añadido", "Productividad", "Artículo A1: Detección de vulnerabilidades en aplicaciones web"),
    ],
  },

  // ── TEST-1002 · Medicina · EN PROCESO ────────────────────────────────────
  {
    id: "VAL-2026-0002",
    docente: {
      nombre: "Andrés Felipe Cárdenas Mejía",
      identificacion: "TEST-1002",
      facultad: "Facultad de Medicina",
      dedicacion: "Tiempo completo",
      sede: "Sede Cajicá",
    },
    categoria: "",
    formacion: [
      {
        id: "f201",
        nivel: "Pregrado",
        institucion: "Universidad Central de Ciencias de la Salud",
        titulo: "Medicina",
        tipo: "Universitario",
        aniosDuracion: 6,
        fechaGrado: "2006-06-20",
        relacionDirecta: true,
        tipoPregrado: "Medicina Humana",
        lugar: "Colombia",
      },
      {
        id: "f202",
        nivel: "Especialización",
        institucion: "Hospital Universitario Nacional",
        titulo: "Especialización en Medicina Interna",
        tipo: "Clínica",
        aniosDuracion: 3,
        fechaGrado: "2010-06-20",
        esEspecializacionClinica: true,
        areaClinica: "Medicina Humana",
        lugar: "Colombia",
      },
      {
        id: "f203",
        nivel: "Especialización",
        institucion: "Universidad de Barcelona",
        titulo: "Especialización Internacional en Cardiología Intervencionista",
        tipo: "Clínica",
        aniosDuracion: 2,
        fechaGrado: "2014-06-15",
        esEspecializacionClinica: true,
        areaClinica: "Medicina Humana",
        lugar: "Exterior",
        pais: "España",
        convalidado: "No",
      },
    ],
    experiencia: [
      {
        id: "e201",
        entidad: "Universidad Central de Ciencias de la Salud",
        cargo: "Docente de medicina",
        nivel: "Docencia universitaria",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2011-01-01",
        fin: "2018-12-31",
      },
      {
        id: "e202",
        entidad: "Instituto Nacional de Salud",
        cargo: "Investigador clínico",
        nivel: "Investigación",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2019-01-01",
        fin: "2021-12-31",
      },
      {
        id: "e203",
        entidad: "Clínica Universitaria del Norte",
        cargo: "Médico internista",
        nivel: "Profesional calificada (no docente)",
        vinculo: "Contrato",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2022-01-01",
        fin: "2024-12-31",
      },
    ],
    productividad: [
      {
        id: "p201",
        tipo: "Artículo",
        nombre: "Factores pronósticos en pacientes con síndrome coronario agudo en unidades de cuidado intensivo",
        autores: 4,
        clasificacion: "A1",
        tipoArticulo: "Artículo completo",
        issn: "2722-2001",
        fecha: "2019-06-14",
        requierePares: false,
      },
      {
        id: "p202",
        tipo: "Artículo",
        nombre: "Prevalencia de resistencia antimicrobiana en hospitales de tercer nivel en Colombia",
        autores: 3,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2722-2002",
        fecha: "2020-09-22",
        requierePares: false,
      },
    ],
    comentario: "",
    estado: "En proceso",
    reglasVersion: REGLAS_VERSION,
    valorPunto: PARAMS.valorPuntoConfigurado,
    creado: "2026-09-03",
    bitacora: [
      bit("Creación de expediente", "Datos básicos", "Nombre: Andrés Felipe Cárdenas Mejía · Sede: Sede Cajicá"),
      bit("Formación añadida", "Formación", "Medicina — Universidad Central de Ciencias de la Salud"),
      bit("Formación añadida", "Formación", "Especialización en Medicina Interna (Clínica, 3 años)"),
      bit("Formación añadida", "Formación", "Especialización Internacional — Exterior, No convalidada"),
      bit("Experiencia añadida", "Experiencia", "Docente de medicina · 2011–2018"),
      bit("Experiencia añadida", "Experiencia", "Investigador clínico · INS (2019–2021)"),
      bit("Experiencia añadida", "Experiencia", "Médico internista · Clínica Universitaria del Norte (2022–2024)"),
      bit("Producto añadido", "Productividad", "Artículo A1: Factores pronósticos en síndrome coronario agudo"),
      bit("Producto añadido", "Productividad", "Artículo A2: Resistencia antimicrobiana en hospitales"),
    ],
  },

  // ── TEST-1003 · Ciencias Sociales · EN PROCESO ───────────────────────────
  {
    id: "VAL-2026-0003",
    docente: {
      nombre: "Natalia Andrea Salazar Gómez",
      identificacion: "TEST-1003",
      facultad: "Facultad de Ciencias Sociales",
      dedicacion: "Tiempo completo",
      sede: "Sede Calle 100",
    },
    categoria: "",
    formacion: [
      {
        id: "f301",
        nivel: "Pregrado",
        institucion: "Universidad Popular de Colombia",
        titulo: "Sociología",
        tipo: "Universitario",
        aniosDuracion: 5,
        fechaGrado: "2012-06-15",
        relacionDirecta: true,
        tipoPregrado: "Pregrado general",
        lugar: "Colombia",
      },
      {
        id: "f302",
        nivel: "Especialización",
        institucion: "Universidad Popular de Colombia",
        titulo: "Especialización en Estudios Sociales",
        tipo: "Especialización",
        aniosDuracion: 1,
        fechaGrado: "2014-06-20",
        esEspecializacionClinica: false,
        lugar: "Colombia",
      },
      {
        id: "f303",
        nivel: "Maestría",
        institucion: "Universidad Latinoamericana de Ciencias Políticas",
        titulo: "Maestría en Estudios Políticos",
        tipo: "Investigación",
        aniosDuracion: 2,
        fechaGrado: "2018-06-20",
        lugar: "Colombia",
      },
    ],
    experiencia: [
      {
        id: "e301",
        entidad: "Universidad Popular de Colombia",
        cargo: "Docente",
        nivel: "Docencia universitaria",
        vinculo: "Planta",
        dedicacion: "Tiempo parcial",
        horas: "20",
        inicio: "2015-01-01",
        fin: "2019-12-31",
      },
      {
        id: "e302",
        entidad: "Centro de Investigación Social",
        cargo: "Investigadora",
        nivel: "Investigación",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2020-01-01",
        fin: "2023-12-31",
      },
      {
        id: "e303",
        entidad: "Universidad Popular de Colombia",
        cargo: "Directora de Programa de Sociología",
        nivel: "Dirección académica",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2024-01-01",
        fin: "2024-12-31",
      },
    ],
    productividad: [
      {
        id: "p301",
        tipo: "Artículo",
        nombre: "Movimientos sociales y transformaciones institucionales en América Latina postpandemia",
        autores: 2,
        clasificacion: "A1",
        tipoArticulo: "Artículo completo",
        issn: "2733-3001",
        fecha: "2021-02-18",
        requierePares: false,
      },
      {
        id: "p302",
        tipo: "Artículo",
        nombre: "Desigualdad estructural y acceso a la educación superior en Colombia",
        autores: 2,
        clasificacion: "A1",
        tipoArticulo: "Artículo completo",
        issn: "2733-3002",
        fecha: "2022-08-10",
        requierePares: false,
      },
      {
        id: "p303",
        tipo: "Artículo",
        nombre: "Representaciones políticas de género en sistemas electorales proporcionales",
        autores: 3,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2733-3003",
        fecha: "2023-04-03",
        requierePares: false,
      },
    ],
    comentario: "",
    estado: "En proceso",
    reglasVersion: REGLAS_VERSION,
    valorPunto: PARAMS.valorPuntoConfigurado,
    creado: "2026-09-03",
    bitacora: [
      bit("Creación de expediente", "Datos básicos", "Nombre: Natalia Andrea Salazar Gómez · Sede: Sede Calle 100"),
      bit("Formación añadida", "Formación", "Sociología — Universidad Popular de Colombia"),
      bit("Formación añadida", "Formación", "Especialización en Estudios Sociales"),
      bit("Formación añadida", "Formación", "Maestría en Estudios Políticos"),
      bit("Experiencia añadida", "Experiencia", "Docente Tiempo Parcial · 2015–2019"),
      bit("Experiencia añadida", "Experiencia", "Investigadora · Centro de Investigación Social (2020–2023)"),
      bit("Experiencia añadida", "Experiencia", "Directora de Programa · 2024"),
      bit("Producto añadido", "Productividad", "Artículo A1: Movimientos sociales y transformaciones"),
      bit("Producto añadido", "Productividad", "Artículo A1: Desigualdad estructural y educación"),
      bit("Producto añadido", "Productividad", "Artículo A2: Representaciones políticas de género"),
    ],
  },

  // ── TEST-1004 · Artes y Humanidades · EN PROCESO ─────────────────────────
  {
    id: "VAL-2026-0004",
    docente: {
      nombre: "Camilo Esteban Pardo León",
      identificacion: "TEST-1004",
      facultad: "Facultad de Artes y Humanidades",
      dedicacion: "Tiempo completo",
      sede: "Sede Cajicá",
    },
    categoria: "",
    formacion: [
      {
        id: "f401",
        nivel: "Pregrado",
        institucion: "Universidad Nacional de Arte y Cultura",
        titulo: "Historia",
        tipo: "Universitario",
        aniosDuracion: 5,
        fechaGrado: "2004-06-20",
        relacionDirecta: true,
        tipoPregrado: "Pregrado general",
        lugar: "Colombia",
      },
      {
        id: "f402",
        nivel: "Maestría",
        institucion: "Universidad Europea de las Artes",
        titulo: "Historia del Arte",
        tipo: "Investigación",
        aniosDuracion: 2,
        fechaGrado: "2008-06-20",
        lugar: "Colombia",
      },
      {
        id: "f403",
        nivel: "Doctorado",
        institucion: "Universidad Europea de las Artes",
        titulo: "Historia Cultural",
        tipo: "Investigación",
        aniosDuracion: 4,
        fechaGrado: "2015-06-20",
        lugar: "Colombia",
      },
    ],
    experiencia: [
      {
        id: "e401",
        entidad: "Universidad Nacional de Arte y Cultura",
        cargo: "Docente de Historia",
        nivel: "Docencia universitaria",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2009-01-01",
        fin: "2018-12-31",
      },
      {
        id: "e402",
        entidad: "Instituto de Investigación en Humanidades",
        cargo: "Investigador senior",
        nivel: "Investigación",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2019-01-01",
        fin: "2024-12-31",
      },
    ],
    productividad: [
      { id: "p401", tipo: "Artículo", nombre: "El barroco como resistencia cultural en el Nuevo Reino de Granada", autores: 1, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4001", fecha: "2010-03-15", requierePares: false },
      { id: "p402", tipo: "Artículo", nombre: "Identidades visuales en la iconografía religiosa colonial colombiana", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4002", fecha: "2011-05-20", requierePares: false },
      { id: "p403", tipo: "Artículo", nombre: "Representaciones del poder en la arquitectura virreinal de Cartagena", autores: 1, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4003", fecha: "2012-07-10", requierePares: false },
      { id: "p404", tipo: "Artículo", nombre: "Arte y memoria colectiva en comunidades afrodescendientes del Pacífico", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4004", fecha: "2013-04-18", requierePares: false },
      { id: "p405", tipo: "Artículo", nombre: "Musealización del patrimonio inmaterial: retos y perspectivas en América Latina", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4005", fecha: "2014-09-05", requierePares: false },
      { id: "p406", tipo: "Artículo", nombre: "Fotografía documental y archivos históricos como fuentes para la historia cultural", autores: 1, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4006", fecha: "2015-02-28", requierePares: false },
      { id: "p407", tipo: "Artículo", nombre: "La novela histórica latinoamericana como recurso pedagógico en educación superior", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4007", fecha: "2015-11-14", requierePares: false },
      { id: "p408", tipo: "Artículo", nombre: "Gráfica urbana y narrativas de conflicto en ciudades intermedias colombianas", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4008", fecha: "2016-06-30", requierePares: false },
      { id: "p409", tipo: "Artículo", nombre: "Festivales de arte contemporáneo como espacios de negociación simbólica", autores: 1, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4009", fecha: "2017-03-22", requierePares: false },
      { id: "p410", tipo: "Artículo", nombre: "Interculturalidad y patrimonio arquitectónico en regiones de frontera", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4010", fecha: "2017-10-08", requierePares: false },
      { id: "p411", tipo: "Artículo", nombre: "Cuerpo, performance y protesta en el arte activista colombiano contemporáneo", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4011", fecha: "2018-05-17", requierePares: false },
      { id: "p412", tipo: "Artículo", nombre: "Resignificación de espacios de memoria en el posconflicto colombiano", autores: 1, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4012", fecha: "2019-01-25", requierePares: false },
      { id: "p413", tipo: "Artículo", nombre: "Estética de la violencia en el cine documental latinoamericano reciente", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4013", fecha: "2019-08-12", requierePares: false },
      { id: "p414", tipo: "Artículo", nombre: "El muralismo como práctica comunitaria en barrios de reubicación urbana", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4014", fecha: "2020-04-06", requierePares: false },
      { id: "p415", tipo: "Artículo", nombre: "Literatura de testimonio y comisiones de verdad: el caso colombiano", autores: 1, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4015", fecha: "2020-11-19", requierePares: false },
      { id: "p416", tipo: "Artículo", nombre: "Archivos sonoros y recuperación de tradiciones orales indígenas", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4016", fecha: "2021-03-30", requierePares: false },
      { id: "p417", tipo: "Artículo", nombre: "Arte digital y nuevas narrativas visuales en la era de la inteligencia artificial", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4017", fecha: "2021-09-14", requierePares: false },
      { id: "p418", tipo: "Artículo", nombre: "Políticas culturales y financiación pública del arte en Colombia 2000–2020", autores: 1, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4018", fecha: "2022-05-07", requierePares: false },
      { id: "p419", tipo: "Artículo", nombre: "Museografía participativa y comunidades locales: modelos de gestión compartida", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4019", fecha: "2023-02-23", requierePares: false },
      { id: "p420", tipo: "Artículo", nombre: "Humanidades digitales y nuevos enfoques en la investigación histórica", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2744-4020", fecha: "2024-01-11", requierePares: false },
    ],
    comentario: "",
    estado: "En proceso",
    reglasVersion: REGLAS_VERSION,
    valorPunto: PARAMS.valorPuntoConfigurado,
    creado: "2026-09-03",
    bitacora: [
      bit("Creación de expediente", "Datos básicos", "Nombre: Camilo Esteban Pardo León · Sede: Sede Cajicá"),
      bit("Formación añadida", "Formación", "Historia — Universidad Nacional de Arte y Cultura"),
      bit("Formación añadida", "Formación", "Maestría en Historia del Arte"),
      bit("Formación añadida", "Formación", "Doctorado en Historia Cultural"),
      bit("Experiencia añadida", "Experiencia", "Docente de Historia · 2009–2018"),
      bit("Experiencia añadida", "Experiencia", "Investigador senior · Instituto de Investigación en Humanidades (2019–2024)"),
      bit("Producto añadido", "Productividad", "20 artículos A1 registrados"),
    ],
  },

  // ── TEST-1005 · Administración · FINALIZADO ──────────────────────────────
  {
    id: "VAL-2026-0005",
    docente: {
      nombre: "Juliana Marcela Herrera Castro",
      identificacion: "TEST-1005",
      facultad: "Facultad de Administración",
      dedicacion: "Tiempo completo",
      sede: "Sede Calle 100",
    },
    categoria: "",
    formacion: [
      {
        id: "f501",
        nivel: "Pregrado",
        institucion: "Universidad de Gestión Empresarial",
        titulo: "Administración de Empresas",
        tipo: "Universitario",
        aniosDuracion: 5,
        fechaGrado: "2005-06-20",
        relacionDirecta: true,
        tipoPregrado: "Pregrado general",
        lugar: "Colombia",
      },
      {
        id: "f502",
        nivel: "Maestría",
        institucion: "Universidad de Gestión Empresarial",
        titulo: "Maestría en Administración",
        tipo: "Investigación",
        aniosDuracion: 2,
        fechaGrado: "2009-06-20",
        lugar: "Colombia",
      },
    ],
    experiencia: [
      {
        id: "e501",
        entidad: "Universidad de Gestión Empresarial",
        cargo: "Docente de Administración",
        nivel: "Docencia universitaria",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2010-01-01",
        fin: "2017-12-31",
      },
      {
        id: "e502",
        entidad: "Universidad de Gestión Empresarial",
        cargo: "Directora de Programa de Administración",
        nivel: "Dirección académica",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2018-01-01",
        fin: "2021-12-31",
      },
      {
        id: "e503",
        entidad: "Consultora Estratégica Nacional S.A.S.",
        cargo: "Consultora senior empresarial",
        nivel: "Profesional calificada (no docente)",
        vinculo: "Contrato",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2022-01-01",
        fin: "2024-12-31",
      },
    ],
    productividad: [
      {
        id: "p501",
        tipo: "Artículo",
        nombre: "Innovación estratégica en pymes colombianas del sector servicios",
        autores: 2,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2755-5001",
        fecha: "2018-03-15",
        requierePares: false,
      },
      {
        id: "p502",
        tipo: "Artículo",
        nombre: "Gobernanza corporativa y rendición de cuentas en organizaciones públicas",
        autores: 3,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2755-5002",
        fecha: "2019-07-22",
        requierePares: false,
      },
      {
        id: "p503",
        tipo: "Artículo",
        nombre: "Transformación digital y cambio organizacional en universidades colombianas",
        autores: 2,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2755-5003",
        fecha: "2021-11-08",
        requierePares: false,
      },
      {
        id: "p504",
        tipo: "Artículo",
        nombre: "Modelos de sostenibilidad financiera en instituciones de educación superior",
        autores: 2,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2755-5004",
        fecha: "2023-04-30",
        requierePares: false,
      },
      {
        id: "p505",
        tipo: "Libro",
        nombre: "Gestión estratégica de organizaciones universitarias",
        autores: 1,
        requierePares: true,
        conceptoPares: "Registrado",
        puntajePares: 27,
        fecha: "2024-05-11",
      },
    ],
    comentario: "Expediente revisado y completado. Concepto de pares registrado para libro derivado de investigación.",
    estado: "Completada",
    reglasVersion: REGLAS_VERSION,
    valorPunto: PARAMS.valorPuntoConfigurado,
    creado: "2026-07-15",
    bitacora: [
      bit("Creación de expediente", "Datos básicos", "Nombre: Juliana Marcela Herrera Castro · Sede: Sede Calle 100"),
      bit("Formación añadida", "Formación", "Administración de Empresas — Universidad de Gestión Empresarial"),
      bit("Formación añadida", "Formación", "Maestría en Administración"),
      bit("Experiencia añadida", "Experiencia", "Docente de Administración · 2010–2017"),
      bit("Experiencia añadida", "Experiencia", "Directora de Programa · 2018–2021"),
      bit("Experiencia añadida", "Experiencia", "Consultora senior · 2022–2024"),
      bit("Producto añadido", "Productividad", "4 artículos A2 registrados"),
      bit("Producto añadido", "Productividad", "Libro: Gestión estratégica de organizaciones universitarias"),
      bit("Concepto de pares registrado", "Productividad", "Libro · Puntaje de pares: 27"),
      bit("Finalización de valoración", "Expediente", "Expediente completado"),
    ],
  },

  // ── TEST-1006 · Ciencias Naturales · FINALIZADO ──────────────────────────
  {
    id: "VAL-2026-0006",
    docente: {
      nombre: "Ricardo Andrés Molina Vélez",
      identificacion: "TEST-1006",
      facultad: "Facultad de Ciencias Naturales",
      dedicacion: "Tiempo completo",
      sede: "Sede Cajicá",
    },
    categoria: "",
    formacion: [
      {
        id: "f601",
        nivel: "Pregrado",
        institucion: "Universidad de Ciencias Exactas y Naturales",
        titulo: "Biología",
        tipo: "Universitario",
        aniosDuracion: 5,
        fechaGrado: "2001-06-20",
        relacionDirecta: true,
        tipoPregrado: "Pregrado general",
        lugar: "Colombia",
      },
      {
        id: "f602",
        nivel: "Maestría",
        institucion: "Universidad de Ciencias Exactas y Naturales",
        titulo: "Maestría en Ciencias Biológicas",
        tipo: "Investigación",
        aniosDuracion: 2,
        fechaGrado: "2005-06-20",
        lugar: "Colombia",
      },
      {
        id: "f603",
        nivel: "Doctorado",
        institucion: "Universidad de Ciencias Exactas y Naturales",
        titulo: "Doctorado en Ciencias Biológicas",
        tipo: "Investigación",
        aniosDuracion: 4,
        fechaGrado: "2011-06-20",
        lugar: "Colombia",
      },
    ],
    experiencia: [
      {
        id: "e601",
        entidad: "Instituto de Investigación en Biodiversidad",
        cargo: "Investigador",
        nivel: "Investigación",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2006-01-01",
        fin: "2015-12-31",
      },
      {
        id: "e602",
        entidad: "Universidad de Ciencias Exactas y Naturales",
        cargo: "Docente de Biología",
        nivel: "Docencia universitaria",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2016-01-01",
        fin: "2025-12-31",
      },
    ],
    productividad: [
      { id: "p601", tipo: "Artículo", nombre: "Diversidad de macroinvertebrados acuáticos en ríos andinos de Colombia", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6001", fecha: "2008-04-10", requierePares: false },
      { id: "p602", tipo: "Artículo", nombre: "Patrones de distribución altitudinal de aves en la Cordillera Central", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6002", fecha: "2009-09-15", requierePares: false },
      { id: "p603", tipo: "Artículo", nombre: "Fragmentación del hábitat y conectividad ecológica en ecosistemas de páramo", autores: 4, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6003", fecha: "2010-06-22", requierePares: false },
      { id: "p604", tipo: "Artículo", nombre: "Bioindicadores de calidad del agua en humedales de la Orinoquia colombiana", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6004", fecha: "2011-03-08", requierePares: false },
      { id: "p605", tipo: "Artículo", nombre: "Microbioma del suelo y fijación biológica de nitrógeno en bosques tropicales", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6005", fecha: "2012-08-17", requierePares: false },
      { id: "p606", tipo: "Artículo", nombre: "Efectos del cambio climático sobre la fenología de plantas altoandinas", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6006", fecha: "2013-05-29", requierePares: false },
      { id: "p607", tipo: "Artículo", nombre: "Genómica comparativa en anfibios amenazados de la Sierra Nevada de Santa Marta", autores: 5, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6007", fecha: "2014-02-11", requierePares: false },
      { id: "p608", tipo: "Artículo", nombre: "Restauración ecológica y banco de semillas en laderas degradadas del trópico", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6008", fecha: "2015-10-04", requierePares: false },
      { id: "p609", tipo: "Artículo", nombre: "Variabilidad genética en poblaciones aisladas de peces endémicos del río Magdalena", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6009", fecha: "2016-07-19", requierePares: false },
      { id: "p610", tipo: "Artículo", nombre: "Respuestas fisiológicas de plantas C4 ante escenarios de estrés hídrico", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6010", fecha: "2017-04-26", requierePares: false },
      { id: "p611", tipo: "Artículo", nombre: "Estructura y función de redes tróficas en lagunas costeras del Caribe colombiano", autores: 4, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6011", fecha: "2018-01-14", requierePares: false },
      { id: "p612", tipo: "Artículo", nombre: "Diversidad de hongos ectomicorrícicos en plantaciones de pino y eucalipto", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6012", fecha: "2019-09-03", requierePares: false },
      { id: "p613", tipo: "Artículo", nombre: "Modelado de nichos ecológicos para especies invasoras en humedales tropicales", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6013", fecha: "2020-06-07", requierePares: false },
      { id: "p614", tipo: "Artículo", nombre: "Metagenómica y diversidad microbiana en suelos de alta montaña colombiana", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6014", fecha: "2021-03-23", requierePares: false },
      { id: "p615", tipo: "Artículo", nombre: "Conectividad ecológica y flujo génico en poblaciones de mamíferos medianos", autores: 4, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2766-6015", fecha: "2022-11-10", requierePares: false },
      { id: "p616", tipo: "Artículo", nombre: "Monitoreo participativo de biodiversidad con comunidades rurales en el Chocó", autores: 3, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2766-6016", fecha: "2008-11-25", requierePares: false },
      { id: "p617", tipo: "Artículo", nombre: "Etología de primates neotropicales en ambientes fragmentados", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2766-6017", fecha: "2010-08-13", requierePares: false },
      { id: "p618", tipo: "Artículo", nombre: "Respuestas conductuales de reptiles ante perturbaciones sonoras antropogénicas", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2766-6018", fecha: "2012-04-07", requierePares: false },
      { id: "p619", tipo: "Artículo", nombre: "Biología reproductiva de tortugas marinas en playas del Pacífico colombiano", autores: 3, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2766-6019", fecha: "2014-07-31", requierePares: false },
      { id: "p620", tipo: "Artículo", nombre: "Efectos del ruido urbano sobre la comunicación acústica de aves urbanas", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2766-6020", fecha: "2016-12-18", requierePares: false },
      { id: "p621", tipo: "Artículo", nombre: "Asociaciones simbióticas entre invertebrados marinos y bacterias bioluminiscentes", autores: 4, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2766-6021", fecha: "2018-05-09", requierePares: false },
      { id: "p622", tipo: "Artículo", nombre: "Polinización y redes mutualistas en agroecosistemas cafeteros del Eje Cafetero", autores: 3, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2766-6022", fecha: "2020-02-27", requierePares: false },
      { id: "p623", tipo: "Artículo", nombre: "Fenología reproductiva de árboles maderables en bosques de galería", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2766-6023", fecha: "2023-08-15", requierePares: false },
    ],
    comentario: "Expediente completo con productividad académica extensa. Tope de productividad aplicado según categoría calculada.",
    estado: "Completada",
    reglasVersion: REGLAS_VERSION,
    valorPunto: PARAMS.valorPuntoConfigurado,
    creado: "2026-06-21",
    bitacora: [
      bit("Creación de expediente", "Datos básicos", "Nombre: Ricardo Andrés Molina Vélez · Sede: Sede Cajicá"),
      bit("Formación añadida", "Formación", "Biología, Maestría en Ciencias Biológicas, Doctorado en Ciencias Biológicas"),
      bit("Experiencia añadida", "Experiencia", "Investigador · Instituto de Investigación en Biodiversidad (2006–2015)"),
      bit("Experiencia añadida", "Experiencia", "Docente · Universidad de Ciencias Exactas (2016–2025)"),
      bit("Producto añadido", "Productividad", "15 artículos A1 + 8 artículos A2 registrados"),
      bit("Finalización de valoración", "Expediente", "Expediente completado. Tope de productividad verificado."),
    ],
  },

  // ── TEST-1007 · Educación · FINALIZADO ───────────────────────────────────
  {
    id: "VAL-2026-0007",
    docente: {
      nombre: "María Fernanda Torres Ruiz",
      identificacion: "TEST-1007",
      facultad: "Facultad de Educación",
      dedicacion: "Medio tiempo",
      sede: "Sede Calle 100",
    },
    categoria: "",
    formacion: [
      {
        id: "f701",
        nivel: "Pregrado",
        institucion: "Universidad Pedagógica Regional",
        titulo: "Licenciatura en Educación",
        tipo: "Universitario",
        aniosDuracion: 5,
        fechaGrado: "2008-06-20",
        relacionDirecta: true,
        tipoPregrado: "Pregrado general",
        lugar: "Colombia",
      },
      {
        id: "f702",
        nivel: "Especialización",
        institucion: "Universidad Pedagógica Regional",
        titulo: "Especialización en Pedagogía",
        tipo: "Especialización",
        aniosDuracion: 1,
        fechaGrado: "2011-06-20",
        esEspecializacionClinica: false,
        lugar: "Colombia",
      },
      {
        id: "f703",
        nivel: "Maestría",
        institucion: "Universidad Pedagógica Regional",
        titulo: "Maestría en Educación",
        tipo: "Investigación",
        aniosDuracion: 2,
        fechaGrado: "2015-06-20",
        lugar: "Colombia",
      },
    ],
    experiencia: [
      {
        id: "e701",
        entidad: "Universidad Pedagógica Regional",
        cargo: "Docente de Educación",
        nivel: "Docencia universitaria",
        vinculo: "Planta",
        dedicacion: "Tiempo parcial",
        horas: "20",
        inicio: "2012-01-01",
        fin: "2019-12-31",
      },
      {
        id: "e702",
        entidad: "Centro de Investigación Pedagógica",
        cargo: "Investigadora en didáctica",
        nivel: "Investigación",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2021-01-01",
        fin: "2024-12-31",
      },
    ],
    productividad: [
      {
        id: "p701",
        tipo: "Artículo",
        nombre: "Pedagogía crítica y formación ciudadana en la escuela secundaria colombiana",
        autores: 2,
        clasificacion: "A1",
        tipoArticulo: "Artículo completo",
        issn: "2777-7001",
        fecha: "2018-04-12",
        requierePares: false,
      },
      {
        id: "p702",
        tipo: "Artículo",
        nombre: "Evaluación formativa y aprendizaje autorregulado en educación superior",
        autores: 3,
        clasificacion: "A1",
        tipoArticulo: "Artículo completo",
        issn: "2777-7002",
        fecha: "2021-09-18",
        requierePares: false,
      },
      {
        id: "p703",
        tipo: "Artículo",
        nombre: "Tecnologías emergentes y mediaciones pedagógicas en entornos virtuales de aprendizaje",
        autores: 2,
        clasificacion: "A1",
        tipoArticulo: "Artículo completo",
        issn: "2777-7003",
        fecha: "2023-06-05",
        requierePares: false,
      },
      {
        id: "p704",
        tipo: "Artículo",
        nombre: "Inclusión educativa y diversidad funcional en aulas universitarias colombianas",
        autores: 2,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2777-7004",
        fecha: "2017-02-28",
        requierePares: false,
      },
      {
        id: "p705",
        tipo: "Artículo",
        nombre: "Currículum oculto y reproducción de desigualdades de género en la educación media",
        autores: 3,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2777-7005",
        fecha: "2019-07-14",
        requierePares: false,
      },
      {
        id: "p706",
        tipo: "Artículo",
        nombre: "Aprendizaje basado en proyectos en programas de licenciatura en matemáticas",
        autores: 2,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2777-7006",
        fecha: "2020-11-03",
        requierePares: false,
      },
      {
        id: "p707",
        tipo: "Artículo",
        nombre: "Formación docente continua y desarrollo profesional en instituciones públicas",
        autores: 2,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2777-7007",
        fecha: "2022-03-21",
        requierePares: false,
      },
      {
        id: "p708",
        tipo: "Artículo",
        nombre: "Prácticas de lectura y escritura académica en estudiantes de primer semestre",
        autores: 3,
        clasificacion: "A2",
        tipoArticulo: "Artículo completo",
        issn: "2777-7008",
        fecha: "2023-10-09",
        requierePares: false,
      },
    ],
    comentario: "Expediente completado. Dedicación: Medio tiempo.",
    estado: "Completada",
    reglasVersion: REGLAS_VERSION,
    valorPunto: PARAMS.valorPuntoConfigurado,
    creado: "2026-05-02",
    bitacora: [
      bit("Creación de expediente", "Datos básicos", "Nombre: María Fernanda Torres Ruiz · Sede: Sede Calle 100"),
      bit("Formación añadida", "Formación", "Licenciatura en Educación, Especialización en Pedagogía, Maestría en Educación"),
      bit("Experiencia añadida", "Experiencia", "Docente Medio Tiempo · 2012–2019"),
      bit("Experiencia añadida", "Experiencia", "Investigadora en didáctica · 2021–2024"),
      bit("Producto añadido", "Productividad", "3 artículos A1 + 5 artículos A2 registrados"),
      bit("Finalización de valoración", "Expediente", "Expediente completado."),
    ],
  },

  // ── TEST-1008 · Ingeniería Industrial · FINALIZADO ────────────────────────
  {
    id: "VAL-2026-0008",
    docente: {
      nombre: "Santiago Alejandro Gómez Restrepo",
      identificacion: "TEST-1008",
      facultad: "Facultad de Ingeniería Industrial",
      dedicacion: "Tiempo completo",
      sede: "Sede Calle 100",
    },
    categoria: "",
    formacion: [
      {
        id: "f801",
        nivel: "Pregrado",
        institucion: "Universidad Industrial del Sur",
        titulo: "Ingeniería Industrial",
        tipo: "Universitario",
        aniosDuracion: 5,
        fechaGrado: "1998-06-20",
        relacionDirecta: true,
        tipoPregrado: "Pregrado general",
        lugar: "Colombia",
        fechaMatriculaProfesional: "1998-10-01",
      },
      {
        id: "f802",
        nivel: "Especialización",
        institucion: "Universidad Industrial del Sur",
        titulo: "Especialización en Gestión de Proyectos",
        tipo: "Especialización",
        aniosDuracion: 1,
        fechaGrado: "2001-06-20",
        esEspecializacionClinica: false,
        lugar: "Colombia",
      },
      {
        id: "f803",
        nivel: "Maestría",
        institucion: "Universidad Industrial del Sur",
        titulo: "Maestría en Ingeniería Industrial",
        tipo: "Investigación",
        aniosDuracion: 2,
        fechaGrado: "2004-06-20",
        lugar: "Colombia",
      },
      {
        id: "f804",
        nivel: "Doctorado",
        institucion: "Universidad Industrial del Sur",
        titulo: "Doctorado en Ingeniería",
        tipo: "Investigación",
        aniosDuracion: 4,
        fechaGrado: "2010-06-20",
        lugar: "Colombia",
      },
    ],
    experiencia: [
      {
        id: "e801",
        entidad: "Universidad Industrial del Sur",
        cargo: "Docente de Ingeniería Industrial",
        nivel: "Docencia universitaria",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2005-01-01",
        fin: "2015-12-31",
      },
      {
        id: "e802",
        entidad: "Centro de Investigación en Producción e Innovación",
        cargo: "Investigador principal",
        nivel: "Investigación",
        vinculo: "Planta",
        dedicacion: "Tiempo completo",
        horas: "40",
        inicio: "2016-01-01",
        fin: "2025-12-31",
      },
    ],
    productividad: [
      { id: "p801", tipo: "Artículo", nombre: "Optimización de cadenas de suministro mediante algoritmos evolutivos multiobjetivo", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8001", fecha: "2006-03-14", requierePares: false },
      { id: "p802", tipo: "Artículo", nombre: "Simulación de sistemas productivos flexibles con lógica difusa", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8002", fecha: "2007-07-28", requierePares: false },
      { id: "p803", tipo: "Artículo", nombre: "Modelado estocástico de inventarios con demanda variable en manufactura", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8003", fecha: "2008-11-05", requierePares: false },
      { id: "p804", tipo: "Artículo", nombre: "Programación de máquinas paralelas con tiempos de preparación dependientes", autores: 4, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8004", fecha: "2009-04-17", requierePares: false },
      { id: "p805", tipo: "Artículo", nombre: "Lean manufacturing y reducción de desperdicios en industria metalmecánica", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8005", fecha: "2010-09-30", requierePares: false },
      { id: "p806", tipo: "Artículo", nombre: "Diseño de experimentos para optimización de procesos de inyección de plástico", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8006", fecha: "2011-02-22", requierePares: false },
      { id: "p807", tipo: "Artículo", nombre: "Integración de sistemas de información y gestión por procesos en empresas manufactureras", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8007", fecha: "2012-06-11", requierePares: false },
      { id: "p808", tipo: "Artículo", nombre: "Confiabilidad de sistemas reparables mediante redes de Petri estocásticas", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8008", fecha: "2013-10-19", requierePares: false },
      { id: "p809", tipo: "Artículo", nombre: "Industria 4.0 y digitalización de procesos en pymes colombianas del sector textil", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8009", fecha: "2014-03-07", requierePares: false },
      { id: "p810", tipo: "Artículo", nombre: "Eficiencia energética en plantas industriales mediante monitoreo inteligente", autores: 4, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8010", fecha: "2015-08-24", requierePares: false },
      { id: "p811", tipo: "Artículo", nombre: "Gestión de riesgos en proyectos de construcción con metodología Monte Carlo", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8011", fecha: "2016-01-16", requierePares: false },
      { id: "p812", tipo: "Artículo", nombre: "Sistemas de manufactura reconfigurables y adaptabilidad productiva", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8012", fecha: "2017-05-03", requierePares: false },
      { id: "p813", tipo: "Artículo", nombre: "Análisis de ciclo de vida y huella de carbono en procesos de ensamble automotriz", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8013", fecha: "2018-09-12", requierePares: false },
      { id: "p814", tipo: "Artículo", nombre: "Automatización de líneas de producción con robots colaborativos en PYMES", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8014", fecha: "2019-04-25", requierePares: false },
      { id: "p815", tipo: "Artículo", nombre: "Planificación de la producción con restricciones de capacidad mediante programación entera", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8015", fecha: "2020-02-14", requierePares: false },
      { id: "p816", tipo: "Artículo", nombre: "Optimización de rutas de distribución urbana con vehículos eléctricos", autores: 4, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8016", fecha: "2021-07-08", requierePares: false },
      { id: "p817", tipo: "Artículo", nombre: "Modelos predictivos de fallas en equipos críticos mediante machine learning", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8017", fecha: "2022-03-31", requierePares: false },
      { id: "p818", tipo: "Artículo", nombre: "Estrategias de economía circular en cadenas de valor de la industria alimentaria", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8018", fecha: "2022-11-20", requierePares: false },
      { id: "p819", tipo: "Artículo", nombre: "Impacto de la variabilidad de la demanda en políticas de inventario multiescalón", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8019", fecha: "2023-06-17", requierePares: false },
      { id: "p820", tipo: "Artículo", nombre: "Simulación de gemelos digitales para la optimización de operaciones logísticas", autores: 4, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8020", fecha: "2024-01-29", requierePares: false },
      { id: "p821", tipo: "Artículo", nombre: "Mejora continua con Kaizen en procesos de servicios del sector financiero", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8021", fecha: "2024-05-13", requierePares: false },
      { id: "p822", tipo: "Artículo", nombre: "Diseño de redes de distribución inversa para el reciclaje de residuos electrónicos", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8022", fecha: "2024-08-04", requierePares: false },
      { id: "p823", tipo: "Artículo", nombre: "Aplicaciones de inteligencia artificial en inspección de calidad visual en línea", autores: 2, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8023", fecha: "2025-02-18", requierePares: false },
      { id: "p824", tipo: "Artículo", nombre: "Análisis comparativo de sistemas de planificación de recursos empresariales en PYMES industriales", autores: 3, clasificacion: "A1", tipoArticulo: "Artículo completo", issn: "2788-8024", fecha: "2025-07-01", requierePares: false },
      { id: "p825", tipo: "Artículo", nombre: "Gestión de proyectos de innovación en la industria aeroespacial colombiana emergente", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8025", fecha: "2006-09-10", requierePares: false },
      { id: "p826", tipo: "Artículo", nombre: "Productividad y bienestar laboral en plantas de manufactura intensiva", autores: 3, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8026", fecha: "2008-04-04", requierePares: false },
      { id: "p827", tipo: "Artículo", nombre: "Sistemas de mantenimiento preventivo basado en condición en industria petrolera", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8027", fecha: "2010-01-27", requierePares: false },
      { id: "p828", tipo: "Artículo", nombre: "Indicadores de desempeño para la gestión de proyectos de infraestructura pública", autores: 4, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8028", fecha: "2012-08-15", requierePares: false },
      { id: "p829", tipo: "Artículo", nombre: "Herramientas de apoyo a la toma de decisiones multicriterio en licitaciones públicas", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8029", fecha: "2014-11-07", requierePares: false },
      { id: "p830", tipo: "Artículo", nombre: "Análisis de la estructura de costos logísticos en empresas de comercio electrónico", autores: 3, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8030", fecha: "2016-06-22", requierePares: false },
      { id: "p831", tipo: "Artículo", nombre: "Gestión ambiental y certificación ISO 14001 en el sector minero colombiano", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8031", fecha: "2018-02-09", requierePares: false },
      { id: "p832", tipo: "Artículo", nombre: "Capacidades organizacionales para la innovación abierta en manufactura avanzada", autores: 3, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8032", fecha: "2020-08-30", requierePares: false },
      { id: "p833", tipo: "Artículo", nombre: "Ergonomía cognitiva y diseño de puestos de trabajo en centros de operaciones", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8033", fecha: "2022-07-16", requierePares: false },
      { id: "p834", tipo: "Artículo", nombre: "Adopción de tecnologías de automatización en pymes colombianas del sector alimentos", autores: 4, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8034", fecha: "2024-04-11", requierePares: false },
      { id: "p835", tipo: "Artículo", nombre: "Análisis de riesgos y planes de contingencia en operaciones de manufactura crítica", autores: 2, clasificacion: "A2", tipoArticulo: "Artículo completo", issn: "2788-8035", fecha: "2025-06-03", requierePares: false },
    ],
    comentario: "Expediente de alto puntaje. Productividad máxima para Profesor Titular (tope 540 pts). Verificar que el total reconocido no supere el tope aplicable.",
    estado: "Completada",
    reglasVersion: REGLAS_VERSION,
    valorPunto: PARAMS.valorPuntoConfigurado,
    creado: "2026-04-12",
    bitacora: [
      bit("Creación de expediente", "Datos básicos", "Nombre: Santiago Alejandro Gómez Restrepo · Sede: Sede Calle 100"),
      bit("Formación añadida", "Formación", "Ingeniería Industrial, Especialización, Maestría, Doctorado"),
      bit("Experiencia añadida", "Experiencia", "Docente de Ingeniería Industrial · 2005–2015"),
      bit("Experiencia añadida", "Experiencia", "Investigador principal · Centro de Investigación en Producción (2016–2025)"),
      bit("Producto añadido", "Productividad", "24 artículos A1 + 15 artículos A2 registrados"),
      bit("Finalización de valoración", "Expediente", "Expediente completado. Productividad total bruta: 540 pts."),
    ],
  },
];

// --------------------------- Store ---------------------------

export function nuevoExpediente(secuencia: number): Expediente {
  const num = String(secuencia).padStart(4, "0");
  return {
    id: `VAL-2026-${num}`,
    docente: { nombre: "", identificacion: "", facultad: "", dedicacion: "", sede: "" },
    categoria: "",
    formacion: [],
    experiencia: [],
    productividad: [],
    comentario: "",
    estado: "En proceso",
    reglasVersion: REGLAS_VERSION,
    valorPunto: PARAMS.valorPuntoConfigurado,
    creado: new Date().toISOString().slice(0, 10),
    bitacora: [],
  };
}

export interface StoreCtx {
  usuario: UsuarioSistema;
  expedientes: Expediente[];
  upsert: (e: Expediente) => void;
  siguienteSecuencia: () => number;
}

export { demo as EXPEDIENTES_DEMO };
export { CATEGORIAS };
export { StoreProvider, useStore } from "./store-context";
