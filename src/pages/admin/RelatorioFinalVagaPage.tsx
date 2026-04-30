import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, CheckCircle2, Clock, Star, Users, Briefcase, Calendar } from "lucide-react";
import { toast } from "sonner";
import { vagas, candidatos } from "@/data/mock";
import {
  contratadosNaVaga,
  listarPropostas,
  listarNpsDaVaga,
  mediaNpsDaVaga,
  marcarRelatorioFinalGerado,
  subscribePropostas,
} from "@/data/propostaStore";
import { listarAgendamentosDaVaga, getParecerGestor } from "@/data/entrevistaGestorStore";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";

/**
 * Relatório Final de Encerramento da vaga.
 * Acessível em /app/atracao/:id/relatorio-final.
 * Otimizado para impressão (window.print).
 */
export default function RelatorioFinalVagaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vaga = vagas.find((v) => v.id === id) ?? vagas[0];

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const off = subscribePropostas(() => setTick((v) => v + 1));
    return () => { off(); };
  }, []);
  void tick;

  // Marca como gerado na primeira vez que abrir
  useEffect(() => {
    marcarRelatorioFinalGerado(vaga.id);
  }, [vaga.id]);

  const posicoesVaga: number = (vaga as unknown as { posicoes?: number }).posicoes ?? 1;
  const idsContratados = contratadosNaVaga(vaga.id);
  const propostas = listarPropostas(vaga.id);
  const agendamentos = listarAgendamentosDaVaga(vaga.id);
  const npsLista = listarNpsDaVaga(vaga.id);
  const mediaNps = mediaNpsDaVaga(vaga.id);

  const contratados = useMemo(
    () => idsContratados.map((cid) => {
      const cand = candidatos.find((c) => c.id === cid);
      const prop = propostas.find((p) => p.candidatoId === cid && p.status === "aceita");
      return { cand, prop };
    }).filter((x) => !!x.cand),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vaga.id, tick]
  );

  // Cronologia (mock derivada): abertura, primeira proposta, contratação, encerramento.
  const cronologia = useMemo(() => {
    const items: { label: string; data: string; icon: React.ElementType }[] = [];
    items.push({ label: "Vaga aberta", data: "—", icon: Briefcase });
    const primeiraProposta = [...propostas].sort((a, b) => a.enviadaEm.localeCompare(b.enviadaEm))[0];
    if (primeiraProposta) {
      items.push({ label: "Primeira proposta enviada", data: new Date(primeiraProposta.enviadaEm).toLocaleString("pt-BR"), icon: Clock });
    }
    propostas.filter((p) => p.status === "aceita").forEach((p) => {
      const cand = candidatos.find((c) => c.id === p.candidatoId);
      items.push({
        label: `Contratação confirmada — ${cand?.nome ?? p.candidatoId}`,
        data: p.respostaEm ? new Date(p.respostaEm).toLocaleString("pt-BR") : "—",
        icon: CheckCircle2,
      });
    });
    if (idsContratados.length >= posicoesVaga) {
      items.push({ label: "Vaga encerrada", data: new Date().toLocaleString("pt-BR"), icon: CheckCircle2 });
    }
    return items;
  }, [propostas, idsContratados, posicoesVaga]);

  // Tempo médio por etapa (mock simples — usa contagem de agendamentos / propostas)
  const temposEtapa: { etapa: string; valor: string }[] = [
    { etapa: "Triagem inicial", valor: "≈ 5 dias" },
    { etapa: "Entrevista Azumi", valor: "≈ 3 dias" },
    { etapa: "Entrevista com gestor", valor: agendamentos.length > 0 ? "≈ 4 dias" : "—" },
    { etapa: "Proposta → resposta", valor: propostas.length > 0 ? "≈ 1 dia" : "—" },
  ];

  return (
    <div className="max-w-4xl mx-auto print:max-w-full">
      {/* Cabeçalho — escondido na impressão */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <Link to={`/app/atracao/${vaga.id}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar para a vaga
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="h-9 px-3 rounded-lg border border-border hover:bg-secondary text-sm inline-flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" /> Imprimir / Salvar PDF
          </button>
          <button
            onClick={() => toast.success("Relatório exportado (mock).")}
            className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm inline-flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" /> Exportar
          </button>
        </div>
      </div>

      {/* Folha do relatório */}
      <article className="bg-card border border-border rounded-xl p-8 print:border-0 print:shadow-none print:p-0 space-y-8">
        {/* Cabeçalho */}
        <header className="border-b border-border pb-5">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">
            Relatório Final de Encerramento
          </div>
          <h1 className="text-2xl font-display font-bold">{vaga.titulo}</h1>
          <div className="text-sm text-muted-foreground mt-1">
            {vaga.empresa} · Posições: {idsContratados.length}/{posicoesVaga} preenchidas
          </div>
          <div className="mt-3 inline-flex items-center gap-2">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
              idsContratados.length >= posicoesVaga
                ? "bg-success/15 text-success border-success/30"
                : "bg-warning/15 text-warning border-warning/30"
            )}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              {idsContratados.length >= posicoesVaga ? "Vaga encerrada" : "Vaga em andamento"}
            </span>
            <span className="text-[11px] text-muted-foreground font-data">
              Gerado em {new Date().toLocaleString("pt-BR")}
            </span>
          </div>
        </header>

        {/* Sumário em 4 caixas */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Cartao label="Contratados" valor={`${idsContratados.length}`} icon={Users} />
          <Cartao label="Propostas enviadas" valor={`${propostas.length}`} icon={Briefcase} />
          <Cartao label="Entrevistas com gestor" valor={`${agendamentos.length}`} icon={Calendar} />
          <Cartao
            label="NPS médio"
            valor={mediaNps !== null ? mediaNps.toFixed(1) : "—"}
            sub={mediaNps !== null ? `${npsLista.length} avaliação(ões)` : undefined}
            icon={Star}
          />
        </section>

        {/* Candidatos contratados */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Candidatos contratados
          </h2>
          {contratados.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">Nenhum candidato contratado até o momento.</div>
          ) : (
            <ul className="space-y-3">
              {contratados.map(({ cand, prop }) => {
                if (!cand) return null;
                const nps = npsLista.find((n) => n.candidatoId === cand.id);
                return (
                  <li key={cand.id} className="border border-border rounded-lg p-4 bg-background/40">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-semibold">{cand.nome}</div>
                        <div className="text-xs text-muted-foreground">{cand.cargo}</div>
                      </div>
                      {prop && (
                        <div className="text-right text-xs">
                          <div className="text-muted-foreground">Contratado em</div>
                          <div className="font-data">
                            {prop.respostaEm ? new Date(prop.respostaEm).toLocaleDateString("pt-BR") : "—"}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-xs">
                      {prop && (
                        <>
                          <Info label="Modalidade" v={prop.tipo} />
                          <Info label="Remuneração" v={prop.remuneracao} />
                          <Info label="Início" v={prop.dataInicio} />
                          <Info label="Canal" v={prop.canal} />
                        </>
                      )}
                    </div>
                    {nps && (
                      <div className="mt-3 pt-3 border-t border-border flex items-center gap-3 flex-wrap">
                        <div className="text-xs text-muted-foreground">NPS do cliente:</div>
                        <StarRating value={nps.nota} readonly size={16} />
                        <span className="text-xs font-data">{nps.nota}/5</span>
                        {nps.justificativa && (
                          <div className="basis-full text-xs italic text-muted-foreground mt-1">
                            "{nps.justificativa}"
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Cronologia */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Cronologia da vaga
          </h2>
          <ol className="relative border-l-2 border-border pl-5 space-y-3">
            {cronologia.map((c, i) => {
              const Icon = c.icon;
              return (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-0.5 h-4 w-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <Icon className="h-2.5 w-2.5 text-primary" />
                  </span>
                  <div className="text-sm">{c.label}</div>
                  <div className="text-[11px] text-muted-foreground font-data">{c.data}</div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Tempo médio por etapa */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Tempo médio por etapa
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {temposEtapa.map((t) => (
              <div key={t.etapa} className="rounded-lg border border-border p-3 text-center bg-background/40">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.etapa}</div>
                <div className="text-lg font-semibold mt-1 font-data">{t.valor}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Equipe envolvida */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Equipe envolvida
          </h2>
          <div className="text-sm">
            <div><strong>Consultor responsável:</strong> Ana Beatriz</div>
            <div className="text-muted-foreground"><strong>Cliente:</strong> {vaga.empresa}</div>
          </div>
        </section>

        <footer className="text-[10px] text-muted-foreground text-center pt-4 border-t border-border">
          Documento gerado automaticamente pela Azumi Connect · {new Date().toLocaleDateString("pt-BR")}
        </footer>
      </article>
    </div>
  );
}

function Cartao({ label, valor, sub, icon: Icon }: { label: string; valor: string; sub?: string; icon: React.ElementType }) {
  return (
    <div className="rounded-lg border border-border p-3 bg-background/40">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold mt-1 font-data">{valor}</div>
      {sub && <div className="text-[10px] text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

function Info({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{v}</div>
    </div>
  );
}
