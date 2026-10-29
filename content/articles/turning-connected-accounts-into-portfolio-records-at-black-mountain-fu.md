---
title: When an Account Awaiting Verification Looked Empty
slug: turning-connected-accounts-into-portfolio-records-at-black-mountain-fu
type: field-note
description: A portfolio account needing verification looked empty. I corrected the failure handling, import controls and connection feedback behind portfolio review.
date: 2026-10-29
updated: 2026-10-29
status: draft
audience: Fund executives, COOs and portfolio operators
primary_keyword: portfolio account synchronization
secondary_keywords:
  - portfolio data reliability
  - connected account imports
  - portfolio review
  - connection failures
answer: I corrected portfolio synchronization that could mistake an account awaiting verification for an empty account, and made incomplete trade retrieval fail explicitly.[^E4] Automated records use the existing import checks, and connection panels expose the last success, current state and corrective action, with stale records flagged in portfolio views.[^E2][^E3]
hero_image: /images/articles/turning-connected-accounts-into-portfolio-records-at-black-mountain-fu.webp
hero_alt: Conceptual illustration contrasting an empty portfolio account with an account awaiting verification
faq: []
cta: book
claims:
  - text: An account requiring additional verification could finish synchronization as though it contained no records.
    kind: capability
    evidence:
      - E4
  - text: Trade retrieval could also stop after the first batch because authorization failed when requesting the next batch.
    kind: capability
    evidence:
      - E4
  - text: I changed verification handling so the blocked account reports a failure instead of completing as empty.
    kind: capability
    evidence:
      - E4
  - text: I corrected authorization for continued trade retrieval and added checks that reject completion when required information is missing, trade data is unsupported or collection stops progressing.
    kind: capability
    evidence:
      - E4
  - text: I connected recurring account synchronization to persistent background processing, with retries and an alert path when every connection in a run fails.
    kind: capability
    evidence:
      - E1
      - E2
  - text: A failing connection no longer stops the other connections from being processed.
    kind: capability
    evidence:
      - E2
  - text: I routed automated records through the existing import process, including validation, preview, duplicate detection and committing an import in full.
    kind: capability
    evidence:
      - E2
  - text: Connection panels now show the last actual success, the current state and a direct corrective action; portfolio views indicate stale records.
    kind: capability
    evidence:
      - E3
  - text: I added explanations that distinguish expired sign-in, credential problems, missing permission and temporary limits, with corresponding actions to renew access, replace a credential, grant permission or wait.
    kind: capability
    evidence:
      - E3
  - text: The integration record includes persistent jobs and provider synchronization, and explicitly states that merging is not approval for production cutover.
    kind: outcome
    evidence:
      - E5
  - text: I corrected portfolio synchronization that could mistake an account awaiting verification for an empty account, and made incomplete trade retrieval fail explicitly.
    kind: capability
    evidence:
      - E4
  - text: Automated records use the existing import checks, and connection panels expose the last success, current state and corrective action, with stale records flagged in portfolio views.
    kind: capability
    evidence:
      - E2
      - E3
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

## Why did an account awaiting verification look empty?

An account requiring additional verification could finish synchronization as though it contained no records.[^E4] That was the concrete failure I focused on: an access requirement being presented as an answer about account activity.

For a portfolio operator, those situations demand different treatment. An empty result belongs in the review of the account. A verification request belongs with someone authorized to restore access. I treated the distinction as part of the business requirements for the import, because the application should not settle an accounting question with an unresolved access problem.

The concern was the meaning of the result presented for review. Before accepting an empty account, an operator should have evidence that collection finished. Otherwise, the review starts with an unanswered question hidden inside an apparently ordinary result. My decision was to make that uncertainty explicit at the point where the system determines whether collection is complete.

## What changed when collection could not finish?

I changed verification handling so the blocked account reports a failure instead of completing as empty.[^E4]

There was a related problem further into collection. Trade retrieval could also stop after the first batch because authorization failed when requesting the next batch.[^E4] This required looking beyond whether access worked at the beginning. The relevant business question was whether retrieval continued through the records the account was supposed to supply.

I corrected authorization for continued trade retrieval and added checks that reject completion when required information is missing, trade data is unsupported or collection stops progressing.[^E4]

I kept the completion decision strict. Missing information should remain an unresolved exception until there is a justified basis for accepting the import. For portfolio review, that is a more useful requirement than asking whether the connection started successfully. It puts the acceptance decision at the end of collection, where the evidence about completeness belongs.

## How did I connect collection to accepted portfolio records?

I connected recurring account synchronization to persistent background processing, with retries and an alert path when every connection in a run fails.[^E1][^E2] A failing connection no longer stops the other connections from being processed.[^E2]

I treated continuation and escalation as separate decisions. An exception on an individual account should have a defined scope. A widespread failure should have an escalation requirement. In the business specification, those decisions deserve separate acceptance criteria; otherwise, the word “failed” leaves too much room for interpretation about what work should proceed and what needs attention.

I routed automated records through the existing import process, including validation, preview, duplicate detection and committing an import in full.[^E2]

That was a deliberate choice about where acceptance belongs. I wanted the discussion about imported records to stay attached to the rules governing the ledger. The source of a record should not decide how much scrutiny it receives. For an executive reviewing an integration proposal, the useful artifact is the acceptance specification: what qualifies for entry, what requires review and what causes rejection. The account connection is only part of that specification.

## What can the operator see when a connection breaks?

Connection panels now show the last actual success, the current state and a direct corrective action; portfolio views indicate stale records.[^E3]

I added explanations that distinguish expired sign-in, credential problems, missing permission and temporary limits, with corresponding actions to renew access, replace a credential, grant permission or wait.[^E3]

Those distinctions belong in the operator’s working view. During portfolio review, I want the conversation to stay concrete: which connection needs attention, what access decision is required and whether the figures under discussion need qualification. A general error message is a poor starting point for assigning that work.

Responsibility still belongs in the operating agreement. Your team and vendor should agree who handles account authorization, who can change permissions and who receives unresolved exceptions. Treat those as buyer requirements. A corrective action in an application is not an assignment of authority to the person reading it. The person expected to respond should have a clear remit, including when to bring the issue back to the account owner.

## What should you require before relying on the records?

The integration record includes persistent jobs and provider synchronization, and explicitly states that merging is not approval for production cutover.[^E5] That is the implementation and release boundary for this account.

For your own portfolio system, bring the acceptance discussion into a review of a specific account. Use an account that requires verification or an import interrupted during collection. Ask the vendor to show the evidence behind its completion decision, then have the person responsible for portfolio review assess that evidence against your requirements.

The buyer question is concrete: **What evidence will you show my team that this account’s records were collected completely before we rely on them?**
