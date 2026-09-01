---
id: 8
title: WalletCore (EDA + Kafka)
description: An event-driven wallet and balance system built with Kafka,
  integrating Go and Java services for asynchronous financial processing.
projectUrl: https://github.com/josenaldo/fc-walletcore
pin: false
image: /images/projects/prints/fc-walletcore-github.png
translationKey: fc-walletcore
translated: true
---

## 1. Pitch de Elevador

Um projeto de arquitetura orientada a eventos para operações de carteira digital, focado em serviços desacoplados e processamento consistente de saldo.

## 2. Problema e Contexto

Sistemas transacionais distribuídos exigem comunicação assíncrona confiável. Este projeto aplica EDA para sincronizar transações e saldos entre serviços.

## 3. Escopo e Atuação

- Implementação e integração dos serviços.
- Configuração de mensageria e do ambiente local.
- Documentação de ponta a ponta para execução e APIs.

## 4. Solução Implementada

Um ecossistema de microsserviços que publica e consome eventos para processar transações de carteira e atualizar saldos de forma assíncrona.

## 5. Stack e Arquitetura

- Serviços em Go (`wallet-core`) e Java (`balance-app`).
- Kafka + Zookeeper para mensageria.
- MySQL para persistência.
- Docker Compose para orquestração local.

## 6. Qualidade e Práticas de Engenharia

- README detalhado com pré-requisitos e endpoints.
- Ambiente local completo para testes e observabilidade.
- Tópicos, portas e comandos operacionais bem documentados.

## 7. Relevância para o Portfólio

Fortalece o perfil em microsserviços e arquitetura orientada a eventos, alinhado a cenários de modernização corporativa.

## 8. Links

- GitHub: <https://github.com/josenaldo/fc-walletcore>
- Produção: nenhuma URL de produção pública declarada no repositório.

## 9. Evidência Visual

![WalletCore - GitHub](/images/projects/prints/fc-walletcore-github.png)
