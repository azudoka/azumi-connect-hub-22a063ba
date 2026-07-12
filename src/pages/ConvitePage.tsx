import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, ChevronRight, Loader2, UserCheck, RotateCcw } from "lucide-react";
import DiscTeste from "@/components/disc/DiscTeste";
import type { DiscDim, DiscScores } from "@/components/disc/discQuestions";
import { supabase } from "@/integrations/supabase/client";
import { AzumiLogo } from "@/components/brand/AzumiLogo";

const EMAIL_API = "https://azumi-email-api.vercel.app/api/send-email";

type TipoPergunta = "texto_livre" | "multipla_escolha" | "escala_1_5";

interface Pergunta {
  id: string;
  ordem: number;
  texto: string;
  tipo: TipoPergunta;
  obrigatoria: boolean;
  opcoes?: string[];
}

interface Convite {
  id: string;
  job_id: string;
  questionnaire_id: string | null;
  status: string;
}

const ESCOLARIDADES = [
  "Ensino Fundamental", "Ensino Médio", "Técnico/Tecnólogo",
  "Superior incompleto", "Superior completo", "Pós-graduação/MBA", "Mestrado/Doutorado",
];

interface Cadastro {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  escolaridade: string;
  aceitePrivacidade: boolean;
}

const INIT: Cadastro = {
  nome: "", email: "", telefone: "", cpf: "", escolaridade: "", aceitePrivacidade: false,
};

interface CandidatoEncontrado {
  nome: string;
  email: string;
  telefone: string;
  escolaridade: string | null;
}

