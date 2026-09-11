# STATUS - can-widget (savings widget, project quiz, segment pages)

Last updated: 2026-09-10 (Claude Code, homepage v3: quiz in the hero, Member Wins marquee, Starter Set section; wins strip on all 29 offer pages and 15 segment pages)

## Current state (20-second read)

- **Homepage v3 (2026-09-10 afternoon, LIVE)**: the project quiz IS the hero. Site-theme sections: `1787360000008` Hero Quiz (v2) (pattern section, one white card, copy left / `can-quiz.js` in `embed:true` mode right; carries the shared CSS for every v2 section), `1787360000010` Member Wins (v2) (`can-testimonials.js`, members + partners rows, white), `1787360000009` Starter Set (v2) (the native Kajabi email form that used to be in the hero, `id="starter"`). Old hero `1787360000000` and old quiz section `1787360000007` are HIDDEN, not deleted. Render order: hero quiz, wins, starter, widget, founder, categories, how, FAQ, pricing, then hidden. Builder: `scripts/build_home_v3.py` -> `scripts/payloads/home-v3.json`. Snapshot + one-call revert payloads: `backups/homepage-2026-09-10-pre-quiz-hero/` (REVERT.md).
- **Testimonials**: `testimonials.json` (7 member quotes from the Kajabi Wins! channel / Common Ninja / Notion, 6 partner-exec quotes from the Common Ninja partner widget; headshots rehosted in `assets/people/`) rendered by `can-testimonials.js` (CSS marquee, pause on hover, static under reduced motion). On every v2 offer page as section `1787370000012` Member Wins (v2) directly above the checkout (`scripts/offer_testimonials.py`, configs in `scripts/offer_configs/`), and on every segment page at the bottom of the project section (injected by `can-segment.js`).
- All `#top` Starter Set links now point at `#starter`; the hero block redirects a `#top` hash to `#starter` for the offer pages that still link to `/#top`.

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

- **Homepage v3 follow-ups (2026-09-10)**: (1) repoint the can-deal-numbers Kajabi map from hero block `1787360000000_0` to `1787360000008_0` (the stat tiles read "$36,000+" / "50" / "$400"; the lead sentence no longer carries the figures); (2) hero eyebrow is now "For Creators building a business" per the PMM "eyebrow names the reader" ruling, Avi to confirm wording; (3) Alix Gucovsky's headshot is her public Instagram avatar (a cat photo) because LinkedIn is walled, swap in `assets/people/alix-gucovsky.jpg` if a real headshot turns up; (4) Joel Savitt's and Alix's quotes come from community posts, not an explicit testimonial ask, flip `enabled:false` in `testimonials.json` if permission is needed first; (5) Nick Ramos's VidCon post is in the file but disabled (networking win, no headshot/handle).

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

### 2026-09-10 (afternoon) - Homepage v3 + testimonials everywhere (Claude Code)
- Avi: save a revertible copy of the pre-quiz homepage; make the quiz the hero and design it to pop; add a scrolling testimonials widget (Common Ninja + Kajabi Wins + Notion, with headshots and social handles) under the homepage hero and above the checkout on every offer page.
- Snapshot of all eight live v2 sections transcribed from Kajabi and cross-checked against the Aug 22 builder (identical except the synced $36,000+); revert payloads for both the no-quiz and quiz-under-hero layouts.
- `can-quiz.js` gained `embed`/`label` config; `can-testimonials.js` + `testimonials.json` new; `can-segment.js` injects the strip; `segments.json > starter_url` -> `/#starter`. Commits 69f77e2 (main), 2e64f1f (gh-pages).
- Kajabi: one write to the site theme (three new sections, two hidden, widget + pricing blocks repointed, content_for_index), 29 writes to the offer themes (new section 1787370000012 + content_for_index). Verified by fetching the served HTML: homepage hero/starter CSS byte-identical to the payload, section order correct; 26 of 29 offer pages show the wins section immediately before the checkout (free1, free2, nikki are unpublished drafts and do not serve a page). Headless-Chrome screenshots of the live homepage (desktop + 390px), a co-branded page and a segment page all render as designed.
- Harness: `test/home.html` renders `scripts/payloads/home-v3.json` with the local scripts; `test/mobile-frame*.html` wrap a page in a 390px iframe because headless Chrome will not go below ~500px. Launch config `can-home-harness` (auto-port) in `~/.claude/launch.json`.


