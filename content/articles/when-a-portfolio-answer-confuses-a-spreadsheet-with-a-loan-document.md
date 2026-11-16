---
title: When a Portfolio Assistant Refused the Wrong Reporting Period
slug: when-a-portfolio-answer-confuses-a-spreadsheet-with-a-loan-document
type: case-study
description: I changed how a portfolio assistant handled source evidence. A production check then refused to present a later reporting period as the earlier one requested.
date: 2026-11-16
updated: 2026-11-16
status: draft
project: triten-os
audience: Fund executives, asset managers, COOs, founders and operators
primary_keyword: portfolio AI assistant
secondary_keywords:
  - portfolio reporting
  - AI for real estate funds
  - reporting period accuracy
  - document evidence
answer: I changed the document context supplied to a portfolio assistant and the way its source references appeared to readers.[^E2] In a production check, it identified a spreadsheet and declined to present a later-period file as evidence from the earlier period requested.[^E3]
hero_image: /images/articles/when-a-portfolio-answer-confuses-a-spreadsheet-with-a-loan-document.webp
hero_alt: A portfolio review showing a requested reporting period beside a spreadsheet from a different period
faq:
  - q: Did the check establish that the requested reporting period was available?
    a: The recorded observation was a refusal to misattribute the retrieved spreadsheet to the requested period.[^E3] Whether the requested evidence was available is a separate question; this result does not answer it.
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
  - text: Spreadsheet figures identify their source sheet using the available sheet name or sheet label.
    kind: capability
    evidence:
      - E5
  - text: The assistant checks document-library links against retrieved source links, corrects rewritten destinations when a single matching returned file exists, and otherwise removes the hyperlink.
    kind: capability
    evidence:
      - E5
  - text: In a production check, the assistant identified spreadsheet evidence by its file type and declined to misattribute a later-period file to the earlier reporting period requested.
    kind: outcome
    evidence:
      - E3
  - text: In another production check, an answer about a promissory note identified its source as a PDF and linked to that document.
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

## What happens when a spreadsheet sounds like a loan document?

A portfolio assistant sometimes treated material retrieved from a spreadsheet as though it were a passage from a loan document.[^E1]

For a fund executive, the business risk is a change in meaning. A reported value and a written obligation deserve different scrutiny. Before relying on an answer, the reader needs to establish whether it describes what a document requires or what a table reports. The wording should leave that distinction intact.

Consider the decision facing someone reviewing an answer about an obligation. Is there contractual language to inspect, or an operating figure to interpret? Those are different grounds for a conclusion. Presenting the latter with the authority of the former risks giving the reader a reason to act that the source never supplied.

That was the problem I took on. The brief was about preserving the meaning of evidence between retrieval and the executive reading the answer. It was not enough to ask whether a response sounded reasonable. The source had to support the particular assertion being made.

The same concern applies to the question itself. A request tied to a reporting period contains a constraint, not a suggestion. A relevant-looking document still needs to qualify as evidence for that request. That distinction became central to assessing the work.

## What did I change in the system?

I changed the document context supplied to the assistant and the presentation of its references, including document type and spreadsheet sheet context.[^E2]

The decision was to treat those details as part of the business evidence. An executive should not have to infer the character of a source from confident prose. The answer needs to respect the material behind it, whether the task concerns an obligation, a reported figure or a comparison.

I deployed the document-handling changes to production.[^E4] Follow-up work added source-sheet attribution to spreadsheet figures.[^E5] It also added checks of document-library links against retrieved source links, correcting rewritten destinations when a single matching returned file exists and otherwise removing the hyperlink.[^E5]

These changes addressed the question of what the reader is being asked to trust. For the business review, the relevant issue was the relationship between an assertion and the material offered in support of it. An attractive reference is beside the point if its destination lacks that relationship.

## What actually happened in the production checks?

The strongest observed result was a refusal. In a production check, the assistant identified spreadsheet evidence by its file type and declined to misattribute a later-period file to the earlier reporting period requested.[^E3]

That matters because a reporting-period request defines the scope of a business question. Replacing that scope without the reader's agreement changes the question under review. The appropriate acceptance decision here was about whether the retrieved material qualified, before any interpretation of its contents.

The conclusion from this check is specific: the observed response respected that boundary. Whether the requested period was available remained a separate question. So did whether any figures required reconciliation. Neither issue should be treated as settled merely because the response handled attribution correctly.

For an executive, this separates a useful finding about the answer from a finding about the portfolio. The test concerned the assistant's treatment of evidence. A portfolio conclusion still needs support addressing the actual business question. Keeping those judgments separate is part of reviewing the result honestly.

Another production check concerned a promissory note. The answer identified its source as a PDF and linked to that document.[^E3]

That observation addressed the original concern from a different direction: the description of a document in the answer. I assessed it as a concrete response to inspect, with a source and an attribution, rather than as a general assurance about future performance.

There is no measured reduction in review time to report here. The accomplishment rests on the deployed changes and the observed responses. For this case, that is the appropriate basis for judging what changed; a claim about faster decisions or less manual work needs its own evidence.

## What should you ask before accepting a portfolio assistant?

Bring the acceptance discussion back to the decisions your organisation expects to make. This case suggests concrete questions for the person signing off on the system, whether that is a fund executive, a COO or an operating lead.

### Can I tell what gives this answer its authority?

Ask to inspect an answer involving a written obligation alongside an answer based on reported data. Read each as the executive who must approve the next step. What is being asserted, and what evidence is offered for that assertion?

Keep the discussion focused on business meaning. A reference alone is not the acceptance criterion. Decide whether the source supports the interpretation the answer invites. Assign responsibility for that judgment to someone who understands the underlying decision, rather than leaving it entirely to the person demonstrating the software.

### What happens when the evidence does not fit the requested period?

Include a question where the available material and the requested period differ. Agree in advance on how the response should handle that mismatch. The demonstration should make clear whether the assistant preserves the request or silently changes its scope.

Then separate acceptance of the response from completion of the business task. A refusal may satisfy the former while leaving the latter open. Establish who follows up on the unresolved request and what evidence they need before proceeding.

That is the conversation to bring into a portfolio assistant project: the business question, the evidence required to answer it, and the point at which the system must leave a decision unresolved.
