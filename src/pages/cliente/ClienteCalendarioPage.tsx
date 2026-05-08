import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface Evento {
  id: string;
  titulo: string;
  tipo: string;
  data: string;
  hora?: string;
  local?: string;
  descricao: string;
}

const mock: Evento[] = [
  {
    id: "e1",
    titulo: "Workshop de Liderança",
    tipo: "Treinamento",
    data: "2025-05-05",
    hora: "09:00",
    local: "Sala de Treinamento — Sede",
    descricao: "Capacitação presencial para líderes de equipe focada em comunicação e gestão de conflitos.",
  },
  {
    id: "e2",
    titulo: "Pesquisa de Clima Q2",
    tipo: "Pesquisa",
    data: "2025-05-12",
    descricao: "Abertura do ciclo trimestral de pesquisa de engajamento e clima organizacional.",
  },
  {
    id: "e3",
    titulo: "Integração de Novos Colaboradores",
    tipo: "Evento",
    data: "2025-05-19",
    hora: "14:00",
    local: "Auditório",
    descricao: "Onboarding coletivo para as contratações de maio. Presença obrigatória para novos colaboradores.",
  },
  {
    id: "e4",
    titulo: "Encerramento do ciclo de avaliação",
    tipo: "Prazo",
    data: "2025-05-30",
    descricao: "Data limite para gestores concluírem as avaliações de desempenho do ciclo semestral.",
  },
  {
    id: "e5",
    titulo: "Semana da Saúde Mental",
    tipo: "Campanha",
    data: "2025-06-09",
    descricao: "Série de palestras e atividades sobre bem-estar, burnout e qualidade de vida no trabalho.",
  },
];

const tipoCls: Record<string, string> = {
  Treinamento: "bg-blue-500/15 text-blue-600",
  Pesquisa:    "bg-violet-500/15 text-violet-600",
  Evento:      "bg-emerald-500/15 text-emerald-600",
  Prazo:       "bg-red-500/15 text-red-600",
  Campanha:    "bg-pink-500/15 text-pink-600",
};

function parsarData(iso: string): { dia: string; mes: string; ano: string } {
  const [ano, mes, dia] = iso.split("-");
  const nomeMes = new Date(Number(ano), Number(mes) - 1, 1)
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
  return { dia, mes: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1), ano };
}

export default function ClienteCalendarioPage() {
  const sorted = [...mock].sort((a, b) => a.data.localeCompare(b.data));

  return (
    <div>
      <PageHeader
        title="Calendário"
        subtitle="Eventos, treinamentos e datas importantes para sua equipe."
      />

      {mock.length === 0 ? (
        <div className="bg-card border border-border rounded-xl">
          <EmptyState
            icon={CalendarDays}
            title="Nenhum evento"
            description="O calendário de eventos ainda está sendo preparado."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((ev) => {
            const { dia, mes } = parsarData(ev.data);
            return (
              <div
                key={ev.id}
                className="bg-card border border-border rounded-2xl shadow-card flex gap-4 px-5 py-4 hover:border-primary/40 transition-colors"
              >
                {/* Date badge */}
                <div className="shrink-0 flex flex-col items-center justify-center bg-primary/10 text-primary rounded-xl w-12 h-14 leading-none">
                  <span className="text-xs font-medium uppercase tracking-wide">{mes}</span>
                  <span className="text-2xl font-bold font-display">{dia}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-sm">{ev.titulo}</h3>
                    <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", tipoCls[ev.tipo] || "bg-secondary")}>
                      {ev.tipo}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ev.descricao}</p>
                  {(ev.hora || ev.local) && (
                    <p className="text-xs text-muted-foreground/70">
                      {[ev.hora, ev.local].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
