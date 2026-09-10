# STATUS - can-widget (savings widget, project quiz, segment pages)

Last updated: 2026-09-10 (Claude Code, segment page polish: sticky calculator, Upcoming events, ranked For-every-Creator strip)

## Current state (20-second read)

- **Served from GitHub Pages** at `https://creatoraccessnetwork.github.io/can-widget/` off the `gh-pages` branch; `main` is the source. Every push to main must be mirrored to gh-pages (checkout the files from main, commit, push).
- **Homepage widget**: `cansw-v2.js` (two-panel receipt). `cansw.js` v1 stays for older co-branded offer pages.
- **Project quiz**: `can-quiz.js`, LIVE on the homepage since 2026-09-10 in site-theme section `1787360000007` (directly under the hero). Three or four questions, path to all fifteen segment pages, "Not sure yet" scrolls to the Starter Set form. Events `quiz_answer` / `quiz_complete` to gtag, fbq, dataLayer. No email gate. Snippet: `embed/homepage-quiz-snippet.html`.
- **Fifteen segment pages**: Kajabi offers ($49/yr, Paid Community product), PUBLISHED 2026-09-10 at Avi's request. Each checkout theme is three sections mounting `can-segment.js` (see `scripts/build_segment_page.py`). Offer ids, tokens, theme ids: `scripts/segment_pages.json`. Page config (membership, terms, eligibility, H1s): `segments.json`. Figures: `segments-live.json` + the `segments` block in `numbers.json`, both written by `scripts/segments.py` from the deal-number sync's `parsed.json`.
- **Numbers**: site-wide 50 partners / $36,000+ / exact 36336 (tracker run 2026-09-04, re-confirmed 2026-09-09). Segment totals in `numbers.json.segments`.
- **Query-string contract** quiz to page: `?seg=<slug>&stage=pre|under100k|over100k[&platform=youtube|instagram|newsletter|other]&via=quiz`. Stage `pre` hides Karat; grow page swaps H1 and row order by platform.

### 2026-09-10 (later) - Segment page polish (Claude Code)
- Hero stat labels are now "in savings" and "discounts" (were "for this project" / "partners on this page").
- Every decision row carries a "You save" label above its dollar figure; intro copy says the figure is what the discount is worth.
- Calculator is sticky on desktop. Kajabi's theme sets `overflow-x:hidden` on `body`, which made `body` the sticky container and killed it; `can-segment.js` now swaps `hidden` for `clip` on any ancestor of the calculator (`unclip()`), so it pins at 24px and stops at the bottom of the list column. `test/segment.html` mimics the Kajabi overflow so the harness reproduces it.
- "Also this year" per-segment strips are gone. A top-level `events` list in `segments.json` (VidSummit, CreatorIQ Connect) renders full width under the two columns on every page as "Upcoming events", never counted. CreatorIQ left the brand-deals decision rows (that page now counts 8 discounts). Per-segment `strips` are still merged in if ever used.
- `every_creator_strip` is a ranked list (Wispr Flow, Mercury, beehiiv, Pop.store, then Kajabi, Epidemic Sound, Mighty Networks, Teachable, Valim, Ratelle Law); each page shows the first `every_creator_show` (4) not already on that page. Rule from Avi: biggest brands unless he names a company.
- `scripts/segments.py` writes an `events` block; figures regenerated from a fresh tracker parse (SAFE, 50 / 36336 unchanged). `parsed.json` is not kept in the repo: fetch the OFFER TRACKING page and run the can-deal-numbers `parse_tracker.py` first.
- Harness launch config now serves `/private/tmp/can-widget-harness` (the mirror), not `~/Desktop`.

## Open items

- **Testimonial slots empty** on all fifteen pages (render only when `segments.json` has a real, permissioned quote; `?preview=slots` shows the placeholder). Blocked on Avi supplying quotes.
- **Valim conflict**: tracker says $2,000, `cansw-data.json` still [360, 450]. Segment pages show $2,000, homepage widget shows $450. Needs a data-file sync.
- **Ad Sales as a Service / Revenews**: removed from every segment page (Avi, 2026-09-10: bigger channels only). Widget data still says "Revenews"; the rename keeps getting reverted by automation pending Avi's confirmation.
- **Fourthwall** excluded from all segment pages (Avi, 2026-09-10 "do not include"). One config edit puts it back.
- **Roster** shown without a figure, out of the Protect total, until the tracker's $1,280+ vs $280-$810 conflict is settled.
- **Driff** copy needs partner approval before it is promoted; **Soundstripe** eligibility assumed new customers only.
- **Kajabi page titles** on the fifteen offers are the generic site title; set SEO titles in offer settings if wanted.
- **Docs to mirror**: Copywriter Brief and Appendix still describe eight tiles; rule 0e in the business skill; tracker Goal Tags per segment.
- Hosting: keep GitHub Pages. A Supabase table for quiz completions (persona data) is the only worthwhile follow-on.

## Hard-won gotchas

- The local clone is on Avi's Desktop; the Claude Code preview server cannot read `~/Desktop`. Mirror the repo to `/private/tmp/can-widget-harness` (rsync, exclude `.git`) and use the `can-widget-harness` launch config; harness pages live in `test/`.
- Stale `.git/*.lock` files from a crashed 2026-09-04 process blocked git; they were moved aside as `*.stale-2026-09-04`, never deleted. Local-only commit kept on `backup/local-main-2026-09-09`.
- Automations (widget-notion-sync) push to main and gh-pages on their own schedule; always `git fetch` and rebase before pushing.
- Kajabi offer checkout URLs return Cloudflare 403 to plain curl; use a browser user agent.
- Do not add robots meta tags to Kajabi pages (Avi, 2026-09-10); Vidpros is simply left off segment pages instead.
- Partner names in `segments.json` must match `n` in `cansw-data.json` exactly; tracker spellings that differ go in the row's `tracker` field (Creator's Guild of America).

## Build history

### 2026-09-10 - Project quiz + fifteen segment pages (Claude Code)
- Plan approved by Avi with rulings: Roster no figure; Ad Sales as a Service removed; Nas.com spelling; Physical products built; Vidpros excluded, no meta tags; Soundstripe new-only; Fourthwall excluded; publish the pages; push the quiz live.
- Created 15 draft offers via Kajabi MCP, wrote the three-section segment theme to each, published them 23:15 PT. Inserted the quiz section on the live homepage and rewrote `content_for_index` (hero, quiz, widget, founder, categories, how, FAQ, pricing, eleven hidden old sections).
- Repo: `can-quiz.js`, `can-segment.js`, `segments.json`, `segments-live.json`, `scripts/segments.py`, `scripts/build_segment_page.py`, `scripts/segment_pages.json`, `embed/`, `test/`; `numbers.json` gained `segments`. Commit `9323dc9` (main), `2a6ddc1` (gh-pages).
- Verified: local harness for all fifteen segments and eight quiz paths; live newsletter page renders with checkout, pricing popup and page-view event; live homepage renders the quiz in position two.
- Skill STATE files updated: can-offer-page, can-homepage, can-deal-numbers (+ SKILL.md step 5b), can-product-marketing current state.
