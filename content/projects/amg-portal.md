---
slug: amg-portal
title: Anchor Mill Group client and partner portal
client: Anchor Mill Group
client_url: https://anchormillgroup.com
status: live
started: 2026-03-05
updated: 2026-10-12
summary: Anchor Mill Group runs its security and due-diligence programs for private clients from one platform, with separate portals for staff, delivery partners and clients.
problem: Bespoke security programs involve staff, outside partners and demanding clients. Work, compliance checks and communication were spread across tools with no single audit trail.
role: Built the platform, including the shared backend, staff dashboard, partner and client portals, a mobile app, and the assessment engine that runs engagements end to end.
capabilities: [internal-tools, automation, voice-ai]
stack: [Next.js, React, Python, FastAPI, PostgreSQL, React Native]
links:
  - label: Anchor Mill Group
    url: https://anchormillgroup.com
outcomes:
  - text: Staff, partners and clients work in their own portals on one shared backend with chained audit trails.
    evidence: [E1]
  - text: A business phone line handles SMS and voice on one number with call forwarding to a handset.
    evidence: [E2]
evidence:
  - id: E1
    kind: github-repo
    title: AMG Portal repository README
    date: 2026-10-12
    public: false
    ref: amg-portal@46b88e86
  - id: E2
    kind: github-commit
    title: Add CRM line support with SMS, voice and call forwarding
    date: 2026-10-12
    public: false
    ref: amg-portal@46b88e86
featured: false
order: 4
---
The platform covers program lifecycle, partner scoring, KYC and compliance, SLA tracking and reporting.[^E1]
