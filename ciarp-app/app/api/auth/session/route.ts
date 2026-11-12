import { auth } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";

type AuthSession = {
  user?: {
    id: string;
    name: string;
    email: string;
    role?: unknown;
    active?: unknown;
  };
};

function isRole(value: unknown): value is "Digitador" | "Administrador" {
  return value === "Digitador" || value === "Administrador";
}

export async function GET(request: Request) {
  try {
    const authResponse = await auth.handler(
      new Request(new URL("/api/auth/get-session", request.url), {
        headers: request.headers,
      }),
    );
    const session = (await authResponse.json()) as AuthSession | null;
    const sessionUser = session?.user;

    if (!sessionUser) {
      return Response.json(null, { status: 401 });
    }

    const user = await (await getMongoDb()).collection("user").findOne<{
      role?: unknown;
      active?: unknown;
    }>({ email: sessionUser.email });

    if (!user || user.active !== true || !isRole(user.role)) {
      return Response.json(null, { status: 401 });
    }

    return Response.json({
      user: {
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        role: user.role,
        active: true,
      },
    });
  } catch (error) {
    console.error("[auth session] Session lookup failed", {
      error: error instanceof Error ? error.name : "UnknownError",
    });

    return Response.json({ error: "Authentication unavailable" }, { status: 503 });
  }
}
