---
title: The Rent Roll Matched. The Remaining Differences Still Needed Answers.
slug: getting-tritens-rent-roll-to-reconcile-with-its-source-report
type: case-study
description: A rent-roll reconciliation that matched the source report, explained differences and clarified what executives should require before accepting reporting.
date: 2026-11-23
updated: 2026-11-23
status: draft
project: triten-os
audience: COOs, fund executives, asset managers and real estate operators
primary_keyword: rent roll reconciliation
secondary_keywords:
  - dashboard accuracy
  - real estate reporting
  - reporting reconciliation
  - reporting reliability
answer: The reconciliation brought the rent roll into agreement with its source report’s unit areas, vacant rows and totals.[^E3][^E4] Outstanding discrepancies received explanations covering absent source information, deposit definitions and area changes.[^E3][^E4] A nightly dashboard check also compared against source accounting records and an operating list.[^E5]
hero_image: /images/articles/getting-tritens-rent-roll-to-reconcile-with-its-source-report.webp
hero_alt: Conceptual illustration of a rent roll beside its source report, with a deposit discrepancy highlighted
faq: []
cta: book
claims:
  - text: The starting problem was empty or incomplete rent-roll results, accompanied by questions about dashboard accuracy.
    kind: outcome
    evidence:
      - E1
  - text: For this work, accuracy meant faithfully showing what the source contained.
    kind: capability
    evidence:
      - E2
  - text: The reconciliation identified deposits held versus deposits required as a cause of remaining differences.
    kind: capability
    evidence:
      - E3
      - E4
  - text: Missing source information and unit-area edits were also labelled as causes of remaining discrepancies.
    kind: capability
    evidence:
      - E3
      - E4
  - text: The resulting rent roll matched the source report’s basis for unit areas, vacant rows and totals.
    kind: outcome
    evidence:
      - E3
      - E4
  - text: A nightly dashboard-accuracy check compared against source accounting records and an operating list.
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

## What was wrong with the reporting?

The starting problem was empty or incomplete rent-roll results, accompanied by questions about dashboard accuracy.[^E1]

For an executive opening that report, the immediate question is basic: what am I actually reviewing? I do not read an empty output as evidence that there is nothing to report. Before discussing the business, I want the reporting problem addressed on its own terms.

That distinction matters to how I judge a delivery. A rent roll is supposed to describe something specific. When the output is incomplete, asking whether the dashboard looks finished misses the issue. The review needs to reach the information underneath the presentation.

I keep the business question concrete: can the person presenting this report show how it relates to the report it came from? That is the conversation I want with a reporting team or vendor before accepting delivery. Screenshots and demonstrations belong alongside that comparison. Ask to see the actual reporting requirement examined, including the parts that are awkward to explain.

## What changed in the way accuracy was judged?

For this work, accuracy meant faithfully showing what the source contained.[^E2]

I use that definition literally. Start with the source report and ask what its entries mean. Resist the urge to treat every disagreement as an instruction to change a value. First establish whether the comparison is asking the same business question on both sides.

The reconciliation identified deposits held versus deposits required as a cause of remaining differences.[^E3][^E4]

That is the most useful example in this repair. Read the terms as an executive: “held” asks what is held; “required” asks what is required. Before requesting an adjustment, ask which of those questions the report is intended to answer. A request to make the values agree is premature until that meaning is settled.

The example requires no invented tenant, amount or transaction. Put the competing definitions beside each other and ask the reviewer to choose the intended measure. Then judge the discrepancy against that choice. My concern is whether the explanation addresses the business meaning of the information, rather than merely describing a visible mismatch.

Missing source information and unit-area edits were also labelled as causes of remaining discrepancies.[^E3][^E4]

Those categories call for different review questions. For an absent source entry, ask what information should have been available. For an area edit, ask which version belongs in the comparison. Keep each question attached to the relevant difference. An instruction to “fix the report” leaves too much interpretation to the person receiving it.

## What was different in the delivered result?

The resulting rent roll matched the source report’s basis for unit areas, vacant rows and totals.[^E3][^E4]

Those are concrete dimensions on which to examine the delivery. In a review, I ask to see the area basis, the treatment of vacancy and the aggregate together. Each belongs in the conversation about what the rent roll represents. Do not let the discussion end with a single total displayed on a dashboard.

Vacant rows deserve a deliberate place in that review. Ask whether the comparison includes them and how the source treats them. For areas, ask which basis is being used. For totals, ask what entries contribute to the figure. These are business questions a reporting owner should be prepared to discuss without taking the executive through implementation details.

A nightly dashboard-accuracy check compared against source accounting records and an operating list.[^E5]

That recurring comparison belongs in the operating review as a separate item. Ask what happens when it finds a discrepancy: who receives the finding, who investigates it and who decides the response. Those are questions to resolve with the provider. Keep the existence of a check and the responsibility for acting on its findings explicit in the discussion.

## What should you require before accepting a reporting system?

Require a source comparison and an explanation of unresolved differences. That is my buyer takeaway from this repair.

Make the request specific enough to examine. Ask the provider to bring the source report, the delivered output and the explanation for an outstanding discrepancy to the same review. Walk through that discrepancy in ordinary business language. Ask what differs, why it differs and whether a change is actually required.

Keep the acceptance conversation focused on that evidence. A broad assurance about accuracy gives the reviewer little to inspect. A concrete comparison gives the discussion a defined subject. The person accepting the system should be able to point to what was examined and understand the explanation offered.

I judge reporting work by that standard. Before accepting the delivery, ask the team to demonstrate the relationship to the source and account for what remains unresolved. Make that demonstration part of the purchase and the review.
