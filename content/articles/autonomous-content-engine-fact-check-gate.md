---
title: Running Marketing With a Gate Instead of a Team
slug: autonomous-content-engine-fact-check-gate
type: article
description: Back2SleepNow's content engine researches, writes, fact-checks and publishes on its own. What changes when an automated gate replaces the editorial team.
date: 2026-10-27
updated: 2026-10-27
status: approved
approved_by: auto-review (seed, EZ Goals)
project: back2sleepnow-content-engine
audience: Founders, COOs and marketing leaders of small and mid-sized companies
primary_keyword: autonomous content engine
secondary_keywords: [AI fact-checking gate, automated publishing, AI content quality control, SEO content automation]
answer: Back2SleepNow publishes health articles with no writer or editor in the loop. An engine researches and drafts each post, a separate model checks every claim against its cited source, and only posts that pass are merged. Failures are revised automatically or held for a person, and published posts are re-audited weekly.
hero_alt: A pipeline of article drafts passing through a fact-check gate before publishing
faq:
  - q: Does anyone review the articles before they go live?
    a: Not by default. The owner chose full auto-publishing, so the gate is the review. Anything that fails is held and the owner is notified.
  - q: What does the gate check?
    a: That sources resolve, the site builds, the wording stays within the brand's rules, and every claim is supported by the source it cites.
  - q: What happens to an article that fails?
    a: The engine revises it from the fact-checker's feedback and checks it again. If it still fails, nothing is merged and it is held for a person.
  - q: Does published content stay accurate over time?
    a: A weekly audit re-checks older published posts. A post that no longer passes gets a refresh that goes through the same gate.
cta: book
claims:
  - text: The engine researched, wrote, fact-checked and published an article with no person reviewing it, after the gate sent it back for 3 rounds of self-revision.
    kind: outcome
    evidence: [E1, E2]
  - text: Before merge, the gate checks that sources resolve, the build passes, the wording follows the brand's claims rules, and a separate model rates every claim against its cited source.
    kind: capability
    evidence: [E3, E5]
  - text: Only posts where every claim is rated supported are merged; failures are labelled needs-review and assigned to the owner.
    kind: capability
    evidence: [E3, E5]
  - text: A weekly audit re-fact-checks up to 2 published posts not audited in 30 days and opens refresh pull requests that merge only on pass.
    kind: capability
    evidence: [E4, E5]
  - text: The first two weekly audits each refreshed a published article and merged it through the gate.
    kind: outcome
    evidence: [E6, E7]
  - text: The engine checks cited papers against Crossref and PubMed and drops references that point to the wrong paper.
    kind: capability
    evidence: [E2]
evidence:
  - id: E1
    kind: github-pr
    title: First auto-published article, merged by the gate
    date: 2026-10-25
    public: true
    ref: https://github.com/Gahroot/mom317/pull/6
    url: https://github.com/Gahroot/mom317/pull/6
  - id: E2
    kind: github-commit
    title: Self-revision from fact-check feedback, Crossref and PubMed verification
    date: 2026-10-25
    public: true
    ref: Gahroot/mom317@c999d33a
    url: https://github.com/Gahroot/mom317/commit/c999d33a
  - id: E3
    kind: github-commit
    title: Automated approval gate with auto-merge
    date: 2026-10-25
    public: true
    ref: Gahroot/mom317@80b77ce7
    url: https://github.com/Gahroot/mom317/commit/80b77ce7
  - id: E4
    kind: github-commit
    title: Weekly quality audit job
    date: 2026-10-25
    public: true
    ref: Gahroot/mom317@eeccf5b8
    url: https://github.com/Gahroot/mom317/commit/eeccf5b8
  - id: E5
    kind: public-url
    title: Back2SleepNow engine README (jobs, gate and audit)
    date: 2026-10-25
    public: true
    ref: Gahroot/mom317@eeccf5b8:engine/README.md
    url: https://github.com/Gahroot/mom317/blob/eeccf5b8/engine/README.md
  - id: E6
    kind: github-pr
    title: First weekly audit refresh, merged
    date: 2026-10-25
    public: true
    ref: https://github.com/Gahroot/mom317/pull/8
    url: https://github.com/Gahroot/mom317/pull/8
  - id: E7
    kind: github-pr
    title: Second weekly audit refresh, merged
    date: 2026-10-25
    public: true
    ref: https://github.com/Gahroot/mom317/pull/9
    url: https://github.com/Gahroot/mom317/pull/9
