---
title: "Interfaces não são vilãs: o problema não é a interface, é a abstração sem propósito"
description: "Uma análise técnica e arquitetural sobre o valor de definir contratos explícitos mesmo quando há apenas uma implementação concreta."
date: 2025-12-24 09:00:00 -0300
author: Josenaldo Matos
image: "/images/blog/interfaces-nao-sao-vilas.png"
category: architecture
---

Existe uma narrativa crescente em times de engenharia: "não vamos criar interface agora porque isso é overengineering".

Ela nasce de um incômodo real. Muitos projetos acumulam camadas desnecessárias só para "parecer arquitetura". E quando a mudança nunca vem, sobra a sensação de desperdício.

A crítica é válida. O diagnóstico, nem sempre.

O alvo correto não é a interface em si.
O alvo correto é a abstração especulativa: aquela que não protege uma fronteira real e não reduz impacto.

Interfaces não existem para "adivinhar o futuro".
Interfaces existem para **limitar o impacto do presente**.

Regra prática: se o contrato reduz superfície e protege uma fronteira, ele vale. Se só muda a sintaxe e não protege ninguém, ele vira ornamento.

---

## Onde a crítica acerta — e onde ela falha

Ela acerta quando denuncia:

- abstrações criadas sem necessidade
- camadas que não protegem nada
- "complexidade cosmética" para parecer profissional

Mas erra ao concluir que:

- "se só existe uma implementação, não use interface"
- "interface só serve para trocar fornecedor"
- "isso viola YAGNI"

Na verdade, essa conclusão se torna perigosa porque confunde conceitos diferentes:

| Coisa          | O que é                              | Benefício             | Custo | Quando usar                     |
| -------------- | ------------------------------------ | --------------------- | ----- | ------------------------------- |
| Interface      | Contrato de fronteira                | Reduz impacto externo | Baixo | Dependências e exposição        |
| Abstração      | Forma de organizar espaço de solução | Médio                 | Médio | Quando existe variação concreta |
| Camadas extras | Estrutura especulativa               | Baixo/Incerto         | Alto  | Só com necessidade comprovada   |

**Criar interface ≠ criar camadas.**

Esse contraste evidencia que a interface, por si só, não adiciona peso arquitetural significativo.

O que encarece a manutenção é a construção de estruturas que não delimitam fronteiras reais. Interfaces funcionam como
 contratos que estabilizam interações; camadas extras nascem para acomodar cenários que talvez nunca existam.

Confundir esses elementos gera decisões reativas: eliminam-se interfaces úteis para evitar exageros que deveriam ser
 evitados com disciplina de design.

---

## Sem interface: o problema oculto

```java
class CheckoutService {
    private final ThirdPartySDK sdk;

    CheckoutService(ThirdPartySDK sdk) {
        this.sdk = sdk;
    }

    public PaymentResponse pay(PaymentRequest req) {
        return sdk.execute(req); // dependência direta
    }
}
```

O que está acontecendo aqui?

- A parte que deveria ser estável do sistema depende diretamente de uma API externa que está fora do nosso controle.
- Nenhuma barreira impede o vazamento de decisões da SDK para dentro do sistema.
- Trocar de fornecedor, atualizar versão ou lidar com uma breaking change vira uma cirurgia.

Tudo funciona — até o dia em que não funciona mais.

A ausência de um contrato explícito induz a um acoplamento erosivo. Cada lugar que toca `ThirdPartySDK` replica suposições sobre parâmetros, tratamento de exceções e semântica de respostas. O conhecimento arquitetural se espalha em fragmentos de código, a equipe perde visibilidade das dependências críticas e o custo de mudança explode. O sistema ganha complexidade acidental sem ganhar nenhum mecanismo de proteção.

A parte mais traiçoeira é que isso parece barato no começo: não há arquivo extra, não há “contrato”. O custo aparece depois, quando a dependência muda e você descobre quantos lugares sabiam demais.

---

## Com interface: o contrato explícito

```java
public interface PaymentGateway {
    PaymentResponse pay(PaymentRequest req);
}

public class ThirdPartyPaymentGateway implements PaymentGateway {
    private final ThirdPartySDK sdk;

    public ThirdPartyPaymentGateway(ThirdPartySDK sdk) {
        this.sdk = sdk;
    }

    @Override
    public PaymentResponse pay(PaymentRequest req) {
        return sdk.execute(req);
    }
}

public class CheckoutService {
    private final PaymentGateway gateway;

    public CheckoutService(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public PaymentResponse pay(PaymentRequest req) {
        return gateway.pay(req);
    }
}
```

