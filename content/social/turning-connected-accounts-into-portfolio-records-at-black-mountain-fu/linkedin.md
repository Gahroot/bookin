---
source_article: turning-connected-accounts-into-portfolio-records-at-black-mountain-fu
status: draft
hook: An account connection can succeed while the portfolio import fails.
---

At Black Mountain Fund, the replacement application had account connections that accepted credentials without producing transactions. Recurring synchronization could also report a clean result while importing nothing.[^E2]

I connected account synchronization and ledger imports to persistent background processing. Automated imports now use the existing validation and duplicate checks.[^E1][^E2]

I changed the failure rules, too. A broken connection does not stop the other connections, but a run where every connection fails reaches the failure alert path.[^E2]

Trade synchronization received corrections for interrupted record collection and blocked accounts that could be mistaken for empty ones.[^E4]

Operators also get specific connection explanations, corrective actions and an indication when portfolio records are stale.[^E3]

These are implementation changes in the replacement application. The integration record explicitly says that merging the work is not approval for production cutover.[^E5]

Book a call at nolangrout.com/book
