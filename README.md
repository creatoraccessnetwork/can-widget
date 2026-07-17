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

`index.html` is a test harness: open with `?test=cobrand` or `?test=logo`.

Source of truth for markup/CSS: `can-savings-widget-horizontal.html` in the
private `can-savings-widget` repo (rebuild via `tools/build-bundle.py` there).
