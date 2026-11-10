import { useMemo, useState } from "react";
import {
  Button,
  Card,
  Drawer,
  EmptyState,
  Select,
  SearchInput,
  StatusBadge,
} from "../components/ui";
import { resumenPuntaje, useStore, type Expediente } from "../lib/store";

const POR_PAGINA = 10;

export function Valoraciones({
  onContinuar,
  onExportar,
  verId,
  onClearVer,
}: {
  onContinuar: (id: string) => void;
  onExportar: () => void;
  verId?: string | null;
  onClearVer: () => void;
}) {
  const { expedientes } = useStore();
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<"Todos" | "En proceso" | "Completada">("Todos");
  const [facultad, setFacultad] = useState("Todas");
  const [orden, setOrden] = useState<"fecha" | "nombre" | "puntaje">("fecha");
  const [pagina, setPagina] = useState(1);
  const [ver, setVer] = useState<Expediente | null>(
    verId ? expedientes.find((e) => e.id === verId) ?? null : null
  );

  const facultades = useMemo(
    () => ["Todas", ...new Set(expedientes.map((e) => e.docente.facultad))],
    [expedientes]
  );

  const filtrados = useMemo(() => {
    let arr = expedientes.filter((e) => {
      const okQ =
        !q ||
        e.docente.nombre.toLowerCase().includes(q.toLowerCase()) ||
        e.id.toLowerCase().includes(q.toLowerCase());
      const okF = filtro === "Todos" || e.estado === filtro;
      const okFac = facultad === "Todas" || e.docente.facultad === facultad;
      return okQ && okF && okFac;
    });
    arr = [...arr].sort((a, b) => {
      if (orden === "nombre") return a.docente.nombre.localeCompare(b.docente.nombre);
      if (orden === "puntaje") return resumenPuntaje(b).total - resumenPuntaje(a).total;
      return b.creado.localeCompare(a.creado);
    });
    return arr;
  }, [expedientes, q, filtro, facultad, orden]);

  const totalPag = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const pag = Math.min(pagina, totalPag);
  const visibles = filtrados.slice((pag - 1) * POR_PAGINA, pag * POR_PAGINA);

  return (
    <div className="flex flex-col gap-5">
      {/* Filtros */}
      <Card className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="lg:w-72">
          <SearchInput
            placeholder="Buscar por nombre o número…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPagina(1);
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["Todos", "En proceso", "Completada"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFiltro(f);
                setPagina(1);
              }}
              className={`min-h-[40px] rounded-full px-4 text-[13px] font-semibold transition-colors ${
                filtro === f
                  ? "bg-navy text-white"
                  : "border border-border-soft text-text-secondary hover:bg-disabled"
              }`}
            >
              {f === "Completada" ? "Completadas" : f}
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-wrap justify-end gap-2">
          <Select value={facultad} onChange={(e) => setFacultad(e.target.value)} className="max-w-56">
            {facultades.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </Select>
          <Select value={orden} onChange={(e) => setOrden(e.target.value as typeof orden)} className="max-w-44">
            <option value="fecha">Ordenar: Fecha</option>
            <option value="nombre">Ordenar: Nombre</option>
            <option value="puntaje">Ordenar: Puntaje</option>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {visibles.length === 0 ? (
          <EmptyState
            title="No se encontraron valoraciones con estos filtros."
            hint="Ajuste la búsqueda o los filtros para ver más resultados."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-[14px]">
              <thead>
                <tr className="border-b border-border-soft bg-bg/60 text-left text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Número</th>
                  <th className="px-4 py-3 text-right">Puntaje</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((e) => {
                  const total = resumenPuntaje(e).total;
                  return (
                    <tr key={e.id} className="h-14 border-b border-border-soft last:border-0 hover:bg-bg/50">
                      <td className="px-4 py-3 font-medium text-text-primary">{e.docente.nombre}</td>
                      <td className="px-4 py-3 tabular-nums text-text-secondary">{e.id}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-navy">
                        {e.estado === "Completada" ? total.toFixed(2) : "—"}
                      </td>
                      <td className="px-4 py-3 tabular-nums text-text-secondary">
                        {e.creado}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge estado={e.estado} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setVer(e)}
                            className="text-[13px] font-semibold text-navy hover:underline"
                          >
                            Ver
                          </button>
                          {e.estado === "En proceso" ? (
                            <button
                              onClick={() => onContinuar(e.id)}
                              className="text-[13px] font-semibold text-navy hover:underline"
                            >
                              Editar / Continuar
                            </button>
                          ) : (
                            <button
                              onClick={onExportar}
                              className="text-[13px] font-semibold text-navy hover:underline"
                            >
                              Exportar
                            </button>
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

      {filtrados.length > 0 && (
        <div className="flex items-center justify-between text-[13px] text-text-secondary">
          <span>
            {filtrados.length} resultado(s) · Página {pag} de {totalPag}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={pag <= 1} onClick={() => setPagina(pag - 1)}>
              Anterior
            </Button>
            <Button variant="outline" disabled={pag >= totalPag} onClick={() => setPagina(pag + 1)}>
              Siguiente
            </Button>
          </div>
        </div>
      )}

      <Drawer
        open={!!ver}
        onClose={() => {
          setVer(null);
          onClearVer();
        }}
        title="Detalle de valoración"
      >
        {ver && (
          <div className="flex flex-col gap-4">
            <StatusBadge estado={ver.estado} />
            <dl className="flex flex-col gap-3 text-[14px]">
              {[
                ["Nombre", ver.docente.nombre],
                ["Número", ver.id],
                ["Puntaje", ver.estado === "Completada" ? `${resumenPuntaje(ver).total.toFixed(2)} pts` : "En cálculo"],
                ["Fecha", ver.creado],
                ["Facultad", ver.docente.facultad],
                ["Categoría", ver.categoria || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border-soft pb-2">
                  <dt className="text-text-secondary">{k}</dt>
                  <dd className="font-medium text-text-primary">{v}</dd>
                </div>
              ))}
            </dl>
            {ver.comentario && (
              <div>
                <p className="text-[13px] font-semibold text-text-secondary">Comentario general</p>
                <p className="text-[14px] text-text-primary">{ver.comentario}</p>
              </div>
            )}
            {ver.estado === "En proceso" && (
              <Button
                onClick={() => {
                  setVer(null);
                  onContinuar(ver.id);
                }}
              >
                Editar / Continuar
              </Button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
