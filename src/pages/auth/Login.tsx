import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, Sparkles } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("voce@azumi.com");
  const [pass, setPass] = useState("••••••••");

  return (
    <div className="min-h-full w-full relative bg-background overflow-hidden flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-highlight/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 rounded-xl bg-gradient-brand items-center justify-center font-logo font-bold text-white text-xl shadow-violet">
            A
          </div>
          <h1 className="mt-4 font-logo text-3xl font-bold">
            Azumi <span className="text-gradient-brand">Connect</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Plataforma de RH as a Service da Azumi Consultoria
          </p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); navigate("/selecao-perfil"); }}
          className="bg-card/80 backdrop-blur border border-border rounded-2xl p-6 shadow-elevated space-y-4"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground">E-mail corporativo</label>
            <div className="mt-1.5 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-secondary border border-input focus:border-primary outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Senha</label>
              <button type="button" className="text-xs text-primary hover:underline">Esqueci minha senha</button>
            </div>
            <div className="mt-1.5 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                type="password"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-secondary border border-input focus:border-primary outline-none text-sm font-data"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-lg bg-gradient-brand text-white font-medium font-ui flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-violet"
          >
            Entrar
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="text-center">
            <button type="button" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Acesso SSO da empresa
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ao continuar você concorda com os <a className="text-primary hover:underline">termos</a> e a <a className="text-primary hover:underline">política de privacidade</a>.
        </p>
      </div>
    </div>
  );
}
