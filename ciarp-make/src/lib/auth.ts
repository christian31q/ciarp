import type { Rol, UsuarioSistema } from "./store";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Rol;
  active: boolean;
};

type AuthResponse = {
  user?: AuthUser;
};

function toUsuario(user: AuthUser): UsuarioSistema {
  return {
    usuario: user.email,
    nombre: user.name,
    correo: user.email,
    dependencia: "División de Gestión del Talento Humano",
    iniciales: user.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
    rol: user.role,
  };
}

async function readResponse(response: Response): Promise<AuthResponse> {
  const data = (await response.json().catch(() => null)) as
    | AuthResponse
    | { error?: string }
    | null;

  if (!response.ok || !data || !("user" in data) || !data.user) {
    throw new Error(
      data && "error" in data && data.error
        ? data.error
        : "No fue posible autenticar la cuenta.",
    );
  }

  return data;
}

export async function signIn(
  email: string,
  password: string,
  role: Rol,
): Promise<UsuarioSistema> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, role }),
  });

  const data = await readResponse(response);
  return toUsuario(data.user!);
}

export async function getSession(): Promise<UsuarioSistema | null> {
  const response = await fetch("/api/auth/session", {
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401) return null;
  const data = await readResponse(response);
  return toUsuario(data.user!);
}

export async function signOut(): Promise<void> {
  const response = await fetch("/api/auth/sign-out", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No fue posible cerrar la sesión.");
  }
}
