---
title: Fund Onboarding Beyond the Live Feed
slug: fund-onboarding-beyond-the-live-feed
type: field-note
description: "How I addressed fund onboarding gaps at Black Mountain Fund: missing account history, controlled record corrections and calculation prerequisites at creation."
date: 2026-11-05
updated: 2026-11-05
status: draft
audience: Fund executives, COOs and operators evaluating replacement business systems
primary_keyword: fund onboarding
secondary_keywords:
  - historical transaction backfill
  - fund system migration
  - transaction correction controls
  - fund calculation readiness
answer: I addressed Black Mountain Fund's onboarding gaps through clearer account-connection steps, reviewed historical imports and bounded transaction corrections.[^E1][^E2][^E3] New-workspace setup also includes the configuration and opening valuation needed for calculations.[^E4] The reported outcome covers application changes, with customer onboarding completion outside its scope.
hero_image: /images/articles/fund-onboarding-beyond-the-live-feed.webp
hero_alt: Conceptual illustration of fund records moving through account connection, historical review and controlled corrections into a configured workspace
faq:
  - q: Why weren't live account connections enough?
    a: For this long-running fund, provider feeds did not cover the full historical requirement. I added a document-based review route for bringing in the missing history.[^E2]
  - q: Can bulk corrections change transaction amounts?
    a: No. Group corrections cover selected descriptive and assignment details. Quantities, values and fees require inspection record by record.[^E3]
  - q: What happens when an import contains rejected rows?
    a: For real estate transaction files, acceptable records can be imported while rejected entries receive specific explanations and guidance for correction.[^E3]
  - q: What changed when a workspace is created?
    a: Creation now establishes the default settings and initial cash valuation that the calculation engine needs, together with the fund and its opening deposit.[^E4]
  - q: Does this establish that customer onboarding was completed?
    a: This account claims changes to the application, without asserting a completed customer onboarding. The integration record also reserves production cutover approval as a separate decision.[^E5]
cta: book
claims:
  - text: Live account connections could not supply all the history needed to onboard a long-running fund at Black Mountain Fund.
    kind: capability
    evidence:
      - E2
  - text: The replacement application's onboarding created a workspace without guiding the user through account connection, and investors arrived at an empty dashboard.
    kind: outcome
    evidence:
      - E1
  - text: New workspaces lacked the starting configuration and opening valuation required by the calculation engine, causing calculations to fail.
    kind: outcome
    evidence:
      - E4
  - text: Account connection became an explicit onboarding step for bank, brokerage and crypto accounts, with a skip option that continues to review and keeps connection tasks on the dashboard checklist.
    kind: capability
    evidence:
      - E1
  - text: Investors now see a checklist drawn from the same shared progress record used by the onboarding process.
    kind: capability
    evidence:
      - E1
  - text: The empty investor dashboard was replaced with next actions, explanations of why they matter and direct links to take them.
    kind: capability
    evidence:
      - E1
  - text: Historical backfill was added through the existing document intake process, using its upload, extraction, validation and accept-or-reject review stages.
    kind: capability
    evidence:
      - E2
  - text: Historical coverage is assessed according to what each provider can supply; unknown providers and connections limited by record count receive no assumed calendar coverage.
    kind: capability
    evidence:
      - E2
  - text: "Bulk editing supports selected transaction details: notes, source, account or asset assignment, and settlement date."
    kind: capability
    evidence:
      - E3
  - text: Transaction quantities, values and fees remain on an individual-record review path, where each number is visible.
    kind: capability
    evidence:
      - E3
  - text: Bulk corrections check permission for every selected record and apply the batch together or reject it; each changed record receives an audit entry identifying the full affected selection.
    kind: capability
    evidence:
      - E3
  - text: For real estate transaction imports, valid rows can proceed while rejected rows are reported with their row, column, rejection reason and corrective guidance.
    kind: capability
    evidence:
      - E3
  - text: Workspace creation now supplies the default configuration and opening cash valuation alongside the fund and initial deposit, providing calculation prerequisites.
    kind: capability
    evidence:
      - E4
  - text: The onboarding and backfill work was included in a broader integration whose record explicitly separates merging from production cutover approval.
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

