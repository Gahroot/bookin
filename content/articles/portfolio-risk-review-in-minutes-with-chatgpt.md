---
title: How a Full Day of Portfolio Risk Review Became 10 Minutes
slug: portfolio-risk-review-in-minutes-with-chatgpt
type: case-study
description: An asset manager asks ChatGPT for the top 20 assets to worry about. A read-only MCP server answers from governed Yardi, Monday.com and SharePoint data.
date: 2026-10-27
updated: 2026-10-27
status: approved
approved_by: auto-review (seed, EZ Goals)
project: triten-os
audience: Asset managers, COOs and operators of real estate funds
primary_keyword: portfolio risk review with ChatGPT
secondary_keywords: [MCP server for real estate, governed portfolio data, Yardi ChatGPT integration, asset manager AI, read-only AI data access]
answer: At Triten, an asset manager now asks ChatGPT which assets need attention, why, and who manages them. A read-only MCP server answers from governed Yardi, Monday.com and SharePoint data with cited sources. A review that took an employee 8+ hours now takes about 10 minutes.
hero_alt: A ranked list of portfolio assets with risk reasons and responsible managers, shown with synthetic data
faq:
  - q: Can ChatGPT change anything in our systems through this connection?
    a: No. The MCP server is read-only. Every tool is marked read-only, calls the governed API and has no way to write.
  - q: Does ChatGPT see all of our data?
    a: It sees only what the person asking is allowed to see. Each fact carries security labels, and the API enforces them before anything reaches the model.
  - q: What happens when Yardi and Monday.com disagree?
    a: The conflict is recorded rather than hidden. The answer can show both values, which source is authoritative and why.
  - q: Do we need to replace Yardi, Monday.com or SharePoint?
    a: No. They stay the systems of record. The platform reads from them and keeps a governed, evidence-backed copy of the facts.
  - q: Can I see it without connecting our data?
    a: Yes. The interactive demo at /demos/portfolio-risk runs the same kind of question on synthetic data.
cta: book
claims:
  - text: A portfolio risk review that took an employee 8+ hours across SharePoint, Monday.com and Yardi now takes about 10 minutes.
    kind: time-saved
    evidence: [E1]
  - text: An asset manager can ask ChatGPT for the top 20 assets to worry about, why, and who manages them, and get a ranked answer linked to each asset's managers.
    kind: capability
    evidence: [E1, E3, E5]
  - text: Triten OS ingests Yardi, Monday.com and SharePoint into governed facts that keep their evidence, security labels, lineage and effective dates.
    kind: capability
    evidence: [E2]
  - text: The MCP server is read-only and exposes 22 tools that call the governed API; it has no write tool.
    kind: capability
    evidence: [E2]
  - text: Investigation tools rank exposure by property, name the responsible asset managers and cite the source records.
    kind: capability
    evidence: [E3, E4, E5]
  - text: Conflicts between sources are recorded and explained by deterministic policies, not resolved by the language model.
    kind: capability
    evidence: [E2]
evidence:
  - id: E1
    kind: owner-attested
    title: Nolan Grout, account of the prior manual process and the new one
    date: 2026-10-27
    public: false
    ref: owner-statement-2026-10-27
  - id: E2
    kind: github-repo
    title: Triten OS repository README (sources, governed facts, read-only MCP server)
    date: 2026-10-27
    public: false
    ref: triten-os@86fcdcbc
  - id: E3
    kind: github-commit
    title: Ranked exposure by property with asset managers and cited records
    date: 2026-10-20
    public: false
    ref: triten-os@219b0b4e
  - id: E4
    kind: github-commit
    title: Read-only production investigation proof
    date: 2026-10-26
    public: false
    ref: triten-os@5e35b092
  - id: E5
    kind: github-commit
    title: MCP investigation tools merged
    date: 2026-10-17
    public: false
    ref: triten-os@e046d15d
---
An asset manager at Triten opens ChatGPT and types one sentence: "Tell me the top 20 assets I should be worried about, why, and who manages them."

A few minutes later there is a ranked list. Each asset comes with the reasons it made the list, the figures behind those reasons, the source records they came from, and the asset and project managers responsible for it.[^E3][^E5] Nobody exported a spreadsheet. Nobody chased a colleague for the latest board.

The same review used to take an employee a full working day: 8+ hours across SharePoint, Monday.com and Yardi. Now it takes about 10 minutes.[^E1] This is how that changed, and what it means for any fund that runs on more than one system.

