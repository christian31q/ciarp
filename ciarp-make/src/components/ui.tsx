import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Search,
  UploadCloud,
  X,
} from "lucide-react";

// --------------------------- Button ---------------------------

type Variant = "primary" | "secondary" | "tertiary" | "outline" | "danger";

const variantCls: Record<Variant, string> = {
  primary:
    "bg-yellow text-navy hover:bg-yellow-600 active:bg-yellow-600 disabled:bg-disabled disabled:text-text-secondary",
  secondary:
    "bg-navy text-white hover:bg-navy-600 active:bg-navy-400 disabled:bg-disabled disabled:text-text-secondary",
  tertiary:
    "bg-transparent text-navy hover:bg-navy/5 active:bg-navy/10 disabled:text-text-secondary",
  outline:
    "bg-transparent text-navy border border-navy hover:bg-navy/5 disabled:border-border-soft disabled:text-text-secondary",
  danger:
    "bg-error text-white hover:brightness-95 active:brightness-90 disabled:bg-disabled disabled:text-text-secondary",
};

export function Button({
  variant = "primary",
  loading,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
}) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[8px] px-4 text-[14px] font-semibold leading-5 transition-colors disabled:cursor-not-allowed ${variantCls[variant]} ${className}`}
    >
      {loading && <Loader2 className="size-4 animate-spin" strokeWidth={2} />}
      {children}
    </button>
  );
}

// --------------------------- Field wrapper ---------------------------

export function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[14px] font-semibold leading-5 text-text-primary">
        {label}
        {required && <span className="ml-0.5 text-error">*</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="text-[12px] leading-4 text-text-secondary">{hint}</span>
      )}
      {error && (
        <span className="flex items-center gap-1 text-[12px] leading-4 text-error">
          <AlertCircle className="size-3.5" strokeWidth={2} /> {error}
        </span>
      )}
    </label>
  );
}

const baseInput =
  "h-11 w-full rounded-[8px] border bg-surface px-3 text-[15px] text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:border-navy disabled:bg-disabled disabled:text-text-secondary";

export function Input({
  error,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...rest}
      className={`${baseInput} ${error ? "border-error" : "border-border-soft"} ${className}`}
    />
  );
}

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const [show, setShow] = useState(false);
  const { error, className = "", ...rest } = props;
  return (
    <div className="relative">
      <input
        {...rest}
        type={show ? "text" : "password"}
        className={`${baseInput} pr-11 ${error ? "border-error" : "border-border-soft"} ${className}`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-text-secondary hover:text-navy"
      >
        {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
      </button>
    </div>
  );
}

export function Select({
  error,
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      {...rest}
      className={`${baseInput} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%235F6978%22 stroke-width=%222%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[right_12px_center] bg-no-repeat pr-9 ${error ? "border-error" : "border-border-soft"} ${className}`}
    >
      {children}
    </select>
  );
}

export function Textarea({
  error,
  className = "",
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      {...rest}
      className={`min-h-24 w-full rounded-[8px] border bg-surface p-3 text-[15px] text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:border-navy ${error ? "border-error" : "border-border-soft"} ${className}`}
    />
  );
}

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-text-secondary" />
      <input
        {...rest}
        className={`${baseInput} pl-10 ${className}`}
      />
    </div>
  );
}

// --------------------------- Card ---------------------------

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[12px] border border-border-soft bg-surface shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </div>
  );
}

// --------------------------- Badges ---------------------------

export function StatusBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    "En proceso": "bg-info-bg text-info",
    "Completada": "bg-success-bg text-success",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${map[estado] ?? "bg-disabled text-text-secondary"}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {estado}
    </span>
  );
}

export function SoporteBadge({ estado }: { estado: string }) {
  const map: Record<string, { cls: string; icon: ReactNode }> = {
    "Pendiente de validación": {
      cls: "bg-warning-bg text-warning",
      icon: <AlertCircle className="size-3.5" />,
    },
    "Con observación": {
      cls: "bg-error-bg text-error",
      icon: <AlertCircle className="size-3.5" />,
    },
    Revisado: { cls: "bg-success-bg text-success", icon: <Check className="size-3.5" /> },
    "Sin cargar": { cls: "bg-disabled text-text-secondary", icon: <Info className="size-3.5" /> },
    "Pendiente de concepto": {
      cls: "bg-warning-bg text-warning",
      icon: <AlertCircle className="size-3.5" />,
    },
    Registrado: { cls: "bg-success-bg text-success", icon: <Check className="size-3.5" /> },
  };
  const m = map[estado] ?? map["Sin cargar"];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${m.cls}`}
    >
      {m.icon}
      {estado}
    </span>
  );
}

