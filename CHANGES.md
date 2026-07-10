# CHANGES

Histórico de iterações do loop de análise.

## Iteração 1 — 2026-05-22

### Implementado
- **`<head>` polish em `index.html`**: 8 meta tags adicionadas
  - `theme-color="#121110"` — barra do navegador mobile funde com o fundo da página
  - `color-scheme="dark"` — informa ao navegador que a UI nativa (scrollbars, controles) deve usar tema escuro
  - `og:type`, `og:title`, `og:description`, `og:locale="pt_BR"`, `og:locale:alternate="en_US"`
  - `twitter:card="summary"`

**Justificativa**: maior impacto visual por linha de código — em mobile, elimina o contraste jarring entre a chrome do navegador e a página, preservando a estética cinematográfica. Em compartilhamentos sociais, o link agora renderiza preview consistente em PT/EN.

**Risco**: zero (puramente aditivo em `<head>`, sem efeito em layout/JS).

### Descartado nesta iteração
- `og:url` / `<link rel="canonical">`: requer domínio final, fora do escopo.
- `og:image`: requer asset dedicado (1200×630), fora do escopo "tag-only".
- Demais tasks da fila: postergadas para próximas iterações.

### Pendente (priorizado)
1. **`prefers-reduced-motion`** — desativar `@keyframes surface` fade-up para usuários sensíveis a movimento. Impacto médio, esforço pequeno.
2. **CSS dead code** — `style.css` tem `padding-top: 2rem` sobrescrito por `padding-top: 3rem` na mesma regra em `@media (max-height: 820px) and (min-width: 861px)`. Impacto baixo, esforço tiny.
3. **README desatualizado** — ainda menciona "Catppuccin Mocha" e GitHub `leonamduarte`. Impacto médio, esforço pequeno.
4. **`.gitignore`** — não cobre `.playwright-mcp/` e `.claude/scheduled_tasks.lock` (artefatos da sessão). Impacto médio, esforço tiny.
5. **`aria-label="Primary"`** — label de nav em inglês numa página pt-br; deveria ser localizado. Impacto baixo, esforço pequeno.

### Decisão de continuidade
**CONTINUAR** — restam 5 tasks de impacto real (médio/baixo) e risco baixo. Loop agendado em `*/5 * * * *` continua atacando a fila.

---

## Iteração 2 — 2026-05-22

### Implementado
- **`@media (prefers-reduced-motion: reduce)` em `style.css`** (logo após `@keyframes surface`):
  - `.layout { animation: none }` — desliga o fade-up de carregamento
  - `.links a, .project { transition-property: color, background-color }` — remove transição de `padding-left`, deixando o hover indent instantâneo (sem animação posicional), mas mantém transições de cor.

**Justificativa**: alinhamento direto com o brief original ("design for focus, not stimulation", "avoid excessive animations") e a11y win real para usuários com sensibilidade vestibular. Cor continua transicionando para preservar feedback visual.

**Risco**: zero (`@media` adicional, não afeta nada quando a preferência não está ativa).

### Validação
- Regra `@media (prefers-reduced-motion: reduce)` confirmada via inspeção do stylesheet em runtime: 2 declarações parseadas corretamente pelo browser.
- `.grain` overlay reanalisado: background estático, não viola reduced-motion. Nenhum problema emergente.

### Descartado nesta iteração
- Sobrescrever globalmente `transition-duration: 0` em todos os elementos: heavy-handed; remove flicker de cor desejado.
- Disable do hover indent COMO STYLE (vs como animation): manteria a interação visual sem movimento, mas exige mais ifs e nega o feedback espacial; preferi manter o indent como style estático.

### Pendente (priorizado)
1. **CSS dead code** — `padding-top: 2rem` sobrescrito por `padding-top: 3rem` em `@media (max-height: 820px) and (min-width: 861px)`. Impacto baixo, esforço tiny.
2. **README desatualizado** — menciona "Catppuccin Mocha" e GitHub `leonamduarte`. Impacto médio, esforço pequeno.
3. **`.gitignore`** — não cobre `.playwright-mcp/` e `.claude/scheduled_tasks.lock`. Impacto médio, esforço tiny.
4. **`aria-label="Primary"`** — label em inglês na página pt-br. Impacto baixo, esforço pequeno.

### Decisão de continuidade
**CONTINUAR** — 4 tasks pendentes, todas de baixo risco.

---

## Iteração 3 — 2026-05-22

