# CAN savings widget (served bundle)

Single source for the savings widget on creatoraccessnetwork.com. Every page
(homepage hero + co-branded offer pages) loads `cansw.js` from GitHub Pages;
partner data lives in `cansw-data.json` and is refreshed automatically from
the Notion offer tracker. Update the JSON, push, and every page updates.

Embed stub (per Kajabi page, in a Custom Code block):

    <script>window.CANSW_OVERRIDES = { defaultCategory: "Newsletter" };</script>
    <script src="https://creatoraccessnetwork.github.io/can-widget/cansw.js"></script>

Config options: defaultCategory, joinUrl, dealsUrl ("" hides the link),
rotateMs (0 disables), headline, lede, unlinkCtas, and
cobrand { mode: "photo"|"text"|"logo", image, name, title, headline, lede }.

## Budget builder (calculator + email capture)

Added 2026-07-23; reworked 2026-08-11. Off by default; enable per page with:

    <script>window.CANSW_OVERRIDES = {
      builder: true,             // show the calculator
      membershipCost: 49,        // dollars, used in the profit line
      captureUrl: "https://www.creatoraccessnetwork.com/forms/2149650486/form_submissions", // "" = capture off
      captureTag: "homepage-hero" // per-page label sent with each captured email
    };</script>

The calculator is NOT email-gated (gate removed 2026-08-03/11). The purchase
CTA is an email capture instead: an email field + consent checkbox + an
"Unlock free discounts" button, pinned at the bottom of the right card on
every surface. On submit: valid email + checked box -> capture fires, then
the visitor goes to `joinUrl` (absolute URL navigates; a "#section-..."
value scrolls to the embedded checkout on co-brand pages). No email,
invalid email, or unchecked box -> straight to `joinUrl`, nothing
submitted. Submitted emails persist in localStorage (`cansw_email`) and
budget edits re-post the visitor's picks (debounced).

Left card (2026-08-11): headline "Exclusive perks for Creators and
solopreneurs", two stat tiles (live partner count + exact dollar total from
`numbers.json` — `partner_count` and `total_value_exact`; the sync routine
MUST keep writing `total_value_exact` or the tile falls back to the rounded
`total_value`), five category bullets, then "See how much you could save:"
over the pickers. Right card browse view: three top discounts + two dashed
"Add a discount" rows (no header line, no stack line — the rows say it).

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

- `n` name · `v` [low, high] savings range (phase-1 card) · `t` trophy ·
  `c` categories · `earn` revshare partner (slider)
- `deal` short deal badge shown in the calculator. For partners whose deal
  mechanics may not be public (Kajabi, Switcher) keep it neutral, e.g.
  "Member-only deal on every paid plan" — dollars only, never mechanics.
- `desc` one-sentence company description shown when a visitor expands the
  partner (CAN voice, leads with the category).
- `plans` list of {name, price, per ("mo"/"yr"), save} — `save` is the
  precomputed first-year dollar savings for that tier; the widget does no
  deal math itself. Flat deals use one entry: {"name": "—", "price": null,
  "save": 450}. Partners with no `plans` and no `earn` stay out of the
  calculator (currently CreatorCare, Pierson Ferdinand, EditHers by design).

The daily `can-widget-notion-sync` task reconciles this file against the
Notion OFFER TRACKING page, so lasting changes belong in Notion; hand-edits
here are fine for quick fixes but Notion wins on the next sync.

`index.html` is a test harness: open with `?test=cobrand`, `?test=logo`, or
`?test=builder` (`&reset=1` clears the stored capture email).

Source of truth for markup/CSS: `can-savings-widget-horizontal.html` in the
private `can-savings-widget` repo (rebuild via `tools/build-bundle.py` there).
