/* CAN savings widget - single-source bundle.
   Served via GitHub Pages; every CAN page loads this one file.
   Page-specific config via window.CANSW_OVERRIDES BEFORE the script tag:
   { defaultCategory, joinUrl, dealsUrl, rotateMs, headline, lede, unlinkCtas,
     hidePartners: [names]  - remove these partners from EVERYWHERE in the
       widget (co-brand rule: never show the page partner's competitors),
     prefillPicks: [names]  - builder opens with these partners already in
       the savings calculator (lowest-tier / lowest-savings plan preselected),
     openCalculator: true   - builder opens the EMPTY calculator with
       "Add a discount" rows (the co-brand default; prefill deprecated),
     cobrand: { mode: "photo"|"text"|"logo", image, name, title, headline, lede } }
   Partner data: cansw-data.json next to this file (baked fallback below).
   Built from can-savings-widget-horizontal.html - keep that file canonical
   for markup/CSS changes and rebuild via tools/build.py in the private repo. */
(function () {
  if (window.__canswLoaded) return; window.__canswLoaded = true;
  var SCRIPT = document.currentScript;
  /* transparent header logo; the "Logo_Primary" upload is a JPEG w/ baked white bg */
  var CAN_LOGO = "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/sites/2148774616/images/634ab608e9b603913537bd09741cea85.png";
  var CSS = "\n  .cansw {\n    --cansw-teal: #2A6478;\n    --cansw-teal-dark: #1E4F5F;\n    --cansw-terra: #C17A5E;\n    --cansw-terra-dark: #9E614A;\n    --cansw-ink: #1A1F2C;\n    --cansw-charcoal: #374151;\n    --cansw-ground: #F0F4F8;\n    --cansw-card: #FFFFFF;\n    font-family: 'Open Sans', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;\n    background: var(--cansw-ground) url('https://creatoraccessnetwork.github.io/can-widget/can-pattern-teal-on-gray.svg') repeat;\n    background-size: 1080px 1080px;\n    color: var(--cansw-charcoal);\n    padding: 64px 24px;\n    text-align: left;\n    box-sizing: border-box;\n  }\n  .cansw *, .cansw *::before, .cansw *::after { box-sizing: border-box; }\n\n  .cansw-cols {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);\n    gap: 48px;\n    max-width: 1080px;\n    margin: 0 auto;\n    align-items: center;\n  }\n\n  .cansw-left {\n    background: var(--cansw-card);\n    border-radius: 4px;\n    box-shadow: 0 4px 20px rgba(0,0,0,0.075);\n    padding: 32px;\n  }\n\n  .cansw-title {\n    font-size: 44px; font-weight: 700; line-height: 1.12;\n    color: var(--cansw-ink); margin: 0 0 20px;\n  }\n  .cansw-lede {\n    font-size: 20px; line-height: 1.5;\n    margin: 0 0 32px; color: var(--cansw-charcoal);\n  }\n  .cansw-lede[hidden] { display: none; }\n\n  .cansw-stats { display: flex; gap: 24px; margin: 0 0 18px; }\n  .cansw-stat { display: flex; flex-direction: column; gap: 3px; }\n  .cansw-stat + .cansw-stat { border-left: 1px solid #E6EBF2; padding-left: 24px; }\n  .cansw-stat-num {\n    font-size: 34px; font-weight: 800; line-height: 1.1;\n    color: var(--cansw-teal); font-variant-numeric: tabular-nums;\n  }\n  .cansw-stat-label {\n    font-size: 11px; font-weight: 700; letter-spacing: 0.8px;\n    text-transform: uppercase; color: #5B6572;\n  }\n  .cansw-bullets {\n    list-style: none; margin: 0 0 16px; padding: 0;\n    font-size: 15px; line-height: 1.4; color: var(--cansw-charcoal);\n  }\n  .cansw-bullets li { display: flex; align-items: baseline; gap: 9px; padding: 3px 0; }\n  .cansw-bullets li::before { content: \"\\2713\"; color: var(--cansw-teal); font-weight: 800; flex: none; }\n\n  .cansw-picker { position: relative; width: 100%; max-width: 420px; text-align: left; }\n  .cansw-picker-btn {\n    width: 100%;\n    display: flex; align-items: center; justify-content: space-between; gap: 16px;\n    background: var(--cansw-card);\n    border: 1px solid #D7DFE8;\n    border-radius: 4px;\n    padding: 14px 16px;\n    font-family: inherit; font-size: 16px; color: var(--cansw-charcoal);\n    cursor: pointer;\n    box-shadow: 0 1px 3px rgba(0,0,0,0.04);\n  }\n  .cansw-picker-btn:hover { border-color: var(--cansw-teal); }\n  .cansw-picker-btn:focus-visible, .cansw-opt:focus-visible, .cansw-cta:focus-visible,\n  .cansw input[type=range]:focus-visible { outline: 2px solid var(--cansw-teal); outline-offset: 2px; }\n  .cansw-placeholder { color: #8A94A3; }\n  .cansw-caret { flex: none; transition: transform 0.15s ease; color: var(--cansw-teal); }\n  .cansw-picker.cansw-open .cansw-caret { transform: rotate(180deg); }\n\n  .cansw-menu {\n    position: absolute; z-index: 200; top: 100%; left: 0; right: 0;\n    background: var(--cansw-card);\n    border: 1px solid #E5EAF0; border-top: 0; border-radius: 0 0 4px 4px;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.08);\n    max-height: 320px; overflow-y: auto;\n    padding: 8px;\n    display: none;\n  }\n  /* fused look (Avi 2026-07-28): while a menu or the deal panel hangs off a\n     button, the button's bottom corners square off so the two read as one */\n  .cansw-picker.cansw-open .cansw-picker-btn,\n  .cansw-cpicker.cansw-fused .cansw-picker-btn { border-radius: 4px 4px 0 0; }\n  /* while the deal panel hangs open the button caret points up = click to\n     close (the button click closes the panel when the menu isn't open) */\n  .cansw-cpicker.cansw-fused > .cansw-picker-btn .cansw-caret { transform: rotate(180deg); }\n  .cansw-picker.cansw-open .cansw-menu { display: block; }\n  .cansw-menu-label {\n    font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;\n    color: var(--cansw-teal); padding: 8px 8px 4px;\n  }\n  .cansw-opt {\n    width: 100%;\n    display: flex; justify-content: space-between; align-items: center; gap: 16px;\n    padding: 10px 8px;\n    border: 0; background: none; border-radius: 4px;\n    font-family: inherit; font-size: 15px; color: var(--cansw-charcoal);\n    cursor: pointer; text-align: left;\n  }\n  .cansw-opt:hover { background: var(--cansw-ground); }\n  .cansw-opt[aria-selected=\"true\"] { background: var(--cansw-ground); color: var(--cansw-ink); }\n  .cansw-count { font-size: 13px; color: #8A94A3; flex: none; }\n\n  .cansw-result {\n    width: 100%;\n    background: var(--cansw-card);\n    border-radius: 4px;\n    box-shadow: 0 4px 20px rgba(0,0,0,0.075);\n    padding: 32px 36px;\n    text-align: center;\n    height: 580px;\n    display: flex; flex-direction: column; justify-content: center;\n    overflow: hidden;\n  }\n  #canswContent { width: 100%; }\n  .cansw-result.cansw-show { animation: cansw-rise 0.25s ease; }\n  @keyframes cansw-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }\n  @media (prefers-reduced-motion: reduce) {\n    .cansw-result.cansw-show { animation: none; }\n    .cansw-caret { transition: none; }\n  }\n\n  .cansw-kicker {\n    font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;\n    color: var(--cansw-teal); margin: 0 0 8px;\n  }\n  .cansw-savings {\n    font-size: 44px; font-weight: 700; line-height: 1.1;\n    color: var(--cansw-teal);\n    font-variant-numeric: tabular-nums;\n    margin: 0 0 4px;\n  }\n  .cansw-savings-sub { font-size: 16px; color: var(--cansw-charcoal); margin: 0 0 8px; }\n  .cansw-earn-note { font-size: 15px; color: var(--cansw-charcoal); margin: 0 0 24px; }\n  .cansw-earn-note strong { color: var(--cansw-teal); }\n\n  .cansw-partners {\n    display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;\n    margin: 16px 0 20px;\n  }\n  .cansw-pill {\n    display: inline-flex; align-items: center; gap: 8px;\n    background: var(--cansw-ground);\n    border-radius: 4px;\n    padding: 6px 12px 6px 6px;\n    font-size: 14px; font-weight: 500; color: var(--cansw-ink);\n  }\n  .cansw-mono {\n    width: 24px; height: 24px; border-radius: 4px; flex: none;\n    background: rgba(42,100,120,0.12); color: var(--cansw-teal);\n    font-size: 12px; font-weight: 700;\n    display: grid; place-items: center;\n  }\n  .cansw-logo {\n    width: 24px; height: 24px; border-radius: 4px; flex: none;\n    object-fit: contain; background: #fff;\n  }\n  .cansw-more {\n    display: inline-flex; align-items: center;\n    background: var(--cansw-ground);\n    border-radius: 4px;\n    padding: 6px 12px;\n    font-size: 14px; font-weight: 600; color: #8A94A3;\n  }\n  .cansw-trophy { font-size: 13px; }\n  .cansw-trophy-note {\n    font-size: 13px; color: #8A94A3; margin: -8px 0 12px;\n  }\n  .cansw-locked {\n    display: flex; align-items: center; justify-content: center; gap: 8px;\n    font-size: 14px; color: #8A94A3; margin: 0 0 28px;\n  }\n\n  .cansw-earn {\n    background: var(--cansw-ground);\n    border-radius: 4px;\n    padding: 16px 20px;\n    margin: 0 0 16px;\n    text-align: left;\n  }\n  .cansw-earn-label { font-size: 14px; font-weight: 600; color: var(--cansw-ink); display: flex; justify-content: space-between; margin-bottom: 12px; }\n  .cansw-earn-label output { color: var(--cansw-teal); font-variant-numeric: tabular-nums; }\n  .cansw input[type=range] { width: 100%; margin: 0 0 16px; accent-color: var(--cansw-teal); }\n  .cansw-earn-result { font-size: 15px; color: var(--cansw-charcoal); margin: 0; line-height: 1.6; }\n  .cansw-earn-result strong {\n    font-size: 22px; font-weight: 700;\n    color: var(--cansw-teal); font-variant-numeric: tabular-nums;\n  }\n  .cansw-earn-fine { font-size: 12px; color: #8A94A3; margin: 8px 0 0; }\n\n  .cansw-cta {\n    display: inline-block;\n    background: var(--cansw-terra); color: #fff;\n    font-family: inherit; font-weight: 600; font-size: 16px;\n    padding: 16px 32px; border: 0; border-radius: 4px; cursor: pointer;\n    text-decoration: none;\n  }\n  .cansw-cta:hover { background: var(--cansw-terra-dark); color: #fff; }\n  .cansw-capture { margin: 18px 0 0; text-align: left; }\n  .cansw-cap-row { display: flex; gap: 8px; }\n  .cansw-cap-input {\n    flex: 1 1 auto; min-width: 0;\n    border: 1px solid #D7DFE8; border-radius: 4px;\n    padding: 12px 14px;\n    font-family: inherit; font-size: 15px; color: var(--cansw-ink); background: #fff;\n  }\n  .cansw-cap-input::placeholder { color: #6B7280; }\n  .cansw-cap-input:focus { outline: 2px solid var(--cansw-teal); outline-offset: 1px; border-color: var(--cansw-teal); }\n  .cansw-cap-btn { flex: none; padding: 12px 18px; font-size: 15px; white-space: nowrap; }\n  .cansw-cap-optin {\n    display: flex; align-items: flex-start; gap: 8px;\n    font-size: 12px; line-height: 1.45; color: #5B6572;\n    text-align: left; cursor: pointer;\n    margin: 8px 0 0;\n  }\n  .cansw-cap-optin input {\n    flex: none; width: 14px; height: 14px; margin: 2px 0 0;\n    accent-color: var(--cansw-teal); cursor: pointer;\n  }\n  .cansw-budget .cansw-capture { margin-top: 10px; }\n  .cansw-see-all { display: inline-block; margin-top: 12px; font-size: 14px; color: var(--cansw-teal); text-decoration: underline; text-underline-offset: 3px; }\n  .cansw-see-all:hover { color: var(--cansw-teal-dark); }\n\n  @media (max-width: 900px) {\n    .cansw { padding: 48px 16px; background-size: 480px 480px; }\n    .cansw-cols { grid-template-columns: 1fr; gap: 32px; }\n    .cansw-left { text-align: center; padding: 24px 20px; }\n    .cansw-picker { margin: 0 auto; }\n    .cansw-title { font-size: 30px; }\n    .cansw-lede { font-size: 17px; }\n    .cansw-savings { font-size: 34px; }\n    .cansw-result { padding: 32px 20px 24px; height: auto; }\n  }\n\n  /* ---- budget builder (CFG.builder): always-on in-hero calculator.\n     Email gate lives INSIDE the right card and appears on first Add.\n     Type sized/colored per style guide v3.1 + WCAG AA (secondary text\n     #4B5563 on white, nothing under 13px). ---- */\n  .cansw-mode-open #canswContent { display: none; }\n  /* tighter hero: less gray above the headline, tighter copy stack (Avi 2026-07-24) */\n  .cansw-mode-open { padding: 28px 24px 44px; }\n  /* h1 top = card headline top (card pad 20 = title margin 20; the\n     preview/number top margins are zeroed below to make this true) */\n  .cansw-mode-open .cansw-title { margin: 0 0 16px; font-size: 32px; line-height: 1.15; }\n  .cansw-mode-open .cansw-lede { margin-bottom: 18px; }\n  .cansw-mode-open .cansw-result { text-align: left; justify-content: flex-start; padding: 32px 28px; border: 1px solid #D7DFE8; position: relative; height: 520px; }\n  /* FIXED HEIGHT IN EVERY STATE (Avi 2026-08-03, supersedes the 2026-07-28\n     unlocked-grow rule): the unlocked calculator keeps the 520 footprint too —\n     adding items scrolls .cansw-b-items instead of growing the card, so both\n     columns always end on the same line. Only .cansw-a11y-grow (zoom / large\n     text) may relax the fixed heights. */\n  .cansw-see { font-size: 18px; font-weight: 700; color: var(--cansw-ink); margin: 0 0 12px; }\n  .cansw-mode-open .cansw-see { margin-top: auto; }\n  .cansw-budget { display: none; }\n  .cansw-mode-open .cansw-budget { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; overflow: hidden; }\n  .cansw-mode-open #canswBEarnOut { display: none; } /* totals row carries the number; keep the card compact */\n\n  .cansw-b-budget-h {\n    display: flex; justify-content: space-between; align-items: baseline; gap: 12px;\n    font-size: 22px; font-weight: 700; color: var(--cansw-ink); margin: 0 0 6px;\n  }\n  .cansw-b-count { font-size: 15px; font-weight: 600; color: var(--cansw-teal); flex: none; }\n  .cansw-b-budget-sub { font-size: 16px; line-height: 1.55; color: var(--cansw-charcoal); margin: 0 0 10px; }\n  .cansw-b-empty { font-size: 16px; color: #4B5563; margin: 8px 0; }\n\n\n  /* the list flexes into whatever the fixed header/totals/CTA leave free and\n     scrolls when items overflow — totals + CTA never leave the 520 card */\n  .cansw-b-items { flex: 1 1 auto; min-height: 72px; overflow-y: auto; margin: 0 -8px; padding: 0 8px; }\n  /* Firefox only: Chrome/Safari must NOT see scrollbar-width/color, or they\n     disable the ::-webkit-scrollbar customization below (same gotcha as\n     .cansw-bdetail-scroll) */\n  @supports not selector(::-webkit-scrollbar) {\n    .cansw-b-items { scrollbar-width: thin; scrollbar-color: #9DB1C1 var(--cansw-ground); }\n  }\n  .cansw-b-items::-webkit-scrollbar { width: 12px; }\n  .cansw-b-items::-webkit-scrollbar-track { background: var(--cansw-ground); border-radius: 6px; }\n  .cansw-b-items::-webkit-scrollbar-thumb { background: #9DB1C1; border-radius: 6px; border: 2px solid var(--cansw-ground); }\n  .cansw-b-items::-webkit-scrollbar-thumb:hover { background: var(--cansw-teal); }\n  .cansw-b-addrow {\n    display: flex; align-items: center; gap: 10px; width: 100%;\n    padding: 12px 14px; margin: 8px 0;\n    border: 1px dashed #C2CEDB; border-radius: 4px;\n    background: none; font-family: inherit; font-size: 15px; font-weight: 600;\n    color: #4B5563; cursor: pointer; text-align: left;\n  }\n  .cansw-b-addrow:hover { border-color: var(--cansw-teal); color: var(--cansw-teal); }\n  .cansw-b-addrow-plus {\n    flex: none; width: 24px; height: 24px; border-radius: 50%;\n    border: 1px dashed currentColor; display: grid; place-items: center;\n    font-weight: 700; line-height: 1;\n  }\n  .cansw-b-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid #EDF1F6; }\n  .cansw-b-item:first-child { border-top: 0; }\n  .cansw-b-item-info { flex: 1; min-width: 0; }\n  .cansw-b-item-name { font-size: 16px; font-weight: 600; color: var(--cansw-ink); margin: 0; }\n  .cansw-b-item-plansel {\n    width: 100%; max-width: 240px;\n    margin-top: 4px;\n    border: 1px solid #D7DFE8; border-radius: 4px;\n    padding: 4px 6px;\n    font-family: inherit; font-size: 14px; color: var(--cansw-charcoal); background: #fff;\n  }\n  .cansw-b-item-note { font-size: 14px; color: #4B5563; margin: 2px 0 0; }\n  .cansw-b-item-save { flex: none; font-size: 17px; font-weight: 700; color: var(--cansw-teal); font-variant-numeric: tabular-nums; }\n  .cansw-b-x {\n    flex: none; width: 28px; height: 28px;\n    border: 0; border-radius: 4px; background: none;\n    color: #4B5563; font-size: 18px; line-height: 1; cursor: pointer;\n  }\n  .cansw-b-x:hover { background: var(--cansw-ground); color: var(--cansw-ink); }\n  .cansw-b-earnbox { flex: none; margin: 8px 0 0; padding: 10px 14px; }\n  .cansw-b-earnbox .cansw-earn-label { margin-bottom: 8px; }\n  .cansw-b-earnbox input[type=range] { margin: 0 0 8px; }\n  .cansw-b-earnbox .cansw-earn-fine { font-size: 13px; color: #4B5563; }\n  .cansw-b-totals { flex: none; border-top: 1px solid #D7DFE8; margin-top: 10px; padding-top: 8px; }\n  .cansw-b-trow { display: flex; justify-content: space-between; gap: 12px; font-size: 15px; color: var(--cansw-charcoal); margin: 4px 0; }\n  .cansw-b-trow strong { color: var(--cansw-ink); font-variant-numeric: tabular-nums; }\n  .cansw-b-profit {\n    display: flex; justify-content: space-between; align-items: baseline; gap: 12px;\n    margin-top: 6px;\n    font-size: 18px; font-weight: 700; color: var(--cansw-ink);\n  }\n  .cansw-b-profit-num { font-size: 30px; color: var(--cansw-teal); font-variant-numeric: tabular-nums; }\n  .cansw-budget .cansw-cta { display: block; text-align: center; margin-top: 10px; padding: 13px 24px; }\n  .cansw-budget .cansw-cta[hidden] { display: none; }\n\n  /* builder mode: columns stretch to equal height — tops AND bottoms align.\n     The detail panel flexes to fill the left column; the card matches. */\n  .cansw-mode-open .cansw-cols { align-items: start; }\n  .cansw-mode-open .cansw-result.cansw-show { animation: none; } /* no re-entrance bounce while the budget card is persistent */\n  .cansw-mode-open .cansw-picker, .cansw-mode-open .cansw-bdetail { max-width: none; }\n  .cansw-mode-open .cansw-left { display: flex; flex-direction: column; height: 520px; }\n  .cansw-b-preview {\n    flex: 1 1 auto; min-height: 0;\n    display: flex; flex-direction: column; justify-content: flex-start;\n    text-align: left; overflow: hidden;\n    margin: 0 0 8px;\n  }\n  .cansw-b-preview .cansw-partners { justify-content: flex-start; }\n  .cansw-b-preview[hidden] { display: none; }\n  /* card header (Avi 2026-07-28): no eyebrow, one short BLACK line —\n     \"Up to $X in savings\" — deliberately smaller than the left h1. */\n  .cansw-savings-line {\n    margin: 0 0 10px;\n    font-size: 32px; font-weight: 700; line-height: 1.2;\n    color: var(--cansw-ink);\n    font-variant-numeric: tabular-nums;\n  }\n  .cansw-b-preview .cansw-trophy-note { margin: 14px 0 0; color: #4B5563; }\n  .cansw-b-stack { margin: 2px 0 0; }\n  .cansw-b-stack strong { color: var(--cansw-teal); font-weight: 700; font-variant-numeric: tabular-nums; }\n  /* styled like a list row, not a pill — sits at the rows' left inset */\n  .cansw-b-more {\n    padding: 10px 10px 0;\n    font-size: 15px; font-weight: 600; color: #4B5563;\n    margin: 0;\n  }\n  .cansw-b-preview.cansw-b-preview-ghost { justify-content: flex-start; }\n  .cansw-b-ghosts { text-align: left; overflow-y: auto; min-height: 0; max-height: 100%; }\n  .cansw-b-ghosts .cansw-b-item > .cansw-mono,\n  .cansw-b-ghosts .cansw-b-item .cansw-logo { width: 28px; height: 28px; }\n  .cansw-b-ghosts .cansw-b-profit { border-top: 1px solid #D7DFE8; padding-top: 10px; margin-top: 4px; }\n  /* company picker (second dropdown) + collapsible deal panel, left column */\n  .cansw-cpicker { margin-top: 12px; }\n  .cansw-opt-left { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }\n  .cansw-opt-logo { width: 22px; height: 22px; border-radius: 4px; object-fit: contain; background: #fff; flex: none; }\n  .cansw-opt-mono {\n    width: 22px; height: 22px; border-radius: 4px; flex: none;\n    background: rgba(42,100,120,0.12); color: var(--cansw-teal);\n    font-size: 11px; font-weight: 700;\n    display: grid; place-items: center;\n  }\n  .cansw-menu-note { font-size: 13px; color: #4B5563; padding: 8px 8px 4px; border-top: 1px solid #EDF1F6; margin-top: 6px; }\n  /* deal panel WATERFALLS off the company picker (Avi 2026-07-28): it lives\n     INSIDE #canswCPicker and hangs flush under the button like the menus —\n     one connected unit, not a third floating box. Desktop = overlay (the\n     fixed column would squash an in-flow panel); mobile = in-flow below. */\n  .cansw-bdetail {\n    position: absolute; z-index: 150; top: 100%; left: 0; right: 0;\n    background: var(--cansw-card);\n    border: 1px solid #D7DFE8; border-top: 0;\n    border-radius: 0 0 4px 4px;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.08);\n    padding: 0;\n    overflow: hidden;\n    text-align: left;\n  }\n  .cansw-bdetail-toggle {\n    width: 100%;\n    display: flex; align-items: center; gap: 10px;\n    background: none; border: 0;\n    padding: 12px 16px;\n    font-family: inherit; font-size: 15px; font-weight: 600; color: var(--cansw-teal);\n    cursor: pointer; text-align: left;\n  }\n  .cansw-bdetail-toggle:hover { background: var(--cansw-ground); }\n  .cansw-bdetail-toggle:focus-visible { outline: 2px solid var(--cansw-teal); outline-offset: -2px; }\n  .cansw-bdetail-toggle .cansw-caret { margin-left: auto; transform: rotate(180deg); }\n  .cansw-bdetail-closed .cansw-bdetail-toggle .cansw-caret { transform: none; }\n  .cansw-bdetail-tlabel { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }\n  .cansw-bdetail-body {\n    border-top: 1px solid #EDF1F6;\n    background: var(--cansw-card);\n    overflow: hidden;\n  }\n  .cansw-bdetail-closed .cansw-bdetail-body { display: none; }\n  .cansw-bdetail-scroll {\n    max-height: 320px; overflow-y: auto; padding: 14px 16px 16px;\n  }\n  /* Firefox only: Chrome/Safari must NOT see scrollbar-width/color, or they\n     disable the ::-webkit-scrollbar customization below and fall back to\n     auto-hiding overlay bars */\n  @supports not selector(::-webkit-scrollbar) {\n    .cansw-bdetail-scroll { scrollbar-width: thin; scrollbar-color: #9DB1C1 var(--cansw-ground); }\n  }\n  .cansw-bdetail-scroll::-webkit-scrollbar { width: 12px; }\n  .cansw-bdetail-scroll::-webkit-scrollbar-track { background: var(--cansw-ground); border-radius: 6px; }\n  .cansw-bdetail-scroll::-webkit-scrollbar-thumb { background: #9DB1C1; border-radius: 6px; border: 2px solid var(--cansw-ground); }\n  .cansw-bdetail-scroll::-webkit-scrollbar-thumb:hover { background: var(--cansw-teal); }\n  .cansw-bdetail-fade {\n    position: absolute; left: 0; right: 12px; bottom: 0; height: 52px;\n    display: flex; align-items: flex-end; justify-content: center; padding-bottom: 6px;\n    background: linear-gradient(rgba(255,255,255,0), #FFFFFF 75%);\n    border-radius: 0 0 4px 4px;\n    pointer-events: none;\n  }\n  .cansw-bdetail-more {\n    pointer-events: auto;\n    width: 32px; height: 32px; border-radius: 50%;\n    background: #fff; border: 1px solid #D7DFE8;\n    box-shadow: 0 1px 3px rgba(0,0,0,0.08);\n    display: grid; place-items: center;\n    cursor: pointer; padding: 0;\n  }\n  .cansw-bdetail-more:hover { border-color: var(--cansw-teal); background: var(--cansw-ground); }\n  /* offers sit right under the header block; spare space pools BELOW the\n     content (Avi round 6), where Related partners absorb it in thin views */\n  .cansw-b-tops { margin-top: 16px; }\n  .cansw-b-tops-label {\n    font-size: 14px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;\n    color: var(--cansw-teal); margin: 0 0 8px;\n  }\n  .cansw-b-top {\n    width: 100%;\n    display: flex; align-items: center; gap: 10px;\n    padding: 8px 10px;\n    background: none; border: 0; border-radius: 4px;\n    font-family: inherit; font-size: 16px; color: var(--cansw-ink);\n    cursor: pointer; text-align: left;\n  }\n  .cansw-b-top:hover { background: var(--cansw-ground); }\n  .cansw-b-top .cansw-mono, .cansw-b-top .cansw-logo { width: 24px; height: 24px; }\n  .cansw-b-top-name { flex: 1; min-width: 0; font-weight: 600; }\n  .cansw-b-top-save { flex: none; font-weight: 700; color: var(--cansw-teal); font-variant-numeric: tabular-nums; }\n  .cansw-b-deal { font-size: 15px; font-weight: 600; color: var(--cansw-teal); margin: 0 0 8px; }\n  .cansw-b-desc { font-size: 15px; line-height: 1.55; color: var(--cansw-charcoal); margin: 0 0 12px; }\n  .cansw-b-plans { display: flex; flex-direction: column; gap: 6px; margin: 0 0 4px; }\n  .cansw-b-plan {\n    display: flex; align-items: center; gap: 10px;\n    padding: 8px 10px 8px 12px;\n    background: var(--cansw-ground); border: 1px solid #D7DFE8; border-radius: 4px;\n    font-size: 15px; color: var(--cansw-ink);\n  }\n  .cansw-b-plan-added { border-color: var(--cansw-teal); }\n  .cansw-b-plan-name { flex: 1; min-width: 0; }\n  .cansw-b-plan-price { color: #4B5563; font-size: 14px; }\n  .cansw-b-plan-save { color: var(--cansw-teal); font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; }\n  .cansw-b-plus {\n    flex: none; width: 32px; height: 32px;\n    border: 0; border-radius: 4px;\n    background: var(--cansw-teal); color: #fff;\n    font-family: inherit; font-size: 20px; font-weight: 600; line-height: 1;\n    display: grid; place-items: center;\n    cursor: pointer; padding: 0;\n  }\n  .cansw-b-plus:hover { background: var(--cansw-teal-dark); }\n  .cansw-b-plus:focus-visible { outline: 2px solid var(--cansw-teal); outline-offset: 2px; }\n  .cansw-b-plus[disabled] { background: rgba(42,100,120,0.12); color: var(--cansw-teal); cursor: default; font-size: 15px; }\n\n  /* builder-mode readability bumps for shared pieces */\n  .cansw-mode-open .cansw-count { font-size: 14px; color: #4B5563; }\n  .cansw-mode-open .cansw-menu-label { font-size: 13px; }\n\n  /* ACCESSIBILITY GROW: browser zoom / large-text settings make the content\n     taller than the fixed desktop footprint; the overflow used to spill past\n     the hero section and the next Kajabi section (Common Ninja testimonials)\n     painted over the widget's bottom. a11ySync in cansw.js measures after\n     every render and toggles this class ONLY when content still clips at the\n     fixed heights — normal metrics never trigger it, so the 520/580\n     footprint invariant is untouched. Desktop-scoped: mobile already grows. */\n  @media (min-width: 901px) {\n    .cansw-a11y-grow .cansw-result { height: auto; min-height: 580px; }\n    /* the card fills its stretched .cansw-right grid wrapper (100%, not\n       auto) so both columns end on the same line even when grown */\n    .cansw-a11y-grow.cansw-mode-open .cansw-result { height: 100%; min-height: 520px; }\n    .cansw-a11y-grow.cansw-mode-open .cansw-left { height: auto; min-height: 520px; }\n    /* unlocked calculator under zoom: auto-grow so totals/CTA stay reachable\n       (the fixed-height-every-state rule is normal-metrics only) */\n    .cansw-a11y-grow.cansw-mode-open .cansw-result.cansw-b-live { height: auto; }\n    /* grown columns stretch to the same height so bottoms stay aligned */\n    .cansw-a11y-grow.cansw-mode-open .cansw-cols { align-items: stretch; }\n  }\n\n  @media (max-width: 900px) {\n    /* tighter stack: less gray above the headline, less gap before the card */\n    .cansw-mode-open { padding: 20px 16px 36px; }\n    .cansw-mode-open .cansw-cols { gap: 20px; }\n    .cansw-mode-open .cansw-left { display: block; text-align: left; }\n    /* stacked layout: the panel sits IN FLOW inside the picker (pushes the\n       card down) — the overlay is only needed where the fixed-height desktop\n       column would squash it */\n    .cansw-bdetail { position: static; }\n    .cansw-bdetail-scroll { max-height: 300px; }\n    /* stacked layout: let the card grow with content — the fixed 520px\n       footprint only exists for the side-by-side desktop alignment, and on\n       phones it clipped the top-offers list down to one row */\n    .cansw-mode-open .cansw-result { height: auto; min-height: 0; }\n    .cansw-mode-open .cansw-left { height: auto; }\n    /* fixed-height rule applies on phones too (Avi 2026-08-03): the card\n       stops growing once the item list hits its cap — the list scrolls */\n    .cansw-mode-open .cansw-b-items { flex: none; max-height: 260px; }\n    .cansw-mode-open .cansw-picker { margin: 0; }\n    /* mobile: match the mobile h1 size; no top-alignment offset when stacked */\n    .cansw-savings-line { font-size: 26px; }\n    .cansw-mode-open .cansw-title { margin-top: 0; }\n  }\n\n  .cansw .cansw-cta, .cansw .cansw-cta:visited, .cansw .cansw-cta:hover { color: #fff !important; }\n  .cansw [hidden] { display: none !important; }\n  .cansw-cobrand{display:flex;align-items:center;gap:14px;margin:0 0 22px}\n  .cansw-cobrand-img{width:56px;height:56px;border-radius:50%;object-fit:cover;box-shadow:0 2px 6px rgba(0,0,0,.10);flex:none}\n  .cansw-cobrand-logo{height:44px;width:auto;max-width:170px;object-fit:contain;background:#fff;border-radius:8px;padding:6px 12px;box-shadow:0 1px 3px rgba(0,0,0,.06);flex:none}\n  .cansw-cobrand-name{font-size:16px;font-weight:700;color:var(--cansw-ink);margin:0;line-height:1.3}\n  .cansw-cobrand-title{font-size:13px;color:#8A94A3;margin:0;line-height:1.4}\n  .cansw-cobrand-with{font-size:12px;font-weight:600;color:var(--cansw-teal);letter-spacing:.5px;text-transform:uppercase;margin:0 0 2px}\n  .cansw-cobrand-x{font-size:18px;font-weight:700;color:var(--cansw-teal);flex:none}\n  .cansw-cobrand-clogo{width:56px;height:56px;border-radius:4px;object-fit:contain;background:#fff;padding:4px;box-shadow:0 1px 3px rgba(0,0,0,.06);flex:none}\n  .cansw-cobrand-can{height:44px;width:auto;flex:none}\n  .cansw-cobrand-canword{font-size:14px;font-weight:700;color:var(--cansw-teal);letter-spacing:.5px;text-transform:uppercase;line-height:1.2}\n  @media(max-width:480px){.cansw-cap-row{flex-direction:column}.cansw-cap-btn{width:100%}}\n  @media(max-width:900px){.cansw-cobrand{justify-content:center;flex-wrap:wrap}}\n  .cansw-cobrand-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:48px;max-width:1080px;margin:0 auto}\n  .cansw-cobrand-banner{grid-column:1;justify-content:flex-start;background:#fff;border:1px solid #D7DFE8;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.07);padding:16px 24px;margin:0 0 20px;gap:18px}\n  .cansw-cobrand-banner .cansw-cobrand-img{width:64px;height:64px}\n  .cansw-cobrand-banner .cansw-cobrand-clogo{width:64px;height:64px}\n  .cansw-cobrand-banner .cansw-cobrand-name{font-size:21px}\n  .cansw-cobrand-banner .cansw-cobrand-title{font-size:14px}\n  .cansw-cobrand-banner .cansw-cobrand-x{font-size:22px}\n  .cansw-cobrand-banner .cansw-cobrand-can{height:52px}\n  \n  .cansw-b-items-head{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--cansw-teal);padding:2px 38px 4px 0;border-bottom:1px solid #EDF1F6}\n  @media(max-width:900px){.cansw-cobrand-row{display:block}.cansw-cobrand-banner{flex-wrap:wrap;justify-content:flex-start;padding:12px 16px;gap:12px}}\n";
  var HTML = "<div class=\"cansw-cols\">\n  <div class=\"cansw-left\">\n    <h1 class=\"cansw-title\">Exclusive perks for Creators and solopreneurs</h1>\n    <p class=\"cansw-lede\" id=\"canswLede\" hidden></p>\n\n    <div class=\"cansw-stats\" id=\"canswStats\">\n      <div class=\"cansw-stat\">\n        <span class=\"cansw-stat-num\" id=\"canswStatPartners\">42</span>\n        <span class=\"cansw-stat-label\">Partners</span>\n      </div>\n      <div class=\"cansw-stat\">\n        <span class=\"cansw-stat-num\" id=\"canswStatValue\">$25,089</span>\n        <span class=\"cansw-stat-label\">In discounts</span>\n      </div>\n    </div>\n\n    <ul class=\"cansw-bullets\" id=\"canswBullets\">\n      <li>Events and Meetups</li>\n      <li>Tools &amp; Software</li>\n      <li>Platform Commissions</li>\n      <li>Production Gear</li>\n      <li>Professional Services</li>\n    </ul>\n\n    <p class=\"cansw-see\" id=\"canswSee\">See how much you could save:</p>\n\n    <div class=\"cansw-picker\" id=\"canswPicker\">\n      <button class=\"cansw-picker-btn\" id=\"canswBtn\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n        <span class=\"cansw-placeholder\" id=\"canswLabel\">What are you working on?</span>\n        <svg class=\"cansw-caret\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\">\n          <path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>\n      </button>\n      <div class=\"cansw-menu\" role=\"listbox\" id=\"canswMenu\">\n        <div class=\"cansw-menu-label\">Choose a category</div>\n      </div>\n    </div>\n\n    <div class=\"cansw-picker cansw-cpicker\" id=\"canswCPicker\" hidden>\n      <button class=\"cansw-picker-btn\" id=\"canswCBtn\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n        <span class=\"cansw-placeholder\" id=\"canswCLabel\">Pick a company</span>\n        <svg class=\"cansw-caret\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\">\n          <path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>\n      </button>\n      <div class=\"cansw-menu\" role=\"listbox\" id=\"canswCMenu\"></div>\n\n      <div class=\"cansw-bdetail\" id=\"canswBDetail\" hidden>\n      <button class=\"cansw-bdetail-toggle\" id=\"canswBDetailToggle\" type=\"button\" aria-expanded=\"true\" aria-controls=\"canswBDetailBody\">\n        <span class=\"cansw-bdetail-tlabel\" id=\"canswBDetailTLabel\"></span>\n        <svg class=\"cansw-caret\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\">\n          <path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>\n      </button>\n      <div class=\"cansw-bdetail-body\" id=\"canswBDetailBody\">\n        <div class=\"cansw-bdetail-scroll\" id=\"canswBDetailScroll\"></div>\n        <div class=\"cansw-bdetail-fade\" id=\"canswBDetailFade\" hidden>\n          <button class=\"cansw-bdetail-more\" id=\"canswBDetailMore\" type=\"button\" aria-label=\"Scroll for more\">\n            <svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\">\n              <path d=\"M3 6l5 5 5-5\" stroke=\"#2A6478\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            </svg>\n          </button>\n        </div>\n      </div>\n      </div>\n    </div>\n\n  </div>\n\n  <div class=\"cansw-right\">\n    <div class=\"cansw-result\" id=\"canswResult\" aria-live=\"polite\">\n      <div id=\"canswContent\">\n        <p class=\"cansw-kicker\" id=\"canswKicker\"></p>\n        <p class=\"cansw-savings\" id=\"canswNum\"></p>\n        <p class=\"cansw-savings-sub\" id=\"canswSub\"></p>\n        <p class=\"cansw-earn-note\" id=\"canswEarnNote\" hidden></p>\n\n        <div class=\"cansw-partners\" id=\"canswPills\"></div>\n\n        <p class=\"cansw-trophy-note\" id=\"canswTrophyNote\" hidden>&#127942; = Exclusive to CAN or the best discount this partner offers</p>\n\n        <p class=\"cansw-locked\">\n          <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n            <rect x=\"2.5\" y=\"6\" width=\"9\" height=\"6\" rx=\"1\" stroke=\"#8A94A3\" stroke-width=\"1.5\"/>\n            <path d=\"M4.5 6V4.5a2.5 2.5 0 015 0V6\" stroke=\"#8A94A3\" stroke-width=\"1.5\"/>\n          </svg>\n          Exact discount terms are revealed inside the membership\n        </p>\n\n        <div class=\"cansw-earn\" id=\"canswEarnBlock\" hidden>\n          <div class=\"cansw-earn-label\">\n            <span>Your monthly affiliate earnings today</span>\n            <output id=\"canswEarnIn\">$1,000</output>\n          </div>\n          <input type=\"range\" id=\"canswEarnSlider\" min=\"0\" max=\"10000\" step=\"100\" value=\"1000\" aria-label=\"Your monthly affiliate earnings in dollars\">\n          <p class=\"cansw-earn-result\" id=\"canswEarnOut\"></p>\n          <p class=\"cansw-earn-fine\">Members earn 10% more on the same sales through our partner's improved revenue split.</p>\n        </div>\n\n        <form class=\"cansw-capture\" novalidate>\n          <div class=\"cansw-cap-row\">\n            <input class=\"cansw-cap-input\" type=\"email\" placeholder=\"you@email.com\" autocomplete=\"email\" aria-label=\"Your email address\">\n            <button class=\"cansw-cta cansw-cap-btn\" type=\"submit\">Unlock free discounts</button>\n          </div>\n          <label class=\"cansw-cap-optin\">\n            <input type=\"checkbox\">\n            <span>I agree to receive the Creator Access Network newsletter for educational and marketing purposes.</span>\n          </label>\n        </form>\n        <a class=\"cansw-see-all\" id=\"canswSeeAll\" href=\"#\">See every partner discount</a>\n      </div>\n\n      <div class=\"cansw-budget\" id=\"canswBudget\">\n        <p class=\"cansw-b-budget-h\"><span id=\"canswBTitle\">Calculate your savings</span><span class=\"cansw-b-count\" id=\"canswBCount\"></span></p>\n        <p class=\"cansw-b-budget-sub\" id=\"canswBSub\">Pick the software, products, and services on the left that you need to build your business, and see how much you will save.</p>\n        <div class=\"cansw-b-preview\" id=\"canswBPreview\" hidden></div>\n        <p class=\"cansw-b-empty\" id=\"canswBEmpty\" hidden>Nothing here yet. Pick a company and hit + on the plan you want.</p>\n        <div class=\"cansw-b-items\" id=\"canswBItems\"></div>\n        <div class=\"cansw-earn cansw-b-earnbox\" id=\"canswBEarnBox\" hidden>\n          <div class=\"cansw-earn-label\">\n            <span>Your monthly earnings today</span>\n            <output id=\"canswBEarnIn\">$1,000</output>\n          </div>\n          <input type=\"range\" id=\"canswBEarnSlider\" min=\"0\" max=\"10000\" step=\"100\" value=\"1000\" aria-label=\"Your monthly earnings in dollars\">\n          <p class=\"cansw-earn-result\" id=\"canswBEarnOut\"></p>\n          <p class=\"cansw-earn-fine\" id=\"canswBEarnWho\">Members earn 10% more on the same sales through our partner's improved revenue split.</p>\n        </div>\n        <div class=\"cansw-b-totals\" id=\"canswBTotals\" hidden>\n          <div class=\"cansw-b-trow\"><span>Your first-year savings</span><strong id=\"canswBSave\">$0</strong></div>\n          <div class=\"cansw-b-trow\" id=\"canswBEarnRow\" hidden><span>Additional earnings</span><strong id=\"canswBEarnVal\">$0</strong></div>\n          <div class=\"cansw-b-trow\"><span>CAN membership</span><strong id=\"canswBCost\">&minus;$49</strong></div>\n          <div class=\"cansw-b-profit\"><span>Your profit</span><span class=\"cansw-b-profit-num\" id=\"canswBProfit\">$0</span></div>\n        </div>\n        <form class=\"cansw-capture cansw-b-capture\" novalidate>\n          <div class=\"cansw-cap-row\">\n            <input class=\"cansw-cap-input\" type=\"email\" placeholder=\"you@email.com\" autocomplete=\"email\" aria-label=\"Your email address\">\n            <button class=\"cansw-cta cansw-cap-btn\" type=\"submit\">Unlock free discounts</button>\n          </div>\n          <label class=\"cansw-cap-optin\">\n            <input type=\"checkbox\">\n            <span>I agree to receive the Creator Access Network newsletter for educational and marketing purposes.</span>\n          </label>\n        </form>\n      </div>\n    </div>\n  </div>\n</div>";
  var FALLBACK = {"generated": "2026-08-04", "partners": [{"n": "Fourthwall", "v": [50, 50], "t": true, "c": ["Merchandise", "Digital Products", "Memberships & Community", "Website & Bio Link", "Monetization"], "deal": "$50 in free product samples", "desc": "Merch platform where you design, sell, and ship products from a storefront that matches your brand.", "plans": [{"name": "—", "price": null, "save": 50}]}, {"n": "Creator Wizard", "v": [106, 106], "c": ["Education", "Brand Deals", "Resources"], "deal": "Free Sponsor Magnet eBook + 50% off the $10K Challenge", "desc": "Brand deal education from Justin Moore, whose Sponsor Magnet book covers what he taught in his $2,000 course.", "plans": [{"name": "—", "price": null, "save": 106}]}, {"n": "Creators Guild of America", "v": [99, 99], "t": true, "c": ["Brand Deals", "Resources"], "deal": "Free membership for 1 year", "desc": "Professional guild for Creators with an IMDb-style profile that proves to brands you're a pro.", "plans": [{"name": "Associate membership", "price": 99, "per": "yr", "save": 99}]}, {"n": "ShopYourLikes", "v": null, "earn": true, "t": true, "c": ["Affiliates", "Monetization"], "deal": "80/20 affiliate split, 10 points higher than standard", "desc": "Affiliate platform with 20,000+ major brands like Nike, Walmart, and Ulta, where members keep a bigger share of every sale."}, {"n": "Unbound Legal", "v": [896, 1646], "t": true, "c": ["Legal", "Business Infrastructure"], "deal": "15% off legal service packages", "desc": "Legal services from Chelsey Mori, one of the best-known attorneys in the Creator Economy.", "plans": [{"name": "15-hour package", "price": 5975, "save": 896}, {"name": "30-hour package", "price": 10975, "save": 1646}]}, {"n": "SendOwl", "v": [280, 1144], "t": true, "c": ["Digital Products", "Memberships & Community", "Monetization"], "deal": "40% off for 18 months", "desc": "Digital product and membership checkout that lets you sell through one link anywhere you post.", "plans": [{"name": "Launch", "price": 39, "per": "mo", "save": 280}, {"name": "Grow", "price": 87, "per": "mo", "save": 626}, {"name": "Scale", "price": 159, "per": "mo", "save": 1144}]}, {"n": "Nas.com", "v": [54, 500], "t": true, "c": ["Digital Products", "Courses", "Memberships & Community", "Coaching", "Monetization"], "deal": "50% off all plans for 1 year", "desc": "Membership and digital product platform from Nas Daily founder Nuseir Yassin, simple enough to launch a paid membership in five minutes.", "plans": [{"name": "Pro, annual", "price": 249, "per": "yr", "save": 125}, {"name": "Platinum, annual", "price": 799, "per": "yr", "save": 400}]}, {"n": "EssentL Creator", "v": [450, 450], "t": true, "c": ["Business Infrastructure", "Insurance", "Mental Health"], "deal": "50% off the service fee for 6 months", "desc": "Health insurance and HR benefits service that brings corporate-quality coverage to Creators, often below public marketplace rates.", "plans": [{"name": "—", "price": null, "save": 450}]}, {"n": "Boring Stuff", "v": [600, 600], "t": true, "c": ["Accounting", "Business Infrastructure"], "deal": "50% off your first 3 months", "desc": "Accounting firm for Creators co-founded by YouTuber Jon Youshaei and Airrack's manager Zack Honarvar.", "plans": [{"name": "—", "price": null, "save": 600}]}, {"n": "Kajabi", "v": [358, 358], "t": true, "c": ["Website & Bio Link", "Digital Products", "Courses", "Memberships & Community", "Coaching", "Monetization"], "deal": "Member-only discount", "desc": "Course, coaching, and membership platform where Creators have earned over $10 billion selling digital products.", "plans": [{"name": "—", "price": null, "save": 358}]}, {"n": "Slipstream", "v": [60, 60], "t": true, "c": ["Music", "Royalty-Free", "YouTube"], "deal": "50% off the annual Creator plan", "desc": "Royalty-free music library for Creators, the largest independent catalog you can use without copyright-strike risk.", "plans": [{"name": "Creator, annual", "price": 96, "per": "yr", "save": 60}]}, {"n": "beehiiv", "v": [129, 1212], "t": true, "c": ["Newsletter", "Website & Bio Link", "Digital Products", "Monetization"], "deal": "25% off paid plans for 1 year", "desc": "Newsletter platform built by former Morning Brew employees with design, website, growth, and monetization tools.", "plans": [{"name": "Scale, monthly", "price": 43, "per": "mo", "save": 129}, {"name": "Max, monthly", "price": 96, "per": "mo", "save": 288}, {"name": "Larger lists (prices scale)", "price": null, "save": 1212}]}, {"n": "Elevate.io", "v": [30, 300], "t": true, "c": ["Video", "Editing"], "deal": "3 months free", "desc": "Collaborative video editing that works like a shared doc, so you and your editor skip the export-upload-download loop.", "plans": [{"name": "Creator", "price": 10, "per": "mo", "save": 30}, {"name": "Pro, annual", "price": 300, "per": "yr", "save": 75}, {"name": "Business, monthly", "price": 100, "per": "mo", "save": 300}]}, {"n": "Karat", "v": [250, 250], "t": true, "c": ["Banking", "Business Infrastructure"], "deal": "3 months of Premium free + $100 account credit with a qualifying balance", "desc": "Banking built for Creators, with a Premium plan that pays 1.75% interest on your checking account.", "plans": [{"name": "—", "price": null, "save": 250}]}, {"n": ".store", "v": [200, 200], "t": true, "c": ["Website & Bio Link", "Business Infrastructure"], "deal": "5 years of your .store domain free", "desc": "Domain for your shop that separates your commerce from your content, the same way MrBeast's merch store does.", "plans": [{"name": "—", "price": null, "save": 200}]}, {"n": "FYPM", "v": [416, 416], "t": true, "c": ["Brand Deals"], "deal": "50% off membership for life", "desc": "Brand deal intel database crowdsourced from Creators, so you can see what peers actually get paid before you negotiate.", "plans": [{"name": "Membership", "price": null, "save": 416}]}, {"n": "Pop.store", "v": [35, 717], "t": true, "c": ["Website & Bio Link", "Courses", "Digital Products", "Memberships & Community", "Coaching", "Automation", "AI", "Instagram", "Monetization"], "deal": "30% off annual plans and 10% off monthly plans for your first year", "desc": "Link-in-bio monetization platform with an affiliate network, digital products, community chat, and an AI fan assistant.", "plans": [{"name": "Creator, annual", "price": 144, "per": "yr", "save": 43}, {"name": "Top plans, annual (prices scale by vertical)", "price": null, "save": 717}]}, {"n": "Mercury", "v": [400, 400], "t": true, "c": ["Banking", "Business Infrastructure"], "deal": "Up to $400 in cash bonuses", "desc": "Business banking and credit cards used by thousands of startups and small businesses.", "plans": [{"name": "—", "price": null, "save": 400}]}, {"n": "Growth in Reverse", "v": [50, 50], "t": true, "c": ["Education", "Newsletter", "Growth"], "deal": "$50 off the Growth Vault", "desc": "Newsletter growth education from Chenell Basilio, whose Growth Vault compiles playbooks from hundreds of top newsletter teardowns.", "plans": [{"name": "Growth Vault", "price": 200, "save": 50}]}, {"n": "Wispr Flow", "v": [72, 90], "c": ["Productivity", "AI"], "deal": "6 months of Pro free", "desc": "AI dictation tool that types what you say in any app, so you can stop typing and start talking.", "plans": [{"name": "Pro, monthly", "price": 15, "per": "mo", "save": 90}, {"name": "Pro, annual", "price": 144, "per": "yr", "save": 72}]}, {"n": "Epidemic Sound", "v": [60, 60], "t": true, "c": ["Music", "Royalty-Free", "YouTube"], "deal": "50% off the annual Creator plan", "desc": "Royalty-free music library that is the biggest name in YouTube-safe soundtracks.", "plans": [{"name": "Creator, annual", "price": 120, "per": "yr", "save": 60}]}, {"n": "Teachable", "v": [248, 500], "t": true, "c": ["Digital Products", "Courses", "Memberships & Community", "Coaching", "Monetization"], "deal": "30% off annual Builder and Growth plans", "desc": "Course platform designed for experts and educators, with downloads, memberships, and coaching sold alongside.", "plans": [{"name": "Builder, annual", "price": 828, "per": "yr", "save": 248}, {"name": "Growth, annual", "price": 1668, "per": "yr", "save": 500}]}, {"n": "Hopp", "v": [36, 600], "t": true, "c": ["Website & Bio Link"], "deal": "30% off any plan, 50% off Grow", "desc": "Bio link builder from Wix for a link page that looks sharp and still converts.", "plans": [{"name": "Lite", "price": 10, "per": "mo", "save": 36}, {"name": "Brand", "price": 17, "per": "mo", "save": 61}, {"name": "Sell", "price": 30, "per": "mo", "save": 108}, {"name": "Grow", "price": 100, "per": "mo", "save": 600}]}, {"n": "ClearPath", "v": [1500, 1500], "t": true, "c": ["Accounting", "Business Infrastructure"], "deal": "25% off for 1 year", "desc": "Accounting service for Creators, and the firm our founder trusts with his own bookkeeping, invoicing, and taxes.", "plans": [{"name": "Tax services", "price": 450, "save": 113}, {"name": "Full service", "price": 500, "per": "mo", "save": 1500}]}, {"n": "Pierson Ferdinand", "v": [150, 150], "t": true, "c": ["Legal", "Business Infrastructure"]}, {"n": "Insense", "v": null, "c": ["Brand Deals", "UGC", "Monetization"], "deal": "Priority access to paid brand campaigns", "desc": "UGC marketplace where small-audience Creators land high-paying content campaigns from big brands.", "be": true}, {"n": "Mighty Networks", "v": [316, 1416], "t": true, "c": ["Memberships & Community", "Digital Products", "Courses", "Coaching", "Monetization"], "deal": "4 months free on annual plans", "desc": "Community platform built so members engage with each other, not just with you.", "plans": [{"name": "Launch, annual", "price": 950, "per": "yr", "save": 316}, {"name": "Scale, annual", "price": 2148, "per": "yr", "save": 716}, {"name": "Growth, annual", "price": 4250, "per": "yr", "save": 1416}]}, {"n": "CreatorCare", "v": null, "t": true, "c": ["Mental Health"]}, {"n": "Thematic", "v": [60, 60], "t": true, "c": ["Music", "Royalty-Free", "YouTube"], "deal": "75% off yearly Premium", "desc": "Music licensing service that lets you use real artists' songs on YouTube in exchange for a credit in your description.", "plans": [{"name": "Premium, annual", "price": 79, "per": "yr", "save": 59}]}, {"n": "Buy.Video", "v": [400, 1000], "t": true, "c": ["Video", "Digital Products", "Monetization"], "deal": "No platform fees on up to 2,500 sales for 60 days", "desc": "Video commerce tool for selling videos as timed drops that expire after the window you set.", "plans": [{"name": "—", "price": null, "save": 400}]}, {"n": "Switcher Studios", "v": [200, 200], "t": true, "c": ["Livestreaming", "Video", "Monetization"], "deal": "Member-only annual discount", "desc": "Live video production platform for streaming, hosting, and monetizing with the gear you already own.", "plans": [{"name": "Annual plan", "price": null, "save": 200}]}, {"n": "CreatorScore", "v": [40, 160], "t": true, "c": ["Analytics", "Brand Deals"], "deal": "2 months free, then 50% off for life", "desc": "Content analytics that show how brand-safe your channels look to sponsors, so you can fix red flags before they cost you a deal.", "plans": [{"name": "Creator plan", "price": 20, "per": "mo", "save": 140}]}, {"n": "Ratelle Law", "v": [900, 900], "t": true, "c": ["Legal", "Business Infrastructure", "Resources"], "deal": "30% off the Creator Legal Bundle", "desc": "Legal templates and contracts for Creators from Creator attorney Brittany Ratelle, covering brand deals, contractors, and more.", "plans": [{"name": "Creator Legal Bundle", "price": 697, "save": 209}]}, {"n": "Dorian", "v": null, "earn": true, "t": true, "c": ["Gaming", "Monetization", "Platforms"], "deal": "100% revshare for your first 120 days", "desc": "Game platform that turns your story, comic, or world into a monetizable no-code game in days."}, {"n": "Revenews", "v": null, "t": true, "c": ["Newsletter", "Brand Deals", "Monetization"], "deal": "Setup fee waived + 5% off your first 3 months", "desc": "Ad sales service from the team that sold over $9M in sponsorships for newsletters like Finimize and The Daily Upside.", "plans": [{"name": "Ad Sales as a Service", "price": null, "save": 1405}]}, {"n": "DUPAY", "v": [60, 60], "t": true, "c": ["Brand Deals", "Legal", "Business Infrastructure", "Resources"], "deal": "2 months of Tools + Protection free", "desc": "Brand deal protection service with contracts, invoicing, and collections help if a brand won't pay.", "plans": [{"name": "Tools + Protection", "price": 29, "per": "mo", "save": 60}]}, {"n": "EditHers", "v": null, "c": ["Hiring", "Business Infrastructure"]}, {"n": "TopFan", "v": null, "earn": true, "t": true, "c": ["Website & Bio Link", "Platforms", "Digital Products", "Courses", "Memberships & Community", "Coaching", "Merchandise", "Monetization"], "deal": "87% revshare instead of the standard 85%", "desc": "Monetization platform that sells your courses, community, and merch through your own website and app for $0 upfront."}, {"n": "Valim", "v": [360, 450], "t": true, "c": ["Accounting", "Business Infrastructure"], "deal": "45% off all tax return filings", "desc": "Tax filing and advisory firm led by ex-Big 4 CPAs with year-round support and fast turnaround.", "plans": [{"name": "Individual return", "price": null, "save": 360}, {"name": "Business return", "price": null, "save": 450}]}, {"n": "Built by Foundry", "v": [600, 750], "t": true, "c": ["Digital Products", "Memberships & Community", "Monetization", "Platforms"], "deal": "25% off platform fee for life + 85% revenue share (vs 80% standard)", "desc": "Business-building service that designs, launches, and runs a recurring-revenue business under your brand while you keep 85% of what it earns.", "plans": [{"name": "—", "price": null, "save": 600}]}, {"n": "Driff", "v": null, "earn": true, "c": ["Monetization", "Digital Products"], "deal": "90/10 revenue split for your first 3 months (80/20 after)", "desc": "Monetization platform that lets you charge for paid Q&A and chat with your audience, starting at a 90/10 revenue split for your first three months."}], "logos": {"Fourthwall": "https://cdn.commoninja.com/asset/1f312bbf-eb47-41f5-890c-9d5e4e39b7fc.png", "Creator Wizard": "https://cdn.commoninja.com/asset/932da69e-34b0-475d-8018-cfbbf709c5f4.png", "Creators Guild of America": "https://cdn.commoninja.com/asset/e67d4f36-c7aa-4257-8a6d-71ac3a703128.png", "ShopYourLikes": "https://cdn.commoninja.com/asset/dcefc1df-a971-4315-a594-b32db8781973.png", "Unbound Legal": "https://cdn.commoninja.com/asset/f401d169-92e9-4a4e-bd9c-d4fc7535db9d.jpg", "SendOwl": "https://cdn.commoninja.com/asset/a9d50920-2603-4933-b6c3-00045721a847.png", "Nas.com": "https://cdn.commoninja.com/asset/60e809e6-0aa3-45e9-8cf4-9e029220b3be.png", "EssentL Creator": "https://cdn.commoninja.com/asset/3797119d-e8fb-414e-b0c4-37b6d4cb5eec.png", "Boring Stuff": "https://cdn.commoninja.com/asset/d762d97f-370c-4862-9ed0-d0434728eeb3.png", "Kajabi": "https://cdn.commoninja.com/asset/79542a92-4300-4f9c-bc34-29ba0410bad1.png", "Slipstream": "https://cdn.commoninja.com/asset/1d2418e0-b38b-4ae7-b1ca-7f318402e502.jpg", "beehiiv": "https://cdn.commoninja.com/asset/17226348-3ca7-4837-9a75-9f863e05dad5.png", "Elevate.io": "https://cdn.commoninja.com/asset/ee1380b1-42d6-4d93-9b3e-917333012589.png", "Karat": "https://cdn.commoninja.com/asset/1c8f0175-228c-4137-b063-47195ea7eb3b.png", ".store": "https://cdn.commoninja.com/asset/1096651c-a59f-42d0-b9a0-3edd16434ebb.png", "FYPM": "https://cdn.commoninja.com/asset/352db6dc-293b-4ceb-8f15-318cf84b75f4.png", "Pop.store": "https://cdn.commoninja.com/asset/7bbccbda-fa40-4b79-bfbe-f433a634bec9.png", "Mercury": "https://cdn.commoninja.com/asset/192714c1-3628-4441-b3bd-3876e687e3e5.png", "Growth in Reverse": "https://cdn.commoninja.com/asset/a037d267-cfc9-4099-bac8-5ce1303643a5.png", "Wispr Flow": "https://cdn.commoninja.com/asset/9fc7abfd-06f4-42b2-a037-72011fb19b3e.png", "Epidemic Sound": "https://cdn.commoninja.com/asset/d4a0ac81-8de7-4857-9b3c-43d803fa9871.png", "Teachable": "https://cdn.commoninja.com/asset/dbf2a3ca-a19d-44fe-a61e-3bff641ecc82.jpeg", "Hopp": "https://cdn.commoninja.com/asset/6a5383c0-7402-4feb-ac32-85e526a82f1f.png", "ClearPath": "https://cdn.commoninja.com/asset/4b70b4e5-e6d8-4918-a71c-14d3c3f89a00.png", "Pierson Ferdinand": "https://cdn.commoninja.com/asset/efa9dd93-4d6d-4012-84b2-9d8dc6518d6b.jpg", "Insense": "https://cdn.commoninja.com/asset/7b7f0900-39bb-4672-a3fe-34f11aa2eef7.png", "Mighty Networks": "https://cdn.commoninja.com/asset/6bf52e53-86fe-419e-ab33-876d79d287b0.png", "CreatorCare": "https://cdn.commoninja.com/asset/048ee7e9-3fbb-4589-aefe-5f76252c91b3.png", "Thematic": "https://cdn.commoninja.com/asset/f42e7860-717e-4a27-a3e8-2714a8152586.png", "Buy.Video": "https://cdn.commoninja.com/asset/ec692c8e-3ff5-4eb4-adee-196f3c05780f.png", "Switcher Studios": "https://cdn.commoninja.com/asset/a1e6cf0b-41ec-4827-a74d-ae528816170b.png", "CreatorScore": "https://cdn.commoninja.com/asset/6eebbca6-0b7e-4918-bc1b-32201328b1ce.png", "Ratelle Law": "https://cdn.commoninja.com/asset/ba8a0432-228d-49d3-8e0c-44c9d4f512cb.png", "Dorian": "https://cdn.commoninja.com/asset/1c1b028d-4f55-4989-b77f-8b6f1b1f8e3f.jpg", "Revenews": "https://cdn.commoninja.com/asset/bb2d8089-e680-4e49-be71-14063bee93d6.png", "DUPAY": "https://cdn.commoninja.com/asset/4ac8cbc0-639e-4d10-92ff-7066af0e1b2c.png", "EditHers": "https://cdn.commoninja.com/asset/a567569b-dc20-4ae4-9b65-82cea76487fb.png", "TopFan": "https://cdn.commoninja.com/asset/8fe364b7-4594-4c1a-8ca2-a1f8cb570965.png", "Valim": "https://cdn.commoninja.com/asset/64492f65-c809-48a0-8a4d-b1e4ee265ecc.png", "Built by Foundry": "https://cdn.commoninja.com/asset/1c56b901-346d-4e67-988d-eb6fc84c93c9.png"}};

  var DEFAULTS = {
    joinUrl: "https://www.creatoraccessnetwork.com/resource_redirect/offers/oyLoKFBu",
    dealsUrl: "https://www.creatoraccessnetwork.com/partners",
    earnUplift: 0.10,
    defaultCategory: "Memberships & Community",
    rotateMs: 2000,
    builder: false,
    membershipCost: 49,
    captureUrl: "", /* Zapier catch-hook URL; set per surface via CANSW_OVERRIDES */
    captureTag: "widget"
  };
  var NUMBERS = null; /* set from numbers.json before init(); see fetch at the bottom */
  var CFG = {};
  var ov = window.CANSW_OVERRIDES || {};
  for (var k in DEFAULTS) CFG[k] = DEFAULTS[k];
  for (var k2 in ov) CFG[k2] = ov[k2];

  /* mount: explicit #cansw-mount if present, else right before this script tag */
  var mount = document.getElementById("cansw-mount");
  if (!mount) {
    mount = document.createElement("div");
    SCRIPT.parentNode.insertBefore(mount, SCRIPT);
  }
  if (!document.getElementById("cansw-style")) {
    var st = document.createElement("style");
    st.id = "cansw-style";
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  mount.innerHTML = '<div class="cansw">' + HTML + '</div>';
  var root = mount.querySelector(".cansw");

  /* Kajabi wraps code blocks in .block containers with overflow:hidden,
     which clips the dropdown menus where they extend past the hero section
     (seen live 2026-07-24: company menu cut off at the section divider).
     Un-clip every ancestor up to and including the containing section. */
  for (var anc = mount.parentElement; anc && anc !== document.body; anc = anc.parentElement) {
    try { if (getComputedStyle(anc).overflow !== "visible") anc.style.overflow = "visible"; } catch (e) {}
    if ((anc.id && anc.id.indexOf("section") === 0) || /(^|\s)section(\s|$)/.test(anc.className || "")) break;
  }

  function init(DATA) {

  /* ---- category index + render (single Unlock Access CTA design) ---- */
  var PARTNERS = DATA.partners, LOGOS = DATA.logos;
  /* co-brand rule (Avi 2026-08-03): never show the page partner's
     competitors anywhere in the widget — filter at the single choke point
     so categories, tops, related, picker, and preview all inherit it */
  if (CFG.hidePartners && CFG.hidePartners.length) {
    PARTNERS = PARTNERS.filter(function (p) { return CFG.hidePartners.indexOf(p.n) === -1; });
  }
  /* commission-savings ceilings that the tracker's savings-range column
     doesn't carry (Avi 2026-07-28: Dorian's 100%-revshare promo SAVES you up
     to $5,000 in commission — everything is framed as savings). These live
     in CODE, not in cansw-data.json, so that file stays exactly the shape
     the daily Notion sync expects. Uncapped commission deals
     (ShopYourLikes, Insense, TopFan) stay $0 per Avi 2026-07-26. */
  var SAVE_CEILS = { "Dorian": 5000 };
  /* earnings sliders + UNCAPPED earn-only partners are OUT of the widget on
     every surface (Avi 2026-08-03: "they clutter it and don't add
     anything"). CAPPED earn deals are "basically discounts" (Avi: Dorian's
     no-commission promo = a $5,000 commission discount), so they get a
     synthetic savings plan and flow through the normal savings machinery —
     no earn flags survive this filter, which starves all earn UI (sliders,
     "Earn 10% more" rows, +10% chips). Stripped partners stay in
     cansw-data.json and on partner pages' static picks grids. */
  PARTNERS = PARTNERS.filter(function (p) {
    if (!(p.earn || p.be)) return true;
    if (!(p.plans && p.plans.length)) {
      var ceil = SAVE_CEILS[p.n];
      if (!ceil) return false; /* uncapped earn-only: strip */
      p.plans = [{ name: "Commission discount", price: null, save: ceil }];
    }
    p.earn = false; p.be = false;
    return true;
  });
  /* "Featured" — synthetic category with the biggest companies and most
     popular discounts (Avi 2026-08-03; also the default view on co-brand
     pages so a partner's industry category never surfaces competitors).
     Update this list by hand — the Notion sync doesn't manage it. */
  var FEATURED = ["beehiiv", ".store", "Wispr Flow", "Fourthwall", "Pop.store", "Kajabi", "Mercury", "Teachable", "Hopp", "Epidemic Sound"];
  PARTNERS.forEach(function (p) {
    if (FEATURED.indexOf(p.n) > -1) p.c = ["Featured"].concat(p.c);
  });
  /* one ceiling per partner = the highest value of its deal on ANY basis
     (tracker savings range, best plan save, commission-savings cap) — the
     header, the top rows, and the ranking all use THIS, so the header can
     never sit below a row again (Avi 2026-07-28: Newsletter showed $1,212
     over a $1,405 Revenews row because header used v-ranges, rows plans) */
  function dealCeil(p) {
    var m = SAVE_CEILS[p.n] || 0;
    if (p.v && p.v[1] > m) m = p.v[1];
    if (p.plans) p.plans.forEach(function (pl) { if (pl.save > m) m = pl.save; });
    return m;
  }
  var CATS = {};
  PARTNERS.forEach(function (p) {
    p.c.forEach(function (c) {
      if (!CATS[c]) CATS[c] = { partners: [], vals: [], earners: [], nvals: 0, ceil: 0 };
      CATS[c].partners.push({ n: p.n, t: !!p.t });
      if (p.v !== null && p.v !== undefined) { CATS[c].vals.push(p.v[0]); CATS[c].vals.push(p.v[1]); CATS[c].nvals++; }
      if (p.earn) CATS[c].earners.push(p.n);
      if (dealCeil(p) > CATS[c].ceil) CATS[c].ceil = dealCeil(p);
    });
  });
  var CAT_NAMES = Object.keys(CATS).sort(function (a, b) {
    /* Featured pins to the top of every category menu */
    if (a === "Featured") return -1;
    if (b === "Featured") return 1;
    return a < b ? -1 : a > b ? 1 : 0;
  });

  var nEl = document.getElementById("canswStatPartners");
  /* NUMBERS wins when present: the tracker is ground truth for the live
     partner count, and the widget's own array can lag it between syncs */
  if (nEl) nEl.textContent = (NUMBERS && NUMBERS.partner_count) || PARTNERS.length;
  /* exact dollar total (Avi 2026-08-11: as exact as possible, no rounding):
     numbers.json total_value_exact -> rounded total_value -> self-computed sum */
  var statValEl = document.getElementById("canswStatValue");
  if (statValEl) {
    if (NUMBERS && NUMBERS.total_value_exact) {
      statValEl.textContent = "$" + Number(NUMBERS.total_value_exact).toLocaleString("en-US");
    } else if (NUMBERS && NUMBERS.total_value) {
      statValEl.textContent = NUMBERS.total_value;
    } else {
      var statSum = 0;
      PARTNERS.forEach(function (p) { statSum += dealCeil(p); });
      statValEl.textContent = "$" + (Math.floor(statSum / 100) * 100).toLocaleString("en-US") + "+";
    }
  }

  /* headline / lede / cobrand overrides */
  var titleEl = root.querySelector(".cansw-title");
  var ledeEl = root.querySelector(".cansw-lede");
  var cb = CFG.cobrand || null;
  var headline = (cb && cb.headline) || CFG.headline;
  var lede = (cb && cb.lede) || CFG.lede;
  if (headline) titleEl.textContent = headline;
  if (lede) {
    /* a page-supplied lede replaces the bullet list (stats stay) */
    ledeEl.textContent = lede;
    ledeEl.hidden = false;
    var bulletsEl = document.getElementById("canswBullets");
    if (bulletsEl) bulletsEl.style.display = "none";
  }
  if (cb && (cb.name || cb.image)) {
    var w = document.createElement("div");
    w.className = "cansw-cobrand cansw-cobrand-banner";
    var imgCls = cb.mode === "logo" ? "cansw-cobrand-clogo" : "cansw-cobrand-img";
    var img = (cb.image && cb.mode !== "text") ? '<img class="' + imgCls + '" src="' + cb.image + '" alt="' + (cb.name || "") + '">' : '';
    var title = cb.title ? '<p class="cansw-cobrand-title">' + cb.title + '</p>' : '';
    w.innerHTML = img +
      '<div><p class="cansw-cobrand-with">Curated with</p><p class="cansw-cobrand-name">' + (cb.name || "") + '</p>' + title + '</div>' +
      '<span class="cansw-cobrand-x">&times;</span>' +
      '<img class="cansw-cobrand-can" src="' + CAN_LOGO + '" alt="Creator Access Network">';
    var row = document.createElement("div");
    row.className = "cansw-cobrand-row";
    row.appendChild(w);
    var cols = root.querySelector(".cansw-cols");
    cols.parentNode.insertBefore(row, cols);
  }

  var picker = document.getElementById("canswPicker");
  var btn = document.getElementById("canswBtn");
  var label = document.getElementById("canswLabel");
  var menu = document.getElementById("canswMenu");
  var result = document.getElementById("canswResult");
  var OPT_ELS = {};
  var fmt = function (n) { return "$" + n.toLocaleString("en-US"); };

  var seeAll = document.getElementById("canswSeeAll");
  if (CFG.dealsUrl) { seeAll.href = CFG.dealsUrl; } else { seeAll.hidden = true; }

  /* ---- accessibility grow ----
     Browser zoom / large-text settings can make the content taller than the
     fixed-height desktop columns; the overflow spilled past the hero section
     and the next Kajabi section (Common Ninja testimonials) painted over the
     widget's bottom third (seen live 2026-07-29). After every render we
     re-measure: if content still clips at the fixed footprint even after the
     preview fit pass, .cansw-a11y-grow (desktop-scoped CSS) turns the fixed
     heights into minimums so both columns grow together and push the next
     section down. Normal metrics measure clean, so the 520/580 footprint
     invariant is untouched; zooming back out shrinks the widget back. */
  var a11yRerender = null; /* builder points this at renderPreview */
  var a11yBusy = false;
  function a11yClips(el) { return !!el && el.scrollHeight - el.clientHeight > 3; }
  /* the left column's dropdown menus and the fused deal panel are overlays
     that hang below it BY DESIGN — scrollHeight counts them, so measure only
     the in-flow children against the column's fixed edge */
  function a11yLeftClips(el) {
    if (!el) return false;
    var edge = el.getBoundingClientRect().bottom;
    for (var i = 0; i < el.children.length; i++) {
      var cs = getComputedStyle(el.children[i]);
      if (cs.position === "absolute" || cs.position === "fixed" || cs.display === "none") continue;
      if (el.children[i].getBoundingClientRect().bottom - edge > 3) return true;
    }
    return false;
  }
  function a11ySync() {
    if (a11yBusy) return;
    a11yBusy = true;
    try {
      var leftEl = root.querySelector(".cansw-left");
      if (root.classList.contains("cansw-a11y-grow")) {
        /* re-measure from the clipped state, or a grown card never shrinks back */
        root.classList.remove("cansw-a11y-grow");
        if (a11yRerender) a11yRerender();
      }
      /* the card's flex column pushes its overflow into the preview box
         (flex 1 1 auto, min-height 0), so measure that box too — the fit
         pass trims whole offer rows but never the header/label/row stack */
      var pv = document.getElementById("canswBPreview");
      var pvClips = !!pv && !pv.hidden &&
        !pv.classList.contains("cansw-b-preview-ghost") &&
        pv.scrollHeight - pv.clientHeight > 12;
      /* unlocked calculator: the card is fixed-height in every state
         (Avi 2026-08-03) and .cansw-budget (overflow hidden) absorbs any
         zoom overflow invisibly — measure it directly. The item list is a
         scroll container, so a long list never counts as a clip here; only
         the fixed header/totals/CTA overflowing does. */
      var bud = document.getElementById("canswBudget");
      var budClips = !!bud && bud.scrollHeight - bud.clientHeight > 12;
      if (a11yClips(result) || a11yLeftClips(leftEl) || pvClips || budClips) {
        root.classList.add("cansw-a11y-grow");
        if (a11yRerender) a11yRerender(); /* room now — restore trimmed rows */
      }
    } finally { a11yBusy = false; }
  }
  var a11yQueued = false;
  function queueA11y() {
    if (a11yQueued) return;
    a11yQueued = true;
    (window.requestAnimationFrame || window.setTimeout)(function () {
      a11yQueued = false;
      a11ySync();
    });
  }
  window.addEventListener("resize", queueA11y);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueA11y);
  if (window.ResizeObserver) {
    /* text-only zoom and OS text scaling reflow without a window resize —
       watch an element whose height tracks the text metrics */
    new ResizeObserver(queueA11y).observe(titleEl);
  }
  queueA11y();

  CAT_NAMES.forEach(function (name) {
    var d = CATS[name];
    var o = document.createElement("button");
    o.className = "cansw-opt";
    o.setAttribute("role", "option");
    o.setAttribute("aria-selected", "false");
    o.innerHTML = "<span>" + name + "</span><span class='cansw-count'>" + d.partners.length + " partner" + (d.partners.length > 1 ? "s" : "") + "</span>";
    o.addEventListener("click", function () { select(name); });
    OPT_ELS[name] = o;
    menu.appendChild(o);
  });

  function toggle(open) {
    var isOpen = open !== undefined ? open : !picker.classList.contains("cansw-open");
    picker.classList.toggle("cansw-open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
  }
  btn.addEventListener("click", function () { toggle(); });
  document.addEventListener("click", function (e) {
    if (!picker.contains(e.target)) toggle(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggle(false);
  });

  function select(name) {
    var d = CATS[name];
    if (!d) return;
    CAT_NAMES.forEach(function (n) {
      OPT_ELS[n].setAttribute("aria-selected", String(n === name));
    });
    label.textContent = name;
    label.classList.remove("cansw-placeholder");
    toggle(false);

    document.getElementById("canswKicker").textContent = name + " · " + d.partners.length + " verified partner discount" + (d.partners.length > 1 ? "s" : "");

    var num = document.getElementById("canswNum");
    var sub = document.getElementById("canswSub");
    var earnNote = document.getElementById("canswEarnNote");
    var earnBlock = document.getElementById("canswEarnBlock");
    var isAffiliates = (name === "Affiliates");

    if (d.vals.length || d.ceil > 0) {
      /* highest deal value on any basis, never below a shown row; a
         commission-savings-only category (e.g. Gaming: Dorian) has no vals
         and collapses to the flat "Save up to" line */
      var lo = d.vals.length ? Math.min.apply(null, d.vals) : d.ceil;
      var hi = d.ceil;
      if (lo === hi) {
        num.textContent = "Save up to " + fmt(hi);
        sub.textContent = "in your first year as a member";
      } else {
        num.textContent = "Save " + fmt(lo) + " – " + fmt(hi);
        sub.textContent = (d.nvals === 1)
          ? "in your first year, depending on the plan you choose"
          : "in your first year, depending on the tools you pick";
      }
    } else if (isAffiliates) {
      num.textContent = "Earn 10% more";
      sub.textContent = "on the affiliate sales you're already making";
    } else {
      num.textContent = "Member-only discounts";
      sub.textContent = "with every partner in this category";
    }

    if (d.earners.length && !isAffiliates) {
      earnNote.innerHTML = "Plus <strong>commission discounts</strong> with " + d.earners.join(", ");
      earnNote.hidden = false;
    } else {
      earnNote.hidden = true;
    }

    earnBlock.hidden = !isAffiliates;
    root.querySelector(".cansw-locked").style.display = isAffiliates ? "none" : "flex";
    if (isAffiliates) updateEarn();

    var pills = document.getElementById("canswPills");
    pills.innerHTML = "";
    var hasTrophy = false;
    var MAX_PILLS = 8;
    d.partners.slice(0, MAX_PILLS).forEach(function (p) {
      var pill = document.createElement("span");
      pill.className = "cansw-pill";
      var initials = p.n.split(/[\s.\/]+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join("");
      pill.innerHTML = "<span class='cansw-mono'>" + initials + "</span>" + p.n + (p.t ? " <span class='cansw-trophy' title='Exclusive to CAN or the best discount this partner offers'>🏆</span>" : "");
      var logoUrl = LOGOS[p.n];
      if (logoUrl) {
        var mono = pill.firstChild;
        var img = document.createElement("img");
        img.className = "cansw-logo";
        img.alt = "";
        img.onerror = function () { img.remove(); mono.style.display = "grid"; };
        img.src = logoUrl;
        mono.style.display = "none";
        pill.insertBefore(img, mono);
      }
      if (p.t) hasTrophy = true;
      pills.appendChild(pill);
    });
    if (d.partners.length > MAX_PILLS) {
      var more = document.createElement("span");
      more.className = "cansw-more";
      more.textContent = "+" + (d.partners.length - MAX_PILLS) + " more";
      pills.appendChild(more);
    }
    document.getElementById("canswTrophyNote").hidden = !hasTrophy;

    result.classList.remove("cansw-show");
    void result.offsetWidth;
    result.classList.add("cansw-show");
    queueA11y();
  }

  var slider = document.getElementById("canswEarnSlider");
  function updateEarn() {
    var e = Number(slider.value);
    var member = Math.round(e * (1 + CFG.earnUplift));
    var extraYr = Math.round(e * CFG.earnUplift * 12);
    document.getElementById("canswEarnIn").textContent = fmt(e);
    document.getElementById("canswEarnOut").innerHTML =
      "You'd earn <strong>" + fmt(member) + "</strong>/mo instead of " + fmt(e) +
      " — an extra <strong>" + fmt(extraYr) + "</strong> a year";
  }
  slider.addEventListener("input", updateEarn);

  var dc = CFG.defaultCategory;
  if (!CATS[dc]) dc = CAT_NAMES[0];
  select(dc);

  var rotateTimer = null;
  var stopRotateFn = null;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (CFG.rotateMs > 0 && !reduceMotion) {
    var ROTATION = CAT_NAMES.filter(function (n) { return CATS[n].vals.length > 0; });
    var rIdx = ROTATION.indexOf(dc);
    rotateTimer = setInterval(function () {
      if (document.hidden) return;
      rIdx = (rIdx + 1) % ROTATION.length;
      select(ROTATION[rIdx]);
    }, CFG.rotateMs);
    var stopRotate = function () {
      if (rotateTimer) { clearInterval(rotateTimer); rotateTimer = null; }
    };
    root.addEventListener("click", stopRotate, true);
    root.addEventListener("touchstart", stopRotate, true);
    stopRotateFn = stopRotate;
  }

  /* ---- email capture (Avi 2026-08-11): replaces the purchase CTA on every
     surface. Valid email + checked consent -> capture fires, then the visitor
     goes to the purchase flow. No email / invalid email / unchecked box ->
     straight to the purchase flow, nothing submitted. joinUrl starting with
     "#" (co-brand pages) scrolls to the embedded checkout instead. ---- */
  var picksFn = function () { return ""; }; /* builder swaps in picksSummary */
  function fireCapture(email) {
    if (!CFG.captureUrl) return; /* no endpoint configured on this surface */
    try {
      var body, type;
      if (CFG.captureUrl.indexOf("/forms/") > -1) {
        /* Kajabi form endpoint: urlencoded fields; custom_5 = tag, custom_6 = page,
           custom_7 = consent, custom_8 = budget picks */
        body = "form_submission%5Bname%5D=Widget%20Visitor" +
          "&form_submission%5Bemail%5D=" + encodeURIComponent(email) +
          "&form_submission%5Bcustom_5%5D=" + encodeURIComponent(CFG.captureTag) +
          "&form_submission%5Bcustom_6%5D=" + encodeURIComponent(location.href) +
          "&form_submission%5Bcustom_7%5D=" + encodeURIComponent("opted in " + new Date().toISOString()) +
          "&form_submission%5Bcustom_8%5D=" + encodeURIComponent(picksFn());
        type = "application/x-www-form-urlencoded";
      } else {
        /* generic webhook: JSON body as text/plain (simple type: no CORS preflight) */
        body = JSON.stringify({
          email: email,
          source: "savings-widget",
          tag: CFG.captureTag,
          page: location.href,
          at: new Date().toISOString(),
          optin: "opted in " + new Date().toISOString(),
          picks: picksFn()
        });
        type = "text/plain";
      }
      fetch(CFG.captureUrl, {
        method: "POST",
        mode: "no-cors",
        credentials: "omit",
        headers: { "Content-Type": type },
        body: body
      }).catch(function () {});
    } catch (e) {}
  }
  function goPurchase() {
    if (CFG.unlinkCtas || !CFG.joinUrl) return;
    var href = CFG.joinUrl;
    if (href.charAt(0) === "#") {
      var t = null;
      try { t = document.querySelector(href); } catch (e) {}
      if (!t) t = document.getElementById(href.slice(1));
      if (t) { t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); return; }
      location.hash = href;
      return;
    }
    location.href = href;
  }
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  Array.prototype.forEach.call(root.querySelectorAll(".cansw-capture"), function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var emIn = form.querySelector("input[type=email]");
      var ckIn = form.querySelector("input[type=checkbox]");
      var v = ((emIn && emIn.value) || "").trim();
      if (EMAIL_RE.test(v) && ckIn && ckIn.checked) {
        try { localStorage.setItem("cansw_email", v); } catch (e) {}
        fireCapture(v);
      }
      goPurchase();
    });
  });

  /* ---- budget builder (CFG.builder) ----
     Always-on in-hero calculator: left = category dropdown (an "All
     categories" option is prepended) + company dropdown + fixed-height
     detail panel; right card = "Calculate your savings" empty state.
     Picks accumulate freely; the EMAIL GATE appears in the right card on
     the first Add and unlocking reveals the budget (items, totals, profit).
     Footprint is fixed on desktop: card 500px; the deal panel is a
     collapsible dropdown that appears when a company is picked. */
  if (CFG.builder) (function () {
    var cPicker = document.getElementById("canswCPicker");
    var cBtn = document.getElementById("canswCBtn");
    var cLabel = document.getElementById("canswCLabel");
    var cMenu = document.getElementById("canswCMenu");
    var detailEl = document.getElementById("canswBDetail");
    var detailScroll = document.getElementById("canswBDetailScroll");
    var detailFade = document.getElementById("canswBDetailFade");
    var detailToggle = document.getElementById("canswBDetailToggle");
    var detailTLabel = document.getElementById("canswBDetailTLabel");
    var budgetEl = document.getElementById("canswBudget");
    if (!cPicker || !budgetEl) return; /* stale markup on this surface; degrade to phase 1 */
    root.classList.add("cansw-mode-builder");
    root.classList.add("cansw-mode-open");
    var titleEl2 = document.getElementById("canswBTitle");
    var subEl = document.getElementById("canswBSub");
    var itemsEl = document.getElementById("canswBItems");
    var emptyEl = document.getElementById("canswBEmpty");
    var countEl = document.getElementById("canswBCount");
    var earnBox = document.getElementById("canswBEarnBox");
    var earnWho = document.getElementById("canswBEarnWho");
    var earnSlider = document.getElementById("canswBEarnSlider");
    var totalsEl = document.getElementById("canswBTotals");
    var previewEl = document.getElementById("canswBPreview");
    var headEl = budgetEl.querySelector(".cansw-b-budget-h");
    var TROPHY_TIP = "Exclusive to CAN or the best discount this partner offers";
    var PICK_COPY = "Pick the software, products, and services on the left that you need to build your business, and see how much you will save.";
    var YEAR_COPY = "Savings shown for your first year of membership. Add more discounts to increase your profit.";

    function isEarn(p) { return !!(p.earn || p.be); }
    var BP = PARTNERS.filter(function (p) { return (p.plans && p.plans.length) || isEarn(p); });
    var BY = {}; BP.forEach(function (p) { BY[p.n] = p; });
    var BCATS = {};
    BP.forEach(function (p) { p.c.forEach(function (c) { BCATS[c] = (BCATS[c] || 0) + 1; }); });
    var ALL = "All categories";
    var bCat = ALL;
    var CART = [];      /* [{n, plan}] in add order; earn partners use plan: -1 */
    var current = null; /* company name shown in the detail panel */
    /* EMAIL GATE REMOVED (Avi 2026-08-03): the first add opens the
       calculator directly — no email, no capture, on every surface. The
       gate/capture code below stays dormant for easy re-enable. Browse
       state is unchanged: visitors still see the preview card until they
       add a discount (do NOT init unlocked=true — that would replace the
       browse card with an empty calculator on first load). */
    var unlocked = false;

    if (typeof stopRotateFn === "function") stopRotateFn();

    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
    function fmtS(n) { return (n < 0 ? "−$" : "$") + Math.abs(n).toLocaleString("en-US"); }
    function initials(name) {
      return name.split(/[\s.\/]+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join("");
    }
    function planLabel(pl) {
      var s = pl.name;
      if (pl.price) s += " · $" + pl.price.toLocaleString("en-US") + (pl.per ? "/" + pl.per : "");
      return s;
    }
    function inCart(n) {
      for (var i = 0; i < CART.length; i++) if (CART[i].n === n) return i;
      return -1;
    }
    function logoNode(name, monoClass, logoClass) {
      var box = document.createElement("span");
      box.style.display = "inline-flex";
      box.style.flex = "none";
      var mono = document.createElement("span");
      mono.className = monoClass;
      mono.textContent = initials(name);
      box.appendChild(mono);
      var url = LOGOS[name];
      if (url) {
        var img = document.createElement("img");
        img.className = logoClass;
        img.alt = "";
        img.onerror = function () { img.remove(); mono.style.display = "grid"; };
        img.src = url;
        mono.style.display = "none";
        box.insertBefore(img, mono);
      }
      return box;
    }

    /* budget contents as one line, sent with every capture so the bridge can
       log picks against the email — "Fourthwall · Pro ($240); … | total $1,039" */
    function picksSummary() {
      var parts = [], save = 0;
      CART.forEach(function (e) {
        var p = BY[e.n];
        if (!p) return;
        if (isEarn(p)) { parts.push(p.n + " (better split)"); return; }
        var pl = p.plans[e.plan >= 0 ? e.plan : 0];
        save += pl.save;
        parts.push(p.n + (pl.name && pl.name !== "—" ? " · " + pl.name : "") + " (" + fmt(pl.save) + ")");
      });
      return parts.length ? parts.join("; ") + " | total " + fmt(save) : "";
    }
    picksFn = picksSummary; /* captures now carry the budget picks */

    /* re-send the capture (debounced) when an unlocked visitor edits their
       budget, so the newest Kajabi submission always carries the full picks
       list. The bridge keeps the latest submission per email. */
    var recapT = null;
    function scheduleRecapture() {
      /* re-enabled 2026-08-11 with the bottom-of-card capture: once a visitor
         has submitted an email, budget edits refresh their picks line */
      var em = "";
      try { em = localStorage.getItem("cansw_email") || ""; } catch (e) {}
      if (em.indexOf("@") < 0 || !CART.length) return;
      clearTimeout(recapT);
      recapT = setTimeout(function () { fireCapture(em); }, 2500);
    }

    /* ---- company dropdown ---- */
    function cToggle(open) {
      var isOpen = open !== undefined ? open : !cPicker.classList.contains("cansw-open");
      cPicker.classList.toggle("cansw-open", isOpen);
      cBtn.setAttribute("aria-expanded", String(isOpen));
    }
    /* the fused deal panel closes like a dropdown (Avi 2026-08-03): the
       button caret closes it when the menu isn't open, outside clicks close
       it on desktop (mobile's panel is in-flow — a stray tap collapsing it
       would jump the layout), Escape closes both. Card rows that open the
       panel (.cansw-b-top) are exempt from the outside-close, or the same
       click would shut what it just opened. */
    var detailUserClosed = false;
    function closeDetail() {
      detailUserClosed = true;
      detailEl.hidden = true;
      cPicker.classList.remove("cansw-fused");
    }
    cBtn.addEventListener("click", function () {
      if (cPicker.classList.contains("cansw-open")) { cToggle(false); return; }
      if (!detailEl.hidden) { closeDetail(); return; }
      cToggle(true);
    });
    document.addEventListener("click", function (e) {
      if (cPicker.contains(e.target)) return;
      /* a click on a control the re-render just detached (plan +, rebuilt
         menu option) reads as outside — it came from inside, leave it be */
      if (!document.documentElement.contains(e.target)) return;
      cToggle(false);
      if (!detailEl.hidden && window.matchMedia("(min-width: 901px)").matches &&
          !(e.target.closest && e.target.closest(".cansw-b-top"))) closeDetail();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { cToggle(false); if (!detailEl.hidden) closeDetail(); }
    });

    function companiesFor(cat) {
      var items = BP.filter(function (p) { return cat === ALL || p.c.indexOf(cat) > -1; });
      items.sort(function (a, b) { return a.n.toLowerCase() < b.n.toLowerCase() ? -1 : 1; });
      return items;
    }
    function hintFor(p) {
      if (isEarn(p)) return "Earn more";
      /* dealCeil, not max plan save — the picker hint must never disagree
         with the "Save up to" on the card rows (same partner showed $209
         here and $900 above; caught by /check 2026-08-04) */
      return "Save up to " + fmt(dealCeil(p)); /* always "up to" — mixed labels read as inconsistent (Avi) */
    }

    function refreshCompanyMenu(keepSelection) {
      cMenu.innerHTML = "";
      var lab = document.createElement("div");
      lab.className = "cansw-menu-label";
      /* trophy explainer lives HERE as a parenthetical (moved off the card, Avi) */
      lab.textContent = (bCat === ALL ? "All companies" : bCat) + " (🏆 = best discount anywhere)";
      cMenu.appendChild(lab);
      var items = companiesFor(bCat);
      items.forEach(function (p) {
        var o = document.createElement("button");
        o.className = "cansw-opt";
        o.type = "button";
        o.setAttribute("role", "option");
        o.setAttribute("aria-selected", String(current === p.n));
        var left = document.createElement("span");
        left.className = "cansw-opt-left";
        left.appendChild(logoNode(p.n, "cansw-opt-mono", "cansw-opt-logo"));
        var nm = document.createElement("span");
        nm.textContent = p.n;
        left.appendChild(nm);
        if (p.t) {
          var t = document.createElement("span");
          t.className = "cansw-trophy";
          t.title = TROPHY_TIP;
          t.textContent = "🏆";
          left.appendChild(t);
        }
        var right = document.createElement("span");
        right.className = "cansw-count";
        right.textContent = hintFor(p);
        o.appendChild(left);
        o.appendChild(right);
        o.addEventListener("click", function () { selectCompany(p); });
        cMenu.appendChild(o);
      });
      if (!keepSelection || !current || !items.some(function (p) { return p.n === current; })) {
        current = null;
        cLabel.textContent = "Pick a company";
        cLabel.classList.add("cansw-placeholder");
        renderDetail();
      }
    }

    function selectCompany(p) {
      current = p.n;
      cLabel.textContent = p.n;
      cLabel.classList.remove("cansw-placeholder");
      cToggle(false);
      detailUserClosed = false; /* an explicit pick always reopens the panel */
      renderDetail();
      /* next action = hit + on a plan in the deal panel */
      scrollToNext(document.getElementById("canswBDetail"));
    }

    /* ---- deal panel: dropdown-style box that appears once a company is
       picked (hidden otherwise, collapsible via its header). Header = logo +
       the deal line; body = desc + plan rows, each with its own + button.
       Hitting + on another plan of an added partner switches the plan. ---- */
    function setDetailOpen(open) {
      detailEl.classList.toggle("cansw-bdetail-closed", !open);
      if (detailToggle) detailToggle.setAttribute("aria-expanded", String(open));
      if (open) updateDetailFade();
    }
    function planRow(p, pl, planIdx, nameHtml) {
      var row = document.createElement("div");
      row.className = "cansw-b-plan";
      var ci = inCart(p.n);
      var added = ci > -1 && (planIdx === -1 || CART[ci].plan === planIdx);
      if (added) row.className += " cansw-b-plan-added";
      var nmS = document.createElement("span");
      nmS.className = "cansw-b-plan-name";
      nmS.innerHTML = nameHtml;
      row.appendChild(nmS);
      if (pl) {
        var sv = document.createElement("span");
        sv.className = "cansw-b-plan-save";
        sv.textContent = "Save " + fmt(pl.save);
        row.appendChild(sv);
      }
      var btn = document.createElement("button");
      btn.className = "cansw-b-plus";
      btn.type = "button";
      if (added) {
        btn.textContent = "✓";
        btn.disabled = true;
        btn.setAttribute("aria-label", p.n + " added");
      } else {
        btn.textContent = "+";
        btn.setAttribute("aria-label", "Add " + p.n + (pl && pl.name && pl.name !== "—" ? " " + pl.name : ""));
        btn.addEventListener("click", function () {
          var i = inCart(p.n);
          if (i > -1) { CART[i].plan = planIdx; render(); renderDetail(); scheduleRecapture(); scrollToNext(document.getElementById("canswResult")); }
          else addPartner(p, planIdx);
        });
      }
      row.appendChild(btn);
      return row;
    }
    function renderDetail() {
      var p = current && BY[current];
      if (!p || detailUserClosed) { detailEl.hidden = true; cPicker.classList.remove("cansw-fused"); return; }
      detailTLabel.innerHTML = "";
      detailTLabel.appendChild(logoNode(p.n, "cansw-opt-mono", "cansw-opt-logo"));
      var dt = document.createElement("span");
      dt.textContent = p.deal || (isEarn(p) ? "Commission discount" : "Member-only discount");
      detailTLabel.appendChild(dt);
      if (p.t) {
        var tr = document.createElement("span");
        tr.className = "cansw-trophy";
        tr.title = TROPHY_TIP;
        tr.textContent = "🏆";
        detailTLabel.appendChild(tr);
      }
      /* plan rows FIRST — the + button is the main interaction; desc after */
      var host = detailScroll;
      host.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "cansw-b-plans";
      if (isEarn(p)) {
        wrap.appendChild(planRow(p, null, -1, SAVE_CEILS[p.n]
          ? "<span class='cansw-b-plan-save'>Save up to " + fmt(SAVE_CEILS[p.n]) + "</span> on commission"
          : "<span class='cansw-b-plan-save'>Earn 10% more</span> on your current sales"));
      } else if (p.plans.length > 1) {
        p.plans.forEach(function (pl, i) {
          wrap.appendChild(planRow(p, pl, i, esc(pl.name) + (pl.price ? " <span class='cansw-b-plan-price'>$" + pl.price.toLocaleString("en-US") + (pl.per ? "/" + pl.per : "") + "</span>" : "")));
        });
      } else {
        var pl0 = p.plans[0];
        wrap.appendChild(planRow(p, pl0, 0, (pl0.name && pl0.name !== "—") ? esc(planLabel(pl0)) : "First-year savings"));
      }
      host.appendChild(wrap);
      if (isEarn(p)) {
        var note = document.createElement("p");
        note.className = "cansw-b-desc";
        note.style.margin = "10px 0 0";
        note.innerHTML = "Members earn more on the sales they already make through a <strong>commission discount</strong> — the partner takes a smaller cut of each sale. Add it and set your current earnings on the slider to factor it in.";
        host.appendChild(note);
      }
      if (p.desc) {
        var ds = document.createElement("p");
        ds.className = "cansw-b-desc";
        ds.style.margin = "10px 0 0";
        ds.textContent = p.desc;
        host.appendChild(ds);
      }
      detailEl.hidden = false;
      cPicker.classList.add("cansw-fused");
      setDetailOpen(true);
    }

    function updateDetailFade() {
      if (!detailScroll || !detailFade) return;
      var over = detailScroll.scrollHeight - detailScroll.clientHeight;
      detailFade.hidden = !(over > 12 && detailScroll.scrollTop < over - 12);
    }

    /* mobile (stacked) layout: after every action, scroll the NEXT action
       into view — no matter how many discounts are in the calculator (Avi
       2026-08-04). Adds/plan-switches show the calculator; add-rows show
       the pickers; company picks show the deal panel. Desktop (side-by-side)
       never scrolls. */
    function scrollToNext(el) {
      if (!el) return;
      try {
        if (!window.matchMedia("(max-width: 900px)").matches) return;
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        /* throttled tabs freeze smooth scrolling — verify and jump if needed */
        setTimeout(function () {
          var g = el.getBoundingClientRect();
          if (g.top > window.innerHeight || g.bottom < 0) el.scrollIntoView({ block: "center" });
        }, 700);
      } catch (e) {}
    }

    /* ---- budget card states: empty / gate / unlocked ---- */
    function addPartner(p, planIdx) {
      if (inCart(p.n) > -1) return;
      CART.push({ n: p.n, plan: planIdx });
      unlocked = true; /* first add opens the calculator — email gate removed (Avi 2026-08-03) */
      render();
      renderDetail();
      scheduleRecapture();
      scrollToNext(document.getElementById("canswResult"));
    }
    function removePartner(n) {
      var i = inCart(n);
      if (i > -1) CART.splice(i, 1);
      render();
      scheduleRecapture();
      if (current === n) renderDetail();
    }

    function render() {
      var n = CART.length;
      /* fixed footprint in EVERY state (Avi 2026-08-03): the item list scrolls
         instead of growing the card; b-live now only marks the unlocked card
         so the a11y-grow zoom override can relax it */
      document.getElementById("canswResult").classList.toggle("cansw-b-live", unlocked);
      if (!unlocked) {
        /* browse state: category preview top-aligned, email capture pinned
           at the bottom (the capture replaced the purchase CTA, Avi 2026-08-11) */
        emptyEl.hidden = true;
        itemsEl.hidden = true;
        earnBox.hidden = true;
        totalsEl.hidden = true;
        headEl.hidden = true;
        countEl.textContent = "";
        subEl.hidden = true;
        previewEl.hidden = false;
        renderPreview();
        return;
      }
      headEl.hidden = false;
      titleEl2.textContent = "Your savings calculator";
      countEl.textContent = n ? n + " added" : "";
      subEl.textContent = n ? YEAR_COPY : PICK_COPY;
      subEl.hidden = false;
      previewEl.hidden = true;
      emptyEl.hidden = true; /* dashed add-rows carry the empty state */
      itemsEl.hidden = false;
      renderItems();
    }
    /* every state change re-measures the fixed footprint (zoom/large text) */
    var renderBase = render;
    render = function () { renderBase(); queueA11y(); };
    a11yRerender = function () {
      if (!previewEl.hidden && !previewEl.classList.contains("cansw-b-preview-ghost")) renderPreview();
    };

    /* empty-state preview: live savings range + logo pills for the active category */
    var fontsRefit = false;
    function renderPreview() {
      /* Kajabi pages swap Open Sans in after first paint — without a
         remeasure the fit pass trims against fallback-font layout and the
         last offer row ends up clipped */
      if (!fontsRefit && document.fonts && document.fonts.ready) {
        fontsRefit = true;
        document.fonts.ready.then(function () {
          if (!previewEl.hidden && !previewEl.classList.contains("cansw-b-preview-ghost")) renderPreview();
        });
      }
      previewEl.classList.remove("cansw-b-preview-ghost");
      previewEl.innerHTML = "";
      /* header + stack lines REMOVED (Avi 2026-08-11): the rows already say
         "Save up to $X" per company, and two dashed add-rows imply stacking */
      var names;
      if (bCat === ALL || !CATS[bCat]) {
        names = BP.map(function (p) { return { n: p.n, t: !!p.t }; });
      } else {
        names = CATS[bCat].partners;
      }
      /* top deals for this view: 3 biggest savers, clickable straight into
         the picker. Pills removed (Avi 2026-07-24: redundant next to this
         list); the +N chip moved BELOW the list and counts the rest of the
         view. Trophies ride on the rows so the legend keeps its referent. */
      var viewPool = BP.filter(function (pp) { return bCat === ALL || pp.c.indexOf(bCat) > -1; });
      /* row value = the partner's deal ceiling (same basis as the header);
         null = uncapped earn partner, which ranks last as "Earn 10% more" */
      function rowVal(pp) {
        var v = dealCeil(pp);
        return v > 0 ? v : null;
      }
      function isEarnRow(pp) { return isEarn(pp) && !(pp.plans && pp.plans.length); }
      function offerRow(r, onPick) {
        var row = document.createElement("button");
        row.className = "cansw-b-top";
        row.type = "button";
        row.appendChild(logoNode(r.p.n, "cansw-mono", "cansw-logo"));
        var nm2 = document.createElement("span");
        nm2.className = "cansw-b-top-name";
        nm2.textContent = r.p.n;
        if (r.p.t) {
          var tt = document.createElement("span");
          tt.className = "cansw-trophy";
          tt.title = TROPHY_TIP;
          tt.textContent = " 🏆";
          nm2.appendChild(tt);
        }
        row.appendChild(nm2);
        var sv2 = document.createElement("span");
        sv2.className = "cansw-b-top-save";
        sv2.textContent = r.mx === null ? "Earn 10% more" : "Save up to " + fmt(r.mx); /* always "up to", always savings (Avi: everything is savings) */
        row.appendChild(sv2);
        row.addEventListener("click", onPick);
        return row;
      }
      var ranked = viewPool
        .map(function (pp) { return { p: pp, mx: rowVal(pp) }; })
        .filter(function (r) { return r.mx !== null; })
        .sort(function (a, b) { return b.mx - a.mx; })
        /* uncapped earn partners fill remaining slots so no category renders
           an empty card (Affiliates was blank: ShopYourLikes has no plans);
           capped earn deals (Dorian) rank ABOVE by their ceiling */
        .concat(viewPool
          .filter(function (pp) { return isEarnRow(pp) && rowVal(pp) === null; })
          .map(function (pp) { return { p: pp, mx: null }; }))
        .slice(0, 3); /* three companies (Avi 2026-08-11) */
      var tops = null, moreN = 0, moreEl = null;
      if (ranked.length) {
        tops = document.createElement("div");
        tops.className = "cansw-b-tops";
        var tl = document.createElement("p");
        tl.className = "cansw-b-tops-label";
        tl.textContent = (bCat === ALL || !CATS[bCat]) ? "Top discounts" : "Top " + bCat + " discounts";
        tops.appendChild(tl);
        ranked.forEach(function (r) {
          tops.appendChild(offerRow(r, function () {
            selectCompany(r.p);
            refreshCompanyMenu(true);
          }));
        });
        previewEl.appendChild(tops);
        moreN = names.length - ranked.length;
        if (moreN > 0) {
          moreEl = document.createElement("p");
          moreEl.className = "cansw-b-more";
          moreEl.textContent = "+" + moreN + " more " + (bCat !== ALL ? bCat + " " : "") + "member discounts";
          previewEl.appendChild(moreEl);
        }
      }

      /* TWO dashed "+ Add a discount" rows on every view (Avi 2026-08-11:
         three companies + two add rows — seeing two implies discounts stack,
         which made the old stack line redundant). Click opens the company
         menu, same as the post-unlock rows. The fit pass trades top rows
         for the last add row in busy views so at least one stays visible. */
      var addBlock = null;
      if (true) {
        addBlock = document.createElement("div");
        addBlock.className = "cansw-b-tops cansw-b-addrows";
        for (var awi = 0; awi < 2; awi++) {
          var arow = document.createElement("button");
          arow.type = "button";
          arow.className = "cansw-b-addrow";
          arow.innerHTML = "<span class='cansw-b-addrow-plus' aria-hidden='true'>+</span><span>Add a discount</span>";
          arow.addEventListener("click", function (ev) {
            ev.stopPropagation();
            var cb2 = document.getElementById("canswCBtn");
            scrollToNext(cb2); /* next action = pick a company on the left */
            cToggle(true); /* open the menu directly — cb2.click() would close an open deal panel instead */
          });
          addBlock.appendChild(arow);
        }
        previewEl.appendChild(addBlock);
      }

      /* safety fit pass: prune extra add rows first (down to ONE — never
         zero), then trade top rows for that last add row so it stays
         visible in busy views (+N count kept honest), then top rows for
         the box edge as before — a half row never shows. No-op when the
         box has no layout. */
      var clipEdge = function () { return previewEl.getBoundingClientRect().bottom; };
      var clippedRow = function (el) { return el.getBoundingClientRect().bottom > clipEdge() + 0.5; };
      if (addBlock) {
        var addRows = addBlock.querySelectorAll(".cansw-b-addrow");
        for (var qi = addRows.length - 1; qi >= 1 && clippedRow(addRows[qi]); qi--) {
          addBlock.removeChild(addRows[qi]);
        }
        var lastAdd = addBlock.querySelector(".cansw-b-addrow");
        if (tops && lastAdd) {
          var tradeRows = tops.querySelectorAll(".cansw-b-top");
          for (var ti = tradeRows.length - 1; ti > 0 && clippedRow(lastAdd); ti--) {
            tops.removeChild(tradeRows[ti]);
            moreN++;
            if (moreEl) moreEl.textContent = "+" + moreN + " more " + (bCat !== ALL ? bCat + " " : "") + "member discounts";
          }
        }
        if (!lastAdd || clippedRow(lastAdd)) {
          previewEl.removeChild(addBlock);
          addBlock = null;
        }
      }
      if (tops) {
        var rowEls = tops.querySelectorAll(".cansw-b-top");
        for (var ri = rowEls.length - 1; ri > 0 && clippedRow(rowEls[ri]); ri--) {
          tops.removeChild(rowEls[ri]);
          moreN++;
          if (moreEl) moreEl.textContent = "+" + moreN + " more " + (bCat !== ALL ? bCat + " " : "") + "member discounts";
        }
      }
      lastPreviewW = previewEl.getBoundingClientRect().width;
    }

    /* the fit pass trims against whatever width the box has at render time —
       if that moment's layout was transient (mid-load, pane resize), the
       pruned DOM would stick. Re-render whenever the box's width actually
       changes. */
    var lastPreviewW = 0;
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (previewEl.hidden || previewEl.classList.contains("cansw-b-preview-ghost")) return;
        if (Math.abs(previewEl.getBoundingClientRect().width - lastPreviewW) > 1) renderPreview();
      }).observe(previewEl);
    } else {
      window.addEventListener("resize", function () {
        if (previewEl.hidden || previewEl.classList.contains("cansw-b-preview-ghost")) return;
        if (Math.abs(previewEl.getBoundingClientRect().width - lastPreviewW) > 1) renderPreview();
      });
    }

    function renderItems() {
      itemsEl.innerHTML = "";
      /* "You save" header over the savings column so the numbers read as
         savings at a glance (Avi 2026-08-03) */
      if (CART.length) {
        var ih = document.createElement("div");
        ih.className = "cansw-b-items-head";
        ih.innerHTML = "<span>Your discounts</span><span>You save</span>";
        itemsEl.appendChild(ih);
      }
      CART.forEach(function (entry) {
        var p = BY[entry.n];
        var it = document.createElement("div");
        it.className = "cansw-b-item";
        var info = document.createElement("div");
        info.className = "cansw-b-item-info";
        var nm = document.createElement("p");
        nm.className = "cansw-b-item-name";
        nm.textContent = p.n;
        info.appendChild(nm);
        var sv = document.createElement("span");
        sv.className = "cansw-b-item-save";
        if (isEarn(p)) {
          var note = document.createElement("p");
          note.className = "cansw-b-item-note";
          note.textContent = "Commission discount";
          info.appendChild(note);
          sv.textContent = "+10%";
        } else if (p.plans.length > 1) {
          var sel = document.createElement("select");
          sel.className = "cansw-b-item-plansel";
          sel.setAttribute("aria-label", p.n + " plan");
          p.plans.forEach(function (pl, i) {
            var o = document.createElement("option");
            o.value = i;
            o.textContent = planLabel(pl);
            if (i === entry.plan) o.selected = true;
            sel.appendChild(o);
          });
          sel.addEventListener("change", function () {
            entry.plan = Number(sel.value);
            render();
            scheduleRecapture();
          });
          info.appendChild(sel);
          sv.textContent = fmt(p.plans[entry.plan].save);
        } else {
          if (p.plans[0].name && p.plans[0].name !== "—") {
            var pn = document.createElement("p");
            pn.className = "cansw-b-item-note";
            pn.textContent = planLabel(p.plans[0]);
            info.appendChild(pn);
          }
          sv.textContent = fmt(p.plans[0].save);
        }
        var x = document.createElement("button");
        x.className = "cansw-b-x";
        x.type = "button";
        x.innerHTML = "&times;";
        x.setAttribute("aria-label", "Remove " + p.n);
        x.addEventListener("click", function () { removePartner(p.n); });
        it.appendChild(info); it.appendChild(sv); it.appendChild(x);
        itemsEl.appendChild(it);
      });
      /* dashed "Add a discount" placeholder rows (Avi 2026-07-28): fill the
         post-unlock empty state and always trail the added items so the stack
         reads as expandable. Click opens the company picker. */
      var addN = CART.length === 0 ? 3 : (CART.length === 1 ? 2 : 1);
      for (var gi = 0; gi < addN; gi++) {
        var ar = document.createElement("button");
        ar.type = "button";
        ar.className = "cansw-b-addrow";
        ar.innerHTML = "<span class='cansw-b-addrow-plus' aria-hidden='true'>+</span><span>Add a discount</span>";
        ar.addEventListener("click", function (ev) {
          ev.stopPropagation();
          var cb2 = document.getElementById("canswCBtn");
          scrollToNext(cb2); /* next action = pick a company on the left */
          cToggle(true); /* open the menu directly — cb2.click() would close an open deal panel instead */
        });
        itemsEl.appendChild(ar);
      }
      var earners = CART.filter(function (e) { return isEarn(BY[e.n]); });
      earnBox.hidden = earners.length === 0;
      if (earners.length) {
        earnWho.textContent = "Members earn 10% more on the same sales through " +
          (earners.length > 1 ? "commission discounts with " : "a commission discount with ") +
          earners.map(function (e) { return e.n; }).join(", ") + ".";
      }
      updateTotals();
    }

    function updateTotals() {
      var save = 0, hasEarn = false;
      CART.forEach(function (e) {
        var p = BY[e.n];
        if (isEarn(p)) { hasEarn = true; }
        else { save += p.plans[e.plan >= 0 ? e.plan : 0].save; }
      });
      var e0 = Number(earnSlider.value);
      var extraYr = Math.round(e0 * CFG.earnUplift * 12);
      document.getElementById("canswBEarnIn").textContent = fmt(e0);
      document.getElementById("canswBEarnOut").innerHTML =
        "You'd earn <strong>" + fmt(Math.round(e0 * (1 + CFG.earnUplift))) + "</strong>/mo instead of " + fmt(e0) +
        " — an extra <strong>" + fmt(extraYr) + "</strong> a year";
      var earnYr = hasEarn ? extraYr : 0;
      totalsEl.hidden = CART.length === 0;
      document.getElementById("canswBSave").textContent = fmtS(save);
      document.getElementById("canswBEarnRow").hidden = !hasEarn;
      document.getElementById("canswBEarnVal").textContent = "+" + fmt(earnYr);
      document.getElementById("canswBCost").textContent = "−" + fmt(CFG.membershipCost);
      document.getElementById("canswBProfit").textContent = fmtS(save + earnYr - CFG.membershipCost);
    }

    /* ---- category picker does double duty as the builder filter ---- */
    var allOpt = document.createElement("button");
    allOpt.className = "cansw-opt";
    allOpt.type = "button";
    allOpt.setAttribute("role", "option");
    allOpt.setAttribute("aria-selected", "false");
    allOpt.innerHTML = "<span>" + ALL + "</span><span class='cansw-count'>" + BP.length + " companies</span>";
    allOpt.addEventListener("click", function () {
      CAT_NAMES.forEach(function (n) { OPT_ELS[n].setAttribute("aria-selected", "false"); });
      allOpt.setAttribute("aria-selected", "true");
      label.textContent = ALL;
      label.classList.remove("cansw-placeholder");
      toggle(false);
      bCat = ALL;
      refreshCompanyMenu(true);
      render();
    });
    menu.insertBefore(allOpt, menu.querySelector(".cansw-opt"));
    /* categories with no builder partners (no plans, no earn — e.g. Hiring)
       would give an empty company picker and an empty card; hide them */
    CAT_NAMES.forEach(function (n) { if (!BCATS[n]) OPT_ELS[n].hidden = true; });

    var origSelect = select;
    select = function (name) {
      origSelect(name);
      allOpt.setAttribute("aria-selected", "false");
      bCat = name;
      refreshCompanyMenu(true);
      render();
    };

    earnSlider.addEventListener("input", updateTotals);
    if (detailScroll) detailScroll.addEventListener("scroll", updateDetailFade);
    var detailMore = document.getElementById("canswBDetailMore");
    if (detailMore) detailMore.addEventListener("click", function () {
      detailScroll.scrollBy({ top: Math.max(80, detailScroll.clientHeight - 48), behavior: reduceMotion ? "auto" : "smooth" });
    });
    if (detailToggle) detailToggle.addEventListener("click", function () {
      setDetailOpen(detailEl.classList.contains("cansw-bdetail-closed"));
    });

    /* ---- init ---- */
    cPicker.hidden = false;
    /* deal panel stays hidden until a company is picked */
    /* builder opens on All categories; a page can preselect one via
       CANSW_OVERRIDES.builderCategory */
    if (CFG.builderCategory && BCATS[CFG.builderCategory]) {
      bCat = CFG.builderCategory;
      label.textContent = bCat;
      label.classList.remove("cansw-placeholder");
      if (OPT_ELS[bCat]) OPT_ELS[bCat].setAttribute("aria-selected", "true");
    } else {
      bCat = ALL;
      label.textContent = ALL;
      label.classList.remove("cansw-placeholder");
      allOpt.setAttribute("aria-selected", "true");
    }
    refreshCompanyMenu(false);
    /* co-brand pages open with the partner's top picks already in the
       calculator (CANSW_OVERRIDES.prefillPicks). LOWEST-tier, lowest-savings
       plan preselected (Avi 2026-08-03) — visitors trade up themselves. No
       capture fires; that still waits for a real visitor action. */
    if (CFG.prefillPicks && CFG.prefillPicks.length && !CART.length) {
      CFG.prefillPicks.forEach(function (n) {
        var p = BY[n];
        if (!p || inCart(p.n) > -1) return;
        var planIdx = -1;
        if (p.plans && p.plans.length) {
          planIdx = 0;
          for (var pi = 1; pi < p.plans.length; pi++) {
            if ((p.plans[pi].save || 0) < (p.plans[planIdx].save || 0)) planIdx = pi;
          }
        }
        CART.push({ n: p.n, plan: planIdx });
      });
      if (CART.length) unlocked = true;
    }
    /* co-brand pages open the EMPTY calculator (Avi 2026-08-03: prefill was
       a mistake) — the "Add a discount" rows invite the picks instead */
    if (CFG.openCalculator && !unlocked) unlocked = true;
    render();
  })();

  }

  /* data: cansw-data.json next to this script; baked fallback on any failure.
     numbers.json (optional) carries the AUTHORITATIVE headline figures —
     partner_count + total_value (+ total_value_exact for the left-card
     stat tile, Avi 2026-08-11) — written weekly by the can-deal-numbers
     cloud routine from the Notion OFFER TRACKING tracker, so the widget shows
     the same numbers as the rest of the site. Missing/!ok = widget falls back
     to figures computed from its own partner data; it must never block. */
  var base = SCRIPT.src.replace(/[^\/]*$/, "");
  var done = false;
  var useFallback = function () { if (!done) { done = true; init(FALLBACK); } };
  try {
    Promise.all([
      fetch(base + "cansw-data.json", { cache: "no-cache" })
        .then(function (r) { if (!r.ok) throw 0; return r.json(); }),
      fetch(base + "numbers.json", { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; })
    ]).then(function (res) {
        var d = res[0];
        if (res[1] && (res[1].partner_count || res[1].total_value)) NUMBERS = res[1];
        if (!done && d && d.partners && d.partners.length) { done = true; init(d); }
        else useFallback();
      })
      .catch(useFallback);
    setTimeout(useFallback, 4000);
  } catch (e) { useFallback(); }
})();
