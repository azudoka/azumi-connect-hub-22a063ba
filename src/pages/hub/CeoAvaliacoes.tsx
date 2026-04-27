import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { SectionDivider } from "@/components/SectionDivider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  MessagesSquare,
  Sparkles,
  Star,
} from "lucide-react";
import { useState } from "react";

type StatusCiclo = "andamento" | "concluido" | "nao_iniciado";
const statusStyle: Record<StatusCiclo, { label: string; cls: string }> = {
  andamento: { label: "Em andamento", cls: "bg-info/15 text-info border-info/30" },
  concluido: { label: "Concluído", cls: "bg-success/15 text-success border-success/30" },
  nao_iniciado: { label: "Não iniciado", cls: "bg-muted text-muted-foreground border-border" },
};

interface Pessoa {
  nome: string;
  nota: number;
}

interface Departamento {
  id: string;
  nome: string;
  concluido: number;
  notaMedia: number;
  status: StatusCiclo;
  top: Pessoa[];
  bottom: Pessoa[];
}

const departamentos: Departamento[] = [
  {
    id: "ops",
    nome: "Operações",
    concluido: 92,
    notaMedia: 4.3,
    status: "andamento",
    top: [
      { nome: "Beatriz Moura", nota: 4.9 },
      { nome: "Carlos Tavares", nota: 4.7 },
      { nome: "Juliana Prado", nota: 4.6 },
    ],
    bottom: [
      { nome: "Rodrigo Lima", nota: 2.8 },
      { nome: "Felipe Santos", nota: 3.0 },
      { nome: "Ana Costa", nota: 3.1 },
    ],
  },
  {
    id: "tec",
    nome: "Tecnologia",
    concluido: 78,
    notaMedia: 4.1,
    status: "andamento",
    top: [
      { nome: "Marcos Andrade", nota: 4.8 },
      { nome: "Patricia Yamada", nota: 4.6 },
      { nome: "Lucas Ferreira", nota: 4.5 },
    ],
    bottom: [
      { nome: "Igor Mendes", nota: 2.4 },
      { nome: "Tiago Rocha", nota: 2.9 },
      { nome: "Camila Vieira", nota: 3.0 },
    ],
  },
  {
    id: "com",
    nome: "Comercial",
    concluido: 100,
    notaMedia: 4.5,
    status: "concluido",
    top: [
      { nome: "Rafael Borges", nota: 4.9 },
      { nome: "Mariana Lopes", nota: 4.8 },
      { nome: "Vinícius Pinto", nota: 4.7 },
    ],
    bottom: [
      { nome: "Sandra Melo", nota: 3.2 },
      { nome: "Thiago Aguiar", nota: 3.4 },
      { nome: "Gabriel Souza", nota: 3.5 },
    ],
  },
  {
    id: "pec",
    nome: "Pessoas & Cultura",
    concluido: 100,
    notaMedia: 4.6,
    status: "concluido",
    top: [
      { nome: "Renata Carvalho", nota: 4.9 },
      { nome: "Marina Almeida", nota: 4.7 },
      { nome: "Bruno Estevão", nota: 4.6 },
    ],
    bottom: [
      { nome: "Diego Lara", nota: 3.6 },
      { nome: "Helena Gusmão", nota: 3.8 },
      { nome: "Paulo Reis", nota: 3.9 },
    ],
  },
  {
    id: "fin",
    nome: "Financeiro",
    concluido: 0,
    notaMedia: 0,
    status: "nao_iniciado",
    top: [],
    bottom: [],
  },
];