### 2026-09-10 - Project quiz + fifteen segment pages (Claude Code)
- Plan approved by Avi with rulings: Roster no figure; Ad Sales as a Service removed; Nas.com spelling; Physical products built; Vidpros excluded, no meta tags; Soundstripe new-only; Fourthwall excluded; publish the pages; push the quiz live.
- Created 15 draft offers via Kajabi MCP, wrote the three-section segment theme to each, published them 23:15 PT. Inserted the quiz section on the live homepage and rewrote `content_for_index` (hero, quiz, widget, founder, categories, how, FAQ, pricing, eleven hidden old sections).
- Repo: `can-quiz.js`, `can-segment.js`, `segments.json`, `segments-live.json`, `scripts/segments.py`, `scripts/build_segment_page.py`, `scripts/segment_pages.json`, `embed/`, `test/`; `numbers.json` gained `segments`. Commit `9323dc9` (main), `2a6ddc1` (gh-pages).
- Verified: local harness for all fifteen segments and eight quiz paths; live newsletter page renders with checkout, pricing popup and page-view event; live homepage renders the quiz in position two.
- Skill STATE files updated: can-offer-page, can-homepage, can-deal-numbers (+ SKILL.md step 5b), can-product-marketing current state.

## 2026-09-10 (evening) - Unlock Access, widget Starter Set capture, copy pass (Claude Code)

- **Offer + segment heroes:** the Join / "See what you'd save" buttons are gone. An email box with the CTA **Unlock Access** posts to the Kajabi "Savings Widget Unlock" form (2149650486; name "Unlock Access", custom_5 `unlock-access:offer:<token>` or `unlock-access:segment:<slug>`, custom_6 page URL, custom_7 opt-in stamp, custom_8 picks on segment pages), scrolls to the checkout and prefills Kajabi's `<pds-input type="email">`. Logic lives in `can-unlock.js` (hosted); heroes carry only `window.CANUNLOCK` + a script tag. All 29 v2 offer heroes rebuilt by `scripts/offer_hero_v3.py`; the shared page CSS now ships as `canv2-offer-regular.css` / `canv2-offer-cobrand.css` (linked from the hero block) instead of 13KB inline per page. Verified byte-for-byte on the 26 live pages; free1/free2/nikki are unpublished drafts.
- **Homepage widget:** `cansw-v2.js` now has an inline Starter Set email box under the Join button (`capture`, posts to Email Signup form 2149438902, `id="starter"`), panel height 700. The separate Starter Set section (1787360000009) is hidden; every "Starter Set" link points at `#starter` inside the widget.
- **Copy pass:** shorter hero lead (no duplicate figures; stat tiles carry them), no hero sub line, no wins sub line, founder/categories/how/FAQ/pricing tightened, "expert content library" removed (PMM decision 4; pricing bullet now "Discounts on Creator education"), segment `what_can_is` shortened, widget bullets shortened.
- Test pages: `test/home.html`, `test/offer.html?cfg=<config>`, `test/segment.html`; use launch config `can-home-harness` (serves /private/tmp/can-widget-harness; rsync first). Kajabi's global button margins broke the form alignment once: the form CSS carries `margin:0!important` on both children.
- A sync on this Mac kept creating " 2"/" 3" duplicate files in the working tree; the tracked copies were removed in 6eb62fa. If they reappear, delete untracked ones before `git add -A`.
