import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { SectionDivider } from "@/components/SectionDivider";
import { useIsMobile } from "@/hooks/use-mobile";
import { Briefcase, UserPlus, Wallet, Users } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const evolucaoCusto = [
  { mes: "Nov", v: 1320 },
  { mes: "Dez", v: 1410 },
  { mes: "Jan", v: 1380 },
  { mes: "Fev", v: 1430 },
  { mes: "Mar", v: 1456 },
  { mes: "Abr", v: 1462 },
];

const distribuicao = [
  { name: "Folha", value: 68, color: "hsl(var(--primary))" },
  { name: "Benefícios", value: 14, color: "hsl(var(--highlight))" },
  { name: "Treinamento", value: 6, color: "hsl(var(--info))" },
  { name: "Recrutamento", value: 8, color: "hsl(var(--warning))" },
  { name: "Outros", value: 4, color: "hsl(var(--muted-foreground))" },
];

const fmtMilhoes = (n: number) => `R$ ${(n / 1000).toFixed(2)}M`;

export default function CeoFinanceiro() {
  const isMobile = useIsMobile();
  const budgetPct = 92;

  return (
    <div>
      <PageHeader
        title="Financeiro de RH"
        subtitle="Folha, benefícios, ROI e budget consolidados."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Custo total (mês)"
          value="R$ 1,46M"
          icon={Wallet}
          hint="Folha + encargos + benefícios"
        />
        <KpiCard
          label="Custo médio por colaborador"
          value="R$ 8.420"
          icon={Users}
          trend={{ value: "+2.1%", positive: false }}
        />
        <KpiCard
          label="Custo por contratação"
          value="R$ 4.180"
          icon={UserPlus}
          trend={{ value: "-12%", positive: true }}
        />
        <div className="col-span-2 lg:col-span-1 bg-card border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Budget realizado
              </p>
              <p className="mt-2 font-data text-2xl font-semibold tabular-nums">{budgetPct}%</p>
            </div>
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-brand"
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] font-data text-muted-foreground">
            <span>R$ 1,46M</span>
            <span>R$ 1,59M</span>
          </div>
        </div>
      </div>

      <SectionDivider>Evolução de custo</SectionDivider>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Custo de pessoal — últimos 6 meses</h3>
          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoCusto}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickFormatter={fmtMilhoes}
                />
                <Tooltip
                  formatter={(v: number) => fmtMilhoes(v)}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(var(--highlight))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Distribuição por categoria</h3>
          <div style={{ height: isMobile ? 220 : 288 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicao}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={isMobile ? 70 : 100}
                  innerRadius={isMobile ? 40 : 55}
                  paddingAngle={2}
                >
                  {distribuicao.map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) => `${v}%`}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
