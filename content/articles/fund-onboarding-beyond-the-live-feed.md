---
title: When a Connected Fund Still Lacks the History It Needs
slug: fund-onboarding-beyond-the-live-feed
type: field-note
description: A connected fund can still lack usable history. How I addressed missing records, correction authority and calculation readiness during fund system onboarding.
date: 2026-11-05
updated: 2026-11-05
status: draft
audience: Fund executives, COOs and operators evaluating fund onboarding and replacement systems
primary_keyword: fund onboarding
secondary_keywords:
  - historical fund records
  - fund system migration
  - transaction correction controls
  - historical backfill
answer: Fund onboarding needs a way to handle history that live connections cannot supply.[^E2] I added backfill through document upload, validation and review.[^E2] Managers can correct selected transaction details in a batch; quantities, values and fees still require inspection of each record.[^E3]
hero_image: /images/articles/fund-onboarding-beyond-the-live-feed.webp
hero_alt: Conceptual illustration of historical fund records passing through review and controlled correction
faq: []
cta: book
claims:
  - text: Live account feeds have historical limits, so connecting accounts alone cannot establish complete history for a long-running fund.
    kind: capability
    evidence:
      - E2
  - text: Managers onboarding years of records lacked a way to correct many transactions together, and rejected import rows gave them no actionable explanation.
    kind: capability
    evidence:
      - E3
  - text: I assigned no assumed calendar coverage to unknown providers or feeds capped by record count, because a record count cannot safely establish a period of history.
    kind: capability
    evidence:
      - E2
  - text: A holding sold down completely can disappear from the records returned by a connector.
    kind: capability
    evidence:
      - E2
  - text: I added historical backfill through the existing document intake process, using its upload, extraction, validation and accept-or-reject review stages.
    kind: capability
    evidence:
      - E2
  - text: I added bulk transaction corrections for notes, source, account or asset assignment, and settlement date.
    kind: capability
    evidence:
      - E3
  - text: Quantities, values and fees remain subject to individual-record review, where each number is visible.
    kind: capability
    evidence:
      - E3
  - text: Every selected transaction is checked for the manager's authority, the batch applies together or fails, and each changed record receives an audit entry identifying the full affected selection.
    kind: capability
    evidence:
      - E3
  - text: Real estate file imports now apply valid rows while reporting every rejected row, its column, the reason for rejection and guidance for correction; operators can correct the listed rows and upload again.
    kind: capability
    evidence:
      - E3
  - text: I made account connection an explicit onboarding step, with deferred connections retained as tasks on the dashboard checklist.
    kind: capability
    evidence:
      - E1
  - text: Workspace creation now supplies default configuration and an opening cash valuation with the fund and initial deposit, providing calculation prerequisites that were previously missing.
    kind: capability
    evidence:
      - E4
  - text: The broader integration included onboarding and historical backfill, and its record explicitly separated merging from production cutover approval.
    kind: outcome
    evidence:
      - E5
evidence:
  - id: E1
    kind: github-commit
    title: Black Mountain Fund private build record (commit)
    date: 2026-09-21
    public: false
    ref: easefolio@c745c1587822
  - id: E2
    kind: github-commit
    title: Black Mountain Fund private build record (commit)
    date: 2026-09-21
    public: false
    ref: easefolio@f4b8f8fb3c87
  - id: E3
    kind: github-commit
    title: Black Mountain Fund private build record (commit)
    date: 2026-09-21
    public: false
    ref: easefolio@7d956eef0114
  - id: E4
    kind: github-commit
    title: Black Mountain Fund private build record (commit)
    date: 2026-09-22
    public: false
    ref: easefolio@80fc5ed4761f
  - id: E5
    kind: github-pr
    title: Black Mountain Fund private build record (pr)
    date: 2026-09-28
    public: false
    ref: easefolio#pr-13
---

## Why could a connected fund still lack what it needed?

