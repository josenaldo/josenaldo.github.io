---
title: 'O Opala com GPS: como um grafo de código eliminou o grep em cascata no Claude Code'
description: 'O RTK cortou o ruído de shell. O /clear domou o contexto. Faltava a terceira frente: o discovery de código. Aqui estão os números reais de substituir grep + cat por um grafo de conhecimento em 7 repositórios.'
date: 2026-06-24 09:00:00 -0300
author: Josenaldo Matos
image: /images/blog/memgraph-grafo-de-codigo-tokens-claude-code.png
category: Engenharia de Software
status: draft
language: pt
tags:
    [
        claude-code,
        agentes-ia,
        tokens,
        custos,
        memgraph,
        mcp,
        grafo-de-codigo,
        produtividade,
    ]
---
Saudações, seus jóqueis de IA do meu coração!

Os dois artigos anteriores desta série atacaram dois vetores de custo do Opala — o nome carinhoso que eu dei pro Claude Code, esse carro bonito com apetite de motor V8. No [primeiro](/blog/rtk-economia-tokens-claude-code), o RTK cortou o ruído de output de shell: `ls`, `ps`, `eslint`, `git commit`. No [segundo](/blog/domando-o-opala-dieta-de-tokens-no-claude-code), o modelo certo e o `/clear` agressivo dominaram o contexto e o fan-out de subagentes.

Mas havia uma terceira frente que os dois artigos não tocaram.

Ela acontece **antes** de qualquer implementação, toda vez que o agente precisa entender a estrutura do código: onde está a classe que vou modificar? Quecm chama esse método? Esse módulo importa algo que não deveria? O agente responde a essas perguntas do único jeito que sabe sem ajuda: **grep em cascata + cat de arquivo**.

E essa cascata custa.

Este artigo é sobre substituir esse padrão por um grafo de conhecimento do código — com dados reais de quanto muda, e de como ficou a infra depois de indexar 7 repositórios do mesmo projeto.

---

## O problema que ninguém mostra no `ccusage`

O RTK é visível. O contexto gigante aparece no `ccusage`. Mas o custo de discovery é invisível porque **é disperso em dezenas de ferramentas pequenas por sessão**.

Toda vez que o agente precisa entender um pedaço de código antes de trabalhar nele, o padrão é mais ou menos esse:

```
1. grep -rn "NomeDaClasse" src/            → onde está definida?
2. cat src/modulo/application/usecase.js   → o que ela faz?
3. grep -rn "NomeDaClasse" src/            → quem a usa?
4. cat src/modulo/infrastructure/composer  → como é instanciada?
5. grep -rn "require.*models" src/domain/  → tem violação de fronteira?
```

Cinco chamadas de ferramenta. Cada uma jogando kilobytes de contexto no prompt. E o resultado ainda é texto que o agente precisa parsear mentalmente — paths completos repetidos, linhas de contexto desnecessárias, arquivos lidos na íntegra quando o agente queria uma linha.

Eu medi isso num cenário real: descobrir onde `CompleteCurrentSubjectUseCase` é definido, o que ele depende, e onde é instanciado.

**Sem grafo (grep em cascata):**

| Passo | Ferramenta | Output |
|-------|-----------|--------|
| 1 | `grep -rn "CompleteCurrentSubjectUseCase" src/` | 2.916 bytes — 13 linhas com paths completos, repetição de contexto |
| 2 | `cat ...complete-current-subject.usecase.js` | 1.078 bytes — arquivo lido na íntegra |
| 3 | `cat ...flexible-cronogram-controller-composer.js` | 5.056 bytes — arquivo lido na íntegra, pra achar 1 linha |
| **Total** | **3+ chamadas** | **~9.000 bytes injetados no contexto** |

E o agente ainda não sabia **a linha exata** onde o método `execute` começa, nem onde a classe é usada no facade.

**Com grafo (2 consultas MCP):**

| Passo | Ferramenta | Output |
|-------|-----------|--------|
| 1 | `code_lookup_type("CompleteCurrentSubjectUseCase")` | ~850 bytes — arquivo, métodos com linhas exatas, campos |
| 2 | `code_search("CompleteCurrentSubjectUseCase execute")` | ~600 bytes — `FlexibleCronogramFacade.completeCurrentSubject` na linha 122 |
| **Total** | **2 chamadas** | **~1.450 bytes injetados no contexto** |

O agente sabe: arquivo exato, método `execute` nas linhas 10–32, campo `#flexibleCronogramRepository`, e que o ponto de entrada na facade está na linha 122. Sem abrir um arquivo sequer.

**A conta:** 9.000 → 1.450 bytes. **84% menos contexto** por cenário de discovery.

Isso acontece 10, 20, às vezes 50 vezes por sessão de implementação intensa. A economia acumula silenciosamente — não aparece no `ccusage` como uma linha, mas está lá embutida na diferença entre uma sessão que vai até o fim e uma que estoura o limite no meio da tarde.

