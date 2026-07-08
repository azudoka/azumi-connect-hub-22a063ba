export interface EmpresaMockInfo {
  nome: string;
  consultor: string;
  consultorIniciais: string;
  consultorEmail: string;
  hubContratado: boolean;
}

export const empresasMockById: Record<string, EmpresaMockInfo> = {
  kentaki: {
    nome: "Kentaki Foods",
    consultor: "Ana Beatriz",
    consultorIniciais: "AB",
    consultorEmail: "ana.beatriz@azumirh.com.br",
    hubContratado: true,
  },
  horizonte: {
    nome: "Horizonte",
    consultor: "Rafael Moura",
    consultorIniciais: "RM",
    consultorEmail: "rafael.moura@azumirh.com.br",
    hubContratado: false,
  },
  vitasaude: {
    nome: "Vita Saúde",
    consultor: "Juliana Costa",
    consultorIniciais: "JC",
    consultorEmail: "juliana.costa@azumirh.com.br",
    hubContratado: true,
  },
  valore: {
    nome: "Valore Consultoria",
    consultor: "Ana Beatriz",
    consultorIniciais: "AB",
    consultorEmail: "ana.beatriz@azumirh.com.br",
    hubContratado: true,
  },
  startupy: {
    nome: "Startupy",
    consultor: "Rafael Moura",
    consultorIniciais: "RM",
    consultorEmail: "rafael.moura@azumirh.com.br",
    hubContratado: false,
  },
};
