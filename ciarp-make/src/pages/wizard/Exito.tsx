import { CheckCircle2, GraduationCap, Landmark } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { descargarDocumento } from "../../lib/pdf";
import { resumenPuntaje, type Expediente } from "../../lib/store";

export function Exito({
  exp,
  onInicio,
  onExportar,
}: {
  exp: Expediente;
  onInicio: () => void;
  onExportar: () => void;
}) {
  const r = resumenPuntaje(exp);
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="flex w-full max-w-lg flex-col items-center gap-4 px-6 py-10 text-center sm:px-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-success-bg">
          <CheckCircle2 className="size-9 text-success" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-[22px] font-bold text-navy">Valoración para ingreso docente completada</h2>
          <p className="mt-1 text-[14px] text-text-secondary">
            Expediente guardado correctamente. Podrá editarse posteriormente desde «Valoraciones completadas».
          </p>
        </div>
        <div className="w-full rounded-[10px] bg-navy px-5 py-4 text-left text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-yellow">Categoría docente calculada</p>
          <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
            <p className="text-[20px] font-bold leading-tight">{r.categoriaCalculada}</p>
            <p className="text-[20px] font-bold tabular-nums">{r.total.toFixed(2)} pts</p>
          </div>
          <p className="text-[12px] text-white/70">Expediente {exp.id}{exp.numeroValoracion && exp.numeroValoracion > 1 ? ` · Valoración ${exp.numeroValoracion}` : ""}</p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <Button variant="outline" className="w-full gap-2" onClick={() => descargarDocumento(exp, "th")}>
            <Landmark className="size-4" /> Descargar expediente para Talento Humano
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={() => descargarDocumento(exp, "profesor")}>
            <GraduationCap className="size-4" /> Descargar valoración para el profesor
          </Button>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button variant="tertiary" className="flex-1" onClick={onInicio}>
            Volver al inicio
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onExportar}>
            Ver valoraciones
          </Button>
        </div>
      </Card>
    </div>
  );
}
