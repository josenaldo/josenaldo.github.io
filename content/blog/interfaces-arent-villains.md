---
title: "Interfaces aren't villains: the problem isn't the interface, it's purposeless abstraction"
description: "A technical and architectural analysis on the value of defining explicit contracts even when there's only one concrete implementation."
date: 2025-12-24 09:00:00 -0300
author: Josenaldo Matos
image: "/images/blog/interfaces-arent-villains.png"
category: architecture
---

There's a growing narrative in engineering teams: "let's not create an interface now because that's overengineering."

It stems from a real frustration. Many projects accumulate unnecessary layers just to "look like architecture." And when change never comes, all that's left is a sense of waste.

The criticism is valid. The diagnosis, not always.

The right target isn't the interface itself.
The right target is speculative abstraction: the kind that doesn't protect a real boundary and doesn't reduce impact.

Interfaces don't exist to "predict the future."
Interfaces exist to **limit the impact of the present**.

Practical rule: if a contract reduces surface area and protects a boundary, it's worth it. If it just changes syntax without protecting anyone, it becomes decoration.

---

## Where the criticism hits — and where it misses

It hits when it calls out:

- abstractions created without need
- layers that protect nothing
- "cosmetic complexity" to look professional

But it misses when it concludes that:

- "if there's only one implementation, don't use an interface"
- "interfaces only exist to swap vendors"
- "this violates YAGNI"

In reality, this conclusion becomes dangerous because it conflates different concepts:

| Thing          | What it is                        | Benefit                  | Cost      | When to use                   |
| -------------- | --------------------------------- | ------------------------ | --------- | ----------------------------- |
| Interface      | Boundary contract                 | Reduces external impact  | Low       | Dependencies and exposure     |
| Abstraction    | Way to organize solution space    | Medium                   | Medium    | When concrete variation exists|
| Extra layers   | Speculative structure             | Low/Uncertain            | High      | Only with proven need         |

**Creating an interface ≠ creating layers.**

This contrast shows that an interface, by itself, doesn't add significant architectural weight.

What makes maintenance expensive is building structures that don't delineate real boundaries. Interfaces act as contracts that stabilize interactions; extra layers are born to accommodate scenarios that may never exist.

Conflating these elements leads to reactive decisions: useful interfaces are eliminated to avoid excesses that should be prevented with design discipline.

---

## Without an interface: the hidden problem

```java
class CheckoutService {
    private final ThirdPartySDK sdk;

    CheckoutService(ThirdPartySDK sdk) {
        this.sdk = sdk;
    }

    public PaymentResponse pay(PaymentRequest req) {
        return sdk.execute(req); // direct dependency
    }
}
```

What's happening here?

- The part of the system that should be stable depends directly on an external API outside our control.
- No barrier prevents SDK decisions from leaking into the system.
- Swapping vendors, updating versions, or handling a breaking change becomes surgery.

Everything works — until the day it doesn't.

The absence of an explicit contract leads to erosive coupling. Every place that touches `ThirdPartySDK` replicates assumptions about parameters, exception handling, and response semantics. Architectural knowledge spreads across code fragments, the team loses visibility of critical dependencies, and the cost of change explodes. The system gains accidental complexity without gaining any protective mechanism.

The most insidious part is that this seems cheap at first: no extra file, no "contract." The cost appears later, when the dependency changes and you discover how many places knew too much.

---

## With an interface: the explicit contract

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

Immediate benefits:

- the external dependency is isolated
- the public surface is smaller and clearer
- the system core doesn't know the vendor
- swapping the SDK is local work, not systemic
- testing becomes simpler (test doubles without SDK)

**None of this requires a second implementation.**
The interface adds value even when it's unique.

Interfaces bring cognitive clarity: they establish a ubiquitous language for essential behavior and create a controlled extension point.

The concrete implementation remains unique, but the reverse coupling (from system core to vendor) disappears. Even if substitution never happens, the team benefits today from simpler tests, clearer SRP, and implicit contract documentation.

---

## Where this lives in architecture

- **Clean Architecture**: the interface is a boundary; the adapter is a detail.
- **Hexagonal**: the interface is a port; the implementation is an adapter.
- **Spring**: the contract enables IoC/DI without tight coupling.
- **DDD**: the contract is part of the bounded context, not the implementation.

The interface doesn't predict change.
It makes change possible.

By placing the interface inside the policy circle (or domain), we ensure the external side takes responsibility for variation. This aligns architectural design with principles like Dependency Inversion and reinforces the autonomy of core modules. Unit tests come to depend on simple test doubles; integrations take on an explicit role as adapters, with their own lifecycle and observability.

If you need a simple heuristic: the interface usually belongs to whoever wants stability (the consumer). The vendor becomes a detail that implements the contract.

---

## When an interface isn't worth it

- purely internal services, without exposure
- utility objects without external dependencies
- stable functions within a single closed module
- when the interface doesn't reduce surface area, just changes syntax

If the interface doesn't protect anyone, it serves no purpose.

Creating an empty contract just shifts responsibilities without offering real cushioning. In these scenarios, the additional cognitive cost doesn't pay off: the team needs to maintain redundant classes, search extra references, and deal with less direct diagnostics. Interfaces are tools, not ornaments. Using them outside relevant boundaries violates the very purpose of impact reduction.

---

## When it's (very much) worth it

- boundaries with databases and messaging systems
- integrations with external services
- inter-module or inter-domain communications
- architectural risk points
- where the cost of change is high or systemic

If the interface protects the domain, it has already paid for itself.

These points share a trait: they concentrate uncertainty and risk. An explicit contract allows introducing observability metrics in the adapter, applying resilience patterns (circuit breaker, retry, fallback), and testing the domain with test doubles that simulate extreme behaviors. Even a single implementation gains elasticity: alternative versions, additional instrumentation, or migration strategies can temporarily coexist under the same contract, without exponentially increasing entropy.

---

## Decision checklist (use before creating)

| Question                                              | If "yes", create interface |
| ----------------------------------------------------- | -------------------------- |
| Does this component touch something I don't control?  | Yes                        |
| Might I need to update vendor, version, or stack?     | Yes                        |
| If this dependency breaks, does the entire system suffer? | Yes                   |
| Does this API expose too many details?                | Yes                        |
| Is there risk of impact beyond the current module?    | Yes                        |

If everything is "no", don't create it.
If one is "yes", your interface already has a reason.

This checklist acts as a conscious design exercise. It forces the team to reflect on responsibilities, boundaries, and impact before introducing or removing contracts. More importantly: it eliminates superficial discussions in code reviews, where criticism falls on the mere existence of the interface. The debate shifts to focus on concrete risk and necessary protection.

---

## Executive summary

Interfaces aren't about the future.
They're about the cost of change **today**.

- Don't create interfaces to inflate architecture.
- Don't create abstractions to win arguments in code reviews.
- Create contracts to protect boundaries and reduce impact.

YAGNI isn't "don't do it."
YAGNI is **"don't do what protects nothing."**
