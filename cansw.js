/* CAN savings widget - single-source bundle.
   Served via GitHub Pages; every CAN page loads this one file.
   Page-specific config via window.CANSW_OVERRIDES BEFORE the script tag:
   { defaultCategory, joinUrl, dealsUrl, rotateMs, headline, lede, unlinkCtas,
     cobrand: { mode: "photo"|"text"|"logo", image, name, title, headline, lede } }
   Partner data: cansw-data.json next to this file (baked fallback below).
   Built from can-savings-widget-horizontal.html - keep that file canonical
   for markup/CSS changes and rebuild via tools/build.py in the private repo. */
(function () {
  if (window.__canswLoaded) return; window.__canswLoaded = true;
  var SCRIPT = document.currentScript;
  var CSS = "\n  .cansw {\n    --cansw-teal: #2A6478;\n    --cansw-teal-dark: #1E4F5F;\n    --cansw-terra: #C17A5E;\n    --cansw-terra-dark: #9E614A;\n    --cansw-ink: #1A1F2C;\n    --cansw-charcoal: #374151;\n    --cansw-ground: #F0F4F8;\n    --cansw-card: #FFFFFF;\n    font-family: 'Open Sans', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;\n    background: var(--cansw-ground);\n    color: var(--cansw-charcoal);\n    padding: 56px 24px;\n    text-align: left;\n    box-sizing: border-box;\n  }\n  .cansw *, .cansw *::before, .cansw *::after { box-sizing: border-box; }\n\n  .cansw-cols {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);\n    gap: 48px;\n    max-width: 1080px;\n    margin: 0 auto;\n    align-items: center;\n  }\n\n  .cansw-title {\n    font-size: 44px; font-weight: 700; line-height: 1.12;\n    color: var(--cansw-ink); margin: 0 0 20px;\n  }\n  .cansw-lede {\n    font-size: 20px; line-height: 1.5;\n    margin: 0 0 32px; color: var(--cansw-charcoal);\n  }\n\n  .cansw-picker { position: relative; width: 100%; max-width: 420px; text-align: left; }\n  .cansw-picker-btn {\n    width: 100%;\n    display: flex; align-items: center; justify-content: space-between; gap: 16px;\n    background: var(--cansw-card);\n    border: 1px solid #D7DFE8;\n    border-radius: 4px;\n    padding: 14px 16px;\n    font-family: inherit; font-size: 16px; color: var(--cansw-charcoal);\n    cursor: pointer;\n    box-shadow: 0 1px 3px rgba(0,0,0,0.04);\n  }\n  .cansw-picker-btn:hover { border-color: var(--cansw-teal); }\n  .cansw-picker-btn:focus-visible, .cansw-opt:focus-visible, .cansw-cta:focus-visible,\n  .cansw input[type=range]:focus-visible { outline: 2px solid var(--cansw-teal); outline-offset: 2px; }\n  .cansw-placeholder { color: #8A94A3; }\n  .cansw-caret { flex: none; transition: transform 0.15s ease; color: var(--cansw-teal); }\n  .cansw-picker.cansw-open .cansw-caret { transform: rotate(180deg); }\n\n  .cansw-menu {\n    position: absolute; z-index: 50; top: calc(100% + 8px); left: 0; right: 0;\n    background: var(--cansw-card);\n    border: 1px solid #E5EAF0; border-radius: 4px;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.08);\n    max-height: 320px; overflow-y: auto;\n    padding: 8px;\n    display: none;\n  }\n  .cansw-picker.cansw-open .cansw-menu { display: block; }\n  .cansw-menu-label {\n    font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;\n    color: var(--cansw-teal); padding: 8px 8px 4px;\n  }\n  .cansw-opt {\n    width: 100%;\n    display: flex; justify-content: space-between; align-items: center; gap: 16px;\n    padding: 10px 8px;\n    border: 0; background: none; border-radius: 4px;\n    font-family: inherit; font-size: 15px; color: var(--cansw-charcoal);\n    cursor: pointer; text-align: left;\n  }\n  .cansw-opt:hover { background: var(--cansw-ground); }\n  .cansw-opt[aria-selected=\"true\"] { background: var(--cansw-ground); color: var(--cansw-ink); font-weight: 600; }\n  .cansw-count { font-size: 13px; color: #8A94A3; flex: none; }\n\n  .cansw-result {\n    width: 100%;\n    background: var(--cansw-card);\n    border-radius: 4px;\n    box-shadow: 0 1px 3px rgba(0,0,0,0.04);\n    padding: 32px 36px;\n    text-align: center;\n    height: 580px;\n    display: flex; flex-direction: column; justify-content: center;\n    overflow: hidden;\n  }\n  #canswContent { width: 100%; }\n  .cansw-result.cansw-show { animation: cansw-rise 0.25s ease; }\n  @keyframes cansw-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }\n  @media (prefers-reduced-motion: reduce) {\n    .cansw-result.cansw-show { animation: none; }\n    .cansw-caret { transition: none; }\n  }\n\n  .cansw-kicker {\n    font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;\n    color: var(--cansw-teal); margin: 0 0 8px;\n  }\n  .cansw-savings {\n    font-size: 44px; font-weight: 700; line-height: 1.1;\n    color: var(--cansw-teal);\n    font-variant-numeric: tabular-nums;\n    margin: 0 0 4px;\n  }\n  .cansw-savings-sub { font-size: 16px; color: var(--cansw-charcoal); margin: 0 0 8px; }\n  .cansw-earn-note { font-size: 15px; color: var(--cansw-charcoal); margin: 0 0 24px; }\n  .cansw-earn-note strong { color: var(--cansw-teal); }\n\n  .cansw-partners {\n    display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;\n    margin: 16px 0 20px;\n  }\n  .cansw-pill {\n    display: inline-flex; align-items: center; gap: 8px;\n    background: var(--cansw-ground);\n    border-radius: 4px;\n    padding: 6px 12px 6px 6px;\n    font-size: 14px; font-weight: 500; color: var(--cansw-ink);\n  }\n  .cansw-mono {\n    width: 24px; height: 24px; border-radius: 4px; flex: none;\n    background: rgba(42,100,120,0.12); color: var(--cansw-teal);\n    font-size: 12px; font-weight: 700;\n    display: grid; place-items: center;\n  }\n  .cansw-logo {\n    width: 24px; height: 24px; border-radius: 4px; flex: none;\n    object-fit: contain; background: #fff;\n  }\n  .cansw-more {\n    display: inline-flex; align-items: center;\n    background: var(--cansw-ground);\n    border-radius: 4px;\n    padding: 6px 12px;\n    font-size: 14px; font-weight: 600; color: #8A94A3;\n  }\n  .cansw-trophy { font-size: 13px; }\n  .cansw-trophy-note {\n    font-size: 13px; color: #8A94A3; margin: -8px 0 12px;\n  }\n  .cansw-locked {\n    display: flex; align-items: center; justify-content: center; gap: 8px;\n    font-size: 14px; color: #8A94A3; margin: 0 0 28px;\n  }\n\n  .cansw-earn {\n    background: var(--cansw-ground);\n    border-radius: 4px;\n    padding: 16px 20px;\n    margin: 0 0 16px;\n    text-align: left;\n  }\n  .cansw-earn-label { font-size: 14px; font-weight: 600; color: var(--cansw-ink); display: flex; justify-content: space-between; margin-bottom: 12px; }\n  .cansw-earn-label output { color: var(--cansw-teal); font-variant-numeric: tabular-nums; }\n  .cansw input[type=range] { width: 100%; margin: 0 0 16px; accent-color: var(--cansw-teal); }\n  .cansw-earn-result { font-size: 15px; color: var(--cansw-charcoal); margin: 0; line-height: 1.6; }\n  .cansw-earn-result strong {\n    font-size: 22px; font-weight: 700;\n    color: var(--cansw-teal); font-variant-numeric: tabular-nums;\n  }\n  .cansw-earn-fine { font-size: 12px; color: #8A94A3; margin: 8px 0 0; }\n\n  .cansw-cta {\n    display: inline-block;\n    background: var(--cansw-terra); color: #fff;\n    font-family: inherit; font-weight: 600; font-size: 16px;\n    padding: 16px 32px; border: 0; border-radius: 4px; cursor: pointer;\n    text-decoration: none;\n  }\n  .cansw-cta:hover { background: var(--cansw-terra-dark); color: #fff; }\n  .cansw-payoff { font-size: 14px; color: var(--cansw-charcoal); margin: 16px 0 0; }\n  .cansw-see-all { display: inline-block; margin-top: 12px; font-size: 14px; color: var(--cansw-teal); text-decoration: underline; text-underline-offset: 3px; }\n  .cansw-see-all:hover { color: var(--cansw-teal-dark); }\n\n  @media (max-width: 900px) {\n    .cansw { padding: 48px 16px; }\n    .cansw-cols { grid-template-columns: 1fr; gap: 32px; }\n    .cansw-left { text-align: center; }\n    .cansw-picker { margin: 0 auto; }\n    .cansw-title { font-size: 30px; }\n    .cansw-lede { font-size: 17px; }\n    .cansw-savings { font-size: 34px; }\n    .cansw-result { padding: 32px 20px 24px; height: auto; }\n  }\n\n  /* ---- budget builder (CFG.builder): always-on in-hero calculator.\n     Email gate lives INSIDE the right card and appears on first Add.\n     Type sized/colored per style guide v3.1 + WCAG AA (secondary text\n     #4B5563 on white, nothing under 13px). ---- */\n  .cansw-mode-open #canswContent { display: none; }\n  .cansw-mode-open .cansw-result { text-align: left; justify-content: flex-start; padding: 24px 28px; border: 1px solid #D7DFE8; }\n  .cansw-budget { display: none; }\n  .cansw-mode-open .cansw-budget { display: flex; flex-direction: column; flex: 1 1 auto; min-height: 0; overflow: hidden; }\n  .cansw-mode-open #canswBEarnOut { display: none; } /* totals row carries the number; keep the card compact */\n\n  .cansw-b-budget-h {\n    display: flex; justify-content: space-between; align-items: baseline; gap: 12px;\n    font-size: 22px; font-weight: 700; color: var(--cansw-ink); margin: 0 0 6px;\n  }\n  .cansw-b-count { font-size: 15px; font-weight: 600; color: var(--cansw-teal); flex: none; }\n  .cansw-b-budget-sub { font-size: 16px; line-height: 1.55; color: var(--cansw-charcoal); margin: 0 0 10px; }\n  .cansw-b-empty { font-size: 16px; color: #4B5563; margin: 8px 0; }\n\n  .cansw-gate { margin: 8px 0; }\n  .cansw-gate-copy { font-size: 17px; line-height: 1.5; font-weight: 600; color: var(--cansw-ink); margin: 0 0 12px; }\n  .cansw-gate-input {\n    display: block; width: 100%;\n    border: 1px solid #D7DFE8; border-radius: 4px;\n    padding: 13px 14px;\n    font-family: inherit; font-size: 16px; color: var(--cansw-ink); background: #fff;\n    margin: 0 0 8px;\n  }\n  .cansw-gate-input::placeholder { color: #6B7280; }\n  .cansw-gate-input:focus { outline: 2px solid var(--cansw-teal); outline-offset: 1px; border-color: var(--cansw-teal); }\n  .cansw-gate-btn { display: block; width: 100%; padding: 13px 24px; font-size: 16px; }\n  .cansw-gate-err { font-size: 14px; color: #9E614A; font-weight: 600; margin: 8px 0 0; }\n\n  .cansw-b-items { flex: 0 1 auto; max-height: 260px; overflow-y: auto; margin: 0 -8px; padding: 0 8px; }\n  .cansw-b-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid #EDF1F6; }\n  .cansw-b-item:first-child { border-top: 0; }\n  .cansw-b-item-info { flex: 1; min-width: 0; }\n  .cansw-b-item-name { font-size: 16px; font-weight: 600; color: var(--cansw-ink); margin: 0; }\n  .cansw-b-item-plansel {\n    width: 100%; max-width: 240px;\n    margin-top: 4px;\n    border: 1px solid #D7DFE8; border-radius: 4px;\n    padding: 4px 6px;\n    font-family: inherit; font-size: 14px; color: var(--cansw-charcoal); background: #fff;\n  }\n  .cansw-b-item-note { font-size: 14px; color: #4B5563; margin: 2px 0 0; }\n  .cansw-b-item-save { flex: none; font-size: 17px; font-weight: 700; color: var(--cansw-teal); font-variant-numeric: tabular-nums; }\n  .cansw-b-x {\n    flex: none; width: 28px; height: 28px;\n    border: 0; border-radius: 4px; background: none;\n    color: #4B5563; font-size: 18px; line-height: 1; cursor: pointer;\n  }\n  .cansw-b-x:hover { background: var(--cansw-ground); color: var(--cansw-ink); }\n  .cansw-b-earnbox { flex: none; margin: 8px 0 0; padding: 10px 14px; }\n  .cansw-b-earnbox .cansw-earn-label { margin-bottom: 8px; }\n  .cansw-b-earnbox input[type=range] { margin: 0 0 8px; }\n  .cansw-b-earnbox .cansw-earn-fine { font-size: 13px; color: #4B5563; }\n  .cansw-b-totals { flex: none; border-top: 1px solid #D7DFE8; margin-top: 10px; padding-top: 8px; }\n  .cansw-b-trow { display: flex; justify-content: space-between; gap: 12px; font-size: 15px; color: var(--cansw-charcoal); margin: 4px 0; }\n  .cansw-b-trow strong { color: var(--cansw-ink); font-variant-numeric: tabular-nums; }\n  .cansw-b-profit {\n    display: flex; justify-content: space-between; align-items: baseline; gap: 12px;\n    margin-top: 6px;\n    font-size: 18px; font-weight: 700; color: var(--cansw-ink);\n  }\n  .cansw-b-profit-num { font-size: 30px; color: var(--cansw-teal); font-variant-numeric: tabular-nums; }\n  .cansw-budget .cansw-cta { display: block; text-align: center; margin-top: 10px; padding: 13px 24px; }\n  .cansw-budget .cansw-cta[hidden] { display: none; }\n  .cansw-b-payoff { font-size: 14px; color: var(--cansw-charcoal); margin: 8px 0 0; text-align: center; }\n\n  /* builder mode: columns stretch to equal height — tops AND bottoms align.\n     The detail panel flexes to fill the left column; the card matches. */\n  .cansw-mode-open .cansw-cols { align-items: start; }\n  .cansw-mode-open .cansw-result.cansw-show { animation: none; } /* no re-entrance bounce while the budget card is persistent */\n  .cansw-mode-open .cansw-picker, .cansw-mode-open .cansw-bdetail { max-width: none; }\n  .cansw-mode-open .cansw-left { display: flex; flex-direction: column; height: 580px; }\n  .cansw-b-preview {\n    flex: 1 1 auto; min-height: 0;\n    display: flex; flex-direction: column; justify-content: center;\n    text-align: left; overflow: hidden;\n    margin: 8px 0;\n  }\n  .cansw-b-preview .cansw-partners { justify-content: flex-start; }\n  .cansw-b-preview[hidden] { display: none; }\n  .cansw-b-preview .cansw-savings { font-size: 38px; margin: 4px 0; }\n  .cansw-b-preview .cansw-partners { margin: 14px 0 0; justify-content: flex-start; }\n  .cansw-b-preview.cansw-b-preview-ghost { justify-content: flex-start; }\n  .cansw-b-ghosts { text-align: left; overflow-y: auto; min-height: 0; max-height: 100%; }\n  .cansw-b-ghosts .cansw-b-item > .cansw-mono,\n  .cansw-b-ghosts .cansw-b-item .cansw-logo { width: 28px; height: 28px; }\n  .cansw-b-ghosts .cansw-b-profit { border-top: 1px solid #D7DFE8; padding-top: 10px; margin-top: 4px; }\n  .cansw-bdetail-empty {\n    display: flex; align-items: center; justify-content: center;\n  }\n  .cansw-bdetail-placeholder { font-size: 16px; line-height: 1.55; color: #4B5563; margin: 0; text-align: center; max-width: 300px; }\n\n  /* company picker (second dropdown) + fixed-height detail panel, left column */\n  .cansw-cpicker { margin-top: 12px; }\n  .cansw-opt-left { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }\n  .cansw-opt-logo { width: 22px; height: 22px; border-radius: 4px; object-fit: contain; background: #fff; flex: none; }\n  .cansw-opt-mono {\n    width: 22px; height: 22px; border-radius: 4px; flex: none;\n    background: rgba(42,100,120,0.12); color: var(--cansw-teal);\n    font-size: 11px; font-weight: 700;\n    display: grid; place-items: center;\n  }\n  .cansw-menu-note { font-size: 13px; color: #4B5563; padding: 8px 8px 4px; border-top: 1px solid #EDF1F6; margin-top: 6px; }\n  .cansw-bdetail {\n    background: var(--cansw-card); border-radius: 4px;\n    border: 1px solid #D7DFE8;\n    box-shadow: 0 1px 3px rgba(0,0,0,0.04);\n    padding: 16px;\n    margin-top: 12px;\n    max-width: 420px;\n    flex: 1 1 0; height: auto; min-height: 160px; overflow-y: auto;\n    text-align: left;\n  }\n  .cansw-bdetail-placeholder { font-size: 16px; line-height: 1.55; color: #4B5563; margin: 0; }\n  .cansw-bdetail-head { display: flex; align-items: center; gap: 10px; margin: 0 0 6px; }\n  .cansw-bdetail-head .cansw-mono, .cansw-bdetail-head .cansw-logo { width: 28px; height: 28px; }\n  .cansw-bdetail-name { font-size: 17px; font-weight: 700; color: var(--cansw-ink); margin: 0; }\n  .cansw-b-deal { font-size: 15px; font-weight: 600; color: var(--cansw-teal); margin: 0 0 8px; }\n  .cansw-b-desc { font-size: 15px; line-height: 1.55; color: var(--cansw-charcoal); margin: 0 0 12px; }\n  .cansw-b-plans { display: flex; flex-direction: column; gap: 6px; margin: 0 0 12px; }\n  .cansw-b-plan {\n    display: flex; align-items: center; gap: 10px;\n    padding: 9px 12px;\n    background: var(--cansw-ground); border: 1px solid #D7DFE8; border-radius: 4px;\n    font-size: 15px; color: var(--cansw-ink); cursor: pointer;\n  }\n  .cansw-b-plan:hover { border-color: var(--cansw-teal); }\n  .cansw-b-plan input { accent-color: var(--cansw-teal); flex: none; margin: 0; }\n  .cansw-b-plan-name { flex: 1; min-width: 0; }\n  .cansw-b-plan-price { color: #4B5563; font-size: 14px; }\n  .cansw-b-plan-save { color: var(--cansw-teal); font-weight: 700; white-space: nowrap; font-variant-numeric: tabular-nums; }\n  .cansw-b-addbtn {\n    background: var(--cansw-teal); color: #fff;\n    font-family: inherit; font-weight: 600; font-size: 15px;\n    padding: 11px 20px; border: 0; border-radius: 4px; cursor: pointer;\n  }\n  .cansw-b-addbtn:hover { background: var(--cansw-teal-dark); }\n  .cansw-b-addbtn[disabled] { background: #D7DFE8; color: #4B5563; cursor: default; }\n\n  /* builder-mode readability bumps for shared pieces */\n  .cansw-mode-open .cansw-count { font-size: 14px; color: #4B5563; }\n  .cansw-mode-open .cansw-menu-label { font-size: 13px; }\n\n  @media (max-width: 900px) {\n    .cansw-mode-open .cansw-left { display: block; text-align: left; }\n    .cansw-bdetail { flex: none; height: 260px; }\n    .cansw-mode-open .cansw-result { height: 580px; }\n    .cansw-mode-open .cansw-left { height: auto; }\n    .cansw-mode-open .cansw-picker { margin: 0; }\n  }\n\n  .cansw .cansw-cta, .cansw .cansw-cta:visited, .cansw .cansw-cta:hover { color: #fff !important; }\n  .cansw [hidden] { display: none !important; }\n  .cansw-cobrand{display:flex;align-items:center;gap:14px;margin:0 0 22px}\n  .cansw-cobrand-img{width:56px;height:56px;border-radius:16px;object-fit:cover;box-shadow:0 2px 6px rgba(0,0,0,.10);flex:none}\n  .cansw-cobrand-logo{height:44px;width:auto;max-width:170px;object-fit:contain;background:#fff;border-radius:8px;padding:6px 12px;box-shadow:0 1px 3px rgba(0,0,0,.06);flex:none}\n  .cansw-cobrand-name{font-size:16px;font-weight:700;color:var(--cansw-ink);margin:0;line-height:1.3}\n  .cansw-cobrand-title{font-size:13px;color:#8A94A3;margin:0;line-height:1.4}\n  .cansw-cobrand-with{font-size:12px;font-weight:600;color:var(--cansw-teal);letter-spacing:.5px;text-transform:uppercase;margin:0 0 2px}\n  .cansw-cobrand-x{font-size:15px;font-weight:700;color:var(--cansw-teal)}\n  .cansw-cobrand-canword{font-size:14px;font-weight:700;color:var(--cansw-teal);letter-spacing:.5px;text-transform:uppercase;line-height:1.2}\n  @media(max-width:900px){.cansw-cobrand{justify-content:center}}\n";
  var HTML = "<div class=\"cansw-cols\">\n  <div class=\"cansw-left\">\n    <h1 class=\"cansw-title\">Spend less on your Creator projects.</h1>\n    <p class=\"cansw-lede\">The best deals anywhere on <span id=\"canswNPartners\">35+</span> top Creator tools and services. Every partner deal covers the cost of your membership.</p>\n\n    <div class=\"cansw-picker\" id=\"canswPicker\">\n      <button class=\"cansw-picker-btn\" id=\"canswBtn\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n        <span class=\"cansw-placeholder\" id=\"canswLabel\">What are you working on?</span>\n        <svg class=\"cansw-caret\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\">\n          <path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>\n      </button>\n      <div class=\"cansw-menu\" role=\"listbox\" id=\"canswMenu\">\n        <div class=\"cansw-menu-label\">Choose a category</div>\n      </div>\n    </div>\n\n    <div class=\"cansw-picker cansw-cpicker\" id=\"canswCPicker\" hidden>\n      <button class=\"cansw-picker-btn\" id=\"canswCBtn\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n        <span class=\"cansw-placeholder\" id=\"canswCLabel\">Pick a company</span>\n        <svg class=\"cansw-caret\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\">\n          <path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>\n      </button>\n      <div class=\"cansw-menu\" role=\"listbox\" id=\"canswCMenu\"></div>\n    </div>\n\n    <div class=\"cansw-bdetail\" id=\"canswBDetail\" hidden></div>\n\n  </div>\n\n  <div class=\"cansw-right\">\n    <div class=\"cansw-result\" id=\"canswResult\" aria-live=\"polite\">\n      <div id=\"canswContent\">\n        <p class=\"cansw-kicker\" id=\"canswKicker\"></p>\n        <p class=\"cansw-savings\" id=\"canswNum\"></p>\n        <p class=\"cansw-savings-sub\" id=\"canswSub\"></p>\n        <p class=\"cansw-earn-note\" id=\"canswEarnNote\" hidden></p>\n\n        <div class=\"cansw-partners\" id=\"canswPills\"></div>\n\n        <p class=\"cansw-trophy-note\" id=\"canswTrophyNote\" hidden>&#127942; = Exclusive to CAN or the best deal this partner offers</p>\n\n        <p class=\"cansw-locked\">\n          <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n            <rect x=\"2.5\" y=\"6\" width=\"9\" height=\"6\" rx=\"1\" stroke=\"#8A94A3\" stroke-width=\"1.5\"/>\n            <path d=\"M4.5 6V4.5a2.5 2.5 0 015 0V6\" stroke=\"#8A94A3\" stroke-width=\"1.5\"/>\n          </svg>\n          Exact deal terms are revealed inside the membership\n        </p>\n\n        <div class=\"cansw-earn\" id=\"canswEarnBlock\" hidden>\n          <div class=\"cansw-earn-label\">\n            <span>Your monthly affiliate earnings today</span>\n            <output id=\"canswEarnIn\">$1,000</output>\n          </div>\n          <input type=\"range\" id=\"canswEarnSlider\" min=\"0\" max=\"10000\" step=\"100\" value=\"1000\" aria-label=\"Your monthly affiliate earnings in dollars\">\n          <p class=\"cansw-earn-result\" id=\"canswEarnOut\"></p>\n          <p class=\"cansw-earn-fine\">Members earn 10% more on the same sales through our partner's improved revenue split.</p>\n        </div>\n\n        <a class=\"cansw-cta\" id=\"canswCta\" href=\"#\">Unlock Access</a>\n        <p class=\"cansw-payoff\">CAN pays for itself the first time you use it.</p>\n        <a class=\"cansw-see-all\" id=\"canswSeeAll\" href=\"#\">See every partner deal</a>\n      </div>\n\n      <div class=\"cansw-budget\" id=\"canswBudget\">\n        <p class=\"cansw-b-budget-h\"><span id=\"canswBTitle\">Calculate your savings</span><span class=\"cansw-b-count\" id=\"canswBCount\"></span></p>\n        <p class=\"cansw-b-budget-sub\" id=\"canswBSub\">Pick the software, products, and services on the left that you need to build your business, and see how much you will save.</p>\n        <div class=\"cansw-b-preview\" id=\"canswBPreview\" hidden></div>\n        <form class=\"cansw-gate\" id=\"canswGate\" hidden novalidate>\n          <p class=\"cansw-gate-copy\">Enter your email to unlock your budget.</p>\n          <input class=\"cansw-gate-input\" id=\"canswGateEmail\" type=\"email\" placeholder=\"you@email.com\" autocomplete=\"email\" aria-label=\"Your email address\">\n          <button class=\"cansw-cta cansw-gate-btn\" type=\"submit\">Unlock</button>\n          <p class=\"cansw-gate-err\" id=\"canswGateErr\" hidden>Enter a valid email to unlock your budget.</p>\n        </form>\n        <p class=\"cansw-b-empty\" id=\"canswBEmpty\" hidden>Nothing here yet. Pick a company on the left and add it to your budget.</p>\n        <div class=\"cansw-b-items\" id=\"canswBItems\"></div>\n        <div class=\"cansw-earn cansw-b-earnbox\" id=\"canswBEarnBox\" hidden>\n          <div class=\"cansw-earn-label\">\n            <span>Your monthly earnings today</span>\n            <output id=\"canswBEarnIn\">$1,000</output>\n          </div>\n          <input type=\"range\" id=\"canswBEarnSlider\" min=\"0\" max=\"10000\" step=\"100\" value=\"1000\" aria-label=\"Your monthly earnings in dollars\">\n          <p class=\"cansw-earn-result\" id=\"canswBEarnOut\"></p>\n          <p class=\"cansw-earn-fine\" id=\"canswBEarnWho\">Members earn 10% more on the same sales through our partner's improved revenue split.</p>\n        </div>\n        <div class=\"cansw-b-totals\" id=\"canswBTotals\" hidden>\n          <div class=\"cansw-b-trow\"><span>Your first-year savings</span><strong id=\"canswBSave\">$0</strong></div>\n          <div class=\"cansw-b-trow\" id=\"canswBEarnRow\" hidden><span>Additional earnings</span><strong id=\"canswBEarnVal\">$0</strong></div>\n          <div class=\"cansw-b-trow\"><span>CAN membership</span><strong id=\"canswBCost\">&minus;$49</strong></div>\n          <div class=\"cansw-b-profit\"><span>Your profit</span><span class=\"cansw-b-profit-num\" id=\"canswBProfit\">$0</span></div>\n        </div>\n        <a class=\"cansw-cta\" id=\"canswBCta\" href=\"#\" hidden>Unlock Access</a>\n        <p class=\"cansw-b-payoff\" id=\"canswBPayoff\" hidden>CAN pays for itself the first time you use it.</p>\n      </div>\n    </div>\n  </div>\n</div>";
  var FALLBACK = {"generated": "2026-07-23", "partners": [{"n": "Fourthwall", "v": [50, 50], "t": true, "c": ["Merchandise", "Digital Products", "Memberships & Community", "Website & Bio Link", "Monetization"], "deal": "$50 in free product samples", "desc": "Merch platform where you design, sell, and ship products from a storefront that matches your brand.", "plans": [{"name": "—", "price": null, "save": 50}]}, {"n": "Creator Wizard", "v": [106, 106], "c": ["Education", "Brand Deals", "Resources"], "deal": "Free Sponsor Magnet eBook + 50% off the $10K Challenge", "desc": "Brand deal education from Justin Moore, whose Sponsor Magnet book covers what he taught in his $2,000 course.", "plans": [{"name": "—", "price": null, "save": 106}]}, {"n": "Creators Guild of America", "v": [99, 99], "t": true, "c": ["Brand Deals", "Resources"], "deal": "Free membership for 1 year", "desc": "Professional guild for Creators with an IMDb-style profile that proves to brands you're a pro.", "plans": [{"name": "Associate membership", "price": 99, "per": "yr", "save": 99}]}, {"n": "ShopYourLikes", "v": null, "earn": true, "t": true, "c": ["Affiliates", "Monetization"], "deal": "80/20 affiliate split, 10 points higher than standard", "desc": "Affiliate platform with 20,000+ major brands like Nike, Walmart, and Ulta, where members keep a bigger share of every sale."}, {"n": "Unbound Legal", "v": [896, 1646], "t": true, "c": ["Legal", "Business Infrastructure"], "deal": "15% off legal service packages", "desc": "Legal services from Chelsey Mori, one of the best-known attorneys in the Creator Economy.", "plans": [{"name": "15-hour package", "price": 5975, "save": 896}, {"name": "30-hour package", "price": 10975, "save": 1646}]}, {"n": "SendOwl", "v": [280, 1144], "t": true, "c": ["Digital Products", "Memberships & Community", "Monetization"], "deal": "40% off for 18 months", "desc": "Digital product and membership checkout that lets you sell through one link anywhere you post.", "plans": [{"name": "Launch", "price": 39, "per": "mo", "save": 280}, {"name": "Grow", "price": 87, "per": "mo", "save": 626}, {"name": "Scale", "price": 159, "per": "mo", "save": 1144}]}, {"n": "Nas.com", "v": [54, 500], "t": true, "c": ["Digital Products", "Courses", "Memberships & Community", "Coaching", "Monetization"], "deal": "50% off all plans for 1 year", "desc": "Membership and digital product platform from Nas Daily founder Nuseir Yassin, simple enough to launch a paid membership in five minutes.", "plans": [{"name": "Pro, annual", "price": 249, "per": "yr", "save": 125}, {"name": "Platinum, annual", "price": 799, "per": "yr", "save": 400}]}, {"n": "EssentL Creator", "v": [450, 450], "t": true, "c": ["Business Infrastructure", "Insurance", "Mental Health"], "deal": "50% off the service fee for 6 months", "desc": "Health insurance and HR benefits service that brings corporate-quality coverage to Creators, often below public marketplace rates.", "plans": [{"name": "—", "price": null, "save": 450}]}, {"n": "Boring Stuff", "v": [600, 600], "t": true, "c": ["Accounting", "Business Infrastructure"], "deal": "50% off your first 3 months", "desc": "Accounting firm for Creators co-founded by YouTuber Jon Youshaei and Airrack's manager Zack Honarvar.", "plans": [{"name": "—", "price": null, "save": 600}]}, {"n": "Kajabi", "v": [358, 358], "t": true, "c": ["Website & Bio Link", "Digital Products", "Courses", "Memberships & Community", "Coaching", "Monetization"], "deal": "Member-only deal on every paid plan", "desc": "Course, coaching, and membership platform where Creators have earned over $10 billion selling digital products.", "plans": [{"name": "Basic", "price": 179, "per": "mo", "save": 358}, {"name": "Growth", "price": 249, "per": "mo", "save": 498}, {"name": "Pro", "price": 499, "per": "mo", "save": 998}]}, {"n": "Slipstream", "v": [60, 60], "t": true, "c": ["Music", "Royalty-Free", "YouTube"], "deal": "50% off the annual Creator plan", "desc": "Royalty-free music library for Creators, the largest independent catalog you can use without copyright-strike risk.", "plans": [{"name": "Creator, annual", "price": 96, "per": "yr", "save": 60}]}, {"n": "beehiiv", "v": [129, 1212], "t": true, "c": ["Newsletter", "Website & Bio Link", "Digital Products", "Monetization"], "deal": "25% off paid plans for 1 year", "desc": "Newsletter platform built by former Morning Brew employees with design, website, growth, and monetization tools.", "plans": [{"name": "Scale, annual", "price": 517, "per": "yr", "save": 129}, {"name": "Max, annual", "price": 1151, "per": "yr", "save": 288}, {"name": "Larger lists (prices scale)", "price": null, "save": 1212}]}, {"n": "Elevate.io", "v": [30, 75], "t": true, "c": ["Video", "Editing"], "deal": "3 months free", "desc": "Collaborative video editing that works like a shared doc, so you and your editor skip the export-upload-download loop.", "plans": [{"name": "Creator", "price": 10, "per": "mo", "save": 30}, {"name": "Pro, annual", "price": 300, "per": "yr", "save": 75}]}, {"n": "Karat", "v": [250, 250], "t": true, "c": ["Banking", "Business Infrastructure"], "deal": "Cash bonuses worth up to $250", "desc": "Banking built for Creators, with a Premium plan that pays 1.75% interest on your checking account.", "plans": [{"name": "—", "price": null, "save": 250}]}, {"n": ".store", "v": [200, 200], "t": true, "c": ["Website & Bio Link", "Business Infrastructure"], "deal": "5 years of your .store domain free", "desc": "Domain for your shop that separates your commerce from your content, the same way MrBeast's merch store does.", "plans": [{"name": "—", "price": null, "save": 200}]}, {"n": "FYPM", "v": [416, 416], "t": true, "c": ["Brand Deals"], "deal": "50% off membership for life", "desc": "Brand deal intel database crowdsourced from Creators, so you can see what peers actually get paid before you negotiate.", "plans": [{"name": "Membership", "price": null, "save": 416}]}, {"n": "Pop.store", "v": [35, 717], "t": true, "c": ["Website & Bio Link", "Courses", "Digital Products", "Memberships & Community", "Coaching", "Automation", "AI", "Instagram", "Monetization"], "deal": "40% off annual plans for your first year", "desc": "Link-in-bio monetization platform with an affiliate network, digital products, community chat, and an AI fan assistant.", "plans": [{"name": "Creator, annual", "price": 144, "per": "yr", "save": 58}, {"name": "Expert, annual", "price": 948, "per": "yr", "save": 379}, {"name": "Pro, annual", "price": 1788, "per": "yr", "save": 717}]}, {"n": "Mercury", "v": [400, 400], "t": true, "c": ["Banking", "Business Infrastructure"], "deal": "Up to $400 in cash bonuses", "desc": "Business banking and credit cards used by thousands of startups and small businesses.", "plans": [{"name": "—", "price": null, "save": 400}]}, {"n": "Growth in Reverse", "v": [50, 50], "t": true, "c": ["Education", "Newsletter", "Growth"], "deal": "$50 off the Growth Vault", "desc": "Newsletter growth education from Chenell Basilio, whose Growth Vault compiles playbooks from hundreds of top newsletter teardowns.", "plans": [{"name": "Growth Vault", "price": 200, "save": 50}]}, {"n": "Wispr Flow", "v": [72, 90], "c": ["Productivity", "AI"], "deal": "6 months of Pro free", "desc": "AI dictation tool that types what you say in any app, so you can stop typing and start talking.", "plans": [{"name": "Pro, monthly", "price": 15, "per": "mo", "save": 90}, {"name": "Pro, annual", "price": 144, "per": "yr", "save": 72}]}, {"n": "Epidemic Sound", "v": [50, 50], "t": true, "c": ["Music", "Royalty-Free", "YouTube"], "deal": "50% off the annual Creator plan", "desc": "Royalty-free music library that is the biggest name in YouTube-safe soundtracks.", "plans": [{"name": "Creator, annual", "price": 120, "per": "yr", "save": 60}]}, {"n": "Teachable", "v": [248, 500], "t": true, "c": ["Digital Products", "Courses", "Memberships & Community", "Coaching", "Monetization"], "deal": "30% off annual Builder and Growth plans", "desc": "Course platform designed for experts and educators, with downloads, memberships, and coaching sold alongside.", "plans": [{"name": "Builder, annual", "price": 828, "per": "yr", "save": 248}, {"name": "Growth, annual", "price": 1668, "per": "yr", "save": 500}]}, {"n": "Hopp", "v": [36, 600], "t": true, "c": ["Website & Bio Link"], "deal": "30% off any plan, 50% off Grow", "desc": "Bio link builder from Wix for a link page that looks sharp and still converts.", "plans": [{"name": "Lite", "price": 10, "per": "mo", "save": 36}, {"name": "Brand", "price": 17, "per": "mo", "save": 61}, {"name": "Sell", "price": 30, "per": "mo", "save": 108}, {"name": "Grow", "price": 100, "per": "mo", "save": 600}]}, {"n": "ClearPath", "v": [1500, 1500], "t": true, "c": ["Accounting", "Business Infrastructure"], "deal": "25% off for 1 year", "desc": "Accounting service for Creators, and the firm our founder trusts with his own bookkeeping, invoicing, and taxes.", "plans": [{"name": "Tax services", "price": 450, "save": 113}, {"name": "Full service", "price": 500, "per": "mo", "save": 1500}]}, {"n": "Pierson Ferdinand", "v": [150, 150], "t": true, "c": ["Legal", "Business Infrastructure"]}, {"n": "Insense", "v": null, "c": ["Brand Deals", "UGC", "Monetization"], "deal": "Priority access to paid brand campaigns", "desc": "UGC marketplace where small-audience Creators land high-paying content campaigns from big brands.", "be": true}, {"n": "Mighty Networks", "v": [316, 1416], "t": true, "c": ["Memberships & Community", "Digital Products", "Courses", "Coaching", "Monetization"], "deal": "4 months free on annual plans", "desc": "Community platform built so members engage with each other, not just with you.", "plans": [{"name": "Launch, annual", "price": 950, "per": "yr", "save": 316}, {"name": "Scale, annual", "price": 2148, "per": "yr", "save": 716}, {"name": "Growth, annual", "price": 4250, "per": "yr", "save": 1416}]}, {"n": "CreatorCare", "v": null, "t": true, "c": ["Mental Health"]}, {"n": "Thematic", "v": [60, 60], "t": true, "c": ["Music", "Royalty-Free", "YouTube"], "deal": "75% off yearly Premium", "desc": "Music licensing service that lets you use real artists' songs on YouTube in exchange for a credit in your description.", "plans": [{"name": "Premium, annual", "price": 79, "per": "yr", "save": 59}]}, {"n": "Buy.Video", "v": [400, 1000], "t": true, "c": ["Video", "Digital Products", "Monetization"], "deal": "No platform fees on your first 2,500 sales", "desc": "Video commerce tool for selling videos as timed drops that expire after the window you set.", "plans": [{"name": "—", "price": null, "save": 400}]}, {"n": "Switcher Studios", "v": [200, 200], "t": true, "c": ["Livestreaming", "Video", "Monetization"], "deal": "Member-only annual deal", "desc": "Live video production platform for streaming, hosting, and monetizing with the gear you already own.", "plans": [{"name": "Annual plan", "price": null, "save": 200}]}, {"n": "CreatorScore", "v": [40, 160], "t": true, "c": ["Analytics", "Brand Deals"], "deal": "2 months free, then 50% off for life", "desc": "Content analytics that show how brand-safe your channels look to sponsors, so you can fix red flags before they cost you a deal.", "plans": [{"name": "Creator plan", "price": 20, "per": "mo", "save": 140}]}, {"n": "Ratelle Law", "v": [209, 209], "t": true, "c": ["Legal", "Business Infrastructure", "Resources"], "deal": "30% off the Creator Legal Bundle", "desc": "Legal templates and contracts for Creators from Creator attorney Brittany Ratelle, covering brand deals, contractors, and more.", "plans": [{"name": "Creator Legal Bundle", "price": 697, "save": 209}]}, {"n": "Dorian", "v": null, "earn": true, "t": true, "c": ["Gaming", "Monetization", "Platforms"], "deal": "100% revshare for your first 120 days", "desc": "Game platform that turns your story, comic, or world into a monetizable no-code game in days."}, {"n": "Revenews", "v": [1000, 1000], "t": true, "c": ["Newsletter", "Brand Deals", "Monetization"], "deal": "Setup fee waived + 5% off your first 3 months", "desc": "Ad sales service from the team that sold over $9M in sponsorships for newsletters like Finimize and The Daily Upside.", "plans": [{"name": "Ad Sales as a Service", "price": null, "save": 1405}]}, {"n": "DUPAY", "v": [60, 60], "t": true, "c": ["Brand Deals", "Legal", "Business Infrastructure", "Resources"], "deal": "2 months of Tools + Protection free", "desc": "Brand deal protection service with contracts, invoicing, and collections help if a brand won't pay.", "plans": [{"name": "Tools + Protection", "price": 29, "per": "mo", "save": 60}]}, {"n": "EditHers", "v": null, "c": ["Hiring", "Business Infrastructure"]}, {"n": "TopFan", "v": null, "earn": true, "t": true, "c": ["Website & Bio Link", "Platforms", "Digital Products", "Courses", "Memberships & Community", "Coaching", "Merchandise", "Monetization"], "deal": "87% revshare instead of the standard 85%", "desc": "Monetization platform that sells your courses, community, and merch through your own website and app for $0 upfront."}, {"n": "Valim", "v": [2000, 2000], "t": true, "c": ["Accounting", "Business Infrastructure"], "deal": "45% off all tax return filings", "desc": "Tax filing and advisory firm led by ex-Big 4 CPAs with year-round support and fast turnaround.", "plans": [{"name": "Individual return", "price": null, "save": 360}, {"name": "Business return", "price": null, "save": 450}]}], "logos": {"Fourthwall": "https://cdn.commoninja.com/asset/1f312bbf-eb47-41f5-890c-9d5e4e39b7fc.png", "Creator Wizard": "https://cdn.commoninja.com/asset/932da69e-34b0-475d-8018-cfbbf709c5f4.png", "Creators Guild of America": "https://cdn.commoninja.com/asset/e67d4f36-c7aa-4257-8a6d-71ac3a703128.png", "ShopYourLikes": "https://cdn.commoninja.com/asset/dcefc1df-a971-4315-a594-b32db8781973.png", "Unbound Legal": "https://cdn.commoninja.com/asset/f401d169-92e9-4a4e-bd9c-d4fc7535db9d.jpg", "SendOwl": "https://cdn.commoninja.com/asset/a9d50920-2603-4933-b6c3-00045721a847.png", "Nas.com": "https://cdn.commoninja.com/asset/60e809e6-0aa3-45e9-8cf4-9e029220b3be.png", "EssentL Creator": "https://cdn.commoninja.com/asset/3797119d-e8fb-414e-b0c4-37b6d4cb5eec.png", "Boring Stuff": "https://cdn.commoninja.com/asset/d762d97f-370c-4862-9ed0-d0434728eeb3.png", "Kajabi": "https://cdn.commoninja.com/asset/79542a92-4300-4f9c-bc34-29ba0410bad1.png", "Slipstream": "https://cdn.commoninja.com/asset/1d2418e0-b38b-4ae7-b1ca-7f318402e502.jpg", "beehiiv": "https://cdn.commoninja.com/asset/17226348-3ca7-4837-9a75-9f863e05dad5.png", "Elevate.io": "https://cdn.commoninja.com/asset/ee1380b1-42d6-4d93-9b3e-917333012589.png", "Karat": "https://cdn.commoninja.com/asset/1c8f0175-228c-4137-b063-47195ea7eb3b.png", ".store": "https://cdn.commoninja.com/asset/1096651c-a59f-42d0-b9a0-3edd16434ebb.png", "FYPM": "https://cdn.commoninja.com/asset/352db6dc-293b-4ceb-8f15-318cf84b75f4.png", "Pop.store": "https://cdn.commoninja.com/asset/7bbccbda-fa40-4b79-bfbe-f433a634bec9.png", "Mercury": "https://cdn.commoninja.com/asset/192714c1-3628-4441-b3bd-3876e687e3e5.png", "Growth in Reverse": "https://cdn.commoninja.com/asset/a037d267-cfc9-4099-bac8-5ce1303643a5.png", "Wispr Flow": "https://cdn.commoninja.com/asset/9fc7abfd-06f4-42b2-a037-72011fb19b3e.png", "Epidemic Sound": "https://cdn.commoninja.com/asset/d4a0ac81-8de7-4857-9b3c-43d803fa9871.png", "Teachable": "https://cdn.commoninja.com/asset/dbf2a3ca-a19d-44fe-a61e-3bff641ecc82.jpeg", "Hopp": "https://cdn.commoninja.com/asset/6a5383c0-7402-4feb-ac32-85e526a82f1f.png", "ClearPath": "https://cdn.commoninja.com/asset/4b70b4e5-e6d8-4918-a71c-14d3c3f89a00.png", "Pierson Ferdinand": "https://cdn.commoninja.com/asset/efa9dd93-4d6d-4012-84b2-9d8dc6518d6b.jpg", "Insense": "https://cdn.commoninja.com/asset/7b7f0900-39bb-4672-a3fe-34f11aa2eef7.png", "Mighty Networks": "https://cdn.commoninja.com/asset/6bf52e53-86fe-419e-ab33-876d79d287b0.png", "CreatorCare": "https://cdn.commoninja.com/asset/048ee7e9-3fbb-4589-aefe-5f76252c91b3.png", "Thematic": "https://cdn.commoninja.com/asset/f42e7860-717e-4a27-a3e8-2714a8152586.png", "Buy.Video": "https://cdn.commoninja.com/asset/ec692c8e-3ff5-4eb4-adee-196f3c05780f.png", "Switcher Studios": "https://cdn.commoninja.com/asset/a1e6cf0b-41ec-4827-a74d-ae528816170b.png", "CreatorScore": "https://cdn.commoninja.com/asset/6eebbca6-0b7e-4918-bc1b-32201328b1ce.png", "Ratelle Law": "https://cdn.commoninja.com/asset/ba8a0432-228d-49d3-8e0c-44c9d4f512cb.png", "Dorian": "https://cdn.commoninja.com/asset/1c1b028d-4f55-4989-b77f-8b6f1b1f8e3f.jpg", "Revenews": "https://cdn.commoninja.com/asset/bb2d8089-e680-4e49-be71-14063bee93d6.png", "DUPAY": "https://cdn.commoninja.com/asset/4ac8cbc0-639e-4d10-92ff-7066af0e1b2c.png", "EditHers": "https://cdn.commoninja.com/asset/a567569b-dc20-4ae4-9b65-82cea76487fb.png", "TopFan": "https://cdn.commoninja.com/asset/8fe364b7-4594-4c1a-8ca2-a1f8cb570965.png", "Valim": "https://cdn.commoninja.com/asset/64492f65-c809-48a0-8a4d-b1e4ee265ecc.png"}};

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

  function init(DATA) {

  /* ---- category index + render (single Unlock Access CTA design) ---- */
  var PARTNERS = DATA.partners, LOGOS = DATA.logos;
  var CATS = {};
  PARTNERS.forEach(function (p) {
    p.c.forEach(function (c) {
      if (!CATS[c]) CATS[c] = { partners: [], vals: [], earners: [], nvals: 0 };
      CATS[c].partners.push({ n: p.n, t: !!p.t });
      if (p.v !== null && p.v !== undefined) { CATS[c].vals.push(p.v[0]); CATS[c].vals.push(p.v[1]); CATS[c].nvals++; }
      if (p.earn) CATS[c].earners.push(p.n);
    });
  });
  var CAT_NAMES = Object.keys(CATS).sort();

  var nEl = document.getElementById("canswNPartners");
  if (nEl) nEl.textContent = PARTNERS.length;

  /* headline / lede / cobrand overrides */
  var titleEl = root.querySelector(".cansw-title");
  var ledeEl = root.querySelector(".cansw-lede");
  var cb = CFG.cobrand || null;
  var headline = (cb && cb.headline) || CFG.headline;
  var lede = (cb && cb.lede) || CFG.lede;
  if (headline) titleEl.textContent = headline;
  if (lede) ledeEl.textContent = lede;
  if (cb && (cb.name || cb.image)) {
    var w = document.createElement("div");
    w.className = "cansw-cobrand";
    if (cb.mode === "logo" && cb.image) {
      w.innerHTML = '<img class="cansw-cobrand-logo" src="' + cb.image + '" alt="' + (cb.name || "") + '"><span class="cansw-cobrand-x">&times;</span><span class="cansw-cobrand-canword">Creator<br>Access<br>Network</span>';
    } else {
      var img = (cb.image && cb.mode !== "text") ? '<img class="cansw-cobrand-img" src="' + cb.image + '" alt="' + (cb.name || "") + '">' : '';
      w.innerHTML = img + '<div><p class="cansw-cobrand-with">Curated with</p><p class="cansw-cobrand-name">' + (cb.name || "") + '</p><p class="cansw-cobrand-title">' + (cb.title || "") + '</p></div>';
    }
    titleEl.parentNode.insertBefore(w, titleEl);
  }

  var picker = document.getElementById("canswPicker");
  var btn = document.getElementById("canswBtn");
  var label = document.getElementById("canswLabel");
  var menu = document.getElementById("canswMenu");
  var result = document.getElementById("canswResult");
  var OPT_ELS = {};
  var fmt = function (n) { return "$" + n.toLocaleString("en-US"); };

  var cta = document.getElementById("canswCta");
  if (CFG.unlinkCtas) { cta.removeAttribute("href"); }
  else { cta.href = CFG.joinUrl; }
  var bCtaSafe = document.getElementById("canswBCta");
  if (bCtaSafe) { if (CFG.unlinkCtas) { bCtaSafe.removeAttribute("href"); } else { bCtaSafe.href = CFG.joinUrl; } }
  var seeAll = document.getElementById("canswSeeAll");
  if (CFG.dealsUrl) { seeAll.href = CFG.dealsUrl; } else { seeAll.hidden = true; }

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

    document.getElementById("canswKicker").textContent = name + " · " + d.partners.length + " verified partner deal" + (d.partners.length > 1 ? "s" : "");

    var num = document.getElementById("canswNum");
    var sub = document.getElementById("canswSub");
    var earnNote = document.getElementById("canswEarnNote");
    var earnBlock = document.getElementById("canswEarnBlock");
    var isAffiliates = (name === "Affiliates");

    if (d.vals.length) {
      var lo = Math.min.apply(null, d.vals);
      var hi = Math.max.apply(null, d.vals);
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
      num.textContent = "Member-only deals";
      sub.textContent = "with every partner in this category";
    }

    if (d.earners.length && !isAffiliates) {
      earnNote.innerHTML = "Plus <strong>better revenue splits</strong> with " + d.earners.join(", ");
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
      pill.innerHTML = "<span class='cansw-mono'>" + initials + "</span>" + p.n + (p.t ? " <span class='cansw-trophy' title='Exclusive to CAN or the best deal this partner offers'>🏆</span>" : "");
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

  /* ---- budget builder (CFG.builder) ----
     Always-on in-hero calculator: left = category dropdown (an "All
     categories" option is prepended) + company dropdown + fixed-height
     detail panel; right card = "Calculate your savings" empty state.
     Picks accumulate freely; the EMAIL GATE appears in the right card on
     the first Add and unlocking reveals the budget (items, totals, profit).
     Footprint is fixed: card 580px, detail 300px, dropdowns overlay. */
  if (CFG.builder) (function () {
    var gate = document.getElementById("canswGate");
    var gateEmail = document.getElementById("canswGateEmail");
    var gateErr = document.getElementById("canswGateErr");
    var cPicker = document.getElementById("canswCPicker");
    var cBtn = document.getElementById("canswCBtn");
    var cLabel = document.getElementById("canswCLabel");
    var cMenu = document.getElementById("canswCMenu");
    var detailEl = document.getElementById("canswBDetail");
    var budgetEl = document.getElementById("canswBudget");
    if (!gate || !cPicker || !budgetEl) return; /* stale markup on this surface; degrade to phase 1 */
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
    var bCta = document.getElementById("canswBCta");
    var payoffEl = document.getElementById("canswBPayoff");
    var LSKEY = "cansw_unlocked";
    var TROPHY_TIP = "Exclusive to CAN or the best deal this partner offers";
    var PICK_COPY = "Pick the software, products, and services on the left that you need to build your business, and see how much you will save.";
    var YEAR_COPY = "Savings shown for your first year of membership";

    function isEarn(p) { return !!(p.earn || p.be); }
    var BP = PARTNERS.filter(function (p) { return (p.plans && p.plans.length) || isEarn(p); });
    var BY = {}; BP.forEach(function (p) { BY[p.n] = p; });
    var BCATS = {};
    BP.forEach(function (p) { p.c.forEach(function (c) { BCATS[c] = (BCATS[c] || 0) + 1; }); });
    var ALL = "All categories";
    var bCat = ALL;
    var CART = [];      /* [{n, plan}] in add order; earn partners use plan: -1 */
    var current = null; /* company name shown in the detail panel */
    var unlocked = false;
    try { unlocked = !!localStorage.getItem(LSKEY); } catch (e) {}

    if (CFG.unlinkCtas) { bCta.removeAttribute("href"); } else { bCta.href = CFG.joinUrl; }
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

    function fireCapture(email) {
      if (!CFG.captureUrl) return; /* no endpoint configured; gate still unlocks */
      try {
        var body, type;
        if (CFG.captureUrl.indexOf("/forms/") > -1) {
          /* Kajabi form endpoint: urlencoded fields; custom_5 = tag, custom_6 = page */
          body = "form_submission%5Bname%5D=Widget%20Visitor" +
            "&form_submission%5Bemail%5D=" + encodeURIComponent(email) +
            "&form_submission%5Bcustom_5%5D=" + encodeURIComponent(CFG.captureTag) +
            "&form_submission%5Bcustom_6%5D=" + encodeURIComponent(location.href);
          type = "application/x-www-form-urlencoded";
        } else {
          /* generic webhook: JSON body as text/plain (simple type: no CORS preflight) */
          body = JSON.stringify({
            email: email,
            source: "savings-widget",
            tag: CFG.captureTag,
            page: location.href,
            at: new Date().toISOString()
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

    /* ---- company dropdown ---- */
    function cToggle(open) {
      var isOpen = open !== undefined ? open : !cPicker.classList.contains("cansw-open");
      cPicker.classList.toggle("cansw-open", isOpen);
      cBtn.setAttribute("aria-expanded", String(isOpen));
    }
    cBtn.addEventListener("click", function () { cToggle(); });
    document.addEventListener("click", function (e) { if (!cPicker.contains(e.target)) cToggle(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") cToggle(false); });

    function companiesFor(cat) {
      var items = BP.filter(function (p) { return cat === ALL || p.c.indexOf(cat) > -1; });
      items.sort(function (a, b) { return a.n.toLowerCase() < b.n.toLowerCase() ? -1 : 1; });
      return items;
    }
    function hintFor(p) {
      if (isEarn(p)) return "Earn more";
      var m = 0;
      p.plans.forEach(function (pl) { if (pl.save > m) m = pl.save; });
      return "Save " + (p.plans.length > 1 ? "up to " : "") + fmt(m);
    }

    function refreshCompanyMenu(keepSelection) {
      cMenu.innerHTML = "";
      var lab = document.createElement("div");
      lab.className = "cansw-menu-label";
      lab.textContent = bCat === ALL ? "All companies" : bCat;
      cMenu.appendChild(lab);
      var items = companiesFor(bCat);
      var hasTrophy = false;
      items.forEach(function (p) {
        if (p.t) hasTrophy = true;
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
      if (hasTrophy) {
        var note = document.createElement("div");
        note.className = "cansw-menu-note";
        note.textContent = "🏆 = " + TROPHY_TIP;
        cMenu.appendChild(note);
      }
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
      renderDetail();
    }

    /* ---- company detail panel (fixed height; placeholder when nothing picked) ---- */
    function renderDetail() {
      var p = current && BY[current];
      detailEl.innerHTML = "";
      detailEl.classList.toggle("cansw-bdetail-empty", !p);
      if (!p) {
        var ph = document.createElement("p");
        ph.className = "cansw-bdetail-placeholder";
        ph.textContent = "Pick a category and a company above to see the deal and what you would save.";
        detailEl.appendChild(ph);
        return;
      }
      var head = document.createElement("div");
      head.className = "cansw-bdetail-head";
      head.appendChild(logoNode(p.n, "cansw-mono", "cansw-logo"));
      var nm = document.createElement("p");
      nm.className = "cansw-bdetail-name";
      nm.innerHTML = esc(p.n) + (p.t ? " <span class='cansw-trophy' title='" + TROPHY_TIP + "'>🏆</span>" : "");
      head.appendChild(nm);
      detailEl.appendChild(head);
      var dl = document.createElement("p");
      dl.className = "cansw-b-deal";
      dl.textContent = p.deal || (isEarn(p) ? "Better revenue split" : "Member-only deal");
      detailEl.appendChild(dl);
      if (p.desc) {
        var ds = document.createElement("p");
        ds.className = "cansw-b-desc";
        ds.textContent = p.desc;
        detailEl.appendChild(ds);
      }
      var added = inCart(p.n) > -1;
      var chosen = 0;
      if (added) {
        var note0 = document.createElement("p");
        note0.className = "cansw-b-desc";
        note0.textContent = unlocked
          ? "In your budget. Switch plans or remove it there."
          : "Picked. Unlock your budget on the right to see your savings.";
        detailEl.appendChild(note0);
      } else if (isEarn(p)) {
        var note = document.createElement("p");
        note.className = "cansw-b-desc";
        note.innerHTML = "Members earn more on the sales they already make through an <strong>improved revenue split</strong>. Add it and set your current earnings on the slider to factor it into your budget.";
        detailEl.appendChild(note);
      } else if (p.plans.length > 1) {
        var wrap = document.createElement("div");
        wrap.className = "cansw-b-plans";
        p.plans.forEach(function (pl, i) {
          var lab = document.createElement("label");
          lab.className = "cansw-b-plan";
          var r = document.createElement("input");
          r.type = "radio";
          r.name = "canswPlan-" + p.n.replace(/\W+/g, "-");
          r.checked = i === 0;
          r.addEventListener("change", function () { chosen = i; });
          var nmS = document.createElement("span");
          nmS.className = "cansw-b-plan-name";
          nmS.innerHTML = esc(pl.name) + (pl.price ? " <span class='cansw-b-plan-price'>$" + pl.price.toLocaleString("en-US") + (pl.per ? "/" + pl.per : "") + "</span>" : "");
          var sv = document.createElement("span");
          sv.className = "cansw-b-plan-save";
          sv.textContent = "Save " + fmt(pl.save);
          lab.appendChild(r); lab.appendChild(nmS); lab.appendChild(sv);
          wrap.appendChild(lab);
        });
        detailEl.appendChild(wrap);
      } else {
        var one = document.createElement("p");
        one.className = "cansw-b-desc";
        one.innerHTML = "<span class='cansw-b-plan-save'>Save " + fmt(p.plans[0].save) + "</span>" +
          (p.plans[0].name && p.plans[0].name !== "—" ? " on " + esc(planLabel(p.plans[0])) : "") +
          " in your first year as a member.";
        detailEl.appendChild(one);
      }
      var add = document.createElement("button");
      add.className = "cansw-b-addbtn";
      add.type = "button";
      if (added) {
        add.disabled = true;
        add.textContent = unlocked ? "Added to your budget ✓" : "Picked ✓";
      } else {
        add.textContent = "Add to my budget";
        add.addEventListener("click", function () { addPartner(p, isEarn(p) ? -1 : chosen); });
      }
      detailEl.appendChild(add);
    }

    /* ---- budget card states: empty / gate / unlocked ---- */
    function addPartner(p, planIdx) {
      if (inCart(p.n) > -1) return;
      CART.push({ n: p.n, plan: planIdx });
      render();
      renderDetail();
      if (!unlocked) { try { gateEmail.focus(); } catch (e) {} }
    }
    function removePartner(n) {
      var i = inCart(n);
      if (i > -1) CART.splice(i, 1);
      render();
      if (current === n) renderDetail();
    }

    function render() {
      var n = CART.length;
      if (!unlocked) {
        emptyEl.hidden = true;
        itemsEl.hidden = true;
        earnBox.hidden = true;
        totalsEl.hidden = true;
        previewEl.hidden = false;
        if (n === 0) {
          titleEl2.textContent = "Calculate your savings";
          countEl.textContent = "";
          subEl.textContent = PICK_COPY;
          subEl.hidden = false;
          gate.hidden = true;
          bCta.hidden = false;
          payoffEl.hidden = false;
          renderPreview();
        } else {
          titleEl2.textContent = "Your budget";
          countEl.textContent = n + " picked";
          subEl.hidden = true;
          gate.hidden = false;
          bCta.hidden = true;
          payoffEl.hidden = true;
          renderGhosts();
        }
        return;
      }
      titleEl2.textContent = "Your budget";
      countEl.textContent = n ? n + " added" : "";
      subEl.textContent = n ? YEAR_COPY : PICK_COPY;
      subEl.hidden = false;
      gate.hidden = true;
      previewEl.hidden = true;
      emptyEl.hidden = n > 0;
      itemsEl.hidden = false;
      bCta.hidden = false;
      payoffEl.hidden = false;
      renderItems();
    }

    /* empty-state preview: live savings range + logo pills for the active category */
    function renderPreview() {
      previewEl.classList.remove("cansw-b-preview-ghost");
      previewEl.innerHTML = "";
      var kick = document.createElement("p");
      kick.className = "cansw-kicker";
      var num = document.createElement("p");
      num.className = "cansw-savings";
      var sub2 = document.createElement("p");
      sub2.className = "cansw-savings-sub";
      var names;
      if (bCat === ALL || !CATS[bCat]) {
        var hi = 0;
        PARTNERS.forEach(function (p) { if (p.v && p.v[1] > hi) hi = p.v[1]; });
        kick.textContent = PARTNERS.length + " verified partner deals";
        num.textContent = "Save up to " + fmt(hi);
        sub2.textContent = "on a single deal in your first year";
        names = BP.map(function (p) { return { n: p.n, t: !!p.t }; });
      } else {
        var d = CATS[bCat];
        kick.textContent = bCat + " · " + d.partners.length + " verified partner deal" + (d.partners.length > 1 ? "s" : "");
        if (d.vals.length) {
          var lo = Math.min.apply(null, d.vals), hi2 = Math.max.apply(null, d.vals);
          num.textContent = lo === hi2 ? "Save up to " + fmt(hi2) : "Save " + fmt(lo) + " – " + fmt(hi2);
          sub2.textContent = "in your first year, depending on the tools you pick";
        } else {
          num.textContent = "Member-only deals";
          sub2.textContent = "with every partner in this category";
        }
        names = d.partners;
      }
      previewEl.appendChild(kick);
      previewEl.appendChild(num);
      previewEl.appendChild(sub2);
      var pills = document.createElement("div");
      pills.className = "cansw-partners";
      var MAXP = 8;
      names.slice(0, MAXP).forEach(function (pp) {
        var pill = document.createElement("span");
        pill.className = "cansw-pill";
        pill.appendChild(logoNode(pp.n, "cansw-mono", "cansw-logo"));
        pill.appendChild(document.createTextNode(" " + pp.n));
        if (pp.t) {
          var t = document.createElement("span");
          t.className = "cansw-trophy";
          t.title = TROPHY_TIP;
          t.textContent = " 🏆";
          pill.appendChild(t);
        }
        pills.appendChild(pill);
      });
      if (names.length > MAXP) {
        var more = document.createElement("span");
        more.className = "cansw-more";
        more.textContent = "+" + (names.length - MAXP) + " more";
        pills.appendChild(more);
      }
      previewEl.appendChild(pills);
    }

    /* gate-state preview: picked rows with masked values */
    function renderGhosts() {
      previewEl.classList.add("cansw-b-preview-ghost");
      previewEl.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "cansw-b-ghosts";
      CART.forEach(function (e) {
        var pp = BY[e.n];
        var it = document.createElement("div");
        it.className = "cansw-b-item";
        it.appendChild(logoNode(pp.n, "cansw-mono", "cansw-logo"));
        var info = document.createElement("div");
        info.className = "cansw-b-item-info";
        var nm = document.createElement("p");
        nm.className = "cansw-b-item-name";
        nm.textContent = pp.n;
        info.appendChild(nm);
        it.appendChild(info);
        var sv = document.createElement("span");
        sv.className = "cansw-b-item-save";
        sv.textContent = isEarn(pp) ? "+10%" : "$•••";
        it.appendChild(sv);
        wrap.appendChild(it);
      });
      var prof = document.createElement("div");
      prof.className = "cansw-b-profit";
      prof.innerHTML = "<span>Your profit</span><span class='cansw-b-profit-num'>$•••</span>";
      wrap.appendChild(prof);
      previewEl.appendChild(wrap);
    }

    function renderItems() {
      itemsEl.innerHTML = "";
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
          note.textContent = "Better revenue split";
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
      var earners = CART.filter(function (e) { return isEarn(BY[e.n]); });
      earnBox.hidden = earners.length === 0;
      if (earners.length) {
        earnWho.textContent = "Members earn 10% more on the same sales through " +
          (earners.length > 1 ? "improved revenue splits with " : "an improved revenue split with ") +
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

    var origSelect = select;
    select = function (name) {
      origSelect(name);
      allOpt.setAttribute("aria-selected", "false");
      bCat = name;
      refreshCompanyMenu(true);
      render();
    };

    /* ---- gate ---- */
    gate.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = (gateEmail.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        gateErr.hidden = false;
        gateEmail.focus();
        return;
      }
      gateErr.hidden = true;
      try { localStorage.setItem(LSKEY, v); } catch (e) {}
      fireCapture(v);
      unlocked = true;
      render();
      renderDetail();
    });
    earnSlider.addEventListener("input", updateTotals);

    /* ---- init ---- */
    cPicker.hidden = false;
    detailEl.hidden = false;
    var sel = label.textContent;
    bCat = BCATS[sel] ? sel : ALL;
    if (bCat === ALL) {
      label.textContent = ALL;
      label.classList.remove("cansw-placeholder");
      allOpt.setAttribute("aria-selected", "true");
    }
    refreshCompanyMenu(false);
    render();
  })();

  }

  /* data: cansw-data.json next to this script; baked fallback on any failure */
  var base = SCRIPT.src.replace(/[^\/]*$/, "");
  var done = false;
  var useFallback = function () { if (!done) { done = true; init(FALLBACK); } };
  try {
    fetch(base + "cansw-data.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        if (!done && d && d.partners && d.partners.length) { done = true; init(d); }
        else useFallback();
      })
      .catch(useFallback);
    setTimeout(useFallback, 4000);
  } catch (e) { useFallback(); }
})();
