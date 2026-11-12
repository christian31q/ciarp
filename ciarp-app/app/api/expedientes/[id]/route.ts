import { getMongoDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/server-auth";
import { stripStoredFields, validateExpediente, type StoredExpediente } from "@/lib/expedientes";

type Params = { params: Promise<{ id: string }> };

async function owned(request: Request, id: string) {
  const user = await getCurrentUser(request);
  if (!user) return { response: Response.json({ error: "No autenticado" }, { status: 401 }) };
  const doc = await (await getMongoDb()).collection<StoredExpediente>("expedientes")
    .findOne({ propietarioId: user.id, id });
  if (!doc) return { response: Response.json({ error: "Expediente no encontrado." }, { status: 404 }) };
  return { user, doc };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const result = await owned(request, id);
    if ("response" in result) return result.response;
    return Response.json(stripStoredFields(result.doc));
  } catch (error) {
    console.error("[expedientes] Read failed", { error: error instanceof Error ? error.name : "UnknownError" });
    return Response.json({ error: "No fue posible consultar el expediente." }, { status: 503 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const result = await owned(request, id);
    if ("response" in result) return result.response;
    const body = await request.json().catch(() => null);
    if (!validateExpediente(body) || body.id !== id || !Number.isInteger(body.version)) {
      return Response.json({ error: "Datos de expediente inválidos." }, { status: 400 });
    }
    if (body.version !== result.doc.version) {
      return Response.json({ error: "El expediente cambió en otra pestaña.", expediente: stripStoredFields(result.doc) }, { status: 409 });
    }
    const next: StoredExpediente = {
      ...body,
      propietarioId: result.doc.propietarioId,
      version: result.doc.version + 1,
      actualizado: new Date().toISOString(),
    };
    const updated = await (await getMongoDb()).collection<StoredExpediente>("expedientes")
      .updateOne(
        { id, propietarioId: result.doc.propietarioId, version: result.doc.version },
        { $set: next },
      );
    if (updated.modifiedCount !== 1) {
      return Response.json({ error: "El expediente cambió en otra pestaña." }, { status: 409 });
    }
    return Response.json(stripStoredFields(next));
  } catch (error) {
    console.error("[expedientes] Update failed", { error: error instanceof Error ? error.name : "UnknownError" });
    return Response.json({ error: "No fue posible actualizar el expediente." }, { status: 503 });
  }
}
