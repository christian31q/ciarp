import { getMongoDb } from "@/lib/mongodb";

export async function GET() {
  try {
    await (await getMongoDb()).command({ ping: 1 });

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[db health] MongoDB ping failed", {
      error: error instanceof Error ? error.name : "UnknownError",
    });

    return Response.json(
      { ok: false, error: "Database unavailable" },
      { status: 503 },
    );
  }
}
