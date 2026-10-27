---
title: Where Partner Work Was Getting Stuck at Anchor Mill Group
slug: where-partner-work-was-getting-stuck-at-anchor-mill-group
type: case-study
description: At Anchor Mill Group, I closed gaps in partner access, submission notifications and review rules that could leave assigned work unseen, unreviewed or stuck.
date: 2026-10-27
updated: 2026-10-27
status: draft
project: amg-portal
audience: COOs, fund executives and operators coordinating external providers
primary_keyword: partner workflow management
secondary_keywords:
  - external provider coordination
  - partner portal access
  - submission review workflow
  - assignment approval
answer: At Anchor Mill Group, I added password-setting invitations and an account requirement for dispatch.[^E2][^E3] Bulk submissions now alert coordinators and begin review tracking.[^E4] Resubmissions preserve feedback and revision history, while completion rules distinguish rejected items from work still awaiting a decision.[^E1][^E5]
hero_image: /images/articles/where-partner-work-was-getting-stuck-at-anchor-mill-group.webp
hero_alt: Conceptual illustration of partner access, submission and coordinator review connected across an assignment
faq:
  - q: What happens if a partner has no portal account?
    a: Dispatch is blocked and the assignment stays in draft, with a warning explaining the access problem.[^E3]
  - q: Does submitting several files still alert the coordinator?
    a: Yes. Each deliverable created through a bulk submission triggers coordinator notification and starts its review clock.[^E4]
  - q: Can an assignment finish if some items were rejected?
    a: Yes, provided every non-rejected item has approval and an approved item exists. Assignments with only rejected items remain with the coordinator for a decision.[^E5]
cta: book
claims:
  - text: Previously, an assignment could be dispatched to a partner without a portal account, starting an offer clock even though the notification was not sent; the offer could expire unseen.
    kind: outcome
    evidence:
      - E3
  - text: Provisioned users previously received an unseen random password and had no way to sign in.
    kind: outcome
    evidence:
      - E2
  - text: Bulk submissions could miss coordinator notification.
    kind: outcome
    evidence:
      - E4
  - text: Rejected deliverables could prevent otherwise approved work from completing its assignment.
    kind: outcome
    evidence:
      - E5
  - text: Welcome invitations now contain a single-use link through which provisioned partners can set their password.
    kind: capability
    evidence:
      - E2
  - text: Staff receive invitation delivery status, and an invitation is marked sent only when delivery is confirmed.
    kind: capability
    evidence:
      - E2
  - text: Dispatch is blocked when a partner lacks a portal account; the assignment remains in draft and staff see an actionable warning.
    kind: capability
    evidence:
      - E3
  - text: Each deliverable created through a bulk submission now triggers coordinator notification and starts its review clock.
    kind: capability
    evidence:
      - E4
  - text: Coordinators can preview a submitted file beside assignment requirements, partner notes and review history.
    kind: capability
    evidence:
      - E1
  - text: Revision requests require itemized feedback, and partners answer each point in a resubmission note with the feedback visible beside their upload.
    kind: capability
    evidence:
      - E1
  - text: Resubmissions show what changed, link the prior version and identify the revision request they answer, with a chronological review timeline.
    kind: capability
    evidence:
      - E1
  - text: An assignment completes when every non-rejected item is approved and at least one item is approved; the check also runs after a rejection.
    kind: capability
    evidence:
      - E5
  - text: Assignments containing only rejected items remain for the coordinator to resolve.
    kind: capability
    evidence:
      - E5
evidence:
  - id: E1
    kind: github-commit
    title: Anchor Mill Group private build record (commit)
    date: 2026-09-23
    public: false
    ref: amg-portal@412f16b54874
  - id: E2
    kind: github-commit
    title: Anchor Mill Group private build record (commit)
    date: 2026-10-07
    public: false
    ref: amg-portal@9c8e46c254c4
  - id: E3
    kind: github-commit
    title: Anchor Mill Group private build record (commit)
    date: 2026-10-07
    public: false
    ref: amg-portal@e5fdd35ab68c
  - id: E4
    kind: github-commit
    title: Anchor Mill Group private build record (commit)
    date: 2026-10-07
    public: false
    ref: amg-portal@300a3690e3b4
  - id: E5
    kind: github-commit
    title: Anchor Mill Group private build record (commit)
    date: 2026-10-07
    public: false
    ref: amg-portal@da249b5c1538
---

## Where was partner work getting stuck?

