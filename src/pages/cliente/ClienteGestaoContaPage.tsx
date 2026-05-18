import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import {
  CreditCard, FileText, Receipt, Users, Check, Clock as ClockIcon,
  AlertTriangle, Boxes, FlaskConical, XCircle, Loader2, ChevronRight,
  BarChart3, MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useModulos } from "@/context/ModulesContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { ModuloId } from "@/config/modules";

type InvoiceStatus = "pendente" | "pago" | "atrasado" | "cancelado";

type Invoice = {
  id: string;
  reference_month: string | null;
  amount: number;
  due_date: string;
  boleto_url?: string | null;
  status: InvoiceStatus;
  paid_at?: string | null;
};

type UserProfile = {
  id: string;
  nome: string | null;
  email: string | null;
  role: string | null;
};

type ReportSummary = {
  id: string;
  title: string | null;
  month_ref: string | null;
  status: string;
  published_at: string | null;
};

type Empresa = {
  id: string;
  nome: string;
  monthly_hours: number | null;
};

const STATUS_FATURA: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  pago:      { label: "Pago",      cls: "bg-success/15 text-success border-success/30",             icon: Check },
  pendente:  { label: "Em aberto", cls: "bg-warning/15 text-warning border-warning/30",             icon: ClockIcon },
  atrasado:  { label: "Atrasado",  cls: "bg-destructive/15 text-destructive border-destructive/30", icon: AlertTriangle },
  cancelado: { label: "Cancelado", cls: "bg-muted text-muted-foreground border-border",             icon: XCircle },
};

const MODULO_LABELS: Record<ModuloId, string> = {
  hub_wiki:           "Hub Wiki — Políticas, Guias, Treinamentos",
  hub_comunicacao:    "Hub Comunicação — Mural e Comunicados",
  hub_pessoas:        "Hub Pessoas — Termômetro, Benefícios, Onboarding",
  hub_dp:             "Hub DP — Holerites e Férias",
  atracao:            "Atração & Hunting",
  performance:        "Performance e Avaliações",
  governanca:         "Governança",
  regulamentacao:     "Regulamentação",
  engenharia_pessoas: "Engenharia de Pessoas",
  endomarketing:      "Endomarketing",
  dp:                 "Departamento Pessoal",
  contabilidade:      "Contabilidade",
  juridico:           "Jurídico",
};

