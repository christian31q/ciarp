import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CIARP | Valoración para ingreso docente",
  description:
    "Registro, validación y valoración de hojas de vida para ingreso docente.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
