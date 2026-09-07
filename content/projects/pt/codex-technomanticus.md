---
id: 2
title: Codex Technomanticus (vault + site + Anki)
description: A public digital garden of 3,312 engineering notes written in
  Obsidian — with a versioned editor, a theme of my own, an explicit publication
  gate, a customized Quartz build, and a Python pipeline distilling it into Anki
  decks.
projectUrl: https://josenaldo.com.br/codex-technomanticus-site/
pin: true
image: /images/projects/prints/codex-technomanticus-site.webp
kind: Digital garden
stack:
  - Obsidian
  - Quartz
  - Markdown
  - Python
  - GitHub Actions
translationKey: codex-technomanticus
translated: true
---

## 1. Pitch de Elevador

O Codex Technomanticus é o meu grimório: um jardim digital público com **3.312 notas** de engenharia de software, escritas no Obsidian, versionadas em git e publicadas como site. Não é um blog nem uma pasta de anotações — é uma base de conhecimento com arquitetura de informação, taxonomia tipada e portão de publicação explícito.

São três repositórios públicos trabalhando juntos: o vault, o site que o publica e um pipeline que destila as notas em baralhos de Anki.

## 2. Problema e Contexto

Todo engenheiro sênior acumula a mesma dívida: o que ele sabe está espalhado entre memória, favoritos, threads de chat e arquivos soltos. Quando a mesma pergunta aparece pela segunda vez, a resposta é reconstruída do zero.

Eu quis o oposto: um lugar onde a resposta é escrita uma vez, fica ligada às vizinhas, sobrevive a mim, e pode ser lida por qualquer pessoa sem eu estar na sala. A mesma disciplina que aplico em código — versionamento, revisão, contrato, publicação automatizada — aplicada ao que eu sei.

O enquadramento é deliberado, e é meu: engenharia de software como magia aplicada à realidade digital. Converter intenção em alteração da realidade por meio de fórmulas precisas, símbolos verificáveis e rituais de entrega. A brincadeira é séria — ela deu ao vault uma linguagem própria, e linguagem própria é o que faz alguém voltar.

## 3. Escopo e Atuação

Autor único de tudo: o conteúdo, o ambiente em que ele é escrito, a plataforma que o publica e o pipeline que o transforma em material de estudo.

## 4. Arquitetura da informação

O vault não é uma pilha de arquivos. Ele tem cinco zonas com papéis distintos: `00-Meta` guarda templates, guias, specs, roadmap e auditorias de saúde do próprio vault; `01-Pergaminhos` e `02-Glosas` guardam texto autoral e leitura anotada; `03-Dominios` é o corpo de conhecimento; `04-Sendas` são as trilhas de estudo.

**Os domínios, por volume de notas:**

| Domínio | Notas |
| --- | --- |
| Tecnologia | 2.082 |
| Engenharia | 470 |
| Ciência da Computação | 197 |
| Carreira | 94 |

Dentro de Tecnologia: Java 381 · IA 365 · Go 208 · Python 202 · Cloud 198 · React 104 · Node 103 · Infraestrutura 96 · Terminal 78.

**Cada nota declara o que é.** A taxonomia é tipada no frontmatter e sustenta a navegação: `concept` (2.501), `moc` — mapas de conteúdo (319), `meta` (184), `note` (81), `spec` (67), `glosa` (52), `plan` (29), `reference` (24), `index` (23), `report` (15).

**O portão de publicação é explícito.** 2.390 notas marcadas `publish: true`, 700 marcadas `publish: false`, e o site publica apenas `Dominios` e `Sendas`. O que ainda está verde fica no vault até amadurecer.

## 5. O ambiente de escrita

O Codex é escrito no **Obsidian**, e o ambiente de escrita é parte do projeto — não preferência pessoal guardada numa máquina. O diretório `.obsidian` inteiro é versionado junto com as notas: aparência, atalhos, configuração do grafo, plugins e templates. Clonar o repositório entrega o vault e o editor no mesmo estado.

**Um tema próprio.** Escrevi o tema `Codex Technomanticus` — 690 linhas de CSS, com manifesto assinado — para que o editor tenha a mesma pele do grimório publicado e do `josenaldo.com.br`. São três superfícies com uma identidade só: onde eu escrevo, onde o leitor lê, e onde eu me apresento. A mensagem do commit resume: *a mesma pele do site*.

