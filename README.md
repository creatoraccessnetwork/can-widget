# CAN savings widget (served bundle)

Single source for the savings widget on creatoraccessnetwork.com. Every page
(homepage hero + co-branded offer pages) loads `cansw.js` from GitHub Pages;
partner data lives in `cansw-data.json` and is refreshed automatically from
the Notion offer tracker. Update the JSON, push, and every page updates.

Embed stub (per Kajabi page, in a Custom Code block):

    <script>window.CANSW_OVERRIDES = { defaultCategory: "Newsletter" };</script>
    <script src="https://creatoraccessnetwork.github.io/can-widget/cansw.js"></script>

Config options, all optional, all set on `window.CANSW_OVERRIDES` BEFORE the
script tag:

- `defaultCategory` — category the partner list opens on (`builderCategory` is
  an older name for the same thing)
- `joinUrl` — CTA target. An absolute URL navigates; a `#`-prefixed value
  scrolls to the checkout embedded on that page
- `dealsUrl` — secondary link target (`""` = no link)
- `captureUrl` / `captureTag` — email capture endpoint and per-page label
- `demotePartners: [names]` — co-brand competitor demotion, see below
  (`hidePartners` is a deprecated alias for the same behaviour)
- `cobrand { mode: "photo"|"text"|"logo", image, name, title, headline }`
- `unlinkCtas` — render CTAs with no href, for preview surfaces
- `membershipCost` — dollars, used in the profit line (default 49)

Accepted and ignored, so older stubs never throw: `builder`, `openCalculator`,
`prefillPicks`, `rotateMs`, `lede`, `earnUplift`.

## Layout (rebuilt 2026-08-12)

Built against the `can-brand-design` skill, `references/product-ui.md` and
`references/pattern-system.md`. Those files are the spec; this is the
reference implementation of them.

Two panels, **exactly equal width and equal height in every state** —
507 x 582 at desktop, fixed height with `overflow:hidden`. Nothing the
visitor does resizes the box. There are exactly two scroll surfaces: the
partner list on the right and the picks list on the left.

**Left panel, information.** Rust eyebrow, Lato headline, a two-up stat row
(live partner count + exact dollar total, both read from `numbers.json`,
never computed here), then a block that swaps inside the fixed box: six
category bullets when nothing is picked, and the running receipt once
something is — a 44px counting total, a "plus N uncapped deals that grow with
you" line, the scrolling picks list, and a profit line. Email capture pinned
at the bottom, with **consent as fine print under the field, not a checkbox**.

**Right panel, action.** Search + a category dropdown with counts, one
scrolling list of every partner, footer carrying the count on the left and
both legends on the right. Partner rows are a three-column grid (28px logo /
flexible / auto). One offer gets a `+`; several get a `+` and a chevron that
expands the offers in place on the second surface tone. Tapping `+` on a
multi-offer partner adds the cheapest offer that beats the membership price,
so the first pick is always profitable; the chevron lets them trade up.

Uncapped partners (ShopYourLikes, TopFan, Driff, Insense, Pierson Ferdinand,
CreatorCare) show their **actual rate** with an `uncapped` tag and never
contribute a dollar to any total. EditHers shows `Free access` with an
`included` tag. Those rate labels live in the `UNCAPPED` / `INCLUDED` tables
in `cansw.js`, not in `cansw-data.json`, so that file keeps exactly the shape
the Notion sync writes.

Sort order is by recognizability from the `RANK` array in `cansw.js` —
reorder that array to reorder the list. Anything unranked falls to the bottom
alphabetically.

Background is the v4 icon pattern: `can-pattern-v4-desktop.svg` at 970px,
swapping to `can-pattern-v4-mobile.svg` at 413px under 768px. Never scale one
tile across breakpoints.

## Co-branded pages: demote, never hide

Competitors of the host partner are **demoted, not removed** (Avi,
2026-08-12). They stay in the list, stay searchable, stay in the category
counts, and simply sort to the very bottom. The sort tiers are: the host
partner pinned first, everyone else in recognizability order, demoted
competitors last.

Because nothing is hidden, the partner count is the true count on every
surface and the headline stat agrees with the list footer. A demoted partner
surfaced by search or a category filter appears normally — demotion affects
default position only, never visibility. The demoted block carries **no
visual marker of any kind**.

`hidePartners` is kept as an alias because live co-branded pages ship it; it
maps to the same demote behaviour. There is no code path that removes a
partner from the list.

## Email capture

    <script>window.CANSW_OVERRIDES = {
      membershipCost: 49,
      captureUrl: "https://www.creatoraccessnetwork.com/forms/2149650486/form_submissions", // "" = capture off
      captureTag: "homepage-hero"
    };</script>

The calculator is not email-gated. On submit: a valid email fires the capture
and then continues to `joinUrl`. An empty or invalid email continues to
`joinUrl` and **posts nothing**. The path to purchase is never blocked.

Capture endpoints supported by captureUrl:
- Kajabi form endpoint (URL contains "/forms/"): posted urlencoded as
  form_submission[email/name/custom_5=tag/custom_6=page]. Standard setup:
  form 2149650486 "Savings Widget Unlock" on the CAN site; submissions are
  bridged into beehiiv daily by the `can-widget-email-bridge` scheduled task.
- Anything else: posted as JSON {email, source, tag, page, at} (e.g. a
  Zapier catch hook), Content-Type text/plain to avoid CORS preflight.
Direct client-side posting to beehiiv is not possible (bot protection).

### Editing partner data (Lindsey)

Edit `cansw-data.json` in the GitHub web UI and commit to BOTH `main` and
`gh-pages` (Pages serves gh-pages). Per partner:

- `n` name · `v` [low, high] savings range · `t` trophy · `c` categories ·
  `earn` revshare partner
- `deal` short deal badge shown in the calculator. For partners whose deal
  mechanics may not be public (Kajabi, Switcher) keep it neutral, e.g.
  "Member-only deal on every paid plan" — dollars only, never mechanics.
- `desc` one-sentence company description shown when a visitor expands the
  partner (CAN voice, leads with the category).
- `plans` list of {name, price, per ("mo"/"yr"), save} — `save` is the
  precomputed first-year dollar savings for that tier; the widget does no
  deal math itself. Flat deals use one entry: {"name": "—", "price": null,
  "save": 450}. Partners with no `plans` and no `earn` stay out of the
  calculator as a dollar value. Rate-based and uncapped partners
  (CreatorCare, Pierson Ferdinand, EditHers, ShopYourLikes, Insense, TopFan,
  Driff) are still shown and still pickable — they carry a rate label from
  the `UNCAPPED`/`INCLUDED` tables in `cansw.js` and add no dollars.

The daily `can-widget-notion-sync` task reconciles this file against the
Notion OFFER TRACKING page, so lasting changes belong in Notion; hand-edits
here are fine for quick fixes but Notion wins on the next sync.

`index.html` is a test harness: open with `?test=demote` (new key),
`?test=legacy` (the hidePartners alias), `?test=cobrand`, `?test=capture`, or
`?test=unlink`. Run `tools/harness-sync.sh` from the private repo after every
edit — the Browser-pane server cannot read ~/Desktop, so it serves a /tmp
mirror.

Source of truth for markup/CSS: `can-savings-widget-horizontal.html` in the
private `can-savings-widget` repo (rebuild via `tools/build-bundle.py` there).
