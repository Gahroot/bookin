---
title: Fixing Blocked Investor Requests at Black Mountain Fund
slug: fixing-blocked-investor-requests-at-black-mountain-fund
type: case-study
description: I fixed blocked investor requests in Black Mountain Fund’s assistant and checked the results in production, from investor identification to fund distributions.
date: 2026-11-26
updated: 2026-11-26
status: draft
audience: Fund COOs, investor-relations leaders and fund operators
primary_keyword: AI assistant for fund administration
secondary_keywords:
  - investor administration
  - fund operations
  - capital-call drafting
  - fund assistant production checks
answer: I updated Black Mountain Fund’s assistant and checked investor identification, capital-call drafting and distribution calculations under the partnership agreement in production.[^E2][^E3] Later testing reported answers consistent with live records and a final round needing no corrections.[^E4] The evidence covers those checks without quantifying staff time saved or wider operating gains.[^E1][^E3][^E4]
hero_image: /images/articles/fixing-blocked-investor-requests-at-black-mountain-fund.webp
hero_alt: An illustration of an investor administration request moving from blocked to checked, without client data
faq:
  - q: What was checked in production?
    a: Live verification examined investor recognition, a new limited partner’s capital-call draft and distribution work checked against fund records and the partnership agreement.[^E3]
  - q: Did an acceptable test result always mean the request was fulfilled?
    a: No. The later regression assessment included justified limits caused by unavailable information or filtering, alongside errors the assistant recovered from.[^E1]
  - q: How much staff time did this save?
    a: The supplied record gives no quantified staff-time saving or wider operating benefit; it reports test and production-check results.[^E1][^E3][^E4]
cta: book
claims:
  - text: Early testing at Black Mountain Fund covered 34 cases and recorded 10 errors during system operations, alongside 13 answers saying the assistant could not complete the request.
    kind: outcome
    evidence:
      - E1
  - text: I shipped fixes to the live fund assistant.
    kind: outcome
    evidence:
      - E2
  - text: An expanded test round covered large reviews, conversations that built on earlier answers and requests involving record changes; it exposed a serious bug and other gaps, and I shipped fixes from the harder testing.
    kind: outcome
    evidence:
      - E4
  - text: A later regression run rated all 72 cases acceptable, including recovery from 6 errors in system operations and 2 appropriately limited answers where the application lacked the requested information or filtering.
    kind: metric
    evidence:
      - E1
  - text: Production checks verified investor identification, capital-call drafting for a new limited partner, a distribution figure against the fund’s records and a distribution calculation based on the partnership agreement.
    kind: capability
    evidence:
      - E3
  - text: The later test report recorded answers matching production records, and the final round required no fixes.
    kind: outcome
    evidence:
      - E4
  - text: The supplied evidence documents tests and production checks; it does not quantify staff time saved, response speed or broader operating impact.
    kind: outcome
    evidence:
      - E1
      - E3
      - E4
evidence:
  - id: E1
    kind: worklog
    title: Black Mountain Fund private build record (worklog)
    date: 2026-10-28
    public: false
    ref: wl-2026-10-28-ease-ass-bench-done-9
  - id: E2
    kind: worklog
    title: Black Mountain Fund private build record (worklog)
    date: 2026-10-28
    public: false
    ref: wl-2026-10-28-ease-ass-bench-done-10
  - id: E3
    kind: worklog
    title: Black Mountain Fund private build record (worklog)
    date: 2026-10-29
    public: false
    ref: wl-2026-10-28-black-mountain-fund-70
  - id: E4
    kind: worklog
    title: Black Mountain Fund private build record (worklog)
    date: 2026-10-29
    public: false
    ref: wl-2026-10-28-black-mountain-fund-79
---

## Why were investor requests getting stuck?

For a fund manager, identifying the right investor, preparing a capital call and working through a distribution belong to an administrative obligation. The useful question for an assistant is whether the person asking can finish that obligation.

Early testing at Black Mountain Fund covered 34 cases and recorded 10 errors during system operations, alongside 13 answers saying the assistant could not complete the request.[^E1]

That was the problem I set out to resolve. The acceptance standard needed to be the investor request itself: the intended investor, the required document or the calculation the fund manager needed checked.

A request that stops partway through remains an open item. For the COO assessing the work, a fluent response is an incomplete basis for acceptance. The review needs to reach the point where someone can say what happened to the underlying administrative task.

Errors and legitimate limits also deserve different treatment. An error calls for investigation and repair. A request outside the available information calls for a clear explanation of the boundary. An executive should expect the evaluation to distinguish those situations, with enough detail to decide whether the result is acceptable.

## What changed in the assistant?

I shipped fixes to the live fund assistant.[^E2]

The next question was how to judge the deployed system against the work of investor administration. Each request needs its own definition of completion. For investor identification, ask whether the intended party was resolved. For a capital call, distinguish preparing a draft from sending it. For a distribution, ask what records and agreement support the calculation.

These are acceptance questions for the business owner. A polished demonstration should lead to a discussion of what was checked, who can inspect the result and which part of the obligation remains with the fund team.

An expanded test round covered large reviews, conversations that built on earlier answers and requests involving record changes; it exposed a serious bug and other gaps, and I shipped fixes from the harder testing.[^E4]

That finding matters to how I present the work. A test report should make room for defects discovered during evaluation. The executive reviewing it needs to see the basis for acceptance, including what the testing challenged.

I want a vendor to distinguish a request that ran, a result that was checked and a result that was accepted. Each answers a different question. When a request involves changing records, ask for the intended change and the basis for accepting its result.

## What did the checks establish?

A later regression run rated all 72 cases acceptable, including recovery from 6 errors in system operations and 2 appropriately limited answers where the application lacked the requested information or filtering.[^E1]

Read that assessment with its exceptions attached. A summary score needs a definition of success that the fund team understands. Otherwise, an executive has no clear basis for deciding what the score permits them to rely on.

Production checks verified investor identification, capital-call drafting for a new limited partner, a distribution figure against the fund’s records and a distribution calculation based on the partnership agreement.[^E3]

That is the level of specificity I want in an acceptance record. Name the administrative request and state the reference used to check it. Leave the reviewer with something concrete to assess.

The later test report recorded answers matching production records, and the final round required no fixes.[^E4]

The result belongs to the scope tested. A different request or a new administrative requirement deserves its own assessment.

The supplied evidence documents tests and production checks; it does not quantify staff time saved, response speed or broader operating impact.[^E1][^E3][^E4]

## What should you ask before relying on a fund assistant?

For a COO or head of investor relations, the practical next step is to make the acceptance conversation specific to the requests your team handles. Ask the vendor to bring a request through to a result you can inspect.

### What counts as a completed request?

Have the business owner define the endpoint. Is the deliverable a draft awaiting review, an explanation of a calculation or an authorised change to a record? Keep those endpoints explicit when assessing the evidence. A demonstration should make the status of the work clear.

### What is the answer checked against?

Ask for the reference that supports acceptance. Depending on the request, that may be an investor record, an administrative record or the governing agreement. Decide who in your organisation is responsible for agreeing that the result meets the requirement.

### How are exceptions and business impact reported?

Require the evaluation to separate errors needing repair from requests that reach a legitimate limit. Ask to see what remains unresolved and why the reviewer accepted any limited answer.

Then ask separately for evidence of operating impact. If the business case depends on staff capacity or response times for investors, agree how those outcomes will be measured. Keep the evidence of technical acceptance and the evidence of business value explicit in the investment decision.

If your team is assessing an assistant for investor administration, book a call with me to discuss the requests that need to work and the evidence you should expect.