function formatarDataBr(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = iso.split("T")[0];
  const [ano, mes, dia] = date.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarMesRef(ref: string | null): string {
  if (!ref) return "—";
  if (/^\d{4}-\d{2}$/.test(ref)) {
    const [ano, mes] = ref.split("-");
    const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    return `${meses[parseInt(mes, 10) - 1] ?? mes}/${ano}`;
  }
  return ref;
}

function formatarValor(val: number): string {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ClienteGestaoContaPage() {
  const { config, isEmTrial, diasRestantesTrial } = useModulos();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!usuario?.empresaNome) { setLoading(false); return; }
    setLoading(true);
    try {
      const { data: emp } = await supabase
        .from("empresas")
        .select("id, nome, monthly_hours")
        .ilike("nome", usuario.empresaNome)
        .single();

      if (!emp) { setLoading(false); return; }
      setEmpresa(emp as Empresa);

      const empresaId = (emp as Empresa).id;

      const [{ data: invData }, { data: usersData }, { data: repsData }] = await Promise.all([
        supabase
          .from("invoices")
          .select("id, reference_month, amount, due_date, boleto_url, status, paid_at")
          .eq("empresa_id", empresaId)
          .order("due_date", { ascending: false })
          .limit(12),
        supabase
          .from("users_profile")
          .select("id, nome, email, role")
          .eq("company_id", empresaId),
        supabase
          .from("monthly_reports")
          .select("id, title, month_ref, status, published_at")
          .eq("company_id", empresaId)
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3),
      ]);

      setInvoices((invData ?? []) as Invoice[]);
      setUsers((usersData ?? []) as UserProfile[]);
      setReports((repsData ?? []) as ReportSummary[]);
    } catch {
      // silent — empty states shown below
    } finally {
      setLoading(false);
    }
  }, [usuario?.empresaNome]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const ultimaFatura = invoices[0];
  const valorMensal = ultimaFatura ? formatarValor(ultimaFatura.amount) + " / mês" : "—";

  return (
    <div>
      <PageHeader
        title="Gestão da conta"
        subtitle="Plano, faturamento, contratos e usuários da sua conta com a Azumi."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Plano */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Plano contratado</h3>
              <p className="text-xs text-muted-foreground">Detalhes da sua assinatura atual.</p>
            </div>
          </div>
          {empresa ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Empresa</div>
                <div className="font-medium">{empresa.nome}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Ciclo</div>
                <div className="font-medium">Mensal</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Horas contratadas</div>
                <div className="font-medium font-data">
                  {empresa.monthly_hours != null ? `${empresa.monthly_hours}h / mês` : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Valor referência</div>
                <div className="font-medium font-data">{valorMensal}</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Dados do plano não disponíveis.</p>
          )}
        </div>

        {/* Contratos */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Contratos</h3>
              <p className="text-xs text-muted-foreground">Documentos firmados com a Azumi.</p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-secondary/20 px-4 py-5 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Para acessar ou solicitar documentos contratuais, entre em contato com seu consultor Azumi.
            </p>
            <a
              href="https://wa.me/5511999999999?text=Ol%C3%A1%2C+preciso+de+acesso+a+contratos+da+minha+conta+Azumi."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-400/30 text-emerald-600 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Falar com consultor
            </a>
          </div>
        </div>
      </div>

      {/* Faturamento */}
      <div className="bg-card border border-border rounded-2xl shadow-card p-5 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Faturamento</h3>
            <p className="text-xs text-muted-foreground">Faturas recentes da sua conta.</p>
          </div>
        </div>
        {invoices.length === 0 ? (
          <div className="rounded-xl border border-border bg-secondary/20 px-4 py-6 text-center text-sm text-muted-foreground">
            Nenhuma fatura registrada ainda.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Período</th>
                  <th className="text-right font-medium px-4 py-3">Valor</th>
                  <th className="text-left font-medium px-4 py-3">Vencimento</th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-left font-medium px-4 py-3">Boleto</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((f) => {
                  const s = STATUS_FATURA[f.status] ?? STATUS_FATURA.pendente;
                  return (
                    <tr key={f.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{formatarMesRef(f.reference_month)}</td>
                      <td className="px-4 py-3 text-right font-data">{formatarValor(f.amount)}</td>
                      <td className="px-4 py-3 font-data">{formatarDataBr(f.due_date)}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", s.cls)}>
                          <s.icon className="h-3 w-3" /> {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {f.boleto_url ? (
                          <a
                            href={f.boleto_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Ver boleto
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Usuários */}
      <div className="bg-card border border-border rounded-2xl shadow-card p-5 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Usuários da conta</h3>
            <p className="text-xs text-muted-foreground">
              Pessoas com acesso ao painel de {empresa?.nome ?? "sua empresa"}.
            </p>
          </div>
        </div>
        {users.length === 0 ? (
          <div className="rounded-xl border border-border bg-secondary/20 px-4 py-6 text-center text-sm text-muted-foreground">
            Nenhum usuário encontrado para esta empresa.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Nome</th>
                  <th className="text-left font-medium px-4 py-3">E-mail</th>
                  <th className="text-left font-medium px-4 py-3">Papel</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{u.nome ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border">
                        {u.role ?? "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Relatórios Mensais */}
      <div className="bg-card border border-border rounded-2xl shadow-card p-5 mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold">Relatórios Mensais</h3>
              <p className="text-xs text-muted-foreground">Últimos relatórios publicados pela Azumi.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/cliente/relatorios")}
            className="text-xs text-primary hover:underline inline-flex items-center gap-1 shrink-0"
          >
            Ver todos <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        {reports.length === 0 ? (
          <div className="rounded-xl border border-border bg-secondary/20 px-4 py-6 text-center text-sm text-muted-foreground">
            Nenhum relatório publicado ainda.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {reports.map((r) => (
              <li key={r.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{r.title ?? formatarMesRef(r.month_ref)}</div>
                  {r.published_at && (
                    <div className="text-xs text-muted-foreground font-data">
                      Publicado em {formatarDataBr(r.published_at)}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/app/relatorios/${r.id}/documento`)}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  Ver <ChevronRight className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Módulos contratados e em teste */}
      <div className="bg-card border border-border rounded-2xl shadow-card p-5 mt-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold">Módulos contratados e em teste</h3>
            <p className="text-xs text-muted-foreground">Situação atual de cada módulo do Hub para sua empresa.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {config.modulos.map((m) => {
            const emTrial  = isEmTrial(m.id);
            const dias     = diasRestantesTrial(m.id);
            const label    = MODULO_LABELS[m.id] ?? m.id;

            let statusLabel: string;
            let statusCls: string;
            let StatusIcon: React.ElementType;

            if (m.ativo) {
              statusLabel = "Ativo";
              statusCls   = "bg-success/15 text-success border-success/30";
              StatusIcon  = Check;
            } else if (emTrial) {
              statusLabel = `Em teste${dias !== null ? ` · ${dias}d` : ""}`;
              statusCls   = "bg-amber-500/15 text-amber-600 border-amber-400/30";
              StatusIcon  = FlaskConical;
            } else {
              statusLabel = "Inativo";
              statusCls   = "bg-muted text-muted-foreground border-border";
              StatusIcon  = XCircle;
            }

            return (
              <div key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 bg-secondary/20">
                <span className="text-sm font-medium truncate">{label}</span>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", statusCls)}>
                    <StatusIcon className="h-3 w-3" /> {statusLabel}
                  </span>
                  {emTrial && m.testeInicio && m.testeFim && (
                    <span className="text-[10px] text-muted-foreground font-data">
                      {formatarDataBr(m.testeInicio)} → {formatarDataBr(m.testeFim)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
