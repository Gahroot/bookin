---
title: Turning Connected Accounts into Portfolio Records at Black Mountain Fund
slug: turning-connected-accounts-into-portfolio-records-at-black-mountain-fu
type: field-note
description: For Black Mountain Fund’s replacement application, I connected imports to persistent processing and made incomplete syncs and connection failures visible.
date: 2026-10-29
updated: 2026-10-29
status: draft
audience: Fund executives, COOs and portfolio operators
primary_keyword: portfolio account synchronization
secondary_keywords:
  - portfolio data reliability
  - connected account imports
  - portfolio synchronization failures
  - fund operations systems
answer: At Black Mountain Fund, I connected account synchronization and imports to persistent processing in the replacement application.[^E1][^E2] I added checks for incomplete trade retrieval and explanations that tell operators how to resolve connection problems.[^E3][^E4] These are implemented changes; merging them was not approval for production cutover.[^E5]
hero_image: /images/articles/turning-connected-accounts-into-portfolio-records-at-black-mountain-fu.webp
hero_alt: Conceptual illustration of connected accounts feeding portfolio records, with an interrupted import and a clearly identified corrective action
faq:
  - q: Does a successful connection prove portfolio records were imported?
    a: In the prior implementation, accepted credentials and a successful recurring run could coexist with no imported transactions.[^E2]
  - q: What if an account needs additional verification?
    a: The corrected trade synchronization reports that blockage as a failure instead of presenting the account as empty.[^E4]
  - q: How does an operator know what to fix?
    a: Connection feedback identifies the problem and the relevant next action, while showing the last successful connection and whether portfolio records are stale.[^E3]
  - q: Is this evidence of a production launch?
    a: No. The integration record states that merging the changes is not approval to switch production to the replacement application.[^E5]
cta: book
claims:
  - text: In Black Mountain Fund’s replacement application, credentials could be accepted without producing transactions, while recurring synchronization could report success without importing connected-account records.
    kind: capability
    evidence:
      - E2
  - text: Recurring background work had no persistent processing or scheduling in production, and queued work disappeared on restart.
    kind: capability
    evidence:
      - E1
  - text: A broken connection surfaced as a generic integration error without a corrective action.
    kind: capability
    evidence:
      - E3
  - text: I connected recurring account synchronization to persistent background processing, with retries and a visible failure path when repeated attempts are exhausted.
    kind: capability
    evidence:
      - E1
      - E2
  - text: I also routed automated account records through the existing import process, which applies validation, duplicate detection and acceptance of each import in full or rejection without partial posting.
    kind: capability
    evidence:
      - E2
  - text: I changed synchronization so a failing connection does not abort the others, while a run in which every connection fails is reported as a failure and reaches the failure alert path.
    kind: capability
    evidence:
      - E2
  - text: I corrected trade retrieval that could stop after the initial batch when authorization failed on a continuation request.
    kind: outcome
    evidence:
      - E4
  - text: I also changed the handling of requests for additional account verification so a blocked account fails explicitly instead of completing as an empty account.
    kind: capability
    evidence:
      - E4
  - text: The same work rejects completion when trade data is unsupported, required information is missing, or record collection stops making progress.
    kind: capability
    evidence:
      - E4
  - text: I added explanations that distinguish connection problems and identify the corrective action, including renewing authorization, replacing a credential, granting permission, waiting for a temporary limit or contacting support.
    kind: capability
    evidence:
      - E3
  - text: The replacement application also shows when a connection last worked, its current state and a direct corrective action; portfolio views carry an indicator for stale records.
    kind: capability
    evidence:
      - E3
  - text: The documented result is implementation work in the replacement application. The integration record explicitly separates merging the changes from approval for a production cutover.
    kind: outcome
    evidence:
      - E1
      - E2
      - E3
      - E4
      - E5
  - text: At Black Mountain Fund, I connected account synchronization and imports to persistent processing in the replacement application.
    kind: capability
    evidence:
      - E1
      - E2
  - text: I added checks for incomplete trade retrieval and explanations that tell operators how to resolve connection problems.
    kind: capability
    evidence:
      - E3
      - E4
  - text: These are implemented changes; merging them was not approval for production cutover.
    kind: outcome
    evidence:
      - E5
  - text: In the prior implementation, accepted credentials and a successful recurring run could coexist with no imported transactions.
    kind: capability
    evidence:
      - E2
  - text: The corrected trade synchronization reports that blockage as a failure instead of presenting the account as empty.
    kind: capability
    evidence:
      - E4
  - text: Connection feedback identifies the problem and the relevant next action, while showing the last successful connection and whether portfolio records are stale.
    kind: capability
    evidence:
      - E3
  - text: The integration record states that merging the changes is not approval to switch production to the replacement application.
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