**Quinze templates** em `00-Meta/templates` fazem cada tipo de nota nascer com a estrutura certa: Nota, MOC, Glosa, Glossário, How-To, TIL, Roadmap, Mestre, card, quiz. O tipo declarado no frontmatter não é etiqueta posta depois — é a forma com que a nota nasce.

**Dezessete plugins com função definida:** Templater e QuickAdd para o ritual de criação, Dataview para consultar a taxonomia como se fosse banco, obsidian-git para versionar sem sair do editor, tag-wrangler para manter a taxonomia limpa, e um conjunto de ferramentas de Mermaid com dois snippets de CSS próprios para que os diagramas saiam no tema do Codex.

## 6. A plataforma que publica

O site é um fork do **Quartz** com `content` apontando para o vault por symlink — o conteúdo nunca é copiado, então não existe versão divergente. Sobre a base, o que eu construí:

- Tema alinhado ao `josenaldo.com.br`, para que o grimório e o site pareçam a mesma casa.
- Explorer ordenado e numerado por nome de arquivo, com as pastas de trabalho ocultas.
- Breadcrumbs, modo leitura, callouts próprios, tema do Mermaid e destaque de código.
- Slugs sem acento e em minúsculas, correções de acessibilidade e de layout em telas estreitas.
- **Checagens automatizadas de aceite visual** em `verify/`, rodando em CI ao lado de cinco workflows do GitHub Actions: integração, build de preview, deploy de preview, deploy e publicação de imagem Docker.

Um push no vault dispara o deploy do site. Escrever e publicar são o mesmo gesto.

## 7. A destilação

O terceiro repositório é um pipeline em Python — `genanki`, `pyyaml`, `markdown`, empacotado com `uv` e exposto como CLI — que lê cards escritos em markdown e gera um baralho de Anki com sub-baralhos por domínio: Fundamentos, Arquitetura, Java, JavaScript, Infraestrutura. Há validação de cards, testes e um workflow que publica o `.apkg` como release.

A nota é a fonte; o flashcard é derivado. Nenhum conteúdo é digitado duas vezes.

## 8. Fluxo de trabalho com agentes

O vault versiona **31 skills de agente** em `.agents/skills` — entre elas `escrever-nota`, `enriquecer-nota`, `enriquecer-galho`, `diagnosticar-galho`, `glosa`, `glosa-video`, `colher-duvidas`, `plantar-duvidas`, `deadlink`, `json-canvas`, `obsidian-markdown`.

Isso é o que torna 3.312 notas possíveis sem virar um depósito: o agente executa o ritual, e o ritual está escrito, versionado e é revisável. A arquitetura, a curadoria e a revisão final continuam minhas.

## 9. Semeadura e cultivo

O ritmo do jardim tem dois modos, e eles explicam a forma do histórico. Quando um assunto novo me interessa, eu **semeio** o domínio inteiro — é trabalho pesado e concentrado, e aparece como um pico. Depois vem o **cultivo**: enriquecer, ligar, corrigir, podar. A primeira versão do vault foi quase toda semeadura; hoje o trabalho é sobretudo de cultivo, e novas semeaduras só acontecem quando entra um assunto novo.

Não é um projeto que termina. É um jardim.

## 10. Relevância para o Portfólio e Links

Este projeto demonstra o que eu defendo em engenharia, aplicado fora do código de cliente:

- Documentação como artefato de primeira classe, com contrato e revisão
- Arquitetura de informação e taxonomia projetadas, não improvisadas
- Publicação automatizada, com portão explícito entre rascunho e público
- Fluxo com agentes de IA em que o ritual é versionado e a revisão é humana
- Conteúdo como fonte única, com derivados gerados — nunca duplicados

Links:

- Site: <https://josenaldo.com.br/codex-technomanticus-site/>
- Vault: <https://github.com/josenaldo/codex-technomanticus>
- Plataforma: <https://github.com/josenaldo/codex-technomanticus-site>
- Baralhos Anki: <https://github.com/josenaldo/codex-technomanticus-arcana>

## 11. Evidência Visual

![Codex Technomanticus — página inicial do grimório, com explorer, grafo de notas, índice e backlinks](/images/projects/prints/codex-technomanticus-site.webp)

*O grimório publicado: explorer à esquerda, grafo de ligações e índice à direita, tema alinhado ao josenaldo.com.br.*
