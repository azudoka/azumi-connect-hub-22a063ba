# Azumi Brand Assets

## Nomenclatura esperada (subir com estes nomes exatos)

### Connect (tons de azul)

| Arquivo                   | Uso                                              |
|---------------------------|--------------------------------------------------|
| `connect-icone-claro.png` | Ícone (só símbolo), para usar em fundo claro     |
| `connect-icone-escuro.png`| Ícone (só símbolo), para usar em fundo escuro    |
| `connect-logo-claro.png`  | Logo completo (símbolo + texto), fundo claro     |
| `connect-logo-escuro.png` | Logo completo (símbolo + texto), fundo escuro    |

### Hub (tons de roxo/rosa)

| Arquivo              | Uso                                                   |
|----------------------|-------------------------------------------------------|
| `hub-icone-claro.png`| Ícone Hub, versão para fundo claro                    |
| `hub-icone-rosa.png` | Ícone Hub, versão colorida (rosa/roxo) — padrão       |
| `hub-logo-branco.png`| Logo completo Hub, texto branco (fundo escuro)        |
| `hub-logo-preto.png` | Logo completo Hub, texto preto (fundo claro)          |
| `hub-logo-rosa.png`  | Logo completo Hub, versão colorida                    |

### Outros

| Arquivo          | Uso                             |
|------------------|---------------------------------|
| `capa-vagas.png` | Banner hero da página de vagas  |

---

## Arquivos atuais (fallback enquanto os novos não chegam)

Os arquivos abaixo existem no repo e são usados como fallback até os
arquivos acima serem adicionados:

- `connect-logo.png` / `connect-logo-light.png` → fallback connect logo
- `connect-icon.png` → fallback connect ícone
- `hub-logo.png` / `hub-logo-light.png` → fallback hub logo
- `hub-icon.png` → fallback hub ícone

Quando os arquivos novos chegarem, rodar `git mv` para renomear os
antigos ou simplesmente adicionar os novos com os nomes corretos acima.
O `AzumiLogo.tsx` já tem os imports preparados como comentário — basta
descomentar e apagar os imports antigos.

## Prop `light` em `<AzumiLogo>`

- `light={false}` → versão clara (fundo claro da página)
- `light={true}` → versão escura/clara pra fundo escuro (sidebar azul/roxa)