---
Most companies that want to publish more do the obvious thing: hire writers, then hire an editor to catch the writers, then wait for the editor. Back2SleepNow, a small sleep brand for women in menopause, took a different route. Its articles are researched, written, fact-checked and published by software. No person reads them before they go live.

That sounds reckless for health content. It would be, if the software were only a writer. What makes it work is the part most AI content tools skip: a gate that every article must pass, and that is not the writer checking its own homework.

This piece is about that gate, and what running marketing through one means for an operator.

## What does the engine actually do?

It runs on a schedule. It looks for topics the audience is searching for, drafts an article with real sources, and opens it as a change to the website's code, the same way a developer would propose one.[^E5] Then the gate takes over.

The gate checks four things before anything is merged:[^E3][^E5]

- every source link resolves to a trusted site;
- the site still builds with the article in it;
- the wording stays inside the brand's rules, so no promises a product cannot make;
- a separate model reads each cited source and rates every claim in the article as supported, overstated or unsupported.

Only an article where every claim is supported gets merged and published. Anything else is labelled for review and assigned to the owner.[^E3][^E5]

## How is this different from asking ChatGPT to write a blog post?

Asking a model to write is easy. Knowing whether what it wrote is true is the hard part, and it is where most automated content goes wrong.

Here, the writer and the checker are separate calls with separate instructions. The checker sees the claim and the source text, nothing else, and is told to be skeptical.[^E5] It does not care how fluent the paragraph is. If a sentence says more than its source says, it fails.

The engine also checks the references themselves. Cited papers are looked up in Crossref and PubMed, titles are corrected and references that point to the wrong paper are dropped.[^E2] That removes one of the most common AI failures: a real-looking citation to a paper that says something else.

## What happened the first time it ran on its own?

The first article the engine published on its own did not pass on the first try. The gate sent it back. The engine read the fact-checker's verdicts, revised the draft and resubmitted it. After 3 rounds of self-revision every claim was supported, and the gate merged it.[^E1][^E2]

That is the behavior you want from a team. A junior writer submits, an editor marks it up, the writer fixes it, and only the finished version ships. The difference is that nobody had to be in the room for it.

## What keeps published content from going stale?

Publishing is not the end of the job. Sources change, guidance gets updated and an article that was right in spring can be weak by autumn.

So the engine audits itself. Every week it picks up to 2 published posts that have not been checked in 30 days and runs the full fact-check again.[^E4][^E5] If a post no longer passes, the engine opens a refresh, and the refresh goes through the same gate. The live version stays up until the fixed one passes.[^E5]

The first two weekly audits each found an article worth refreshing, and both refreshes were merged through the gate.[^E6][^E7]

## What does this mean for running marketing?

Three things change when a gate replaces a team.

**The standard becomes explicit.** In most teams, quality lives in an editor's head. Here it is written down: which sources count, which words are off limits, what "supported" means. You can read it, argue with it and change it. Every decision leaves a record.[^E5]

**The bottleneck moves.** The constraint is no longer how many hours your writers and editors have. It is how good your rules are. Improving the gate improves every future article at once.

**Failures are visible and safe.** When the gate fails, nothing is published. The owner gets an issue with the exact claims that failed.[^E3] Compare that with a busy editor who skims, approves and moves on.

This is not a claim that the engine is perfect. A gate can miss things, and the owner chose full automation knowing that. The point is that the risk is designed, measured and visible, rather than hidden inside someone's workload.

## What does it take to set one up?

Less writing than you might expect, and more deciding. The engine itself is plumbing: a scheduler, a database that records every run, retries when something fails and an alert when it keeps failing.[^E5] The real work is answering the questions an editor would otherwise answer by instinct.

Which sources are trusted? Which phrases would get the brand in trouble? What should happen when a claim is half right? Who gets told when something is held, and how quickly? For Back2SleepNow, those answers became the brand's claims rules, a list of trusted source sites and a needs-review issue that lands with the owner.[^E3][^E5]

Once those are written down, adding more articles costs almost nothing. Changing the rules changes the output the next morning.

## Where does a human still belong?

In three places: setting the rules, reviewing what the gate holds, and deciding what the business wants from its content. Those are judgment calls. Everything between them, from research to drafting to checking to publishing, is work a well-designed system can do every week without being reminded.

The same pattern applies beyond health content. Any company with a body of facts it must get right, such as fund reports, property updates or product documentation, can put a gate between AI drafts and the public.

See the [project record](/work/back2sleepnow-content-engine), or [book a call](/book) if you want a content engine that answers to rules you set.