export default function ConvitePage() {
  const { token } = useParams<{ token: string }>();

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [jaRespondido, setJaRespondido] = useState(false);
  const [convite, setConvite] = useState<Convite | null>(null);
  const [jobTitulo, setJobTitulo] = useState("Vaga");
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);

  const [step, setStep] = useState<1 | 2 | 3 | "ok">(1);
  const [c, setC] = useState<Cadastro>(INIT);
  const [erroForm, setErroForm] = useState("");
  const [discScores, setDiscScores] = useState<DiscScores | null>(null);
  const [discPerfil, setDiscPerfil] = useState<DiscDim | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  // CPF lookup
  const [candidatoEncontrado, setCandidatoEncontrado] = useState<CandidatoEncontrado | null>(null);
  const [mostrarBannerCpf, setMostrarBannerCpf] = useState(false);
  const cpfBuscadoRef = useRef<string>("");

  useEffect(() => {
    if (!token) { setErro("Link inválido."); setCarregando(false); return; }
    (async () => {
      const { data: cqData, error: cqError } = await supabase
        .from("candidate_questionnaires")
        .select("id, job_id, questionnaire_id, status")
        .eq("token", token)
        .maybeSingle();

      if (cqError || !cqData) { setErro("Convite não encontrado ou expirado."); setCarregando(false); return; }
      if (cqData.status === "respondido") { setJaRespondido(true); setCarregando(false); return; }

      setConvite(cqData as Convite);

      const { data: jobData } = await supabase
        .from("job_solicitations")
        .select("titulo")
        .eq("id", cqData.job_id)
        .maybeSingle();
      if (jobData?.titulo) setJobTitulo(jobData.titulo);

      if (cqData.questionnaire_id) {
        const { data: questData } = await supabase
          .from("questionnaires")
          .select("*, questionnaire_questions(*)")
          .eq("id", cqData.questionnaire_id)
          .maybeSingle();
        if (questData) {
          const qs: Pergunta[] = ((questData.questionnaire_questions ?? []) as any[])
            .sort((a, b) => a.ordem - b.ordem)
            .map((p) => ({
              id: p.id, ordem: p.ordem, texto: p.texto,
              tipo: (p.tipo as TipoPergunta) ?? "texto_livre",
              obrigatoria: p.obrigatoria ?? true,
              opcoes: Array.isArray(p.opcoes) ? p.opcoes : undefined,
            }));
          setPerguntas(qs);
          const init: Record<string, string> = {};
          qs.forEach((p) => { if (p.tipo === "multipla_escolha" && p.opcoes?.length) init[p.id] = p.opcoes[0]; });
          setRespostas(init);
        }
      }

      setCarregando(false);
    })();
  }, [token]);

  function up<K extends keyof Cadastro>(k: K, v: Cadastro[K]) {
    setC((p) => ({ ...p, [k]: v }));
  }

  async function buscarPorCpf() {
    const cpfTrimmed = c.cpf.trim();
    if (!cpfTrimmed || cpfTrimmed === cpfBuscadoRef.current) return;
    cpfBuscadoRef.current = cpfTrimmed;

    const { data } = await supabase
      .from("candidates")
      .select("nome, email, telefone, escolaridade")
      .eq("cpf", cpfTrimmed)
      .limit(1)
      .maybeSingle();

    if (data) {
      setCandidatoEncontrado(data as CandidatoEncontrado);
      setMostrarBannerCpf(true);
    }
  }

  function reaproveitarDados() {
    if (!candidatoEncontrado) return;
    setC((p) => ({
      ...p,
      nome: candidatoEncontrado.nome || p.nome,
      email: candidatoEncontrado.email || p.email,
      telefone: candidatoEncontrado.telefone || p.telefone,
      escolaridade: candidatoEncontrado.escolaridade || p.escolaridade,
    }));
    setMostrarBannerCpf(false);
  }

  function validarStep1(): string {
    if (!c.nome.trim()) return "Informe seu nome completo.";
    if (!c.email.trim()) return "Informe o email.";
    if (!c.telefone.trim()) return "Informe o telefone.";
    if (!c.cpf.trim()) return "Informe o CPF.";
    if (!c.aceitePrivacidade) return "Aceite a Política de Privacidade para continuar.";
    return "";
  }

  function avancarStep1() {
    const msg = validarStep1();
    if (msg) { setErroForm(msg); return; }
    setErroForm("");
    setStep(2);
  }

  function aoCompletarDisc(scores: DiscScores, perfil: DiscDim) {
    setDiscScores(scores);
    setDiscPerfil(perfil);
    if (convite?.questionnaire_id && perguntas.length > 0) {
      setStep(3);
    } else {
      concluir(scores, perfil, {});
    }
  }

  function validarQuestionario(): string {
    const faltando = perguntas.filter((p) => p.obrigatoria && !respostas[p.id]?.trim());
    if (faltando.length > 0) return `Responda todas as perguntas obrigatórias (${faltando.length} pendente${faltando.length > 1 ? "s" : ""}).`;
    return "";
  }

  async function concluir(scores: DiscScores, perfil: DiscDim, resps: Record<string, string>) {
    if (!convite) return;
    setEnviando(true);

    const { data: cand, error: candErr } = await supabase
      .from("candidates")
      .insert({
        job_id: convite.job_id,
        nome: c.nome,
        email: c.email,
        telefone: c.telefone,
        cpf: c.cpf || null,
        escolaridade: c.escolaridade || null,
        origem: "convite",
        banco_talentos: false,
        etapa_azumi: "recebido",
        lgpd_aceite: c.aceitePrivacidade,
        lgpd_aceite_at: c.aceitePrivacidade ? new Date().toISOString() : null,
      })
      .select("id")
      .single();

    if (candErr || !cand) {
      console.error("[convite] candidato:", candErr?.message);
      setEnviando(false);
      return;
    }

    const entries = (["D", "I", "S", "C"] as const).map((k) => ({ k, v: scores[k] })).sort((a, b) => b.v - a.v);
    await supabase.from("disc_resultado_candidato").insert({
      candidato_id: cand.id,
      score_d: scores.D, score_i: scores.I, score_s: scores.S, score_c: scores.C,
      fator_predominante: perfil,
      fator_secundario: entries[1]?.k ?? null,
    });

    await supabase.from("candidate_questionnaires").update({
      candidate_id: cand.id,
      status: "respondido",
      respondido_em: new Date().toISOString(),
    }).eq("token", token!);

    if (convite.questionnaire_id && perguntas.length > 0) {
      await supabase.from("questionnaire_answers").insert(
        perguntas.map((p) => ({
          candidate_questionnaire_id: convite.id,
          question_id: p.id,
          resposta: resps[p.id] ?? "",
        }))
      );
    }

    fetch(EMAIL_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `Nova candidatura (convite): ${c.nome} → ${jobTitulo}`,
        html: `<h2 style="color:#031D38">Nova candidatura via convite</h2>
          <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px">
            <tr><td><strong>Vaga</strong></td><td>${jobTitulo}</td></tr>
            <tr><td><strong>Nome</strong></td><td>${c.nome}</td></tr>
            <tr><td><strong>Email</strong></td><td>${c.email}</td></tr>
            <tr><td><strong>Telefone</strong></td><td>${c.telefone}</td></tr>
            <tr><td><strong>DISC</strong></td><td>D:${scores.D} I:${scores.I} S:${scores.S} C:${scores.C} — ${perfil}</td></tr>
          </table>`,
      }),
    }).catch(() => {});

    setEnviando(false);
    setStep("ok");
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-sm">
        Carregando…
      </div>
    );
  }
  if (erro) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-3">
        <p className="text-slate-700 font-medium">{erro}</p>
        <p className="text-slate-500 text-sm">Entre em contato com a Azumi RH se acredita que isso é um erro.</p>
      </div>
    );
  }
  if (jaRespondido) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-3">
        <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl mb-1">✓</div>
        <h1 className="text-lg font-semibold text-slate-800">Você já respondeu este convite.</h1>
        <p className="text-slate-500 text-sm">Entraremos em contato em breve.</p>
      </div>
    );
  }

  const temQuestionario = !!convite?.questionnaire_id && perguntas.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto bg-black/70 sm:items-center sm:p-6">
      <div className="relative flex w-full max-w-4xl flex-col bg-card sm:my-6 sm:max-h-[calc(100vh-3rem)] sm:rounded-2xl">
        {enviando && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-card/90">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="font-sans text-sm text-muted-foreground">Enviando candidatura…</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-[hsl(var(--ocean))] px-6 py-4 text-white sm:rounded-t-2xl">
          <div className="min-w-0">
            <p className="font-sans text-xs uppercase tracking-wider text-white/70">Candidatura</p>
            <h2 className="truncate font-display text-base font-semibold">{jobTitulo}</h2>
          </div>
          <AzumiLogo product="Connect" light size={20} hideSubtitle />
        </div>

        {/* Stepper */}
        {step !== "ok" && (
          <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-6 py-3">
            <StepItem n={1} label="Cadastro" active={step === 1} done={step > 1} />
            <div className="h-px flex-1 bg-border" />
            <StepItem n={2} label="Perfil DISC" active={step === 2} done={step > 2} />
            {temQuestionario && (
              <>
                <div className="h-px flex-1 bg-border" />
                <StepItem n={3} label="Questionário" active={step === 3} done={false} />
              </>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* ── Step 1: Dados ─────────────────────────────────── */}
          {step === 1 && (
            <div className="mx-auto max-w-2xl space-y-5">

              {/* Banner CPF encontrado */}
              {mostrarBannerCpf && candidatoEncontrado && (
                <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 shrink-0 text-primary" />
                    <p className="font-sans text-sm font-medium text-foreground">
                      Encontramos um cadastro anterior com este CPF.
                    </p>
                  </div>
                  <p className="font-sans text-xs text-muted-foreground">
                    Deseja reaproveitar os dados de <strong>{candidatoEncontrado.nome}</strong>?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={reaproveitarDados}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-sans text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <UserCheck className="h-3.5 w-3.5" /> Reaproveitar dados
                    </button>
                    <button
                      type="button"
                      onClick={() => setMostrarBannerCpf(false)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-sans text-xs font-medium text-foreground hover:bg-muted"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Preencher do zero
                    </button>
                  </div>
                </div>
              )}

              <Grid2>
                <Field label="Nome completo *"><FInput value={c.nome} onChange={(v) => up("nome", v)} /></Field>
                <Field label="Email *"><FInput type="email" value={c.email} onChange={(v) => up("email", v)} /></Field>
              </Grid2>
              <Grid2>
                <Field label="Telefone *"><FInput value={c.telefone} onChange={(v) => up("telefone", v)} placeholder="(00) 00000-0000" /></Field>
                <Field label="CPF *">
                  <FInput
                    value={c.cpf}
                    onChange={(v) => { up("cpf", v); setMostrarBannerCpf(false); cpfBuscadoRef.current = ""; }}
                    placeholder="000.000.000-00"
                    onBlur={buscarPorCpf}
                  />
                </Field>
              </Grid2>

              <Field label="Escolaridade (opcional)">
                <FSelect value={c.escolaridade} onChange={(v) => up("escolaridade", v)}>
                  <option value="">Selecione...</option>
                  {ESCOLARIDADES.map((e) => <option key={e} value={e}>{e}</option>)}
                </FSelect>
              </Field>

              <label className="flex items-start gap-2 font-sans text-xs text-foreground">
                <input type="checkbox" checked={c.aceitePrivacidade} onChange={(e) => up("aceitePrivacidade", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border" />
                <span>Li e aceito a <a className="underline" href="https://azumirh.com.br/privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a>. Autorizo o tratamento dos meus dados pela Azumi RH para fins de recrutamento, em conformidade com a LGPD.</span>
              </label>

              {erroForm && <p className="font-sans text-sm text-destructive">{erroForm}</p>}
              <div className="flex justify-end pt-2">
                <button type="button" onClick={avancarStep1} className="btn-primary">
                  Próximo <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: DISC ──────────────────────────────────── */}
          {step === 2 && (
            <div className="mx-auto max-w-2xl">
              <DiscTeste candidateName={c.nome || "Candidato"} onComplete={aoCompletarDisc} />
            </div>
          )}

          {/* ── Step 3: Questionário ──────────────────────────── */}
          {step === 3 && (
            <div className="mx-auto max-w-2xl space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">Questionário</h3>
                <p className="font-sans text-sm text-muted-foreground">Responda as perguntas abaixo para concluir sua candidatura.</p>
              </div>
              {perguntas.map((p, idx) => (
                <div key={p.id}>
                  <label className="block font-sans text-sm font-medium text-foreground mb-2">
                    {idx + 1}. {p.texto} {p.obrigatoria && <span className="text-destructive">*</span>}
                  </label>
                  {p.tipo === "texto_livre" && (
                    <textarea rows={3} value={respostas[p.id] ?? ""}
                      onChange={(e) => setRespostas((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-sans text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  )}
                  {p.tipo === "multipla_escolha" && p.opcoes && (
                    <div className="space-y-2">
                      {p.opcoes.map((op) => (
                        <label key={op} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name={`q-${p.id}`} value={op}
                            checked={respostas[p.id] === op}
                            onChange={() => setRespostas((prev) => ({ ...prev, [p.id]: op }))}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="font-sans text-sm text-foreground">{op}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {p.tipo === "escala_1_5" && (
                    <div className="flex gap-3 flex-wrap items-center">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button"
                          onClick={() => setRespostas((prev) => ({ ...prev, [p.id]: String(n) }))}
                          className={`h-10 w-10 rounded-full border text-sm font-medium transition ${respostas[p.id] === String(n) ? "bg-primary border-primary text-primary-foreground" : "border-border text-foreground hover:bg-muted"}`}
                        >{n}</button>
                      ))}
                      <span className="font-sans text-xs text-muted-foreground">1 = Discordo · 5 = Concordo</span>
                    </div>
                  )}
                </div>
              ))}
              {erroForm && <p className="font-sans text-sm text-destructive">{erroForm}</p>}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const msg = validarQuestionario();
                    if (msg) { setErroForm(msg); return; }
                    setErroForm("");
                    concluir(discScores!, discPerfil!, respostas);
                  }}
                  className="btn-primary"
                >
                  Concluir candidatura <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── OK ────────────────────────────────────────────── */}
          {step === "ok" && (
            <div className="mx-auto max-w-md py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--success)/0.15)] text-success">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">Candidatura enviada!</h3>
              <p className="mt-2 font-sans text-sm text-muted-foreground">Entraremos em contato em breve. Obrigado!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepItem({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex h-7 w-7 items-center justify-center rounded-full font-sans text-xs font-semibold ${done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {done ? <Check className="h-4 w-4" /> : n}
      </div>
      <span className={`font-sans text-sm font-medium ${active || done ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1 block font-sans text-xs font-medium text-foreground">{label}</label>{children}</div>;
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function FInput({ value, onChange, type = "text", placeholder, onBlur }: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string; onBlur?: () => void;
}) {
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-sans text-sm text-foreground focus:border-primary focus:outline-none" />
  );
}

function FSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 font-sans text-sm text-foreground focus:border-primary focus:outline-none">
      {children}
    </select>
  );
}
