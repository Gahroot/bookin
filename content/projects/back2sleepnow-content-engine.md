---
slug: back2sleepnow-content-engine
title: Back2SleepNow autonomous content engine
client: Back2SleepNow
client_url: https://back2sleepnow.com
status: live
started: 2026-09-25
updated: 2026-10-25
summary: Back2SleepNow publishes researched, fact-checked articles without a writer or editor in the loop. An automated gate checks every claim against its source and only merges what passes.
problem: A small health brand needed a steady flow of accurate, search-ready articles. Health content cannot be wrong, and there was no budget for a content team or a medical editor on every post.
role: Built the site's blog system and the engine that runs it, covering scheduled research, drafting, an independent fact-check gate, automatic publishing, weekly quality audits and alerting.
capabilities: [content-engine, automation, ai-agents]
stack: [Node.js, PostgreSQL, Railway, Vercel, GitHub, Codex]
links:
  - label: Back2SleepNow
    url: https://back2sleepnow.com
  - label: Source code
    url: https://github.com/Gahroot/mom317
outcomes:
  - text: The engine published its first article on its own after the gate sent it back for 3 rounds of self-revision.
    evidence: [E1, E2]
  - text: Every claim in a draft is fact-checked against its cited source by a separate model call before anything is merged.
    evidence: [E2, E3]
  - text: A weekly audit re-checks up to 2 published posts not audited in 30 days and opens refresh pull requests for any that fail.
    evidence: [E4]
evidence:
  - id: E1
    kind: github-pr
    title: First auto-published article merged by the gate
    date: 2026-10-25
    public: true
    ref: https://github.com/Gahroot/mom317/pull/6
    url: https://github.com/Gahroot/mom317/pull/6
  - id: E2
    kind: github-commit
    title: Gate self-revises from fact-check feedback and verifies papers
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
featured: true
order: 2
---
The engine runs on a schedule: it researches topics, drafts an article with sources, and opens a pull request. A gate then checks that sources resolve, the build passes and each claim is supported by its source.[^E3] A post that fails is revised by the engine and checked again; one that still fails is held for a person.[^E2]

Read [what it means to run marketing with a gate instead of a team](/writing/autonomous-content-engine-fact-check-gate).
