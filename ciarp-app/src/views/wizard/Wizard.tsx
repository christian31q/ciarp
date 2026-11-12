import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  History,
  Home,
  Plus,
} from "lucide-react";
import {
  Button,
  Card,
  Field,
  InlineAlert,
  Input,
  Modal,
  Select,
  Textarea,
  Toast,
} from "../../components/ui";
import { AccionesRegistro, EnvioBadge, LeyendaEnvios, tonoTexto } from "../../components/revision";
import {
  CRITERIO_SIMULTANEIDAD,
  COP,
  HORAS_MAX_SEMANALES,
  PAISES,
  PARAMS,
  PUNTOS_EXPERIENCIA_ANIO,
  aniosEntre,
  duracionCalendario,
  excesoDedicacionSimultanea,
  fechasInconsistentes,
  fmtDuracion,
  hoyLocalISO,
  horasNum,
  semanasEntre,
} from "../../lib/rules";
import {
  descFormacion,
  enSegundaValoracion,
  esVigente,
  experienciasIncompatibles,
  fechaMinimaExperiencia,
  finEfectivo,
  fmtFecha,
  mensajeFechaMinima,
  motorFormacion,
  nowStr,
  pendienteConvalidacion,
  potencialFormacionItem,
  pregradosSinMatricula,
  puntajeProducto,
  requiereMatricula,
  resumenPuntaje,
  tieneMaestriaReconocida,
  useStore,
  type BitacoraEntry,
  type DesgloseFormacion,
  type EstadoRevision,
  type Expediente,
  type Experiencia,
  type FechaMinimaExp,
  type Formacion,
  type Producto,
  type SubtotalGrupo,
  type TrazaRevision,
} from "../../lib/store";

type BitFn = (accion: string, elemento: string, detalle?: string) => void;
type SetFn = (fn: (e: Expediente) => Expediente) => void;
import { PASOS, Stepper } from "./Stepper";
import { Exito } from "./Exito";

const rid = () => Math.random().toString(36).slice(2, 9);

// ---------------------------------------------------------------------
// Operaciones sobre colecciones del expediente con trazabilidad de la
// segunda valoración (registros del primer envío nunca se sobrescriben).
// ---------------------------------------------------------------------
type ColKey = "formacion" | "experiencia" | "productividad";
type Item = TrazaRevision & { id: string };

function useColeccion<T extends Item>(exp: Expediente, set: SetFn, bit: BitFn, col: ColKey, elemento: string, describir: (x: T) => string) {
  const segunda = enSegundaValoracion(exp);
  const lista = exp[col] as unknown as T[];
  const mutar = (fn: (arr: T[]) => T[]) =>
    set((e) => ({ ...e, [col]: fn(e[col] as unknown as T[]) }) as Expediente);

  const guardar = (item: T) => {
    const existe = lista.some((x) => x.id === item.id);
    const nuevo: T = !existe && segunda ? { ...item, origenEnvio: "segundo_envio", estadoRevision: "vigente" } : item;
    mutar((arr) => {
      const i = arr.findIndex((x) => x.id === nuevo.id);
      let next = i === -1 ? [...arr, nuevo] : arr.map((x) => (x.id === nuevo.id ? nuevo : x));
      if (i === -1 && nuevo.reemplazaA)
        next = next.map((x) => (x.id === nuevo.reemplazaA ? { ...x, estadoRevision: "reemplazado" as EstadoRevision, reemplazadoPor: nuevo.id } : x));
      return next;
    });
    const accion = existe ? `${elemento} editada` : nuevo.reemplazaA ? `${elemento} corregida (segundo envío)` : `${elemento} añadida al expediente`;
    bit(accion, elemento, describir(nuevo));
  };

  const eliminar = (item: T) => {
    mutar((arr) =>
      arr
        .filter((x) => x.id !== item.id)
        // Si se elimina una corrección, el registro original vuelve a estar vigente.
        .map((x) => (item.reemplazaA && x.id === item.reemplazaA ? { ...x, estadoRevision: "vigente" as EstadoRevision, reemplazadoPor: undefined } : x))
    );
    bit(`${elemento} eliminada`, elemento, describir(item));
  };

  const marcar = (item: T, estado: EstadoRevision) => {
    mutar((arr) => arr.map((x) => (x.id === item.id ? { ...x, estadoRevision: estado } : x)));
    bit(estado === "no_tenido_en_cuenta" ? `${elemento} marcada como no tenida en cuenta` : `${elemento} vuelve a tenerse en cuenta`, elemento, describir(item));
  };

  // Copia editable del registro original para cargar el certificado corregido.
  const prepararReemplazo = (item: T): T => ({ ...item, id: rid(), origenEnvio: "segundo_envio", estadoRevision: "vigente", reemplazaA: item.id, reemplazadoPor: undefined });

  return { segunda, guardar, eliminar, marcar, prepararReemplazo };
}

// Detecta cambios no añadidos en un formulario (para advertir al salir del paso).
function usePendiente<T>(valor: T, onPendingChange: (p: boolean) => void) {
  const [inicial] = useState(() => JSON.stringify(valor));
  useEffect(() => {
    onPendingChange(JSON.stringify(valor) !== inicial);
  }, [valor, inicial, onPendingChange]);
  useEffect(() => () => onPendingChange(false), [onPendingChange]);
}

function CorreccionAviso() {
  return (
    <div className="mb-4">
      <InlineAlert tone="info">
        Estás registrando un certificado corregido (segundo envío). El registro original del primer envío se conservará como histórico y dejará de puntuar.
      </InlineAlert>
    </div>
  );
}

function CampoObservacion({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <div className="md:col-span-2">
      <Field label="Observación sobre este registro (opcional)" hint="Si se diligencia, se incluye en la sección «Observaciones» de los documentos descargables.">
        <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Ej. El certificado no indica la intensidad horaria semanal." />
      </Field>
    </div>
  );
}

const FACULTADES = [
  "Facultad de Ingeniería",
  "Facultad de Medicina",
  "Facultad de Ciencias Económicas",
  "Facultad de Derecho",
  "Facultad de Educación",
  "Facultad de Estudios a Distancia",
];
const SEDES = ["Sede Calle 100", "Sede Cajicá"] as const;
const DEDICACIONES = ["Tiempo completo", "Medio tiempo", "Horas semanales"] as const;

// =====================================================================
// Panel de puntaje en tiempo real
// =====================================================================

