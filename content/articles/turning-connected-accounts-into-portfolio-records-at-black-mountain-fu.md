---
title: Connected Was Too Early to Call the Job Finished
slug: turning-connected-accounts-into-portfolio-records-at-black-mountain-fu
type: field-note
description: Connected accounts reported success without producing portfolio records. I tied collection to complete retrieval, existing import checks and clear faults.
date: 2026-10-29
updated: 2026-10-29
status: draft
audience: Fund executives, COOs and portfolio operators
primary_keyword: portfolio data reliability
secondary_keywords:
  - connected account synchronization
  - portfolio import controls
  - connection monitoring
answer: Connected accounts had produced no transactions despite recurring synchronization reporting success.[^E2] I connected collection to durable processing, preserved existing import controls, and added safeguards against incomplete retrieval.[^E1][^E2][^E4] Provider checks used recorded responses; merging the work remained separate from production approval.[^E4][^E5]
hero_image: /images/articles/turning-connected-accounts-into-portfolio-records-at-black-mountain-fu.webp
hero_alt: Conceptual illustration of account activity passing through review before entering a portfolio record
faq: []
cta: book
claims:
  - text: The portfolio system accepted credentials but produced no connected-account transactions, while recurring synchronization reported success without importing activity.
    kind: outcome
    evidence:
      - E2
  - text: Recurring background jobs were not running in production, and queued work disappeared on restart.
    kind: outcome
    evidence:
      - E1
  - text: Broken connections displayed a generic failure; problems were sometimes discovered days later, after decisions had used portfolio figures that appeared live.
    kind: outcome
    evidence:
      - E3
  - text: Automated account activity now passes through the existing import process, including validation, preview, duplicate detection and committing an import in full.
    kind: capability
    evidence:
      - E2
  - text: I corrected authorization for subsequent requests where trade retrieval could previously stop after its initial batch.
    kind: capability
    evidence:
      - E4
  - text: An additional-verification response now causes collection to fail explicitly instead of completing as an empty account.
    kind: capability
    evidence:
      - E4
  - text: Collection cannot complete when required information is missing, trade data is unsupported, account trade identifiers cannot be recognized, or retrieval stops progressing.
    kind: capability
    evidence:
      - E4
  - text: I connected recurring account collection to persistent background processing with retries.
    kind: capability
    evidence:
      - E1
      - E2
  - text: A failing connection no longer aborts the others, while a run in which every connection fails is rejected and reaches the failure-alert path.
    kind: capability
    evidence:
      - E2
  - text: Connection views now show the last actual success, current state and a corrective action, while portfolio views indicate stale figures.
    kind: capability
    evidence:
      - E3
  - text: Connection explanations distinguish expired sign-in, credential problems, missing permission and temporary limits, with corresponding actions to renew access, replace credentials, grant permission or wait.
    kind: capability
    evidence:
      - E3
  - text: The provider safeguards were checked against recorded responses without live network access.
    kind: outcome
    evidence:
      - E4
  - text: The integration record explicitly separates merging the work from approval for production cutover.
    kind: outcome
    evidence:
      - E5
evidence:
  - id: E1
    kind: github-commit
    title: Black Mountain Fund private build record (commit)
    date: 2026-09-21
    public: false
    ref: easefolio@cd24a3008fd2
  - id: E2
    kind: github-commit
    title: Black Mountain Fund private build record (commit)
    date: 2026-09-21
    public: false
    ref: easefolio@f29165265103
  - id: E3
    kind: github-commit
    title: Black Mountain Fund private build record (commit)
    date: 2026-09-21
    public: false
    ref: easefolio@97eb4324a1c2
  - id: E4
    kind: github-commit
    title: Black Mountain Fund private build record (commit)
    date: 2026-09-22
    public: false
    ref: easefolio@1f371058f9d9
  - id: E5
    kind: github-pr
    title: Black Mountain Fund private build record (pr)
    date: 2026-09-28
    public: false
    ref: easefolio#pr-13
---

## Why were connected accounts producing no portfolio records?

I found a portfolio system that accepted credentials but produced no connected-account transactions, while recurring synchronization reported success without importing activity.[^E2] For an executive responsible for portfolio reporting, the important question was what that success actually represented. A connection was an intermediate step. The business needed an accepted record of account activity.

