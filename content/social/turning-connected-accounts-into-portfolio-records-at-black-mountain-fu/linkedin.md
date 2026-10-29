---
source_article: turning-connected-accounts-into-portfolio-records-at-black-mountain-fu
status: draft
hook: An account awaiting verification could be marked empty.
---

That was a failure mode I corrected while building connected-account collection for Black Mountain Fund's portfolio system.[^E4]

I changed the handling so an additional-verification response causes collection to fail explicitly instead of completing as an empty account.[^E4]

The problem also extended beyond initial access to an account. Trade retrieval could stop after its first batch when authorization failed on subsequent requests. I corrected the authorization used to request the remaining batches of trades.[^E4]

I also added checks that reject completion when required information is missing, the trade data is unsupported, or retrieval stops progressing.[^E4]

The changes were checked against recorded provider responses without connecting to live accounts.[^E4] The integration record explicitly keeps the decision to merge this work separate from approval for a production cutover.[^E5]

Book a call at nolangrout.com/book