function PanelPuntaje({ exp }: { exp: Expediente }) {
  const r = resumenPuntaje(exp);
  const filas = [
    { label: "Formación", valor: r.formacion },
    { label: "Categoría", valor: r.categoria },
    { label: "Experiencia", valor: r.experiencia.valor },
    { label: "Productividad", valor: r.productividad.valor },
  ];
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-soft bg-navy/5 px-4 py-2.5">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wide text-navy">Puntaje acumulado</p>
          <p className="text-[11px] text-text-secondary">Categoría: <span className="font-medium text-navy">{r.categoriaCalculada}</span></p>
        </div>
        <p className="text-[20px] font-bold tabular-nums text-navy">{r.total.toFixed(2)} pts</p>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 px-4 py-3">
        {filas.map((f) => (
          <div key={f.label} className="flex items-center gap-1.5 text-[13px]">
            <span className="text-text-secondary">{f.label}:</span>
            <span className="tabular-nums font-semibold text-navy">{f.valor.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// =====================================================================
// Modales de confirmación de edición y eliminación
// =====================================================================

function ConfirmEditModal({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="¿Deseas editar esta información?"
      footer={
        <>
          <Button variant="tertiary" onClick={onCancel}>Cancelar</Button>
          <Button onClick={onConfirm}>Continuar editando</Button>
        </>
      }
    >
      <p className="text-[14px] text-text-secondary">
        Los cambios realizados pueden modificar el puntaje de la valoración.
      </p>
    </Modal>
  );
}

function ConfirmDeleteModal({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="¿Estás seguro de que deseas eliminar este registro?"
      footer={
        <>
          <Button variant="tertiary" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>Eliminar</Button>
        </>
      }
    >
      <p className="text-[14px] text-text-secondary">
        Esta acción eliminará la información seleccionada y puede afectar el puntaje de la valoración.
      </p>
    </Modal>
  );
}

// =====================================================================
// PASO 1 — Datos básicos
// =====================================================================

function PasoDatos({
  exp,
  set,
  errores,
}: {
  exp: Expediente;
  set: (fn: (e: Expediente) => Expediente) => void;
  errores: Record<string, string>;
}) {
  const d = exp.docente;
  const upd = (k: keyof typeof d, v: string) =>
    set((e) => ({ ...e, docente: { ...e.docente, [k]: v } }));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h3 className="text-[16px] font-semibold text-navy">Datos del docente</h3>
          <span className="text-[11px] text-text-secondary tabular-nums">Creado: {fmtFecha(exp.creado)}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nombre docente" required error={errores.nombre}>
            <Input value={d.nombre} error={!!errores.nombre} onChange={(e) => upd("nombre", e.target.value)} />
          </Field>
          <Field label="Identificación" required error={errores.identificacion}>
            <Input value={d.identificacion} error={!!errores.identificacion} onChange={(e) => upd("identificacion", e.target.value)} />
          </Field>
          <Field label="Facultad" required error={errores.facultad}>
            <Select value={d.facultad} error={!!errores.facultad} onChange={(e) => upd("facultad", e.target.value)}>
              <option value="">Seleccionar facultad…</option>
              {FACULTADES.map((f) => <option key={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Sede" required error={errores.sede}>
            <Select value={d.sede} error={!!errores.sede} onChange={(e) => upd("sede", e.target.value)}>
              <option value="">Seleccionar sede…</option>
              {SEDES.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
      </section>

      <section className="border-t border-border-soft pt-6">
        <h3 className="mb-1 text-[16px] font-semibold text-navy">Tipo de vinculación</h3>
        <p className="mb-4 text-[13px] text-text-secondary">
          Los docentes se vinculan exclusivamente como <strong>docentes de planta</strong>.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Tipo de vinculación">
            <div className="flex h-[40px] items-center rounded-[8px] border border-border-soft bg-disabled px-3 text-[14px] text-text-secondary select-none">
              Docente de planta
            </div>
          </Field>
          <Field label="Dedicación" required error={errores.dedicacion}>
            <Select value={d.dedicacion} error={!!errores.dedicacion} onChange={(e) => upd("dedicacion", e.target.value)}>
              <option value="">Seleccionar dedicación…</option>
              {DEDICACIONES.map((f) => <option key={f}>{f}</option>)}
            </Select>
          </Field>
          {d.dedicacion === "Horas semanales" && (
            <Field label="Horas semanales de dedicación" required error={errores.horasDedicacion}>
              <Input
                type="number"
                min={1}
                value={d.horasDedicacion ?? ""}
                error={!!errores.horasDedicacion}
                onChange={(e) => upd("horasDedicacion", e.target.value)}
                placeholder="Ej. 24"
              />
            </Field>
          )}
        </div>
      </section>


    </div>
  );
}

// =====================================================================
// PASO 2 — Formación académica
// =====================================================================

const NIVELES_FORM = [
  "Pregrado",
  "Especialización",
  "Maestría",
  "Doctorado",
] as const;

// Fecha máxima permitida para "Fecha de finalización": ayer (estrictamente < hoy).
function ayerISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function hoyISO(): string {
  return hoyLocalISO();
}

const PREGRADO_TIPOS = ["Pregrado general", "Medicina Humana", "Composición Musical"] as const;

function FormFormacion({
  onAdd,
  editing,
  onCancel,
  tieneMaestria,
  onPendingChange,
  esCorreccion,
}: {
  onAdd: (f: Formacion) => void;
  editing: Formacion | null;
  esCorreccion?: boolean;
  onCancel: () => void;
  tieneMaestria: boolean;
  onPendingChange: (pending: boolean) => void;
}) {
  const initialForm = editing ?? {
      id: rid(),
      nivel: "",
      institucion: "",
      titulo: "",
      tipo: "",
      aniosDuracion: 0,
      fechaGrado: "",
      tipoPregrado: undefined,
      lugar: "Colombia",
    };
  const [f, setF] = useState<Formacion>(initialForm);
  const [err, setErr] = useState<Record<string, string>>({});
  const esPregrado = f.nivel === "Pregrado";
  const esEspecializacion = f.nivel === "Especialización";
  const esClinica = esEspecializacion && f.esEspecializacionClinica === true;
  const esDoctorado = f.nivel === "Doctorado";
  const esExterior = f.lugar === "Exterior";
  const exigeMatricula = requiereMatricula(f);
  const potencial = potencialFormacionItem(f, tieneMaestria);
  const pendiente = pendienteConvalidacion(f);

  usePendiente(f, onPendingChange);

  const guardar = () => {
    const e: Record<string, string> = {};
    if (!f.nivel) e.nivel = "Seleccione el nivel de formación.";
    if (!f.institucion.trim()) e.institucion = "Requerido.";
    if (!f.titulo.trim()) e.titulo = "Requerido.";
    if (!f.fechaGrado) e.fechaGrado = "Requerido.";
    else if (f.fechaGrado >= hoyISO())
      e.fechaGrado = "La fecha de finalización debe ser anterior a la fecha actual.";
    if (esPregrado && !f.tipoPregrado) e.tipoPregrado = "Requerido.";
    if (esEspecializacion) {
      if (f.esEspecializacionClinica == null)
        e.esEspecializacionClinica = "Indica si corresponde a una especialización clínica.";
      if (esClinica && !f.areaClinica)
        e.areaClinica = "Selecciona el área de la especialización clínica.";
      if (esClinica && !(f.aniosDuracion > 0))
        e.aniosDuracion = "Indica la duración de la especialización clínica.";
    }
    if (!f.lugar) e.lugar = "Requerido.";
    if (esExterior && !f.pais) e.pais = "Selecciona el país donde fue obtenido el título.";
    if (esExterior && !f.convalidado) e.convalidado = "Indica si el título está convalidado.";
    // Regla de Ingeniería: depende del título registrado, nunca de la facultad.
    if (exigeMatricula) {
      const m = f.fechaMatriculaProfesional;
      if (!m) e.fechaMatriculaProfesional = "Registra la fecha de matrícula profesional (requerida para títulos de Ingeniería).";
      else if (m > hoyISO()) e.fechaMatriculaProfesional = "La fecha de matrícula profesional no puede ser posterior a la fecha actual.";
      else if (f.fechaGrado && m < f.fechaGrado)
        e.fechaMatriculaProfesional = `La matrícula profesional no puede ser anterior a la fecha de grado (${fmtFecha(f.fechaGrado)}).`;
    }
    setErr(e);
    if (Object.keys(e).length === 0)
      onAdd({ ...f, fechaMatriculaProfesional: exigeMatricula ? f.fechaMatriculaProfesional : undefined });
  };

  return (
    <Card className="p-5">
      {esCorreccion && <CorreccionAviso />}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Nivel de formación" required error={err.nivel}>
          <Select
            value={f.nivel}
            error={!!err.nivel}
            onChange={(e) => {
              const nivel = e.target.value as Formacion["nivel"];
              const esEsp = nivel === "Especialización";
              setF({
                ...f,
                nivel,
                tipoPregrado: nivel === "Pregrado" ? (f.tipoPregrado ?? "Pregrado general") : undefined,
                esEspecializacionClinica: esEsp ? f.esEspecializacionClinica : undefined,
                areaClinica: esEsp && f.esEspecializacionClinica ? f.areaClinica : undefined,
                conMaestria: nivel === "Doctorado" ? tieneMaestria : undefined,
              });
            }}
          >
            <option value="">Seleccione el nivel de formación…</option>
            {NIVELES_FORM.map((n) => <option key={n}>{n}</option>)}
          </Select>
        </Field>
        <Field label="Institución" required error={err.institucion}>
          <Input value={f.institucion} error={!!err.institucion} onChange={(e) => setF({ ...f, institucion: e.target.value })} />
        </Field>

        {esPregrado && (
          <Field label="Tipo de formación de pregrado" required error={err.tipoPregrado}>
            <Select
              value={f.tipoPregrado ?? ""}
              error={!!err.tipoPregrado}
              onChange={(e) => setF({ ...f, tipoPregrado: e.target.value as Formacion["tipoPregrado"] })}
            >
              <option value="">Seleccionar tipo de pregrado…</option>
              {PREGRADO_TIPOS.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
        )}

        {esEspecializacion && (
          <Field label="¿Es una especialización clínica?" required error={err.esEspecializacionClinica}>
            <Select
              value={f.esEspecializacionClinica == null ? "" : f.esEspecializacionClinica ? "Sí" : "No"}
              error={!!err.esEspecializacionClinica}
              onChange={(e) => {
                const v = e.target.value;
                const clinica = v === "Sí";
                // Al dejar de ser clínica se descarta el área para no arrastrar
                // valores incompatibles ni puntajes anteriores.
                setF({
                  ...f,
                  esEspecializacionClinica: v === "" ? undefined : clinica,
                  areaClinica: clinica ? f.areaClinica : undefined,
                });
              }}
            >
              <option value="">Seleccione…</option>
              <option>Sí</option>
              <option>No</option>
            </Select>
          </Field>
        )}

        {esClinica && (
          <Field label="Área de la especialización clínica" required error={err.areaClinica}>
            <Select
              value={f.areaClinica ?? ""}
              error={!!err.areaClinica}
              onChange={(e) => setF({ ...f, areaClinica: e.target.value as Formacion["areaClinica"] })}
            >
              <option value="">Seleccione…</option>
              <option>Medicina Humana</option>
              <option>Odontología</option>
            </Select>
          </Field>
        )}

        {esDoctorado && (
          <div className="md:col-span-2">
            <InlineAlert tone="info">
              El sistema identifica automáticamente si existe una maestría reconocida en los registros añadidos: <strong>{tieneMaestria ? "Sí" : "No"}</strong>.
            </InlineAlert>
          </div>
        )}

        <Field label="Título / programa" required error={err.titulo}>
          <Input value={f.titulo} error={!!err.titulo} onChange={(e) => setF({ ...f, titulo: e.target.value })} />
        </Field>
        {esClinica && (
          <Field label="Duración (años)" required error={err.aniosDuracion}>
            <Input
              type="number"
              min={1}
              step={1}
              value={f.aniosDuracion > 0 ? f.aniosDuracion : ""}
              error={!!err.aniosDuracion}
              onChange={(e) => setF({ ...f, aniosDuracion: Math.max(0, Math.floor(Number(e.target.value) || 0)) })}
            />
            <p className="mt-1 text-[11px] text-text-secondary">Se reconocen 15 pts por año completo; el puntaje se limita a 75 pts.</p>
          </Field>
        )}
        <Field label="Fecha de finalización" required error={err.fechaGrado}>
          <Input type="date" max={ayerISO()} value={f.fechaGrado} error={!!err.fechaGrado} onChange={(e) => setF({ ...f, fechaGrado: e.target.value })} />
        </Field>

        {exigeMatricula && (
          <Field
            label="Fecha de matrícula profesional"
            required
            error={err.fechaMatriculaProfesional}
            hint="Se exige porque el título registrado corresponde a Ingeniería. La experiencia profesional se cuenta desde la fecha más reciente entre el grado y la matrícula."
          >
            <Input
              type="date"
              min={f.fechaGrado || undefined}
              max={hoyISO()}
              value={f.fechaMatriculaProfesional ?? ""}
              error={!!err.fechaMatriculaProfesional}
              onChange={(e) => setF({ ...f, fechaMatriculaProfesional: e.target.value })}
            />
          </Field>
        )}

        <Field label="Lugar de obtención" required error={err.lugar}>
          <Select
            value={f.lugar ?? ""}
            error={!!err.lugar}
            onChange={(e) => {
              const lugar = e.target.value as Formacion["lugar"];
              // Al volver a Colombia, se limpian país y convalidación.
              setF({
                ...f,
                lugar,
                pais: lugar === "Exterior" ? f.pais : undefined,
                convalidado: lugar === "Exterior" ? f.convalidado : undefined,
              });
            }}
          >
            <option value="">Seleccione…</option>
            <option>Colombia</option>
            <option>Exterior</option>
          </Select>
        </Field>

        {esExterior && (
          <>
            <Field label="País" required error={err.pais}>
              <Select value={f.pais ?? ""} error={!!err.pais} onChange={(e) => setF({ ...f, pais: e.target.value })}>
                <option value="">Seleccione…</option>
                {PAISES.filter((p) => p !== "Colombia").map((p) => <option key={p}>{p}</option>)}
              </Select>
            </Field>
            <Field label="¿El título está convalidado en Colombia?" required error={err.convalidado}>
              <Select value={f.convalidado ?? ""} error={!!err.convalidado} onChange={(e) => setF({ ...f, convalidado: e.target.value as Formacion["convalidado"] })}>
                <option value="">Seleccione…</option>
                <option>Sí</option>
                <option>No</option>
              </Select>
            </Field>
          </>
        )}

        <CampoObservacion value={f.observacion} onChange={(v) => setF({ ...f, observacion: v })} />
      </div>

      <div className="mt-4 rounded-[8px] border border-border-soft bg-navy/5 px-4 py-2.5">
        {pendiente ? (
          <p className="text-[13px] text-text-secondary">
            Puntaje normativo potencial:{" "}
            <span className="font-bold text-navy">{descFormacion(f, tieneMaestria).hasta ? "hasta " : ""}{potencial} pts</span>
            {" · "}
            <span className="font-semibold text-warning">Reconocido actual: 0 / Pendiente de convalidación</span>
          </p>
        ) : (
          <p className="text-[13px] text-text-secondary">
            {descFormacion(f, tieneMaestria).hasta ? "Puntaje máximo aplicable" : "Puntaje estimado de este nivel"}:{" "}
            <span className="font-bold text-navy">{descFormacion(f, tieneMaestria).hasta ? "hasta " : ""}{potencial} pts</span>
          </p>
        )}
      </div>

      {pendiente && (
        <div className="mt-3">
          <InlineAlert tone="warning">
            Este título está pendiente de convalidación en Colombia y todavía no puede incorporarse al puntaje reconocido. El registro se conserva.
          </InlineAlert>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <Button variant="tertiary" onClick={onCancel}>Cancelar</Button>
        <Button variant="secondary" onClick={guardar}>{esCorreccion ? "Añadir registro corregido" : editing ? "Guardar cambios" : "Añadir registro"}</Button>
      </div>
    </Card>
  );
}

type ListaFormacionData = ReturnType<typeof motorFormacion>;

function ListaFormacionFila({
  it,
  porId,
  segunda,
  acciones,
}: {
  it: DesgloseFormacion;
  porId: Map<string, Formacion>;
  segunda: boolean;
  acciones: (f: Formacion) => ReactNode;
}) {
  const f = porId.get(it.id);
  if (!f) return null;
  const reducido = it.reconocido < it.potencial;
  return (
    <li className="flex items-start justify-between gap-3 px-3 py-2.5">
      <div className="min-w-0">
        <p className={`truncate text-[13px] font-medium text-text-primary ${segunda ? tonoTexto(f) : ""}`}>{f.titulo}</p>
        <p className="truncate text-[12px] text-text-secondary">
          {it.label} · {it.institucion}
          {it.fecha ? ` · ${fmtFecha(it.fecha)}` : ""}
          {f.fechaMatriculaProfesional ? ` · Matrícula: ${fmtFecha(f.fechaMatriculaProfesional)}` : ""}
        </p>
        {it.motivo && <p className="text-[11px] text-text-secondary">{MOTIVO_LABEL[it.motivo]}</p>}
        {requiereMatricula(f) && !f.fechaMatriculaProfesional && (
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-error">
            <AlertTriangle className="size-3" /> Falta la fecha de matrícula profesional (título de Ingeniería).
          </p>
        )}
        {f.observacion?.trim() && <p className="mt-0.5 text-[11px] italic text-text-secondary">Observación: {f.observacion}</p>}
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          {segunda && <EnvioBadge r={f} />}
          {acciones(f)}
        </div>
      </div>
      <div className="shrink-0 text-right tabular-nums">
        {reducido ? (
          <>
            <span className="text-[12px] text-text-secondary line-through">{it.potencial}</span>{" "}
            <span className={`text-[14px] font-bold ${it.reconocido === 0 ? "text-text-secondary" : "text-navy"}`}>{it.reconocido}</span>
          </>
        ) : (
          <span className="text-[14px] font-bold text-navy">{it.reconocido}</span>
        )}
        <span className="text-[11px] text-text-secondary"> pts</span>
      </div>
    </li>
  );
}

function ListaFormacionGrupo({
  fd,
  porId,
  segunda,
  acciones,
  titulo,
  topeTxt,
  sub,
  grupo,
}: {
  fd: ListaFormacionData;
  porId: Map<string, Formacion>;
  segunda: boolean;
  acciones: (f: Formacion) => ReactNode;
  titulo: string;
  topeTxt: string;
  sub?: SubtotalGrupo;
  grupo: DesgloseFormacion["grupo"];
}) {
  const items = fd.desglose.filter((d) => d.grupo === grupo);
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg border border-border-soft">
      <div className="flex items-center justify-between gap-2 border-b border-border-soft bg-navy/5 px-3 py-2">
        <div>
          <p className="text-[12px] font-semibold text-navy">{titulo}</p>
          <p className="text-[11px] text-text-secondary">{topeTxt}</p>
        </div>
        {sub && (
          <span className="shrink-0 text-[12px] tabular-nums text-text-secondary">
            <span className="font-semibold text-navy">{sub.reconocido}</span> / {sub.tope}
          </span>
        )}
      </div>
      <ul className="divide-y divide-border-soft">
        {items.map((it) => (
          <ListaFormacionFila key={it.id} it={it} porId={porId} segunda={segunda} acciones={acciones} />
        ))}
      </ul>
    </div>
  );
}

// Lista compacta de los títulos registrados, AGRUPADA por tipo y alimentada por
// el motor central (fuente única de verdad). Muestra potencial vs. reconocido,
// la regla y el tope aplicados, sin cards grandes ni duraciones inventadas.
function ListaFormacion({
  exp,
  acciones,
}: {
  exp: Expediente;
  acciones: (f: Formacion) => ReactNode;
}) {
  const fd = motorFormacion(exp.formacion.filter(esVigente));
  const porId = new Map(exp.formacion.map((f) => [f.id, f]));
  const segunda = enSegundaValoracion(exp);
  const fueraDelCalculo = exp.formacion.filter((f) => !esVigente(f));

  return (
    <div className="flex flex-col gap-3">
      <ListaFormacionGrupo fd={fd} porId={porId} segunda={segunda} acciones={acciones} titulo="Pregrado" topeTxt="Máx. reconocido: 183 pts" grupo="pregrado" />
      <ListaFormacionGrupo fd={fd} porId={porId} segunda={segunda} acciones={acciones} titulo="Especializaciones normales" topeTxt="Máx. acumulable: 30 pts" sub={fd.grupos.espNormales} grupo="espNormal" />
      <ListaFormacionGrupo fd={fd} porId={porId} segunda={segunda} acciones={acciones} titulo="Maestrías" topeTxt="Máx. acumulable: 60 pts" sub={fd.grupos.maestrias} grupo="maestria" />
      <ListaFormacionGrupo fd={fd} porId={porId} segunda={segunda} acciones={acciones} titulo="Especializaciones clínicas" topeTxt="Máx. acumulable: 75 pts" sub={fd.grupos.clinicas} grupo="clinica" />
      <ListaFormacionGrupo fd={fd} porId={porId} segunda={segunda} acciones={acciones} titulo="Doctorados" topeTxt="Hasta 140 pts según combinación" sub={fd.grupos.doctorados} grupo="doctorado" />

      {fueraDelCalculo.length > 0 && (
        <div className="rounded-lg border border-border-soft">
          <div className="border-b border-border-soft bg-bg px-3 py-2">
            <p className="text-[12px] font-semibold text-navy">Registros conservados fuera del cálculo</p>
            <p className="text-[11px] text-text-secondary">Se mantienen en el expediente y en el histórico, pero no suman puntaje.</p>
          </div>
          <ul className="divide-y divide-border-soft">
            {fueraDelCalculo.map((f) => (
              <li key={f.id} className="flex flex-col gap-1.5 px-3 py-2.5">
                <p className={`text-[13px] font-medium ${tonoTexto(f)}`}>{f.titulo}</p>
                <p className="text-[12px] text-text-secondary">{descFormacion(f).label} · {f.institucion} · {fmtFecha(f.fechaGrado)}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <EnvioBadge r={f} />
                  {acciones(f)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg border border-border-soft bg-navy/5 px-4 py-3">
        <p className="text-[12px] text-text-secondary">
          Regla aplicada: <span className="font-semibold text-navy">{fd.reglaAplicada}</span> · Tope de la combinación:{" "}
          <span className="font-semibold text-navy">{fd.topeCombinacion} pts</span>
        </p>
        <dl className="mt-2 flex flex-col gap-1 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-text-secondary">Pregrado reconocido</dt>
            <dd className="tabular-nums font-medium text-navy">{fd.pregrado.reconocido}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Posgrados reconocidos {fd.posgradoBruto > fd.posgradoReconocido ? `(potencial ${fd.posgradoBruto})` : ""}</dt>
            <dd className="tabular-nums font-medium text-navy">{fd.posgradoReconocido}</dd>
          </div>
          <div className="mt-1 flex justify-between border-t border-border-soft pt-2">
            <dt className="font-semibold text-navy">Total Formación académica</dt>
            <dd className="tabular-nums text-[15px] font-bold text-navy">{fd.total}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function PasoFormacion({ exp, set, bit, onPendingChange }: { exp: Expediente; set: SetFn; bit: BitFn; onPendingChange: (pending: boolean) => void }) {
  const [form, setForm] = useState(false);
  const [editing, setEditing] = useState<Formacion | null>(null);
  const [pendingEdit, setPendingEdit] = useState<Formacion | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Formacion | null>(null);
  // Maestría reconocida detectada automáticamente desde los registros añadidos.
  const tieneMaestria = tieneMaestriaReconocida(exp.formacion);
  const col = useColeccion<Formacion>(exp, set, bit, "formacion", "Formación", (f) => `${f.nivel}: ${f.titulo} — ${f.institucion} (${fmtFecha(f.fechaGrado)})`);
  const incompatibles = experienciasIncompatibles(exp);
  const minExp = fechaMinimaExperiencia(exp.formacion);

  const upsert = (f: Formacion) => {
    col.guardar(f);
    setForm(false);
    setEditing(null);
    onPendingChange(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <InlineAlert tone="info">
        Registre pregrado y posgrados. Solo el pregrado con relación directa se contabiliza; los posgrados aplican reglas de acumulación y topes del Decreto 1279.
      </InlineAlert>

      {incompatibles.length > 0 && minExp && (
        <InlineAlert tone="error">
          {mensajeFechaMinima(minExp)} Hay {incompatibles.length} experiencia(s) registrada(s) que inician antes de esa fecha. Corrígelas en el paso «Experiencia calificada» antes de finalizar.
        </InlineAlert>
      )}

      {exp.formacion.length > 0 && (
        <ListaFormacion
          exp={exp}
          acciones={(f) => (
            <AccionesRegistro
              r={f}
              segunda={col.segunda}
              onEdit={() => setPendingEdit(f)}
              onDelete={() => setPendingDelete(f)}
              onExcluir={() => col.marcar(f, "no_tenido_en_cuenta")}
              onIncluir={() => col.marcar(f, "vigente")}
              onReemplazar={() => { setEditing(col.prepararReemplazo(f)); setForm(true); }}
            />
          )}
        />
      )}

      {form ? (
        <FormFormacion
          key={editing?.id ?? "nuevo"}
          onAdd={upsert}
          editing={editing}
          esCorreccion={!!editing?.reemplazaA && !exp.formacion.some((x) => x.id === editing.id)}
          tieneMaestria={tieneMaestria}
          onPendingChange={onPendingChange}
          onCancel={() => { onPendingChange(false); setForm(false); setEditing(null); }}
        />
      ) : (
        <Button variant="outline" onClick={() => setForm(true)} className="self-start">
          <Plus className="size-[18px]" /> Añadir formación
        </Button>
      )}

      <ConfirmEditModal
        open={!!pendingEdit}
        onCancel={() => setPendingEdit(null)}
        onConfirm={() => { setEditing(pendingEdit); setForm(true); setPendingEdit(null); }}
      />
      <ConfirmDeleteModal
        open={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) col.eliminar(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

// =====================================================================
// PASO 3 — Experiencia calificada
// =====================================================================

const NIVELES_EXP: Experiencia["nivel"][] = [
  "Investigación",
  "Docencia universitaria",
  "Dirección académica",
  "Profesional calificada (no docente)",
];
const CARGOS_EXP = [
  "Investigación científica",
  "Docente",
  "Dirección académica",
  "Profesional general",
] as const;

const DEDICACIONES_EXP = ["Tiempo completo", "Medio tiempo", "Horas semanales"] as const;

function FormExperiencia({
  onAdd,
  existentes,
  editing,
  esCorreccion,
  onCancel,
  fechaMinima,
  onPendingChange,
}: {
  onAdd: (e: Experiencia) => void;
  existentes: Experiencia[];
  editing: Experiencia | null;
  esCorreccion?: boolean;
  onCancel: () => void;
  fechaMinima: FechaMinimaExp | null;
  onPendingChange: (pending: boolean) => void;
}) {
  const [e, setE] = useState<Experiencia>(
    editing
      ? {
          ...editing,
          horasTotales:
            editing.horasTotales ??
            (horasNum(editing.horas) * semanasEntre(editing.inicio, finEfectivo(editing))).toFixed(0),
        }
      : {
          id: rid(),
          entidad: "",
          cargo: "",
          nivel: "Docencia universitaria",
          vinculo: "Planta",
          dedicacion: "Tiempo completo",
          horas: "40",
          inicio: "",
          fin: "",
          actualmente: false,
          horasTotales: "",
        }
  );
  const [err, setErr] = useState<Record<string, string>>({});
  usePendiente(e, onPendingChange);
  const finCalculo = finEfectivo(e);
  const fechasOk = !!e.inicio && !!finCalculo && !fechasInconsistentes(e.inicio, finCalculo);
  const semanas = fechasOk ? semanasEntre(e.inicio, finCalculo) : 0;
  const totalHoras = horasNum(e.horasTotales);
  // Promedio semanal real (sin tope): horas totales ÷ semanas transcurridas.
  const horasSemanales = totalHoras > 0 && semanas > 0 ? totalHoras / semanas : 0;
  const dur = fechasOk ? duracionCalendario(e.inicio, finCalculo) : null;

  // Advertencia de dedicación simultánea (> 40 h en periodo coincidente).
  const exceso = useMemo(
    () =>
      horasSemanales > 0 &&
      excesoDedicacionSimultanea(
        [...existentes.filter((x) => x.id !== e.id && x.id !== e.reemplazaA && esVigente(x)), e].map((x) => ({
          inicio: x.inicio,
          fin: finEfectivo(x),
          horas: x.id === e.id ? horasSemanales : horasNum(x.horas),
          nivel: x.nivel,
        }))
      ),
    [existentes, e, horasSemanales]
  );

  const anios = fechasOk ? aniosEntre(e.inicio, finCalculo) : 0;
  const horasReconocidas = Math.min(horasSemanales, HORAS_MAX_SEMANALES);
  const ptsExp =
    anios > 0 && horasSemanales > 0
      ? (anios * (horasReconocidas / HORAS_MAX_SEMANALES) * PUNTOS_EXPERIENCIA_ANIO[e.nivel]).toFixed(2)
      : null;
  const cargoAnterior = !!e.cargo && !CARGOS_EXP.includes(e.cargo as (typeof CARGOS_EXP)[number]);

  const guardar = () => {
    const errs: Record<string, string> = {};
    const hoy = hoyISO();
    if (!e.entidad.trim()) errs.entidad = "Requerido.";
    if (!e.cargo.trim()) errs.cargo = "Selecciona el cargo.";
    else if (cargoAnterior) errs.cargo = "Selecciona uno de los cargos vigentes para guardar este registro.";
    if (!e.inicio) errs.inicio = "Requerido.";
    if (!String(e.horasTotales ?? "").trim()) errs.horasTotales = "Requerido.";
    else if (!(totalHoras > 0)) errs.horasTotales = "Las horas trabajadas deben ser un número mayor que cero.";
    // Fecha de inicio: nunca futura ni anterior a la fecha mínima (grado / matrícula).
    if (e.inicio && e.inicio > hoy) errs.inicio = "La fecha de inicio no puede ser posterior a la fecha actual.";
    else if (e.inicio && fechaMinima && e.inicio < fechaMinima.fecha) errs.inicio = mensajeFechaMinima(fechaMinima);
    // Fecha de finalización: obligatoria salvo experiencia vigente; nunca futura.
    if (!e.actualmente) {
      if (!e.fin) errs.fin = "Requerido.";
      else if (e.fin > hoy) errs.fin = "La fecha de finalización no puede ser posterior a la fecha actual.";
      else if (fechasInconsistentes(e.inicio, e.fin)) errs.fin = "La fecha de finalización no puede ser anterior a la fecha de inicio.";
    }
    setErr(errs);
    if (Object.keys(errs).length === 0)
      onAdd({
        ...(e.actualmente ? { ...e, fin: "" } : e),
        // Se conserva el promedio real, aunque supere 40 h (el tope aplica solo al puntaje).
        horas: horasSemanales.toFixed(2),
      });
  };

  return (
    <Card className="p-5">
      {esCorreccion && <CorreccionAviso />}
      {fechaMinima && (
        <p className="mb-4 text-[12px] text-text-secondary">
          Fecha mínima de inicio: <span className="font-semibold text-navy">{fmtFecha(fechaMinima.fecha)}</span> (
          {fechaMinima.motivo === "matricula" ? "matrícula profesional" : "grado del pregrado"}).
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Entidad" required error={err.entidad}>
          <Input value={e.entidad} error={!!err.entidad} onChange={(ev) => setE({ ...e, entidad: ev.target.value })} />
        </Field>
        <Field label="Cargo" required error={err.cargo} hint={cargoAnterior ? `Cargo registrado anteriormente: «${e.cargo}».` : undefined}>
          <Select value={e.cargo} error={!!err.cargo} onChange={(ev) => setE({ ...e, cargo: ev.target.value })}>
            <option value="">Seleccionar cargo…</option>
            {cargoAnterior && <option value={e.cargo}>{e.cargo} (cargo anterior)</option>}
            {CARGOS_EXP.map((cargo) => <option key={cargo}>{cargo}</option>)}
          </Select>
        </Field>
        <Field label="Tipo de actividad" required hint="Determina los puntos por año según el Decreto 1279.">
          <Select value={e.nivel} onChange={(ev) => setE({ ...e, nivel: ev.target.value as Experiencia["nivel"] })}>
            {NIVELES_EXP.map((n) => <option key={n}>{n}</option>)}
          </Select>
        </Field>
        <Field label="Tipo de dedicación" required>
          <Select value={e.dedicacion} onChange={(ev) => setE({ ...e, dedicacion: ev.target.value as Experiencia["dedicacion"] })}>
            {e.dedicacion === "Tiempo parcial" && <option>Tiempo parcial</option>}
            {DEDICACIONES_EXP.map((d) => <option key={d}>{d}</option>)}
          </Select>
        </Field>
        <Field label="Fecha de inicio" required error={err.inicio}>
          <Input type="date" min={fechaMinima?.fecha} max={hoyISO()} value={e.inicio} error={!!err.inicio} onChange={(ev) => setE({ ...e, inicio: ev.target.value })} />
        </Field>
        <Field label="Fecha de finalización" required={!e.actualmente} error={err.fin} hint={e.actualmente ? "Experiencia vigente: se calcula hasta la fecha actual." : undefined}>
          <Input
            type="date"
            min={e.inicio || undefined}
            max={hoyISO()}
            value={e.actualmente ? "" : e.fin}
            disabled={e.actualmente}
            error={!!err.fin}
            onChange={(ev) => setE({ ...e, fin: ev.target.value })}
          />
          <label className="mt-2 flex items-center gap-2 text-[13px] text-text-secondary">
            <input
              type="checkbox"
              className="size-4 rounded border-border-soft accent-navy"
              checked={!!e.actualmente}
              onChange={(ev) => setE({ ...e, actualmente: ev.target.checked, fin: "" })}
            />
            Actualmente (esta experiencia continúa vigente)
          </label>
        </Field>
        <Field label="Horas trabajadas (total del periodo)" required error={err.horasTotales} hint="Total de horas certificadas durante todo el periodo.">
          <Input
            type="number"
            min={1}
            step="any"
            inputMode="decimal"
            value={e.horasTotales ?? ""}
            error={!!err.horasTotales}
            onChange={(ev) => setE({ ...e, horasTotales: ev.target.value })}
          />
        </Field>
        <Field label="Promedio de horas semanales (calculado)" hint="Horas totales ÷ semanas transcurridas. No editable.">
          <div className="flex h-11 items-center rounded-[8px] border border-border-soft bg-disabled px-3 text-[14px] text-text-secondary" aria-live="polite">
            {horasSemanales > 0 ? `${horasSemanales.toFixed(2)} h/semana · ${semanas.toFixed(1)} semanas` : "Complete las fechas y las horas"}
          </div>
        </Field>
        {dur && dur.totalDias > 0 && (
          <div className="md:col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[8px] border border-border-soft bg-bg px-4 py-2">
            <span className="text-[12px] font-medium uppercase tracking-wide text-text-secondary">Duración calculada</span>
            <span className="text-[14px] font-bold text-navy">{fmtDuracion(dur)}</span>
            <span className="text-[12px] text-text-secondary">({dur.decimal.toFixed(2)} años para el cálculo del puntaje)</span>
          </div>
        )}
        <CampoObservacion value={e.observacion} onChange={(v) => setE({ ...e, observacion: v })} />
      </div>
      {horasSemanales > HORAS_MAX_SEMANALES && (
        <div className="mt-4">
          <InlineAlert tone="info">
            Se conservan las {horasSemanales.toFixed(2)} horas semanales registradas. Para el puntaje se reconocen como máximo {HORAS_MAX_SEMANALES} horas semanales.
          </InlineAlert>
        </div>
      )}
      {ptsExp && (
        <div className="mt-4 rounded-[8px] border border-border-soft bg-navy/5 px-4 py-2.5">
          <p className="text-[13px] text-text-secondary">
            Puntaje estimado (si no hubiera simultaneidad): <span className="font-bold text-navy">{ptsExp} pts</span> ({anios.toFixed(2)} años × {horasReconocidas.toFixed(2)}/{HORAS_MAX_SEMANALES} h reconocidas × {PUNTOS_EXPERIENCIA_ANIO[e.nivel]} pts/año)
          </p>
        </div>
      )}
      {exceso && (
        <div className="mt-4">
          <InlineAlert tone="warning">
            Esta experiencia coincide con otras y en conjunto superan las {HORAS_MAX_SEMANALES} horas semanales. Todos los registros se conservan; para el puntaje se reconocen como máximo {HORAS_MAX_SEMANALES} horas semanales en los periodos coincidentes.
          </InlineAlert>
        </div>
      )}
      <div className="mt-5 flex justify-end gap-3">
        <Button variant="tertiary" onClick={onCancel}>Cancelar</Button>
        <Button variant="secondary" onClick={guardar}>{esCorreccion ? "Añadir registro corregido" : editing ? "Guardar cambios" : "Añadir registro"}</Button>
      </div>
    </Card>
  );
}

function PasoExperiencia({ exp, set, bit, onPendingChange }: { exp: Expediente; set: SetFn; bit: BitFn; onPendingChange: (pending: boolean) => void }) {
  const [form, setForm] = useState(false);
  const [editing, setEditing] = useState<Experiencia | null>(null);
  const [pendingEdit, setPendingEdit] = useState<Experiencia | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Experiencia | null>(null);
  const col = useColeccion<Experiencia>(exp, set, bit, "experiencia", "Experiencia", (r) =>
    `${r.cargo} · ${r.entidad} (${fmtFecha(r.inicio)} — ${r.actualmente ? "Actualidad" : fmtFecha(r.fin)}) · ${horasNum(r.horas).toFixed(2)} h/sem`
  );

  const upsert = (r: Experiencia) => {
    col.guardar(r);
    setForm(false);
    setEditing(null);
    onPendingChange(false);
  };

  const res = resumenPuntaje(exp).experiencia;
  const porId = new Map(res.detalle.map((d) => [d.id, d]));
  const nombre = new Map(exp.experiencia.map((x) => [x.id, `${x.cargo} · ${x.entidad}`]));
  const fechaMinima = fechaMinimaExperiencia(exp.formacion);
  const incompatibles = new Set(experienciasIncompatibles(exp).map((x) => x.id));

  return (
    <div className="flex flex-col gap-4">
      {incompatibles.size > 0 && fechaMinima && (
        <InlineAlert tone="error">
          {mensajeFechaMinima(fechaMinima)} {incompatibles.size} experiencia(s) inician antes de esa fecha (marcadas abajo). Corrige la fecha de inicio antes de finalizar la valoración.
        </InlineAlert>
      )}
      {res.hayExceso && (
        <InlineAlert tone="warning">
          Existen experiencias simultáneas que superan conjuntamente las {HORAS_MAX_SEMANALES} horas semanales. Todas se conservan y participan en el cálculo; solo se limita el reconocimiento en los periodos coincidentes (ver desglose).
        </InlineAlert>
      )}
      {exp.experiencia.length > 0 && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-[14px]">
              <thead>
                <tr className="border-b border-border-soft bg-bg/60 text-left text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
                  <th className="px-4 py-3">Entidad / cargo</th>
                  <th className="px-4 py-3">Periodo y duración</th>
                  <th className="px-4 py-3 text-right">Horas/sem registradas</th>
                  <th className="px-4 py-3 text-right">Horas/sem reconocidas</th>
                  <th className="px-4 py-3 text-right">Puntos</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {exp.experiencia.map((r) => {
                  const det = porId.get(r.id);
                  const vig = esVigente(r);
                  return (
                    <tr key={r.id} className="border-b border-border-soft align-top last:border-0">
                      <td className="px-4 py-3">
                        <p className={`font-medium text-text-primary ${col.segunda ? tonoTexto(r) : ""}`}>{r.entidad}</p>
                        <p className="text-[12px] text-text-secondary">
                          {r.cargo}
                          {r.cargo && !CARGOS_EXP.includes(r.cargo as (typeof CARGOS_EXP)[number]) ? " (cargo anterior)" : ""} · {r.nivel} · {r.dedicacion}
                        </p>
                        {incompatibles.has(r.id) && (
                          <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-error">
                            <AlertTriangle className="size-3" /> Inicia antes de {fmtFecha(fechaMinima!.fecha)}
                          </p>
                        )}
                        {det?.simultanea && <p className="mt-1 text-[11px] font-semibold text-warning">Simultánea con otra(s) experiencia(s)</p>}
                        {r.observacion?.trim() && <p className="mt-0.5 text-[11px] italic text-text-secondary">Observación: {r.observacion}</p>}
                        {col.segunda && <div className="mt-1.5"><EnvioBadge r={r} /></div>}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-text-secondary">
                        {fmtFecha(r.inicio)} → {r.actualmente ? "Actualidad" : fmtFecha(r.fin)}
                        <p className="text-[12px] font-medium text-navy">{fmtDuracion(duracionCalendario(r.inicio, finEfectivo(r)))}</p>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-text-primary">
                        {horasNum(r.horas).toFixed(2)}
                        {r.horasTotales && <p className="text-[11px] text-text-secondary">{r.horasTotales} h totales</p>}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-text-primary">{det ? det.horasReconocidas.toFixed(2) : "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-navy">{det ? det.puntos.toFixed(2) : vig ? "0.00" : "No puntúa"}</td>
                      <td className="px-4 py-3">
                        <AccionesRegistro
                          r={r}
                          segunda={col.segunda}
                          onEdit={() => setPendingEdit(r)}
                          onDelete={() => setPendingDelete(r)}
                          onExcluir={() => col.marcar(r, "no_tenido_en_cuenta")}
                          onIncluir={() => col.marcar(r, "vigente")}
                          onReemplazar={() => { setEditing(col.prepararReemplazo(r)); setForm(true); }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t border-border-soft bg-navy/5 px-4 py-2.5 text-[13px]">
            <span className="text-text-secondary">
              Total Experiencia calificada
              {res.sinTope > res.valor && ` (tope de categoría ${res.tope} aplicado; calculado ${res.sinTope.toFixed(2)})`}
            </span>
            <span className="font-bold tabular-nums text-navy">{res.valor.toFixed(2)} pts</span>
          </div>
        </Card>
      )}

      {res.simultaneos.length > 0 && (
        <Card className="p-5">
          <h3 className="text-[15px] font-semibold text-navy">Desglose de periodos simultáneos</h3>
          <p className="mb-3 text-[12px] text-text-secondary">{CRITERIO_SIMULTANEIDAD}</p>
          <ul className="flex flex-col gap-2.5">
            {res.simultaneos.map((s) => (
              <li key={`${s.inicio}-${s.fin}-${s.ids.join("-")}`} className="rounded-[8px] border border-border-soft px-3 py-2.5 text-[13px]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold tabular-nums text-text-primary">{fmtFecha(s.inicio)} – {fmtFecha(s.fin)}</span>
                  <span className="text-[12px] tabular-nums text-text-secondary">
                    Registradas: <b className="text-text-primary">{s.horasRegistradas.toFixed(2)} h/sem</b> · Reconocidas: <b className="text-navy">{s.horasReconocidas.toFixed(2)} h/sem</b>
                  </span>
                </div>
                <ul className="mt-1.5 flex flex-col gap-0.5 text-[12px] text-text-secondary">
                  {s.ids.map((id) => (
                    <li key={id} className="flex justify-between gap-3">
                      <span className="truncate">{nombre.get(id) ?? id}</span>
                      <span className="shrink-0 tabular-nums">{(s.reconocidasPorId[id] ?? 0).toFixed(2)} h reconocidas</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {form ? (
        <FormExperiencia
          key={editing?.id ?? "nuevo"}
          onAdd={upsert}
          existentes={exp.experiencia}
          editing={editing}
          esCorreccion={!!editing?.reemplazaA && !exp.experiencia.some((x) => x.id === editing.id)}
          fechaMinima={fechaMinima}
          onPendingChange={onPendingChange}
          onCancel={() => { onPendingChange(false); setForm(false); setEditing(null); }}
        />
      ) : (
        <Button variant="outline" onClick={() => setForm(true)} className="self-start">
          <Plus className="size-[18px]" /> Añadir experiencia
        </Button>
      )}

      <ConfirmEditModal
        open={!!pendingEdit}
        onCancel={() => setPendingEdit(null)}
        onConfirm={() => { setEditing(pendingEdit); setForm(true); setPendingEdit(null); }}
      />
      <ConfirmDeleteModal
        open={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) col.eliminar(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

// =====================================================================
// PASO 4 — Productividad académica
// =====================================================================

const TIPOS_PRODUCTO = [
  "Artículo",
  "Libro",
  "Video / producción cinematográfica / fonográfica",
  "Premio",
  "Patente",
  "Obra artística",
  "Producción técnica",
  "Software",
];
const TIPOS_LIBRO = [
  "Libro resultado de investigación",
  "Libro de texto",
  "Libro de ensayo",
  "Traducción de libro",
];
const REQUIERE_PARES = ["Libro", "Video / producción cinematográfica / fonográfica", "Obra artística"];

function FormProducto({
  onAdd,
  existentes,
  editing,
  esCorreccion,
  onCancel,
  onPendingChange,
}: {
  onAdd: (p: Producto) => void;
  existentes: Producto[];
  editing: Producto | null;
  esCorreccion?: boolean;
  onCancel: () => void;
  onPendingChange: (pending: boolean) => void;
}) {
  const [p, setP] = useState<Producto>(
    editing ?? { id: rid(), tipo: "Artículo", nombre: "", autores: 1, requierePares: false, tipoArticulo: "Artículo completo" }
  );
  // Texto del campo de autores (permite borrar y reescribir con el teclado).
  const [autoresTxt, setAutoresTxt] = useState(String(editing?.autores ?? 1));
  const [err, setErr] = useState<Record<string, string>>({});
  usePendiente(p, onPendingChange);
  const dup = existentes.some(
    (x) => x.id !== p.id && x.nombre.trim().toLowerCase() === p.nombre.trim().toLowerCase() && p.nombre.trim()
  );

  const esVideo = p.tipo === "Video / producción cinematográfica / fonográfica";
  const esObra = p.tipo === "Obra artística";
  const esPremio = p.tipo === "Premio";
  const usaAmbito = esVideo || esObra || esPremio;

  const setTipo = (tipo: string) =>
    setP({
      ...p,
      tipo,
      requierePares: REQUIERE_PARES.includes(tipo),
      conceptoPares: REQUIERE_PARES.includes(tipo) ? "Pendiente de concepto" : undefined,
      clasificacion: undefined,
      tipoArticulo: tipo === "Artículo" ? "Artículo completo" : undefined,
      subtipo: undefined,
      ambito: undefined,
      pais: undefined,
      impacto: undefined,
    });

  // Recalcula el subtipo (clave de puntaje) según ámbito y modalidad.
  const recomponer = (next: Producto): Producto => {
    if (next.tipo === "Video / producción cinematográfica / fonográfica") {
      next.subtipo = next.ambito
        ? `Video/Cine/Fonografía — ${next.ambito === "Internacional" ? "internacional" : "nacional"}`
        : undefined;
    } else if (next.tipo === "Obra artística") {
      next.subtipo =
        next.impacto && next.ambito
          ? `Obra artística — ${next.impacto} ${next.ambito === "Internacional" ? "internacional" : "nacional"}`
          : undefined;
    } else if (next.tipo === "Premio") {
      // El puntaje normativo del premio no varía por ámbito, pero el usuario
      // debe elegir explícitamente Nacional o Internacional.
      next.subtipo = next.ambito ? "Premio nacional o internacional" : undefined;
    }
    // Al cambiar a Nacional se limpia el país.
    if (next.ambito !== "Internacional") next.pais = undefined;
    return next;
  };

  const ptsPreview = puntajeProducto(p);

  const guardar = () => {
    const e: Record<string, string> = {};
    if (!p.nombre.trim()) e.nombre = "Requerido.";
    if (p.tipo === "Artículo") {
      if (!p.clasificacion) e.clasificacion = "Requerido.";
      if (!p.fecha) e.fecha = "La fecha de publicación es obligatoria para continuar.";
    }
    if (p.tipo === "Libro" && !p.subtipo) e.subtipo = "Requerido.";
    if (esObra && !p.impacto) e.impacto = "Requerido.";
    if (usaAmbito && !p.ambito) e.ambito = "Requerido.";
    if (usaAmbito && p.ambito === "Internacional" && !p.pais)
      e.pais = "Selecciona el país del producto internacional.";
    if (!/^\d+$/.test(autoresTxt) || Number(autoresTxt) < 1)
      e.autores = "Ingresa un número entero de autores, mínimo 1.";
    setErr(e);
    if (Object.keys(e).length === 0) onAdd(p);
  };

  return (
    <Card className="p-5">
      {esCorreccion && <CorreccionAviso />}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Tipo de producto académico" required>
          <Select value={p.tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS_PRODUCTO.map((t) => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label={p.tipo === "Artículo" ? "Revista" : "Nombre / producto"} required error={err.nombre}>
          <Input value={p.nombre} error={!!err.nombre} onChange={(e) => setP({ ...p, nombre: e.target.value })} />
        </Field>

        {p.tipo === "Artículo" && (
          <>
            <Field label="Clasificación" required error={err.clasificacion}>
              <Select value={p.clasificacion ?? ""} error={!!err.clasificacion} onChange={(e) => setP({ ...p, clasificacion: e.target.value as Producto["clasificacion"] })}>
                <option value="">Seleccione…</option>
                {(["A1", "A2", "B", "C"] as const).map((c) => <option key={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Tipo de artículo">
              <div className="flex h-[40px] items-center rounded-[8px] border border-border-soft bg-disabled px-3 text-[14px] text-text-secondary select-none">
                Artículo completo
              </div>
            </Field>
            <Field label="Fecha de publicación" required error={err.fecha}>
              <Input type="date" value={p.fecha ?? ""} error={!!err.fecha} onChange={(e) => setP({ ...p, fecha: e.target.value })} />
            </Field>
            <Field label="ISSN">
              <Input value={p.issn ?? ""} placeholder="Ej. 1234-5678" onChange={(e) => setP({ ...p, issn: e.target.value })} />
            </Field>
            <Field label="ISSN secundario (opcional)">
              <Input value={p.issnSecundario ?? ""} placeholder="Ej. 8765-4321" onChange={(e) => setP({ ...p, issnSecundario: e.target.value })} />
            </Field>
          </>
        )}

        {p.tipo === "Libro" && (
          <Field label="Tipo de libro" required error={err.subtipo}>
            <Select value={p.subtipo ?? ""} error={!!err.subtipo} onChange={(e) => setP({ ...p, subtipo: e.target.value })}>
              <option value="">Seleccione…</option>
              {TIPOS_LIBRO.map((t) => <option key={t}>{t}</option>)}
            </Select>
          </Field>
        )}

        {esObra && (
          <Field label="Modalidad de la obra" required error={err.impacto}>
            <Select
              value={p.impacto ?? ""}
              error={!!err.impacto}
              onChange={(e) => setP(recomponer({ ...p, impacto: e.target.value }))}
            >
              <option value="">Seleccione…</option>
              <option value="creación original">Creación original</option>
              <option value="complementaria">Complementaria</option>
              <option value="interpretación">Interpretación</option>
            </Select>
          </Field>
        )}

        {usaAmbito && (
          <Field label="Origen" required error={err.ambito}>
            <Select
              value={p.ambito ?? ""}
              error={!!err.ambito}
              onChange={(e) => setP(recomponer({ ...p, ambito: e.target.value as Producto["ambito"] }))}
            >
              <option value="">Seleccione…</option>
              <option>Nacional</option>
              <option>Internacional</option>
            </Select>
          </Field>
        )}

        {usaAmbito && p.ambito === "Internacional" && (
          <Field label="País" required error={err.pais}>
            <Select value={p.pais ?? ""} error={!!err.pais} onChange={(e) => setP({ ...p, pais: e.target.value })}>
              <option value="">Seleccione…</option>
              {PAISES.filter((x) => x !== "Colombia").map((x) => <option key={x}>{x}</option>)}
            </Select>
          </Field>
        )}


        <Field label="Número de autores" required error={err.autores} hint="Número entero (mínimo 1). Afecta el puntaje según el Decreto 1279.">
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            value={autoresTxt}
            error={!!err.autores}
            onChange={(e) => {
              // Solo dígitos: sin negativos, decimales ni notación científica.
              const v = e.target.value.replace(/\D/g, "").slice(0, 3);
              setAutoresTxt(v);
              const n = parseInt(v, 10);
              if (n >= 1) setP({ ...p, autores: n });
            }}
          />
        </Field>
        <CampoObservacion value={p.observacion} onChange={(v) => setP({ ...p, observacion: v })} />
      </div>

      {ptsPreview > 0 && (
        <div className="mt-4 rounded-[8px] border border-border-soft bg-navy/5 px-4 py-2.5">
          <p className="text-[13px] text-text-secondary">
            Puntaje estimado: <span className="font-bold text-navy">{ptsPreview.toFixed(2)} pts</span>
          </p>
        </div>
      )}

      {p.requierePares && (
        <div className="mt-4 flex flex-col gap-3">
          <InlineAlert tone="warning">
            Este producto requiere concepto de pares. No se contabilizará hasta registrar el concepto y el puntaje.
          </InlineAlert>
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              checked={p.conceptoPares === "Registrado"}
              onChange={(e) => setP({ ...p, conceptoPares: e.target.checked ? "Registrado" : "Pendiente de concepto", puntajePares: e.target.checked ? p.puntajePares : undefined })}
              className="size-4 accent-[var(--color-navy)]"
            />
            Concepto de pares registrado
          </label>
          {p.conceptoPares === "Registrado" && (
            <Field label="Puntaje recibido de pares" required>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={p.puntajePares ?? ""}
                  placeholder="0.00"
                  onChange={(e) => setP({ ...p, puntajePares: e.target.value === "" ? undefined : Number(e.target.value) })}
                  className="max-w-[140px]"
                />
                <span className="text-[13px] text-text-secondary">puntos</span>
              </div>
            </Field>
          )}
        </div>
      )}

      {dup && (
        <div className="mt-4">
          <InlineAlert tone="warning">
            Ya existe un producto con el mismo nombre. Verifique que no sea un duplicado.
          </InlineAlert>
        </div>
      )}

      <div className="mt-5 flex justify-end gap-3">
        <Button variant="tertiary" onClick={onCancel}>Cancelar</Button>
        <Button variant="secondary" onClick={guardar}>{esCorreccion ? "Añadir registro corregido" : editing ? "Guardar cambios" : "Añadir producto"}</Button>
      </div>
    </Card>
  );
}

function PasoProductividad({ exp, set, bit, onPendingChange }: { exp: Expediente; set: SetFn; bit: BitFn; onPendingChange: (pending: boolean) => void }) {
  const [form, setForm] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [pendingEdit, setPendingEdit] = useState<Producto | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Producto | null>(null);
  const col = useColeccion<Producto>(exp, set, bit, "productividad", "Productividad", (p) => {
    const pts = puntajeProducto(p);
    return `${p.tipo}: "${p.nombre}" · ${p.autores} autor(es) · ${pts > 0 ? pts.toFixed(2) + " pts" : "Pendiente pares"}`;
  });
  const res = resumenPuntaje(exp).productividad;

  const upsert = (p: Producto) => {
    col.guardar(p);
    setForm(false);
    setEditing(null);
    onPendingChange(false);
  };

  const grupos = exp.productividad.reduce<Record<string, Producto[]>>((acc, p) => {
    (acc[p.tipo] = acc[p.tipo] ?? []).push(p);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {exp.productividad.length > 0 && (
        <div className="flex flex-col gap-2">
          {Object.entries(grupos).map(([tipo, items]) => (
            <div key={tipo} className="overflow-hidden rounded-[8px] border border-border-soft bg-surface">
              <div className="flex items-center gap-2 border-b border-border-soft bg-navy/5 px-3 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-navy">{tipo}</span>
                <span className="ml-auto text-[11px] text-text-secondary">{items.length} {items.length === 1 ? "ítem" : "ítems"}</span>
              </div>
              <ul className="divide-y divide-border-soft">
                {items.map((p) => {
                  const pts = puntajeProducto(p);
                  const pend = p.requierePares && p.conceptoPares !== "Registrado";
                  const vig = esVigente(p);
                  return (
                    <li key={p.id} className="flex items-start gap-3 px-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <span className={`block truncate text-[13px] font-medium text-text-primary ${col.segunda ? tonoTexto(p) : ""}`}>{p.nombre}</span>
                        <span className="block text-[11px] text-text-secondary">
                          {[
                            p.clasificacion,
                            p.fecha && fmtFecha(p.fecha),
                            p.issn && `ISSN ${p.issn}`,
                            p.issnSecundario && `ISSN secundario ${p.issnSecundario}`,
                            `${p.autores} autor${p.autores === 1 ? "" : "es"}`,
                          ].filter(Boolean).join(" · ")}
                        </span>
                        {p.observacion?.trim() && <span className="block text-[11px] italic text-text-secondary">Observación: {p.observacion}</span>}
                        <div className="mt-1.5 flex flex-wrap items-center gap-3">
                          {col.segunda && <EnvioBadge r={p} />}
                          <AccionesRegistro
                            r={p}
                            segunda={col.segunda}
                            onEdit={() => setPendingEdit(p)}
                            onDelete={() => setPendingDelete(p)}
                            onExcluir={() => col.marcar(p, "no_tenido_en_cuenta")}
                            onIncluir={() => col.marcar(p, "vigente")}
                            onReemplazar={() => { setEditing(col.prepararReemplazo(p)); setForm(true); }}
                          />
                        </div>
                      </div>
                      <span className={`shrink-0 text-[12px] font-bold tabular-nums ${!vig ? "text-text-secondary" : pend ? "text-warning" : "text-navy"}`}>
                        {!vig ? "No puntúa" : pend ? "Pendiente de pares" : `${pts.toFixed(2)} pts`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="flex flex-wrap justify-between gap-2 rounded-[8px] border border-border-soft bg-navy/5 px-4 py-2.5 text-[13px]">
            <span className="text-text-secondary">
              Total Productividad académica{res.sinTope > res.valor && ` (tope ${res.tope} aplicado; calculado ${res.sinTope.toFixed(2)})`}
            </span>
            <span className="font-bold tabular-nums text-navy">{res.valor.toFixed(2)} pts</span>
          </div>
        </div>
      )}

      {form ? (
        <FormProducto
          key={editing?.id ?? "nuevo"}
          onAdd={upsert}
          existentes={exp.productividad}
          editing={editing}
          esCorreccion={!!editing?.reemplazaA && !exp.productividad.some((x) => x.id === editing.id)}
          onPendingChange={onPendingChange}
          onCancel={() => { onPendingChange(false); setForm(false); setEditing(null); }}
        />
      ) : (
        <Button variant="outline" onClick={() => setForm(true)} className="self-start">
          <Plus className="size-[18px]" /> Añadir producto
        </Button>
      )}

      <ConfirmEditModal
        open={!!pendingEdit}
        onCancel={() => setPendingEdit(null)}
        onConfirm={() => { setEditing(pendingEdit); setForm(true); setPendingEdit(null); }}
      />
      <ConfirmDeleteModal
        open={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) col.eliminar(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

// =====================================================================
// PASO 5 — Resumen
// =====================================================================

const MOTIVO_LABEL: Record<string, string> = {
  pendiente: "Pendiente de convalidación",
  "no-mejor-pregrado": "No es el pregrado de mayor puntaje",
  "tope-grupo": "Tope del grupo alcanzado",
  "tope-combo": "Ajuste por tope de la combinación",
  "tope-global": "Tope máximo de posgrados alcanzado",
  "limite-doctorados": "No participa por límite de títulos de Doctorado",
};

const GRUPO_INFO: { key: "espNormales" | "maestrias" | "clinicas" | "doctorados"; titulo: string; topeTxt: string }[] = [
  { key: "espNormales", titulo: "Especializaciones normales", topeTxt: "Máx. acumulable: 30 pts" },
  { key: "maestrias", titulo: "Maestrías", topeTxt: "Máx. acumulable: 60 pts" },
  { key: "clinicas", titulo: "Especializaciones clínicas", topeTxt: "Máx. acumulable: 75 pts" },
  { key: "doctorados", titulo: "Doctorados", topeTxt: "Hasta 140 pts según combinación" },
];

// Lista compacta de un grupo de formación con su encabezado y subtotal.
function FilaGrupo({ titulo, topeTxt, sub, items }: { titulo: string; topeTxt: string; sub?: SubtotalGrupo; items: DesgloseFormacion[] }) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-lg border border-border-soft">
      <div className="flex items-center justify-between gap-2 border-b border-border-soft bg-navy/5 px-3 py-2">
        <div>
          <p className="text-[12px] font-semibold text-navy">{titulo}</p>
          <p className="text-[11px] text-text-secondary">{topeTxt}</p>
        </div>
        {sub && (
          <span className="shrink-0 text-[12px] tabular-nums text-text-secondary">
            <span className="font-semibold text-navy">{sub.reconocido}</span> / {sub.tope}
          </span>
        )}
      </div>
      <ul className="divide-y divide-border-soft">
        {items.map((it) => {
          const reducido = it.reconocido < it.potencial;
          return (
            <li key={it.id} className="flex items-start justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-[12px] text-text-primary">{it.label}</p>
                <p className="truncate text-[11px] text-text-secondary">
                  {it.institucion}
                  {it.fecha ? ` · ${fmtFecha(it.fecha)}` : ""}
                </p>
                {it.motivo && <p className="text-[11px] text-text-secondary">{MOTIVO_LABEL[it.motivo]}</p>}
              </div>
              <div className="shrink-0 text-right tabular-nums">
                {reducido ? (
                  <>
                    <span className="text-[11px] text-text-secondary line-through">{it.potencial}</span>{" "}
                    <span className={`text-[13px] font-semibold ${it.reconocido === 0 ? "text-text-secondary" : "text-navy"}`}>{it.reconocido}</span>
                  </>
                ) : (
                  <span className="text-[13px] font-semibold text-navy">{it.reconocido}</span>
                )}
                <span className="ml-0.5 text-[11px] text-text-secondary"> pts</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PasoResumen({ exp, set }: { exp: Expediente; set: SetFn }) {
  const [traza, setTraza] = useState(false);
  const [calc, setCalc] = useState(false);
  const r = resumenPuntaje(exp);
  const fd = r.formacionDetalle;
  const d = exp.docente;
  const valorPuntoOk = PARAMS.valorPuntoDefinido;
  const factorDed =
    d.dedicacion === "Medio tiempo"
      ? 0.5
      : d.dedicacion === "Horas semanales"
        ? Math.min(horasNum(d.horasDedicacion) / HORAS_MAX_SEMANALES, 1)
        : 1;
  const estimativo = r.total * exp.valorPunto * factorDed;
  const filas = [
    { k: "Formación académica", v: r.formacion },
    { k: "Categoría docente", v: r.categoria },
    { k: "Experiencia calificada", v: r.experiencia.valor, tope: r.experiencia },
    { k: "Productividad académica", v: r.productividad.valor, tope: r.productividad },
  ];

  return (
    <div className="flex flex-col gap-5">
      <Card className="overflow-hidden border-navy">
        <div className="flex flex-col gap-1 bg-navy px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-yellow">Resultado de categorización</p>
            <p className="mt-1 text-[14px] text-white/70">Categoría docente calculada</p>
            <p className="mt-1 text-[24px] font-bold leading-tight">{r.categoriaCalculada}</p>
            <p className="text-[13px] text-white/80">{r.categoria} puntos asociados a la categoría</p>
          </div>
          <div className="mt-3 sm:mt-0 sm:text-right">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-yellow">Puntaje total</p>
            <p className="text-[28px] font-bold tabular-nums leading-tight">{r.total.toFixed(2)}</p>
            <p className="text-[12px] text-white/70">puntos</p>
          </div>
        </div>
        <p className="px-5 py-2.5 text-[12px] text-text-secondary">
          Al finalizar, el expediente queda guardado y podrá editarse posteriormente desde «Valoraciones completadas».
        </p>
      </Card>
      {(exp.historial ?? []).length > 0 && (
        <Card className="p-5">
          <h3 className="mb-2 flex items-center gap-2 text-[16px] font-semibold text-navy"><History className="size-4" /> Histórico de valoraciones</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[13px]">
              <thead>
                <tr className="border-b border-border-soft text-left text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
                  <th className="py-2">Valoración</th><th className="py-2">Categoría</th><th className="py-2 text-right">Formación</th><th className="py-2 text-right">Experiencia</th><th className="py-2 text-right">Productividad</th><th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(exp.historial ?? []).map((h) => (
                  <tr key={h.numero} className="border-b border-border-soft">
                    <td className="py-2">Valoración {h.numero}<span className="block text-[11px] text-text-secondary">{h.fecha}</span></td>
                    <td className="py-2">{h.categoria}</td>
                    <td className="py-2 text-right tabular-nums">{h.formacion.toFixed(2)}</td>
                    <td className="py-2 text-right tabular-nums">{h.experiencia.toFixed(2)}</td>
                    <td className="py-2 text-right tabular-nums">{h.productividad.toFixed(2)}</td>
                    <td className="py-2 text-right font-semibold tabular-nums">{h.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-navy/5 font-semibold text-navy">
                  <td className="py-2 pl-1">Valoración {exp.numeroValoracion ?? 2} (en curso)</td>
                  <td className="py-2">{r.categoriaCalculada}</td>
                  <td className="py-2 text-right tabular-nums">{r.formacion.toFixed(2)}</td>
                  <td className="py-2 text-right tabular-nums">{r.experiencia.valor.toFixed(2)}</td>
                  <td className="py-2 text-right tabular-nums">{r.productividad.valor.toFixed(2)}</td>
                  <td className="py-2 text-right tabular-nums">{r.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Card className="p-5">
        <h3 className="mb-3 text-[16px] font-semibold text-navy">Datos del docente</h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[14px] md:grid-cols-3">
          {[
            ["Nombre", d.nombre],
            ["Identificación", d.identificacion],
            ["Facultad", d.facultad],
            ["Sede", d.sede || "—"],
            ["Tipo de vinculación", "Docente de planta"],
            ["Dedicación", d.dedicacion || "—"],
            ["Categoría", r.categoriaCalculada],
            ["Fecha de creación", fmtFecha(exp.creado)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[12px] text-text-secondary">{k}</dt>
              <dd className="font-medium text-text-primary">{v || "—"}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border-soft px-5 py-4">
          <h3 className="text-[16px] font-semibold text-navy">Resumen de puntaje</h3>
          <p className="text-[12px] text-text-secondary">Cálculo preliminar · Reglas {exp.reglasVersion}</p>
        </div>
        <table className="w-full text-[14px]">
          <tbody>
            {filas.map((f) => (
              <tr key={f.k} className="border-b border-border-soft">
                <td className="px-5 py-3 text-text-primary">
                  {f.k}
                  {f.tope && f.tope.sinTope > f.tope.valor && (
                    <span className="ml-2 rounded-full bg-warning-bg px-2 py-0.5 text-[11px] font-semibold text-warning">
                      Tope aplicado ({f.tope.tope})
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-right tabular-nums font-semibold text-navy">{f.v.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-navy/5">
              <td className="px-5 py-3 font-bold text-navy">Puntaje total</td>
              <td className="px-5 py-3 text-right text-[18px] font-bold tabular-nums text-navy">{r.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <Card className="overflow-hidden">
        <button onClick={() => setCalc((t) => !t)} className="flex w-full items-center justify-between px-5 py-3 text-left text-[14px] font-semibold text-navy">
          Cálculo aplicado · Formación académica
          <span className="text-[12px] font-normal text-text-secondary">{calc ? "Ocultar" : "Mostrar"}</span>
        </button>
        {calc && (
          <div className="border-t border-border-soft px-5 py-4 text-[13px]">
            {fd.desglose.length === 0 ? (
              <p className="text-text-secondary">Aún no se ha registrado formación académica.</p>
            ) : (
              <>
                <p className="mb-3 text-[12px] text-text-secondary">
                  Regla aplicada: <span className="font-semibold text-navy">{fd.reglaAplicada}</span>
                </p>

                {/* Listas compactas agrupadas por tipo */}
                <div className="flex flex-col gap-3">
                  {fd.pregrado.potencial > 0 && (
                    <FilaGrupo titulo="Pregrado" topeTxt="Máx. reconocido: 183 pts" items={fd.desglose.filter((d) => d.grupo === "pregrado")} />
                  )}
                  {GRUPO_INFO.filter((g) => fd.grupos[g.key].presente).map((g) => {
                    const grupoKey = g.key === "espNormales" ? "espNormal" : g.key === "maestrias" ? "maestria" : g.key === "clinicas" ? "clinica" : "doctorado";
                    return (
                      <FilaGrupo
                        key={g.key}
                        titulo={g.titulo}
                        topeTxt={g.topeTxt}
                        sub={fd.grupos[g.key]}
                        items={fd.desglose.filter((d) => d.grupo === grupoKey)}
                      />
                    );
                  })}
                </div>

                {/* Detalle del cálculo */}
                <dl className="mt-4 flex flex-col gap-1.5 border-t border-border-soft pt-3 text-[13px]">
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Pregrado reconocido (tope {fd.pregrado.tope})</dt>
                    <dd className="tabular-nums font-medium text-navy">{fd.pregrado.reconocido}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Posgrados — suma potencial</dt>
                    <dd className="tabular-nums font-medium">{fd.posgradoBruto}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Tope de la combinación</dt>
                    <dd className="tabular-nums font-medium">{fd.topeCombinacion}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Tope global de posgrados</dt>
                    <dd className="tabular-nums font-medium">{fd.topeGlobal}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-text-secondary">Posgrados reconocidos</dt>
                    <dd className="tabular-nums font-semibold text-navy">{fd.posgradoReconocido}</dd>
                  </div>
                  {fd.posgradoBruto > fd.posgradoReconocido && (
                    <p className="mt-1 rounded-md bg-warning-bg px-3 py-2 text-[12px] text-warning">
                      El sistema calculó {fd.posgradoBruto} puntos potenciales en posgrados, pero reconoce {fd.posgradoReconocido} por aplicación de los topes.
                    </p>
                  )}
                  <div className="mt-1 flex justify-between border-t border-border-soft pt-2">
                    <dt className="font-semibold text-navy">Total Formación académica</dt>
                    <dd className="tabular-nums text-[15px] font-bold text-navy">{fd.total}</dd>
                  </div>
                </dl>
              </>
            )}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="mb-3 text-[16px] font-semibold text-navy">Estimativo salarial</h3>
        {valorPuntoOk ? (
          <div className="flex flex-col gap-2 text-[14px]">
            <div className="flex justify-between">
              <span className="text-text-secondary">Valor del punto vigente (parámetro configurado)</span>
              <span className="tabular-nums font-medium">{COP(exp.valorPunto)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Proporcionalidad de dedicación</span>
              <span className="tabular-nums font-medium">×{factorDed}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-border-soft pt-2">
              <span className="font-semibold text-navy">Estimativo preliminar</span>
              <span className="tabular-nums text-[16px] font-bold text-navy">{COP(estimativo)}</span>
            </div>
            <p className="mt-2 text-[12px] text-text-secondary">
              Valor de demostración. No corresponde a un acto administrativo ni a un valor monetario oficial vigente.
            </p>
          </div>
        ) : (
          <InlineAlert tone="warning">No es posible completar el estimativo porque falta un parámetro vigente.</InlineAlert>
        )}
      </Card>

      <Card className="flex flex-col gap-4 p-5">
        <h3 className="text-[16px] font-semibold text-navy">Observaciones</h3>
        <Field label="Observación para el profesor (opcional)" hint="Se incluye en «Valoración para el profesor» y en el expediente para Talento Humano.">
          <Textarea value={exp.observacionProfesor ?? ""} onChange={(e) => set((x) => ({ ...x, observacionProfesor: e.target.value }))} placeholder="Ej. Se recomienda aportar el certificado laboral con intensidad horaria." />
        </Field>
        <Field label="Observación interna para Talento Humano (opcional)" hint="Solo se incluye en el expediente para Talento Humano; no aparece en el documento del profesor.">
          <Textarea value={exp.comentario} onChange={(e) => set((x) => ({ ...x, comentario: e.target.value }))} placeholder="Observaciones internas del expediente." />
        </Field>
      </Card>

      <Card className="overflow-hidden">
        <button onClick={() => setTraza((t) => !t)} className="flex w-full items-center justify-between px-5 py-3 text-left text-[14px] font-semibold text-navy">
          Trazabilidad
          <span className="text-[12px] font-normal text-text-secondary">{traza ? "Ocultar" : "Mostrar"}</span>
        </button>
        {traza && (
          <div className="border-t border-border-soft px-5 py-3 text-[13px] text-text-secondary">
            {exp.bitacora.length === 0 ? (
              <p>Sin movimientos registrados aún.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {exp.bitacora.map((b, i) => (
                  <li key={i} className="flex flex-wrap gap-x-2">
                    <span className="tabular-nums">{b.fecha}</span>·<span>{b.usuario}</span>·
                    <span className="text-text-primary">{b.accion}</span>·<span>{b.elemento}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// =====================================================================
// Wizard shell
// =====================================================================

export function Wizard({ inicial, onSalir, onVerValoraciones }: { inicial: Expediente; onSalir: () => void; onVerValoraciones?: () => void }) {
  const { guardar, usuario } = useStore();
  const [exp, setExp] = useState<Expediente>(inicial);
  const [paso, setPaso] = useState(() => Math.max(...(inicial.pasosCompletados ?? [0]), 0));

  const [toast, setToast] = useState<string | null>(null);
  const cerrarToast = useCallback(() => setToast(null), []);
  const segunda = enSegundaValoracion(exp);

  // Helper: append a bitácora entry with user identity (y confirma visualmente)
  const bit: BitFn = (accion, elemento, detalle) => {
    if (elemento !== "Datos básicos") setToast(`${accion}.`);
    const entry: BitacoraEntry = {
      usuario: usuario.nombre,
      rol: usuario.rol,
      fecha: nowStr(),
      accion,
      elemento,
      detalle,
    };
    setExp((prev) => ({ ...prev, bitacora: [...prev.bitacora, entry] }));
  };
  const [maxPaso, setMaxPaso] = useState(() => {
    if (inicial.pasosCompletados?.length) return Math.max(...inicial.pasosCompletados);
    if (inicial.productividad.length) return 4;
    if (inicial.experiencia.length) return 3;
    if (inicial.formacion.length) return 2;
    if (inicial.docente.nombre) return 1;
    return 0;
  });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState(false);
  const [faltantes, setFaltantes] = useState<string[]>([]);
  const [exito, setExito] = useState<null | Expediente>(null);
  const [estadoGuardado, setEstadoGuardado] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  // Formulario diligenciado pero no añadido (Formación, Experiencia o Productividad).
  const [formPendiente, setFormPendiente] = useState(false);
  const [destinoPendiente, setDestinoPendiente] = useState<number | "salir" | null>(null);

  const set = (fn: (e: Expediente) => Expediente) => setExp(fn);

  const validarPaso1 = () => {
    const e: Record<string, string> = {};
    const d = exp.docente;
    if (!d.nombre.trim()) e.nombre = "Ingrese el nombre del docente.";
    if (!d.identificacion.trim()) e.identificacion = "Ingrese la identificación.";
    if (!d.facultad) e.facultad = "Seleccione la facultad.";
    if (!d.sede) e.sede = "Seleccione la sede.";
    if (!d.dedicacion) e.dedicacion = "Seleccione la dedicación.";
    if (d.dedicacion === "Horas semanales" && horasNum(d.horasDedicacion) <= 0)
      e.horasDedicacion = "Ingrese las horas semanales de dedicación.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const siguiente = () => {
    if (paso === 0 && !validarPaso1()) return;
    if (paso >= 1 && paso <= 3 && formPendiente) {
      setDestinoPendiente(paso + 1);
      return;
    }
    // Log first paso-1 advance as "creation" when bitácora is empty
    if (paso === 0 && exp.bitacora.length === 0) {
      bit(
        "Creación de expediente",
        "Datos básicos",
        `Docente: ${exp.docente.nombre} · Sede: ${exp.docente.sede} · Dedicación: ${exp.docente.dedicacion}`
      );
    }
    const next = Math.min(paso + 1, 4);
    setExp((prev) => ({
      ...prev,
      pasosCompletados: Array.from(new Set([...(prev.pasosCompletados ?? []), paso, next])).sort(),
    }));
    setPaso(next);
    setMaxPaso((m) => Math.max(m, next));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardarBorrador = async () => {
    if (guardando) return;
    const entry: BitacoraEntry = {
      usuario: usuario.nombre,
      rol: usuario.rol,
      fecha: nowStr(),
      accion: "Guardado de borrador",
      elemento: `Paso ${paso + 1}`,
      detalle: `Paso actual: ${PASOS[paso]}`,
    };
    const next = {
      ...exp,
      estado: "En proceso" as const,
      pasosCompletados: Array.from(new Set([...(exp.pasosCompletados ?? []), paso])).sort(),
      bitacora: [...exp.bitacora, entry],
    };
    setExp(next);
    setGuardando(true);
    setEstadoGuardado("saving");
    setErrorGuardado(null);
    try {
      const saved = await guardar(next);
      setExp(saved);
      setEstadoGuardado("saved");
      window.setTimeout(() => setEstadoGuardado("idle"), 2500);
    } catch (error) {
      setEstadoGuardado("error");
      setErrorGuardado(error instanceof Error ? error.message : "No fue posible guardar el borrador.");
    } finally {
      setGuardando(false);
    }
  };

  const intentarFinalizar = () => {
    const fx: string[] = [];
    if (!exp.docente.nombre) fx.push("Complete los datos básicos del docente.");
    if (!exp.docente.sede) fx.push("Seleccione la sede del docente.");
    const paresPend = exp.productividad.filter((p) => p.requierePares && p.conceptoPares !== "Registrado");
    if (paresPend.length) fx.push(`${paresPend.length} producto(s) pendiente(s) de concepto de pares.`);
    const convalPend = exp.formacion.filter(pendienteConvalidacion);
    if (convalPend.length)
      fx.push(`${convalPend.length} título(s) internacional(es) pendiente(s) de convalidación en Colombia.`);
    const prodSinPais = exp.productividad.filter((p) => p.ambito === "Internacional" && !p.pais);
    if (prodSinPais.length)
      fx.push(`${prodSinPais.length} producto(s) internacional(es) sin país indicado.`);
    const sinMat = pregradosSinMatricula(exp);
    if (sinMat.length)
      fx.push(`Registra la fecha de matrícula profesional del pregrado de Ingeniería: ${sinMat.map((f) => f.titulo).join(", ")}.`);
    const incompatibles = experienciasIncompatibles(exp);
    const min = fechaMinimaExperiencia(exp.formacion);
    if (incompatibles.length && min)
      fx.push(`${incompatibles.length} experiencia(s) inician antes de la fecha mínima permitida (${fmtFecha(min.fecha)}). Corrige la fecha de inicio.`);
    setFaltantes(fx);
    setConfirm(true);
  };

  const finalizar = async () => {
    if (guardando) return;
    const r2 = resumenPuntaje(exp);
    const entry: BitacoraEntry = {
      usuario: usuario.nombre,
      rol: usuario.rol,
      fecha: nowStr(),
      accion: segunda ? `Finalización de la valoración ${exp.numeroValoracion}` : "Finalización de valoración",
      elemento: "Expediente",
      detalle: `Puntaje total: ${r2.total.toFixed(2)} pts · Formación: ${r2.formacion} · Categoría: ${r2.categoriaCalculada} (${r2.categoria} pts) · Experiencia: ${r2.experiencia.valor} · Productividad: ${r2.productividad.valor}`,
    };
    const cerrado: Expediente = {
      ...exp,
      estado: "Completada",
      bitacora: [...exp.bitacora, entry],
    };
    setGuardando(true);
    setEstadoGuardado("saving");
    setErrorGuardado(null);
    try {
      const saved = await guardar(cerrado);
      setExp(saved);
      setConfirm(false);
      setEstadoGuardado("saved");
      setExito(saved);
    } catch (error) {
        setEstadoGuardado("error");
        setErrorGuardado(error instanceof Error ? error.message : "No fue posible finalizar la valoración.");
    } finally {
      setGuardando(false);
    }
  };

  if (exito) {
    return <Exito exp={exito} onInicio={onSalir} onExportar={onVerValoraciones ?? onSalir} />;
  }

  const r = resumenPuntaje(exp);

  return (
    <div className="flex flex-col gap-6">
      <Card className="px-5 py-5 md:px-8">
        <Stepper
          paso={paso}
          maxPaso={maxPaso}
          onGoto={(i) => {
            if (i <= maxPaso) {
              if (formPendiente && i !== paso) {
                setDestinoPendiente(i);
                return;
              }
              setExp((prev) => ({
                ...prev,
                pasosCompletados: Array.from(new Set([...(prev.pasosCompletados ?? []), i])).sort(),
              }));
              setPaso(i);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />
      </Card>

      <div>
        <p className="text-[13px] font-semibold uppercase tracking-wide text-text-secondary">
          Valoración para ingreso docente · Paso {paso + 1} de 5 · {exp.id}
        </p>
        <h2 className="text-[22px] font-bold text-navy">{PASOS[paso]}</h2>
      </div>

      {segunda && (
        <Card className="flex flex-col gap-2 border-blue-700/30 bg-blue-50/50 px-5 py-4">
          <p className="flex items-center gap-2 text-[14px] font-semibold text-blue-900">
            <History className="size-4" /> Segunda valoración en curso
          </p>
          <p className="text-[13px] text-text-secondary">
            Los registros del primer envío se conservan. Puedes añadir certificados nuevos, reemplazar registros con certificados corregidos o marcarlos como «No tenido en cuenta». El resultado de la primera valoración queda en el histórico.
          </p>
          <LeyendaEnvios />
        </Card>
      )}

      {/* Panel de puntaje en tiempo real */}
      <PanelPuntaje exp={exp} />

      {paso === 0 && <PasoDatos exp={exp} set={set} errores={errores} />}
      {paso === 1 && <PasoFormacion exp={exp} set={set} bit={bit} onPendingChange={setFormPendiente} />}
      {paso === 2 && <PasoExperiencia exp={exp} set={set} bit={bit} onPendingChange={setFormPendiente} />}
      {paso === 3 && <PasoProductividad exp={exp} set={set} bit={bit} onPendingChange={setFormPendiente} />}
      {paso === 4 && <PasoResumen exp={exp} set={set} />}

      {/* Barra de acciones */}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-border-soft bg-surface/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        {/* Izquierda: Inicio + Anterior */}
        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            className="gap-1.5"
            onClick={() => formPendiente ? setDestinoPendiente("salir") : onSalir()}
            title="Regresar al inicio"
          >
            <Home className="size-4" />
            <span className="hidden sm:inline">Inicio</span>
          </Button>
          {paso > 0 && (
            <Button
              variant="tertiary"
              onClick={() => {
                const anterior = Math.max(0, paso - 1);
                if (formPendiente) {
                  setDestinoPendiente(anterior);
                  return;
                }
                setExp((prev) => ({
                  ...prev,
                  pasosCompletados: Array.from(new Set([...(prev.pasosCompletados ?? []), anterior])).sort(),
                }));
                setPaso(anterior);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <ChevronLeft className="size-4" /> Anterior
            </Button>
          )}
        </div>

        {/* Derecha: borrador + avanzar */}
        <div className="flex items-center gap-3">
          {estadoGuardado === "saving" && (
            <span className="text-[13px] font-medium text-text-secondary">Guardando…</span>
          )}
          {estadoGuardado === "saved" && (
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-success">
              <CheckCircle2 className="size-4" /> Guardado
            </span>
          )}
          <Button variant="outline" disabled={guardando} onClick={guardarBorrador}>Guardar borrador</Button>
          {paso < 4 ? (
            <Button onClick={siguiente}>Siguiente <ChevronRight className="size-4" /></Button>
          ) : (
            <Button disabled={guardando} onClick={intentarFinalizar}>Finalizar valoración</Button>
          )}
        </div>
        {estadoGuardado === "error" && errorGuardado && (
          <InlineAlert tone="error">
            {errorGuardado} Los datos escritos siguen en el formulario; puedes reintentar el guardado.
          </InlineAlert>
        )}
      </div>

      {/* Modal de confirmación */}
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Finalizar valoración"
        footer={
          faltantes.length === 0 ? (
            <>
              <Button variant="tertiary" onClick={() => setConfirm(false)}>Cancelar</Button>
              <Button disabled={guardando} onClick={finalizar}>Finalizar valoración</Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setConfirm(false)}>Entendido</Button>
          )
        }
      >
        {faltantes.length === 0 ? (
          <div className="flex flex-col gap-3 text-[14px] text-text-primary">
            <p>
              Se guardará el expediente <b>{exp.id}</b> con un puntaje total de <b>{r.total.toFixed(2)} puntos</b>.
            </p>
            <p className="text-[13px] text-text-secondary">
              El expediente quedará guardado y podrá editarse posteriormente desde «Valoraciones completadas». Se conservará la versión de reglas {exp.reglasVersion} utilizada en el cálculo.
            </p>
            {r.experiencia.hayExceso && (
              <InlineAlert tone="warning">
                Hay experiencias simultáneas que superan {HORAS_MAX_SEMANALES} h/semana. Se conservan todas; el reconocimiento se limitó en los periodos coincidentes.
              </InlineAlert>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <InlineAlert tone="warning">No es posible finalizar. Corrija lo siguiente antes de cerrar el expediente:</InlineAlert>
            <ul className="list-disc pl-5 text-[14px] text-text-primary">
              {faltantes.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}
      </Modal>
      <Modal
        open={destinoPendiente !== null}
        onClose={() => setDestinoPendiente(null)}
        title="Registro sin añadir"
        footer={
          <>
            <Button variant="tertiary" onClick={() => setDestinoPendiente(null)}>Volver al formulario</Button>
            <Button
              variant="secondary"
              onClick={() => {
                const destino = destinoPendiente;
                setFormPendiente(false);
                setDestinoPendiente(null);
                if (destino === "salir") onSalir();
                else if (typeof destino === "number") {
                  setPaso(destino);
                  setMaxPaso((m) => Math.max(m, destino));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              Continuar sin añadir
            </Button>
          </>
        }
      >
        <InlineAlert tone="warning">
          Hay información diligenciada que aún no se ha añadido al expediente. Selecciona «Añadir registro» para conservarla o continúa sin añadirla.
        </InlineAlert>
      </Modal>
      <Toast message={toast} onClose={cerrarToast} />
    </div>
  );
}
