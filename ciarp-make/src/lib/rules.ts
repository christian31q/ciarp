// ---------------------------------------------------------------------------
// Reglas de valoración — Decreto 1279 de 2002
// Parámetros centralizados. Los máximos normativos que dicen "hasta" se tratan
// como tope: el sistema propone el máximo posible y expone el puntaje reconocido
// como valor aplicable, sin convertir el máximo en asignación obligatoria.
// ---------------------------------------------------------------------------

export const REGLAS_VERSION = "v2026.1";

// Valor del punto: parámetro institucional configurable (demostración).
// No corresponde a un valor monetario oficial vigente.
export const PARAMS = {
  version: REGLAS_VERSION,
  vigencia: "2026",
  valorPuntoConfigurado: 20873, // COP — variable de demostración, NO oficial
  valorPuntoDefinido: true,
};

export type Categoria =
  | "Instructor Asistente / Profesor Auxiliar"
  | "Profesor Asistente"
  | "Profesor Asociado"
  | "Profesor Titular";

export const CATEGORIAS: Categoria[] = [
  "Instructor Asistente / Profesor Auxiliar",
  "Profesor Asistente",
  "Profesor Asociado",
  "Profesor Titular",
];

// Art. correspondiente — puntos de categoría (no acumulativos)
export const PUNTOS_CATEGORIA: Record<Categoria, number> = {
  "Instructor Asistente / Profesor Auxiliar": 37,
  "Profesor Asistente": 58,
  "Profesor Asociado": 74,
  "Profesor Titular": 96,
};

// Topes de experiencia por categoría (ingreso/reingreso)
export const TOPE_EXPERIENCIA: Record<Categoria, number> = {
  "Instructor Asistente / Profesor Auxiliar": 20,
  "Profesor Asistente": 45,
  "Profesor Asociado": 90,
  "Profesor Titular": 120,
};

// Topes de productividad académica por categoría
export const TOPE_PRODUCTIVIDAD: Record<Categoria, number> = {
  "Instructor Asistente / Profesor Auxiliar": 80,
  "Profesor Asistente": 160,
  "Profesor Asociado": 320,
  "Profesor Titular": 540,
};

// Determina la categoría automáticamente según nivel máximo de formación y años de experiencia.
// Lógica orientativa para el prototipo — basada en los criterios del Decreto 1279.
export function calcularCategoriaAutomatica(
  formacion: { nivel: string }[],
  experienciaAnios: number
): Categoria {
  const niveles = formacion.map((f) => f.nivel);
  const tieneDoctorado = niveles.includes("Doctorado");
  const tieneMaestria = niveles.includes("Maestría");

  if (tieneDoctorado && experienciaAnios >= 8) return "Profesor Titular";
  if (tieneDoctorado) return "Profesor Asociado";
  if (tieneMaestria) return "Profesor Asistente";
  return "Instructor Asistente / Profesor Auxiliar";
}

// --- Formación académica ---
export type TipoPregrado = "Pregrado general" | "Medicina Humana" | "Composición Musical";
export type LugarObtencion = "Colombia" | "Exterior";
export type AreaClinica = "Medicina Humana" | "Odontología";

export const PUNTOS_FORMACION = {
  pregrado: 178,
  pregradoMedicinaOMusica: 183,
  especializacionMax: 30, // 20 base + 10 por año adicional
  maestriaMax: 40,
  doctoradoMax: 80,
  doctoradoSinMaestriaMax: 120,
  maxPosgradoGeneral: 140,
  especializacionClinicaPorAnio: 15,
  especializacionClinicaMax: 75,
};

