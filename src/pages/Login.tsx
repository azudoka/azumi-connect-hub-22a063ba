import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function destinoParaPapel(papel: string): string {
  if (papel === "admin" || papel === "consultor") return "/app/dashboard";
  if (papel === "cliente" || papel === "cliente_avulso") return "/portal";
  return "/hub/colaborador/inicio";
}

export default function Login() {
  const navigate = useNavigate();
  const { usuario, carregando, login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!carregando && usuario) {
      navigate(destinoParaPapel(usuario.role), { replace: true });
    }
  }, [usuario, carregando, navigate]);

  if (carregando) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    const resultado = await login(email.trim(), senha);
    setEnviando(false);
    if (resultado === "inativo") {
      setErro("Sua conta está inativa. Entre em contato com o administrador.");
    } else if (resultado === "erro") {
      setErro("E-mail ou senha incorretos.");
    }
    // "ok" → useEffect acima redireciona
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Azumi RH</h1>
            <p className="mt-1 text-sm text-muted-foreground">Plataforma de gestão</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={enviando}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                disabled={enviando}
              />
            </div>

            {erro && (
              <p className="text-sm text-destructive text-center">{erro}</p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={enviando}>
              {enviando ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