The execution problem extended beyond account access: recurring background jobs were not running in production, and queued work disappeared on restart.[^E1] I treated that as part of the same delivery obligation. Scheduling a task and obtaining account access belonged inside the work; neither was an adequate definition of completion.

The operator experience made the gap harder to interpret. Broken connections displayed a generic failure; problems were sometimes discovered days later, after decisions had used portfolio figures that appeared live.[^E3] That put the burden of recognizing a problem on the person reading the portfolio. My concern was the point at which an apparently ordinary review became an investigation into whether the underlying information deserved confidence.

I decided that successful collection had to mean complete, validated activity accepted through the existing import controls. That was the acceptance standard for the work. It placed the business record at the center of the decision and gave me a concrete way to judge the surrounding connection, collection and error handling.

## What did I change between account access and an accepted record?

I kept the existing import process as the destination. Automated account activity now passes through that process, including validation, preview, duplicate detection and committing an import in full.[^E2] I did not want the method of arrival to decide which rules applied to a record. The relevant business question was whether the activity met the portfolio's acceptance requirements.

That decision also defined where to scrutinize collection. Before considering the import, I needed to examine what the external account had actually returned. I corrected authorization for subsequent requests where trade retrieval could previously stop after its initial batch.[^E4] This was a concrete completion defect: the opening response was too early a point to judge the entire retrieval.

Access requirements needed their own treatment. An additional-verification response now causes collection to fail explicitly instead of completing as an empty account.[^E4] I treated the meaning of that response as an acceptance decision. A statement about account activity must have a basis in account activity; an outstanding request for access belongs with the person responsible for resolving access.

I also made collection completion conditional on the returned information. Collection cannot complete when required information is missing, trade data is unsupported, account trade identifiers cannot be recognized, or retrieval stops progressing.[^E4] I chose a strict boundary here. Uncertainty about whether the collection was complete was a reason to stop acceptance and require attention.

The operational changes supported that same standard. I connected recurring account collection to persistent background processing with retries.[^E1][^E2] I retained the existing platform and concentrated on the missing execution responsibility. The work needed somewhere durable to continue, with an explicit treatment of unsuccessful attempts.

I also separated an individual connection problem from a failure across the connected accounts. A failing connection no longer aborts the others, while a run in which every connection fails is rejected and reaches the failure-alert path.[^E2] Those are different operational situations. I wanted the system's treatment of each to reflect the scope of the problem, with acceptance tied to what actually happened.

## What is different for the person reviewing the portfolio?

Connection views now show the last actual success, current state and a corrective action, while portfolio views indicate stale figures.[^E3] I put that information in the review experience because the person interpreting a figure also needs context about its condition. A separate technical investigation should not be the starting point for deciding whether to question a displayed result.

Connection explanations distinguish expired sign-in, credential problems, missing permission and temporary limits, with corresponding actions to renew access, replace credentials, grant permission or wait.[^E3] My judgment was to make the next action specific enough to assign. The useful handoff is a defined request to someone with the relevant authority.

The outcome boundary is precise: the provider safeguards were checked against recorded responses without live network access, and the integration record explicitly separates merging the work from approval for production cutover.[^E4][^E5] That is the evidence behind this account of the accomplishment. Measured business impact requires its own evidence; I attach no claim about operating savings or faster decisions to these implementation checks.

## What should you require from your own portfolio system?

The lesson I take into an executive review is to define completion at the point where the business accepts the information. Make that definition part of the operating agreement with the team or vendor responsible. The discussion should include the person accountable for the portfolio records and the person authorized to resolve account access.

Keep the closing review focused on these questions:

- **Completeness:** What evidence must exist before account activity qualifies for acceptance, and what uncertainty requires someone to intervene?
- **Freshness:** What age of information is acceptable for the decision being made, and who owns an exception to that standard?
- **Resolution:** Who has the authority to restore access, and what specific request should reach that person?

I want those answers in the acceptance criteria before anyone signs off on the work. They make the executive decision concrete: what information the organization is prepared to rely on, under what conditions, and who takes responsibility when those conditions are unmet.
