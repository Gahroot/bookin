---
title: Why Would Net Asset Value Stay the Same After an Acquisition?
slug: correcting-acquisition-comparisons-before-partners-rely-on-them
type: field-note
description: An acquisition review raised doubts about unchanged net asset value. Nolan traces the loan correction, the requested scenario changes and the confirmed release.
date: 2026-11-19
updated: 2026-11-19
status: draft
audience: Fund executives, COOs, asset managers and real estate operators
primary_keyword: acquisition scenario accuracy
secondary_keywords:
  - acquisition comparisons
  - assumed loan treatment
  - real estate acquisition systems
  - investor fee assumptions
answer: "The acquisition review raised a specific question: why would net asset value remain unchanged with the deal?[^E1] The work identified an assumed loan with inputs in separate documents.[^E2] The completion record confirms the loan fix and a maths audit were live.[^E5] Other scenario changes were requested.[^E4]"
hero_image: /images/articles/correcting-acquisition-comparisons-before-partners-rely-on-them.webp
hero_alt: Conceptual illustration of an acquisition comparison beside separate documents describing an assumed loan
faq: []
cta: book
claims:
  - text: The acquisition review included questions about whether net asset value would be unchanged with versus without the deal and whether the acquisition calculations were correct.
    kind: outcome
    evidence:
      - E1
  - text: Partner testing was proposed in a question asking whether the maths was correct.
    kind: outcome
    evidence:
      - E3
  - text: The requested assumed-loan fix concerned a loan whose balance and rate came from different deal documents.
    kind: capability
    evidence:
      - E2
  - text: Changes to net-to-LP fees in acquisition scenarios were requested.
    kind: capability
    evidence:
      - E4
  - text: A sale at the assumed loan’s maturity was requested.
    kind: capability
    evidence:
      - E4
  - text: A purchase option using the planned loan was requested.
    kind: capability
    evidence:
      - E4
  - text: The completion record lists the assumed-loan fix and the maths audit as live.
    kind: outcome
    evidence:
      - E5
evidence:
  - id: E1
    kind: worklog
    title: Black Mountain Fund private build record (worklog)
    date: 2026-11-05
    public: false
    ref: wl-2026-11-05-black-mountain-fund-37
  - id: E2
    kind: worklog
    title: Black Mountain Fund private build record (worklog)
    date: 2026-11-06
    public: false
    ref: wl-2026-11-06-black-mountain-fund-3
  - id: E3
    kind: worklog
    title: Black Mountain Fund private build record (worklog)
    date: 2026-11-06
    public: false
    ref: wl-2026-11-06-black-mountain-fund-4
  - id: E4
    kind: worklog
    title: Black Mountain Fund private build record (worklog)
    date: 2026-11-06
    public: false
    ref: wl-2026-11-06-black-mountain-fund-6
  - id: E5
    kind: worklog
    title: Black Mountain Fund private build record (worklog)
    date: 2026-11-06
    public: false
    ref: wl-2026-11-06-black-mountain-fund-54
---

## What made the acquisition comparison worth challenging?

The challenge was specific: why would net asset value stay unchanged with the deal versus without it, and were the acquisition calculations correct?[^E1] A later message asked whether the maths was correct and whether partners should test it.[^E3]

That is the point in an acquisition review where I want the conversation to become more concrete. An unexpected result deserves an explanation in terms of the transaction. If the comparison appears unchanged, what treatment accounts for that? What does the proposed acquisition actually mean inside the scenario?

I take that kind of challenge seriously because it names the business question the system must answer. The reviewer is asking whether the acquisition has been represented faithfully enough to discuss with other decision-makers. A broad assurance about accuracy is too vague an answer to such a specific concern.

The useful starting point is the treatment behind the result. I want to examine how the transaction is represented before defending the number on the screen. In this case, the recorded work gives a concrete place to focus: the financing assumption and the boundaries of the acquisition scenarios.

## Which parts of the transaction needed attention?

The assumed-loan fix request concerned a loan whose balance and interest rate came from different deal documents.[^E2]

That detail matters to how I frame the problem. The business object is a loan; the supporting information happens to be distributed across documents. I want the acquisition review organised around the borrowing arrangement being evaluated. The document containing the balance and the document containing the rate each describe part of that arrangement.

The before-and-after account needs to stay precise. Before completion, the record identifies this split-source loan as the subject of a correction. The relevant acceptance question is whether the intended loan treatment has been addressed. There is no basis here for supplying an illustrative rate, inventing a balance or describing a numerical change to net asset value. The concrete issue is the relationship between the financing assumption and its supporting material.

The requested scenario work also included changes to net-to-LP fees.[^E4]

I read that as a question about whose result the scenario is intended to describe. For a limited-partner comparison, fee treatment belongs in the definition of the scenario. My concern is the meaning of the result presented to the investor: which charges are supposed to be reflected, and where does the comparison account for them? That is a business specification worth settling explicitly.

The sale instruction was to use the assumed loan’s maturity.[^E4]

Here, the requested treatment names the event that should determine the scenario’s endpoint. I want an exit assumption to have that kind of plain-language explanation. In the proposed treatment, the reader should understand why that endpoint was selected. The review should make the intended relationship between the financing arrangement and the sale assumption explicit.

The scope also requested a purchase option using the planned loan.[^E4]

That request defines another acquisition case for consideration. My focus is on the question the option is intended to answer: what purchase is being evaluated under the planned financing? Before treating an option as part of a decision, I want its business meaning settled. The financing description belongs alongside the purchase assumption so the reviewer knows what the requested case represents.

These requests concern different parts of the same acquisition discussion: the borrowing arrangement, the investor’s perspective, the exit assumption and the proposed purchase case. I treat each as a distinct acceptance question. A general request to check the maths should lead to specific explanations about the transaction.

## What outcome does the completion record support?

The completion record lists the assumed-loan fix and the maths audit as delivered to the live system.[^E5]

That is the supported outcome of this account. It provides a concrete end to the loan-correction thread: an identified financing issue followed by a recorded release. The audit also belongs in that delivery account, with its scope described as recorded. I keep the outcome tied to those named items.

The other requests need their own completion evidence before I describe them as delivered. Keeping that boundary clear is part of giving an executive a useful account of the work. A requested treatment describes intent; a completion record supports a delivery claim. Release status answers the delivery question, while investment approval remains a separate judgment.

For me, that distinction belongs in a brief, direct handoff. The person reviewing the acquisition should be able to understand what the delivery account actually covers without reconstructing the work history.

## What should you take from this review?

Ask your team or vendor to explain an unexpected acquisition result through the transaction assumption responsible for it.

That is the practical lesson I take from this case. Start with the reviewer’s question and follow it into the relevant business treatment. For a financing question, keep the discussion anchored to the loan being represented and the documents supporting it. Give the reviewer an explanation they can assess in the context of the acquisition.

I want the final conversation to be about whether the system represents the intended transaction. That is a more useful standard for an executive review than a broad declaration that everything has been checked.

If your acquisition system is facing similar scrutiny, book a call to discuss the comparison your team needs to stand behind.
