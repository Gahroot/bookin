---
title: The Collections Review That Missed the Largest Balances
slug: the-collections-review-that-missed-the-largest-balances
type: case-study
description: At Triten, I corrected dated collections balances and restored missing tenants to aging reviews, with source reconciliation and explicit limits on the result.
date: 2026-11-02
updated: 2026-11-02
status: draft
project: triten-os
audience: Asset managers, COOs, fund executives and real estate operators
primary_keyword: historical collections balances
secondary_keywords:
  - month-end receivables
  - tenant aging reconciliation
  - collections review accuracy
  - property-level balances
answer: At Triten, I corrected the dates and property context behind historical receivables answers and revised aging evidence to include previously omitted tenants.[^E1][^E2][^E3][^E4] For executives, acceptance should cover the date requested, the accounts included and the specific reconciliation performed. Ask for remaining exceptions before accepting the result.
hero_image: /images/articles/the-collections-review-that-missed-the-largest-balances.webp
hero_alt: Conceptual collections review showing a historical balance date, account coverage and reconciliation exceptions
faq:
  - q: Can the system answer what was owed at a property at month-end?
    a: Yes. Month-end answers use the ledger balance and the tenant’s property association effective at that historical date.[^E1][^E2][^E3]
  - q: Did every part of the aging reconciliation match?
    a: The reviewed current-tenant charges and former-tenant balances agreed with the source records, but some former-tenant age-band allocations differed.[^E5]
  - q: Can an account still be excluded from aging?
    a: Yes. An individual age band with more supporting records than the evidence limit allows can still cause the tenant to be excluded, without shortening the evidence.[^E4]
cta: book
claims:
  - text: At Triten, historical collections questions could return a later balance or incorrectly report a zero balance.
    kind: outcome
    evidence:
      - E1
      - E2
  - text: Aging results also omitted tenants with extensive charge histories, including tenants with the largest balances.
    kind: outcome
    evidence:
      - E4
  - text: For ordinary balance snapshots, I made the date reflect when the ledger was read and kept the accounting month separate.
    kind: capability
    evidence:
      - E1
  - text: I added month-end balance answers drawn from the source system’s own month-end ledger.
    kind: capability
    evidence:
      - E1
  - text: I changed historical balances to take effect at the close of their ledger date, even when the source was read later.
    kind: capability
    evidence:
      - E2
  - text: I also aligned the tenant’s property association with that ledger date, allowing historical balances to be queried by property.
    kind: capability
    evidence:
      - E3
  - text: For aging, I changed the supporting evidence to follow the charges assigned to each age band, allowing tenants excluded because of their combined charge histories to appear.
    kind: outcome
    evidence:
      - E4
  - text: I added an independent, read-only comparison between source records and the live system’s balances and aging results.
    kind: capability
    evidence:
      - E3
  - text: Reconciliation matched all current-tenant charges and former-tenant balances checked, while some former-tenant allocations across age bands still differed.
    kind: outcome
    evidence:
      - E5
  - text: A tenant can still be omitted if an individual age band exceeds the limit on supporting evidence; the system excludes the tenant instead of truncating that evidence.
    kind: capability
    evidence:
      - E4
  - text: At Triten, I corrected the dates and property context behind historical receivables answers and revised aging evidence to include previously omitted tenants.
    kind: outcome
    evidence:
      - E1
      - E2
      - E3
      - E4
  - text: Month-end answers use the ledger balance and the tenant’s property association effective at that historical date.
    kind: capability
    evidence:
      - E1
      - E2
      - E3
  - text: The reviewed current-tenant charges and former-tenant balances agreed with the source records, but some former-tenant age-band allocations differed.
    kind: outcome
    evidence:
      - E5
  - text: An individual age band with more supporting records than the evidence limit allows can still cause the tenant to be excluded, without shortening the evidence.
    kind: capability
    evidence:
      - E4
evidence:
  - id: E1
    kind: github-commit
    title: Triten private build record (commit)
    date: 2026-10-31
    public: false
    ref: triten-os@df98d1772f06
  - id: E2
    kind: github-commit
    title: Triten private build record (commit)
    date: 2026-10-31
    public: false
    ref: triten-os@7923c84c8147
  - id: E3
    kind: github-commit
    title: Triten private build record (commit)
    date: 2026-10-31
    public: false
    ref: triten-os@6c127b6a69a1
  - id: E4
    kind: github-commit
    title: Triten private build record (commit)
    date: 2026-10-31
    public: false
    ref: triten-os@7949aadce834
  - id: E5
    kind: github-commit
    title: Triten private build record (commit)
    date: 2026-10-31
    public: false
    ref: triten-os@0f01fa07397f
  - id: E6
    kind: worklog
    title: Triten private build record (worklog)
    date: 2026-10-30
    public: false
    ref: wl-2026-10-30-yardi-squared-done-1
