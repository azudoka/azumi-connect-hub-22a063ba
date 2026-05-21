// =============================================================================
// MOCK DEMO DATA — exclusivo para o usuário trial (empresaId: "empresa-demo")
// =============================================================================
// Carregado apenas quando usuario.role === "trial".
// Todas as ações executadas no perfil trial são salvas em estado local
// (não afetam dados reais).
// =============================================================================

export const DEMO_EMPRESA_ID = "empresa-demo";

export interface DemoFilial {
  id: string;
  nome: string;
  cidade: string;
  uf: string;
  isMatriz: boolean;
}

export interface DemoEmpresa {
  id: string;
  nome: string;
  plano: "ongoing";
  horasMensais: number;
  filiais: string[];
  consultor: { nome: string; email: string };
}

export const empresaDemo: DemoEmpresa = {
  id: DEMO_EMPRESA_ID,
  nome: "Empresa Demo",
  plano: "ongoing",
  horasMensais: 40,
  filiais: ["Matriz SP"],
  consultor: { nome: "Ana Beatriz", email: "ana@azumirh.com.br" },
};

// ----- VAGAS ------------------------------------------------------------------
export interface DemoVaga {
  id: string;
  titulo: string;
  status: "andamento" | "finalizada";
  etapa: string;
  perfisEnviados: number;
}

export const vagasDemo: DemoVaga[] = [
  { id: "demo-v1", titulo: "Gerente de TI",         status: "andamento",  etapa: "Triagem",     perfisEnviados: 3 },
  { id: "demo-v2", titulo: "Analista de Marketing", status: "finalizada", etapa: "Contratado",  perfisEnviados: 1 },
];

// ----- CANDIDATOS (vinculados à vaga 1) --------------------------------------
export interface DemoCandidato {
  id: string;
  vagaId: string;
  nome: string;
  cargo: string;
  disc: { D: number; I: number; S: number; C: number };
}

export const candidatosDemo: DemoCandidato[] = [
  { id: "demo-c1", vagaId: "demo-v1", nome: "Pedro Alves",     cargo: "Dev Sênior",     disc: { D: 78, I: 42, S: 35, C: 60 } },
  { id: "demo-c2", vagaId: "demo-v1", nome: "Marina Costa",    cargo: "Analista de TI", disc: { D: 38, I: 82, S: 55, C: 42 } },
  { id: "demo-c3", vagaId: "demo-v1", nome: "Lucas Ferreira",  cargo: "Tech Lead",      disc: { D: 45, I: 30, S: 50, C: 88 } },
];

// ----- PROJETOS ---------------------------------------------------------------
export type DemoEntregavelStatus = "aprovado" | "aguardando_parecer" | "em_andamento";

export interface DemoEntregavel {
  id: string;
  titulo: string;
  status: DemoEntregavelStatus;
}

export interface DemoProjeto {
  id: string;
  nome: string;
  progresso: number;
  entregaveis: DemoEntregavel[];
}

export const projetosDemo: DemoProjeto[] = [
  {
    id: "demo-p1",
    nome: "Mapeamento de Cargos",
    progresso: 62,
    entregaveis: [
      { id: "demo-p1-e1", titulo: "Levantamento por área",      status: "aprovado" },
      { id: "demo-p1-e2", titulo: "Matriz de competências",     status: "aprovado" },
      { id: "demo-p1-e3", titulo: "Descrição de cargos — draft", status: "aguardando_parecer" },
      { id: "demo-p1-e4", titulo: "Faixas salariais",            status: "em_andamento" },
      { id: "demo-p1-e5", titulo: "Plano de carreira",           status: "em_andamento" },
      { id: "demo-p1-e6", titulo: "Política de promoções",       status: "em_andamento" },
      { id: "demo-p1-e7", titulo: "Comunicação interna",         status: "em_andamento" },
    ],
  },
  {
    id: "demo-p2",
    nome: "Política de Home Office",
    progresso: 40,
    entregaveis: [
      { id: "demo-p2-e1", titulo: "Diagnóstico atual",     status: "aprovado" },
      { id: "demo-p2-e2", titulo: "Minuta de política",    status: "em_andamento" },
      { id: "demo-p2-e3", titulo: "Plano de implantação",  status: "em_andamento" },
    ],
  },
];

// ----- SOLICITAÇÕES -----------------------------------------------------------
export interface DemoSolicitacao {
  id: string;
  codigo: string;
  titulo: string;
  tipo: string;
  status: "aberta" | "andamento" | "aguardando_cliente" | "finalizada" | "cancelada";
  criadaEm: string;
  descricao?: string;
}

export const solicitacoesDemo: DemoSolicitacao[] = [
  { id: "demo-s1", codigo: "SOL-DEMO-001", titulo: "Revisão de política de home office", tipo: "duvida",       status: "andamento",  criadaEm: "2026-05-05", descricao: "Atualizar regras e elegibilidade." },
  { id: "demo-s2", codigo: "SOL-DEMO-002", titulo: "Mapeamento de cargos Q1",            tipo: "duvida",       status: "finalizada", criadaEm: "2026-01-20", descricao: "Mapeamento concluído e entregue." },
  { id: "demo-s3", codigo: "SOL-DEMO-003", titulo: "Pesquisa de clima",                  tipo: "endomarketing", status: "cancelada", criadaEm: "2026-04-02", descricao: "Pausada a pedido do cliente." },
];

// ----- COMUNICADOS ------------------------------------------------------------
export interface DemoComunicado {
  id: string;
  titulo: string;
  resumo: string;
  data: string;
  tipo: "atualizacao" | "aviso" | "endomarketing" | "alerta" | "evento";
}

export const comunicadosDemo: DemoComunicado[] = [
  { id: "demo-cm1", titulo: "Bem-vindo à demonstração Azumi!",        resumo: "Explore livremente — nada aqui afeta dados reais.", data: "2026-05-01", tipo: "endomarketing" },
  { id: "demo-cm2", titulo: "Relatório HRaaS — Abril 2026 publicado", resumo: "Indicadores e resumo de ações.",                    data: "2026-05-05", tipo: "atualizacao" },
  { id: "demo-cm3", titulo: "Reunião de alinhamento mensal",          resumo: "Detalhes por e-mail.",                              data: "2026-05-12", tipo: "aviso" },
];

// ----- EVENTOS DE CALENDÁRIO --------------------------------------------------
export type DemoEventoTipo = "reuniao" | "prazo" | "entrevista" | "comunicado" | "ferias" | "feriado";

export interface DemoEvento {
  id: string;
  titulo: string;
  data: string; // ISO
  hora?: string;
  tipo: DemoEventoTipo;
}

function isoMesAtual(dia: number, hora?: string) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), dia);
  if (hora) {
    const [h, m] = hora.split(":").map(Number);
    d.setHours(h, m, 0, 0);
  }
  return d.toISOString();
}

export const eventosDemo: DemoEvento[] = [
  { id: "demo-ev1", titulo: "Reunião de alinhamento mensal", data: isoMesAtual(14, "09:00"), hora: "09:00", tipo: "reuniao" },
  { id: "demo-ev2", titulo: "Prazo — Relatório HRaaS",       data: isoMesAtual(5),                          tipo: "prazo" },
  { id: "demo-ev3", titulo: "Entrevista — Dev Pleno",        data: isoMesAtual(20, "14:30"), hora: "14:30", tipo: "entrevista" },
  { id: "demo-ev4", titulo: "Wellbeing Day",                 data: isoMesAtual(28, "09:00"), hora: "09:00", tipo: "comunicado" },
];
