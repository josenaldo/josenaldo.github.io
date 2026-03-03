---
name: article-voice-preservation
description: Preservação de voz autoral em textos de blog durante estruturação e revisão. Use quando o usuário quiser manter tom pessoal, coloquialismo e imperfeições intencionais sem perder clareza, coesão e qualidade editorial.
---

# Skill: Article Voice Preservation

Define e protege a identidade de escrita do autor para evitar textos polidos demais, frios ou genéricos.

## Objetivo

- Criar perfil de voz do autor para orientar qualquer revisão.
- Identificar risco de “pasteurização” do texto.
- Aplicar melhorias com mínima interferência estilística.

## Quando usar (gatilhos)

- “Quero manter meu jeito de escrever.”
- “Não quero texto com cara de IA.”
- “Revise sem tirar minhas imperfeições.”

## Exemplos de prompt

- "Analise esse texto e me diga onde minha voz some."
- "Crie um perfil da minha escrita e use isso nas próximas revisões."

## Inputs (o que pedir ao usuário)

- 2–4 textos anteriores do autor (ou trechos).
- Preferências explícitas do que preservar.
- O que pode ser ajustado sem problema.

Opcional:

- Palavras/expressões que o autor costuma usar.
- Palavras/tons que o autor não quer usar.

## Princípios e regras

### Crítico (não negociar)

- Preservar marcas autorais: ritmo, coloquialismo, cadência, humor, fricção intencional.
- Não trocar frases pessoais por formulações genéricas.
- Não “corrigir” toda imperfeição; corrigir apenas o que afeta entendimento.
- Nunca inventar experiências pessoais do autor.

### Padrões recomendados

- Antes de revisar, definir contrato de intervenção.
- Classificar sugestões por impacto (alto, médio, baixo).

## Decision Tree (quando houver variações)

1. O trecho está claro, mas informal?

- Sim → manter.
- Não → ajustar apenas para compreensão mínima.

2. A mudança melhora clareza e reduz autenticidade?

- Sim → manter como alternativa opcional, não aplicar por padrão.
- Não → aplicar normalmente.

## Workflow (faça em ordem)

1. Construir perfil de voz

- Preencher `assets/voice-profile-template.md`.

2. Definir contrato de revisão

- Acordar nível de intervenção e limites por seção.

3. Revisar com etiquetagem

- Rotular cada sugestão: `clareza`, `coesão`, `factual`, `voz`, `seo`.

4. Aplicar proteção de voz

- Reverter sugestões que neutralizam estilo sem ganho real de entendimento.

## Saída esperada

- Perfil de voz do autor em Markdown.
- Lista de sugestões priorizadas por impacto.
- Revisão final com mudanças mínimas necessárias.

## Checklist

- [ ] Perfil de voz foi definido antes da revisão
- [ ] Intervenção ficou dentro do contrato
- [ ] Expressões autorais foram preservadas
- [ ] Trechos genéricos foram reduzidos

## Recursos inclusos (opcional)

- `assets/voice-profile-template.md`

## Limitações e recomendações futuras

- O perfil de voz melhora com uso contínuo e feedback explícito do autor.

## Consulte também

- `article-review`
- `article-structure`
- `article-series-planning`
