---
name: article-series-planning
description: Planejamento de séries de posts para blog com divisão de tema, progressão entre partes e autonomia de cada capítulo. Use quando o usuário quiser dividir um tema longo em múltiplos posts sem perder coesão, ritmo e identidade autoral.
---

# Skill: Article Series Planning

Planeja séries de conteúdo para transformar temas densos em capítulos claros, conectados e publicáveis.

## Objetivo

- Decidir quando um tema deve virar série.
- Definir mapa de capítulos com progressão lógica e ponte entre partes.
- Evitar capítulos redundantes, longos demais ou dependentes demais entre si.

## Quando usar (gatilhos)

- “Quero dividir este tema em série.”
- “Meu texto ficou longo e confuso; como separar?”
- “Quero publicar em partes sem perder linha de raciocínio.”

## Exemplos de prompt

- "Transforme este rascunho em uma série de 3 a 5 posts com objetivo claro por parte."
- "Me diga se esse tema deve ser post único ou série, e proponha o mapa."

## Inputs (o que pedir ao usuário)

- Tema central e tese principal.
- Público-alvo e nível técnico.
- Quantidade aproximada de partes desejada (se houver).
- Cadência de publicação desejada (ex.: semanal, quinzenal).

Opcional:

- Texto-base ou notas atuais.
- Limites de tamanho por capítulo.

## Princípios e regras

### Crítico (não negociar)

- Cada parte deve responder a uma pergunta central diferente.
- Cada capítulo deve ter começo, meio e fim, mesmo com continuidade.
- Evitar cliffhanger artificial; a ponte deve ser editorial, não clickbait.
- Não dividir por volume de texto apenas; dividir por unidade de ideia.

### Padrões recomendados

- Parte 1: contexto e framing.
- Partes intermediárias: desenvolvimento e aplicação.
- Última parte: limites, síntese e próximos passos.

## Decision Tree (quando houver variações)

1. O tema cabe em um post sem perda de clareza?

- Sim → manter post único.
- Não → dividir em série.

2. A série é técnica ou ensaística?

- Técnica → organizar por etapas de implementação/decisão.
- Ensaística → organizar por tese, tensionamento, síntese.

## Workflow (faça em ordem)

1. Diagnóstico de fatiamento

- Identificar ideias centrais e dependências entre elas.

2. Definir mapa da série

- Preencher `assets/series-map-template.md` com título, objetivo e promessa por parte.

3. Definir autonomia de capítulos

- Garantir que cada parte entregue valor próprio.

4. Definir pontes editoriais

- Criar fechamento de parte com transição curta para a próxima.

5. Checklist final

- Validar equilíbrio de tamanho e ausência de redundância.

## Saída esperada

- Mapa da série com 3–6 partes.
- Para cada parte: objetivo, tópicos, risco de excesso, ponte para próxima.

## Checklist

- [ ] Cada parte tem pergunta central própria
- [ ] Cada parte tem mini conclusão
- [ ] Há progressão clara entre capítulos
- [ ] Não há sobreposição forte entre partes

## Recursos inclusos (opcional)

- `assets/series-map-template.md`

## Limitações e recomendações futuras

- Esta skill planeja a série, mas não substitui revisão de voz e estilo.

## Consulte também

- `article-structure`
- `article-review`
- `article-voice-preservation`
