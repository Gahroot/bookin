---
title: Who Actually Needs the COO to Decide?
slug: bringing-project-priorities-decision-context-and-follow-up-into-a-deci
type: field-note
description: Nolan Grout examines when project updates deserve executive attention, using DAVE to explore escalation, ownership and a buying standard for COOs and operators.
date: 2026-10-27
updated: 2026-10-27
status: draft
audience: COOs, fund executives, founders and operators overseeing multiple projects
primary_keyword: executive decision queue
secondary_keywords:
  - project escalation
  - executive authority
  - project accountability
answer: DAVE permits a ranked decision queue to stay quiet and pairs it with project context and a record of handled items.[^E1] The business question is who needs executive authority. I judge escalation by the decision required, the owner's remit and the consequence of waiting.
hero_image: /images/articles/bringing-project-priorities-decision-context-and-follow-up-into-a-deci.webp
hero_alt: Conceptual illustration of a COO considering a project decision beside an uncluttered queue
faq: []
cta: book
claims:
  - text: DAVE explicitly allows its decision queue to be quiet.
    kind: capability
    evidence:
      - E1
  - text: DAVE presents a ranked decision queue with access to project context.
    kind: capability
    evidence:
      - E1
  - text: DAVE remembers what has been handled.
    kind: capability
    evidence:
      - E1
  - text: The available record documents capabilities and development additions but reports no measured operating results.
    kind: outcome
    evidence:
      - E1
      - E2
      - E3
      - E4
evidence:
  - id: E1
    kind: github-repo
    title: Gahroot/dave README summary
    date: 2026-10-27
    public: true
    ref: Gahroot/dave
    url: https://github.com/Gahroot/dave
  - id: E2
    kind: github-commit
    title: Add next-best-action card and per-project roadmaps with meeting gaps
    date: 2026-10-12
    public: true
    ref: Gahroot/dave@13c6c79e2e7e
    url: https://github.com/Gahroot/dave/commit/13c6c79e2e7e677282fac99bfbf7150cf1948d0c
  - id: E3
    kind: github-commit
    title: "Add Delivery Intelligence: Focus home, delivery record, reconciler and prioritiser"
    date: 2026-10-12
    public: true
    ref: Gahroot/dave@8d8d8f38ec3c
    url: https://github.com/Gahroot/dave/commit/8d8d8f38ec3c23a00f4bc817636c00a1ebfd8d38
  - id: E4
    kind: github-commit
    title: "Add DAVE closed loop: selective meetings, work watcher, prepared next actions, recommendation ledger and Pew briefing"
    date: 2026-10-18
    public: true
    ref: Gahroot/dave@2a6b633572d4
    url: https://github.com/Gahroot/dave/commit/2a6b633572d4c8f29059d0d9315548f55fb216e0
---

## When does a project review become a request for authority?

A project review can leave a COO with an awkward question: am I being informed, asked to decide, or expected to take over? Those are different management situations. A useful review should make the distinction explicit before an executive accepts responsibility for the next move.

Consider the difference between an owner reporting a difficulty and an owner requesting a change to an agreed commitment. The difficulty deserves attention within the project. The change may require authority beyond that owner's remit. I want the request to name that boundary. What decision belongs here, and why does it belong with this executive?

Without that distinction, the risk is a review in which every unresolved item becomes the senior person's problem. The executive has to establish whether there is a decision to make before considering the merits of it. Meanwhile, ownership is open to interpretation: did discussing the issue transfer responsibility, or did the original owner retain it?

That is the business problem I care about in an executive decision queue. Its purpose should be clear enough that the person opening it knows what kind of responsibility they are being asked to exercise.

## What makes an item deserve escalation?

DAVE explicitly allows its decision queue to be quiet.[^E1] That is the implementation choice worth examining. It leaves room for a review that produces no request for intervention. The difficult judgment is deciding when that is appropriate.

My standard starts with authority. An item deserves escalation when the requested decision exceeds the owner's agreed remit, requires a tradeoff between responsibilities, or asks the executive to accept a consequence that belongs at their level. These are the criteria I bring to evaluating the product; they are not documented rules of its implementation.

A project being important is insufficient grounds on its own. I want the escalation to explain what the owner cannot legitimately decide. Otherwise, the executive is being asked to interpret urgency without a clear request attached.

The opposite mistake also deserves scrutiny. An absence of requests should invite a question about coverage: was the relevant work examined, and was an issue left with someone authorised to resolve it? I treat those as questions for review, rather than drawing reassurance from the appearance of the screen.

The tradeoff is between unnecessary intervention and an obligation that goes unaddressed. Neither a busy queue nor an empty one settles that tradeoff. The standard has to come from the organisation's responsibilities and commitments.

## What information belongs beside the request?

DAVE presents a ranked decision queue with access to project context.[^E1] For an executive, the important question is what justifies the proposed order. I want to understand the consequence of waiting, the commitment at stake and the authority being requested.

A dramatic description should carry no special weight. A routine-looking issue may involve a commitment the owner cannot change. An alarming update may still fall squarely within an existing owner's responsibility. The review should address that distinction in the language of the business.

I also want enough background to challenge the request. What has already been agreed? What remains uncertain? Which part of the proposed response requires approval? An executive should be able to question the recommendation without having to reconstruct the entire project conversation.

That is my standard for context: material relevant to the judgment in front of the reviewer. A comprehensive history may be useful elsewhere. Here, the test is whether the executive can explain why they are intervening, what they are authorising and which responsibility remains with the owner afterward.

## What is different in the documented product?

DAVE remembers what has been handled.[^E1] That capability raises a management question about the meaning of a response. An executive may approve a request, decline it, ask for more information or return it to its owner. The organisation should define what each response requires next.

I keep that definition separate from proof of completion. Approval is an exercise of authority; delivery is an obligation someone must fulfil. A useful review of the product should examine how the business interprets that distinction before relying on the record as an account of progress.

The available record documents capabilities and development additions but reports no measured operating results.[^E1][^E2][^E3][^E4] The unresolved question is how the product's treatment of actual work compares with the organisation's judgment about intervention.

## What should you ask before buying an executive decision system?

Ask the vendor to examine a real project episode with the people responsible for it. Establish who held the authority, what decision was required and what consequence justified escalation. Then judge the proposed treatment against those facts.

Include work that properly stayed with its owner. That is a necessary part of assessing the boundary. A demonstration built entirely around urgent exceptions leaves an important management question unanswered: when should the executive leave responsibility where it already sits?

My buying criterion is simple: can we agree on why this request belongs with this person, at this moment? Follow that with a clear account of who owns the next obligation after the executive responds.

That is the conversation I want with a COO or fund executive. Start with a decision from your own organisation. Name the authority it required. Then ask whether the system's treatment respects the way you intend the business to be run.
