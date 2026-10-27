---
title: Why I Let AI Agents Build Client Systems, and What I Never Let Them Skip
slug: shipping-business-software-with-ai-agents
type: field-note
description: How Nolan Grout ships enterprise systems with AI coding agents. A second agent reviews every job, gates block bad changes, and owners keep the decisions.
date: 2026-10-27
updated: 2026-10-27
status: approved
approved_by: auto-review (seed, EZ Goals)
project: ezcoder
audience: Executives commissioning AI-built business software
primary_keyword: building business software with AI agents
secondary_keywords: [AI coding agents for enterprises, AI code review, trustworthy AI development, AI agent governance]
answer: I build client systems with AI coding agents, but never on trust alone. A second agent reviews every finished job and sends it back until it passes, automated gates block changes that fail checks, and decisions about data, money and production stay with the owner. Speed comes from the agents; trust comes from the gates.
hero_alt: A coding agent's finished job passing through an independent review before it is accepted
faq:
  - q: Is software built by AI agents safe to run a business on?
    a: Only if the process around the agents is strict. Independent review, automated checks and owner sign-off on risky steps matter more than which model writes the code.
  - q: Who reviews the AI's work?
    a: A separate reviewing agent checks every finished job and returns it with specific problems. Automated gates then run before anything ships, and I review what reaches production.
  - q: What do clients still decide themselves?
    a: Anything touching their data, their money or their production systems, such as retiring an old reporting tool or changing which source is authoritative.
  - q: Does this mean fewer people on my project?
    a: It means the people you do involve spend their time on decisions and review rather than on routine building.
cta: book
claims:
  - text: In EZ Coder's autopilot mode, a second agent reviews every finished job and sends it back with what is wrong until it passes.
    kind: capability
    evidence: [E1]
  - text: EZ Coder can take work from a phone through Telegram, including voice notes transcribed on the user's own machine.
    kind: capability
    evidence: [E1, E2]
  - text: In one review loop, the reviewing agent caught a rate limiter that would have allowed four times the configured traffic and sent it back until it was fixed.
    kind: outcome
    evidence: [E1]
  - text: On Triten OS, changes pass type checks, lint, unit tests, release gates and security scans before deployment.
    kind: capability
    evidence: [E3]
  - text: The Back2SleepNow engine merges only articles whose every claim passes an independent fact-check.
    kind: capability
    evidence: [E4]
  - text: On Easefolio, the replacement platform has been built behind migration controls and CI from its first commit.
    kind: capability
    evidence: [E5]
evidence:
  - id: E1
    kind: github-repo
    title: EZ Coder README (autopilot review, phone control)
    date: 2026-10-25
    public: true
    ref: Gahroot/ezcoder@ed46ffbd
    url: https://github.com/Gahroot/ezcoder/blob/ed46ffbd/README.md
  - id: E2
    kind: github-commit
    title: Add Telegram remote control
    date: 2026-03-14
    public: true
    ref: Gahroot/ezcoder@997e5ca0
    url: https://github.com/Gahroot/ezcoder/commit/997e5ca0
  - id: E3
    kind: github-repo
    title: Triten OS verification and release gates
    date: 2026-10-27
    public: false
    ref: triten-os@86fcdcbc
  - id: E4
    kind: github-commit
    title: Back2SleepNow automated approval gate with auto-merge
    date: 2026-10-25
    public: true
    ref: Gahroot/mom317@80b77ce7
    url: https://github.com/Gahroot/mom317/commit/80b77ce7
  - id: E5
    kind: github-commit
    title: Easefolio migration controls, app scaffold and CI
    date: 2026-08-12
    public: false
    ref: easefolio@351efb7a
---
Executives who commission software now ask a fair question: if AI agents write most of the code, why should we trust what they build?

My answer is that you should not trust the agents. You should trust the process around them. I build client systems, including a governed data platform for a real estate investment firm, a fund management platform and an autonomous content engine, with AI coding agents doing much of the typing. What makes that safe is a short list of things I never let them skip.

## Why use AI agents at all?

