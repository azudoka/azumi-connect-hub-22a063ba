// Arquivos atuais (fallback enquanto os novos não chegam)
import connectLogo from "@/assets/brand/connect-logo.png";
import connectLogoLight from "@/assets/brand/connect-logo-light.png";
import connectIcon from "@/assets/brand/connect-icon.png";
import hubLogo from "@/assets/brand/hub-logo.png";
import hubLogoLight from "@/assets/brand/hub-logo-light.png";
import hubIcon from "@/assets/brand/hub-icon.png";

// Quando os arquivos novos chegarem, substituir pelos imports abaixo:
// import connectLogoClaro from "@/assets/brand/connect-logo-claro.png";
// import connectLogoEscuro from "@/assets/brand/connect-logo-escuro.png";
// import connectIconeClaro from "@/assets/brand/connect-icone-claro.png";
// import connectIconeEscuro from "@/assets/brand/connect-icone-escuro.png";
// import hubLogoPreto from "@/assets/brand/hub-logo-preto.png";
// import hubLogoBranco from "@/assets/brand/hub-logo-branco.png";
// import hubLogoRosa from "@/assets/brand/hub-logo-rosa.png";
// import hubIconeClaro from "@/assets/brand/hub-icone-claro.png";
// import hubIconeRosa from "@/assets/brand/hub-icone-rosa.png";

interface AzumiMarkProps {
  size?: number;
  className?: string;
}

/** SVG mark mantido para uso standalone se necessário. */
export function AzumiMark({ size = 28, className }: AzumiMarkProps) {
  const id = `azumi-mark-grad-${size}`;
  const r = size / 2;
  const overlap = size * 0.25;
  const totalW = size * 2 - overlap;
  return (
    <svg
      width={totalW}
      height={size}
      viewBox={`0 0 ${totalW} ${size}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#034C8B" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <circle cx={r} cy={r} r={r} fill={`url(#${id})`} opacity="0.9" />
      <circle cx={totalW - r} cy={r} r={r} fill={`url(#${id})`} opacity="0.7" />
    </svg>
  );
}

interface AzumiLogoProps {
  product?: "Connect" | "Hub";
  /** true = logo sobre fundo escuro (usa variante light/branca) */
  light?: boolean;
  collapsed?: boolean;
  size?: number;
  /** reservado para compatibilidade — sem efeito com logos PNG */
  hideSubtitle?: boolean;
}

export function AzumiLogo({
  product = "Connect",
  light = false,
  collapsed = false,
  size = 22,
}: AzumiLogoProps) {
  if (collapsed) {
    const icon = product === "Hub" ? hubIcon : connectIcon;
    const glowColor = product === "Hub" ? "#A78BFA" : "#60A5FA";
    return (
      <div className="relative flex items-center justify-center" style={{ height: size + 22, width: size + 22 }}>
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40"
          style={{ background: glowColor }}
        />
        <img
          src={icon}
          alt={product}
          style={{ height: size + 18, width: size + 18, objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}
          className="relative z-10"
        />
      </div>
    );
  }
  const src =
    product === "Hub"
      ? light ? hubLogoLight : hubLogo
      : light ? connectLogoLight : connectLogo;
  return (
    <img
      src={src}
      alt={`${product} by Azumi`}
      style={{ height: size * 3.4, width: "auto", objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}
    />
  );
}
