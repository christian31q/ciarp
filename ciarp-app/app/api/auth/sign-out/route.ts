import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    return auth.handler(
      new Request(new URL("/api/auth/sign-out", request.url), {
        method: "POST",
        headers: request.headers,
        body: await request.text(),
      }),
    );
  } catch (error) {
    console.error("[auth sign-out] Sign-out failed", {
      error: error instanceof Error ? error.name : "UnknownError",
    });

    return Response.json({ error: "Authentication unavailable" }, { status: 503 });
  }
}
