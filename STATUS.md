# STATUS - can-widget (project quiz, segment pages, testimonials, savings widget)

Last updated: 2026-09-12 (Claude Code; Avi's quiz feedback: direct Q1 outcomes, "Not sure yet" project list, $1,750 Starter Set tease in the hero box, segment intro rewritten)

## Current state (20-second read)

- **Homepage (site theme 2164431783), LIVE 2026-09-12 (hero block written 06:59 UTC, read back verbatim).** Visible order and surfaces: `1787360000008` Hero Quiz (pattern; one white card: copy + rust "Unlock free" Starter Set email box left, `can-quiz.js` embed panel right with teal header band) > `1787360000010` Member Wins (white, `can-testimonials.js`) > `1787360000004` How It Works (pattern, one card) > `1787360000002` Founder (white) > `1787360000005` FAQ (pattern) > `1787360000006` Pricing (white). Avi's standing call (2026-09-12): the email box STAYS in the hero; the quiz is the funnel to sales. A bottom-of-page Starter Set section and a hero "Get access for $49" button were built and reverted the same day. HIDDEN, not deleted: `1787360000003` What's Inside, `1787360000001` savings calculator widget, `1787360000009` Starter Set section, `1787360000000` old hero, `1787360000007` old quiz, plus the eleven Aug-21 sections. Builder: `scripts/build_home_v3.py` -> `scripts/payloads/home-v3.json`. Snapshot + revert recipes: `backups/homepage-2026-09-10-pre-quiz-hero/REVERT.md`.
- **Copy** is the Aug-22 / afternoon wording everywhere (Avi rejected the 2026-09-10 tightening). Hero eyebrow "For Creators building a business"; offer-page eyebrow "Starting a Creator business is expensive."
- **Starter Set capture**: hero form `#starter` -> `can-starter.js` -> Kajabi Email Signup form 2149438902. The quiz's "Not sure yet" and every Starter Set link scroll to it. Value tease: **$1,750** for the 30 free discounts (Avi, 2026-09-12; hand-set in `build_home_v3.py` STARTER_VALUE, `segments.json` starter_value and `cansw-v2.js`; the sync does not own it). Hero label: "Get the free 30-discount Starter Set, worth $1,750, by email." (no "Not ready to join?": Avi wants no negative framing in the hero, 2026-09-12; the same "Not ready?" phrasing was dropped from the quiz result heading, the segment fine print and the widget capture label). Note: "No card required. No spam, unsubscribe anytime." `cansw-v2.js` (still used on offer pages) has its own inline capture (`capture:true`).
- **Offer pages (29 v2)**: hero = "Unlock Access" email box (`can-unlock.js` -> form 2149650486 tagged `unlock-access:offer:<token>`, scrolls to checkout and prefills Kajabi's `pds-input`), shared CSS as `canv2-offer-{regular,cobrand}.css`, Member Wins section `1787370000012` above the checkout. Builders `scripts/offer_hero_v3.py`, `scripts/offer_testimonials.py`; configs `scripts/offer_configs/`. free1/free2/nikki are unpublished drafts.
- **Segment pages (15)**: `can-segment.js` renders hero (Unlock Access box, tag `unlock-access:segment:<slug>`), rows, sticky calculator, events, wins strip; config `segments.json` + `segments-live.json`; offers in `scripts/segment_pages.json`. "Browse every partner" -> /partners.
- **Testimonials**: `testimonials.json` (7 member quotes, 6 partner quotes, headshots in `assets/people/`).
- **Served from GitHub Pages** off `gh-pages`; `main` is the source; mirror every served-file change to gh-pages. Browser caches hold scripts ~10 min: the homepage loads `can-quiz.js?v=20260911a` and `cansw-v2.js?v=20260910d`; bump the tags in `build_home_v3.py` after pushes to those files.
- **Numbers**: 50 partners / $36,000+ / exact 36336 (tracker run 2026-09-04). The hero stat tiles carry the figures; the weekly sync still targets the old hero block (see open items).
- **Query-string contract** quiz -> page: `?seg=<slug>&stage=pre|under100k|over100k[&platform=...]&via=quiz`; links from the "Not sure yet" list carry `?seg=<slug>&via=quiz-list` (no stage).
- **Quiz (v1.1, 2026-09-12)**: Q1 has seven answers; "Land more brand deals" and "Sell physical products or my favorite brands" land directly (Q1 + stage = two questions) on Brand deals / Physical products. "Not sure yet" renders every page from `segments.json` (`quiz_label`) plus `not_sure_extras` ("Launch my own game" -> Digital products, "Earn from my favorite brands" -> Physical products) above the Starter Set CTA. Segment pages: intro card is `need_h` + `need` + a generated brand list ("We have the best discounts on A, B and C to help you do it right for the least money."); calculator header "Here's how much you'll save with CAN."; Physical products page now covers merch and affiliate (eyebrow, H1, name).

## Open items

- **2026-09-12 round is LIVE from branch `claude/creator-access-quiz-feedback-mcef7g`** (gh-pages commit 986d96b carries the four served files; hero block 1787360000008_0 written to Kajabi). `main` does NOT yet have the round: merge the branch into main so the source of truth matches what gh-pages serves. The cloud sandbox could not fetch GitHub Pages or the live site to confirm the served files; check in a browser (hard refresh, or the quiz tag `?v=20260912a`).
- **Lead magnets**: the only Starter Set surfaces in this repo (hero section, widget capture on the offer pages, quiz) now say "No card required" and "$1,750". The beehiiv welcome emails and any category lead magnets live outside the repo; carry the same two lines there in a newsletter session.

- **Repoint can-deal-numbers** from hero block `1787360000000_0` to `1787360000008_0` (stat tiles "$36,000+" / "50" / "$400").
- **Unlock Access leads**: decide which automations fire on the "Savings Widget Unlock" form (2149650486) for the new `unlock-access:*` tags, and whether non-buyers should get the Starter Set sequence.
- **How It Works** still says "expert content library" (Avi asked for the previous copy back; PMM decision 4 says cut it). Pricing card bullet "Curated library" likewise.
- **Testimonials**: Joel Savitt / Alix Gucovsky quotes are community posts without an explicit ask; Alix's headshot is her Instagram avatar (a cat); Nick Ramos disabled. Per-segment testimonial slots still empty.
- **Quiz panel attention**: restyled 2026-09-11 (teal band, motion). If it still under-performs, next levers are a more direct question and a rust band (competes with the Unlock button).
- **Valim** tracker $2,000 vs `cansw-data.json` [360, 450]; **Revenews/Ad Sales** rename pending; **Fourthwall** excluded; **Roster** no figure; **Driff** copy needs partner approval; **Soundstripe** new customers assumed.
- **Docs to mirror**: Copywriter Brief and Appendix (still eight tiles), rule 0e in the business skill, tracker Goal Tags per segment; can-offer-page skill's `build_offer_page.py` still emits the old hero + no wins section (run the two v3 scripts after it).
- **Duplicate-file sync**: something on this Mac keeps writing " 2"/" 48" numbered copies into the repo (fast enough to hang `git add -A`). Delete untracked copies before committing; find the culprit (iCloud Desktop sync or the Cowork bridge).

## Hard-won gotchas

- The local clone is on Avi's Desktop; the Claude Code preview server cannot read `~/Desktop`. Mirror the repo to `/private/tmp/can-widget-harness` (rsync, exclude `.git`) and use the `can-widget-harness` launch config; harness pages live in `test/`.
- Stale `.git/*.lock` files from a crashed 2026-09-04 process blocked git; they were moved aside as `*.stale-2026-09-04`, never deleted. Local-only commit kept on `backup/local-main-2026-09-09`.
- Automations (widget-notion-sync) push to main and gh-pages on their own schedule; always `git fetch` and rebase before pushing.
- Kajabi offer checkout URLs return Cloudflare 403 to plain curl; use a browser user agent.
- Do not add robots meta tags to Kajabi pages (Avi, 2026-09-10); Vidpros is simply left off segment pages instead.
- Partner names in `segments.json` must match `n` in `cansw-data.json` exactly; tracker spellings that differ go in the row's `tracker` field (Creator's Guild of America).

## Build history

### 2026-09-12 - Avi's quiz feedback (Claude Code)
- Avi: brand deals and "selling my favorite products" as quiz outcomes; move the subscriber box to the bottom and sell the membership in the hero; tease the Starter Set value; segment pages should say "these are the tools you need and here's how much you'll save"; "Not sure yet" should list every project; "no card required". Rulings: one physical-goods answer covering merch and affiliate; "Launch my own game" links to Digital products; hero button straight to checkout; Starter Set worth $1,750.
- Repo: `can-quiz.js` v1.1 (Q1 direct outcomes, DIRECT step count, "Not sure yet" page list from `segments.json`, `starter_count`/`starter_value` read from it), `segments.json` (`quiz_label`, `need_h`, `need`, `not_sure_extras`, starter figures; Physical products reworded), `can-segment.js` (`brandList()`, intro card, calculator header), `cansw-v2.js` (capture note), `scripts/build_home_v3.py` (hero box label "worth $1,750", note "No card required.", "A few quick questions", quiz tag `?v=20260912a`).
- Reverted the same day on Avi's call: a hero "Get access for $49" button in place of the email box and a new bottom-of-page Starter Set section (1787360000011). Neither reached Kajabi. The email box stays in the hero.
- Verified in the local harness with headless Chromium (desktop + 390px): seven Q1 answers; brand-deals path shows "Question 2 of 2"; physical path redirects to `.../Y8FKrKWD/checkout?seg=physical-products&stage=pre&via=quiz`; the not-sure list resolves all 17 links; its Starter button scrolls to and focuses the bottom form; newsletter / physical / protect segment pages render the new intro and calculator copy.

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

## 2026-09-10 (late) - Copy revert (Claude Code)

- Avi did not like the tightened copy: everything is back to the previous, longer wording. Homepage hero lead + arrow line + "Not ready to join?" meta, wins sub line, founder / categories / how / FAQ / pricing blocks (Aug-22 text, incl. the "expert content library" line), widget bullets + intro, segment `what_can_is` + intro card + calculator meta + hero note, offer heroes (eyebrow "Starting a Creator business is expensive.", "Access $36,000+ ..." lead, config `hero_meta`). Unlock Access boxes, widget Starter Set capture and the hidden Starter Set section all stay.
- Widget script now loads as `cansw-v2.js?v=20260910d` on the homepage (bump in build_home_v3.py after every widget push; GitHub Pages caches 10 min and browsers hold on longer). Avi reported the capture box missing even in incognito; every fresh fetch from here shows it inside the left panel (740px tall now). Still unexplained on his side; ask for a screenshot + browser.

## 2026-09-10 (night) - Calculator widget off the homepage, Starter Set box inside the hero (Claude Code)

- Avi: the quiz replaces the calculator; collect the Starter Set email right where the hero says "get the Starter Set". Done: section `1787360000001` (savings widget) is hidden on the homepage (restore recipe in `backups/homepage-2026-09-10-pre-quiz-hero/REVERT.md`; `cansw-v2.js` still runs on every offer page). The hero card's left column now ends in an inline email box (`#starter`, hosted `can-starter.js`, posts to Email Signup 2149438902, success text in place). The quiz's "Not sure yet" path and every "Starter Set" link scroll to it.
- Surfaces re-alternated: Hero (pattern) > Member Wins (white) > Categories (pattern) > Founder (white) > How It Works (pattern, content in one white card) > Pricing (white) > FAQ (pattern). `build_home_v3.py` owns the order and the section-id lists.
- Links that pointed at the homepage widget now go to /partners: the categories "Browse all 50 partners" button, the segment pages' "Browse every partner", the quiz's no-URL fallback.
- Verified live: served HTML byte-for-byte for hero / how / categories, seven visible sections alternating url/none backgrounds, capture posts to 2149438902 (fetch stubbed).

## 2026-09-11 - What's Inside off, quiz panel restyled, rust Unlock button (Claude Code)

- Avi: six named companies don't help (the quiz does that job) -> section `1787360000003` "Discounts by Category" HIDDEN, not deleted (block in the snapshot's CATS_CODE). Order/surfaces: Hero (P) > Wins (W) > How (P, card) > Founder (W) > FAQ (P) > Pricing (W).
- Hero Starter Set button is rust, label "Unlock the Starter Set"; quiz column slightly wider (.98fr / 1.02fr).
- Quiz panel (can-quiz.js embed mode) redesigned to pull the eye: teal header band with the label and step count, white body, rust progress bar, Lato 27px question, teal numbered chips that turn rust on hover, options slide 4px on hover, deeper shadow, 250ms entrance (all off under prefers-reduced-motion). Script loaded as `can-quiz.js?v=20260911a`; bump the tag after quiz pushes.

## Log

### 2026-09-11 (later) - Founder button rust, quiz band stays teal, hero button "Unlock Free", pricing "Get access for $49" (Claude Code)
- Founder block `1787360000002_0`: "Reach out to Avi" is plain `can-btn` (rust); `offer_page_lib.py` source matched. Quiz band was briefly rust; Avi wants it TEAL (he likes the teal chips turning rust on hover), so `can-quiz.js` `.phead` is back to `var(--t)`.
- Hero block `1787360000008_0` (via `build_home_v3.py`): button "Unlock the Starter Set" -> "Unlock free" (sentence case, Avi); starter box felt tight: shadow softened to 0 1px 3px .06, row 50px, 26px above the label, 14px label->box, 12px box->note, label in mute with the bold line in ink; label now two intentional lines ("Not ready to join?" block, then the bold Starter Set line, no orphan); rhythm rule 20px / label 12px / note 10px. Pricing block `1787360000006_0`: "Join for $49" -> "Get access for $49" (builder applies it as a replace on the snapshot). Served HTML verified verbatim.

