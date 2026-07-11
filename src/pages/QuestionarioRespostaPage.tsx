import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AzumiLogo } from "@/components/brand/AzumiLogo";

type TipoPergunta = "texto_livre" | "multipla_escolha" | "escala_1_5";

interface Pergunta {
  id: string;
  ordem: number;
  texto: string;
  tipo: TipoPergunta;
  obrigatoria: boolean;
  opcoes?: string[];
}

export default function QuestionarioRespostaPage() {
  const { token } = useParams<{ token: string }>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [cq, setCq] = useState<any>(null);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    if (!token) { setErro("Link inválido."); setCarregando(false); return; }
    (async () => {
      const { data, error } = await supabase
        .from("candidate_questionnaires")
        .select("*, questionnaires(titulo, descricao, questionnaire_questions(*))")
        .eq("token", token)
        .maybeSingle();
      if (error || !data) {
        setErro("Questionário não encontrado ou link expirado.");
        setCarregando(false);
        return;
      }
      if (data.status === "respondido") { setConcluido(true); setCarregando(false); return; }
      setCq(data);
      const qs: Pergunta[] = ((data.questionnaires?.questionnaire_questions ?? []) as any[])
        .sort((a, b) => a.ordem - b.ordem)
        .map((p) => ({
          id: p.id,
          ordem: p.ordem,
          texto: p.texto,
          tipo: (p.tipo as TipoPergunta) ?? "texto_livre",
          obrigatoria: p.obrigatoria ?? true,
          opcoes: Array.isArray(p.opcoes) ? p.opcoes : undefined,
        }));
      setPerguntas(qs);
      // Pre-select first option for multipla_escolha
      const init: Record<string, string> = {};
      qs.forEach((p) => {
        if (p.tipo === "multipla_escolha" && p.opcoes?.length) {
          init[p.id] = p.opcoes[0];
        }
      });
      setRespostas(init);
      setCarregando(false);
    })();
  }, [token]);

  async function enviar() {
    const faltando = perguntas.filter((p) => p.obrigatoria && !respostas[p.id]?.trim());
    if (faltando.length > 0) {
      alert(`Responda todas as perguntas obrigatórias (${faltando.length} pendente${faltando.length > 1 ? "s" : ""}).`);
      return;
    }
    setEnviando(true);
    const { error: errAnswers } = await supabase.from("questionnaire_answers").insert(
      perguntas.map((p) => ({
        candidate_questionnaire_id: cq.id,
        question_id: p.id,
        resposta: respostas[p.id] ?? "",
      }))
    );
    if (!errAnswers) {
      await supabase
        .from("candidate_questionnaires")
        .update({ status: "respondido", respondido_em: new Date().toISOString() })
        .eq("id", cq.id);
      setConcluido(true);
    } else {
      alert("Erro ao enviar respostas. Tente novamente.");
    }
    setEnviando(false);
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
        <p className="text-slate-500 text-sm">Confira o link recebido ou entre em contato com a Azumi RH.</p>
      </div>
    );
  }

  if (concluido) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-3">
        <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl mb-2">✓</div>
        <h1 className="text-xl font-semibold text-slate-800">Obrigado!</h1>
        <p className="text-slate-600 text-sm max-w-sm">Suas respostas foram registradas com sucesso. Entraremos em contato em breve.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#F5F7FA" }} className="min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 flex justify-center">
          <AzumiLogo product="Connect" size={20} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-semibold text-slate-800">{cq.questionnaires?.titulo}</h1>
          {cq.questionnaires?.descricao && (
            <p className="text-sm text-slate-500 mt-1">{cq.questionnaires.descricao}</p>
          )}

          <div className="mt-6 space-y-6">
            {perguntas.map((p, idx) => (
              <div key={p.id}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {idx + 1}. {p.texto}{" "}
                  {p.obrigatoria && <span className="text-red-500">*</span>}
                </label>

                {p.tipo === "texto_livre" && (
                  <textarea
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    rows={3}
                    value={respostas[p.id] ?? ""}
                    onChange={(e) => setRespostas((prev) => ({ ...prev, [p.id]: e.target.value }))}
                  />
                )}

                {p.tipo === "multipla_escolha" && p.opcoes && (
                  <div className="space-y-2">
                    {p.opcoes.map((op) => (
                      <label key={op} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${p.id}`}
                          value={op}
                          checked={respostas[p.id] === op}
                          onChange={() => setRespostas((prev) => ({ ...prev, [p.id]: op }))}
                          className="h-4 w-4 accent-blue-600"
                        />
                        <span className="text-sm text-slate-700">{op}</span>
                      </label>
                    ))}
                  </div>
                )}

                {p.tipo === "escala_1_5" && (
                  <div className="flex gap-3 flex-wrap">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRespostas((prev) => ({ ...prev, [p.id]: String(n) }))}
                        className={`h-10 w-10 rounded-full border text-sm font-medium transition ${
                          respostas[p.id] === String(n)
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-300 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <span className="self-center text-xs text-slate-400 ml-1">1 = Discordo · 5 = Concordo</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={enviar}
            disabled={enviando}
            className="mt-8 w-full rounded-full bg-blue-600 text-white font-medium py-2.5 text-sm disabled:opacity-50 hover:bg-blue-700 transition"
          >
            {enviando ? "Enviando…" : "Enviar respostas"}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Azumi RH · azumirh.com.br
        </p>
      </div>
    </div>
  );
}
