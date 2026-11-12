import { getMongoDb } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/server-auth";
import { stripStoredFields, validateExpediente, type StoredExpediente } from "@/lib/expedientes";

const collectionName = "expedientes";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return Response.json({ error: "No autenticado" }, { status: 401 });
    const db = await getMongoDb();
    const docs = await db.collection<StoredExpediente>(collectionName)
      .find({ propietarioId: user.id })
      .sort({ actualizado: -1 })
      .toArray();
    return Response.json(docs.map(stripStoredFields));
  } catch (error) {
    console.error("[expedientes] List failed", { error: error instanceof Error ? error.name : "UnknownError" });
    return Response.json({ error: "No fue posible consultar los expedientes." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return Response.json({ error: "No autenticado" }, { status: 401 });
    const body = await request.json().catch(() => null);
    if (!validateExpediente(body)) return Response.json({ error: "Datos de expediente inválidos." }, { status: 400 });

    const now = new Date().toISOString();
    const collection = (await getMongoDb()).collection<StoredExpediente>(collectionName);
    await collection.createIndex({ propietarioId: 1, id: 1 }, { unique: true });
    const existing = await collection.findOne({ propietarioId: user.id, id: body.id });
    if (existing) return Response.json(stripStoredFields(existing));

    const stored: StoredExpediente = {
      ...body,
      propietarioId: user.id,
      version: 1,
      actualizado: now,
    };
    try {
      await collection.insertOne(stored);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === 11000) {
        const duplicate = await collection.findOne({ propietarioId: user.id, id: body.id });
        if (duplicate) return Response.json(stripStoredFields(duplicate));
      }
      throw error;
    }
    return Response.json(stripStoredFields(stored), { status: 201 });
  } catch (error) {
    console.error("[expedientes] Create failed", { error: error instanceof Error ? error.name : "UnknownError" });
    return Response.json({ error: "No fue posible crear el expediente." }, { status: 503 });
  }
}
