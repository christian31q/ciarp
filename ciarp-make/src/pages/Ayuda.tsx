import { BookOpen, LifeBuoy, Mail, Phone } from "lucide-react";
import { Button, Card } from "../components/ui";

export function Ayuda() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex size-11 items-center justify-center rounded-[10px] bg-navy/5 text-navy">
          <BookOpen className="size-5" />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold text-navy">Manual de uso</h2>
          <p className="mt-1 text-[14px] text-text-secondary">
            Guía del proceso de registro, validación documental y valoración de la hoja de vida
            docente conforme al Decreto 1279 de 2002.
          </p>
        </div>
        <Button variant="secondary" className="self-start">
          Abrir manual
        </Button>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <div className="flex size-11 items-center justify-center rounded-[10px] bg-navy/5 text-navy">
          <LifeBuoy className="size-5" />
        </div>
        <div>
          <h2 className="text-[18px] font-semibold text-navy">Contacto con soporte</h2>
          <div className="mt-3 flex flex-col gap-2 text-[14px] text-text-primary">
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4 text-text-secondary" /> soporte.valoracion@unimilitar.edu.co
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone className="size-4 text-text-secondary" /> (601) 650 0000 · ext. 1450
            </span>
          </div>
        </div>
        <Button className="self-start">Contactar soporte</Button>
      </Card>
    </div>
  );
}
