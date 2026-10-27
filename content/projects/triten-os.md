---
slug: triten-os
title: Triten OS
client: Triten
client_url: https://tritenre.com
status: live
started: 2026-07-30
updated: 2026-10-27
summary: Triten's executives ask ChatGPT or Claude plain questions about their portfolio and get ranked, cited answers drawn from governed Yardi, Monday.com and SharePoint data, without anyone assembling a report first.
problem: Portfolio facts lived in three systems that disagreed with each other. Answering a cross-portfolio question meant someone opening Yardi, Monday.com boards and SharePoint documents, reconciling them by hand and working out who was responsible for what.
role: Designed and built the platform end to end, from source ingestion and the governed fact ledger to the API, the web app and the read-only MCP server that lets AI assistants query it.
capabilities: [data-platform, mcp, ai-agents, analytics]
stack: [TypeScript, Node.js, PostgreSQL, MCP, OpenAPI, Railway]
links:
  - label: Triten
    url: https://tritenre.com
  - label: Interactive demo (synthetic data)
    url: https://nolangrout.com/demos/portfolio-risk
outcomes:
  - text: Yardi, Monday.com and SharePoint records are ingested into one governed ledger of evidence-backed facts.
    evidence: [E1]
  - text: A read-only MCP server exposes 22 tools so ChatGPT and Claude can query governed portfolio data, with no write access.
    evidence: [E1]
  - text: Investigation tools rank portfolio exposure by property, name the responsible asset managers and cite the source records.
    evidence: [E2, E3]
  - text: A portfolio risk review that took an employee 8+ hours now takes about 10 minutes.
    evidence: [E4]
evidence:
  - id: E1
    kind: github-repo
    title: Triten OS repository README (sources, governed facts, read-only MCP)
    date: 2026-10-27
    public: false
    ref: triten-os@86fcdcbc
  - id: E2
    kind: github-commit
    title: Ranked lease expiry exposure by property with asset managers and cited records
    date: 2026-10-20
    public: false
    ref: triten-os@219b0b4e
  - id: E3
    kind: github-commit
    title: Read-only production investigation proof
    date: 2026-10-26
    public: false
    ref: triten-os@5e35b092
  - id: E4
    kind: owner-attested
    title: Nolan Grout, account of the manual review before and after
    date: 2026-10-27
    public: false
    ref: owner-statement-2026-10-27
featured: true
order: 1
---
Triten OS turns the records a real estate investment firm already has into facts it can trust. Every fact keeps its source, its effective date and who is allowed to see it.[^E1] When sources disagree, the conflict is recorded and explained instead of silently picking a winner.

The part executives notice is the MCP server. An asset manager can ask ChatGPT a question about the portfolio and the assistant answers from governed data, ranks what matters and says who manages it.[^E2] The server can only read; it cannot change anything.[^E1]

Read the full story in [How a day of portfolio risk review became 10 minutes](/writing/portfolio-risk-review-in-minutes-with-chatgpt) or try the [interactive demo](/demos/portfolio-risk), which uses synthetic data.
