---
source_article: when-a-portfolio-answer-confuses-a-spreadsheet-with-a-loan-document
status: draft
hook: Is your portfolio assistant treating a spreadsheet like a loan document?
---

At Triten, that was an observed problem: spreadsheet material was sometimes being presented as though it were a passage from a loan document.[^E1]

I changed the source context supplied to the assistant and the presentation of document references, including document type and spreadsheet sheet context.[^E2] The changes went into production.[^E4]

Production checks showed an answer identifying a promissory note as a PDF and linking to it. A separate check identified spreadsheet evidence and declined to use a later reporting period in place of the earlier period requested.[^E3]

Follow-up work added sheet attribution for spreadsheet figures and checks on document-library links against retrieved sources. Rewritten links are corrected when a unique filename match exists; otherwise, the link is removed.[^E5]

That is the accomplishment: a specific evidence-handling defect, changes to address it, and observed production behavior showing the distinction in the answers.[^E1][^E2][^E3]

Book a call at nolangrout.com/book
