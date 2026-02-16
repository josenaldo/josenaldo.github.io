---
id: 8
title: WalletCore (EDA + Kafka)
image: /images/projects/prints/fc-walletcore-github.png
projectUrl: https://github.com/josenaldo/fc-walletcore
pin: false
description:
  "An event-driven wallet and balance system built with Kafka, integrating Go and Java services for asynchronous financial processing."
---
## 1. Elevator Pitch

An event-driven architecture project for digital wallet operations, focused on decoupled services and consistent balance processing.

## 2. Problem and Context

Distributed transactional systems require reliable asynchronous communication. This project applies EDA to synchronize transactions and balances across services.

## 3. Scope and Role

- Service implementation and integration.
- Messaging and local environment setup.
- End-to-end documentation for execution and APIs.

## 4. Solution Implemented

A microservices ecosystem that publishes and consumes events to process wallet transactions and update balances asynchronously.

## 5. Stack and Architecture

- Services in Go (`wallet-core`) and Java (`balance-app`).
- Kafka + Zookeeper for messaging.
- MySQL for persistence.
- Docker Compose for local orchestration.

## 6. Quality and Engineering Practices

- Detailed README with prerequisites and endpoints.
- Complete local environment for testing and observability.
- Well-documented topics, ports, and operational commands.

## 7. Portfolio Relevance

Strengthens your profile in microservices and event-driven architecture, aligned with enterprise modernization scenarios.

## 8. Links

- GitHub: <https://github.com/josenaldo/fc-walletcore>
- Production: no public production URL declared in the repository.

## 9. Visual Evidence

![WalletCore - GitHub](/images/projects/prints/fc-walletcore-github.png)
