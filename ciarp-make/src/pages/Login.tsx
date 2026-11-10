import { useState } from "react";
import { CheckCircle2, ShieldCheck, Pencil } from "lucide-react";
import { Button, Card, Field, InlineAlert, Input, PasswordInput } from "../components/ui";
import { Logo } from "../components/Layout";
import { USUARIOS_DEMO, type Rol, type UsuarioSistema } from "../lib/store";

const ROLES: { rol: Rol; label: string; descripcion: string; icon: typeof Pencil; color: string }[] = [
  {
    rol: "Digitador",
    label: "Usuario digitador",
    descripcion: "Crear valoraciones, editar información de docentes y verificar toda la información.",
    icon: Pencil,
    color: "navy",
  },
  {
    rol: "Administrador",
    label: "Administrador",
    descripcion: "Auditar el historial de cambios y editar información de docentes.",
    icon: ShieldCheck,
    color: "yellow",
  },
];

export function Login({ onLogin }: { onLogin: (u: UsuarioSistema) => void }) {
  const [vista, setVista] = useState<"login" | "recuperar" | "enviado">("login");
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | "">("");
  const [errores, setErrores] = useState<{ usuario?: string; pass?: string; rol?: string }>({});
  const [correo, setCorreo] = useState("");

  const entrar = () => {
    const e: typeof errores = {};
    if (!usuario.trim()) e.usuario = "Ingrese su usuario.";
    if (!pass.trim()) e.pass = "Ingrese su contraseña.";
    if (!rolSeleccionado) e.rol = "Seleccione un rol para continuar.";
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    // Prototipo: cualquier usuario/contraseña es válido; el rol determina el perfil
    const plantilla = USUARIOS_DEMO.find((u) => u.rol === rolSeleccionado)!;
    const { pass: _p, ...base } = plantilla;
    // Usar el nombre de usuario ingresado como nombre de display
    const iniciales = usuario.trim().slice(0, 2).toUpperCase();
    onLogin({ ...base, usuario: usuario.trim(), nombre: usuario.trim(), iniciales });
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Panel izquierdo: branding — visible solo en pantallas grandes */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col items-center justify-center bg-navy px-12 py-16 text-white">
        <div className="max-w-[420px] text-center">
          <Logo variant="light" />
          <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-yellow">CIARP</p>
          <h1 className="mt-2 text-[28px] font-bold leading-snug xl:text-[34px]">
            Valoración para ingreso docente
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">
            Registro, validación y valoración de la hoja de vida según el Decreto 1279 de 2002
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              { titulo: "Puntaje en tiempo real", desc: "Cálculo automático mientras se digita" },
              { titulo: "Auditoría completa", desc: "Registro de cada modificación con usuario y fecha" },
              { titulo: "Categoría automática", desc: "Calculada desde formación y experiencia" },
              { titulo: "Expediente PDF", desc: "Descarga directa sin salir del sistema" },
            ].map((item) => (
              <div key={item.titulo} className="rounded-[10px] bg-white/8 px-4 py-3">
                <p className="text-[13px] font-semibold text-yellow">{item.titulo}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[11px] text-white/40">
            Herramienta de apoyo institucional. No sustituye la decisión del Comité Interno ni el acto administrativo de reconocimiento de puntos.
          </p>
        </div>
      </div>

      {/* Panel derecho: formulario */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 lg:px-12">
        <div className="w-full max-w-[440px]">
          {/* Header visible solo en móvil/tablet */}
          <div className="mb-6 flex flex-col items-center gap-4 text-center lg:hidden">
            <Logo variant="dark" />
            <div>
              <h1 className="text-[22px] font-bold text-navy">
                Valoración para ingreso docente
              </h1>
              <p className="mt-1 text-[14px] text-text-secondary">
                CIARP · Decreto 1279 de 2002
              </p>
            </div>
          </div>
          {/* Header compacto solo en escritorio */}
          <div className="mb-6 hidden flex-col gap-1 lg:flex">
            <h2 className="text-[22px] font-bold text-navy">Iniciar sesión</h2>
            <p className="text-[14px] text-text-secondary">Seleccione su rol y acceda al sistema.</p>
          </div>

        <Card className="p-6 md:p-7">
          {vista === "login" && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => { e.preventDefault(); entrar(); }}
            >
              {/* Selector de rol */}
              <div>
                <p className="mb-2 text-[13px] font-semibold text-text-primary">
                  Seleccione su rol <span className="text-error">*</span>
                </p>
                <div className="flex flex-col gap-2">
                  {ROLES.map(({ rol, label, descripcion, icon: Icon, color }) => {
                    const activo = rolSeleccionado === rol;
                    return (
                      <button
                        key={rol}
                        type="button"
                        onClick={() => { setRolSeleccionado(rol); setErrores((prev) => ({ ...prev, rol: undefined })); }}
                        className={`flex items-start gap-3 rounded-[10px] border px-4 py-3 text-left transition-all ${
                          activo
                            ? color === "yellow"
                              ? "border-yellow bg-yellow/10 ring-1 ring-yellow"
                              : "border-navy bg-navy/8 ring-1 ring-navy"
                            : "border-border-soft bg-bg/60 hover:border-navy/30 hover:bg-navy/5"
                        }`}
                      >
                        <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                          activo
                            ? color === "yellow" ? "bg-yellow text-white" : "bg-navy text-white"
                            : "bg-disabled text-text-secondary"
                        }`}>
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className={`text-[14px] font-semibold leading-tight ${activo ? "text-navy" : "text-text-primary"}`}>
                            {label}
                          </p>
                          <p className="mt-0.5 text-[12px] leading-snug text-text-secondary">{descripcion}</p>
                        </div>
                        <span className={`ml-auto mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                          activo
                            ? color === "yellow" ? "border-yellow bg-yellow" : "border-navy bg-navy"
                            : "border-border-soft bg-surface"
                        }`}>
                          {activo && <span className="size-1.5 rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errores.rol && (
                  <p className="mt-1.5 text-[12px] text-error">{errores.rol}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Field label="Usuario" required error={errores.usuario}>
                  <Input
                    value={usuario}
                    error={!!errores.usuario}
                    onChange={(e) => { setUsuario(e.target.value); setErrores((prev) => ({ ...prev, usuario: undefined })); }}
                    autoComplete="username"
                    placeholder="Ingrese su usuario"
                  />
                </Field>
                <Field label="Contraseña" required error={errores.pass}>
                  <PasswordInput
                    value={pass}
                    error={!!errores.pass}
                    onChange={(e) => { setPass(e.target.value); setErrores((prev) => ({ ...prev, pass: undefined })); }}
                    autoComplete="current-password"
                    placeholder="Ingrese su contraseña"
                  />
                </Field>
              </div>

              <InlineAlert tone="info">
                Prototipo de demostración. Cualquier usuario y contraseña son válidos; el rol seleccionado determina los permisos.
              </InlineAlert>

              <Button type="submit" className="w-full">
                Iniciar sesión
              </Button>
              <button
                type="button"
                onClick={() => setVista("recuperar")}
                className="mx-auto text-[13px] font-semibold text-navy hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          )}

          {vista === "recuperar" && (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => { e.preventDefault(); setVista("enviado"); }}
            >
              <div>
                <h2 className="text-[18px] font-semibold text-navy">Recuperar contraseña</h2>
                <p className="mt-1 text-[13px] text-text-secondary">
                  Ingresa tu usuario o correo institucional para solicitar la recuperación.
                </p>
              </div>
              <Field label="Usuario o correo institucional" required>
                <Input
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="usuario@unimilitar.edu.co"
                />
              </Field>
              <Button type="submit" className="w-full">Solicitar recuperación</Button>
              <button
                type="button"
                onClick={() => setVista("login")}
                className="mx-auto text-[13px] font-semibold text-navy hover:underline"
              >
                Volver a iniciar sesión
              </button>
            </form>
          )}

          {vista === "enviado" && (
            <div className="flex flex-col gap-4">
              <InlineAlert tone="success">
                Si el usuario existe, enviaremos las instrucciones de recuperación al correo institucional asociado.
              </InlineAlert>
              <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                <CheckCircle2 className="size-4 text-success" />
                Solicitud registrada correctamente.
              </div>
              <Button variant="outline" className="w-full" onClick={() => setVista("login")}>
                Volver a iniciar sesión
              </Button>
            </div>
          )}
        </Card>

          <p className="mt-5 text-center text-[12px] text-text-secondary lg:hidden">
            Herramienta de apoyo institucional. No sustituye la decisión del Comité Interno ni el
            acto administrativo de reconocimiento de puntos.
          </p>
        </div>
      </div>
    </div>
  );
}