// --------------------------- Inline alert ---------------------------

export function InlineAlert({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning" | "error" | "success";
  children: ReactNode;
}) {
  const map = {
    info: { cls: "bg-info-bg text-info border-info/20", icon: <Info className="size-[18px]" /> },
    warning: {
      cls: "bg-warning-bg text-warning border-warning/20",
      icon: <AlertCircle className="size-[18px]" />,
    },
    error: {
      cls: "bg-error-bg text-error border-error/20",
      icon: <AlertCircle className="size-[18px]" />,
    },
    success: {
      cls: "bg-success-bg text-success border-success/20",
      icon: <CheckCircle2 className="size-[18px]" />,
    },
  }[tone];
  return (
    <div
      className={`flex items-start gap-2.5 rounded-[8px] border px-3.5 py-3 text-[13px] leading-5 ${map.cls}`}
    >
      <span className="mt-0.5 shrink-0">{map.icon}</span>
      <div>{children}</div>
    </div>
  );
}

// --------------------------- Modal ---------------------------

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 animate-[fadeIn_.15s_ease]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-3xl" : "max-w-md"} rounded-[12px] bg-surface shadow-[var(--shadow-pop)] animate-[popIn_.18s_ease]`}
      >
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
          <h2 className="text-[18px] font-semibold text-navy">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-disabled"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-border-soft px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// --------------------------- Drawer ---------------------------

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-md flex-col bg-surface shadow-[var(--shadow-pop)] animate-[slideIn_.2s_ease]"
      >
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
          <h2 className="text-[18px] font-semibold text-navy">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-disabled"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

// --------------------------- File upload ---------------------------

export function FileUpload({
  nombre,
  onSelect,
}: {
  nombre?: string;
  onSelect: (name: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input
        ref={ref}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f.name);
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="flex w-full items-center gap-3 rounded-[8px] border border-dashed border-border-soft bg-bg/40 px-4 py-3 text-left transition-colors hover:border-navy hover:bg-navy/5"
      >
        <UploadCloud className="size-5 text-navy" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-text-primary">
            {nombre || "Seleccionar archivo"}
          </p>
          <p className="text-[12px] text-text-secondary">
            Formatos autorizados por la institución
          </p>
        </div>
      </button>
    </div>
  );
}

// --------------------------- Tabs ---------------------------

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-border-soft" role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={active === t}
          onClick={() => onChange(t)}
          className={`relative min-h-[44px] px-4 text-[14px] font-semibold transition-colors ${
            active === t ? "text-navy" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {t}
          {active === t && (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-yellow" />
          )}
        </button>
      ))}
    </div>
  );
}

// --------------------------- Spinner ---------------------------

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-text-secondary">
      <Loader2 className="size-5 animate-spin text-navy" />
      {label && <span className="text-[14px]">{label}</span>}
    </div>
  );
}

// --------------------------- Empty state ---------------------------

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-disabled text-text-secondary">
        <Search className="size-5" />
      </div>
      <p className="text-[15px] font-semibold text-text-primary">{title}</p>
      {hint && <p className="max-w-sm text-[13px] text-text-secondary">{hint}</p>}
      {action}
    </div>
  );
}

// Confirmación no intrusiva (se cierra sola). role="status" para lectores de pantalla.
export function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [message, onClose]);
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
      {message && (
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-[10px] border border-success/20 bg-surface px-4 py-3 text-[14px] font-medium text-text-primary shadow-lg">
          <CheckCircle2 className="size-[18px] shrink-0 text-success" />
          {message}
        </div>
      )}
    </div>
  );
}
