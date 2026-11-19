---
title: Correcting an Assumed Loan Across Separate Deal Documents
slug: correcting-acquisition-comparisons-before-partners-rely-on-them
type: field-note
description: "An acquisition system needed a loan-input fix: balance and rate came from separate documents. I released the correction alongside a recorded maths audit."
date: 2026-11-19
updated: 2026-11-19
status: draft
audience: Fund executives, COOs, asset managers and real estate operators
primary_keyword: acquisition loan assumptions
secondary_keywords:
  - acquisition comparisons
  - assumed loan treatment
  - acquisition system accuracy
answer: "I corrected an acquisition system’s handling of an assumed loan with its balance and interest rate supplied in separate deal documents.[^E2][^E5] The correction and a maths audit reached the live system.[^E5] The executive takeaway: ask for the specific financing treatment behind an acquisition comparison before circulating it."
hero_image: /images/articles/correcting-acquisition-comparisons-before-partners-rely-on-them.webp
hero_alt: Conceptual illustration of separate documents supplying an assumed loan’s balance and interest rate
faq:
  - q: What financing issue did the correction address?
    a: The assumed loan needed to accommodate a balance and interest rate drawn from different deal documents.[^E2] The completion record confirms that correction was delivered.[^E5]
  - q: What other acquisition changes were requested?
    a: The requests covered fees in net-to-LP scenarios, a sale tied to the assumed loan’s maturity, and a purchase case using planned financing.[^E4]
cta: book
claims:
  - text: The acquisition review questioned why net asset value would remain unchanged with versus without the deal and whether the acquisition calculations were correct.
    kind: outcome
    evidence:
      - E1
  - text: A subsequent review message asked whether the maths was correct and whether partners should test the system.
    kind: outcome
    evidence:
      - E3
  - text: The assumed-loan correction addressed a loan whose balance and interest rate came from different deal documents.
    kind: capability
    evidence:
      - E2
      - E5
  - text: The assumed-loan correction and a maths audit were delivered to the live acquisition system.
    kind: outcome
    evidence:
      - E5
  - text: Additional requests covered net-to-LP fees in scenarios, selling at the assumed loan’s maturity, and a purchase option using the planned loan.
    kind: capability
    evidence:
      - E4
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

## What prompted scrutiny before partner review?

An acquisition review raised a direct challenge: why would net asset value remain unchanged with versus without the deal, and were the acquisition calculations correct?[^E1] A subsequent message asked whether the maths was correct and whether partners should test the system.[^E3]

For an executive, that is a question about readiness to circulate a comparison. Before asking partners to assess an acquisition, I want the financing treatment explained in terms they can challenge. A result on a screen needs a clear connection to the transaction being evaluated.

The useful response is a specific review question: which acquisition assumption needs attention? That keeps the discussion grounded in the proposed deal and gives the correction a defined scope.

## What financing treatment needed correcting?

The concrete issue concerned an assumed loan whose balance and interest rate came from different deal documents.[^E2]

I treated the loan as the business unit of review. The important relationship was between the borrowing balance and its rate; the document boundary was incidental to that relationship. That framing kept the correction focused on the financing arrangement being represented.

For a fund executive, the acceptance question is straightforward: does the comparison represent the intended loan when its supporting terms are supplied separately? That is the level at which I want a vendor to explain the work. It gives the reviewer something specific to assess against the transaction documents.

Other requests covered net-to-LP fees, a sale at the assumed loan’s maturity, and a purchase case using planned financing.[^E4] This account covers the loan correction and maths audit.

## What was delivered?

I delivered the assumed-loan correction and a maths audit to the live acquisition system.[^E5]

The handoff should keep that scope explicit. For partner review, I want the next conversation organised around the acquisition assumptions the partners are being asked to evaluate. Keep the financing question attached to the comparison, with the relevant terms available for scrutiny.

## What should you ask your team or vendor?

Ask them to walk through the financing represented in the acquisition case. Where do the balance and rate come from? Do those terms describe the borrowing arrangement you intend to assume? What exactly did the correction address?

Then ask for a precise delivery statement. Name the business treatment changed and distinguish it from other requested scenario work.

That is the standard I bring to this kind of review: a concrete transaction question, a correction with a defined scope, and a clear account of what reached the system. Use that standard when deciding whether an acquisition comparison is ready for wider scrutiny.
