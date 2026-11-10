import { useMemo, useState } from "react";
import { GraduationCap, Landmark, Plus, Search, ShieldCheck, X, Pencil } from "lucide-react";
import { descargarDocumento } from "../lib/pdf";
import { Button, Card, Drawer, EmptyState, Field, Input, Select, StatusBadge } from "../components/ui";
import {
  fmtFecha,
  nowStr,
  resumenPuntaje,
  useStore,
  type BitacoraEntry,
  type Expediente,
  type Sede,
} from "../lib/store";

const POR_PAGINA = 10;
const SEDES = ["Todas", "Sede Calle 100", "Sede Cajicá"] as const;
const ESTADOS = ["Todos", "En proceso", "Completada"] as const;
const FACULTADES_LISTA = [
  "Facultad de Ingeniería",
  "Facultad de Medicina",
  "Facultad de Ciencias Económicas",
  "Facultad de Derecho",
  "Facultad de Educación",
  "Facultad de Estudios a Distancia",
];

// --------------------------- Bitácora visual ---------------------------

function RolBadge({ rol }: { rol: BitacoraEntry["rol"] }) {
  return rol === "Administrador" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow/20 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">
      <ShieldCheck className="size-3" /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-navy/10 px-2 py-0.5 text-[10px] font-semibold text-navy">
      <Pencil className="size-3" /> Digitador
    </span>
  );
}

