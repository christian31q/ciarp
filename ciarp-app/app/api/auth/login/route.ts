import { auth } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";

type LoginBody = {
  email?: unknown;
  password?: unknown;
  role?: unknown;
};

function isRole(value: unknown): value is "Digitador" | "Administrador" {
  return value === "Digitador" || value === "Administrador";
}

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (
    typeof body.email !== "string" ||
    typeof body.password !== "string" ||
    !isRole(body.role)
  ) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  try {
    const user = await (await getMongoDb()).collection("user").findOne<{
      role?: unknown;
      active?: unknown;
    }>({ email: body.email.trim().toLowerCase() });

    if (!user || user.active !== true || user.role !== body.role) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const authRequest = new Request(
      new URL("/api/auth/sign-in/email", request.url),
      {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify({
          email: body.email.trim().toLowerCase(),
          password: body.password,
        }),
      },
    );

    return auth.handler(authRequest);
  } catch (error) {
    console.error("[auth login] Authentication failed", {
      error: error instanceof Error ? error.name : "UnknownError",
    });

    return Response.json({ error: "Authentication unavailable" }, { status: 503 });
  }
}
