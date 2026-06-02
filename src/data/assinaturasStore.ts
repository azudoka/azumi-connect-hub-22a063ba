// B01 — Persistência de assinaturas/ciências em localStorage.
// Mantém o estado entre reloads/sessões enquanto não há backend.

type Escopo = "cliente-doc" | "hub-politica";

const STORAGE_KEY = "azumi:assinaturas:v1";

type Registro = {
  escopo: Escopo;
  userId: string;
  itemId: string;
  data: string; // ISO
};

type Store = Record<string, Registro>; // chave = `${escopo}:${userId}:${itemId}`

function chave(escopo: Escopo, userId: string, itemId: string) {
  return `${escopo}:${userId}:${itemId}`;
}

function ler(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : {};
  } catch {
    return {};
  }
}

function escrever(store: Store) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("azumi:assinaturas:changed"));
  } catch {
    /* noop */
  }
}

export function isAssinado(escopo: Escopo, userId: string, itemId: string): boolean {
  if (!userId) return false;
  return !!ler()[chave(escopo, userId, itemId)];
}

export function assinar(escopo: Escopo, userId: string, itemId: string): Registro {
  const store = ler();
  const k = chave(escopo, userId, itemId);
  const registro: Registro =
    store[k] ?? { escopo, userId, itemId, data: new Date().toISOString() };
  store[k] = registro;
  escrever(store);
  return registro;
}

export function listarAssinados(escopo: Escopo, userId: string): Set<string> {
  const result = new Set<string>();
  const store = ler();
  for (const k of Object.keys(store)) {
    const r = store[k];
    if (r.escopo === escopo && r.userId === userId) result.add(r.itemId);
  }
  return result;
}

export function subscribeAssinaturas(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("azumi:assinaturas:changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("azumi:assinaturas:changed", handler);
    window.removeEventListener("storage", handler);
  };
}
