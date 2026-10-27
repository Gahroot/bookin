---
slug: easefolio
title: Easefolio fund management platform
client: Black Mountain Fund
client_url: https://easefolio.com
status: in-progress
started: 2026-08-12
updated: 2026-10-27
summary: Black Mountain Fund runs fund accounting, investor reporting and an AI assistant on Easefolio, while a modern replacement is rebuilt behind evidence-checked migration gates.
problem: The fund's platform calculates fund value, investor shares, fees and gains. It had grown large and hard to change, and replacing it could not put a single investor number at risk.
role: Maintains and extends the production platform, grounded its AI assistant's figures in fund data, and leads the rebuild with a migration control plane that proves each part matches before cutover.
capabilities: [internal-tools, ai-agents, analytics, automation]
stack: [Ruby on Rails, PostgreSQL, Sidekiq, Next.js, TypeScript]
links:
  - label: Easefolio
    url: https://easefolio.com
outcomes:
  - text: The platform's AI assistant answers with figures grounded in the fund's own data.
    evidence: [E1]
  - text: The replacement is built behind migration controls and CI gates from its first commit.
    evidence: [E2]
  - text: Fund managers keep using the production platform while it is modernized into smaller, characterized modules.
    evidence: [E3]
evidence:
  - id: E1
    kind: github-commit
    title: Ground AI assistant figures and fix chat visuals
    date: 2026-10-23
    public: false
    ref: black-mountain-fund@a2c30339
  - id: E2
    kind: github-commit
    title: Add migration controls, app scaffold and CI
    date: 2026-08-12
    public: false
    ref: easefolio@351efb7a
  - id: E3
    kind: github-commit
    title: Refactor oversized engines and services into characterized modules
    date: 2026-10-27
    public: false
    ref: black-mountain-fund@ce5eae60
featured: true
order: 3
---
Easefolio records each fund's deposits, withdrawals, trades and transfers, then calculates fund value, each investor's share and the related fees and gains. The work is about keeping that trustworthy while making it faster to change.[^E3]
