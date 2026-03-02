---
name: article-review
description: Revisão de artigos em Markdown (clareza, argumentação, precisão técnica, estilo e “voz humana”). Use esta skill quando o usuário pedir para revisar um artigo/rascunho, melhorar coesão, cortar gordura, fortalecer argumentos, ajustar tom e garantir consistência de frontmatter para o site.
---

# Skill: Article Review

Revisão com foco em: argumento, clareza e naturalidade — sem deixar o texto “cheiro de IA”.

## Objetivo

- Gerar um **Relatório de Revisão** com mudanças recomendadas e justificativas.
- Produzir revisão guiada por impacto, preservando voz e imperfeições intencionais do autor.

## Quando usar (gatilhos)

- “Revise este artigo.”
- “Está com cara de IA / genérico. Deixe mais humano.”
- “Melhore a argumentação e a linha lógica.”
- “Corte onde está longo demais.”

## Exemplos de prompt

- "Revise este post e me devolva: (1) lista de problemas, (2) sugestões por seção, (3) versão revisada."
- "Quero manter meu estilo. Faça uma revisão leve, sem reescrever tudo."

## Inputs (o que pedir ao usuário)

- O Markdown do artigo (ou o arquivo/path).
- Nível de intervenção: leve (polimento), médio (reestruturação parcial), pesado (reescrita).
- Preferências de voz: mais direto, mais didático, mais opinativo.
- Limite de intervenção por seção (ex.: no máximo 3 mudanças por seção).
- O que **não** deve ser alterado (expressões, ritmo, gírias, marcas pessoais).

Opcional:

- Leitor ideal (persona) e o que ele reclama.
- Se o texto precisa seguir algum padrão (ex.: mais técnico, menos metáfora).

## Princípios e regras

### Crítico (não negociar)

- Manter **a intenção e a tese** do autor; não “trocar o artigo” por outro.
- Evitar clichês e preenchimentos: “de forma geral”, “vale destacar”, “é importante” sem conteúdo.
- Variar ritmo: misturar frases curtas e médias; evitar parágrafos longos demais.
- Reforçar especificidade: onde há abstração, pedir/introduzir exemplo concreto.
- Nunca inventar experiência do autor. Se faltar detalhe, marcar como pergunta.
- Não “alisar” o texto para um padrão neutro; preservar coloquialismo e imperfeições intencionais.
- Quando uma mudança melhorar clareza mas piorar voz, marcar como opção e não aplicar automaticamente.

### Padrões recomendados

- Uma ideia por parágrafo.
- Títulos que são promessas (“o que você vai entender aqui”).

## Decision Tree (quando houver variações)

1. O problema é estilo ou argumento?

- Estilo → cortar redundância, ajustar ritmo, clarificar frases.
- Argumento → reorganizar seções, adicionar contra-argumento e delimitação.

2. O texto está longo por quê?

- Repetição → consolidar.
- Muitos tópicos → dividir em 2 posts.

3. O autor quer autenticidade máxima?

- Sim → operar em modo não invasivo (priorizar sinalização, não reescrita).
- Não → aplicar intervenção conforme nível definido.

## Workflow (faça em ordem)

1. Leitura diagnóstica

- Identificar tese, promessas por seção e pontos frágeis.

2. Relatório de Revisão

- Preencher o template em `assets/review-report-template.md`.
- Separar feedback em: argumento, clareza, precisão, estilo, estrutura e autenticidade.

3. Passes de revisão

- Passo 1: estrutura (ordem e cortes)
- Passo 2: clareza (frase/parágrafo)
- Passo 3: voz (naturalidade)
- Passo 4: proteção de voz (reintroduzir marcas autorais removidas por excesso de polimento)

4. Política de alteração mínima

- Aplicar primeiro correções que quebram compreensão.
- Aplicar depois ajustes de coesão.
- Tratar ajustes de estilo como opcionais.

5. Validação para o site

- Checar frontmatter mínimo (para blog: `title`, `description`, `date`, `author`, `image`, `category`).
- Sugerir melhoria de título/description para SEO sem clickbait.

## Saída esperada

- Relatório de Revisão + lista de perguntas para o autor.
- Versão revisada do texto (ou patch no arquivo).
- Resumo de alterações por etiqueta: `clareza`, `coesão`, `factual`, `voz`, `seo`.

## Checklist

- [ ] Tese aparece cedo e está clara
- [ ] Há exemplos concretos
- [ ] Contra-argumentos/limitações estão presentes
- [ ] Redundâncias removidas
- [ ] Tom natural, sem frases genéricas em série
- [ ] Frontmatter consistente com Contentlayer
- [ ] Intervenção ficou dentro do limite combinado por seção
- [ ] Expressões autorais importantes foram preservadas

## Recursos inclusos (opcional)

- `assets/review-report-template.md`

## Limitações e recomendações futuras

- Se o texto depender de dados/estatísticas, pedir fonte ao usuário antes de afirmar.

## Consulte também

- `article-research`
- `article-structure`
- `article-series-planning`
- `article-voice-preservation`
