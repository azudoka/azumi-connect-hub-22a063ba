# Azumi Brand Assets

Coloque os arquivos de marca nesta pasta. O `AzumiLogo.tsx` detecta automaticamente os arquivos quando presentes.

## Arquivos esperados

| Arquivo              | Uso                                      |
|----------------------|------------------------------------------|
| `logo-full.svg`      | Logo completo (marca + wordmark), light  |
| `logo-full-dark.svg` | Logo completo, variante dark/white       |
| `logo-mark.svg`      | Só a marca (círculos), para collapsed    |
| `logo-full.png`      | Fallback PNG (2× — mínimo 400 × 120 px) |
| `logo-mark.png`      | Fallback PNG da marca (2× — mínimo 80 × 80 px) |

## Como ativar no componente

Em `src/components/brand/AzumiLogo.tsx`, substitua o bloco de fallback SVG:

```tsx
// Descomente após colocar os arquivos:
// import logoFull from "@/assets/brand/logo-full.svg";
// import logoMark from "@/assets/brand/logo-mark.svg";
```

## Especificações (Brand Kit v2.3)

- Gradiente principal: `#034C8B → #3B82F6 → #8B5CF6` (azul oceano → azul elétrico → violeta)
- Safe zone: 16 px em volta da marca em todos os lados
- Fundo branco ou `hsl(220 35% 98%)` para variante light; fundo transparente para variante dark