### Implementado
- **`.gitignore`** ganhou bloco `# Local tooling / agent artifacts` com:
  - `.claude/` — diretório de runtime do agente (scheduled_tasks.lock etc.)
  - `.playwright-mcp/` — snapshots `.yml` que o MCP Playwright gera por chamada

**Justificativa**: melhor ratio impacto×esforço da fila (médio×tiny). Sem isso, um `git add .` futuro polui o repo com arquivos efêmeros da sessão.

**Risco**: zero (somente adições; não afeta arquivos já tracked).

### Validação
- `git status --short` deixou de listar `.claude/` e `.playwright-mcp/` como untracked.
- Confirmado que `analysis.md` (tracked) NÃO foi adicionado por engano ao gitignore.
- `CHANGES.md` corretamente permanece trackable (não está em gitignore).

### Descartado nesta iteração
- Ignorar `analysis.md`: já é tracked no repo, criaria estado inconsistente.
- Ignorar `*.png` na raiz: screenshots de validação já são deletados a cada iteração; regra global poderia ocultar assets legítimos no futuro.

### Pendente (priorizado)
1. **README desatualizado** — menciona "Catppuccin Mocha" e GitHub `leonamduarte`. Impacto médio, esforço pequeno.
2. **CSS dead code** — `padding-top: 2rem` sobrescrito por `padding-top: 3rem` em `@media (max-height: 820px) and (min-width: 861px)`. Impacto baixo, esforço tiny.
3. **`aria-label="Primary"`** — label em inglês na página pt-br. Impacto baixo, esforço pequeno.

### Decisão de continuidade
**CONTINUAR** — 3 tasks de baixo risco pendentes.

---

## Iteração 4 — 2026-05-22

### Implementado
- **README.md** sincronizado com o estado real do projeto:
  - Título: `leonamduarte portfolio` → `bashln portfolio`
  - Descrição: `Catppuccin Mocha palette` → `warm graphite palette. Bilingual content (PT-BR / EN).`
  - Overview: adicionados bullets sobre language toggle, `localStorage`, `prefers-reduced-motion`
  - Stack: adicionado `Vanilla JavaScript (language toggle)`
  - GitHub URL: `leonamduarte` → `bashln`
  - Email: removido `mailto:` em texto plano (cosmético)

**Justificativa**: único item de impacto médio na fila; documentação desatualizada engana qualquer visitante do repo. Todas as edições são factuais — sem rewrite.

**Risco**: zero (apenas README, não afeta build/runtime).

### Validação
- Diff: 8 inserções, 6 deleções em README.md.
- Cada afirmação verificada contra o código: lang toggle em `index.html`, `localStorage` no script inline, `prefers-reduced-motion` em `style.css` (iter 2), vanilla JS (~30 linhas, sem dependências).
- Nenhum outro arquivo tocado.

### Descartado nesta iteração
- Adicionar screenshot/preview: requer asset dedicado, fora do escopo "tag-only".
- Mencionar font stack (Fraunces, JetBrains Mono, Figtree): nice-to-have, não corrige nada.
- Mencionar versões de browser: vanilla HTML/CSS/JS evergreen, requisito implícito.

### Pendente (priorizado)
1. **CSS dead code** — `padding-top: 2rem` sobrescrito por `padding-top: 3rem` em `@media (max-height: 820px) and (min-width: 861px)`. Impacto baixo, esforço tiny.
2. **`aria-label="Primary"`** — label em inglês na página pt-br. Impacto baixo, esforço pequeno.

### Decisão de continuidade
**CONTINUAR** — 2 tasks pendentes, ambas de baixo impacto mas tiny/pequeno esforço; loop ainda gera valor real antes de PARAR.

---

## Iteração 5 — 2026-05-22

### Implementado
- **`<nav class="links">` ganhou `aria-label` localizado**:
  - HTML: `aria-label="Principal"` (default PT) + `data-aria-pt="Principal"` + `data-aria-en="Primary"`
  - JS (script inline em `index.html`): novo loop em `apply()` que itera `[data-aria-pt][data-aria-en]` e seta `aria-label` conforme o idioma ativo. Mecanismo reutilizável para futuros atributos a11y bilíngues.

**Justificativa**: a11y win — screen readers em pt-br agora anunciam "Principal" em vez de "Primary", batendo com o idioma visual da página e com o `<html lang>`.

**Risco**: zero (atributo adicional + 5 linhas de JS isoladas do fluxo de troca de `textContent`).

