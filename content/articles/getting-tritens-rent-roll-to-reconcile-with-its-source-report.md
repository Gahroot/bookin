---
title: Getting Triten’s Rent Roll to Reconcile With Its Source Report
slug: getting-tritens-rent-roll-to-reconcile-with-its-source-report
type: case-study
description: At Triten, I aligned a rent roll dashboard with its source report and added nightly checks. Here is what executives should ask before relying on the numbers.
date: 2026-11-23
updated: 2026-11-23
status: draft
project: triten-os
audience: Asset managers, COOs and operators of real estate funds
primary_keyword: operating dashboard reconciliation
secondary_keywords:
  - rent roll reconciliation
  - real estate reporting
  - dashboard source alignment
  - operating report accuracy
answer: At Triten, I brought a rent roll dashboard onto its source report’s basis for unit areas, vacant rows and totals.[^E3][^E4] Discrepancies carry explanations, and dashboards receive nightly comparisons with source records.[^E3][^E5] The executive standard is a named reporting basis, visible differences and evidence of continuing checks.
hero_image: /images/articles/getting-tritens-rent-roll-to-reconcile-with-its-source-report.webp
hero_alt: Illustrative comparison of a rent roll dashboard and its source report, showing totals and explanations for differences
faq:
  - q: What did the rent roll reconciliation cover?
    a: The work brought unit areas, vacant entries and report totals onto the same basis as the operating source.[^E3][^E4]
  - q: How are remaining discrepancies explained?
    a: The reconciliation identifies reasons for differences, including missing source information and edits to unit areas.[^E3][^E4]
  - q: Does this establish universal dashboard accuracy?
    a: No. The evidence covers the rent roll alignment, explanations for remaining differences and nightly dashboard comparisons against source records. That supports a defined reporting result, without proving that every future report will be flawless.[^E3][^E4][^E5]
cta: book
claims:
  - text: At Triten, rent rolls were returning empty or incomplete results, prompting the team to question whether the dashboards faithfully reflected the operating source.
    kind: outcome
    evidence:
      - E1
  - text: I used faithful representation of the source as the acceptance standard for this work.
    kind: capability
    evidence:
      - E2
  - text: I aligned the rent roll with the source report’s unit areas, vacant rows and totals.
    kind: outcome
    evidence:
      - E3
      - E4
  - text: The reconciliation labels the causes of remaining differences, including missing source information and unit-area changes.
    kind: capability
    evidence:
      - E3
      - E4
  - text: I added nightly dashboard checks against source accounting and operating records.
    kind: capability
    evidence:
      - E5
evidence:
  - id: E1
    kind: worklog
    title: Triten private build record (worklog)
    date: 2026-11-12
    public: false
    ref: wl-2026-11-12-triten-os-2
  - id: E2
    kind: worklog
    title: Triten private build record (worklog)
    date: 2026-11-12
    public: false
    ref: wl-2026-11-12-triten-os-4
  - id: E3
    kind: worklog
    title: Triten private build record (worklog)
    date: 2026-11-12
    public: false
    ref: wl-2026-11-12-triten-os-20
  - id: E4
    kind: github-commit
    title: Triten private build record (commit)
    date: 2026-11-12
    public: false
    ref: triten-os@e2aa478497a6
  - id: E5
    kind: github-commit
    title: Triten private build record (commit)
    date: 2026-11-12
    public: false
    ref: triten-os@86ba7d63f0d4
---

## What was wrong with the rent roll?

At Triten, rent rolls were returning empty or incomplete results, prompting the team to question whether the dashboards faithfully reflected the operating source.[^E1]

That is the right moment to stop discussing presentation. Before asking whether a dashboard is useful, ask what its figures represent. An empty result deserves a direct question: is there nothing in the underlying report, or is something missing from the dashboard? Those are different situations. An executive should not have to guess which situation they are looking at.

For an asset manager, the immediate concern is the basis for a decision. For a COO, it is the standard the organisation uses before calling a report ready. Neither question calls for another chart. Both call for a comparison with the report the team already relies on.

I frame that comparison as an acceptance question: show me the operating report, show me the dashboard, and account for the difference. Do not start with whether the total looks plausible. Start with whether the dashboard represents the same underlying information.

That distinction matters to the scope of the assignment. “Make the dashboard accurate” is an ambition. “Make it faithfully reflect this source report” is a requirement against which to review the work. The executive decision is to name that reference before accepting the result.

## What did I change?

I used faithful representation of the source as the acceptance standard for this work.[^E2]

That gives the discussion a concrete boundary. The dashboard should answer for its treatment of the source. Questions about the source itself belong in the review too, but they should be identified as source questions. Otherwise, a conversation about a reporting discrepancy becomes a conversation about everything at once.

I aligned the rent roll with the source report’s unit areas, vacant rows and totals.[^E3][^E4]

Those are business definitions, not display preferences. In a review, ask which area belongs in the comparison, whether vacant entries belong in the report, and which total is being reconciled. Require explicit answers before approving the presentation. A total on its own is too narrow an acceptance requirement; ask to see the basis beneath it.

Require approval for any intentional change in how the business is represented. If a different interpretation is intentional, require it to be named and approved as such.

This is also a useful boundary for a vendor conversation. Ask the vendor to explain the report in the language of operations. Keep the discussion on inclusion, omission and meaning. An explanation of how the software was built is no substitute for an answer about what belongs in the report.

## What is different now?

The reconciliation labels the causes of remaining differences, including missing source information and unit-area changes.[^E3][^E4]

This is the point where the executive review should become specific. For a discrepancy attributed to missing information, ask what is absent. For a discrepancy attributed to an edit, ask which version belongs in the comparison. Require a cause that someone can examine, rather than accepting “the systems differ” as the end of the discussion.

An explained difference should still receive a decision. Does it require correction? Does it belong with the owner of the source report? Is it an accepted difference in reporting basis? These are management questions. Keep them visible instead of treating every discrepancy as an interchangeable technical defect.

I also added nightly dashboard checks against source accounting and operating records.[^E5]

A recurring check belongs in the operating standard alongside the acceptance review. Ask what is compared, what falls outside the comparison, and what the organisation expects to happen after a discrepancy. Treat those as requirements to verify; the existence of a scheduled check should not answer them by implication.

Keep the conclusion bounded. A promise of flawless reporting under every future condition goes beyond this record. Ask for evidence about the report and the check in front of you, and reserve broader conclusions for broader evidence.

## What should you ask of your organisation or vendor?

Start with the report your executives already use to settle a question. Name it explicitly. Then ask whoever owns the dashboard to describe the relationship between that report and the figures presented for decisions.

Make the review concrete: which entries belong, which definitions apply, and what deserves an explanation? Avoid accepting a general assurance when the question concerns a particular reporting basis. Require the explanation at the level where an operating decision is made.

Ask for the discrepancy discussion before approving the dashboard. What would count as an acceptable difference? Who should decide whether an exception belongs in the source or in the reporting layer? What evidence should accompany that decision? Set those expectations before a disagreement reaches an executive meeting.

Then ask about the continuing standard. What comparison is expected after acceptance? Who should review its scope? What should trigger further investigation? Do not infer an escalation process, ownership arrangement or correction from a statement that checks run. Request evidence for each separately.

For the next dashboard review, bring a sharper question than “Is it accurate?” Ask: “Accurate against which report, on what basis, and how should we handle a difference?”

Take that standard into the room. Approve a defined relationship between an operating source and an executive view. Require explanations where they diverge. Ask for evidence of the continuing comparison. Keep the promise specific enough that your organisation can hold someone accountable for it.
