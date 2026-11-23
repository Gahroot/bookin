---
title: Before Calling a Rent Roll Accurate
slug: getting-tritens-rent-roll-to-reconcile-with-its-source-report
type: case-study
description: An incomplete rent roll raised a reporting question. I defined the source standard, reconciled the report and made remaining differences explicit for review.
date: 2026-11-23
updated: 2026-11-23
status: draft
project: triten-os
audience: Asset managers, fund executives, COOs and real estate operators
primary_keyword: rent roll reconciliation
secondary_keywords:
  - dashboard accuracy
  - real estate reporting
  - reporting basis
  - operating report reconciliation
answer: I reconciled a rent roll to its source report’s treatment of unit areas, vacant entries and totals.[^E3][^E4] Remaining discrepancies received cause labels, including missing source information and area edits.[^E3][^E4] The acceptance criterion was faithful representation of the source, giving the review a specific reporting standard.[^E2]
hero_image: /images/articles/getting-tritens-rent-roll-to-reconcile-with-its-source-report.webp
hero_alt: Conceptual illustration of a rent roll beside its source report, with a vacant entry and an annotated area difference
faq: []
cta: book
claims:
  - text: Rent rolls were returning empty or incomplete results, and the review raised a question about dashboard accuracy.
    kind: outcome
    evidence:
      - E1
  - text: I made faithful representation of the source the acceptance standard.
    kind: capability
    evidence:
      - E2
  - text: I aligned the rent roll with the source report’s unit areas, vacant rows and totals.
    kind: outcome
    evidence:
      - E3
      - E4
  - text: The reconciliation labels causes of remaining differences, including missing source information and unit-area edits.
    kind: capability
    evidence:
      - E3
      - E4
  - text: I added a nightly dashboard accuracy check against source accounting records and an operating list.
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

## What decision did the incomplete report put in question?

Rent rolls were returning empty or incomplete results, and the review raised a question about dashboard accuracy.[^E1]

For an executive looking at that result, the immediate decision is whether to accept the report for use. Does an empty result mean the source contains nothing to report? Does it mean information has been omitted? What evidence belongs beside the dashboard before someone signs off?

That distinction deserves attention before discussing presentation. An empty space has no explanation of its own. Reading it as an operating fact requires a basis; treating it as a reporting defect requires investigation. The appearance alone cannot settle which interpretation belongs in the review.

The useful business problem here is therefore specific: what should count as an acceptable representation of the operating source? That question belongs with whoever accepts the report, alongside whoever builds it. It concerns the meaning of the information presented to management, including the meaning of an absence. A polished screen should face the same scrutiny as a spreadsheet submitted for approval.

## What did I decide accuracy should mean?

I made faithful representation of the source the acceptance standard.[^E2]

The consequential judgment is where to place the authority for the comparison. For this assignment, that authority was the source report. The review concerned whether the dashboard deserved acceptance on that basis. Any proposed departure needed to be considered as a change in interpretation, with its own justification.

Consider the treatment of unit area. Which area belongs in the comparison: the area recorded in the reference report, or an edited value? Calling either value reasonable does not answer the reconciliation question. The relevant issue is which version the report is supposed to represent. An area correction and a faithful copy are separate requirements; approving a correction should be an explicit business decision.

Vacant entries deserve equally deliberate treatment. Should they appear in the report being reconciled? What does their inclusion mean for the scope of that report? These are questions about the population under review. They belong in the acceptance criteria alongside the total, rather than being dismissed as details of the display.

This is why I treat reporting definitions as part of the assignment itself. The reference report expresses choices about what belongs. A review should examine those choices before judging the presentation. Otherwise, the word “accurate” leaves the most consequential part of the requirement unstated: accurate according to whose definition of the report?

## What was verified, and what still needed explanation?

I aligned the rent roll with the source report’s unit areas, vacant rows and totals.[^E3][^E4]

Those dimensions define the verified result. The outcome is a reconciliation on a specified reporting basis. Acceptance should attach to that scope, with any broader assurance requiring its own evidence.

The reconciliation labels causes of remaining differences, including missing source information and unit-area edits.[^E3][^E4]

The unit-area category is a concrete example of the judgment involved. An edited area raises a version question: which value belongs in this comparison? The label identifies the nature of the discrepancy. Whether the edit should become the accepted value remains a separate question for the business. Explaining a difference and approving the underlying change are distinct decisions.

Missing source information presents a different issue. What should the reporting requirement say when the reference itself lacks an entry? Should the dashboard preserve that absence, identify it for review, or follow an expressly approved rule? The answer belongs in the definition of the report. It should be considered directly, without treating an unexplained blank as sufficient evidence of either correctness or failure.

That distinction also sets the boundary of the accomplishment. The record supports alignment and explanations for remaining differences. Resolving every underlying source issue would be a further result requiring separate verification.

I added a nightly dashboard accuracy check against source accounting records and an operating list.[^E5]

A recurring comparison raises its own acceptance questions: what happens when it identifies a discrepancy, and what evidence closes the issue? Those questions deserve explicit operating requirements. The existence of a scheduled check should be assessed separately from the organisation’s decisions about review and resolution.

## What should you require before accepting your own dashboard?

Bring the reporting basis into the acceptance conversation. Ask your team or vendor to name the reference report, explain the inclusion rules and distinguish a reporting discrepancy from a proposed change to the underlying information. Keep the discussion close to the actual entries under review; a plausible total is an insufficient answer to a question about an omitted row or an edited area. Then decide who has authority to accept each kind of difference. The strongest question to take into that meeting is: “Accurate against which report, on what basis, and how should we handle a difference?”
