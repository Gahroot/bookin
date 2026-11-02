---
title: Why the Largest Balances Disappeared From an Aging Review
slug: the-collections-review-that-missed-the-largest-balances
type: case-study
description: A receivables review omitted tenants with the largest balances. I corrected aging evidence and historical answers, then checked the results against the source.
date: 2026-11-02
updated: 2026-11-02
status: draft
project: triten-os
audience: Asset managers, COOs, fund executives and real estate operators
primary_keyword: receivables aging accuracy
secondary_keywords:
  - collections review
  - month-end receivables
  - historical tenant balances
  - aging reconciliation
answer: I changed aging evidence rules so tenants excluded by their combined charge histories could appear.[^E4] I also corrected historical balance dates and property associations.[^E1][^E2][^E3] Reconciliation showed agreement on the current-tenant charges and former-tenant balances checked, with differences in some aging allocations and a remaining exclusion rule.[^E4][^E5]
hero_image: /images/articles/the-collections-review-that-missed-the-largest-balances.webp
hero_alt: Conceptual receivables review highlighting missing accounts beside aging bands and historical balance dates
faq: []
cta: book
claims:
  - text: The aging results omitted 12 of 147 current tenants, including tenants with the largest balances.
    kind: outcome
    evidence:
      - E4
  - text: Each aging band was supported by the tenant’s entire open-charge history; exceeding the limit on supporting records caused the whole tenant to be omitted.
    kind: capability
    evidence:
      - E4
  - text: I changed each aging band to use the tenant’s identity and only the charges belonging to that band, allowing tenants excluded by their combined charge histories to appear.
    kind: outcome
    evidence:
      - E4
  - text: Ordinary balances had been labeled with the beginning of the accounting month even when read later, and historical answers had also incorrectly reported zero.
    kind: outcome
    evidence:
      - E1
  - text: I made ordinary balance snapshots carry the date their ledger was read, while retaining the accounting month separately.
    kind: capability
    evidence:
      - E1
  - text: A September month-end balance read in October had become available to historical questions only from the October read, causing a September question to fall back to a later balance.
    kind: outcome
    evidence:
      - E2
  - text: I changed historical balances to take effect at the end of their ledger date, even when the records were read later.
    kind: capability
    evidence:
      - E2
  - text: I added month-end answers drawn from the accounting system’s own month-end ledger.
    kind: capability
    evidence:
      - E1
  - text: I aligned each tenant’s property association with the historical ledger date so a property-specific question could find the tenant at that date.
    kind: capability
    evidence:
      - E3
  - text: I added an independent, read-only comparison between the accounting source and the live system, covering balances and aging among the records checked.
    kind: capability
    evidence:
      - E3
  - text: The month-end balance comparison matched 203 of 209 tenants exactly against the source aging detail.
    kind: metric
    evidence:
      - E1
  - text: The aging reconciliation matched 990 of 990 current-tenant charges and 43 of 43 former-tenant balances; former-tenant aging allocations matched for 31 of 43 tenants.
    kind: metric
    evidence:
      - E5
  - text: A tenant can still be excluded when the supporting records for an individual aging band exceed the evidence limit; the system omits the tenant rather than shortening the evidence.
    kind: capability
    evidence:
      - E4
  - text: I changed aging evidence rules so tenants excluded by their combined charge histories could appear.
    kind: outcome
    evidence:
      - E4
  - text: I also corrected historical balance dates and property associations.
    kind: capability
    evidence:
      - E1
      - E2
      - E3
  - text: Reconciliation showed agreement on the current-tenant charges and former-tenant balances checked, with differences in some aging allocations and a remaining exclusion rule.
    kind: outcome
    evidence:
      - E4
      - E5
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

## Who was missing from the collections review?

The aging results omitted 12 of 147 current tenants, including tenants with the largest balances.[^E4]

That was the business problem I put first. For an asset manager deciding where to focus collection attention, those are consequential omissions. The concern was the possibility of setting priorities from an incomplete account list. I treated account coverage as part of the collections question itself.

The distinctive part of this case was where the problem came from. Each aging band was supported by the tenant’s entire open-charge history; exceeding the limit on supporting records caused the whole tenant to be omitted.[^E4]

An aging band groups debt by how long it has been outstanding. Its supporting records should explain the amount assigned to that band. I focused on that relationship: which charges belonged behind this particular part of the answer? The tenant’s full history was a separate consideration.

## What did I change to make the answer fit the business question?

I changed each aging band to use the tenant’s identity and only the charges belonging to that band, allowing tenants excluded by their combined charge histories to appear.[^E4]

That is the before-and-after example in this work: an account’s extensive history had triggered exclusion; evidence tied to the relevant charges allowed publication. The business objective was to preserve the account in the review with support for its aging position. I kept the change focused on that objective.

Historical balances required a separate correction. Ordinary balances had been labeled with the beginning of the accounting month even when read later, and historical answers had also incorrectly reported zero.[^E1]

I made ordinary balance snapshots carry the date their ledger was read, while retaining the accounting month separately.[^E1] My decision was to give those labels distinct meanings. The period used to organise receivables and the date an observed balance describes both belong in the business conversation.

There was another timing problem behind month-end questions. A September month-end balance read in October had become available to historical questions only from the October read, causing a September question to fall back to a later balance.[^E2]

I changed historical balances to take effect at the end of their ledger date, even when the records were read later.[^E2] I added month-end answers drawn from the accounting system’s own month-end ledger.[^E1]

The distinction matters when management reviews a closed period after that period has ended. I used the requested accounting position as the reference point for the historical answer. The arrival of information was a separate event, and I treated it that way in the correction.

I aligned each tenant’s property association with the historical ledger date so a property-specific question could find the tenant at that date.[^E3] I considered the property part of the question just as deliberately as the balance. A collections discussion names a place as well as a period; both deserved explicit treatment.

## What did the comparisons establish, and what remains open?

I added an independent, read-only comparison between the accounting source and the live system, covering balances and aging among the records checked.[^E3]

The month-end balance comparison matched 203 of 209 tenants exactly against the source aging detail.[^E1] The aging reconciliation matched 990 of 990 current-tenant charges and 43 of 43 former-tenant balances; former-tenant aging allocations matched for 31 of 43 tenants.[^E5] A tenant can still be excluded when the supporting records for an individual aging band exceed the evidence limit; the system omits the tenant rather than shortening the evidence.[^E4]

Those results belong together in the delivery account. I report the comparison by the thing examined: tenant balances, individual charges and allocations across aging bands. Each answers a different part of the receivables question. I keep that distinction when describing what was accomplished.

For the remaining evidence limit, the business decision is whether the account population is acceptable for the intended review. I want that decision made explicitly by the people responsible for collections. A rule governing omission deserves the same scrutiny as a rule governing which amount appears beside an account.

## What should you ask before accepting your own collections system?

Bring an actual management question to the review. Use a closed period, a property and an account population that your team recognises. Keep the discussion attached to the collection decision you intend to make.

Then ask these questions:

- **Which accounts are absent, and what rule keeps them out?** Require the delivery team to explain exclusions in business language, including how it treats accounts with extensive histories.
- **Does this answer describe the requested period and property?** Ask the team to show the source records supporting that particular historical position.
- **What matched in the comparison, and what still differs?** Require separate conclusions for balances and aging allocations, with remaining exceptions beside the results.

Those are the acceptance questions I take from this case. Put them in front of the person signing off the work, and make the answers part of the decision to use it.