// ---------------------------------------------------------------------------
// Configuración central del MOTOR DE COMBINACIONES de Formación académica.
// Fuente única de verdad para topes, combos y valores contextuales de los
// posgrados. Varias reglas son PROVISIONALES (pueden ajustarse
// institucionalmente) y por eso quedan centralizadas aquí: no deben repetirse
// ni "corregirse" en los componentes.
// ---------------------------------------------------------------------------
export const FORMATION_RULES = {
  // Bloques independientes
  PREGRADO_MAX: 183,
  POSTGRADO_GLOBAL_MAX: 140,

  // Topes internos por grupo de posgrado
  ESP_NORMAL_GRUPO_MAX: 30, // suma de todas las especializaciones normales
  MAESTRIA_GRUPO_MAX: 60, // suma de todas las maestrías
  CLINICA_GRUPO_MAX: 75, // suma de todas las especializaciones clínicas

  // Especialización normal (individual)
  ESPECIALIZACION_NORMAL_BASE: 20, // 1–2 años
  ESPECIALIZACION_NORMAL_POR_ANIO_ADICIONAL: 10, // por cada año > 2
  ESPECIALIZACION_NORMAL_MAX: 30, // individual, sola

  // Maestrías (distribución)
  MAESTRIA_MAX: 40, // primera maestría
  SEGUNDA_MAESTRIA: 20, // maestría adicional

  // Especialización clínica: 15 pts por AÑO ENTERO completo, máx. 75
  CLINICA_POR_ANIO: 15,

  // Doctorados
  DOCTORADO_CON_MAESTRIA: 80,
  DOCTORADO_SIN_MAESTRIA: 120,
  SEGUNDO_DOCTORADO: 20, // doctorado adicional
  MAX_DOCTORADOS_RECONOCIDOS: 2, // solo 2 doctorados participan en el combo
  MAESTRIA_MAS_UN_DOCTORADO_MAX: 120, // regla específica (provisional)

  // Topes por jerarquía de grupo superior presente (sin regla más específica)
  COMBO_ESP_MAESTRIA_MAX: 60, // Especialización(es) + Maestría(s), sin Doctorado
  COMBO_CON_CLINICA_MAX: 75, // cualquier combo cuyo grupo superior sea Clínica
};

export type NivelExp =
  | "Investigación"
  | "Docencia universitaria"
  | "Dirección académica"
  | "Profesional calificada (no docente)";

export const PUNTOS_EXPERIENCIA_ANIO: Record<NivelExp, number> = {
  "Investigación": 6,
  "Docencia universitaria": 4,
  "Dirección académica": 4,
  "Profesional calificada (no docente)": 3,
};

// --- Artículos ---
export type ClasArticulo = "A1" | "A2" | "B" | "C";
export const PUNTOS_ARTICULO: Record<ClasArticulo, number> = {
  A1: 15,
  A2: 12,
  B: 8,
  C: 3,
};
export type TipoArticulo =
  | "Artículo completo"
  | "Artículo tradicional"
  | "Comunicación corta"
  | "Reporte de caso"
  | "Revisión de tema"
  | "Carta al editor"
  | "Editorial";
export const FACTOR_TIPO_ARTICULO: Record<TipoArticulo, number> = {
  "Artículo completo": 1,
  "Artículo tradicional": 1,
  "Comunicación corta": 0.6,
  "Reporte de caso": 0.3,
  "Revisión de tema": 0.3,
  "Carta al editor": 0.3,
  "Editorial": 0.3,
};

// --- Otros productos (máximos "hasta") ---
export const PUNTOS_PRODUCTO_MAX: Record<string, number> = {
  "Libro resultado de investigación": 20,
  "Libro de texto": 15,
  "Libro de ensayo": 15,
  "Traducción de libro": 15,
  "Video/Cine/Fonografía — internacional": 12,
  "Video/Cine/Fonografía — nacional": 7,
  "Premio nacional o internacional": 15,
  "Patente": 25,
  "Innovación tecnológica": 15,
  "Adaptación tecnológica": 8,
  "Producción de software": 15,
  "Obra artística — creación original internacional": 20,
  "Obra artística — creación original nacional": 14,
  "Obra artística — complementaria internacional": 12,
  "Obra artística — complementaria nacional": 8,
  "Obra artística — interpretación internacional": 14,
  "Obra artística — interpretación nacional": 8,
};

// Restricción por número de autores
export function factorAutores(n: number): number {
  if (n <= 0) return 1;
  if (n <= 3) return 1;
  if (n <= 5) return 0.5;
  return 1 / (n / 2); // 6+ autores: puntaje / (n/2)
}

// Redondeo a 2 decimales
export const r2 = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// FECHAS Y DURACIONES
// Las fechas ISO (AAAA-MM-DD) se interpretan como días calendario en UTC para
// evitar desfases por zona horaria u horario de verano. Los periodos son
// INCLUSIVOS: un certificado del 01/01/2020 al 31/12/2020 equivale a 1 año.
// ---------------------------------------------------------------------------