At Anchor Mill Group, an assignment could be dispatched to a partner without a portal account. The offer clock started, but the notification was never sent. The offer could expire unseen.[^E3]

For an executive coordinating external providers, that raises a basic question: what does “dispatched” actually promise? Before treating silence as a partner’s failure to respond, the organisation should be able to establish whether the partner had a usable route into the work.

Account creation had its own gap. Provisioned users received a random password nobody saw, leaving them without a way to sign in.[^E2] Creating the account and making it usable were separate concerns. I treated both as part of assigning responsibility.

Further along, bulk submissions could miss coordinator notification.[^E4] The executive question there is about receipt: what should count as handing work back to the organisation? A provider submitting material and a coordinator being alerted to review it are distinct obligations.

At the end of the process, rejected deliverables could prevent otherwise approved work from completing its assignment.[^E5] That exposed a different question: should a final rejection still count as an outstanding review?

These were the boundaries I focused on: access before dispatch, receipt after submission, and a clear decision about completion. I wanted each boundary to have an explicit business rule, with responsibility attached to it.

## What did I change before work could be dispatched?

I added welcome invitations containing a single-use link through which provisioned partners can set their password.[^E2] My decision was to treat the invitation as part of bringing a provider into the process, alongside the assignment itself.

Staff also receive the invitation’s delivery status, and the system marks an invitation as sent only when delivery is confirmed.[^E2] That distinction matters when discussing readiness. A staff member should be precise about whether an invitation was delivered, whether an account exists and whether someone has actually signed in. Those are different milestones; the language used to describe them should stay precise too.

I then made a portal account a condition of dispatch. When the partner lacks an account, dispatch is blocked, the assignment stays in draft and staff see an actionable warning.[^E3]

I put that decision at the point where responsibility would otherwise pass to the provider. My principle was straightforward: before starting a response expectation, establish the prerequisite for receiving the request.

That is also how I judge an operational warning. It should concern a decision the person is making now. It should explain the missing condition clearly enough for them to resolve it. A warning buried elsewhere in the organisation is a poor basis for holding someone accountable at dispatch.

## What is different between submission and completion?

Each deliverable created through a bulk submission now triggers coordinator notification and starts its review clock.[^E4] I treated bulk submission as the same business handoff as an individual upload. The choice to submit several files together should not change who is responsible for reviewing them.

For the review itself, coordinators can preview the submitted file beside the assignment requirements, partner notes and review history.[^E1] Those are the materials I chose to put around the approval decision: the request, the response and the record of the discussion.

Revision requests require itemized feedback. Partners answer each point in a resubmission note, with that feedback visible beside their upload.[^E1] I wanted a request for revision to state what needed an answer. “Please revise” is an instruction I would challenge in any approval process: what, specifically, is the recipient expected to address?

Resubmissions also show what changed, link the prior version and identify the revision request they answer, with a chronological review timeline.[^E1] The organising principle is the exchange between reviewer and provider. A replacement file belongs in the context of the decision that prompted it.

Finally, an assignment completes when every non-rejected item is approved and at least one item is approved. That check also runs after a rejection.[^E5] Assignments containing only rejected items remain for the coordinator to resolve.[^E5]

The distinction behind that rule is between an unresolved decision and a final disposition. I kept the completion condition explicit because “finished” needs a shared meaning across the people assigning, submitting and reviewing the work.

## What should you ask about your own provider workflow?

Ask your team to explain the promises behind its status labels. Start with the words executives already use in meetings: assigned, submitted, under review and complete. For each, ask what must be true before the organisation uses that word.

For assignment, ask what evidence establishes that the recipient can receive and respond to the request. Who is responsible for checking readiness? At what point does the provider become accountable for a response? Keep those questions tied to the actual dispatch decision.

For submission, ask who accepts responsibility next. What constitutes receipt? What happens if that person is unavailable? Ask your vendor to demonstrate the handoff using the ways your providers actually submit work, including grouped submissions.

For revision, ask whether the reviewer’s request is specific enough to answer. Then ask what record the next reviewer should use to understand the exchange. The standard should be a defensible decision about the work, with enough context to explain that decision later.

For completion, ask how the organisation treats approved, rejected and unresolved items. Have the people who assign work and the people who review it explain the rule independently. Compare their answers before asking a vendor to implement them.

These are acceptance questions for an operating system. They belong in a COO’s review of the process, alongside the screens and reports. My starting point for that conversation is the handoff: what promise is being made, who becomes responsible, and what must be true before the work moves on?
