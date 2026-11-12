import {
  createContext,
  useContext,
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
  const [expedientes, setExpedientes] = useState<Expediente[]>(EXPEDIENTES_DEMO);

  const upsert = (e: Expediente) =>
    setExpedientes((prev) => {
      const i = prev.findIndex((x) => x.id === e.id);
      if (i === -1) return [e, ...prev];
      const copy = [...prev];
      copy[i] = e;
      return copy;
    });

  const siguienteSecuencia = () => expedientes.length + 1;

  const value = useMemo(
    () => ({ usuario: usuarioInicial, expedientes, upsert, siguienteSecuencia }),
    [usuarioInicial, expedientes]
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore fuera de StoreProvider");
  return ctx;
}