const MS_DIA = 24 * 3600 * 1000;

function partesISO(iso: string): [number, number, number] | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? "");
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

// Día calendario en ms UTC (NaN si la fecha es inválida).
export function diaUTC(iso: string): number {
  const p = partesISO(iso);
  return p ? Date.UTC(p[0], p[1] - 1, p[2]) : NaN;
}

function diasEnMes(y: number, m0: number): number {
  return new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
}

// Fecha de hoy (AAAA-MM-DD) según el calendario local del usuario.
export function hoyLocalISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Días calendario del periodo, incluyendo el día inicial y el final.
export function diasPeriodo(inicioISO: string, finISO: string): number {
  const a = diaUTC(inicioISO);
  const b = diaUTC(finISO);
  if (isNaN(a) || isNaN(b) || b < a) return 0;
  return Math.round((b - a) / MS_DIA) + 1;
}

export interface Duracion {
  anios: number;
  meses: number;
  dias: number;
  totalDias: number;
  decimal: number; // años con fracción (para puntaje)
}

// Duración calendario exacta (años, meses y días completos) de un periodo
// inclusivo. Maneja años bisiestos, fin de mes y cambios de año.
export function duracionCalendario(inicioISO: string, finISO: string): Duracion {
  const vacio: Duracion = { anios: 0, meses: 0, dias: 0, totalDias: 0, decimal: 0 };
  const pi = partesISO(inicioISO);
  const pf = partesISO(finISO);
  if (!pi || !pf) return vacio;
  const totalDias = diasPeriodo(inicioISO, finISO);
  if (totalDias <= 0) return vacio;
  // Fin exclusivo = día siguiente a la fecha final.
  const finEx = new Date(Date.UTC(pf[0], pf[1] - 1, pf[2] + 1));
  let y = finEx.getUTCFullYear() - pi[0];
  let m = finEx.getUTCMonth() - (pi[1] - 1);
  let d = finEx.getUTCDate() - pi[2];
  if (d < 0) {
    m -= 1;
    // Días del mes anterior al fin exclusivo.
    const prevM = finEx.getUTCMonth() - 1;
    const prevY = prevM < 0 ? finEx.getUTCFullYear() - 1 : finEx.getUTCFullYear();
    d += diasEnMes(prevY, (prevM + 12) % 12);
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  const decimal = y + m / 12 + d / 365.25;
  return { anios: y, meses: m, dias: d, totalDias, decimal };
}

// Etiqueta legible: "3 años 5 meses", "4 meses 12 días", "1 día".
export function fmtDuracion(dur: Duracion): string {
  if (dur.totalDias <= 0) return "—";
  const pl = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;
  const partes: string[] = [];
  if (dur.anios > 0) partes.push(pl(dur.anios, "año", "años"));
  if (dur.meses > 0) partes.push(pl(dur.meses, "mes", "meses"));
  if (dur.anios === 0 && dur.dias > 0) partes.push(pl(dur.dias, "día", "días"));
  return partes.join(" ") || pl(dur.dias, "día", "días");
}

// Años con fracción (calendario) entre dos fechas ISO, periodo inclusivo.
export function aniosEntre(inicioISO: string, finISO: string): number {
  return r2(duracionCalendario(inicioISO, finISO).decimal);
}

// Semanas del periodo inclusivo (días / 7).
export function semanasEntre(inicioISO: string, finISO: string): number {
  return diasPeriodo(inicioISO, finISO) / 7;
}

// Promedio de horas por semana a partir del total certificado en el periodo.
// Conserva el valor REAL (puede superar 40 h): el tope es asunto del motor.
export function promedioHorasSemanales(horasTotales: number, inicioISO: string, finISO: string): number {
  const sem = semanasEntre(inicioISO, finISO);
  if (!(horasTotales > 0) || sem <= 0) return 0;
  return horasTotales / sem;
}

export function fechasInconsistentes(inicioISO: string, finISO: string): boolean {
  if (!inicioISO || !finISO) return false;
  return diaUTC(finISO) < diaUTC(inicioISO);
}

// ---------------------------------------------------------------------------
// Regla especial: valoraciones cuyo PREGRADO corresponde a una Ingeniería.
// Se detecta por el título profesional registrado (NO por la facultad).
// ---------------------------------------------------------------------------
export function esTituloIngenieria(titulo: string | undefined): boolean {
  if (!titulo) return false;
  const t = titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  // Sin límite de palabra inicial: detecta la raíz también en compuestos
  // como «Bioingeniería» o «Agroingeniería».
  return /ingenier(i|o|a)/.test(t) || /(^|\s)ing\.\s/.test(t);
}

export function periodosTraslapados(
  regs: { inicio: string; fin: string }[]
): boolean {
  const ord = [...regs]
    .filter((r) => r.inicio && r.fin)
    .sort((a, b) => +new Date(a.inicio) - +new Date(b.inicio));
  for (let i = 1; i < ord.length; i++) {
    if (+new Date(ord[i].inicio) < +new Date(ord[i - 1].fin)) return true;
  }
  return false;
}

// --- Dedicación semanal ---
export const HORAS_MAX_SEMANALES = 40;

export function horasNum(h: string | number | undefined | null): number {
  if (h == null) return 0;
  const n = typeof h === "number" ? h : parseFloat(String(h).replace(",", "."));
  return isNaN(n) ? 0 : n;
}

// ---------------------------------------------------------------------------
// MOTOR DE EXPERIENCIA CALIFICADA (por intervalos temporales)
// - Segmenta el tiempo en tramos delimitados por todas las fechas inicio/fin
//   (periodos inclusivos).
// - Tope existente: en cada tramo se reconocen como máximo 40 h/semana.
// - Simultaneidad: si las experiencias activas superan conjuntamente 40 h, el
//   tope se aplica de forma PROPORCIONAL a las horas registradas de cada una.
//   Ninguna experiencia queda excluida ni con reconocimiento cero por el solo
//   hecho de coincidir con otra, y no hay doble contabilización del periodo.
// - Los datos registrados nunca se modifican: el motor solo calcula horas y
//   puntos RECONOCIDOS.
// ---------------------------------------------------------------------------
export const CRITERIO_SIMULTANEIDAD =
  "El tope de 40 h/semana se aplica de forma proporcional a las horas registradas de cada experiencia simultánea; ninguna experiencia se excluye del cálculo.";

export interface ExpIntervalo {
  id?: string;
  inicio: string;
  fin: string;
  horas: number;
  nivel: NivelExp;
}

export interface DetalleExperiencia {
  id: string;
  anios: number; // años calendario del periodo
  horasRegistradas: number; // promedio semanal real
  horasReconocidas: number; // promedio semanal reconocido en el periodo
  puntos: number; // puntos reconocidos (antes del tope por categoría)
  simultanea: boolean; // coincide con otra experiencia en algún tramo
}

export interface PeriodoSimultaneo {
  inicio: string;
  fin: string; // inclusivo
  ids: string[];
  horasRegistradas: number; // suma registrada
  horasReconocidas: number; // suma reconocida (≤ 40)
  reconocidasPorId: Record<string, number>;
}

const isoDeMs = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export function motorExperiencia(regs: ExpIntervalo[], tope: number) {
  const items = regs
    .map((r, i) => ({
      ...r,
      id: r.id ?? `exp-${i}`,
      a: diaUTC(r.inicio),
      b: diaUTC(r.fin) + MS_DIA, // fin exclusivo
      // Años calendario del periodo completo: la misma cifra que se muestra
      // («1 año», «3 años 5 meses»). Cada tramo recibe la parte proporcional
      // a sus días, de modo que la suma de tramos = años calendario exactos.
      aniosCal: duracionCalendario(r.inicio, r.fin).decimal,
    }))
    .filter((r) => !isNaN(r.a) && !isNaN(r.b) && r.b > r.a && r.horas > 0);
  const bounds = Array.from(
    new Set(items.flatMap((r) => [r.a, r.b]))
  ).sort((a, b) => a - b);

  const acc: Record<string, { puntos: number; horasPond: number; simultanea: boolean }> = {};
  for (const r of items) acc[r.id] = { puntos: 0, horasPond: 0, simultanea: false };
  const simultaneos: PeriodoSimultaneo[] = [];
  let hayExceso = false;

  for (let i = 0; i < bounds.length - 1; i++) {
    const a = bounds[i];
    const b = bounds[i + 1];
    if (b <= a) continue;
    const activos = items.filter((r) => r.a <= a && r.b >= b);
    if (activos.length === 0) continue;

    const sumaHoras = activos.reduce((s, r) => s + r.horas, 0);
    const factor = sumaHoras > HORAS_MAX_SEMANALES ? HORAS_MAX_SEMANALES / sumaHoras : 1;
    if (activos.length > 1 && sumaHoras > HORAS_MAX_SEMANALES) hayExceso = true;

    const reconocidasPorId: Record<string, number> = {};
    for (const r of activos) {
      const asignadas = r.horas * factor;
      reconocidasPorId[r.id] = asignadas;
      const fraccion = (b - a) / (r.b - r.a); // parte del periodo de r en este tramo
      const anios = r.aniosCal * fraccion;
      acc[r.id].puntos += anios * (asignadas / HORAS_MAX_SEMANALES) * PUNTOS_EXPERIENCIA_ANIO[r.nivel];
      acc[r.id].horasPond += asignadas * fraccion;
      if (activos.length > 1) acc[r.id].simultanea = true;
    }

    if (activos.length > 1) {
      const ids = activos.map((r) => r.id).sort();
      const ult = simultaneos[simultaneos.length - 1];
      const reconocidas = Math.min(sumaHoras, HORAS_MAX_SEMANALES);
      // Fusiona tramos contiguos con el mismo conjunto de experiencias.
      if (ult && ult.ids.join() === ids.join() && diaUTC(ult.fin) + MS_DIA === a && ult.horasRegistradas === sumaHoras) {
        ult.fin = isoDeMs(b - MS_DIA);
      } else {
        simultaneos.push({
          inicio: isoDeMs(a),
          fin: isoDeMs(b - MS_DIA),
          ids,
          horasRegistradas: r2(sumaHoras),
          horasReconocidas: r2(reconocidas),
          reconocidasPorId: Object.fromEntries(Object.entries(reconocidasPorId).map(([k, v]) => [k, r2(v)])),
        });
      }
    }
  }

  const detalle: DetalleExperiencia[] = items.map((r) => {
    return {
      id: r.id,
      anios: r2(r.aniosCal),
      horasRegistradas: r2(r.horas),
      horasReconocidas: r2(acc[r.id].horasPond),
      puntos: r2(acc[r.id].puntos),
      simultanea: acc[r.id].simultanea,
    };
  });

  let total = detalle.reduce((s, d) => s + acc[d.id].puntos, 0);
  total = r2(total);
  return { valor: Math.min(total, tope), sinTope: total, tope, hayExceso, detalle, simultaneos };
}

export function puntajeExperienciaIntervalos(regs: ExpIntervalo[], tope: number) {
  return motorExperiencia(regs, tope);
}

// Detecta si un conjunto de experiencias supera conjuntamente 40 h/semana
// en algún periodo coincidente.
export function excesoDedicacionSimultanea(regs: ExpIntervalo[]): boolean {
  return motorExperiencia(regs, Infinity).hayExceso;
}

// Lista de países (dropdown). Colombia primero; resto alfabético.
export const PAISES = [
  "Colombia",
  "Alemania",
  "Argentina",
  "Australia",
  "Austria",
  "Bélgica",
  "Bolivia",
  "Brasil",
  "Canadá",
  "Chile",
  "China",
  "Corea del Sur",
  "Costa Rica",
  "Cuba",
  "Dinamarca",
  "Ecuador",
  "Egipto",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Finlandia",
  "Francia",
  "Grecia",
  "Guatemala",
  "Honduras",
  "India",
  "Irlanda",
  "Israel",
  "Italia",
  "Japón",
  "México",
  "Nicaragua",
  "Noruega",
  "Nueva Zelanda",
  "Países Bajos",
  "Panamá",
  "Paraguay",
  "Perú",
  "Polonia",
  "Portugal",
  "Reino Unido",
  "República Checa",
  "República Dominicana",
  "Rusia",
  "Sudáfrica",
  "Suecia",
  "Suiza",
  "Uruguay",
  "Venezuela",
  "Otro",
];

export const COP = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
