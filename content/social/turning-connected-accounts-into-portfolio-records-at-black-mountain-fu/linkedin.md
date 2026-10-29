---
source_article: turning-connected-accounts-into-portfolio-records-at-black-mountain-fu
status: draft
hook: The account was connected. The portfolio still had no transactions.
---

In a portfolio system I worked on, credentials were accepted while recurring synchronization reported success without importing account activity.[^E2]

I made the existing import process the acceptance boundary. Automated activity now goes through its validation, preview, duplicate detection and full-import commitment.[^E2]

I also corrected retrieval that could stop after its opening batch. Additional verification now produces an explicit failure instead of an empty account, and missing information, unsupported trades or stalled retrieval prevent completion.[^E4]

Connection views now show the last actual success, current state and corrective action. Portfolio views flag stale figures.[^E3]

The provider safeguards were checked against recorded responses without live network access. Production cutover approval remained separate from merging the work.[^E4][^E5]

Book a call at nolangrout.com/book