function BitacoraList({ entries }: { entries: BitacoraEntry[] }) {
  if (entries.length === 0)
    return <p className="text-[13px] text-text-secondary">Sin movimientos registrados.</p>;
  return (
    <ul className="flex flex-col gap-3">
      {[...entries].reverse().map((b, i) => (
        <li key={i} className="rounded-[8px] border border-border-soft bg-bg/60 px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <RolBadge rol={b.rol} />
            <span className="text-[13px] font-semibold text-text-primary">{b.usuario}</span>
            <span className="tabular-nums text-[12px] text-text-secondary">{b.fecha}</span>
          </div>
          <p className="mt-1 text-[13px] font-medium text-navy">{b.accion} · {b.elemento}</p>
          {b.detalle && (
            <p className="mt-0.5 text-[12px] text-text-secondary">{b.detalle}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

// --------------------------- Admin: editar datos docente ---------------------------

function AdminEditDocente({
  exp,
  onGuardar,
  onCancelar,
}: {
  exp: Expediente;
  onGuardar: (updated: Expediente) => void;
  onCancelar: () => void;
}) {
  const { usuario } = useStore();
  const [d, setD] = useState({ ...exp.docente });
  const [err, setErr] = useState<Record<string, string>>({});

  const guardar = () => {
    const e: Record<string, string> = {};
    if (!d.nombre.trim()) e.nombre = "Requerido.";
    if (!d.identificacion.trim()) e.identificacion = "Requerido.";
    setErr(e);
    if (Object.keys(e).length > 0) return;

    // Build detalle of what changed
    const cambios: string[] = [];
    if (d.nombre !== exp.docente.nombre) cambios.push(`Nombre: "${exp.docente.nombre}" → "${d.nombre}"`);
    if (d.identificacion !== exp.docente.identificacion) cambios.push(`Identificación: "${exp.docente.identificacion}" → "${d.identificacion}"`);
    if (d.facultad !== exp.docente.facultad) cambios.push(`Facultad: "${exp.docente.facultad}" → "${d.facultad}"`);
    if (d.sede !== exp.docente.sede) cambios.push(`Sede: "${exp.docente.sede}" → "${d.sede}"`);
    if (d.dedicacion !== exp.docente.dedicacion) cambios.push(`Dedicación: "${exp.docente.dedicacion}" → "${d.dedicacion}"`);

    const entry: BitacoraEntry = {
      usuario: usuario.nombre,
      rol: usuario.rol,
      fecha: nowStr(),
      accion: "Edición de datos del docente",
      elemento: "Datos básicos",
      detalle: cambios.length > 0 ? cambios.join(" | ") : "Sin cambios de valor detectados",
    };

    onGuardar({ ...exp, docente: d as Expediente["docente"], bitacora: [...exp.bitacora, entry] });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[8px] border border-yellow/40 bg-yellow/10 px-3 py-2.5 text-[13px] font-medium text-yellow-800">
        Modo Administrador — Los cambios quedarán registrados en la auditoría del expediente.
      </div>
      <div className="grid grid-cols-1 gap-3">
        <Field label="Nombre docente" required error={err.nombre}>
          <Input value={d.nombre} error={!!err.nombre} onChange={(e) => setD({ ...d, nombre: e.target.value })} />
        </Field>
        <Field label="Identificación" required error={err.identificacion}>
          <Input value={d.identificacion} error={!!err.identificacion} onChange={(e) => setD({ ...d, identificacion: e.target.value })} />
        </Field>
        <Field label="Facultad">
          <Select value={d.facultad} onChange={(e) => setD({ ...d, facultad: e.target.value })}>
            <option value="">Seleccione…</option>
            {FACULTADES_LISTA.map((f) => <option key={f}>{f}</option>)}
          </Select>
        </Field>
        <Field label="Sede">
          <Select value={d.sede} onChange={(e) => setD({ ...d, sede: e.target.value as Sede | "" })}>
            <option value="">Seleccione…</option>
            <option>Sede Calle 100</option>
            <option>Sede Cajicá</option>
          </Select>
        </Field>
        <Field label="Dedicación">
          <Select value={d.dedicacion} onChange={(e) => setD({ ...d, dedicacion: e.target.value as "Tiempo completo" | "Medio tiempo" | "" })}>
            <option value="">Seleccione…</option>
            <option>Tiempo completo</option>
            <option>Medio tiempo</option>
          </Select>
        </Field>
      </div>
      <div className="flex gap-2">
        <Button variant="tertiary" onClick={onCancelar} className="flex-1">Cancelar</Button>
        <Button variant="secondary" onClick={guardar} className="flex-1">Guardar cambios</Button>
      </div>
    </div>
  );
}

// --------------------------- Drawer de detalle ---------------------------

function DetalleDrawer({
  exp,
  onClose,
  onContinuar,
}: {
  exp: Expediente;
  onClose: () => void;
  onContinuar: (id: string) => void;
}) {
  const { usuario, upsert } = useStore();
  const esAdmin = usuario.rol === "Administrador";
  const r = resumenPuntaje(exp);
  const [tab, setTab] = useState<"info" | "auditoria" | "editar">("info");

  const handleGuardarAdmin = (updated: Expediente) => {
    upsert(updated);
    setTab("auditoria");
  };

  return (
    <Drawer open title={`Expediente ${exp.id}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Tabs */}
        <div className="flex gap-1 rounded-[8px] border border-border-soft bg-bg/60 p-1">
          {([
            { key: "info", label: "Información" },
            { key: "auditoria", label: "Auditoría" },
            ...(esAdmin ? [{ key: "editar", label: "Editar datos" }] : []),
          ] as { key: typeof tab; label: string }[]).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 rounded-[6px] py-1.5 text-[13px] font-semibold transition-colors ${
                tab === t.key ? "bg-surface text-navy shadow-sm" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Info */}
        {tab === "info" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <StatusBadge estado={exp.estado} />
            </div>
            <section>
              <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-secondary">Docente</h4>
              <dl className="flex flex-col gap-2 text-[14px]">
                {[
                  ["Nombre", exp.docente.nombre],
                  ["Identificación", exp.docente.identificacion],
                  ["Facultad", exp.docente.facultad],
                  ["Sede", exp.docente.sede || "—"],
                  ["Tipo de vinculación", "Docente de planta"],
                  ["Dedicación", exp.docente.dedicacion || "—"],
                  ["Categoría calculada", r.categoriaCalculada],
                  ["Fecha de creación", fmtFecha(exp.creado)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border-soft pb-2">
                    <dt className="text-text-secondary">{k}</dt>
                    <dd className="font-medium text-text-primary text-right max-w-[60%]">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section>
              <h4 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-secondary">Puntaje acumulado</h4>
              <div className="rounded-[8px] border border-border-soft bg-bg/60 px-4 py-3 text-[14px]">
                <div className="flex flex-col gap-1.5">
                  {[
                    ["Formación académica", r.formacion],
                    ["Categoría docente", r.categoria],
                    ["Experiencia calificada", r.experiencia.valor],
                    ["Productividad académica", r.productividad.valor],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex justify-between">
                      <span className="text-text-secondary">{k as string}</span>
                      <span className="tabular-nums font-medium">{(v as number).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="mt-1 flex justify-between border-t border-border-soft pt-2">
                    <span className="font-bold text-navy">Total</span>
                    <span className="tabular-nums text-[16px] font-bold text-navy">{r.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </section>
            {exp.comentario && (
              <section>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">Observación interna</p>
                <p className="mt-1 text-[14px] text-text-primary">{exp.comentario}</p>
              </section>
            )}
            <div className="flex flex-col gap-2 border-t border-border-soft pt-4">
              <Button variant="outline" onClick={() => descargarDocumento(exp, "th")}>
                <Landmark className="size-[16px]" /> Expediente para Talento Humano
              </Button>
              <Button variant="outline" onClick={() => descargarDocumento(exp, "profesor")}>
                <GraduationCap className="size-[16px]" /> Valoración para el profesor
              </Button>
              <p className="text-[11px] text-text-secondary">
                Genera un PDF con el resumen del expediente. En el diálogo de impresión seleccione “Guardar como PDF”.
              </p>
              {exp.estado === "En proceso" && (
                <Button onClick={() => { onClose(); onContinuar(exp.id); }}>
                  Editar / Continuar
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Auditoría */}
        {tab === "auditoria" && (
          <div className="flex flex-col gap-3">
            <p className="text-[13px] text-text-secondary">
              Historial completo de modificaciones sobre este expediente, ordenado del más reciente al más antiguo.
            </p>
            <BitacoraList entries={exp.bitacora} />
          </div>
        )}

        {/* Editar (solo admin) */}
        {tab === "editar" && esAdmin && (
          <AdminEditDocente
            exp={exp}
            onGuardar={handleGuardarAdmin}
            onCancelar={() => setTab("info")}
          />
        )}
      </div>
    </Drawer>
  );
}

// --------------------------- Inicio ---------------------------

export function Inicio({
  onNueva,
  onContinuar,
}: {
  onNueva: () => void;
  onContinuar: (id: string) => void;
}) {
  const { expedientes, usuario } = useStore();
  const esDigitador = usuario.rol === "Digitador";

  const [q, setQ] = useState("");
  const [filtroEstado] = useState<"En proceso">("En proceso");
  const [filtroSede, setFiltroSede] = useState<(typeof SEDES)[number]>("Todas");
  const [filtroFacultad, setFiltroFacultad] = useState("Todas");
  const [filtroDedicacion, setFiltroDedicacion] = useState("Todas");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
  const [orden, setOrden] = useState<"fecha" | "nombre" | "puntaje">("fecha");
  const [pagina, setPagina] = useState(1);
  const [ver, setVer] = useState<Expediente | null>(null);

  // Sync drawer with live store (admin edits update expedientes)
  const verActual = ver ? expedientes.find((e) => e.id === ver.id) ?? ver : null;

  const facultades = useMemo(
    () => ["Todas", ...new Set(expedientes.map((e) => e.docente.facultad).filter(Boolean))],
    [expedientes]
  );

  const enProceso = expedientes.filter((e) => e.estado === "En proceso").length;
  const completadas = expedientes.filter((e) => e.estado === "Completada").length;

  const filtrados = useMemo(() => {
    let arr = expedientes.filter((e) => {
      const okQ =
        !q ||
        e.docente.nombre.toLowerCase().includes(q.toLowerCase()) ||
        e.id.toLowerCase().includes(q.toLowerCase());
      const okEstado = e.estado === filtroEstado;
      const okSede = filtroSede === "Todas" || e.docente.sede === filtroSede;
      const okFac = filtroFacultad === "Todas" || e.docente.facultad === filtroFacultad;
      const okDed = filtroDedicacion === "Todas" || e.docente.dedicacion === filtroDedicacion;
      const okDesde = !filtroFechaDesde || e.creado >= filtroFechaDesde;
      const okHasta = !filtroFechaHasta || e.creado <= filtroFechaHasta;
      return okQ && okEstado && okSede && okFac && okDed && okDesde && okHasta;
    });
    arr = [...arr].sort((a, b) => {
      if (orden === "nombre") return a.docente.nombre.localeCompare(b.docente.nombre);
      if (orden === "puntaje") return resumenPuntaje(b).total - resumenPuntaje(a).total;
      return b.creado.localeCompare(a.creado);
    });
    return arr;
  }, [expedientes, q, filtroEstado, filtroSede, filtroFacultad, filtroDedicacion, filtroFechaDesde, filtroFechaHasta, orden]);

  const totalPag = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const pag = Math.min(pagina, totalPag);
  const visibles = filtrados.slice((pag - 1) * POR_PAGINA, pag * POR_PAGINA);

  const hayFiltros = q || filtroSede !== "Todas" ||
    filtroFacultad !== "Todas" || filtroDedicacion !== "Todas" || filtroFechaDesde || filtroFechaHasta;

  const limpiarFiltros = () => {
    setQ(""); setFiltroSede("Todas");
    setFiltroFacultad("Todas"); setFiltroDedicacion("Todas");
    setFiltroFechaDesde(""); setFiltroFechaHasta(""); setPagina(1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* CTA + resumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col items-start justify-between gap-4 p-5">
          {esDigitador ? (
            <>
              <div>
                <h2 className="text-[16px] font-semibold text-navy">Nueva valoración para ingreso docente</h2>
                <p className="mt-1 text-[13px] text-text-secondary">Registra la hoja de vida del docente de planta que ingresa a la Universidad.</p>
              </div>
              <Button onClick={onNueva} className="w-full">
                <Plus className="size-[18px]" strokeWidth={2.2} /> Crear expediente
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-yellow-600" />
                <h2 className="text-[16px] font-semibold text-navy">Modo Administrador</h2>
              </div>
              <p className="text-[13px] text-text-secondary">
                Puede editar datos de docentes y auditar el historial de cambios de cualquier expediente.
              </p>
            </>
          )}
        </Card>
        <Card className="p-5">
          <p className="text-[13px] font-medium text-text-secondary">En proceso</p>
          <p className="mt-1 text-[32px] font-bold leading-9 text-navy">{enProceso}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[13px] font-medium text-text-secondary">Completadas</p>
          <p className="mt-1 text-[32px] font-bold leading-9 text-navy">{completadas}</p>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPagina(1); }}
              placeholder="Buscar por nombre o número…"
              className="h-[40px] w-full rounded-[8px] border border-border-soft bg-surface pl-9 pr-3 text-[14px] text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>
          {hayFiltros && (
            <button
              onClick={limpiarFiltros}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-soft px-3 py-1.5 text-[12px] font-semibold text-text-secondary hover:bg-disabled"
            >
              <X className="size-3.5" /> Limpiar
            </button>
          )}
          <div className="ml-auto">
            <Select value={orden} onChange={(e) => setOrden(e.target.value as typeof orden)} className="text-[13px]">
              <option value="fecha">Ordenar: Fecha</option>
              <option value="nombre">Ordenar: Nombre</option>
              <option value="puntaje">Ordenar: Puntaje</option>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={filtroSede} onChange={(e) => { setFiltroSede(e.target.value as typeof filtroSede); setPagina(1); }} className="text-[13px]">
            {SEDES.map((s) => <option key={s}>{s}</option>)}
          </Select>
          <Select value={filtroFacultad} onChange={(e) => { setFiltroFacultad(e.target.value); setPagina(1); }} className="text-[13px]">
            {facultades.map((f) => <option key={f}>{f}</option>)}
          </Select>
          <Select value={filtroDedicacion} onChange={(e) => { setFiltroDedicacion(e.target.value); setPagina(1); }} className="text-[13px]">
            <option value="Todas">Todas las dedicaciones</option>
            <option>Tiempo completo</option>
            <option>Medio tiempo</option>
          </Select>
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] text-text-secondary whitespace-nowrap">Desde</label>
            <input type="date" value={filtroFechaDesde} onChange={(e) => { setFiltroFechaDesde(e.target.value); setPagina(1); }}
              className="h-[36px] rounded-[8px] border border-border-soft bg-surface px-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-navy/30" />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-[12px] text-text-secondary whitespace-nowrap">Hasta</label>
            <input type="date" value={filtroFechaHasta} onChange={(e) => { setFiltroFechaHasta(e.target.value); setPagina(1); }}
              className="h-[36px] rounded-[8px] border border-border-soft bg-surface px-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-navy/30" />
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="overflow-hidden">
        {visibles.length === 0 ? (
          <EmptyState title="No se encontraron expedientes con estos filtros." hint="Ajuste la búsqueda o los filtros para ver más resultados." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-[14px]">
              <thead>
                <tr className="border-b border-border-soft bg-bg/60 text-left text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
                  <th className="px-4 py-3">Docente</th>
                  <th className="px-4 py-3">Número</th>
                  <th className="px-4 py-3">Sede</th>
                  <th className="px-4 py-3">Dedicación</th>
                  <th className="px-4 py-3 text-right">Puntaje</th>
                  <th className="px-4 py-3">Creación</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((e) => {
                  const total = resumenPuntaje(e).total;
                  return (
                    <tr key={e.id} className="h-14 border-b border-border-soft last:border-0 hover:bg-bg/50">
                      <td className="px-4 py-3 font-medium text-text-primary">{e.docente.nombre || "—"}</td>
                      <td className="px-4 py-3 tabular-nums text-text-secondary">{e.id}</td>
                      <td className="px-4 py-3 text-text-secondary">{e.docente.sede || "—"}</td>
                      <td className="px-4 py-3 text-text-secondary">{e.docente.dedicacion || "—"}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-navy">
                        {e.estado === "Completada" ? total.toFixed(2) : "—"}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-text-secondary">{fmtFecha(e.creado)}</td>
                      <td className="px-4 py-3"><StatusBadge estado={e.estado} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setVer(e)} className="text-[13px] font-semibold text-navy hover:underline">Ver</button>
                          {e.estado === "En proceso" && esDigitador && (
                            <button onClick={() => onContinuar(e.id)} className="text-[13px] font-semibold text-navy hover:underline">Continuar</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {filtrados.length > POR_PAGINA && (
        <div className="flex items-center justify-between text-[13px] text-text-secondary">
          <span>{filtrados.length} resultado(s) · Página {pag} de {totalPag}</span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={pag <= 1} onClick={() => setPagina(pag - 1)}>Anterior</Button>
            <Button variant="outline" disabled={pag >= totalPag} onClick={() => setPagina(pag + 1)}>Siguiente</Button>
          </div>
        </div>
      )}

      {verActual && (
        <DetalleDrawer
          exp={verActual}
          onClose={() => setVer(null)}
          onContinuar={onContinuar}
        />
      )}
    </div>
  );
}
