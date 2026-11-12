import { auth } from "@/lib/auth";
import { getMongoDb } from "@/lib/mongodb";

export type AppRole = "Digitador" | "Administrador";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
};

function isRole(value: unknown): value is AppRole {
  return value === "Digitador" || value === "Administrador";
}

export async function getCurrentUser(request: Request): Promise<CurrentUser | null> {
  const response = await auth.handler(
    new Request(new URL("/api/auth/get-session", request.url), {
      headers: request.headers,
    }),
  );
  const session = (await response.json()) as {
    user?: { id?: unknown; name?: unknown; email?: unknown };
  } | null;
  const sessionUser = session?.user;

  if (
    typeof sessionUser?.id !== "string" ||
    typeof sessionUser.name !== "string" ||
    typeof sessionUser.email !== "string"
  ) {
    return null;
  }

  const fallbackUser = await (await getMongoDb()).collection("user").findOne<{
    role?: unknown;
    active?: unknown;
  }>({ email: sessionUser.email });

  if (!fallbackUser || fallbackUser.active !== true || !isRole(fallbackUser.role)) {
    return null;
  }

  return {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    role: fallbackUser.role,
  };
}
