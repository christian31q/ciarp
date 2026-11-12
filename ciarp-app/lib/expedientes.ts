import type { Expediente } from "@/src/lib/store";
import type { ObjectId } from "mongodb";

export type StoredExpediente = Expediente & {
  _id?: ObjectId;
  propietarioId: string;
  version: number;
  actualizado: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateExpediente(value: unknown): value is Expediente {
  if (!isRecord(value)) return false;
  const docente = value.docente;
  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    value.id.length <= 100 &&
    isRecord(docente) &&
    typeof docente.nombre === "string" &&
    typeof docente.identificacion === "string" &&
    typeof docente.facultad === "string" &&
    typeof docente.dedicacion === "string" &&
    typeof docente.sede === "string" &&
    ["En proceso", "Completada"].includes(String(value.estado)) &&
    Array.isArray(value.formacion) &&
    Array.isArray(value.experiencia) &&
    Array.isArray(value.productividad) &&
    Array.isArray(value.bitacora) &&
    typeof value.comentario === "string" &&
    typeof value.reglasVersion === "string" &&
    typeof value.valorPunto === "number" &&
    typeof value.creado === "string" &&
    (value.pasosCompletados === undefined ||
      (Array.isArray(value.pasosCompletados) &&
        value.pasosCompletados.every((step) => Number.isInteger(step) && step >= 0 && step <= 4)))
  );
}

export function stripStoredFields(expediente: StoredExpediente): Expediente {
  const publicExpediente = { ...expediente } as Expediente & {
    _id?: ObjectId;
    propietarioId?: string;
    actualizado?: string;
  };
  delete publicExpediente._id;
  delete publicExpediente.propietarioId;
  delete publicExpediente.actualizado;
  return publicExpediente;
}
