---
title: I Built a Decision Queue That Can Stay Quiet
slug: bringing-project-priorities-decision-context-and-follow-up-into-a-deci
type: field-note
description: I built DAVE around a decision queue that can stay quiet. Here is the design choice, the documented capability, and the operating proof still needed for COOs.
date: 2026-10-27
updated: 2026-10-27
status: draft
audience: COOs, fund executives, founders and operators overseeing multiple projects
primary_keyword: executive decision queue
secondary_keywords:
  - project prioritisation
  - executive attention
  - decision follow-through
answer: DAVE combines a ranked decision queue, project context and a record of handled items, while allowing the queue to stay quiet.[^E1] I also added prepared next actions and a recommendation ledger.[^E4] The supplied evidence documents those capabilities; it does not report a measured business improvement.[^E1][^E2][^E3][^E4]
hero_image: /images/articles/bringing-project-priorities-decision-context-and-follow-up-into-a-deci.webp
hero_alt: Conceptual illustration of an executive decision queue with space left deliberately empty
faq:
  - q: Does DAVE need to produce a recommendation every time?
    a: No. Its documented design accepts a quiet queue as a valid state.[^E1]
  - q: What evidence is available about the result?
    a: The supplied record describes the product and documents development additions, including prepared next actions and a recommendation ledger.[^E1][^E4] It contains no measured operating improvement or recorded executive response to a live recommendation.[^E1][^E2][^E3][^E4]
cta: book
claims:
  - text: I built DAVE with an explicit allowance for a quiet decision queue.
    kind: capability
    evidence:
      - E1
  - text: DAVE reads existing project evidence without requiring setup forms or business metadata.
    kind: capability
    evidence:
      - E1
  - text: DAVE presents a ranked decision queue.
    kind: capability
    evidence:
      - E1
  - text: DAVE provides access to project context.
    kind: capability
    evidence:
      - E1
  - text: DAVE remembers what has been handled.
    kind: capability
    evidence:
      - E1
  - text: Delivery planning and meeting connections are optional additions to DAVE.
    kind: capability
    evidence:
      - E1
  - text: I added a next-best-action card and project roadmaps that include meeting gaps.
    kind: capability
    evidence:
      - E2
  - text: I added a delivery record and prioritiser.
    kind: capability
    evidence:
      - E3
  - text: I subsequently added prepared next actions and a recommendation ledger.
    kind: capability
    evidence:
      - E4
  - text: The supplied evidence documents product capabilities and development additions, but contains no recorded executive response to a live recommendation or measured operating improvement.
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

## When does a project update deserve your attention?

I built DAVE with an explicit allowance for a quiet decision queue.[^E1] That is the design choice I want an executive to examine first. Before discussing recommendations, summaries or follow-up, decide whether the system is allowed to finish a review without asking you to intervene.

For a COO or fund executive, the purpose of reviewing projects is to exercise judgment: authorise a change, settle a conflict, challenge a commitment or leave responsibility where it belongs. My starting point was that boundary between knowing about work and being asked to act on it.

I do not want an executive review to become a recital of everything that happened. An update can be informative without containing a request for authority. Treating those as equivalent makes the review's purpose unclear. Is the executive being briefed, being asked to decide, or being made responsible for work already assigned elsewhere?

The business problem behind this project is that ambiguity. I wanted the product to take a position on what deserves consideration. The uncomfortable part of that ambition is accepting an absence of recommendations. A screen full of activity is easy to present. Silence asks the builder to be clear about the standard for escalation.

## What did I build around that boundary?

DAVE reads existing project evidence without requiring setup forms or business metadata.[^E1] I chose an evidence-first starting point. The alternative is to begin by asking an organisation to describe its business again before reviewing the work already recorded. My judgment was to start with that existing record.

That choice carries a tradeoff: the record available to a system deserves scrutiny. A missing commitment cannot be treated as an unimportant commitment. I see this as a responsibility for evaluation, rather than permission to assume that everything consequential has been captured.

DAVE presents a ranked decision queue.[^E1] Ordering is a consequential editorial choice. Putting a request at the top expresses a judgment about what deserves consideration first. I want that judgment assessed against the obligation behind the request, rather than the apparent importance of the project producing it.

DAVE provides access to project context.[^E1] For me, the standard for useful background is the material needed to judge the proposed intervention. A long history is not automatically a good explanation. The reviewer needs a clear connection between the underlying situation and the decision being requested.

DAVE remembers what has been handled.[^E1] That introduces an equally important management boundary: dealing with a recommendation and completing the resulting work have different meanings. An organisation needs to define its own standard for completion before treating a disposition as proof of delivery.

Delivery planning and meeting connections are optional additions to DAVE.[^E1] I kept that expansion a separate choice. My rule for adding another source is to name the decision it should inform. Access to more material is insufficient justification by itself.

## What does the development record actually show?

The concrete implementation story is a sequence of additions. I added a next-best-action card and project roadmaps that include meeting gaps.[^E2] This put a proposed response alongside a view of the project ahead. My concern at that stage was the substance of the request: what, specifically, is being put before the reviewer?

I also added a delivery record and prioritiser.[^E3] Those additions reflect another part of the same design problem. A recommendation needs to be considered in relation to the work it concerns and the competing demands around it. I judge the quality of a proposed action by that relationship, rather than by how decisive its wording sounds.

I subsequently added prepared next actions and a recommendation ledger.[^E4] This is where my implementation emphasis moved beyond presenting a request. I wanted the proposed response and the record of recommendations to be explicit parts of the product. That is a concrete development decision; it is not evidence that someone accepted a recommendation or carried it through.

The supplied evidence documents product capabilities and development additions, but contains no recorded executive response to a live recommendation or measured operating improvement.[^E1][^E2][^E3][^E4] There is no supported client episode to narrate here. Attaching an invented escalation, owner or successful intervention would turn a documented build into an unsupported case study.

The accomplishment is therefore specific: the product described here has been built, and its development record identifies the additions above. Whether it improves an organisation's operating decisions remains an evaluation to conduct.

## What should you require before relying on this approach?

My next standard is an operating test with a known decision history. The organisation should choose the episode and establish the expected treatment before reviewing the system's response. That keeps the assessment anchored in business judgment.

I would include ordinary work that properly remained with its owner. The expected result should be written down in advance: no executive intervention, with a reason grounded in the authority and commitments already in place. This is a proposed acceptance test, not a reported DAVE result.

Keep the closing checklist short:

- **Grounding:** Does the proposed intervention follow from the available record, and is any material uncertainty visible?
- **Authority:** Does the request belong with this executive, or can the existing owner resolve it within their remit?
- **Disposition:** After the executive responds, what responsibility exists, who holds it, and what constitutes completion?

Those are the terms on which I want this work judged. The buying decision should turn on whether the organisation agrees with the system's treatment of real work. A polished recommendation is an invitation to examine the judgment behind it. It is not the operating result.