### Validação
- Toggle exercido via Playwright: PT → `aria-label="Principal"` + `lang="pt-br"`; EN → `aria-label="Primary"` + `lang="en"`; round-trip PT → consistente.
- `localStorage` persistence respeitado.
- Nenhuma race condition entre `textContent` e `aria-label` (ambos no mesmo `apply()`).

### Descartado nesta iteração
- Localizar `<title>` / `meta description` / `og:*` em runtime: SEO sempre lê o HTML estático (PT por default), e usuários veem o `<title>` apenas brevemente. Custo-benefício ruim.
- CSS dead code (`padding-top` duplicado): adiada para próxima iteração — único item restante de impacto não-zero.

### Pendente (priorizado)
1. **CSS dead code** — `padding-top: 2rem` sobrescrito por `padding-top: 3rem` em `@media (max-height: 820px) and (min-width: 861px)` no `style.css`. Impacto baixo (cosmético de código, sem efeito visual), esforço tiny.

### Decisão de continuidade
**CONTINUAR** — última task pendente é tiny e remove ruído real do código.

---

## Iteração 6 — 2026-05-22

### Implementado
- **`style.css`** em `@media (max-height: 820px) and (min-width: 861px)`:
  - Removida a linha `padding-top: 2rem` morta (era imediatamente sobrescrita por `padding-top: 3rem` 3 linhas abaixo).
  - Reordenadas as declarações restantes em ordem lógica: `align-items: flex-start` → `padding-top: 3rem` → `padding-bottom: 2rem`. Intenção do bloco fica clara à primeira leitura.

**Justificativa**: única task restante da fila; ruído real de código que confundia o leitor sem efeito no rendering.

**Risco**: zero (a linha removida nunca tinha efeito).

### Validação
- Computed style em viewport 1280×700 (que aciona o `@media`):
  - `padding-top: 48px` = 3rem ✓
  - `padding-bottom: 32px` = 2rem ✓
  - `align-items: flex-start` ✓
  - `matchMedia(...).matches === true` ✓
- Renderização visualmente idêntica à anterior (3rem já era o valor final aplicado).

### Reanálise final da base
Após esta iteração, todos os itens objetivos da fila inicial foram resolvidos:

| Iter | Tema |
|---|---|
| 1 | Meta tags (`theme-color`, `color-scheme`, OG, Twitter) |
| 2 | `prefers-reduced-motion` |
| 3 | `.gitignore` para artefatos de agente |
| 4 | README sincronizado |
| 5 | `aria-label` localizado (PT/EN) |
| 6 | CSS dead code removido |

### Itens restantes — fora do escopo deste loop
Tudo o que sobra requer **decisão humana ou asset externo**:
- `og:image` (asset 1200×630 dedicado)
- `og:url` / `<link rel="canonical">` (domínio final desconhecido)
- Skip link a11y (página única, sem fragmentos — opcional)
- JSON-LD Person schema (enhancement SEO, não bug)
- Tap target maior no lang-toggle mobile (subjetivo)

### Decisão de continuidade
**PARAR** — fila objetiva exaurida. Itens restantes dependem de decisão humana ou asset externo, fora do critério "melhorias objetivas relevantes".

---

## Iteração 7 (manual, fora do loop) — 2026-05-22

Decisões humanas tomadas pelo usuário (URL final + assets aprovados) liberaram 4 dos 5 itens "out-of-scope" para execução.

### Implementado
- **`assets/og-card.html`** (fonte) + **`assets/images/og.png`** (1200×630, 572KB) — card tipográfico com `bashln` em Fraunces itálico sobre warm graphite, ambient glow, grain, label `PORTFOLIO`, tagline e stack chips.
- **`index.html` `<head>`**:
  - `<link rel="canonical" href="https://bashln.github.io/portfolio/">`
  - `og:url`, `og:image` (URL absoluta), `og:image:width=1200`, `og:image:height=630`, `og:image:alt`
  - `twitter:card` upgrade de `summary` → `summary_large_image`
  - **JSON-LD `Person` schema** com `name`, `url`, `email`, `jobTitle`, `description`, `sameAs: [github]`
- **`style.css` `.lang-toggle button`**: `padding: 0.65rem 0.4rem` + `margin: -0.65rem -0.4rem` — hit area expandida de ~10×10px para 27×38px (WCAG 2.2 AA ≥24×24), zero shift visual.

### Validado em runtime
- Todas meta tags presentes e corretas.
- JSON-LD parseado como objeto válido.
- Tap target medido em `getBoundingClientRect()`: 27×38px.
- Screenshot da página: layout idêntico ao anterior.

