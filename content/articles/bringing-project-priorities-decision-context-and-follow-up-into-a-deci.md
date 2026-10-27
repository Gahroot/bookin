---
title: Bringing Project Priorities, Decision Context and Follow-Up Into a Decision Queue
slug: bringing-project-priorities-decision-context-and-follow-up-into-a-deci
type: field-note
description: I built a ranked decision queue for my own projects, combining project context and follow-up. What changed, what is documented, and what operators should ask.
date: 2026-10-27
updated: 2026-10-27
status: draft
audience: Founders, COOs and operators managing multiple projects
primary_keyword: project decision queue
secondary_keywords:
  - project prioritisation
  - executive project oversight
  - meeting follow-up
  - project decision context
answer: "I built DAVE for my own projects: a ranked queue with project context and a record of what I have handled.[^E1] Supporting features cover roadmaps, meeting gaps and prepared next actions.[^E2][^E4] The evidence documents those capabilities, but supplies no measured improvement in operating performance.[^E1][^E2][^E3][^E4]"
hero_image: /images/articles/bringing-project-priorities-decision-context-and-follow-up-into-a-deci.webp
hero_alt: Conceptual illustration of project priorities beside decision context and follow-up status
faq:
  - q: What does the decision queue bring together?
    a: DAVE draws on existing project evidence to rank decisions, provide their project context and retain what has already been handled.[^E1]
  - q: What supports planning and follow-up?
    a: The documented additions include project roadmaps, meeting gaps, a delivery record, prepared next actions and a record of recommendations.[^E2][^E3][^E4]
  - q: What improvement has been measured?
    a: The supplied material supports a description of the system and its features. It contains no measured operating improvement.[^E1][^E2][^E3][^E4]
cta: book
claims:
  - text: "I built DAVE for my own projects: a ranked decision queue that reads existing project evidence."
    kind: capability
    evidence:
      - E1
  - text: The queue provides project context and remembers what I have handled.
    kind: capability
    evidence:
      - E1
  - text: I added project roadmaps and meeting gaps to the supporting planning features.
    kind: capability
    evidence:
      - E2
  - text: I also added a delivery record.
    kind: capability
    evidence:
      - E3
  - text: For follow-up, I added prepared next actions and a record of recommendations.
    kind: capability
    evidence:
      - E4
  - text: A quiet queue is a valid state in DAVE.
    kind: capability
    evidence:
      - E1
  - text: The supplied evidence documents capabilities but contains no measured operating improvement.
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

## What deserves attention when several projects are moving?

The question behind this project was straightforward: when I look across my projects, what deserves my attention now?

I wanted that question to include the delivery plan, meeting follow-ups and previous decisions. A request for attention should come with enough background to judge it. What commitment is involved? What was discussed? What decision has already been made? What remains open?

That was the problem I chose to address in a personal project. The subject was the work between projects: deciding where to intervene, understanding the reason and keeping track of the response. I approached it as a decision problem, with the executive's next judgment as the starting point.

For a founder or operator, these are familiar review questions. Is this issue waiting for a decision, clarification or execution? Does it belong in today's discussion? What would justify moving it ahead of another commitment? Before asking for a more polished status report, I want those distinctions made explicit.

The standard I set was practical: judge the proposed work by the decision it asks someone to make. A project name and an urgent label are insufficient grounds for my attention. I want to understand the obligation behind the request before deciding where it belongs.

## What did I build around that question?

I built DAVE for my own projects: a ranked decision queue that reads existing project evidence.[^E1]

That was the central design decision. I chose the queue as the starting point for review. The question at the front of the experience was what to consider next. I treated the surrounding planning work as support for that judgment.

I added project roadmaps and meeting gaps to the supporting planning features.[^E2]

These were deliberate subjects to include in the build. In a review, I want to ask about intended direction and unfinished discussion together. A plan deserves scrutiny beyond its headline milestone. A meeting deserves scrutiny beyond whether it happened. The executive question is what either means for the decision currently under consideration.

I also added a delivery record.[^E3]

My reason for including delivery in the design was accountability. When reviewing a recommendation, I want to distinguish the intention to act from the work itself. Those deserve separate questions: what was proposed, what was committed and what evidence should count as delivery?

For follow-up, I added prepared next actions and a record of recommendations.[^E4]

Here my design standard was specificity. A recommendation should invite a clear judgment about the proposed response. I want to ask whether the action fits the issue, whether it is ready for consideration and whether it still reflects the current decision. Producing a suggestion is only part of the responsibility I assign to a decision system.

## What is different now, and what does the evidence prove?

The queue provides project context and remembers what I have handled.[^E1]

For me, that is the substantive distinction between presenting a priority and supporting a decision. My review standard includes both the basis for attention and the disposition of the issue. I want to judge an item in relation to its project, then be precise about what my response means.

“Handled” deserves care as a business term. In evaluating any system, I would ask what that status means before relying on it. Acknowledging a recommendation, making a decision and completing the resulting work should have explicit definitions. The evidence here does not supply those definitions, so I am making no stronger claim about closure.

A quiet queue is a valid state in DAVE.[^E1]

I consider that an important design choice. My requirement is a credible judgment about attention. I do not set a target for how busy the screen should look. When evaluating a proposed priority, I want a reason for its presence; an empty review deserves the same honest treatment as a crowded one.

The supplied evidence documents capabilities but contains no measured operating improvement.[^E1][^E2][^E3][^E4]

That sets the boundary of this account. I am describing a personal build. Any assertion about faster decisions, better execution or reduced management effort would require operating evidence beyond the material presented here.

## What should you ask of your own organisation or vendors?

Start with the decision you expect a person to make. During a review, ask the presenter to explain why the proposed issue deserves attention now. What commitment is at stake? What background should the decision-maker examine? What would justify accepting, deferring or rejecting the recommendation?

Then examine the meaning of follow-up. Ask what your organisation considers a response and what it considers completion. Who is responsible for making that distinction? What evidence should be required before an issue is treated as resolved? These are management questions to settle before accepting a reassuring status label.

Apply the same scrutiny to the proposed action. Is the recommendation specific enough to judge? Does it ask for an executive decision or simply restate the problem? What should happen if the recommendation is declined? A useful vendor conversation should address those questions directly.

Finally, require a separate discussion about results. Ask what has actually been measured, over what operating period and against which prior process. Keep a demonstrated feature and a demonstrated business improvement as separate items in the evaluation. Give each its own evidence requirement.

That is the conversation I want with founders and operators considering this kind of system. Bring the recurring decision that is difficult to make across projects. Establish what the decision requires, what a responsible response means and what evidence would justify calling the change successful. Those are the terms on which I want the work judged.
