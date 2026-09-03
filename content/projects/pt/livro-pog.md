---
id: 1
title: Workaround-Oriented Programming (Book)
description: A full editorial platform for a living technical book — built with
  Next.js, Contentlayer, and a Git-based publishing pipeline to write, version,
  and ship content continuously.
projectUrl: https://livropog.com.br
pin: true
image: /images/projects/livro-pog.jpg
kind: Book
stack:
  - Next.js
  - Contentlayer
  - MDX
translationKey: livro-pog
translated: true
---

## 1. Pitch de Elevador

Construí uma plataforma editorial completa para o livro *Workaround-Oriented Programming* (POG): um produto digital vivo, desenhado para publicação contínua, leitura fluida e descoberta orgânica em escala.

Mais do que um site institucional — é uma arquitetura de conteúdo que permite escrever, versionar, publicar e evoluir capítulos rapidamente, mantendo qualidade técnica, performance e consistência editorial.

## 2. Problema e Contexto

Produtos de conteúdo técnico enfrentam um problema previsível: material demais, atualizações demais e nenhum processo de publicação confiável. Cada atualização vira retrabalho.

O projeto precisava de um pipeline único e confiável, com:

- Versionamento real de conteúdo, com histórico completo e rollback.
- Experiência de leitura sólida na web e no mobile.
- Uma estrutura construída para crescimento contínuo.
- Uma base técnica sustentável no longo prazo.

Sem isso, o conteúdo estagna. Com isso, o conteúdo se torna um ativo estratégico.

## 3. Escopo e Atuação

Propriedade de ponta a ponta em produto, engenharia e conteúdo:

- Concepção da plataforma e definição da arquitetura.
- Desenvolvimento da aplicação e do pipeline editorial.
- Produção de conteúdo e manutenção contínua.
- Melhorias de busca, SEO e distribuição.
- Repositório público com ciclo de feedback da comunidade.

## 4. Solução Implementada

Uma arquitetura content-first, com separação clara entre conteúdo, aplicação e automação:

- Conteúdo estruturado em Markdown, organizado por domínio (blog e capítulos).
- Aplicação Next.js com roteamento e componentes reutilizáveis.
- Pipeline de conteúdo para transformar texto em páginas indexáveis e prontas para SEO.
- Scripts de geração de assets para imagens OG e exportação de ebook.
- Configuração PWA para uma experiência de leitura progressiva e recorrente.

O resultado: um ciclo simples — escrever → versionar → publicar → evoluir.

## 5. Stack e Arquitetura

Escolhida para equilibrar performance, escalabilidade editorial e manutenibilidade:

- **Next.js + React + MUI** — base de UI robusta e produtiva.
- **Contentlayer** — ingestão tipada de Markdown como fonte única da verdade.
- **Lunr** — busca local rápida, sem dependência de serviço externo.
- **Next SEO + sitemap/robots** — descoberta maximizada, pronta de fábrica.
- **PWA** — experiência progressiva e retenção de leitura.

A estrutura modular permite que a plataforma cresça sem acoplamento forte entre as camadas de conteúdo e aplicação.

## 6. Qualidade e Práticas de Engenharia

Operado como um produto de produção, não uma vitrine:

- Fluxo editorial baseado em Git, com histórico, rastreabilidade e rollback.
- Base de código organizada por contexto de negócio e domínio de conteúdo.
- Scripts e documentação para padronizar processos críticos.
- Repositório público para transparência e aprendizado contínuo.
- Pipeline de build consistente, com entrega previsível.

## 7. O Que Eu Faria Diferente

Eu investiria mais cedo em uma camada de validação de schema de conteúdo — detectar problemas estruturais antes que eles chegassem ao pipeline reduziria o atrito conforme o livro cresce além da primeira fase.

## 8. Relevância para o Portfólio

Este projeto demonstra a entrega de um produto digital de ponta a ponta: da estratégia e arquitetura à escrita técnica e à publicação contínua.

Se você precisa transformar conhecimento em uma plataforma escalável — com engenharia sólida, SEO, performance e operação sustentável — este é o modelo.

## 9. Links

- GitHub: <https://github.com/josenaldo/livro-pog>
- Produção: <https://livropog.com.br>

## 10. Evidência Visual

![Workaround-Oriented Programming - Cover](/images/projects/livro-pog.jpg)
![Workaround-Oriented Programming - GitHub](/images/projects/prints/livro-pog-github.png)
