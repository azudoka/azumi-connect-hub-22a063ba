import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { SectionDivider } from "@/components/SectionDivider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DeptRow {
  dept: string;
  atual: number;
  meta: number;
  variacao: number;
}

const departamentos: DeptRow[] = [
  { dept: "Operações", atual: 48, meta: 50, variacao: 2 },
  { dept: "Tecnologia", atual: 36, meta: 40, variacao: 3 },
  { dept: "Comercial", atual: 28, meta: 30, variacao: -2 },
  { dept: "Pessoas & Cultura", atual: 12, meta: 12, variacao: 0 },
  { dept: "Financeiro", atual: 14, meta: 14, variacao: 1 },
  { dept: "Marketing", atual: 18, meta: 20, variacao: -1 },
  { dept: "Customer Success", atual: 17, meta: 18, variacao: 0 },
];

const evolucao = [
  { mes: "Nov", n: 158 },
  { mes: "Dez", n: 162 },
  { mes: "Jan", n: 165 },
  { mes: "Fev", n: 168 },
  { mes: "Mar", n: 170 },
  { mes: "Abr", n: 173 },
];

export default function CeoHeadcount() {
  const [filtro, setFiltro] = useState<string>("todos");

  const linhas = useMemo(
    () => (filtro === "todos" ? departamentos : departamentos.filter((d) => d.dept === filtro)),
    [filtro],
  );

  const total = departamentos.reduce((s, d) => s + d.atual, 0);

  return (
    <div>
      <PageHeader
        title="Headcount"
        subtitle="Visão consolidada por departamento e evolução mensal."
        actions={
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-full md:w-[220px] rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os departamentos</SelectItem>
              {departamentos.map((d) => (
                <SelectItem key={d.dept} value={d.dept}>
                  {d.dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Total de colaboradores" value={total} icon={Users} />
        <KpiCard label="Admissões no mês" value={9} icon={UserPlus} trend={{ value: "+2", positive: true }} />
        <KpiCard label="Desligamentos no mês" value={4} icon={UserMinus} />
        <KpiCard label="Vagas abertas" value={11} icon={Briefcase} />
      </div>

      <SectionDivider>Departamentos</SectionDivider>

      {/* Desktop / tablet table */}
      <div className="hidden md:block bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left font-semibold px-5 py-3">Departamento</th>
              <th className="text-right font-semibold px-5 py-3">Atual</th>
              <th className="text-right font-semibold px-5 py-3">Meta</th>
              <th className="text-right font-semibold px-5 py-3">Variação</th>
              <th className="text-right font-semibold px-5 py-3">Ocupação</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((d) => {
              const ocup = Math.round((d.atual / d.meta) * 100);
              return (
                <tr key={d.dept} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{d.dept}</td>
                  <td className="px-5 py-3 text-right font-data">{d.atual}</td>
                  <td className="px-5 py-3 text-right font-data text-muted-foreground">{d.meta}</td>
                  <td className="px-5 py-3 text-right">
                    <Variacao v={d.variacao} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-brand"
                          style={{ width: `${Math.min(ocup, 100)}%` }}
                        />
                      </div>
                      <span className="font-data text-xs w-9 text-right">{ocup}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="md:hidden space-y-3">
        {linhas.map((d) => {
          const ocup = Math.round((d.atual / d.meta) * 100);
          return (
            <li
              key={d.dept}
              className="bg-card border border-border rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">{d.dept}</div>
                <Variacao v={d.variacao} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Atual</div>
                  <div className="font-data text-base">{d.atual}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Meta</div>
                  <div className="font-data text-base">{d.meta}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Ocupação</span>
                  <span className="font-data">{ocup}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-brand"
                    style={{ width: `${Math.min(ocup, 100)}%` }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <SectionDivider>Evolução mensal</SectionDivider>

      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-card">
        <h3 className="font-display font-semibold mb-4">Headcount nos últimos 6 meses</h3>
        <div className="h-56 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evolucao}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="n" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Variacao({ v }: { v: number }) {
  if (v === 0) {
    return (
      <span className="badge-pill bg-muted text-muted-foreground border-border">
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
        0
      </span>
    );
  }
  const positive = v > 0;
  return (
    <span
      className={cn(
        "badge-pill",
        positive
          ? "bg-success/15 text-success border-success/30"
          : "bg-destructive/15 text-destructive border-destructive/30",
      )}
    >
      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {positive ? "+" : ""}
      {v}
    </span>
  );
}