## Why was a live connection insufficient for onboarding?

I judge a replacement system by what it takes to bring an existing operation into it. For a fund executive, opening an account is only the start of that question. Acceptance should cover the records being carried forward, the exceptions awaiting decisions and the prerequisites for using those records.

At Black Mountain Fund, live account connections could not supply all the history needed to onboard a long-running fund.[^E2] The replacement application's onboarding also created a workspace without guiding the user through account connection, and investors arrived at an empty dashboard.[^E1] Separately, new workspaces lacked the starting configuration and opening valuation required by the calculation engine, causing calculations to fail.[^E4]

I treated those as parts of the same business problem: what must be true before an existing fund can begin operating in its replacement system? That question set the scope of the work.

## What did I change about the onboarding journey?

I made connecting bank, brokerage and crypto accounts an explicit onboarding step, with a skip option that continues to review and keeps connection tasks on the dashboard checklist.[^E1]

Investors now see a checklist drawn from the same shared progress record used by the onboarding process.[^E1] I also replaced the empty investor dashboard with next actions, explanations of why they matter and direct links to take them.[^E1]

My decision was to make the next action part of the experience itself. An executive reviewing onboarding should ask what happens after each decision, including a decision to defer something. A screen being available somewhere in the application is a weak acceptance criterion. The useful question is whether the intended user is actually led to it at the appropriate point.

## How does the fund bring in history a connection cannot supply?

I added historical backfill through the existing document intake process, using its upload, extraction, validation and accept-or-reject review stages.[^E2]

The system assesses historical coverage according to what each provider can supply; unknown providers and connections limited by record count receive no assumed calendar coverage.[^E2]

That was a deliberate standard for deciding what to trust. I wanted the acceptance discussion to start with the fund's required history. It should not start with whatever happens to be available from a connection.

For the operator responsible for sign-off, the important questions are which periods must be represented and what evidence will establish that they are present. Ask those questions before agreeing that a migration is complete. The definition of completeness belongs with the business requirement.

## How much can a manager change in a bulk correction?

I added bulk editing for selected transaction details: notes, source, account or asset assignment, and settlement date.[^E3] Quantities, values and fees remain on an individual-record review path, where each number is visible.[^E3]

A bulk correction checks permission for every selected record and applies the batch together or rejects it; each changed record receives an audit entry identifying the full affected selection.[^E3]

For real estate transaction imports, valid rows can proceed while rejected rows are reported with their row, column, rejection reason and corrective guidance.[^E3]

I treated correction authority as a business decision. The acceptance discussion should cover how much a manager can change in a single action, what deserves individual inspection and what a later reviewer should be able to establish.

Ask a vendor to demonstrate an exception as well as a clean import. Give the review equal weight: who is expected to act on a rejection, and what information should that person receive before making a correction? Those are operating questions, even when the work sits inside a software project.

## What changed at the calculation starting line?

I updated workspace creation to supply the default configuration and opening cash valuation alongside the fund and initial deposit.[^E4]

My acceptance question was specific: does creation establish the starting conditions the calculation engine expects? For a fund operator, that belongs in the definition of a usable workspace. It should be settled before the handoff is accepted.

The onboarding and backfill work was included in a broader integration whose record explicitly states that merging is separate from production cutover approval.[^E5] A completed customer onboarding is outside the outcome I claim here.

That boundary matters when assessing delivery. Ask for the exact acceptance event behind a progress report. Application changes, operational acceptance and launch approval should each have a clear owner and a clear meaning.

## What should you ask of your own organisation or vendor?

Start with the fund you already operate. Ask the team proposing a replacement to explain what evidence you will review before accepting it.

Which historical periods are required? Who has authority to accept an unresolved exception? What should happen when an operator defers a task? Which decisions belong to the person preparing the records, and which belong to the person approving them?

Then agree what sign-off means. Define the evidence, the reviewer and the decision being made. Keep the standard concrete enough that an operator can challenge it without needing to understand the software's construction.

My recommendation is to make those acceptance questions part of the buying conversation. Ask for a demonstration using the kinds of incomplete records and unresolved decisions your team expects to encounter. Judge the proposal against the responsibilities your operators will carry after the handoff.