Because the routine parts of software are no longer the expensive parts. Wiring a form to a database, writing the hundredth test or updating a dependency used to take days of a developer's time. Agents do that work well and quickly.

That frees the scarce resource, judgment, for the questions that decide whether a system is any good. Which source is authoritative when two disagree? Who is allowed to see this number? What should happen when an import fails at night? Those are business decisions, and they are where I spend my time.

I build with my own agent, [EZ Coder](/work/ezcoder). It takes work by text or voice note from a phone, so a job can start from wherever I am and keep running when I step away.[^E1][^E2]

## Who checks the AI's work?

Not the AI that did it. That is the first rule.

Most coding agents mark their own homework: they write the code, decide it looks fine and report success. EZ Coder has an autopilot mode where a second agent reviews every finished job. If the work is not good enough, the reviewer hands it back with exactly what is wrong, and the first agent goes again until it passes.[^E1]

That loop catches real problems. In one case the reviewer found a rate limiter that would have quietly allowed four times the configured traffic, sent it back and signed off only after the fix.[^E1] Nobody typed anything in between. A tired human reviewer at the end of a long day could easily have missed it.

## What are the gates, and why do they matter more than the model?

Review is the first line. Automated gates are the second, and they do not get tired or polite.

On [Triten OS](/work/triten-os), a change does not reach production until it passes type checks, lint, the unit test suite, release gates and security scans.[^E3] On the [Back2SleepNow engine](/work/back2sleepnow-content-engine), an article is published only if an independent fact-check rates every claim as supported by its source.[^E4] On [Easefolio](/work/easefolio), the replacement platform has been built behind migration controls and CI from its first commit, so each part has to prove it matches before it replaces anything.[^E5]

The pattern is the same each time. Decide in advance what "good" means, write it down as a check a machine can run, and refuse anything that fails. The model writing the code can change next month. The gates stay.

For an executive, this is the question to ask any team using AI: not "which model do you use?" but "what stops a bad change from reaching us, and can you show me?"

## What do I never hand to an agent?

Three kinds of decisions stay with people, and usually with the client.

**Anything irreversible in production.** Retiring an old reporting system, deleting records or changing live schedules happens only with explicit owner approval, even when every check is green.

**Anything about truth and access.** Which system is authoritative for a figure, how a conflict is resolved and who can see what are governance rules. Agents implement them; owners set them.

**Anything I cannot verify.** If a number cannot be traced to evidence, it does not go in a report, a dashboard or an article. That includes this one: every outcome stated here is linked to the record behind it.

## What does a working day look like?

A typical day starts with a goal, not a task list. For a client platform that might be "make the nightly import report exactly which records failed and why." I describe the outcome, the constraints and what must not change. The agents read the existing code, propose the change, write the tests and run the checks.

The reviewing agent then reads the result with fresh eyes.[^E1] When it passes, the gates run.[^E3] When those pass, I read what changed and decide whether it is ready for the client's staging environment. Production comes after, and only on the owner's say-so for anything that cannot be undone.

Most of my attention goes to the edges of that loop: the goal at the start and the decision at the end. That is where a senior builder adds value, and it is where an executive should want their builder's time to go. The middle, which used to be most of the cost, is now the cheapest part.

## What does this mean if you are commissioning a system?

You should expect three things from anyone building with AI agents for you.

First, speed on the routine work. Changes that used to wait for a sprint can land much sooner, because the agents do not wait for a meeting.

Second, evidence. Every change should come with the checks it passed. Every claim about an outcome should point to something you can inspect.

Third, a clear line between what the system decides and what you decide. The best AI-built system is not the one with the fewest people involved. It is the one where people are involved exactly where judgment matters, and nowhere else.

## How do I start?

Start from the decision you want to make faster, not from the technology. For Triten, that decision was "which assets need attention, and who owns them?" Everything else, including the data platform, the gates and the AI assistant on top, followed from it. You can see how that turned out in the [portfolio risk demo](/demos/portfolio-risk), which uses synthetic data.

If you have a decision like that in mind, [book a call](/book) and we can work out what the system around it should look like.
