---
title: "Triten’s Rent Roll: Matching the Report, Explaining the Differences"
slug: getting-tritens-rent-roll-to-reconcile-with-its-source-report
type: case-study
description: At Triten, I reconciled a rent roll with its source report, explained remaining differences and added a nightly dashboard check against source business records.
date: 2026-11-23
updated: 2026-11-23
status: draft
project: triten-os
audience: COOs, fund executives, asset managers and real estate operators
primary_keyword: rent roll reconciliation
secondary_keywords:
  - dashboard accuracy
  - real estate reporting
  - source report reconciliation
  - reporting reliability
answer: I aligned Triten’s rent roll with its source report’s unit areas, vacant rows and totals.[^E3][^E4] Remaining differences were labelled by cause, including missing source information, deposit held versus required, and area edits.[^E3][^E4] I also added a nightly dashboard check against source accounting records and an operating list.[^E5]
hero_image: /images/articles/getting-tritens-rent-roll-to-reconcile-with-its-source-report.webp
hero_alt: Conceptual illustration of an executive reviewing a rent roll alongside its source report and annotated discrepancies
faq:
  - q: What did accuracy mean for this assignment?
    a: The acceptance standard was faithful representation of the source information.[^E2]
  - q: Did reconciliation eliminate every difference?
    a: The reconciliation retained remaining discrepancies with explanations of their causes.[^E3][^E4]
cta: book
claims:
  - text: At Triten, rent-roll results were empty or incomplete, and dashboard accuracy was being questioned.
    kind: outcome
    evidence:
      - E1
  - text: I set the acceptance standard as faithfully representing the source.
    kind: capability
    evidence:
      - E2
  - text: For remaining deposit discrepancies, the reconciliation identified the distinction between deposits held and deposits required.
    kind: capability
    evidence:
      - E3
      - E4
  - text: Unit-area edits were identified as another cause of remaining differences.
    kind: capability
    evidence:
      - E3
      - E4
  - text: Missing source information also received its own discrepancy label.
    kind: capability
    evidence:
      - E3
      - E4
  - text: The resulting rent roll matched the source report’s treatment of unit areas, vacant rows and totals.
    kind: outcome
    evidence:
      - E3
      - E4
  - text: I added a nightly dashboard-accuracy check against source accounting records and an operating list.
    kind: capability
    evidence:
      - E5
  - text: I aligned Triten’s rent roll with its source report’s unit areas, vacant rows and totals.
    kind: outcome
    evidence:
      - E3
      - E4
  - text: Remaining differences were labelled by cause, including missing source information, deposit held versus required, and area edits.
    kind: capability
    evidence:
      - E3
      - E4
  - text: I also added a nightly dashboard check against source accounting records and an operating list.
    kind: capability
    evidence:
      - E5
  - text: The acceptance standard was faithful representation of the source information.
    kind: capability
    evidence:
      - E2
  - text: The reconciliation retained remaining discrepancies with explanations of their causes.
    kind: capability
    evidence:
      - E3
      - E4
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

## Can management accept the rent roll for review?

At Triten, rent-roll results were empty or incomplete, and dashboard accuracy was being questioned.[^E1]

The immediate management question in that situation is whether to accept the report as a basis for review. Before interpreting occupancy, tenancy or other operating information, establish what the report actually represents. An empty result deserves investigation before anyone assigns it a business meaning.

For a fund executive or operator, keep that acceptance decision separate from the decisions made using the report. First establish whether the reporting is fit for its stated purpose. Then consider what the information says about the business. Ask the team responsible for delivery to address the reporting question directly, with a comparison that can be examined.

That was the scope of this assignment: reconciliation. The relevant management decision was about accepting the representation of the source, rather than choosing a course of action for an asset. Keep the sign-off attached to that specific requirement.

## What did I change, and how did I handle a concrete discrepancy?

I set the acceptance standard as faithfully representing the source.[^E2]

That decision fixed the reference point for the work. It gave “accurate” a specific meaning for this assignment. In a review, use that definition to judge the delivery; raise proposed changes to the underlying business information as separate requests.

The deposit discrepancy makes the distinction concrete. For remaining deposit discrepancies, the reconciliation identified the distinction between deposits held and deposits required.[^E3][^E4]

Read those terms literally: the amount held and the amount required answer different questions. Before asking someone to make them agree, decide which question the report is supposed to answer. A requirement describes an obligation; a holding describes what is already held. Keep those meanings visible when reviewing the comparison.

My handling of that discrepancy was to identify its cause. For an executive reviewing such an exception, the next instruction should be precise: confirm the intended deposit measure before requesting a correction. Avoid giving a team an open-ended instruction to remove a difference without first deciding which value belongs in the report.

Unit-area edits were identified as another cause of remaining differences.[^E3][^E4] For this category, ask which version of the area belongs in the comparison and who can approve a change. Keep the approval question tied to the actual edited information.

Missing source information also received its own discrepancy label.[^E3][^E4] Treat that category as a request to investigate the reference information. Ask for the absent information or an explicit decision about how its absence should be represented. Do not ask a reporting team to fill a gap with an assumption simply to make the review look complete.

## What was different after the reconciliation?

The resulting rent roll matched the source report’s treatment of unit areas, vacant rows and totals.[^E3][^E4]

That is the delivered result to assess. For acceptance, keep the comparison attached to those dimensions. Review the entries as well as the aggregate, and give approval a clearly stated scope. A sign-off should say what was checked and which reporting requirement it satisfies.

I added a nightly dashboard-accuracy check against source accounting records and an operating list.[^E5] Its practical role is recurring comparison: checking for discrepancies as part of the reporting operation. Make review of that check part of the operating conversation, including who examines a finding and what evidence is needed to close it.

Keep the recurring check and the response to a finding together in your requirements. Specify the comparison, the owner and the review expectation. Assess the delivered check on its stated coverage, and assess the handling of exceptions through the decisions recorded against them.

## What should you ask of your team or vendor?

Start the acceptance conversation with the business decision that the report is intended to support. Name that decision explicitly. Then require the reporting scope to be specific enough for the person making it to understand what they are accepting.

Ask for the evidence behind sign-off. Request a representative comparison and walk through an exception with the person responsible for the report. Keep the conversation on the meaning of the information, the reason for the difference and the authority needed to resolve it. Leave presentation preferences until that discussion is complete.

Assign ownership at the point where a judgment is required. Decide who approves changes to business information, who accepts the reporting and who follows up on unresolved exceptions. Put those responsibilities into the delivery requirements so that acceptance has a named owner.

Finally, define what happens after launch. Ask how recurring findings enter the review process, how an unresolved item stays visible and who decides it is closed. Require a concrete answer that fits your organisation’s reporting responsibilities. Make that operating arrangement part of what you buy and part of what you accept.
