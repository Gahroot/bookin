---
source_article: turning-connected-accounts-into-portfolio-records-at-black-mountain-fu
status: draft
hook: An account awaiting verification was being presented as empty.
---

In portfolio synchronization work, an account requiring additional verification could complete as though it had no records.[^E4]

I changed that response to an explicit failure. I also corrected trade retrieval that could stop after its initial batch, and added checks against missing information, unsupported data and stalled collection.[^E4]

Behind collection, I connected recurring synchronization to persistent processing with retries. A failed connection does not stop the others; a run where every connection fails reaches the alert path.[^E1][^E2]

Automated records go through the existing import process, including validation, preview, duplicate detection and committing the import in full.[^E2]

The operator view shows the last successful connection, its current state and a corrective action. Portfolio views flag stale records.[^E3]

The integration record separates merging this work from approval for production cutover.[^E5]

Book a call at nolangrout.com/book