export default function CeoAvaliacoes() {
  const isMobile = useIsMobile();
  const [expandido, setExpandido] = useState<string | null>(null);

  const totalAvaliados = Math.round(
    departamentos.filter((d) => d.status !== "nao_iniciado").reduce((s, d) => s + d.concluido, 0) /
      departamentos.length,
  );
  const notaGeral =
    departamentos.filter((d) => d.notaMedia > 0).reduce((s, d) => s + d.notaMedia, 0) /
    departamentos.filter((d) => d.notaMedia > 0).length;

  return (
    <div>
      <PageHeader
        title="Avaliações de desempenho"
        subtitle="Painel consolidado por departamento."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Ciclo atual" value="1º sem 2026" icon={ClipboardCheck} />
        <KpiCard label="% avaliados" value={`${totalAvaliados}%`} icon={Sparkles} />
        <KpiCard label="Nota média geral" value={notaGeral.toFixed(1)} icon={Star} hint="de 5.0" />
        <KpiCard label="Feedbacks pendentes" value={7} icon={MessagesSquare} />
      </div>

      <SectionDivider>Departamentos</SectionDivider>

      {isMobile ? (
        <Accordion type="single" collapsible className="w-full space-y-2">
          {departamentos.map((d) => (
            <AccordionItem
              key={d.id}
              value={d.id}
              className="bg-card border border-border rounded-2xl shadow-card px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-1 items-center gap-3 pr-2">
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-medium text-sm">{d.nome}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden max-w-[120px]">
                        <div
                          className="h-full bg-gradient-brand"
                          style={{ width: `${d.concluido}%` }}
                        />
                      </div>
                      <span className="font-data text-[11px]">{d.concluido}%</span>
                    </div>
                  </div>
                  <span className={cn("badge-pill shrink-0", statusStyle[d.status].cls)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                    {statusStyle[d.status].label}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <DeptDetalhe d={d} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <ul className="space-y-3">
          {departamentos.map((d) => {
            const aberto = expandido === d.id;
            return (
              <li
                key={d.id}
                className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandido(aberto ? null : d.id)}
                  className="w-full text-left p-5 flex items-center gap-4 hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{d.nome}</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1.5 w-48 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-brand"
                          style={{ width: `${d.concluido}%` }}
                        />
                      </div>
                      <span className="font-data text-xs">{d.concluido}% concluído</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-data">
                      {d.notaMedia > 0 ? d.notaMedia.toFixed(1) : "—"}
                    </span>
                  </div>
                  <span className={cn("badge-pill shrink-0", statusStyle[d.status].cls)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                    {statusStyle[d.status].label}
                  </span>
                  {aberto ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                {aberto && (
                  <div className="border-t border-border p-5 bg-background/40">
                    <DeptDetalhe d={d} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function DeptDetalhe({ d }: { d: Departamento }) {
  if (d.status === "nao_iniciado") {
    return (
      <div className="text-sm text-muted-foreground flex items-center gap-2 py-2">
        <AlertTriangle className="h-4 w-4" />
        Ciclo ainda não iniciado neste departamento.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
          Top 3
        </div>
        <ul className="space-y-2">
          {d.top.map((p) => (
            <li
              key={p.nome}
              className="flex items-center gap-3 p-2 rounded-lg border border-border bg-card"
            >
              <span className="text-sm font-medium flex-1 truncate">{p.nome}</span>
              <span className="font-data text-sm">{p.nota.toFixed(1)}</span>
              {p.nota >= 4.5 && (
                <span className="badge-pill bg-success/15 text-success border-success/30">
                  <Sparkles className="h-3 w-3" />
                  Destaque
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
          Bottom 3
        </div>
        <ul className="space-y-2">
          {d.bottom.map((p) => (
            <li
              key={p.nome}
              className="flex items-center gap-3 p-2 rounded-lg border border-border bg-card"
            >
              <span className="text-sm font-medium flex-1 truncate">{p.nome}</span>
              <span className="font-data text-sm">{p.nota.toFixed(1)}</span>
              {p.nota <= 2.5 && (
                <span className="badge-pill bg-destructive/15 text-destructive border-destructive/30">
                  <AlertTriangle className="h-3 w-3" />
                  Atenção
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