A connected account is a promise: the records behind it will reach the portfolio. For a fund executive, the important question is whether that promise holds after the sign-in screen closes.

In Black Mountain Fund’s replacement application, credentials could be accepted without producing transactions, while recurring synchronization could report success without importing connected-account records.[^E2] I treated that gap as the problem to solve. A connection badge was the wrong finish line.

## Why was the connection status insufficient?

The missing link extended beyond account access. Recurring background work had no persistent processing or scheduling in production, and queued work disappeared on restart.[^E1] A portfolio application needs a dependable path from an instruction to the records it is supposed to produce. Having the instruction available is only the beginning.

The executive concern is accountability. Who is responsible for determining whether an account is current? What evidence should a manager expect before accepting its records for review? Those questions belong in the operating requirements, alongside the decision to connect an account at all.

The explanation of a failure was also inadequate: a broken connection surfaced as a generic integration error without a corrective action.[^E3] For an operator, “something failed” is an unfinished handoff. The useful answer names the next decision: whether the account owner needs to intervene, access needs to change, or the issue belongs with support.

I set the scope around that business responsibility: follow the records through the process and make a breakdown understandable to the person expected to resolve it.

## What did I change between account access and the ledger?

I connected recurring account synchronization to persistent background processing, with retries and a visible failure path when repeated attempts are exhausted.[^E1][^E2] That was the foundation of the replacement application’s import process.

I also routed automated account records through the existing import process, which applies validation, duplicate detection and acceptance of each import in full or rejection without partial posting.[^E2] The decision was to keep a common acceptance standard for records, regardless of how they arrived.

That distinction matters when specifying a system. “Connect our accounts” describes a point of access. “Produce portfolio records under our acceptance rules” describes the business obligation. I built toward the latter. The ledger is where the connection has to earn its place; a successful authorization screen is too early to declare the job finished.

This is also where I draw the boundary between convenience and control. An easier route into a system should face the same scrutiny as the process it replaces. Executives should ask what qualifies a record for acceptance before discussing how quietly the transfer can happen.

## What happens when an import cannot finish?

I changed synchronization so a failing connection does not abort the others, while a run in which every connection fails is reported as a failure and reaches the failure alert path.[^E2]

Those are separate operational decisions. The healthy part of a process should have room to proceed. The overall result should still tell the truth about a widespread breakdown. A useful status has to distinguish those situations instead of flattening them into a reassuring label.

I corrected trade retrieval that could stop after the initial batch when authorization failed on a continuation request.[^E4] I also changed the handling of requests for additional account verification so a blocked account fails explicitly instead of completing as an empty account.[^E4]

The same work rejects completion when trade data is unsupported, required information is missing, or record collection stops making progress.[^E4] An unexplained gap belongs in the exception process. It should not become an assumption about what the fund owns or what activity occurred.

These decisions define what “finished” is allowed to mean. That definition belongs in the business conversation before anyone accepts a synchronization indicator as evidence for a review.

## What can an operator see and do about a broken connection?

I added explanations that distinguish connection problems and identify the corrective action, including renewing authorization, replacing a credential, granting permission, waiting for a temporary limit or contacting support.[^E3]

The replacement application also shows when a connection last worked, its current state and a direct corrective action; portfolio views carry an indicator for stale records.[^E3]

The purpose is an intelligible handoff. A fund executive should not need to interpret a provider’s technical response to decide who owns the next step. The operator’s responsibility should be clear enough to assign, and the status should be meaningful enough to discuss in an ordinary operations meeting.

This is the standard I bring to connection work: an exception needs an explanation and an owner. A label alone is not a resolution process.

## What outcome can I claim at this stage?

The documented result is implementation work in the replacement application. The integration record explicitly separates merging the changes from approval for a production cutover.[^E5]

That boundary matters. I am describing what I built, without attaching an adoption figure, a reduction in reconciliation work or a measured operating result. A release decision and an operating result require their own evidence.

For a buyer, the useful distinction is between reviewing the controls in a proposed system and verifying their performance in live operations. Both belong in the project, with a clear decision about when the organisation moves from acceptance to reliance.

## What should you ask of your organisation or vendor?

Ask for the acceptance criteria behind the word “complete.” Make the discussion concrete: an account requires intervention, a transfer is interrupted, or the source returns information the application cannot interpret. Ask who signs off on the response and what evidence they review.

Keep commercial milestones tied to business obligations. An integration should be accepted against the records and exceptions your organisation needs to manage, with an agreed owner for unresolved cases.

Finally, ask what evidence supports the next release decision. Separate a demonstration from approval to rely on the system. That is the conversation I want with fund executives: what must be true before your team trusts the records, and who is accountable for proving it.