---

## What was wrong with the collections review?

Before discussing collection strategy, I want an answer to a more basic question: does the report describe the position management actually asked about? A collections review should be judged against a specific business question, with a clear date and a defined population of accounts.

At Triten, historical collections questions could return a later balance or incorrectly report a zero balance.[^E1][^E2] Aging results also omitted tenants with extensive charge histories, including tenants with the largest balances.[^E4]

Those failures deserved separate attention. For the historical question, the acceptance test was whether the answer represented the requested point in time. For the aging review, it was whether the expected accounts were present and supported by the relevant records.

I approached the work as a problem with the business answer. The starting point was the question an asset manager would bring into a review: what was owed, at which property, on the date under discussion?

That question became the standard for evaluating the changes. A report should earn acceptance through its relationship to the decision management needs to make. Its appearance alone should never settle whether the underlying answer is ready to use.

## What did I change about the historical answer?

For ordinary balance snapshots, I made the date reflect when the ledger was read and kept the accounting month separate.[^E1]

The acceptance question here is precise: what does the date attached to this balance mean? An accounting period and an observation date should each have an explicit role. I want the person reviewing the answer to be able to distinguish them without interpreting an ambiguous label.

I added month-end balance answers drawn from the source system’s own month-end ledger.[^E1] I changed historical balances to take effect at the close of their ledger date, even when the source was read later.[^E2]

For an executive sponsor, the useful distinction is between when information arrives and the period it describes. Ask which date governs a historical answer. Require the delivery team to explain that choice in the language of the review, with a dated question and the records used to answer it.

I also aligned the tenant’s property association with that ledger date, allowing historical balances to be queried by property.[^E3]

Property context belongs in the acceptance discussion alongside the amount. When the question names a property, ask the team to justify the account’s inclusion in that property’s historical population. Treat that justification as part of the answer being delivered.

My decision was to assess the complete business question. I wanted the balance, its effective date and its property context examined together. That gave the review a concrete subject: the historical position management requested.

## What changed in aging, and what did the checks show?

For aging, I changed the supporting evidence to follow the charges assigned to each age band, allowing tenants excluded because of their combined charge histories to appear.[^E4]

The requirement was completeness with support. I wanted each age band assessed against the records relevant to it. For the sponsor accepting the work, the right question is what evidence belongs behind the answer and whether the inclusion rules are appropriate for the business review.

I added an independent, read-only comparison between source records and the live system’s balances and aging results.[^E3] Reconciliation matched all current-tenant charges and former-tenant balances checked, while some former-tenant allocations across age bands still differed.[^E5]

That finding needs a precise acceptance discussion. Ask what was compared, which population was checked and which parts agreed. Require separate conclusions for the amount owed and its allocation by age. Reserve the word “reconciled” for a clearly defined scope.

A tenant can still be omitted if an individual age band exceeds the limit on supporting evidence; the system excludes the tenant instead of truncating that evidence.[^E4]

I include that condition in the result. An executive reviewing delivery should receive the remaining exception alongside the successful checks. The sponsor can then decide whether the outstanding issue is acceptable for the intended use, who owns its resolution and what evidence is required to close it.

This is where I draw the boundary around an accomplishment: state the change, show the comparison and name the remaining condition. Each deserves a place in the delivery review.

## What should you require from your own organisation or vendor?

Start with a question your team actually takes into a collections meeting. Specify the property, the date and whether the review concerns current or former tenants. Ask the builder to explain how the proposed answer satisfies that request.

Then challenge the population. Request the inclusion and exclusion rules in plain language. Include accounts with unusually extensive histories in the acceptance discussion, and assign someone on the business side to approve the rules.

Choose reconciliation checks according to the decision. For a discussion about age bands, require evidence about allocation. For a discussion about the amount owed, require evidence about the balance. Ask the delivery team to connect each conclusion to the comparison that supports it.

Finally, give unresolved differences an explicit place in acceptance. Name the open question, its owner and the evidence needed for resolution. Decide which uses are acceptable while it remains open, and record that decision with the delivery.

My standard is a collections review whose assumptions management can question. Before accepting your next system, ask its builder to defend an actual business answer: why this date, why these accounts and what exactly was checked?
