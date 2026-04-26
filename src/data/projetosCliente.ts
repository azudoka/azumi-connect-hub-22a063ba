// Tipos compartilhados pelas páginas Projetos do cliente.

export type ComplexidadeKey = "C1" | "C2" | "C3";

export type EntregavelStatus =
  | "nao_iniciado"
  | "em_andamento"
  | "aprovacao_cliente"
  | "ajuste_solicitado"
  | "aprovado_cliente"
  | "cancelado";

export interface NpsRegistro {
  nota: number;
  comentario: string;
  data: string;
}

export interface EntregavelItem {
  id: string;
  codigo: string; // ENT-YYYY-XXXX
  nome: string;
  frente: string;
  complexidade: ComplexidadeKey;
  status: EntregavelStatus;
  prazo: string; // ISO
  subtarefas: number;
  tipoDocumento: boolean;
  aprovacaoEnviadaEm?: string; // ISO — origem do countdown 72h
  nps?: NpsRegistro;
  vinculadoDocsOficiais?: boolean;
  ajusteObservacao?: string;
}

export type ProjetoStatus =
  | "vigente"
  | "andamento"
  | "concluido"
  | "pausado";

export interface ProjetoCliente {
  id: string;
  codigo: string; // PROJ-YYYY-XXXX
  nome: string;
  empresaId: string;
  consultor: string;
  consultorIniciais: string;
  status: ProjetoStatus;
  frente: string;
  entregaveis: EntregavelItem[];
}

export interface CronogramaEntregavel {
  id: string;
  nome: string;
  frente: string;
  complexidade: ComplexidadeKey;
  prazo: string; // ISO
  tempoEstimado: string;
}

export interface CronogramaCliente {
  id: string;
  codigo: string; // CRON-YYYY-XXXX
  nome: string;
  empresaId: string;
  consultor: string;
  enviadoEm: string; // ISO
  alteracoesUsadas: number;
  status: "aguardando_aprovacao_cliente" | "ajuste_solicitado" | "aprovado";
  entregaveis: CronogramaEntregavel[];
}

// Helpers de tempo / formatação --------------------------------

export function formatPrazo(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function isPrazoVencido(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

/** Retorna minutos restantes do prazo de 72h a partir de aprovacaoEnviadaEm. */
export function minutosRestantesAprovacao(aprovacaoEnviadaEm?: string): number | null {
  if (!aprovacaoEnviadaEm) return null;
  const enviado = new Date(aprovacaoEnviadaEm).getTime();
  const fim = enviado + 72 * 60 * 60 * 1000;
  return Math.floor((fim - Date.now()) / (60 * 1000));
}

export function formatHoraMinuto(min: number): string {
  if (min <= 0) return "0h 0m";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

export const COMPLEX_PILL: Record<ComplexidadeKey, string> = {
  C1: "bg-info/15 text-info border-info/30",
  C2: "bg-violet/15 text-violet border-violet/30",
  C3: "bg-warning/15 text-warning border-warning/30",
};

export const ENT_STATUS_LABEL: Record<EntregavelStatus, string> = {
  nao_iniciado: "Não iniciado",
  em_andamento: "Em andamento",
  aprovacao_cliente: "Aguarda aprovação",
  ajuste_solicitado: "Ajuste solicitado",
  aprovado_cliente: "Aprovado",
  cancelado: "Cancelado",
};

export function entStatusPill(s: EntregavelStatus): string {
  switch (s) {
    case "aprovacao_cliente":
      return "bg-warning/15 text-warning border-warning/30";
    case "em_andamento":
      return "bg-info/15 text-info border-info/30";
    case "ajuste_solicitado":
      return "bg-destructive/15 text-destructive border-destructive/30";
    case "aprovado_cliente":
      return "bg-success/15 text-success border-success/30";
    case "cancelado":
      return "bg-muted text-muted-foreground border-border line-through";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
