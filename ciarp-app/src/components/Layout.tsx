import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useStore } from "../lib/store";

export type Route =
  | "inicio"
  | "wizard"
  | "exportar"
  | "configuracion"
  | "ayuda";

const NAV: { label: string; route: Route }[] = [
  { label: "Inicio", route: "inicio" },
  { label: "Nueva valoración", route: "wizard" },
  { label: "Valoraciones completadas", route: "exportar" },
  { label: "Configuración", route: "configuracion" },
  { label: "Ayuda", route: "ayuda" },
];

export function Logo({ variant = "light" }: { variant?: "light" | "dark" }) {
  const isLight = variant === "light";
  return (
    <div className="flex items-center gap-3">
      {/* Espacio reservado para el escudo institucional (logo 1.png / logo 2.png) */}
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold tracking-tight ${
          isLight
            ? "border-white/25 text-white/80"
            : "border-navy/25 text-navy"
        }`}
        aria-hidden
      >
        UMNG
      </div>
      <div className="leading-tight">
        <p className={`text-[12px] font-bold ${isLight ? "text-white" : "text-navy"}`}>
          Universidad Militar
        </p>
        <p className={`text-[12px] font-semibold ${isLight ? "text-white/70" : "text-text-secondary"}`}>
          Nueva Granada
        </p>
      </div>
    </div>
  );
}

function SidebarNav({
  route,
  onNavigate,
}: {
  route: Route;
  onNavigate: (r: Route) => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Navegación principal">
      {NAV.map((item) => {
        const active = route === item.route;
        return (
          <button
            key={item.route}
            onClick={() => onNavigate(item.route)}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-h-[44px] items-center rounded-[8px] px-4 text-left text-[14px] font-medium transition-colors ${
              active
                ? "bg-white/10 text-white"
                : "text-white/75 hover:bg-white/5 hover:text-white"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-yellow" />
            )}
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function UserMenu({ onNavigate, onLogout }: { onNavigate: (r: Route, tab?: string) => void; onLogout: () => void }) {
  const { usuario } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex min-h-[44px] items-center gap-2.5 rounded-[8px] px-2 py-1 transition-colors hover:bg-disabled"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-navy text-[13px] font-semibold text-white">
          {usuario.iniciales}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-[13px] font-semibold text-text-primary">
            {usuario.nombre}
          </span>
          <span className={`block text-[12px] font-medium ${"rol" in usuario && usuario.rol === "Administrador" ? "text-yellow-600" : "text-text-secondary"}`}>
            {"rol" in usuario ? (usuario as { rol: string }).rol : "Evaluador"}
          </span>
        </span>
        <ChevronDown className="size-4 text-text-secondary" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-[10px] border border-border-soft bg-surface py-1 shadow-[var(--shadow-pop)] animate-[popIn_.15s_ease]"
        >
          {[
            { label: "Perfil", act: () => onNavigate("configuracion", "Perfil") },
            { label: "Configuración", act: () => onNavigate("configuracion") },
          ].map((it) => (
            <button
              key={it.label}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                it.act();
              }}
              className="flex w-full min-h-[44px] items-center px-4 text-left text-[14px] text-text-primary hover:bg-disabled"
            >
              {it.label}
            </button>
          ))}
          <div className="my-1 border-t border-border-soft" />
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex w-full min-h-[44px] items-center px-4 text-left text-[14px] font-medium text-error hover:bg-error-bg"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export function AppShell({
  route,
  title,
  onNavigate,
  onLogout,
  children,
}: {
  route: Route;
  title: string;
  onNavigate: (r: Route, tab?: string) => void;
  onLogout: () => void;
  children: ReactNode;
}) {
  const [drawer, setDrawer] = useState(false);

  return (
    <div className="min-h-screen bg-bg lg:pl-60">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-navy lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo />
        </div>
        <SidebarNav route={route} onNavigate={onNavigate} />
        <div className="border-t border-white/10 px-5 py-3 text-[11px] text-white/50">
          CIARP · Valoración para ingreso docente · v1.0
        </div>
      </aside>

      {/* Drawer móvil */}
      {drawer && (
        <div className="fixed inset-0 z-40 flex lg:hidden" onClick={() => setDrawer(false)}>
          <div className="absolute inset-0 bg-navy/40" />
          <aside
            className="relative flex w-64 flex-col bg-navy animate-[slideIn_.2s_ease]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <Logo />
              <button
                onClick={() => setDrawer(false)}
                aria-label="Cerrar menú"
                className="flex size-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarNav
              route={route}
              onNavigate={(r) => {
                setDrawer(false);
                onNavigate(r);
              }}
            />
          </aside>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border-soft bg-surface/95 px-4 backdrop-blur md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setDrawer(true)}
            aria-label="Abrir menú"
            className="flex size-11 items-center justify-center rounded-md text-navy hover:bg-disabled lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="truncate text-[18px] font-bold text-navy md:text-[22px]">{title}</h1>
        </div>
        <UserMenu onNavigate={onNavigate} onLogout={onLogout} />
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
