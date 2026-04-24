import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { SectionDivider } from "@/components/SectionDivider";
import { Users, Heart, GraduationCap, MessagesSquare } from "lucide-react";

export default function LiderPainel() {
  return (
    <div>
      <PageHeader title="Painel do líder" subtitle="Acompanhe seu time de perto" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Time" value={12} icon={Users} hint="colaboradores ativos" />
        <KpiCard label="Humor médio" value="4.1" icon={Heart} trend={{ value: "+0.2", positive: true }} />
        <KpiCard label="Treinamentos" value="78%" icon={GraduationCap} hint="conclusão" />
        <KpiCard label="Solicitações" value={3} icon={MessagesSquare} hint="abertas" />
      </div>

      <SectionDivider>Seu time</SectionDivider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {["Marina Costa", "Pedro Alves", "Lucas Ferreira", "Beatriz Lins", "Rafa Mendes", "Ju Lima"].map((n) => (
          <div key={n} className="bg-card border border-border rounded-xl p-4 card-hover flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-semibold text-white">
              {n.split(" ").map(p => p[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{n}</div>
              <div className="text-xs text-muted-foreground">Operações · há 1 ano</div>
            </div>
            <span className="badge-pill bg-success/15 text-success border-success/30">😊 4.5</span>
          </div>
        ))}
      </div>
    </div>
  );
}
