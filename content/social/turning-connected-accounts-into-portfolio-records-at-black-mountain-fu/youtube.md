---
source_article: turning-connected-accounts-into-portfolio-records-at-black-mountain-fu
status: draft
hook: What if “empty” means account verification is still required?
---

I corrected that failure mode in portfolio collection for Black Mountain Fund: a verification requirement now stops collection with an explicit failure.[^E4]

I also repaired authorization on later trade requests, where retrieval could previously stop after the opening batch.[^E4]

Missing required information, unsupported trades and stalled retrieval now prevent completion.[^E4]

The integration record keeps a separate release boundary: merging the work does not authorize production cutover.[^E5]

Book a call at nolangrout.com/book