## What did the review look like before?

Triten's portfolio data lives where most firms keep it. Financials and leases sit in Yardi. Project work and ownership sit on Monday.com boards. Loan files, reports and the documents that explain everything else sit in SharePoint.

A risk review meant one person opening all three. They pulled the numbers, read the documents, compared one source against another, and then did the slowest part: working out who was actually on each asset. Boards drift. Documents go stale. Two systems can name the same property differently.

By the owner's account, that took an employee 8+ hours each time.[^E1] It also produced an answer that was hard to check. If an executive asked "why is this one on the list?", the honest answer was "because I read it somewhere this morning."

## What changed?

Two things were built, in order.

First, a governed data platform, Triten OS. It reads Yardi, Monday.com and SharePoint and turns their records into facts. Each fact keeps where it came from, when it was true, who is allowed to see it and how it was derived.[^E2] When two sources disagree, the platform records the conflict and applies written rules about which source wins and why. Those rules are deterministic; the AI model does not decide what is true.[^E2]

Second, a read-only MCP server on top of it. MCP is the standard that lets assistants like ChatGPT and Claude call outside tools. Triten's server offers 22 tools, every one of them read-only, and every one of them goes through the same governed API the web app uses.[^E2] There is no write tool. The assistant can ask; it cannot change.

Among those tools are investigations built for questions like the one above. They rank exposure across the portfolio by property, attach the responsible asset managers and cite the underlying records.[^E3][^E5] Before release, the investigations were proven read-only against production data.[^E4]

## How does ChatGPT answer a question like "which assets should I worry about"?

The assistant does the reasoning; the platform supplies the facts.

When the asset manager asks for the top 20, ChatGPT calls the investigation tools, which return ranked properties with the evidence behind each one. It pulls the financial and operational facts it needs, joins each asset to its project and its managers, and writes the answer in plain language.[^E3]

Three properties of that answer matter more than speed:

- **It is cited.** Every figure points back to a governed fact, and every fact points back to its source record.[^E2]
- **It respects access.** The model sees only what the person asking is allowed to see, because security labels are enforced before data leaves the API.[^E2]
- **It names owners.** The list ends with people to call, not just problems to worry about.[^E3]

You can try the same experience on synthetic data in the [portfolio risk demo](/demos/portfolio-risk). It shows the question, the ranked list, the reasons and the owners, without any real Triten data.

## Why read-only, and why does governance come first?

Executives ask the right question about AI and their data: what stops it from being wrong, or from doing something it should not?

The answer here is architecture, not prompts. The assistant never touches Yardi, Monday.com or SharePoint directly. It has no credentials for them. It reaches data only through tools that can read and nothing else.[^E2] If a document contains text that looks like an instruction, it is treated as data.

Governance is what makes the speed safe. A fast answer from messy data is a liability: it sounds confident and nobody can check it. A fast answer from governed facts, with sources attached, is something an asset manager can act on and an auditor can trace.

That ordering is the main lesson for anyone planning a similar project. Connecting ChatGPT to a database takes a week. Making the answers trustworthy is the actual work, and it is most of the work.

## What does the time saving actually mean?

The headline is a day of work turned into minutes.[^E1] The bigger change is what happens to the question itself.

When a review costs a full day, it happens on a schedule, maybe monthly, maybe before a committee meeting. When it costs about 10 minutes, it can happen whenever someone is curious.[^E1] An asset manager can ask a follow-up. A COO can ask the same question about a different slice of the portfolio before a call. The review stops being a report and becomes a conversation.

It also changes who can do it. The old process depended on one person who knew where everything lived. Now anyone with access can ask, and the answer shows its work.

## Could this work for my fund?

If your portfolio data is spread across a property management system, a project tool and a document store, you have the same problem Triten had. The systems do not need to change. What needs to exist is a governed layer that reads them, reconciles them and exposes them safely to the assistants your team already uses.

The pattern is repeatable:

1. Read each source and keep its records as evidence.
2. Turn them into facts with clear rules for conflicts and access.
3. Expose those facts through a narrow, read-only set of tools.
4. Let the assistant reason over them and cite what it used.

See the full project record at [Triten OS](/work/triten-os), try the [synthetic demo](/demos/portfolio-risk), or [book a call](/book) to talk through what your version would look like.
