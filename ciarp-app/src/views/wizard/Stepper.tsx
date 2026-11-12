import { Check } from "lucide-react";

export const PASOS = [
  "Datos básicos",
  "Formación académica",
  "Experiencia calificada",
  "Productividad académica",
  "Resumen",
];

export function Stepper({
  paso,
  maxPaso,
  onGoto,
}: {
  paso: number;
  maxPaso: number;
  onGoto: (i: number) => void;
}) {
  return (
    <div className="flex items-start">
      {PASOS.map((nombre, i) => {
        const done = i < paso;
        const current = i === paso;
        const reachable = i <= maxPaso;
        return (
          <div key={i} className="flex flex-1 items-start last:flex-none">
            {/* Círculo + etiqueta */}
            <div className="flex flex-col items-center gap-1.5">
              <button
                disabled={!reachable}
                onClick={() => reachable && onGoto(i)}
                aria-current={current ? "step" : undefined}
                aria-label={`Paso ${i + 1}: ${PASOS[i]}`}
                className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-[14px] font-semibold transition-colors ${
                  current
                    ? "border-navy bg-navy text-white ring-4 ring-yellow/40"
                    : done
                      ? "border-navy bg-navy text-white"
                      : "border-border-soft bg-surface text-text-secondary"
                } ${reachable ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                {done ? <Check className="size-[18px]" strokeWidth={2.5} /> : i + 1}
              </button>
              <span
                className={`hidden text-center text-[11px] font-medium leading-tight sm:block ${
                  current ? "text-navy" : done ? "text-navy/70" : "text-text-secondary"
                }`}
                style={{ maxWidth: "72px" }}
              >
                {nombre}
              </span>
            </div>
            {/* Línea conectora */}
            {i < PASOS.length - 1 && (
              <div className="mx-2 mt-[18px] h-0.5 flex-1 rounded-full bg-border-soft">
                <div
                  className="h-full rounded-full bg-yellow transition-all"
                  style={{ width: i < paso ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
