---
id: 9
title: Personal Website (Next.js + Contentlayer)
description: A zero-cost, developer-authored platform for tracking a software
  career over the years — built with Next.js, Contentlayer2, and Markdown,
  deployable to GitHub Pages or Vercel in minutes.
projectUrl: https://josenaldo.com.br/
pin: false
image: /images/projects/prints/josenaldo.github.io-github.png
translationKey: josenaldo-github-io
translated: true
---

## 1. Pitch de Elevador

A maioria dos portfólios de desenvolvedores são folhetos estáticos: criados uma vez, raramente atualizados, e abandonados quando a vida fica corrida. Este projeto é uma aposta diferente — uma plataforma pessoal desenhada para documentação de carreira contínua e de baixo atrito, na qual um desenvolvedor pode acumular e revisitar sua própria história profissional ao longo dos anos, sem nunca pagar uma conta de hospedagem.

## 2. Problema e Contexto

Existem duas pontas opostas no espectro de sites pessoais: produtos SaaS pagos (LinkedIn, Medium, construtores de portfólio hospedados) que são donos dos seus dados e cobram uma mensalidade, e sites feitos à mão que exigem uma configuração pesada e desistem no momento em que é preciso adicionar conteúdo rapidamente.

Nenhuma das duas funciona a longo prazo. A opção paga cria dependência. A opção pesada cria atrito — e atrito mata a consistência.

O objetivo aqui foi romper esse trade-off: uma plataforma que um desenvolvedor consiga manter por **anos**, adicionando conteúdo em minutos, sendo dono de tudo e gastando zero dólares.

## 3. Escopo e Atuação

Este é um projeto solo — concepção, arquitetura, implementação e conteúdo contínuo. Cada decisão, do modelo de conteúdo ao pipeline de deploy, reflete uma escolha deliberada de manter o custo de manutenção o mais baixo possível.

## 4. Solução Implementada

A resposta foi propositalmente simples: **arquivos Markdown em um repositório público no GitHub, construído com Next.js e publicado como HTML estático**.

- O conteúdo vive em `content/` como arquivos `.md` simples, organizados por tipo (posts de blog, projetos, experiências, cursos, habilidades, depoimentos).
- O Contentlayer2 transforma esses arquivos em dados tipados em tempo de build — sem banco de dados, sem API de CMS, sem runtime.
- A exportação estática (`output: 'export'`) faz com que a saída seja apenas HTML + CSS + JS — publicável em qualquer lugar, de graça: GitHub Pages, Vercel, Netlify.
- O repositório público no GitHub funciona ao mesmo tempo como controle de versão e como um registro transparente de como a carreira evoluiu ao longo do tempo.

Adicionar um novo post de blog ou experiência é um único arquivo Markdown. Publicar é um `git push`.

## 5. Decisões-Chave e Trade-offs

**Por que Markdown?**
Markdown é o formato de conteúdo mais portátil disponível. É legível por humanos, interpretável por máquinas e — cada vez mais importante — é o formato de entrada preferido ao compartilhar informação com ferramentas de IA. Cada peça de conteúdo deste site pode ser alimentada diretamente em um contexto de IA sem nenhuma transformação. Isso não foi coincidência; foi um objetivo de design.

**Por que exportação estática?**
Um servidor em execução tem um custo — em dinheiro, em manutenção e em superfície de falha. Um site estático não tem nada disso. O trade-off é a ausência de recursos dinâmicos do lado do servidor, o que é inteiramente aceitável para um site pessoal.

**Por que um repositório público?**
Duas razões. A prática: toda a premissa — custo zero, stack aberta, manutenibilidade de longo prazo — se torna mais útil se outros desenvolvedores puderem fazer fork e construir sua própria versão. O código é a documentação.

A razão mais profunda é **construir em público**. Um repositório público não é só código-fonte — é um registro transparente de como eu penso, como eu trabalho e como minha carreira evolui. Cada commit, cada conteúdo adicionado, cada decisão arquitetural fica visível. Essa transparência é intencional: ela substitui as afirmações vagas de um currículo por algo que um recrutador ou colaborador pode de fato inspecionar. Você não precisa confiar na minha palavra — pode acompanhar o trabalho acontecendo.

## 6. Qualidade e Práticas de Engenharia

- O schema de conteúdo tipado via Contentlayer2 detecta frontmatter quebrado em tempo de build, não em produção.
- A estrutura de conteúdo organizada por domínio (`content/blog`, `content/projects`, `content/experiences`, etc.) mantém o histórico limpo à medida que o site cresce.
- O `next-sitemap` gera `sitemap.xml` e `robots.txt` automaticamente em cada build.
- CI/CD via GitHub Actions: todo push para `main` dispara um build estático e deploy no GitHub Pages.

## 7. Relevância para o Portfólio

Este é o projeto que sustenta todos os outros projetos. Ele demonstra pensamento de produto (que problema estou resolvendo e para quem?), julgamento técnico (stack simples para um caso de uso de longa duração) e disciplina de execução (um histórico público de iteração consistente).

Também é um artefato vivo: quanto mais tempo ele existe, mais valiosa se torna a documentação de carreira que ele contém.

## 8. Links

- GitHub: <https://github.com/josenaldo/josenaldo.github.io>
- Produção: <https://josenaldo.com.br/>

## 9. Evidência Visual

![Personal Website - GitHub](/images/projects/prints/josenaldo.github.io-github.png)
