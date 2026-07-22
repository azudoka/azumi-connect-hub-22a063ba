import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Mail, Phone, Linkedin, ExternalLink, Briefcase, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AZUMI_LOGO = "https://raw.githubusercontent.com/azudoka/azumi-connect-hub-oficial/main/public/azumi-logo.png";
const CONNECT_LOGO = "https://raw.githubusercontent.com/azudoka/azumi-connect-hub-oficial/main/public/connect-logo.png";

const GRAD = "linear-gradient(160deg, #14233F 0%, #264478 55%, #3D63B8 100%)";

// Placeholder — Patricia vai substituir pelos links reais
const SERVICOS = [
  { label: "Serviços para você", href: "https://azumirh.com.br" },
  { label: "Programa Impulso RH", href: "https://azumirh.com.br" },
  { label: "Gold Market", href: "https://azumirh.com.br" },
];

const DISC_INFO: Record<string, { nome: string; cor: string; desc: string }> = {
  D: { nome: "Executor", cor: "#EF4444", desc: "Direto, decidido e orientado a resultados. Gosta de desafios e age com velocidade." },
  I: { nome: "Comunicador", cor: "#F59E0B", desc: "Entusiasta, influente e sociável. Motiva pessoas e se destaca em colaboração." },
  S: { nome: "Planejador", cor: "#10B981", desc: "Estável, confiável e paciente. Valoriza harmonia e entrega consistência." },
  C: { nome: "Analista", cor: "#3B82F6", desc: "Preciso, criterioso e analítico. Foca em qualidade e toma decisões baseadas em dados." },
};

const ETAPA_LABEL: Record<string, string> = {
  recebido: "Recebido",
  triagem_inicial: "Triagem",
  questionario: "Questionário",
  entrevista_azumi: "Entrevista Azumi",
  teste_tecnico: "Teste Técnico",
  entrevista_cliente: "Entrevista com a empresa",
  proposta: "Proposta enviada",
  contratado: "Contratado",
  reprovado: "Não selecionado",
};

const ETAPA_COR: Record<string, string> = {
  recebido: "bg-slate-100 text-slate-600",
  triagem_inicial: "bg-blue-100 text-blue-700",
  questionario: "bg-violet-100 text-violet-700",
  entrevista_azumi: "bg-cyan-100 text-cyan-700",
  teste_tecnico: "bg-indigo-100 text-indigo-700",
  entrevista_cliente: "bg-amber-100 text-amber-700",
  proposta: "bg-emerald-100 text-emerald-700",
  contratado: "bg-green-100 text-green-800",
  reprovado: "bg-red-100 text-red-600",
};

interface DiscResultado {
  score_d: number;
  score_i: number;
  score_s: number;
  score_c: number;
  fator_predominante: string;
  fator_secundario: string | null;
}

interface Candidatura {
  id: string;
  etapa_azumi: string | null;
  banco_talentos: boolean;
  job_solicitations: { cargo: string; avulsa_empresa_nome: string | null } | null;
}

interface CandidatoData {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  cidade: string | null;
  escolaridade: string | null;
  linkedin: string | null;
  foto_url: string | null;
  cpf: string | null;
  interesses_setores: string[] | null;
  interesses_cargos: string[] | null;
  disc_resultado_candidato: DiscResultado[];
}

