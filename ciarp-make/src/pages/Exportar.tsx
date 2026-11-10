import { useMemo, useState } from "react";
import { FileText, GraduationCap, History, Landmark, RotateCcw } from "lucide-react";
import { Button, Card, EmptyState, Modal, SearchInput, StatusBadge } from "../components/ui";
import { enSegundaValoracion, fmtFecha, resumenPuntaje, useStore, type Expediente } from "../lib/store";
import { descargarDocumento } from "../lib/pdf";

// ---------------------------------------------------------------------------
// Página Exportar
// ---------------------------------------------------------------------------

const POR_PAGINA = 10;

export function Exportar({
  onDevolverEdicion,
  onSegundaValoracion,
}: {
  onDevolverEdicion?: (id: string) => void;
  onSegundaValoracion?: (id: string) => void;
}) {
  const { expedientes } = useStore();
  const [q, setQ] = useState("");
  const [pagina, setPagina] = useState(1);
  const [pendingDevolver, setPendingDevolver] = useState<Expediente | null>(null);
  const [pendingSegunda, setPendingSegunda] = useState<Expediente | null>(null);

  const completados = useMemo(
    () =>
      expedientes
        .filter((e) => e.estado === "Completada")
        .filter(
          (e) =>
            !q ||
            e.docente.nombre.toLowerCase().includes(q.toLowerCase()) ||
            e.id.toLowerCase().includes(q.toLowerCase())
        )
        .sort((a, b) => b.creado.localeCompare(a.creado)),
    [expedientes, q]
  );

  const totalPag = Math.max(1, Math.ceil(completados.length / POR_PAGINA));
  const pag = Math.min(pagina, totalPag);
  const visibles = completados.slice((pag - 1) * POR_PAGINA, pag * POR_PAGINA);

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy/10">
            <FileText className="size-5 text-navy" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold text-navy">Valoraciones para ingreso docente completadas</h2>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              Descarga el expediente para Talento Humano o la valoración para el profesor, edita el expediente o inicia una segunda valoración conservando el histórico.
            </p>
          </div>
        </div>
      </Card>

      <div className="w-full max-w-sm">
        <SearchInput
          placeholder="Buscar por nombre o número…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPagina(1); }}
        />
      </div>

      <Card className="overflow-hidden">
        {visibles.length === 0 ? (
          <EmptyState
            title={q ? "No se encontraron docentes con estos criterios." : "No hay docentes con proceso completado."}
            hint={q ? "Ajuste la búsqueda para ver más resultados." : "Los expedientes finalizados aparecerán aquí."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-[14px]">
              <thead>
                <tr className="border-b border-border-soft bg-bg/60 text-left text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
                  <th className="px-4 py-3">Docente</th>
                  <th className="px-4 py-3">Número</th>
                  <th className="px-4 py-3">Sede</th>
                  <th className="px-4 py-3">Dedicación</th>
                  <th className="px-4 py-3">Fecha creación</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Puntaje</th>
                  <th className="px-4 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((e) => {
                  const res = resumenPuntaje(e);
                  return (
                    <tr key={e.id} className="h-14 border-b border-border-soft last:border-0 hover:bg-bg/50">
                      <td className="px-4 py-3 font-medium text-text-primary">{e.docente.nombre || "—"}</td>
                      <td className="px-4 py-3 tabular-nums text-text-secondary">{e.id}</td>
                      <td className="px-4 py-3 text-text-secondary">{e.docente.sede || "—"}</td>
                      <td className="px-4 py-3 text-text-secondary">{e.docente.dedicacion || "—"}</td>
                      <td className="px-4 py-3 tabular-nums text-text-secondary">{fmtFecha(e.creado)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge estado={e.estado} />
                          {enSegundaValoracion(e) && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800">
                              <History className="size-3" /> Valoración {e.numeroValoracion}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span className="block font-semibold text-navy">{res.total.toFixed(2)} pts</span>
                        <span className="block text-[11px] text-text-secondary">{res.categoriaCalculada}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-end gap-1.5">
                          <Button variant="outline" className="w-full justify-start gap-1.5 px-3 py-1.5 text-[13px]" onClick={() => descargarDocumento(e, "th")}>
                            <Landmark className="size-[15px]" /> Descargar expediente para Talento Humano
                          </Button>
                          <Button variant="outline" className="w-full justify-start gap-1.5 px-3 py-1.5 text-[13px]" onClick={() => descargarDocumento(e, "profesor")}>
                            <GraduationCap className="size-[15px]" /> Descargar valoración para el profesor
                          </Button>
                          <div className="flex flex-wrap justify-end gap-1">
                            {onDevolverEdicion && (
                              <Button variant="tertiary" className="gap-1.5 px-2 py-1 text-[12px]" onClick={() => setPendingDevolver(e)}>
                                <RotateCcw className="size-[14px]" /> Editar expediente
                              </Button>
                            )}
                            {onSegundaValoracion && (
                              <Button variant="tertiary" className="gap-1.5 px-2 py-1 text-[12px]" onClick={() => setPendingSegunda(e)}>
                                <History className="size-[14px]" /> Segunda valoración
                              </Button>
                            )}
                          </div>
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

      <Modal
        open={!!pendingDevolver}
        onClose={() => setPendingDevolver(null)}
        title="Editar expediente"
      >
        <p className="text-[14px] text-text-primary">
          El expediente de <strong>{pendingDevolver?.docente.nombre}</strong> volverá al estado <em>En proceso</em> para corregir la valoración actual. Para evaluar certificados nuevos o corregidos conservando el resultado anterior, usa «Segunda valoración».
        </p>
        <p className="mt-2 text-[13px] text-text-secondary">
          El expediente dejará de aparecer en esta sección hasta que se finalice nuevamente.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="tertiary" onClick={() => setPendingDevolver(null)}>Cancelar</Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (pendingDevolver) onDevolverEdicion?.(pendingDevolver.id);
              setPendingDevolver(null);
            }}
          >
            <RotateCcw className="size-4" /> Confirmar devolución
          </Button>
        </div>
      </Modal>

      <Modal open={!!pendingSegunda} onClose={() => setPendingSegunda(null)} title="Iniciar segunda valoración">
        <div className="flex flex-col gap-2 text-[14px] text-text-primary">
          <p>
            Se guardará en el histórico el resultado actual de <strong>{pendingSegunda?.docente.nombre}</strong> ({pendingSegunda ? resumenPuntaje(pendingSegunda).total.toFixed(2) : ""} pts) y se abrirá la valoración {(pendingSegunda?.numeroValoracion ?? 1) + 1}.
          </p>
          <p className="text-[13px] text-text-secondary">
            Los registros del primer envío no se sobrescriben: podrás añadir certificados nuevos, reemplazarlos por certificados corregidos o marcarlos como «No tenido en cuenta».
          </p>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="tertiary" onClick={() => setPendingSegunda(null)}>Cancelar</Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (pendingSegunda) onSegundaValoracion?.(pendingSegunda.id);
              setPendingSegunda(null);
            }}
          >
            <History className="size-4" /> Iniciar segunda valoración
          </Button>
        </div>
      </Modal>

      {completados.length > POR_PAGINA && (
        <div className="flex items-center justify-between text-[13px] text-text-secondary">
          <span>
            {completados.length} resultado(s) · Página {pag} de {totalPag}
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
    </div>
  );
}
