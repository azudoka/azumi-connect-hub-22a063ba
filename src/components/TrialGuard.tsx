import { useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UpgradePlanoModal } from "@/components/UpgradePlanoModal";

/** Páginas liberadas para usuários em modo trial. */
const TRIAL_ROTAS_LIBERADAS = [
  "/cliente/dashboard",
  "/cliente/projetos",
  "/cliente/solicitacoes",
  "/cliente/atracao",
  "/cliente/documentos",
  "/cliente/comunicados",
  "/cliente/calendario",
];

function rotaLiberada(path: string): boolean {
  return TRIAL_ROTAS_LIBERADAS.some((base) => path === base || path.startsWith(base + "/"));
}

export function TrialGuard({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const { pathname } = useLocation();
  const [openUpgrade, setOpenUpgrade] = useState(false);

  if (usuario?.role !== "trial") return <>{children}</>;
  if (rotaLiberada(pathname)) return <>{children}</>;

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <div
        className="bg-card border border-border rounded-2xl p-10 text-center max-w-md w-full shadow-sm"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        <div className="inline-flex h-14 w-14 rounded-full bg-[#EDE9FE] items-center justify-center mb-5">
          <Lock className="h-6 w-6 text-[#8B5CF6]" />
        </div>
        <h2 className="text-lg font-bold mb-2 text-foreground">Área bloqueada no trial</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Esta área não está disponível no seu acesso trial.
        </p>
        <button
          type="button"
          onClick={() => setOpenUpgrade(true)}
          className="inline-flex items-center justify-center h-11 px-6 rounded-lg text-sm font-semibold text-white hover:opacity-95 transition-opacity"
          style={{ background: "#8B5CF6" }}
        >
          Falar com a Azumi
        </button>
      </div>

      <UpgradePlanoModal
        open={openUpgrade}
        onClose={() => setOpenUpgrade(false)}
        planoAtual={usuario.plano ?? "trial"}
      />
    </div>
  );
}

export default TrialGuard;
