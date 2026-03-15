---
title: "Interfaces aren't villains"
description: "A technical and architectural analysis on the value of defining explicit contracts even when there's only one concrete implementation."
date: 2025-12-24 09:00:00 -0300
author: Josenaldo Matos
image: '/images/blog/interfaces-arent-villains.png'
category: architecture
---

There's a growing narrative in engineering teams: "let's not create an interface now because that's overengineering."

It stems from a real frustration. Many projects accumulate unnecessary layers just to "look like architecture." And when change never comes, all that's left is a sense of waste.

The criticism is valid. The diagnosis, not always.

The right target isn't the interface itself. It's speculative abstraction: the kind that doesn't protect a real boundary and doesn't reduce impact.

Interfaces don't exist to "predict the future."
Interfaces exist to **limit the impact of the present**.

Practical rule: if a contract reduces surface area and protects a boundary, it's worth it. If it just changes syntax without protecting anyone, it becomes decoration.

---

> **Update — March 3, 2026:** The following section was added after a [post by Luiz Carlos Faria](https://www.linkedin.com/posts/luizcarlosfaria_a-ia-que-est%C3%A1-mudando-o-mundo-%C3%A9-um-modelo-activity-7434393472440143874-cDZj/) sparked a reflection on how the reaction against over-engineering has swung too far in the other direction — and what that pendulum means in the age of AI-assisted development.

## The pendulum swung past the right spot

To understand where this reaction comes from, you have to trace the arc.

For years, the dominant trend in software engineering was accumulation: design patterns on top of design patterns, abstraction on top of abstraction, framework on top of framework. The goal was to manage ever-growing application complexity. The result, in many codebases, was over-engineering — or, as it had already been named in Brazilian Portuguese before the English-speaking world caught up, *exagenharia* (from *exagero de engenharia* — engineering excess). The interface with a single implementation and no real boundary. The repository that wraps a repository. The factory that creates factories. The abstraction that abstracts nothing except another abstraction. These structures don't protect boundaries — they make the codebase heavier, harder to navigate, and slower to change.

The frustration is legitimate. Anyone who has had to read a codebase with twelve layers between a button click and a database row knows the pain. The criticism of *exagenharia* is valid.

What isn't valid is the reaction it triggered.

The pendulum swung — as pendulums always do — past the right position, into under-engineering: *escagenharia* (from *escassez de engenharia* — engineering scarcity). If *exagenharia* is too much structure for no good reason, *escagenharia* is too little structure for every good reason. Business rules inside controllers. Logic in ownerless helpers. External dependencies welded directly into the domain core. No contracts, no boundaries, no cognitive map.

Both are failures. And crucially, neither is cured by its opposite.

*Exagenharia* is not solved by *escagenharia*.
*Escagenharia* is not solved by *exagenharia*.
Both are solved by the same thing: **engineering** — the discipline of identifying real boundaries, protecting what deserves protection, and leaving the rest alone.

There is one more dimension that makes this pendulum problem more urgent today. AI coding assistants — the LLMs and Copilots now embedded in every development workflow — function by recognizing patterns, conventions, and repeatable structures. SOLID principles, Repository, Domain Services, Value Objects aren't just architecture: they are the vocabulary that allows a language model to generate coherent, consistent code for your specific project. Code generation has become the cheapest part of the stack. Architectural decisions, boundary definitions, and domain modeling are what remain expensive — and those are exactly what patterns and contracts codify.

A codebase without conventions, with business rules in controllers and domain logic scattered across helpers with no clear owner, is illegible — not only to the developer who will maintain it six months from now, but to the AI assistant helping them. You don't get leverage from chaos. You get guesswork.

The equation is blunt:

→ Clear patterns + explicit contracts = the model understands context = generates consistent code = real daily productivity.
→ No structure = the model guesses = you review everything = productivity collapses, with or without AI.

Good architecture, it turns out, is not just maintenance discipline. It is also the interface between your codebase and the machines you are now partnering with. Eliminating that structure in the name of simplicity is building exactly the kind of system that becomes increasingly expensive to evolve — for humans and for models alike.

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

| Thing        | What it is                     | Benefit                 | Cost   | When to use                    |
| ------------ | ------------------------------ | ----------------------- | ------ | ------------------------------ |
| Interface    | Boundary contract              | Reduces external impact | Low    | Dependencies and exposure      |
| Abstraction  | Way to organize solution space | Medium                  | Medium | When concrete variation exists |
| Extra layers | Speculative structure          | Low/Uncertain           | High   | Only with proven need          |

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

## The change nobody predicted: software rot

There is a class of change that rarely appears in the "should I use an interface?" debate, even though it's arguably the most certain one: **the software itself will decay.**

Not because your team makes bad decisions. Not because requirements are unclear. Simply because the world around the code keeps moving.

Consider what happens over five years of a production system:

- The JVM or runtime gets updated — and a dependency breaks silently.
- The cloud provider deprecates an API version your SDK depended on.
- A framework upgrade changes injection semantics or lifecycle contracts.
- The database driver introduces a new behavior with the same method signature.
- A security patch in an OS library changes how a connection pool behaves.

At no point did anyone decide to "swap Postgres for Oracle." Nobody planned to change the payment vendor. Nobody wanted to touch the authentication library. But the library touched them — because that's what software does. It rots.

**Software rot** (sometimes called *bit rot* or *entropy*) is the gradual degradation of a system's operational environment while the code itself stays still. The surrounding world evolves: dependencies age, platforms shift, security requirements tighten. Code that worked in 2020 may fail in 2025 without a single intentional change.

This is precisely where abstractions and separation of concerns prove their worth beyond the "swap vendor" scenario.

When external dependencies sit behind a contract, adapting to rot becomes local work:

- the SDK changed its exception model → you fix one adapter
- the database driver deprecated a method → you update one implementation
- the cloud API returned a new field → you adjust the mapping in one place

Without the interface, this same event propagates. Every place that directly touched the dependency now needs to change, be reviewed, and be retested. The scope of a library patch is no longer the library — it's the entire codebase.

**The interface doesn't protect you from change. It controls where change is allowed to land.**

And since software rot is not a risk you can avoid — only a timeline you can't predict — designing for it is not overengineering. It's maintenance discipline.

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

| Question                                                  | If "yes", create interface |
| --------------------------------------------------------- | -------------------------- |
| Does this component touch something I don't control?      | Yes                        |
| Might I need to update vendor, version, or stack?         | Yes                        |
| If this dependency breaks, does the entire system suffer? | Yes                        |
| Does this API expose too many details?                    | Yes                        |
| Is there risk of impact beyond the current module?        | Yes                        |

If everything is "no", don't create it.
If one is "yes", your interface already has a reason.

This checklist acts as a conscious design exercise. It forces the team to reflect on responsibilities, boundaries, and impact before introducing or removing contracts. More importantly: it eliminates superficial discussions in code reviews, where criticism falls on the mere existence of the interface. The debate shifts to focus on concrete risk and necessary protection.

---

## Executive summary

Interfaces aren't about the future.
They're about the cost of change **today**.

Change doesn't only come from architectural decisions — swapping vendors, scaling teams, adding features. It also comes from entropy: runtime upgrades, deprecated APIs, security patches, framework evolution. Software rots not because teams fail, but because the world keeps moving around static code.

The interface is the firewall between your domain logic and everything that changes without asking permission.

That boundary pays for itself long before the second implementation ever appears.

- Don't create interfaces to inflate architecture.
- Don't create abstractions to win arguments in code reviews.
- Create contracts to protect boundaries and reduce impact.

YAGNI isn't "don't do it."
YAGNI is **"don't do what protects nothing."**
