// Convención documental de la segunda valoración:
// NEGRO = primer envío · AZUL = segundo envío · ROJO = no tenido en cuenta.
// El estado siempre se comunica con texto e icono, nunca solo con color.
import {
  Ban,
  CircleDot,
  FilePlus2,
  Pencil,
  RefreshCw,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { etiquetaRevision, origenDe, type TrazaRevision } from "../lib/store"

const TONO = {
  primer: { cls: "border-black/30 bg-white text-black", icon: CircleDot },
  segundo: {
    cls: "border-blue-700/30 bg-blue-50 text-blue-800",
    icon: FilePlus2,
  },
  excluido: { cls: "border-red-700/30 bg-red-50 text-red-800", icon: Ban },
  reemplazado: {
    cls: "border-gray-400/40 bg-gray-50 text-gray-600",
    icon: RefreshCw,
  },
} as const

export function EnvioBadge({ r }: { r: TrazaRevision }) {
  const e = etiquetaRevision(r)
  const t = TONO[e.tono]
  const Icon = t.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${t.cls}`}
    >
      <Icon className="size-3" aria-hidden /> {e.label}
    </span>
  )
}

// Clase de texto para la fila según el estado (complementa el badge).
export function tonoTexto(r: TrazaRevision): string {
  const e = etiquetaRevision(r).tono
  return e === "segundo"
    ? "text-blue-800"
    : e === "excluido"
      ? "text-red-800 line-through decoration-red-800/50"
      : e === "reemplazado"
        ? "text-gray-500 line-through"
        : ""
}

export function LeyendaEnvios() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[12px] text-text-secondary">
      <span className="font-semibold text-navy">Convención:</span>
      <EnvioBadge r={{ origenEnvio: "primer_envio" }} />
      <EnvioBadge r={{ origenEnvio: "segundo_envio" }} />
      <EnvioBadge r={{ estadoRevision: "no_tenido_en_cuenta" }} />
      <EnvioBadge r={{ estadoRevision: "reemplazado" }} />
    </div>
  )
}

// Acciones por registro. En segunda valoración, los registros del primer envío
// no se editan ni eliminan: se marcan como no tenidos en cuenta o se reemplazan
// por un registro corregido (conservando el original como histórico).
export function AccionesRegistro({
  r,
  segunda,
  onEdit,
  onDelete,
  onExcluir,
  onIncluir,
  onReemplazar,
}: {
  r: TrazaRevision
  segunda: boolean
  onEdit: () => void
  onDelete: () => void
  onExcluir: () => void
  onIncluir: () => void
  onReemplazar: () => void
}) {
  const btn =
    "inline-flex items-center gap-1 text-[12px] font-semibold hover:underline"
  const est = r.estadoRevision ?? "vigente"
  if (segunda && origenDe(r) === "primer_envio") {
    if (est === "reemplazado")
      return (
        <span className="text-[12px] text-text-secondary">
          Conservado como histórico
        </span>
      )
    return (
      <div className="flex flex-wrap gap-3">
        {est === "no_tenido_en_cuenta" ? (
          <button
            type="button"
            onClick={onIncluir}
            className={`${btn} text-navy`}
          >
            <RotateCcw className="size-3" /> Volver a tener en cuenta
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onReemplazar}
              className={`${btn} text-blue-800`}
            >
              <RefreshCw className="size-3" /> Reemplazar con certificado
              corregido
            </button>
            <button
              type="button"
              onClick={onExcluir}
              className={`${btn} text-red-800`}
            >
              <Ban className="size-3" /> No tener en cuenta
            </button>
          </>
        )}
      </div>
    )
  }
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={onEdit} className={`${btn} text-navy`}>
        <Pencil className="size-3" /> Editar
      </button>
      <button type="button" onClick={onDelete} className={`${btn} text-error`}>
        <Trash2 className="size-3" /> Eliminar
      </button>
    </div>
  )
}