export default function MeuPerfilPage() {
  const { token } = useParams<{ token: string }>();
  const [candidato, setCandidato] = useState<CandidatoData | null>(null);
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const hadMidnight = html.classList.contains("theme-midnight");
    html.classList.remove("theme-midnight");
    return () => { if (hadMidnight) html.classList.add("theme-midnight"); };
  }, []);

  useEffect(() => {
    if (!token) { setErro(true); setLoading(false); return; }
    (async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("id, nome, email, telefone, cidade, escolaridade, linkedin, foto_url, cpf, interesses_setores, interesses_cargos, disc_resultado_candidato(score_d, score_i, score_s, score_c, fator_predominante, fator_secundario)")
        .eq("token_acesso_candidato" as any, token)
        .maybeSingle();

      if (error || !data) { setErro(true); setLoading(false); return; }
      const cand = data as unknown as CandidatoData;
      setCandidato(cand);

      // Buscar todas as candidaturas pelo CPF
      if (cand.cpf) {
        const { data: apps } = await supabase
          .from("candidates")
          .select("id, etapa_azumi, banco_talentos, job_solicitations(cargo, avulsa_empresa_nome)")
          .eq("cpf", cand.cpf)
          .order("id", { ascending: false });
        if (apps) setCandidaturas(apps as unknown as Candidatura[]);
      }

      setLoading(false);
    })();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: GRAD }}>
        <div className="h-8 w-8 rounded-full border-4 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  if (erro || !candidato) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: GRAD }}>
        <div className="text-center text-white px-6">
          <img src={AZUMI_LOGO} alt="Azumi" className="mx-auto mb-6" style={{ height: 36 }} />
          <h1 className="text-xl font-bold mb-2">Link não encontrado</h1>
          <p className="text-white/70 text-sm">Este link é inválido ou expirou. Verifique o e-mail recebido.</p>
        </div>
      </div>
    );
  }

  const disc = candidato.disc_resultado_candidato?.[0] ?? null;
  const discInfo = disc ? DISC_INFO[disc.fator_predominante] : null;
  const maxScore = disc ? Math.max(disc.score_d, disc.score_i, disc.score_s, disc.score_c, 1) : 1;
  const iniciais = candidato.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const candidaturasAtivas = candidaturas.filter(
    (c) => c.job_solicitations && c.etapa_azumi !== "reprovado"
  );
  const candidaturasEncerradas = candidaturas.filter(
    (c) => c.etapa_azumi === "reprovado" || c.etapa_azumi === "contratado"
  );
  const estaNoBanco = candidaturas.some((c) => c.banco_talentos);

  return (
    <div className="min-h-screen bg-[#F0F4FA]">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={AZUMI_LOGO} alt="Azumi RH" className="h-7" />
            <div className="hidden sm:block w-px h-5 bg-slate-200" />
            <img src={CONNECT_LOGO} alt="Connect" className="hidden sm:block h-7" />
          </div>
          <nav className="flex items-center gap-1">
            {SERVICOS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-[#264478] hover:bg-slate-50 transition-colors"
              >
                {s.label} <ExternalLink className="h-2.5 w-2.5" />
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div style={{ background: GRAD }} className="pb-16">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Foto */}
            <div className="relative shrink-0">
              {candidato.foto_url ? (
                <img
                  src={candidato.foto_url}
                  alt={candidato.nome}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-white/30 shadow-lg"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/30 shadow-lg">
                  <span className="text-2xl font-bold text-white">{iniciais}</span>
                </div>
              )}
              {discInfo && (
                <div
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                  style={{ background: discInfo.cor }}
                  title={`Perfil ${discInfo.nome}`}
                >
                  {disc!.fator_predominante}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-white text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">{candidato.nome}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-1 text-white/75 text-sm">
                {candidato.cidade && (
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{candidato.cidade}</span>
                )}
                {candidato.escolaridade && (
                  <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{candidato.escolaridade}</span>
                )}
                {candidato.linkedin && (
                  <a href={candidato.linkedin.startsWith("http") ? candidato.linkedin : `https://${candidato.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                    <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                  </a>
                )}
              </div>
              {estaNoBanco && (
                <span className="mt-2 inline-flex items-center gap-1 bg-white/20 text-white/90 rounded-full px-3 py-0.5 text-xs font-medium">
                  ✓ Banco de Talentos Azumi
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ── Coluna principal ─────── */}
          <div className="space-y-5">

            {/* Contato */}
            <Card title="Contato">
              <div className="flex flex-wrap gap-4">
                {candidato.email && (
                  <a href={`mailto:${candidato.email}`} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#264478]">
                    <Mail className="h-4 w-4 text-slate-400" /> {candidato.email}
                  </a>
                )}
                {candidato.telefone && (
                  <a href={`tel:${candidato.telefone}`} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#264478]">
                    <Phone className="h-4 w-4 text-slate-400" /> {candidato.telefone}
                  </a>
                )}
              </div>
            </Card>

            {/* Candidaturas ativas */}
            {candidaturasAtivas.length > 0 && (
              <Card title="Candidaturas em andamento">
                <div className="space-y-3">
                  {candidaturasAtivas.map((c) => {
                    const etapaLabel = ETAPA_LABEL[c.etapa_azumi ?? ""] ?? c.etapa_azumi ?? "Em processo";
                    const etapaCor = ETAPA_COR[c.etapa_azumi ?? ""] ?? "bg-slate-100 text-slate-600";
                    const js = c.job_solicitations;
                    const empresa = (js as any)?.avulsa_empresa_nome ?? null;
                    const cargo = (js as any)?.cargo ?? "Vaga";
                    return (
                      <div key={c.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-slate-800 truncate">{cargo}</p>
                          {empresa && <p className="text-xs text-slate-400 truncate">{empresa}</p>}
                        </div>
                        <span className={cn("shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full", etapaCor)}>
                          {etapaLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Candidaturas encerradas */}
            {candidaturasEncerradas.length > 0 && (
              <Card title="Histórico">
                <div className="space-y-3">
                  {candidaturasEncerradas.map((c) => {
                    const etapaLabel = ETAPA_LABEL[c.etapa_azumi ?? ""] ?? c.etapa_azumi ?? "";
                    const etapaCor = ETAPA_COR[c.etapa_azumi ?? ""] ?? "bg-slate-100 text-slate-600";
                    const js = c.job_solicitations;
                    const empresa = (js as any)?.avulsa_empresa_nome ?? null;
                    const cargo = (js as any)?.cargo ?? "Vaga";
                    return (
                      <div key={c.id} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-0 opacity-70">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-slate-700 truncate">{cargo}</p>
                          {empresa && <p className="text-xs text-slate-400 truncate">{empresa}</p>}
                        </div>
                        <span className={cn("shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full", etapaCor)}>
                          {etapaLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {candidaturasAtivas.length === 0 && candidaturasEncerradas.length === 0 && (
              <Card title="Candidaturas">
                <p className="text-sm text-slate-400">Você ainda não possui candidaturas registradas.</p>
              </Card>
            )}

            {/* Interesses */}
            {(candidato.interesses_setores?.length || candidato.interesses_cargos?.length) ? (
              <Card title="Interesses profissionais">
                {candidato.interesses_setores?.length ? (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-slate-500 mb-2">Setores</p>
                    <div className="flex flex-wrap gap-2">
                      {candidato.interesses_setores.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[#264478]/10 text-[#264478] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {candidato.interesses_cargos?.length ? (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-2">Cargos de interesse</p>
                    <div className="flex flex-wrap gap-2">
                      {candidato.interesses_cargos.map((c) => (
                        <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Card>
            ) : null}
          </div>

          {/* ── Coluna lateral ──────── */}
          <div className="space-y-5">

            {/* DISC card */}
            {disc && discInfo ? (
              <Card title="Perfil Comportamental DISC">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shrink-0"
                    style={{ background: discInfo.cor }}
                  >
                    {disc.fator_predominante}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{discInfo.nome}</p>
                    {disc.fator_secundario && (
                      <p className="text-xs text-slate-500">Secundário: {disc.fator_secundario}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{discInfo.desc}</p>
                {/* Barras */}
                <div className="space-y-2">
                  {(["D", "I", "S", "C"] as const).map((dim) => {
                    const score = dim === "D" ? disc.score_d : dim === "I" ? disc.score_i : dim === "S" ? disc.score_s : disc.score_c;
                    const pct = Math.round((score / maxScore) * 100);
                    const cor = DISC_INFO[dim].cor;
                    return (
                      <div key={dim} className="flex items-center gap-2">
                        <span className="text-xs font-bold w-4 shrink-0" style={{ color: cor }}>{dim}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cor }} />
                        </div>
                        <span className="text-xs text-slate-400 w-6 text-right shrink-0">{score}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ) : (
              <Card title="Perfil Comportamental DISC">
                <p className="text-sm text-slate-400">Você ainda não realizou o teste DISC. Fique de olho no seu e-mail!</p>
              </Card>
            )}

            {/* Serviços */}
            <div className="bg-gradient-to-br from-[#14233F] to-[#264478] rounded-2xl p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">Serviços Azumi</p>
              <div className="space-y-2">
                {SERVICOS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium hover:bg-white/20 transition-colors group"
                  >
                    <span>{s.label}</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-[#14233F] text-white/60 text-xs text-center py-5 px-4">
        <img src={AZUMI_LOGO} alt="Azumi RH" className="mx-auto mb-2" style={{ height: 24, opacity: 0.6 }} />
        CONNECT by Azumi RH · azumirh.com.br · contato@azumirh.com.br
      </footer>

    </div>
  );
}

// ── Primitivo Card ────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">{title}</h2>
      {children}
    </div>
  );
}
