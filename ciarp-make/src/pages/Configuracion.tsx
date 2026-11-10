import { useState } from "react";
import { Lock } from "lucide-react";
import {
  Button,
  Card,
  Field,
  InlineAlert,
  Input,
  PasswordInput,
  Tabs,
} from "../components/ui";
import { useStore } from "../lib/store";
import {
  PARAMS,
  PUNTOS_CATEGORIA,
  PUNTOS_FORMACION,
  TOPE_PRODUCTIVIDAD,
} from "../lib/rules";

const TABS = ["Perfil", "Seguridad", "Parámetros de valoración"];

export function Configuracion({ tabInicial = "Perfil" }: { tabInicial?: string }) {
  const { usuario } = useStore();
  const [tab, setTab] = useState(tabInicial);

  return (
    <div className="flex flex-col gap-5">
      <Card className="overflow-hidden">
        <div className="px-5 pt-2">
          <Tabs tabs={TABS} active={tab} onChange={setTab} />
        </div>
        <div className="p-5 md:p-6">
          {tab === "Perfil" && <Perfil usuario={usuario} />}
          {tab === "Seguridad" && <Seguridad />}
          {tab === "Parámetros de valoración" && <Parametros />}
        </div>
      </Card>
    </div>
  );
}

function Perfil({ usuario }: { usuario: ReturnType<typeof useStore>["usuario"] }) {
  const [guardado, setGuardado] = useState(false);
  return (
    <form
      className="flex max-w-xl flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2500);
      }}
    >
      <Field label="Nombre">
        <Input defaultValue={usuario.nombre} />
      </Field>
      <Field label="Correo institucional">
        <Input defaultValue={usuario.correo} type="email" />
      </Field>
      <Field label="Dependencia">
        <Input defaultValue={usuario.dependencia} />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary">
          Guardar cambios
        </Button>
        {guardado && <span className="text-[13px] font-medium text-success">Cambios guardados.</span>}
      </div>
    </form>
  );
}

function Seguridad() {
  const [f, setF] = useState({ actual: "", nueva: "", confirmar: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.actual) errs.actual = "Ingrese la contraseña actual.";
    if (f.nueva.length < 8) errs.nueva = "Mínimo 8 caracteres.";
    if (f.confirmar !== f.nueva) errs.confirmar = "Las contraseñas no coinciden.";
    setErr(errs);
    if (Object.keys(errs).length === 0) {
      setOk(true);
      setF({ actual: "", nueva: "", confirmar: "" });
      setTimeout(() => setOk(false), 2500);
    }
  };

  return (
    <form className="flex max-w-xl flex-col gap-4" onSubmit={submit}>
      <Field label="Contraseña actual" required error={err.actual}>
        <PasswordInput value={f.actual} error={!!err.actual} onChange={(e) => setF({ ...f, actual: e.target.value })} />
      </Field>
      <Field label="Nueva contraseña" required error={err.nueva}>
        <PasswordInput value={f.nueva} error={!!err.nueva} onChange={(e) => setF({ ...f, nueva: e.target.value })} />
      </Field>
      <Field label="Confirmar nueva contraseña" required error={err.confirmar}>
        <PasswordInput value={f.confirmar} error={!!err.confirmar} onChange={(e) => setF({ ...f, confirmar: e.target.value })} />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary">
          Cambiar contraseña
        </Button>
        {ok && <span className="text-[13px] font-medium text-success">Contraseña actualizada.</span>}
      </div>
    </form>
  );
}

function Parametros() {
  const filas = [
    { a: "Título de pregrado", v: PUNTOS_FORMACION.pregrado },
    { a: "Máximo posgrados", v: PUNTOS_FORMACION.maxPosgradoGeneral },
    { a: "Categoría · Profesor Asistente", v: PUNTOS_CATEGORIA["Profesor Asistente"] },
    { a: "Categoría · Profesor Asociado", v: PUNTOS_CATEGORIA["Profesor Asociado"] },
    { a: "Categoría · Profesor Titular", v: PUNTOS_CATEGORIA["Profesor Titular"] },
    { a: "Tope productividad · Titular", v: TOPE_PRODUCTIVIDAD["Profesor Titular"] },
  ];
  return (
    <div className="flex flex-col gap-4">
      <InlineAlert tone="info">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="size-3.5" /> Los parámetros de valoración son administrados por usuarios
          autorizados. Esta vista es de consulta.
        </span>
      </InlineAlert>
      <div className="overflow-x-auto rounded-[8px] border border-border-soft">
        <table className="w-full min-w-[520px] text-[14px]">
          <thead>
            <tr className="border-b border-border-soft bg-bg/60 text-left text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
              <th className="px-4 py-3">Apartado / parámetro</th>
              <th className="px-4 py-3 text-right">Valor en puntos</th>
              <th className="px-4 py-3">Vigencia</th>
              <th className="px-4 py-3">Versión</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.a} className="border-b border-border-soft last:border-0">
                <td className="px-4 py-3 text-text-primary">{f.a}</td>
                <td className="px-4 py-3 text-right tabular-nums font-semibold text-navy">{f.v}</td>
                <td className="px-4 py-3 text-text-secondary">{PARAMS.vigencia}</td>
                <td className="px-4 py-3 tabular-nums text-text-secondary">{PARAMS.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
