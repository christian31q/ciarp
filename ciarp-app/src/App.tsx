import { useEffect, useState } from "react";
import { AppShell, type Route } from "./components/Layout";
import { StoreProvider, nuevoExpediente, resumenPuntaje, snapshotValoracion, useStore, type Expediente, type UsuarioSistema, nowStr } from "./lib/store";
import { Login } from "./views/Login";
import { Inicio } from "./views/Inicio";
import { Wizard } from "./views/wizard/Wizard";
import { Exportar } from "./views/Exportar";
import { Configuracion } from "./views/Configuracion";
import { Ayuda } from "./views/Ayuda";
import { getSession, signOut } from "./lib/auth";

const TITULOS: Record<Route, string> = {
  inicio: "Inicio",
  wizard: "Valoración para ingreso docente",
  exportar: "Valoraciones completadas",
  configuracion: "Configuración",
  ayuda: "Ayuda",
};

function resumenPuntajeTxt(e: Expediente): string {
  const r = resumenPuntaje(e);
  return `${r.total.toFixed(2)} pts · ${r.categoriaCalculada}`;
}

function Aplicacion({ onLogout }: { onLogout: () => void }) {
  const { expedientes, siguienteSecuencia, usuario, upsert } = useStore();
  const esDigitador = usuario.rol === "Digitador";
  const [route, setRoute] = useState<Route>("inicio");
  const [wizardExp, setWizardExp] = useState<Expediente | null>(null);
  const [configTab, setConfigTab] = useState("Perfil");

  const navegar = (r: Route, tab?: string) => {
    if (r === "configuracion") setConfigTab(tab ?? "Perfil");
    if (r === "wizard") {
      if (usuario.rol !== "Digitador") return; // solo digitadores crean
      setWizardExp(nuevoExpediente(siguienteSecuencia()));
    }
    setRoute(r);
  };

  const nuevaValoracion = () => {
    if (usuario.rol !== "Digitador") return;
    setWizardExp(nuevoExpediente(siguienteSecuencia()));
    setRoute("wizard");
  };

  const continuar = (id: string) => {
    const e = expedientes.find((x) => x.id === id);
    if (e) {
      setWizardExp({ ...e });
      setRoute("wizard");
    }
  };

  const devolverEdicion = (id: string) => {
    if (!esDigitador) return;
    const e = expedientes.find((x) => x.id === id);
    if (!e) return;
    const reabierto: Expediente = {
      ...e,
      estado: "En proceso",
      bitacora: [
        ...e.bitacora,
        {
          usuario: usuario.nombre,
          rol: usuario.rol,
          fecha: nowStr(),
          accion: "Devuelto a edición",
          elemento: "Expediente",
          detalle: "Valoración reabierta para corrección desde Valoraciones completadas.",
        },
      ],
    };
    // Persistir de inmediato: el histórico, el número y la bitácora se conservan
    // aunque el usuario abandone el asistente sin finalizar.
    upsert(reabierto);
    setWizardExp(reabierto);
    setRoute("wizard");
  };

  // Segunda valoración: guarda el resultado actual en el histórico y abre una
  // nueva valoración sobre el mismo expediente sin sobrescribir el primer envío.
  const segundaValoracion = (id: string) => {
    if (!esDigitador) return;
    const e = expedientes.find((x) => x.id === id);
    if (!e) return;
    const numero = (e.numeroValoracion ?? 1) + 1;
    const reabierto: Expediente = {
      ...e,
      estado: "En proceso",
      numeroValoracion: numero,
      historial: [...(e.historial ?? []), snapshotValoracion(e, usuario.nombre)],
      bitacora: [
        ...e.bitacora,
        {
          usuario: usuario.nombre,
          rol: usuario.rol,
          fecha: nowStr(),
          accion: `Inicio de la valoración ${numero}`,
          elemento: "Expediente",
          detalle: `Resultado anterior conservado en el histórico: ${resumenPuntajeTxt(e)}.`,
        },
      ],
    };
    // Persistir de inmediato: el histórico, el número y la bitácora se conservan
    // aunque el usuario abandone el asistente sin finalizar.
    upsert(reabierto);
    setWizardExp(reabierto);
    setRoute("wizard");
  };

  return (
    <AppShell route={route} title={TITULOS[route]} onNavigate={navegar} onLogout={onLogout}>
      {route === "inicio" && (
        <Inicio onNueva={nuevaValoracion} onContinuar={continuar} />
      )}
      {route === "wizard" && wizardExp && (
        <Wizard
          key={wizardExp.id}
          inicial={wizardExp}
          onSalir={() => {
            setWizardExp(null);
            setRoute("inicio");
          }}
          onVerValoraciones={() => {
            setWizardExp(null);
            setRoute("exportar");
          }}
        />
      )}
      {route === "exportar" && <Exportar
          onDevolverEdicion={esDigitador ? devolverEdicion : undefined}
          onSegundaValoracion={esDigitador ? segundaValoracion : undefined}
        />}
      {route === "configuracion" && <Configuracion tabInicial={configTab} />}
      {route === "ayuda" && <Ayuda />}
    </AppShell>
  );
}

export default function App() {
  const [usuarioAuth, setUsuarioAuth] = useState<UsuarioSistema | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    getSession()
      .then(setUsuarioAuth)
      .catch((error) => {
        console.error("[auth] Session restore failed", error);
        setUsuarioAuth(null);
      })
      .finally(() => setCargandoSesion(false));
  }, []);

  if (cargandoSesion) {
    return <div className="min-h-screen bg-bg" aria-label="Cargando sesión" />;
  }

  if (!usuarioAuth) {
    return <Login onLogin={(u) => setUsuarioAuth(u)} />;
  }

  return (
    <StoreProvider usuarioInicial={usuarioAuth}>
      <Aplicacion
        onLogout={() => {
          signOut()
            .catch((error) => {
              console.error("[auth] Sign-out failed", error);
            })
            .finally(() => setUsuarioAuth(null));
        }}
      />
    </StoreProvider>
  );
}
