import { useState } from "react";
import { FileText } from "lucide-react";
import { Button, Field, InlineAlert, Modal, SoporteBadge, Textarea } from "../../components/ui";
type SoporteEstado = "Pendiente de validación" | "Con observación" | "Revisado" | "Sin cargar";

export function RevisionModal({
  open,
  onClose,
  titulo,
  nombreArchivo,
  estado,
  observacion,
  onGuardar,
}: {
  open: boolean;
  onClose: () => void;
  titulo: string;
  nombreArchivo: string;
  estado: SoporteEstado;
  observacion?: string;
  onGuardar: (estado: SoporteEstado, observacion: string) => void;
}) {
  const [obs, setObs] = useState(observacion ?? "");
  const [error, setError] = useState("");

  const registrar = (nuevo: SoporteEstado) => {
    if ((nuevo === "Con observación") && !obs.trim()) {
      setError("Toda inconsistencia debe tener un comentario asociado.");
      return;
    }
    onGuardar(nuevo, obs.trim());
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Revisión documental"
      wide
      footer={
        <>
          <Button variant="tertiary" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="outline" onClick={() => registrar("Con observación")}>
            Registrar inconsistencia
          </Button>
          <Button variant="secondary" onClick={() => registrar("Revisado")}>
            Confirmar revisión
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-semibold text-text-secondary">Documento</p>
            <div className="flex aspect-[3/4] items-center justify-center rounded-[8px] border border-border-soft bg-bg">
              <div className="flex flex-col items-center gap-2 text-text-secondary">
                <FileText className="size-10" strokeWidth={1.5} />
                <span className="max-w-[80%] truncate px-2 text-[12px]">
                  {nombreArchivo || "Sin archivo"}
                </span>
                <span className="text-[11px]">Vista previa no disponible</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-[13px] font-semibold text-text-secondary">Elemento asociado</p>
              <p className="text-[15px] font-medium text-text-primary">{titulo}</p>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-text-secondary">Estado actual</p>
              <div className="mt-1">
                <SoporteBadge estado={estado} />
              </div>
            </div>
            <Field label="Observación / inconsistencia" error={error}>
              <Textarea
                value={obs}
                error={!!error}
                onChange={(e) => {
                  setObs(e.target.value);
                  setError("");
                }}
                placeholder="Registre observaciones o inconsistencias documentales o superficiales."
              />
            </Field>
          </div>
        </div>
        <InlineAlert tone="info">
          El sistema no determina la autenticidad legal del documento; solo permite registrar
          revisión, observaciones e inconsistencias documentales.
        </InlineAlert>
      </div>
    </Modal>
  );
}