Benefícios imediatos:

- a dependência externa está isolada
- a superfície pública é menor e mais clara
- o núcleo do sistema não conhece o fornecedor
- trocar o SDK é um trabalho local, não sistêmico
- testar fica mais simples (dublês sem SDK)

**Nada disso exige segunda implementação.**
A interface agrega valor mesmo sendo única.

Interfaces trazem clareza cognitiva: estabelecem uma linguagem ubíqua para o comportamento essencial e criam um ponto de extensão controlado.

A implementação concreta continua única, mas o acoplamento reverso (do core do sistema para o fornecedor) desaparece. Mesmo que a substituição nunca aconteça, a equipe se beneficia hoje de testes mais simples, SRP mais evidente e documentação implícita do contrato.

---

## Onde isso vive na arquitetura

- **Clean Architecture**: a interface é um boundary; o adapter é um detalhe.
- **Hexagonal**: a interface é uma porta; a implementação é um adaptador.
- **Spring**: o contrato libera o uso de IoC/DI sem acoplamento rígido.
- **DDD**: o contrato é parte do contexto delimitado, não da implementação.

A interface não prevê mudança.
Ela torna a mudança possível.

Ao colocar a interface dentro do círculo de políticas (ou do domínio), garantimos que o lado externo assuma a responsabilidade pela variação. Isso alinha o desenho arquitetural com princípios como Dependency Inversion e reforça a autonomia dos módulos core. Testes unitários passam a depender de dublês simples; integrações assumem papel explícito de adaptadores, com ciclo de vida e observabilidade próprios.

Se você precisa de uma heurística simples: a interface costuma pertencer a quem quer estabilidade (o consumidor). O fornecedor vira detalhe que implementa o contrato.

---

## Quando não vale a pena usar interface

- serviços puramente internos, sem exposição
- objetos utilitários sem dependências externas
- funções estáveis dentro de um único módulo fechado
- quando a interface não reduz superfície, apenas muda sintaxe

Se a interface não protege ninguém, ela não serve.

Criar um contrato vazio apenas desloca responsabilidades sem oferecer amortecedor real. Nesses cenários, o custo cognitivo adicional não compensa: a equipe precisa manter classes redundantes, buscar referências extras e lidar com diagnósticos menos diretos. Interfaces são ferramentas, não ornamentos. Usá-las fora de fronteiras relevantes viola o próprio propósito de redução de impacto.

---

## Quando vale (e muito) a pena

- fronteiras com bases de dados e mensagerias
- integrações com serviços externos
- comunicações inter-módulo ou inter-domínio
- pontos de risco arquitetural
- onde o custo de mudança é alto ou sistêmico

Se a interface protege o domínio, ela já se pagou.

Esses pontos compartilham um traço: concentram incerteza e risco. Um contrato explícito permite introduzir métricas de observabilidade no adaptador, aplicar padrões de resiliência (circuit breaker, retry, fallback) e testar o domínio com dublês que simulam comportamentos extremos. Mesmo uma única implementação ganha elasticidade: versões alternativas, instrumentação adicional ou estratégias de migração podem coexistir temporariamente sob o mesmo contrato, sem exponenciar a entropia.

---

## Checklist para tomar decisão (use antes de criar)

| Pergunta                                              | Se "sim", crie interface |
| ----------------------------------------------------- | ------------------------ |
| Esse componente toca algo que não controlo?           | Sim                      |
| Posso precisar atualizar fornecedor, versão ou stack? | Sim                      |
| Se essa dependência quebrar, o sistema inteiro sofre? | Sim                      |
| Essa API expõe detalhes demais?                       | Sim                      |
| Existe risco de impacto além do módulo atual?         | Sim                      |

Se deu "não" para tudo, não crie.
Se deu "sim" para uma, sua interface já tem motivo.

Esse checklist atua como exercício de design consciente. Ele força a equipe a refletir sobre responsabilidades, limites e impacto antes de introduzir ou remover contratos. Mais importante: elimina discussões superficiais em code reviews, onde a crítica recai na mera existência da interface. O debate passa a focar em risco concreto e proteção necessária.

---

## Conclusão executiva

Interfaces não são sobre o futuro.
São sobre o custo de mudança **hoje**.

- Não crie interfaces para inflar arquitetura.
- Não crie abstrações para ganhar discussão em code review.
- Crie contratos para proteger fronteiras e reduzir impacto.

YAGNI não é não fazer.
YAGNI é **não fazer o que não protege nada**.
