---
title: When a Portfolio Answer Confuses a Spreadsheet With a Loan Document
slug: when-a-portfolio-answer-confuses-a-spreadsheet-with-a-loan-document
type: case-study
description: At Triten, I changed how a portfolio assistant handles spreadsheets and loan documents, with production checks on document types and reporting periods.
date: 2026-11-16
updated: 2026-11-16
status: draft
project: triten-os
audience: Fund executives, asset managers, COOs and operators
primary_keyword: portfolio AI evidence
secondary_keywords:
  - portfolio assistant
  - document source verification
  - spreadsheet evidence
  - AI for real estate funds
answer: At Triten, I changed the source context supplied to a portfolio assistant.[^E2] Production checks showed it distinguishing document formats and rejecting a spreadsheet from the wrong reporting period.[^E3] Spreadsheet figures now name their source sheet, and document-library links are checked against retrieved sources, with correction or removal for rewritten destinations.[^E5]
hero_image: /images/articles/when-a-portfolio-answer-confuses-a-spreadsheet-with-a-loan-document.webp
hero_alt: Conceptual comparison of a loan document and a spreadsheet, highlighting document type, reporting period and source sheet
faq:
  - q: What happened when the requested reporting period was unavailable?
    a: In the observed production check, the assistant declined to use a later-period spreadsheet as evidence for the earlier period requested.[^E3]
  - q: How are spreadsheet figures attributed?
    a: The assistant identifies the sheet associated with a spreadsheet figure, using the available sheet name or sheet label.[^E5]
  - q: What happens to a document link that has been rewritten?
    a: Links into the connected document library are compared with retrieved source URLs. A rewritten destination is replaced when a unique filename match exists; otherwise, its link is removed.[^E5]
cta: book
claims:
  - text: At Triten, the portfolio assistant sometimes treated spreadsheet material as though it were a passage from a loan document.
    kind: capability
    evidence:
      - E1
  - text: I changed the source information supplied to the assistant and the presentation of document references, carrying document type and spreadsheet sheet context alongside the retrieved material.
    kind: capability
    evidence:
      - E2
  - text: I deployed the document-handling changes to production.
    kind: outcome
    evidence:
      - E4
  - text: In a production check involving a promissory note, the answer identified the source as a PDF and linked to that document.
    kind: outcome
    evidence:
      - E3
  - text: In a separate production check, the assistant identified spreadsheet evidence by its file type and declined to substitute a later reporting period for the earlier period requested.
    kind: outcome
    evidence:
      - E3
  - text: Spreadsheet figures now identify their source sheet, using the sheet name or the available sheet label.
    kind: capability
    evidence:
      - E5
  - text: For links into the connected document library, the assistant checks destinations against retrieved source links, corrects rewritten links when a unique filename match exists, and otherwise removes the link.
    kind: capability
    evidence:
      - E5
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

I judge a portfolio answer by whether I would put it in front of the person responsible for the decision. That means looking beyond the conclusion. What kind of evidence supports it? Does that evidence address the question asked? Where should the reader look to check it?

Those questions defined a specific piece of work at Triten: making the basis of an answer explicit enough to inspect.

## What was wrong with the evidence behind the answer?

At Triten, the portfolio assistant sometimes treated spreadsheet material as though it were a passage from a loan document.[^E1]

For an executive reviewing an answer, the distinction matters. I read a contractual passage for what the document says. I read a spreadsheet entry in the context of its sheet, headings and reporting period. I want the assistant to preserve that distinction in the answer it presents.

The business question was therefore about the authority behind a statement. Was the answer describing a written provision, or interpreting a value in a table? Before accepting the conclusion, I wanted that question settled.

I treated this as an evidence-handling problem. The standard I set was straightforward: the answer should describe its source on that source's terms. A polished explanation was secondary to an accurate account of what had actually been retrieved.

That is the useful way for a fund executive to frame this kind of defect. Start with the decision and ask what the reader needs to know before relying on the answer.

## What did I change?

I changed the source information supplied to the assistant and the presentation of document references, carrying document type and spreadsheet sheet context alongside the retrieved material.[^E2]

The decision behind that work was to make source context part of the evidence presented to the assistant. I wanted the distinction available when the answer was being formed, with corresponding attention to how its references appeared to the reader.

This is a business requirement that deserves a place in the brief. “Answer questions about our documents” leaves too much unspecified. My acceptance standard was more concrete: preserve the character of the source when explaining what it supports.

I deployed the document-handling changes to production.[^E4]

For this work, I also wanted observations from actual production questions. My review focused on the answer as an executive encounters it: the wording, the attribution and the destination of the reference. Those were the places where I wanted evidence of the intended behavior.

The resulting record contains both a release and production observations. I use the observations to describe what happened in the checks, and the subsequent source-handling changes to describe the capabilities added.

## What did the production checks show?

In a production check involving a promissory note, the answer identified the source as a PDF and linked to that document.[^E3]

That was a useful test of a narrow requirement: could the answer accurately describe the kind of document behind its explanation? I chose to assess the visible response, because that is what the person making the decision has to evaluate.

In a separate production check, the assistant identified spreadsheet evidence by its file type and declined to substitute a later reporting period for the earlier period requested.[^E3]

For me, an appropriate refusal belongs in the acceptance criteria. If the requested evidence is missing, I want the response to preserve that gap. The executive should decide whether another period is acceptable for the business question. That choice belongs with the reader.

Follow-up work addressed attribution within spreadsheets and the handling of document destinations.

Spreadsheet figures now identify their source sheet, using the sheet name or the available sheet label.[^E5]

I consider the sheet part of the citation an executive should expect when reviewing a spreadsheet-derived statement. The useful review question is specific: which part of the workbook supports this assertion?

For links into the connected document library, the assistant checks destinations against retrieved source links, corrects rewritten links when a unique filename match exists, and otherwise removes the link.[^E5]

My standard for a reference is that its destination should be supported by the retrieved evidence. I want that requirement assessed alongside the prose, as part of the same answer.

## What should you ask of your own organisation or vendor?

Ask to review the assistant on questions your team actually brings to meetings. Choose examples where the evidence requires interpretation: a written obligation, a table with several plausible entries, or a request tied to a particular reporting period.

Then make the acceptance discussion about business meaning. What exactly is the answer asserting? What would you need to inspect before approving a recommendation based on it? Which uncertainties should remain visible to the person responsible?

Include an incomplete-evidence question in that review. Decide in advance what an acceptable response looks like when the requested support is unavailable. Set a clear expectation for when the assistant should stop, explain the gap and leave the decision with the reader.

Also ask your vendor to distinguish a demonstrated result from a promised capability. Request the question asked, the response observed and the evidence used to assess it. Keep the conclusion proportionate to that record.

For a COO or fund executive, this is an ownership question. Someone should be responsible for defining acceptable evidence, reviewing failures and deciding when an answer is ready for operational use. Give that responsibility a place in the project from the beginning.

That is the conversation I want to have when scoping a portfolio assistant: which decisions matter, what evidence those decisions require, and what the organisation will accept as proof. Book a call to discuss those requirements for your business.
