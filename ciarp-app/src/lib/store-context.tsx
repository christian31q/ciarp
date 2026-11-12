import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  EXPEDIENTES_DEMO,
  type Expediente,
  type StoreCtx,
  type UsuarioSistema,
} from "./store";

// Contexto aislado del store. Se mantiene en un módulo dedicado para que
// editar las utilidades de cálculo en store.tsx no recree el contexto y
// rompa el árbol montado durante Hot Module Replacement.
const StoreContext = createContext<StoreCtx | null>(null);

export function StoreProvider({
  children,
  usuarioInicial,
}: {
  children: ReactNode;
  usuarioInicial: UsuarioSistema;
}) {
  const [persistidos, setPersistidos] = useState<Expediente[]>([]);
  const expedientes = useMemo(
    () => [...persistidos, ...EXPEDIENTES_DEMO.map((e) => ({ ...e, esDemo: true }))],
    [persistidos],
  );

  useEffect(() => {
    fetch("/api/expedientes", { credentials: "include", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("No fue posible cargar los expedientes.");
        return (await response.json()) as Expediente[];
      })
      .then(setPersistidos)
      .catch((error) => console.error("[expedientes] Load failed", error));
  }, []);

  const upsert = (e: Expediente) =>
    setPersistidos((prev) => {
      const i = prev.findIndex((x) => x.id === e.id);
      if (i === -1) return [e, ...prev];
      const copy = [...prev];
      copy[i] = e;
      return copy;
    });

  const guardar = async (e: Expediente): Promise<Expediente> => {
    if (e.esDemo) return e;
    const response = await fetch(e.version ? `/api/expedientes/${encodeURIComponent(e.id)}` : "/api/expedientes", {
      method: e.version ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(e),
    });
    const data = (await response.json().catch(() => null)) as Expediente | { error?: string; expediente?: Expediente } | null;
    if (!response.ok) {
      const error = data && "error" in data && data.error ? data.error : "No fue posible guardar el expediente.";
      throw Object.assign(new Error(error), { status: response.status, expediente: data && "expediente" in data ? data.expediente : undefined });
    }
    const saved = data as Expediente;
    setPersistidos((prev) => {
      const index = prev.findIndex((item) => item.id === saved.id);
      return index === -1 ? [saved, ...prev] : prev.map((item, i) => (i === index ? saved : item));
    });
    return saved;
  };

  const siguienteSecuencia = useCallback(
    () =>
      Math.max(
        0,
        ...expedientes.map((e) => Number(e.id.match(/-(\d+)$/)?.[1] ?? 0)),
      ) + 1,
    [expedientes],
  );

  const value = useMemo(
    () => ({ usuario: usuarioInicial, expedientes, upsert, guardar, siguienteSecuencia }),
    [usuarioInicial, expedientes, siguienteSecuencia]
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore fuera de StoreProvider");
  return ctx;
}
