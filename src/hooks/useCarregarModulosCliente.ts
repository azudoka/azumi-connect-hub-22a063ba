import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useModulos } from "@/context/ModulesContext";
import { carregarConfigCliente } from "@/services/modulosCliente";
import { CONFIG_DEFAULT } from "@/config/modules";

// TODO: quando Auth real existir, substituir por usuario.empresaId (uuid).
// Por enquanto todos os usuários mock compartilham a config 'demo' no Supabase.
const CLIENTE_DEMO_ID = "demo";

/**
 * Carrega a config de módulos do cliente logado ao montar/trocar usuário.
 * Deve ser usado dentro de <AuthProvider> e <ModulesProvider>.
 *
 * Ao fazer logout (usuario = null) reseta para CONFIG_DEFAULT.
 */
export function useCarregarModulosCliente() {
  const { usuario } = useAuth();
  const { setConfig } = useModulos();

  useEffect(() => {
    if (!usuario) {
      setConfig(CONFIG_DEFAULT);
      return;
    }

    // TODO: substituir por usuario.empresaId quando Auth real estiver conectado.
    const clienteId = CLIENTE_DEMO_ID;

    let cancelado = false;

    carregarConfigCliente(clienteId).then((config) => {
      if (!cancelado) setConfig(config);
    });

    return () => {
      cancelado = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id]);
}
