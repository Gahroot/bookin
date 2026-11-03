---
title: The Aging Review That Left Out the Largest Balances
slug: the-collections-review-that-missed-the-largest-balances
type: case-study
description: An aging review omitted tenants with the largest balances. I corrected the exclusion rule and separated verified accounting matches from unresolved coverage.
date: 2026-11-02
updated: 2026-11-02
status: draft
project: triten-os
audience: COOs, fund executives, asset managers and real estate operators
primary_keyword: receivables aging accuracy
secondary_keywords:
  - collections priorities
  - receivables reconciliation
  - missing tenant balances
  - month-end receivables
answer: The aging review excluded 12 of 147 current tenants, including the largest balances.[^E4] I changed the evidence rule to support each aging band with its relevant charges.[^E4] Reconciliation checked accounting agreement separately; the supplied record gives no verified count or balance total for tenants restored after the correction.[^E1][^E4][^E5]
hero_image: /images/articles/the-collections-review-that-missed-the-largest-balances.webp
hero_alt: Conceptual collections review showing missing tenant accounts alongside receivables aging bands
faq:
  - q: Why were tenants missing from the aging review?
    a: The supporting records attached to each aging band included every open charge for that tenant. Crossing the evidence limit excluded the tenant entirely.[^E4]
  - q: Did the correction restore every omitted tenant?
    a: The evidence supplies no verified restoration count or associated balance total. An individual aging band with too many supporting records still causes the tenant to be excluded.[^E4]
  - q: What did the accounting comparisons confirm?
    a: The recorded matches were 203 of 209 month-end tenant balances, 990 of 990 current-tenant charges and 43 of 43 former-tenant balances. Former-tenant aging allocations agreed for 31 of 43 tenants.[^E1][^E5]
cta: book
claims:
  - text: The aging results omitted 12 of 147 current tenants, including tenants with the largest balances.
    kind: outcome
    evidence:
      - E4
  - text: Each aging band used every open charge for its tenant as supporting evidence; exceeding the evidence limit caused the entire tenant to be omitted.
    kind: capability
    evidence:
      - E4
  - text: I changed each aging band to cite the tenant’s identity and the charges allocated to that band; ledger-based evidence also includes the tenant’s balance for the relevant date.
    kind: capability
    evidence:
      - E4
  - text: Ordinary balance snapshots now carry the ledger-read date, month-end answers use the accounting system’s own month-end ledger, and historical balances and tenant-property associations take effect at the end of the ledger date.
    kind: capability
    evidence:
      - E1
      - E2
      - E3
  - text: I added an independent, read-only comparison between the accounting source and the live system, including balances and aging.
    kind: capability
    evidence:
      - E3
  - text: The supplied evidence gives no verified count of restored tenants or total of their balances.
    kind: outcome
    evidence:
      - E4
  - text: A tenant remains excluded when the supporting records for an individual aging band exceed the evidence limit; the evidence is never truncated to fit.
    kind: capability
    evidence:
      - E4
  - text: Month-end balances matched exactly for 203 of 209 tenants against the accounting source’s aging detail.
    kind: metric
    evidence:
      - E1
  - text: Current-tenant charges matched for 990 of 990 charges checked.
    kind: metric
    evidence:
      - E5
  - text: Former-tenant balances matched for 43 of 43 tenants, while their aging allocations matched for 31 of 43 tenants.
    kind: metric
    evidence:
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

## Who was missing when collections priorities were being set?

The aging results omitted 12 of 147 current tenants, including tenants with the largest balances.[^E4] For an executive deciding where to direct collections attention, that put the starting account list in question. I treated the exclusion rule as the first thing to correct.

Each aging band used every open charge for its tenant as supporting evidence; exceeding the evidence limit caused the entire tenant to be omitted.[^E4] The issue sat at the point where accounting records became a management answer. That made the acceptance question very specific: which accounts were allowed into the review?

For a COO or asset manager, deciding whom to contact should follow an explicit view of the account population. Before discussing escalation, payment arrangements or responsibility for follow-up, ask whether the review includes the accounts you expect it to include. An absent account needs an explanation just as much as an unexpected amount does.

The largest balances deserve particular scrutiny in that discussion. A collections review should give management a defensible basis for choosing its next action. Account inclusion belongs in that standard of acceptance, alongside the accuracy of the amounts shown. Treat it as a business requirement when commissioning the system, reviewing a delivery or approving its use in an operating meeting.

## What did I change about the evidence behind an account?

I changed each aging band to cite the tenant’s identity and the charges allocated to that band; ledger-based evidence also includes the tenant’s balance for the relevant date.[^E4]

The decision was about the question being answered. For an amount assigned to an aging band, the supporting records should explain why that amount belongs there. A reviewer should be able to connect the figure to the charges behind it without having to interpret unrelated entries from the account’s history.

That is also a useful way to specify the work to a vendor. Ask what business assertion each supporting record explains. A balance, an overdue charge and an allocation to an aging band are related, but each deserves a clear basis. Require that relationship to be understandable to the person responsible for receivables, rather than leaving acceptance entirely to the delivery team.

I also corrected the historical position behind the review: ordinary balance snapshots now carry the ledger-read date, month-end answers use the accounting system’s own month-end ledger, and historical balances and tenant-property associations take effect at the end of the ledger date.[^E1][^E2][^E3] For a closed-period discussion, specify the requested date and property before inspecting the answer. Keep the date represented by a balance separate from the date someone retrieved its records. Otherwise, the phrase “month-end receivables” leaves too much room for different interpretations between management and the people delivering the system.

Acceptance should stay attached to the management question throughout that discussion. Put a recognisable collections review in front of the delivery team and ask them to explain the evidence in terms the receivables owner can assess. The standard should be an answer that person is prepared to use when assigning follow-up.

## What was verified, and what remains unresolved?

I added an independent, read-only comparison between the accounting source and the live system, including balances and aging.[^E3] I separate the evidence of accounting agreement from the evidence of account coverage when judging the result.

The supplied evidence gives no verified count of restored tenants or total of their balances.[^E4] A tenant remains excluded when the supporting records for an individual aging band exceed the evidence limit; the evidence is never truncated to fit.[^E4] That remaining condition belongs beside any assessment of whether the account population is suitable for a collections review.

The recorded comparisons were:

- **Month-end balances:** Exact matches for 203 of 209 tenants against the accounting source’s aging detail.[^E1] Accept this as a qualified result, with the unmatched balances still requiring attention.
- **Current-tenant charges:** Matches for 990 of 990 charges checked.[^E5] Read this as a check on the underlying charge amounts; evaluate account inclusion separately.
- **Former tenants:** Balances matched for 43 of 43 tenants, while aging allocations matched for 31 of 43 tenants.[^E5] Keep the allocation differences visible when judging whether the aging breakdown is ready for the intended decision.

For executive sign-off, require the result and its unresolved exceptions together. Avoid an acceptance statement as broad as “the receivables reconcile.” Name what was compared, identify what still needs investigation and assign responsibility for deciding whether those exceptions are acceptable. The person approving operational use should have that information in front of them.

## What should you require before accepting your own collections review?

- **Which accounts are missing, and why?** Require an explanation of exclusions, with explicit attention to accounts carrying substantial balances or extensive histories.
- **Does the answer represent the requested date and property?** Ask for supporting accounting records for that specific historical position.
- **What matched, and what remains unresolved?** Require separate conclusions for account coverage, balances, charges and aging allocations, with exceptions beside the relevant result.
