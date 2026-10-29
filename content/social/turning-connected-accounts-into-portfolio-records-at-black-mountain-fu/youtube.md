---
source_article: turning-connected-accounts-into-portfolio-records-at-black-mountain-fu
status: draft
hook: This portfolio account needed verification. The system treated it as empty.
---

I changed the blocked-account response to an explicit failure and corrected trade retrieval that could stop before collection finished.[^E4]

I connected recurring synchronization to persistent processing with retries. Individual connection failures no longer stop the others.[^E1][^E2]

Automated records use the existing validation, preview, duplicate checks and full-import commit process.[^E2]

Connection panels show the last success, current state and corrective action, while portfolio views flag stale records.[^E3]

Book a call at nolangrout.com/book
