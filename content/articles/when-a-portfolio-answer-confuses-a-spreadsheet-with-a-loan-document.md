---
title: A Portfolio Assistant Rejected Evidence From the Wrong Reporting Period
slug: when-a-portfolio-answer-confuses-a-spreadsheet-with-a-loan-document
type: case-study
description: A portfolio assistant treated spreadsheet content as loan-document text. I changed its source context; a production check rejected the wrong reporting period.
date: 2026-11-16
updated: 2026-11-16
status: draft
project: triten-os
audience: Fund executives, asset managers, COOs and operators
primary_keyword: portfolio AI assistant
secondary_keywords:
  - portfolio reporting
  - document attribution
  - reporting period accuracy
  - AI for real estate funds
answer: I changed a portfolio assistant’s source context after it treated spreadsheet material like loan-document text.[^E1][^E2] In a production check, it identified the spreadsheet and declined to use a Q3 file as Q1 evidence.[^E3] Another checked answer identified a promissory note’s PDF source and linked to it.[^E3]
hero_image: /images/articles/when-a-portfolio-answer-confuses-a-spreadsheet-with-a-loan-document.webp
hero_alt: Illustration comparing a spreadsheet, a loan document and their reporting-period labels during a portfolio review
faq:
  - q: Did the document-handling changes reach production?
    a: Yes. The changes were deployed to the production system.[^E4]
cta: book
claims:
  - text: The portfolio assistant sometimes treated spreadsheet material as though it were a passage from a loan document.
    kind: capability
    evidence:
      - E1
  - text: I changed the document context supplied to the assistant and the presentation of its references, including document type and spreadsheet sheet context.
    kind: capability
    evidence:
      - E2
  - text: I deployed the document-handling changes to production.
    kind: outcome
    evidence:
      - E4
  - text: Follow-up work added source-sheet attribution to spreadsheet figures, using the available sheet name or sheet label.
    kind: capability
    evidence:
      - E5
  - text: In a production check, the assistant identified a spreadsheet by its file type and declined to present a Q3 file as Q1 evidence.
    kind: outcome
    evidence:
      - E3
  - text: In a separate production check, an answer about a promissory note identified its source as a PDF and linked to that document.
    kind: outcome
    evidence:
      - E3
evidence:
  - id: E1
    kind: worklog
    title: Triten private build record (worklog)
    date: 2026-10-28
    public: false
    ref: wl-2026-10-28-triten-os-80
  - id: E2
    kind: worklog
    title: Triten private build record (worklog)
    date: 2026-10-28
    public: false
    ref: wl-2026-10-28-triten-os-94
  - id: E3
    kind: worklog
    title: Triten private build record (worklog)
    date: 2026-10-28
    public: false
    ref: wl-2026-10-28-triten-os-97
  - id: E4
    kind: worklog
    title: Triten private build record (worklog)
    date: 2026-10-28
    public: false
    ref: wl-2026-10-28-triten-os-98
  - id: E5
    kind: github-commit
    title: Triten private build record (commit)
    date: 2026-10-29
    public: false
    ref: triten-os@ae99bbe82327
---

## What was wrong with the portfolio answer?

The portfolio assistant sometimes treated spreadsheet material as though it were a passage from a loan document.[^E1] The error concerned the authority attached to the information: how a reader was being invited to interpret it.

Consider an executive deciding whether an answer establishes a loan obligation. Before accepting that conclusion, the executive should inspect the contractual language. A spreadsheet entry calls for a different inquiry: who reported it, what it represents and whether it belongs to the question under review. Those are different grounds for signing off on an answer.

The potential consequence is a decision made on the wrong basis. An executive could accept a reported figure as evidence of a contractual requirement, then approve a response or escalate an issue without examining the governing text. That is the decision risk in this case, not an observed portfolio event.

I treated the distinction as an acceptance requirement. A response about an obligation should be judged against the document that establishes the obligation. A response about reported activity should be judged against the relevant reporting evidence. The reader should not have to reconstruct that distinction after accepting the conclusion.

## What did I change, and why?

I changed the document context supplied to the assistant and the presentation of its references, including document type and spreadsheet sheet context.[^E2]

My key judgment was that the character of a source belonged inside the answer process. I did not want source classification left to an executive’s interpretation of polished prose. The business question should determine the standard of evidence: contractual language for a contractual assertion, reporting material for a reporting assertion.

Reporting period needed equally explicit treatment in acceptance. For a period-specific question, relevance alone is too loose a standard. Before interpreting a figure, the response should establish whether the material belongs to the period requested. Otherwise, the executive must resolve a hidden substitution before assessing the answer itself.

I deployed the document-handling changes to production.[^E4] Follow-up work added source-sheet attribution to spreadsheet figures, using the available sheet name or sheet label.[^E5]

I included sheet context because an executive reviewing a figure needs a precise place to inspect. The acceptance question is practical: what should the reviewer open, and which part should they examine? A reference should support that review without requiring the reader to guess which table the answer means.

## What did the production checks actually show?

In a production check, the assistant identified a spreadsheet by its file type and declined to present a Q3 file as Q1 evidence.[^E3]

This supplied a concrete counterpart to the original failure. The initial observation concerned spreadsheet material being treated as loan-document text. The production check tested a related boundary: whether the response would assign retrieved material to a reporting period it did not represent. These were separate observations, not a replay of an identical question.

For an executive, the acceptance decision at that point is whether there is an answer fit to use. A response that exposes an evidence mismatch calls for follow-up before approval. The next business step should depend on obtaining the appropriate support, rather than treating a plausible-looking response as completion of the review.

In a separate production check, an answer about a promissory note identified its source as a PDF and linked to that document.[^E3]

I assessed the checks together because they addressed different parts of the judgment. The note question concerned the description and reference attached to a document. The spreadsheet question concerned the attribution the response was willing to make. Both belonged in acceptance because the original concern involved the meaning assigned to retrieved material.

Keep the conclusion at the scope of those recorded responses. Use them as evidence when assessing this change; require separate support for claims about portfolio decisions, financial results or review speed.

## What should you require before accepting your own system?

Keep the acceptance discussion close to a decision someone in the business must approve. Choose the reviewer before the demonstration, and give that person responsibility for judging whether the evidence justifies the proposed conclusion. A fluent answer should still face the scrutiny you would apply to a written recommendation from a colleague.

### Does the source justify the action I am being asked to approve?

Ask your vendor to present an answer about a loan obligation with its supporting material open beside it. Have the responsible business reviewer identify the exact assertion that matters to the decision and locate its support. Then ask whether the proposed action follows from that support.

Keep this check focused on the consequential statement. An answer may contain background that everyone agrees with while the sentence driving approval remains unsupported. Set the acceptance standard around that sentence. If the reviewer cannot establish its basis, leave approval pending and specify what evidence is required next.

### Does the response preserve the period in my question?

Include a question where the available reporting material belongs to a different period. Agree beforehand that the response must make any mismatch explicit. Judge the demonstration against that requirement, and assign an owner to obtain the requested material if the business question remains open.

Record the disposition in ordinary operating language: ready for review, awaiting evidence or requiring correction. That gives the executive a clear acceptance decision and gives the delivery team a concrete next step. Ask for demonstrated behavior on the questions your organisation intends to act on.