### Descartado nesta rodada
- **Skip link a11y** (item 3 das opções): usuário disse NÃO; página é única, sem fragmentos, baixo retorno.

### Estado final da branch
Todas as decisões humanas pendentes foram resolvidas. Nada objetivo restante. Branch pronta para commit/PR.

---

## Iteração 8 — 2026-05-22

Diagnóstico fresco identificou assets órfãos no `<head>`.

### Implementado
- **`index.html` `<head>`** — 5 novos `<link>` apontando para ícones já presentes em `assets/images/`:
  - `favicon-32x32.png` (PNG moderno preferido por browsers desktop)
  - `favicon-16x16.png` (fallback)
  - `android-chrome-192x192.png` + `android-chrome-512x512.png` (alta resolução, Android e PWA fallback)
  - `apple-touch-icon.png` 180×180 (iOS quando adiciona à home screen)

**Justificativa**: 44KB de assets já no repo nunca eram referenciados. iOS/Android caíam para favicon genérico ao bookmarkar. Zero código novo, só ligação.

**Risco**: zero (apenas `<link>` adicionais; browser escolhe automaticamente o melhor).

### Validação
- `curl` confirmou que os 6 paths de ícone retornam HTTP 200 servidos localmente.
- Estrutura segue convenção padrão de favicon suite.

### Descartado nesta iteração
- `<link rel="manifest">` + `manifest.json` — exige criar arquivo novo (nome, short_name, ícones, theme_color, background_color, display). Próximo candidato se quiser PWA-lite.
- `<meta name="robots" content="noindex">` em `og-card.html` — pequena win SEO, próxima iteração.

### Pendente
1. **`og-card.html` indexável** — atualmente Google pode crawlear `/assets/og-card.html` como página separada. Adicionar `<meta name="robots" content="noindex">` resolve. Impacto baixo, esforço tiny.
2. **`manifest.json` (PWA-lite)** — aproveitaria os ícones android-chrome para experiência "instalável". Impacto baixo, esforço pequeno.

### Decisão de continuidade
**CONTINUAR** — 1 item de tiny esforço ainda gera valor real (limpeza SEO).

---

## Iteração 9 — 2026-05-23 (eliminar scroll do conteúdo)

Usuário relatou que o painel direito gerava scroll desnecessário em viewports comuns de laptop.

### Diagnóstico
A 1280×800 o `.content` media 942px (152px de padding + conteúdo). 142px de overflow → página rolava enquanto sidebar (sticky 100vh) ficava fixa, dando impressão de "scroll do painel direito".

### Implementado em `assets/style/style.css`
Compressão em 3 níveis:

**Base (viewports altos ≥820px)**:
- `.content` padding: `4.5rem 3rem 5rem 4rem` → `3.25rem 3rem 3.5rem 4rem`
- `.section` margin-bottom: `3.25rem` → `2.5rem`
- `.section h2` margin-bottom: `1.35rem` → `1.1rem`
- `.project` padding vertical: `1.2rem` → `1rem`

**`@media (max-height: 820px)`** ganhou compressão do `.content` (além do sidebar que já tinha):
- `.content` padding: `2.25rem 3rem 2.5rem 4rem`
- `.section` margin-bottom: `1.75rem`
- `.section h2` margin-bottom: `0.85rem`
- `.project` padding vertical: `0.8rem`

**Nova `@media (max-height: 760px)`**:
- `.sidebar` padding-top/bottom apertados
- `.sidebar-inner` gap: `1.35rem`
- `.content` padding: `1.75rem 3rem 2rem 4rem`
- `.section` margin-bottom: `1.25rem`
- `.section h2` margin-bottom: `0.7rem`
- `.project` padding vertical: `0.65rem`

### Validação (overflow vertical)
| Viewport | Antes | Depois |
|---|---|---|
| 1280×1080 | 0 | **0 ✓** |
| 1280×900 | 42 | **0 ✓** |
| 1280×800 | 142 | **0 ✓** |
| 1280×768 | 174 | **0 ✓** |
| 1280×700 | 242 | **0 ✓** |
| 1280×650 | 292 | 34 (raro — janela parcial) |

Página agora cabe em todos os tamanhos comuns de laptop (1366×768, 1440×900, 1920×1080) sem scroll.

### Estado final
Branch pronta para commit/PR. CHANGES.md documenta 9 entradas.