---

## O que é o Memgraph Ingester

A ferramenta é o [memgraph-ingester](https://github.com/tluyben/memgraph-ingester), um CLI que varre um repositório e popula um banco de grafos com o mapa de código: arquivos, classes, métodos, campos, calls, e embeddings vetoriais de cada pedaço.

Esse mapa fica no **Memgraph** — um banco de grafos em memória, compatível com a sintaxe Cypher do Neo4j, que roda num Docker container. Uma instância, múltiplos namespaces (um por repositório).

A segunda peça é o **memgraph-ingester-mcp**: um servidor MCP em Python que expõe as ferramentas do grafo pro Claude Code via protocolo stdio. Com ele, o agente ganha 30+ ferramentas estruturadas de consulta ao grafo, rodando localmente, sem depender de API externa.

As ferramentas mais úteis no dia a dia:

| Ferramenta | O que faz |
|-----------|-----------|
| `code_lookup_type` | Busca classe ou interface por nome, retorna arquivo + linhas dos métodos |
| `code_search` | Busca vetorial + lexical em todos os chunks de código |
| `code_callers` | Lista quem chama um determinado método |
| `code_impact` | Blast radius de uma mudança — quais arquivos são afetados |
| `code_test_context` | Encontra os testes relacionados a um símbolo |
| `server_status` | Inventário do projeto: arquivos, tipos, métodos indexados |

A promessa é simples: em vez de grep que retorna texto, você consulta um grafo que retorna metadados estruturados — arquivo, linha de início, linha de fim, hierarquia, dependências.

---

## A stack que montei: 7 repositórios, 1 instância

O projeto MedEspecialista tem 7 repositórios ativos. Montar uma instância de Memgraph por repo seria desperdício de memória e de manutenção. A solução foi uma única instância Docker com **namespaces separados por projeto**:

| Namespace | Repo | Arquivos JS/TS |
|-----------|------|---------------:|
| `me-api` | api (Node.js/Express Clean Architecture) | 1.314 |
| `me-frontend` | frontend (React 19 + Mantine 9) | 827 |
| `me-admin` | admin (React 19 + TypeScript) | 1.164 |
| `me-backend` | backend (serviços auxiliares) | 124 |
| `me-badges` | medbadges (gamificação) | 121 |
| `me-lead` | medlead (CRM) | 36 |
| `me-hotmart` | hotmart-gateway (integração) | 27 |
| **Total** | **7 repositórios** | **3.613** |

O inventário do `me-api` depois da ingestão:

```
Arquivos:  1.314
Tipos:     1.930
Métodos:   4.360
Chunks vetorizados: 8.246
```

Cada chunk é um pedaço de código com embedding vetorial de 384 dimensões, gerado localmente (sem API externa). A busca por similaridade semântica funciona offline, zero latência de rede.

**O modo watch** é o diferencial prático. Em vez de re-ingerir o repositório inteiro a cada mudança, o ingester observa o sistema de arquivos e atualiza incrementalmente apenas os arquivos modificados. Edito um use case, salvo, e em segundos o grafo já reflete a mudança.

---

## A configuração em três peças

Não vou transformar isso num tutorial de instalação — a documentação do projeto cobre isso. Mas vale documentar a **estrutura de decisões** que tomei, porque elas não são óbvias.

### 1. `.mcp.json` em cada repositório

O Claude Code carrega o servidor MCP via arquivo `.mcp.json` na raiz do repositório. Cada repo aponta pro mesmo servidor com o namespace correto:

```json
{
  "mcpServers": {
    "memgraph-ingester": {
      "type": "stdio",
      "command": "uvx",
      "args": ["memgraph-ingester-mcp", "--bolt", "bolt://localhost:7687", "--project", "me-api"]
    }
  }
}
```

O `--project me-api` é o namespace. Troca por `me-frontend` no repo do frontend, e o agente consulta o grafo certo automaticamente.

### 2. Scripts `memgraph:watch` e `memgraph:reingest` em cada repo

Cada repositório ganhou dois scripts no `package.json`:

```bash
npm run memgraph:watch    # sobe o watch mode pro grafo desse repo
npm run memgraph:reingest # wipe + rebuild completo (após merges grandes)
```

O watch é a operação cotidiana. O reingest é para depois de merges grandes, quando a estrutura do código muda muito e o grafo incremental pode ter ficado inconsistente.

### 3. Hook `SessionStart` para automação

O detalhe de qualidade de vida: criou um hook `SessionStart` no `~/.claude/settings.json` global que, ao abrir o Claude Code em qualquer repositório MedEspecialista, verifica se o Memgraph está rodando e se já existe um processo de watch para aquele repo. Se não houver, sobe o watch em background automaticamente.

```json
"SessionStart": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "bash ~/.claude/scripts/memgraph-autowatch.sh",
        "async": true
      }
    ]
  }
]
```

O script verifica o caminho do `$PWD` (se contém `/repos/medespecialista/`), testa o Memgraph com um ping silencioso, verifica duplicatas via `pgrep`, e sobe o watch se tudo estiver ok. Se o Memgraph estiver desligado, sai silenciosamente sem nenhum erro. A sessão do Claude começa normalmente nos dois casos.

---

## O que o CLAUDE.md ganhou

Cada repositório ganhou uma seção nova no `CLAUDE.md`:

```markdown
## Memgraph Code Graph

Grafo de código disponível via MCP (`memgraph-ingester`, projeto `me-api`).
Pré-condição: `npm run memgraph:up`.

Use as ferramentas MCP antes de ler arquivos brutos:
- `search_code` / `find_files` — localizar símbolos e arquivos sem grep
- `get_dependencies` / `get_dependents` — rastrear imports e dependências
- `check_boundary_violations` — validar fronteiras domain/application/infrastructure
```

Essa instrução serve dois propósitos: lembra o agente de que o grafo existe (ele não usa ferramentas que não conhece), e estabelece a prioridade — grafo primeiro, leitura de arquivo apenas para confirmar e editar.

---

## Limitações honestas

Nada funciona como no slide de venda. As três que encontrei:

**1. Pré-condição manual.** O Memgraph roda em Docker — você precisa subir o container antes de usar. `npm run memgraph:up` no repositório da API sobe tudo. O hook de `SessionStart` cuida do watch automaticamente, mas o container em si precisa estar rodando. Se você reiniciar o computador e esquecer de subir o Docker, o agente cai graciosamente pro comportamento padrão (sem o MCP ativo, simplesmente não usa as ferramentas do grafo).

**2. A primeira ingestão demora.** 1.314 arquivos de JavaScript com geração de embeddings locais levam alguns minutos na primeira vez. Nada absurdo, mas é um tempo de setup real. Após isso, o watch é incremental e instantâneo.

**3. O grafo é uma foto.** Após merges grandes que muovem muita estrutura — renomear módulos, mover arquivos, refatorar imports em cascata — o grafo pode ficar desincronizado com o código real. O sinal é o agente encontrar referências que não existem mais. A solução é `npm run memgraph:reingest`, que faz wipe + rebuild. Coloquei isso como um passo explícito no workflow pós-merge.

**4. Covertura de linguagem.** O ingester entende JavaScript, TypeScript, Python, Java, e alguns outros. Para configurações em YAML, SQL inline, ou templates de outras linguagens, o grafo não ajuda — você volta pro grep normal.

---

## A série completa: três frentes, três ferramentas

Olhando de trás pra frente, os três artigos atacam vetores diferentes do mesmo problema:

| Frente | Ferramenta | O que ataca |
|--------|-----------|-------------|
| Output de shell | RTK | Ruído estrutural de `ls`, `ps`, `eslint`, `git` — tokens que o agente lê mas não usa |
| Contexto e modelo | `/clear` + `opusplan` | Cache read de sessão longa, modelo Opus em tudo, fan-out sem controle |
| Discovery de código | Memgraph + MCP | grep em cascata + leitura de arquivos inteiros pra extrair uma linha |

As três convivem. Você não escolhe uma e descarta as outras — cada uma ataca um vetor diferente, e os três somados mudam o perfil de custo de uma sessão intensa.

O número global do RTK hoje, depois de 34.410 comandos: **29,9 milhões de tokens economizados (24,3%)**. O grafo não aparece nesse relatório porque não é output de shell — mas está embutido nas sessões que vão mais longe sem estourar o limite.

---

## Veredito

Vale. Com uma ressalva de perfil.

**Vale muito** para quem trabalha com base de código que cresce — múltiplos módulos, Clean Architecture com camadas separadas, ou projetos que você não tem memorizado de cor. Nesse perfil, o agente faz discovery constantemente, e cada discovery economizado com o grafo é contexto que sobra pra implementação.

**Vale menos** para quem trabalha em base pequena ou num único arquivo por vez. Se você passa a sessão inteira em um arquivo de 200 linhas, o grafo não vai mudar sua vida.

**O diferencial qualitativo** — que não aparece em bytes — é que o grafo retorna **metadados estruturados**, não texto. O agente sabe que `execute` começa na linha 10, termina na linha 32, recebe `{id, userId}`, e depende de `#flexibleCronogramRepository`. Esse tipo de informação reduz erros de interpretação: o agente não lê o arquivo inteiro e tira conclusões erradas sobre o que está fora do seu alcance de leitura.

O Opala continua sendo um Opala. Mas agora ele tem GPS — e para de dar voltas procurando o endereço pelo bairro inteiro.

Até a próxima, jóqueis. E lembrem: o grep está lá se você precisar. O grafo está lá pra quando você não quiser precisar.

---

[TODO: adicionar a imagem de capa em `/public/images/blog/memgraph-grafo-de-codigo-tokens-claude-code.png` antes de publicar]
