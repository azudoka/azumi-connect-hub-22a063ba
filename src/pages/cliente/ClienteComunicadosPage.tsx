import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComunicadoCliente {
  id: string;
  titulo: string;
  tipo: string;
  data: string;
  status: "Enviado" | "Agendado";
  resumo: string;
}

const mock: ComunicadoCliente[] = [
  {
    id: "c1",
    titulo: "Boas-vindas ao Azumi Connect",
    tipo: "Endomarketing",
    data: "2025-04-10",
    status: "Enviado",
    resumo: "Apresentação da plataforma e dos principais recursos disponíveis para sua equipe.",
  },
  {
    id: "c2",
    titulo: "Nova política de home office",
    tipo: "Aviso",
    data: "2025-04-15",
    status: "Enviado",
    resumo: "Atualização das diretrizes sobre trabalho remoto. Acesse o documento completo na aba Documentos.",
  },
  {
    id: "c3",
    titulo: "Workshop de liderança — maio",
    tipo: "Evento",
    data: "2025-05-05",
    status: "Agendado",
    resumo: "Treinamento presencial para líderes de equipe. Confirmação de presença até 28/04.",
  },
  {
    id: "c4",
    titulo: "Resultado da pesquisa de clima",
    tipo: "Atualização",
    data: "2025-04-22",
    status: "Enviado",
    resumo: "Compartilhamos os resultados consolidados da pesquisa realizada em março/2025.",
  },
  {
    id: "c5",
    titulo: "Alerta: manutenção programada",
    tipo: "Alerta",
    data: "2025-05-12",
    status: "Agendado",
    resumo: "Indisponibilidade programada do sistema das 02h às 04h para atualização de infraestrutura.",
  },
];

const tipoCls: Record<string, string> = {
  Endomarketing: "bg-pink-500/15 text-pink-600",
  Atualização:   "bg-blue-500/15 text-blue-600",
  Aviso:         "bg-amber-500/15 text-amber-600",
  Alerta:        "bg-red-500/15 text-red-600",
  Evento:        "bg-emerald-500/15 text-emerald-600",
};

const statusCls: Record<string, string> = {
  Enviado:   "bg-emerald-500/15 text-emerald-600",
  Agendado:  "bg-amber-500/15 text-amber-600",
};

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function ClienteComunicadosPage() {
  return (
    <div>
      <PageHeader
        title="Comunicados"
        subtitle="Comunicações enviadas pela Azumi para sua empresa."
      />

      {mock.length === 0 ? (
        <div className="bg-card border border-border rounded-xl">
          <EmptyState
            icon={Megaphone}
            title="Nenhum comunicado"
            description="Ainda não há comunicados registrados para sua empresa."
          />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <ul className="divide-y divide-border">
            {mock.map((c) => (
              <li key={c.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-3 hover:bg-secondary/20 transition-colors">
                <div className="shrink-0 w-20 text-xs text-muted-foreground font-data pt-0.5">
                  {formatarData(c.data)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium leading-snug">{c.titulo}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.resumo}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", tipoCls[c.tipo] || "bg-secondary")}>
                    {c.tipo}
                  </span>
                  <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", statusCls[c.status])}>
                    {c.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