For a fund executive, onboarding is a decision about whether an existing operation is ready to rely on a new system. I start with the records the business needs to carry forward. A successful connection is only part of that discussion.

Live account feeds have historical limits, so connecting accounts alone cannot establish complete history for a long-running fund.[^E2] Managers onboarding years of records also lacked a way to correct many transactions together, and rejected import rows gave them no actionable explanation.[^E3]

I treated those gaps as an operating problem: how does a manager bring in missing history, inspect what needs attention and make an appropriate correction? That became the organising question for the work. I wanted an explicit route through an exception, with a clear boundary around the authority exercised along the way.

## What history did I decide the system could trust?

The consequential decision was how to treat uncertainty. I chose to require evidence of historical coverage before treating a connection as sufficient for that purpose.

I assigned no assumed calendar coverage to unknown providers or feeds capped by record count, because a record count cannot safely establish a period of history.[^E2]

Consider a holding that no longer appears in the connected account. A holding sold down completely can disappear from the records returned by a connector.[^E2] Its absence raises a different question from whether today's connection is working: where is the evidence of the earlier activity? That is the question I wanted the onboarding process to confront.

I added historical backfill through the existing document intake process, using its upload, extraction, validation and accept-or-reject review stages.[^E2]

My judgment was to accept the inconvenience of asking for a statement when coverage was uncertain. I wanted an operator to make a visible decision about the historical record. The alternative assumption—that whatever arrived must be sufficient—was not an acceptable basis for calling the history complete.

## How could managers correct records without unrestricted bulk authority?

I added bulk transaction corrections for notes, source, account or asset assignment, and settlement date.[^E3] Quantities, values and fees remain subject to individual-record review, where each number is visible.[^E3]

I did not treat every correction as an equivalent decision. Assigning a group of records to an account is organisational work. Changing the amount recorded for an event changes what the record says happened. That distinction determined where I drew the boundary.

The tradeoff was deliberate: I accepted individual review for the fields that describe the economics of a transaction. Convenience alone was not a sufficient reason to give a manager broader authority. For an executive, the useful question is which decisions deserve inspection before they become part of the fund's record.

Every selected transaction is checked for the manager's authority, the batch applies together or fails, and each changed record receives an audit entry identifying the full affected selection.[^E3]

For a concrete import exception, take a real estate file containing both usable and rejected rows. Real estate file imports now apply valid rows while reporting every rejected row, its column, the reason for rejection and guidance for correction; operators can correct the listed rows and upload again.[^E3]

That is the kind of demonstration I want in an operational review. Present an exception and ask the person responsible for the records to explain their next decision. Assess whether the explanation is specific enough to act on, and whether the proposed correction falls within that person's authority. A clean sample file leaves those questions untested.

## What did the delivered application support?

I made account connection an explicit onboarding step, with deferred connections retained as tasks on the dashboard checklist.[^E1] Workspace creation now supplies default configuration and an opening cash valuation with the fund and initial deposit, providing calculation prerequisites that were previously missing.[^E4]

The broader integration included onboarding and historical backfill, and its record explicitly separated merging from production cutover approval.[^E5]

I judge this work at that stated boundary. For an executive assessing a delivery, the acceptance event should be explicit: what decision is being requested, and what evidence is available to make it? Keep that question attached to the actual handoff.

## What should you ask before accepting your own system?

Bring the discussion back to the operation you already run. Ask your team or vendor to demonstrate the difficult case using records representative of your business, then answer these acceptance questions:

- **Which historical periods can you demonstrate are covered, and what happens where coverage is unknown?** Ask for the basis of the coverage decision. Set the required period before reviewing what a connection happens to return.
- **Which corrections can an operator make together, and which require individual inspection?** Name the fields, the authority required and the evidence a later reviewer should expect. Treat that boundary as a management decision.
- **What remains for the business to approve before the system becomes operational?** Ask for a precise acceptance event and an accountable owner. Make the demonstration address the unresolved records and decisions your team will actually inherit.
