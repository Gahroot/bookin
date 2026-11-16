---
title: When a Portfolio Answer Gives a Spreadsheet the Wrong Authority
slug: when-a-portfolio-answer-confuses-a-spreadsheet-with-a-loan-document
type: case-study
description: A portfolio assistant confused spreadsheet content with loan-document text. I changed its source context and checked how it handled reporting-period evidence.
date: 2026-11-16
updated: 2026-11-16
status: draft
project: triten-os
audience: Fund executives, asset managers, COOs and operators
primary_keyword: portfolio AI assistant
secondary_keywords:
  - document attribution
  - portfolio reporting
  - AI for real estate funds
  - reporting evidence
answer: I changed the source information supplied to a portfolio assistant after spreadsheet content was presented like loan-document language.[^E1][^E2] A production check subsequently rejected a reporting-period mismatch.[^E3] That demonstrated a specific refusal to misattribute evidence; the original confusion between spreadsheet and contract still called for its own retest.[^E1][^E3]
hero_image: /images/articles/when-a-portfolio-answer-confuses-a-spreadsheet-with-a-loan-document.webp
hero_alt: A spreadsheet and a loan document shown as distinct sources of evidence for a portfolio question
faq:
  - q: Did the production check prove that the original document confusion was fixed?
    a: The documented check showed that the assistant recognised a spreadsheet and withheld a first-quarter attribution for a third-quarter file. Its demonstrated scope was reporting-period accuracy; confirming the original contract-versus-spreadsheet issue requires a directly relevant retest.[^E1][^E3]
  - q: What should an executive require from a document-based answer?
    a: Require contractual support for an assertion about an obligation and evidence from the requested period for a reporting assertion. Keep the business question open when the available material cannot support it.
cta: book
claims:
  - text: The portfolio assistant sometimes presented spreadsheet content as though it were a passage from a loan document.
    kind: capability
    evidence:
      - E1
  - text: I changed the source context supplied to the assistant, including document type, spreadsheet sheet context and reading guidance, and updated how document references appeared.
    kind: capability
    evidence:
      - E2
  - text: In a production spreadsheet check, the assistant identified the file type and declined to attribute a Q3 file to Q1; this recorded reporting-period result did not document a direct retest of the original spreadsheet-as-loan-document error.
    kind: outcome
    evidence:
      - E1
      - E3
  - text: Follow-up work made spreadsheet figures name their source sheet using the available sheet name or sheet label.
    kind: capability
    evidence:
      - E5
  - text: Follow-up work added a document-link check that corrects an altered link when it can identify the returned file and otherwise removes the link.
    kind: capability
    evidence:
      - E5
  - text: The document-handling changes were deployed to production.
    kind: outcome
    evidence:
      - E4
  - text: A production answer about a promissory note identified its source as a PDF and linked to that document.
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

A portfolio assistant sometimes presented spreadsheet content as though it were a passage from a loan document.[^E1] I changed the source information it received—including document type, spreadsheet sheet context and reading guidance—and updated how its document references appeared.[^E2] A production spreadsheet check then identified the file type and declined to attribute a Q3 file to Q1. That was a reporting-period result; it did not document a direct retest of the original spreadsheet-as-loan-document error.[^E1][^E3]

The distinction matters to anyone reviewing an answer about a portfolio. A statement about what a borrower must do calls for contractual support. A statement about what someone reported calls for the relevant reporting material. Those are different questions, even when the subject, organisation and vocabulary overlap.

The defect that caught my attention was the way the answer characterised its evidence. Before debating whether a figure was correct, I wanted the answer to be clear about what kind of material it was drawing from. Calling spreadsheet content a passage from a loan document gives the reader the wrong basis for interpreting it.

I treated that as a source-handling problem. The business requirement was straightforward: preserve the distinction between a reported figure and language that establishes an obligation. Finding relevant material was only part of the job I wanted the system to perform.

## What did I decide the system needed to know?

My decision was to make source identity explicit at the point where the assistant interpreted the material. A reader should not have to infer whether an answer rests on a workbook or a contractual document from the tone of the response. I wanted that distinction available while the answer was being formed.

That judgment also shaped how I thought about spreadsheet evidence. A workbook is a container. When a figure appears in an answer, my standard is that the reference should identify the relevant part of that container. Otherwise, opening the right file still leaves the reader with an unresolved attribution question.

Follow-up work made spreadsheet figures name their source sheet, using the available sheet name or sheet label.[^E5] That detail belonged in the business-facing answer because it concerns where a reported number came from. It was not necessary to expose the machinery behind the search to make that attribution specific.

I also added a document-link check: it corrects an altered link when it can identify the returned file and removes the link otherwise.[^E5] The judgment behind that rule was simple. I did not want a reference to remain clickable merely because it looked like a plausible document address.

These choices reflect what I consider part of delivering an answer: identify the material, locate the supporting passage or figure, and make the reference accountable to the source. The executive should be assessing the substance of the answer, with its evidentiary basis visible alongside it.

## What result can I put behind the change?

The document-handling changes reached production.[^E4] Deployment answers an operational question: whether the change was available in the live system. I keep that separate from the question of what any particular response demonstrated.

A production answer about a promissory note identified its source as a PDF and linked to that document.[^E3] The useful detail in that observation is the combination of a source description and a reference the reader could inspect. The record supports that concrete response behaviour.

A reference to the right file is still only part of an evidentiary judgment. For an obligation claim, the consequential question is whether the cited language supports the assertion. Merely identifying a document format is not the acceptance standard I set for contractual interpretation.

The same discipline applies when describing my own work. I can report a shipped change and a recorded response without turning them into a claim about a completed business review. A fund executive reading a case study deserves the same connection between assertion and evidence that I expect inside the assistant.

For that reason, I frame the accomplishment around document handling and the observed answer behaviour. I attach no claim about faster decisions, reduced review effort or changed portfolio performance to this work. Those outcomes require evidence about the people and processes involved, beyond a system response.

That boundary is part of the account, not a reason to bury the result. A specific production observation is useful when its meaning stays specific. It gives the reader something concrete to assess without asking them to accept a larger business benefit on inference alone.

## What should you ask of your own organisation or vendor?

Ask what supports the sentence that matters to the decision. For an obligation, require contractual evidence. For a period-specific reporting assertion, require material from that period. If the support is missing or mismatched, keep the question open.

That is the short takeaway from this work. The standard should follow the business assertion, not the confidence of the prose or the presence of a citation. A well-presented reference deserves scrutiny at exactly the point where someone is being asked to rely on it.

When I discuss a system with an executive, that is the conversation I want to have: what must the evidence establish before you accept the answer? Define that expectation around an actual operating question. Then judge the delivered behaviour against it, and describe the result with the same precision.
