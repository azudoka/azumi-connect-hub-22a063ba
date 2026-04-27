import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { SectionDivider } from "@/components/SectionDivider";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CalendarClock,
  Clock,
  TrendingDown,
  Wallet,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const evolucao = [
  { mes: "Mai/25", v: 5.8 },
  { mes: "Jun/25", v: 6.1 },
  { mes: "Jul/25", v: 6.4 },
  { mes: "Ago/25", v: 7.2 },
  { mes: "Set/25", v: 7.8 },
  { mes: "Out/25", v: 8.4 },
  { mes: "Nov/25", v: 8.1 },
  { mes: "Dez/25", v: 7.6 },
  { mes: "Jan/26", v: 7.9 },
  { mes: "Fev/26", v: 8.5 },
  { mes: "Mar/26", v: 9.1 },
  { mes: "Abr/26", v: 8.7 },
];

type Motivo = "voluntario" | "involuntario" | "termino";
const motivoStyle: Record<Motivo, { label: string; cls: string }> = {
  voluntario: { label: "Voluntário", cls: "bg-info/15 text-info border-info/30" },
  involuntario: { label: "Involuntário", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  termino: { label: "Término de contrato", cls: "bg-muted text-muted-foreground border-border" },
};

interface Desligamento {
  id: string;
  departamento: string;
  motivo: Motivo;
  data: string;
}

const desligamentos: Desligamento[] = [
  { id: "d1", departamento: "Comercial", motivo: "voluntario", data: "22/04/2026" },
  { id: "d2", departamento: "Tecnologia", motivo: "voluntario", data: "18/04/2026" },
  { id: "d3", departamento: "Operações", motivo: "involuntario", data: "15/04/2026" },
  { id: "d4", departamento: "Marketing", motivo: "termino", data: "10/04/2026" },
  { id: "d5", departamento: "Comercial", motivo: "voluntario", data: "04/04/2026" },
  { id: "d6", departamento: "Customer Success", motivo: "involuntario", data: "28/03/2026" },
];

const TURNOVER_ATUAL = 8.7;
const BENCHMARK = 8;

export default function CeoTurnover() {
  const isMobile = useIsMobile();
  const acimaBenchmark = TURNOVER_ATUAL > BENCHMARK;

  return (
    <div>
      <PageHeader
        title="Turnover & retenção"
        subtitle="Análise de desligamentos e estabilidade do time."
      />

      {acimaBenchmark && (
        <div className="mb-6 rounded-2xl border border-warning/40 bg-warning/10 p-4 flex gap-3">
          <div className="h-10 w-10 rounded-lg bg-warning/20 text-warning flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display font-semibold text-warning">
              Atenção: turnover acima do benchmark de mercado ({BENCHMARK}%)
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Recomendamos revisão do ciclo de clima e conversas estruturadas com lideranças.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Taxa de turnover"
          value={`${TURNOVER_ATUAL}%`}
          icon={TrendingDown}
          trend={{ value: "+0,2pp", positive: false }}
        />
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Voluntário × Involuntário
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="badge-pill bg-info/15 text-info border-info/30">
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
              Voluntário 5,4%
            </span>
            <span className="badge-pill bg-destructive/15 text-destructive border-destructive/30">
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
              Involuntário 3,3%
            </span>
          </div>
        </div>
        <KpiCard label="Tempo médio de casa" value="3,2 anos" icon={Clock} />
        <KpiCard
          label="Custo estimado (mês)"
          value="R$ 184k"
          icon={Wallet}
          hint="Recolocação + treinamento"
        />
      </div>

      <SectionDivider>Evolução — últimos 12 meses</SectionDivider>

      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-card">
        <div style={{ height: isMobile ? 200 : 288 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolucao}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="mes"
                stroke="hsl(var(--muted-foreground))"
                fontSize={isMobile ? 9 : 11}
                interval={isMobile ? 1 : 0}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(v: number) => `${v}%`}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <ReferenceLine
                y={BENCHMARK}
                stroke="hsl(var(--warning))"
                strokeDasharray="4 4"
                label={{
                  value: `Benchmark ${BENCHMARK}%`,
                  position: "insideTopRight",
                  fill: "hsl(var(--warning))",
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 3, fill: "hsl(var(--highlight))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <SectionDivider>Desligamentos recentes</SectionDivider>

      {/* Desktop / tablet */}
      <div className="hidden md:block bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Departamento</th>
              <th className="text-left font-semibold px-5 py-3">Motivo</th>
              <th className="text-right font-semibold px-5 py-3">Data</th>
            </tr>
          </thead>
          <tbody>
            {desligamentos.map((d) => (
              <tr key={d.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium">{d.departamento}</td>
                <td className="px-5 py-3">
                  <span className={cn("badge-pill", motivoStyle[d.motivo].cls)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                    {motivoStyle[d.motivo].label}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-data text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" />
                    {d.data}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="px-5 py-3 text-[11px] text-muted-foreground border-t border-border">
          Lista anonimizada — nomes não exibidos por privacidade.
        </p>
      </div>

      {/* Mobile cards */}
      <ul className="md:hidden space-y-2">
        {desligamentos.map((d) => (
          <li
            key={d.id}
            className="bg-card border border-border rounded-2xl p-3 shadow-card flex items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{d.departamento}</div>
              <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                <CalendarClock className="h-3 w-3" />
                {d.data}
              </div>
            </div>
            <span className={cn("badge-pill shrink-0", motivoStyle[d.motivo].cls)}>
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
              {motivoStyle[d.motivo].label}
            </span>
          </li>
        ))}
        <li className="text-[11px] text-muted-foreground px-1">
          Lista anonimizada — nomes não exibidos por privacidade.
        </li>
      </ul>
    </div>
  );
}
