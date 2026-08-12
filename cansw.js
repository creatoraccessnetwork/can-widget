/* CAN savings widget — single-source bundle.
   Served via GitHub Pages; every CAN page loads this one file.

   Rebuilt 2026-08-12 against can-brand-design (references/product-ui.md +
   references/pattern-system.md). The spec was written FROM this design, so
   where a build note and the skill disagree, the skill wins.

   Page-specific config via window.CANSW_OVERRIDES BEFORE the script tag:
   { defaultCategory   - category the right-hand list opens on
     builderCategory   - alias of defaultCategory (legacy; same behaviour)
     joinUrl           - CTA target. A "#"-prefixed value SCROLLS to the
                         embedded checkout on the page instead of navigating
     dealsUrl          - secondary link target (empty string = no link)
     captureUrl        - Kajabi form endpoint or generic webhook
     captureTag        - tag written with the capture
     demotePartners:[] - co-brand competitor DEMOTION. These partners sort to
                         the very bottom of the list. They are NEVER removed:
                         still searchable, still in the category counts, still
                         in the partner count, no visual marker.
     hidePartners:[]   - DEPRECATED ALIAS for demotePartners. Live co-branded
                         pages still ship it, so it keeps working and maps to
                         the same demote behaviour. There is no code path that
                         removes a partner from the list.
     cobrand: { mode: "photo"|"text"|"logo", image, name, title, headline }
     unlinkCtas        - render CTAs as buttons with no href (preview surfaces)
   }
   Accepted and ignored (retired, kept so old stubs never throw):
     builder, openCalculator, prefillPicks, rotateMs, lede, earnUplift.

   Partner data: cansw-data.json next to this file (baked fallback below).
   Headline figures: numbers.json next to this file. The widget NEVER computes
   a site-wide total. */
(function () {
  if (window.__canswLoaded) return; window.__canswLoaded = true;
  var SCRIPT = document.currentScript;
  var BASE = SCRIPT.src.replace(/[^\/]*$/, "");

  var DEFAULTS = {
    joinUrl: "https://www.creatoraccessnetwork.com/resource_redirect/offers/oyLoKFBu",
    dealsUrl: "https://www.creatoraccessnetwork.com/partners",
    defaultCategory: "",
    membershipCost: 49,
    captureUrl: "",
    captureTag: "widget"
  };
  var CFG = {};
  var ov = window.CANSW_OVERRIDES || {};
  for (var k in DEFAULTS) CFG[k] = DEFAULTS[k];
  for (var k2 in ov) CFG[k2] = ov[k2];
  /* builderCategory is the older name for the same thing */
  if (!CFG.defaultCategory && CFG.builderCategory) CFG.defaultCategory = CFG.builderCategory;
  /* hidePartners is an ALIAS, not a second feature. Merge, never filter. */
  var DEMOTE = [].concat(CFG.demotePartners || [], CFG.hidePartners || []);

  var ALL = "All categories";
  var MEMBERSHIP = CFG.membershipCost;
  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}

  /* ---------- fonts ----------
     Loaded by the widget itself so the layout never depends on the Kajabi
     theme's font picker. Lato = display, Open Sans = body, numerals at 700. */
  if (!document.getElementById("cansw-fonts")) {
    var pre1 = document.createElement("link");
    pre1.rel = "preconnect"; pre1.href = "https://fonts.googleapis.com";
    var pre2 = document.createElement("link");
    pre2.rel = "preconnect"; pre2.href = "https://fonts.gstatic.com"; pre2.crossOrigin = "";
    var fl = document.createElement("link");
    fl.id = "cansw-fonts";
    fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=Lato:wght@700;900&family=Open+Sans:wght@400;600;700;800&display=swap";
    document.head.appendChild(pre1);
    document.head.appendChild(pre2);
    document.head.appendChild(fl);
  }

  /* ---------- CSS ---------- */
  var CSS = `
  .cansw{
    --cansw-teal:#2A6478; --cansw-teal-dark:#1E4F5F;
    --cansw-rust-fill:#C17A5E;   /* fills only */
    --cansw-rust:#9E614A;        /* rust TEXT + the primary button. 4.93:1 */
    --cansw-ink:#1A1F2C; --cansw-charcoal:#374151; --cansw-mute:#5B6572;
    --cansw-fine:#6B7280;
    --cansw-white:#FFFFFF; --cansw-ground:#F0F4F8; --cansw-surface2:#FAFBFD;
    --cansw-border:#E6EBF2; --cansw-hairline:#EFF3F7;
    --cansw-display:'Lato',system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;
    --cansw-body:'Open Sans',system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;
    --cansw-panel-h:582px;
    --cansw-dur-state:150ms; --cansw-dur-enter:250ms;
    font-family:var(--cansw-body);
    color:var(--cansw-charcoal);
    background-color:var(--cansw-ground);
    background-image:url("${BASE}can-pattern-v4-desktop.svg");
    background-size:970px 970px;
    background-repeat:repeat;
    padding:64px 24px;
    text-align:left;
    box-sizing:border-box;
  }
  @media (max-width:768px){
    .cansw{
      background-image:url("${BASE}can-pattern-v4-mobile.svg");
      background-size:413px 413px;
    }
  }
  @media (prefers-reduced-motion: reduce){
    .cansw{ --cansw-dur-state:0ms; --cansw-dur-enter:0ms; }
  }
  .cansw *,.cansw *::before,.cansw *::after{ box-sizing:border-box; }
  .cansw button{ font-family:inherit; }
  /* every display: rule below would otherwise beat the hidden attribute */
  .cansw [hidden]{ display:none !important; }

  /* ---- the two panels: equal width and equal height, always ---- */
  .cansw-cols{
    display:grid;
    grid-template-columns:repeat(2, minmax(0,1fr));
    gap:48px;
    max-width:1062px;   /* 507 + 48 + 507 */
    margin:0 auto;
    align-items:start;
  }
  .cansw-panel{
    background:var(--cansw-white);
    border:1px solid var(--cansw-border);
    border-radius:4px;
    box-shadow:0 3px 10px rgba(26,31,44,.10);
    height:var(--cansw-panel-h);
    overflow:hidden;
    display:flex;
    flex-direction:column;
    min-width:0;
  }

  /* ================= LEFT PANEL — information ================= */
  .cansw-info{ padding:26px; }
  .cansw-pin{ flex:none; }

  .cansw-cobrand{
    display:flex; align-items:center; gap:10px;
    padding-bottom:12px; margin-bottom:12px;
    border-bottom:1px solid var(--cansw-hairline);
  }
  .cansw-cobrand img{ height:32px; width:auto; max-width:120px; object-fit:contain; display:block; }
  .cansw-cobrand.cansw-cobrand-photo img{
    height:40px; width:40px; border-radius:50%; object-fit:cover; max-width:none;
  }
  .cansw-cobrand-name{
    font-size:13px; line-height:18px; font-weight:700; color:var(--cansw-ink);
  }
  .cansw-cobrand-title{
    font-size:11px; line-height:16px; color:var(--cansw-mute);
  }

  .cansw-eyebrow{
    font-size:11px; line-height:16px; font-weight:800;
    letter-spacing:1.4px; text-transform:uppercase;
    color:var(--cansw-rust); margin:0 0 10px;
  }
  .cansw-h1{
    font-family:var(--cansw-display); font-weight:900;
    font-size:30px; line-height:1.12; letter-spacing:-.6px;
    color:var(--cansw-ink); margin:0 0 18px;
  }

  .cansw-stats{ display:flex; margin:0 0 16px; }
  .cansw-stat{ flex:1 1 0; min-width:0; }
  .cansw-stat + .cansw-stat{
    border-left:1px solid var(--cansw-hairline); padding-left:18px; margin-left:18px;
  }
  .cansw-stat-num{
    font-family:var(--cansw-display); font-weight:700;
    font-size:24px; line-height:26px; letter-spacing:-.3px;
    color:var(--cansw-teal); font-variant-numeric:tabular-nums;
  }
  .cansw-stat-label{
    font-size:11px; line-height:16px; font-weight:700;
    letter-spacing:1.4px; text-transform:uppercase;
    color:var(--cansw-mute); margin-top:4px;
  }

  /* the block that swaps inside the fixed box */
  .cansw-swap{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; }

  .cansw-empty{
    flex:1 1 auto; min-height:0;
    display:flex; flex-direction:column; justify-content:space-evenly;
  }
  .cansw-bullet{
    display:grid; grid-template-columns:18px 1fr; gap:8px; align-items:start;
    font-size:15px; line-height:20px; color:var(--cansw-charcoal);
  }
  .cansw-check{
    width:16px; height:16px; margin-top:2px; flex:none;
    color:var(--cansw-teal);
  }
  .cansw-community{
    font-size:15px; line-height:20px; font-weight:700; color:var(--cansw-teal);
  }

  .cansw-active{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; }
  .cansw-microlabel{
    font-size:11px; line-height:16px; font-weight:800;
    letter-spacing:1.4px; text-transform:uppercase;
    color:var(--cansw-mute); margin:0;
  }
  .cansw-hero{
    font-family:var(--cansw-display); font-weight:700;
    font-size:44px; line-height:1.05; letter-spacing:-1px;
    color:var(--cansw-teal); font-variant-numeric:tabular-nums;
    margin:2px 0 0;
  }
  .cansw-growline{
    font-size:13px; line-height:18px; color:var(--cansw-mute); margin:4px 0 0;
  }
  .cansw-picks{
    flex:1 1 auto; min-height:0; overflow-y:auto;
    margin:12px 0 0;
    background:var(--cansw-surface2);
    border:1px solid var(--cansw-border); border-radius:4px;
  }
  .cansw-pick{
    display:grid; grid-template-columns:1fr auto auto; gap:10px; align-items:baseline;
    padding:8px 10px;
    border-bottom:1px solid var(--cansw-hairline);
  }
  .cansw-pick:last-child{ border-bottom:0; }
  .cansw-pick-name{
    font-size:15px; line-height:20px; font-weight:600; color:var(--cansw-ink);
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .cansw-pick-plan{
    display:block; font-size:13px; line-height:18px; font-weight:400; color:var(--cansw-mute);
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .cansw-pick-val{
    font-size:15px; line-height:20px; font-weight:700; color:var(--cansw-teal);
    font-variant-numeric:tabular-nums; min-width:56px; text-align:right;
  }
  .cansw-pick-x{
    width:24px; height:24px; padding:0; border:0; background:none; cursor:pointer;
    color:var(--cansw-mute); font-size:15px; line-height:20px; border-radius:4px;
    position:relative;
  }
  /* 24px visual, 44px hit area */
  .cansw-pick-x::before{
    content:""; position:absolute; top:50%; left:50%;
    width:44px; height:44px; transform:translate(-50%,-50%);
  }
  .cansw-pick-x:hover{ color:var(--cansw-ink); background:var(--cansw-hairline); }
  .cansw-profit{
    font-size:13px; line-height:18px; color:var(--cansw-mute);
    margin:10px 0 0; font-variant-numeric:tabular-nums;
  }
  .cansw-profit b{ color:var(--cansw-ink); font-weight:700; }

  /* capture, pinned to the bottom of the fixed box */
  .cansw-capture{ flex:none; margin-top:16px; }
  .cansw-capture-row{ display:flex; gap:8px; }
  .cansw-input{
    flex:1 1 auto; min-width:0; height:44px; padding:0 12px;
    font-family:var(--cansw-body); font-size:15px; line-height:20px;
    color:var(--cansw-charcoal); background:var(--cansw-white);
    border:1px solid var(--cansw-border); border-radius:4px;
    transition:border-color var(--cansw-dur-state) ease;
  }
  .cansw-input::placeholder{ color:var(--cansw-mute); }
  .cansw-input:hover{ border-color:#C9D4E0; }
  .cansw-btn{
    flex:none; height:44px; padding:0 18px; border:0; border-radius:4px; cursor:pointer;
    font-family:var(--cansw-body); font-weight:700; font-size:15px; line-height:20px;
    background:var(--cansw-rust); color:#fff; text-decoration:none;
    display:inline-flex; align-items:center; justify-content:center; white-space:nowrap;
    transition:background var(--cansw-dur-state) ease;
  }
  .cansw-btn:hover{ background:#87503D; }
  .cansw-btn:disabled{ opacity:.45; cursor:not-allowed; }
  .cansw-btn:disabled:hover{ background:var(--cansw-rust); }
  .cansw-fine{
    font-size:11px; line-height:16px; color:var(--cansw-fine); margin:8px 0 0;
  }
  .cansw-fine a{ color:var(--cansw-fine); }

  /* ================= RIGHT PANEL — action ================= */
  .cansw-act{ padding:0; }
  .cansw-controls{
    flex:none; display:flex; gap:8px; padding:26px 26px 14px;
  }
  .cansw-search{ flex:1 1 auto; min-width:0; }
  .cansw-picker{ position:relative; flex:none; width:190px; }
  .cansw-picker-btn{
    width:100%; height:44px; padding:0 12px;
    display:flex; align-items:center; justify-content:space-between; gap:8px;
    font-family:var(--cansw-body); font-size:15px; line-height:20px;
    color:var(--cansw-charcoal); background:var(--cansw-white);
    border:1px solid var(--cansw-border); border-radius:4px; cursor:pointer;
    text-align:left;
    transition:border-color var(--cansw-dur-state) ease;
  }
  .cansw-picker-btn:hover{ border-color:#C9D4E0; background:var(--cansw-surface2); }
  .cansw-picker-label{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .cansw-caret{ flex:none; color:var(--cansw-mute); }
  .cansw-menu{
    position:absolute; z-index:40; top:calc(100% + 4px); right:0;
    width:260px; max-height:280px; overflow-y:auto;
    background:var(--cansw-white); border:1px solid var(--cansw-border);
    border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,.08);
    padding:4px; display:none;
  }
  .cansw-picker.cansw-open .cansw-menu{ display:block; }
  .cansw-opt{
    display:flex; align-items:center; justify-content:space-between; gap:12px;
    width:100%; padding:8px 10px; min-height:44px;
    font-family:var(--cansw-body); font-size:15px; line-height:20px;
    color:var(--cansw-charcoal); background:none; border:0; border-radius:4px;
    cursor:pointer; text-align:left;
  }
  .cansw-opt:hover{ background:var(--cansw-surface2); }
  .cansw-opt[aria-selected="true"]{ background:#F4F8FA; font-weight:700; color:var(--cansw-ink); }
  .cansw-opt-count{
    flex:none; font-size:13px; line-height:18px; color:var(--cansw-mute);
    font-variant-numeric:tabular-nums;
  }

  .cansw-list{ flex:1 1 auto; min-height:0; overflow-y:auto; }
  .cansw-empty-msg{
    padding:26px; font-size:15px; line-height:20px; color:var(--cansw-mute);
  }

  .cansw-row{
    display:grid; grid-template-columns:28px minmax(0,1fr) auto;
    gap:12px; align-items:start;
    padding:12px 26px;
    border-bottom:1px solid var(--cansw-hairline);
    transition:background var(--cansw-dur-state) ease;
  }
  .cansw-row:hover{ background:var(--cansw-surface2); }
  .cansw-row.cansw-picked{ background:#F4F8FA; }
  .cansw-logo{
    width:28px; height:28px; border-radius:4px; overflow:hidden;
    display:grid; place-items:center; background:var(--cansw-ground); margin-top:1px;
  }
  .cansw-logo img{ width:100%; height:100%; object-fit:contain; display:block; }
  .cansw-mono{
    width:100%; height:100%; display:grid; place-items:center;
    font-size:11px; line-height:16px; font-weight:700; color:var(--cansw-teal);
  }
  .cansw-mid{ display:grid; grid-template-columns:minmax(0,1fr) auto; column-gap:12px; min-width:0; }
  .cansw-nameline{
    display:flex; align-items:baseline; gap:6px; min-width:0;
    font-size:15px; line-height:20px; font-weight:600; color:var(--cansw-ink);
  }
  .cansw-name{ overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .cansw-trophy{ flex:none; font-size:11px; line-height:20px; }
  .cansw-valwrap{ text-align:right; }
  .cansw-val{
    font-size:15px; line-height:20px; font-weight:700; color:var(--cansw-teal);
    font-variant-numeric:tabular-nums; white-space:nowrap;
  }
  .cansw-val.cansw-val-free{ color:var(--cansw-rust); }
  .cansw-tag{
    display:inline-block; margin-top:2px;
    font-size:11px; line-height:16px; font-weight:800;
    letter-spacing:.9px; text-transform:uppercase; border-radius:4px; padding:0 5px;
  }
  .cansw-tag-uncapped{ color:var(--cansw-teal); background:rgba(42,100,120,.10); }
  /* #9E614A on a rust tint measures 4.24:1 and fails AA at this size, because
     rust text only clears 4.93:1 against pure white to begin with. The
     sanctioned darker rust (the button-hover token) takes it to 5.4:1+. */
  .cansw-tag-included{ color:#87503D; background:rgba(193,122,94,.12); }
  .cansw-deal{
    grid-column:1 / 2; margin-top:2px;
    font-size:13px; line-height:18px; color:var(--cansw-mute);
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .cansw-ctrls{ display:flex; align-items:center; gap:4px; }
  .cansw-icon{
    width:28px; height:28px; padding:0; flex:none;
    display:grid; place-items:center;
    background:var(--cansw-white); border:1px solid var(--cansw-border);
    border-radius:4px; cursor:pointer; color:var(--cansw-teal);
    position:relative;
    transition:background var(--cansw-dur-state) ease, border-color var(--cansw-dur-state) ease;
  }
  /* 28px visual, 44px hit area */
  .cansw-icon::before{
    content:""; position:absolute; top:50%; left:50%;
    width:44px; height:44px; transform:translate(-50%,-50%);
  }
  .cansw-icon:hover{ background:var(--cansw-surface2); border-color:#C9D4E0; }
  .cansw-icon[aria-pressed="true"]{
    background:var(--cansw-teal); border-color:var(--cansw-teal); color:#fff;
  }
  .cansw-icon:disabled{ opacity:.45; cursor:not-allowed; }
  .cansw-icon:disabled:hover{ background:var(--cansw-white); border-color:var(--cansw-border); }
  .cansw-chev svg{ transition:transform var(--cansw-dur-state) ease; }
  .cansw-chev[aria-expanded="true"] svg{ transform:rotate(180deg); }

  /* offers, expanded in place on the second surface tone */
  .cansw-offers{
    background:var(--cansw-surface2);
    border-bottom:1px solid var(--cansw-hairline);
    padding:2px 26px 6px 66px;
  }
  .cansw-offer{
    display:grid; grid-template-columns:minmax(0,1fr) auto auto;
    gap:12px; align-items:baseline;
    padding:8px 0;
    border-bottom:1px solid var(--cansw-hairline);
  }
  .cansw-offer:last-child{ border-bottom:0; }
  .cansw-offer-name{
    font-size:15px; line-height:20px; color:var(--cansw-charcoal);
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .cansw-offer-val{
    font-size:15px; line-height:20px; font-weight:700; color:var(--cansw-teal);
    font-variant-numeric:tabular-nums; white-space:nowrap;
  }
  .cansw-anim{ animation:cansw-in var(--cansw-dur-enter) ease-out both; }
  @keyframes cansw-in{ from{ opacity:0; transform:translateY(-4px); } to{ opacity:1; transform:none; } }
  @media (prefers-reduced-motion: reduce){ .cansw-anim{ animation:none; } }

  .cansw-foot{
    flex:none; display:flex; align-items:center; justify-content:space-between;
    gap:16px; padding:12px 26px; border-top:1px solid var(--cansw-border);
    background:var(--cansw-white);
  }
  .cansw-count{
    font-size:11px; line-height:16px; font-weight:700;
    letter-spacing:1.4px; text-transform:uppercase; color:var(--cansw-mute);
    font-variant-numeric:tabular-nums; white-space:nowrap;
  }
  .cansw-legends{
    display:flex; flex-direction:column; align-items:flex-end; gap:2px;
    font-size:11px; line-height:16px; color:var(--cansw-mute); text-align:right;
  }

  /* focus ring — never removed */
  .cansw :where(a,button,input,select,textarea,[tabindex]):focus-visible{
    outline:2px solid var(--cansw-teal); outline-offset:2px;
  }
  .cansw :where(a,button,input,select,textarea,[tabindex]):focus{
    outline:2px solid var(--cansw-teal); outline-offset:2px;
  }
  .cansw :where(a,button,input,select,textarea,[tabindex]):focus:not(:focus-visible){
    outline:2px solid var(--cansw-teal); outline-offset:2px;
  }

  .cansw-sr{
    position:absolute; width:1px; height:1px; padding:0; margin:-1px;
    overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0;
  }

  /* ---- stacked ---- */
  @media (max-width:900px){
    .cansw{ padding:40px 16px; }
    .cansw-cols{ grid-template-columns:minmax(0,1fr); gap:24px; }
    .cansw-info{ padding:20px; }
    .cansw-controls{ padding:20px 20px 12px; }
    .cansw-row{ padding:12px 20px; }
    .cansw-offers{ padding:2px 20px 6px 60px; }
    .cansw-foot{ padding:12px 20px; }
    .cansw-h1{ font-size:24px; }
    .cansw-picker{ width:150px; }
    .cansw-foot{ flex-direction:column; align-items:flex-start; gap:6px; }
    .cansw-legends{ align-items:flex-start; text-align:left; }
    /* side by side the field is too narrow to read an address in */
    .cansw-capture-row{ flex-direction:column; }
    .cansw-btn{ width:100%; }
  }
  `;

  /* ---------- markup ---------- */
  var SVG_CHECK = '<svg class="cansw-check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M2.5 8.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SVG_CARET = '<svg class="cansw-caret" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 4.5L6 8.5l4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SVG_CHEV = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2 4.5L6 8.5l4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SVG_PLUS = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M6 1.5v9M1.5 6h9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

  var BULLETS = [
    "Events and Meetups",
    "Tools &amp; Software",
    "Platform Commissions",
    "Production Gear",
    "Professional Services",
    "Education and How-To"
  ];

  var HTML =
    '<div class="cansw-cols">' +
      '<section class="cansw-panel cansw-info" aria-label="Your savings">' +
        '<div class="cansw-pin" id="canswCobrand" hidden></div>' +
        '<p class="cansw-eyebrow cansw-pin">Creator Access Network</p>' +
        '<h2 class="cansw-h1 cansw-pin" id="canswH1">Exclusive discounts for Creators and solopreneurs</h2>' +
        '<div class="cansw-stats cansw-pin">' +
          '<div class="cansw-stat"><div class="cansw-stat-num" id="canswStatCount">—</div><div class="cansw-stat-label">Live partners</div></div>' +
          '<div class="cansw-stat"><div class="cansw-stat-num" id="canswStatValue">—</div><div class="cansw-stat-label">Total savings</div></div>' +
        '</div>' +
        '<div class="cansw-swap">' +
          '<div class="cansw-empty" id="canswEmpty">' +
            BULLETS.map(function (b) {
              return '<div class="cansw-bullet">' + SVG_CHECK + '<span>' + b + '</span></div>';
            }).join("") +
            '<p class="cansw-community">Plus a community of likeminded dreamseekers.</p>' +
          '</div>' +
          '<div class="cansw-active" id="canswActive" hidden>' +
            '<p class="cansw-microlabel">Your first-year savings</p>' +
            '<div class="cansw-hero" id="canswHero" aria-live="polite">$0</div>' +
            '<p class="cansw-growline" id="canswGrow" hidden></p>' +
            '<div class="cansw-picks" id="canswPicks" tabindex="0" role="region" aria-label="Your picks"></div>' +
            '<p class="cansw-profit" id="canswProfit"></p>' +
          '</div>' +
        '</div>' +
        '<form class="cansw-capture cansw-pin" id="canswCapture" novalidate>' +
          '<div class="cansw-capture-row">' +
            '<label class="cansw-sr" for="canswEmail">Email address</label>' +
            '<input class="cansw-input" id="canswEmail" type="email" name="email" autocomplete="email" placeholder="you@example.com">' +
            '<button class="cansw-btn" type="submit" id="canswCta">Unlock free discounts</button>' +
          '</div>' +
          '<p class="cansw-fine">We\'ll email you the discount list and Creator Access Network updates. Unsubscribe anytime.</p>' +
        '</form>' +
      '</section>' +

      '<section class="cansw-panel cansw-act" aria-label="Browse partners">' +
        '<div class="cansw-controls">' +
          '<div class="cansw-search">' +
            '<label class="cansw-sr" for="canswSearch">Search partners</label>' +
            '<input class="cansw-input" id="canswSearch" type="search" autocomplete="off" placeholder="Search partners">' +
          '</div>' +
          '<div class="cansw-picker" id="canswPicker">' +
            '<button class="cansw-picker-btn" type="button" id="canswPickerBtn" aria-haspopup="listbox" aria-expanded="false">' +
              '<span class="cansw-picker-label" id="canswPickerLabel">' + ALL + '</span>' + SVG_CARET +
            '</button>' +
            '<div class="cansw-menu" id="canswMenu" role="listbox" aria-label="Category"></div>' +
          '</div>' +
        '</div>' +
        '<div class="cansw-list" id="canswList" tabindex="0" role="region" aria-label="Partner list"></div>' +
        '<div class="cansw-foot">' +
          '<div class="cansw-count" id="canswCount"></div>' +
          '<div class="cansw-legends">' +
            '<div>&#127942; = best deal this partner offers anywhere</div>' +
            '<div>Uncapped = grows with your business</div>' +
          '</div>' +
        '</div>' +
      '</section>' +
    '</div>';

  /* ---------- mount ---------- */
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

  /* Kajabi wraps code blocks in .block containers with overflow:hidden, which
     clips the category menu at the section edge. Un-clip up to the section. */
  for (var anc = mount.parentElement; anc && anc !== document.body; anc = anc.parentElement) {
    try { if (getComputedStyle(anc).overflow !== "visible") anc.style.overflow = "visible"; } catch (e) {}
    if ((anc.id && anc.id.indexOf("section") === 0) || /(^|\s)section(\s|$)/.test(anc.className || "")) break;
  }

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; });
  }
  function fmt(n) { return "$" + Math.round(n).toLocaleString("en-US"); }

  /* ================= data-derived tables =================
     These live in CODE, not in cansw-data.json, so that file stays exactly
     the shape the Notion sync writes. */

  /* Capped commission savings the tracker's savings column doesn't carry.
     Avi 2026-07-28: Dorian's 100%-revshare promo SAVES up to $5,000 in
     commission, and it is capped, so it is a real dollar value. */
  var SAVE_CEILS = { "Dorian": 5000 };

  /* UNCAPPED — pays back in proportion to what the Creator does, so there is
     no defensible maximum. These NEVER contribute a dollar to any total
     (Avi 2026-07-26, reconfirmed in numbers.json). The label is the ACTUAL
     rate: "no cap" tells a newcomer nothing (product-ui.md).
     Sources: partner deal text in cansw-data.json where it states the rate;
     the tracker rate cells recorded in numbers.json._source and the project
     STATUS log for Pierson Ferdinand ($200/hr) and CreatorCare ($600/mo). */
  var UNCAPPED = {
    "ShopYourLikes":     "+10 pts per sale",
    "TopFan":            "+2 pts per sale",
    "Driff":             "+10 pts for 3 months",
    "Insense":           "$200+ per campaign",
    "Pierson Ferdinand": "$200/hr off",
    "CreatorCare":       "$600/mo off"
  };
  /* Free inclusions: rust value + an "included" tag, same logic as uncapped. */
  var INCLUDED = { "EditHers": "Free access" };

  /* Sort by recognizability. Anything not named here falls to the bottom
     alphabetically. Reorder this array to reorder the list. */
  var RANK = [
    "Kajabi", "beehiiv", "Teachable", "Epidemic Sound", "Mighty Networks", "Mercury",
    "Fourthwall", "ShopYourLikes", "Wispr Flow", "Pop.store", "Hopp", "Nas.com",
    "Karat", ".store", "Insense", "Elevate.io", "SendOwl", "Thematic", "Slipstream",
    "FYPM", "Creator Wizard", "Growth in Reverse", "Creators Guild of America",
    "Buy.Video", "Switcher Studios", "CreatorScore", "Roster", "Boring Stuff",
    "ClearPath", "EssentL Creator", "Unbound Legal", "Ratelle Law",
    "Pierson Ferdinand", "Revenews", "DUPAY", "Valim", "TopFan", "Dorian", "Driff",
    "Built by Foundry", "CreatorCare", "EditHers"
  ];
  var RANK_OF = {};
  RANK.forEach(function (n, i) { RANK_OF[n] = i; });

  var NUMBERS = null;

  function init(DATA) {
    var PARTNERS = DATA.partners || [];
    var LOGOS = DATA.logos || {};

    /* ---- normalise each partner into one display shape ---- */
    PARTNERS.forEach(function (p) {
      p._uncapped = Object.prototype.hasOwnProperty.call(UNCAPPED, p.n);
      p._included = Object.prototype.hasOwnProperty.call(INCLUDED, p.n);
      p._offers = [];
      if (!p._uncapped && !p._included) {
        if (p.plans && p.plans.length) {
          p.plans.forEach(function (pl, i) {
            if (typeof pl.save === "number" && pl.save > 0) {
              p._offers.push({ i: i, name: planLabel(pl), save: pl.save });
            }
          });
        }
        if (!p._offers.length) {
          var ceil = SAVE_CEILS[p.n] || (p.v && p.v[1]) || 0;
          if (ceil > 0) p._offers.push({ i: 0, name: p.deal || "Member discount", save: ceil });
        }
      }
      /* the value shown on the row */
      if (p._uncapped) { p._val = UNCAPPED[p.n]; p._tag = "uncapped"; }
      else if (p._included) { p._val = INCLUDED[p.n]; p._tag = "included"; }
      else {
        var hi = 0;
        p._offers.forEach(function (o) { if (o.save > hi) hi = o.save; });
        p._val = hi > 0 ? fmt(hi) : "";
        p._tag = "";
      }
      p._searchText = (p.n + " " + (p.deal || "") + " " + (p.c || []).join(" ")).toLowerCase();
    });

    function planLabel(pl) {
      var nm = (pl.name && pl.name !== "—") ? pl.name : "Member discount";
      if (pl.price) nm += " ($" + pl.price.toLocaleString("en-US") + (pl.per ? "/" + pl.per : "") + ")";
      return nm;
    }

    /* ---- sort tiers: host pinned, everyone else, demoted last ----
       Demotion changes position only. Nothing is ever removed. */
    var hostName = (CFG.cobrand && CFG.cobrand.name) || "";
    var demoteSet = {};
    DEMOTE.forEach(function (n) { demoteSet[String(n).toLowerCase()] = true; });

    /* Co-brand names carry a descriptor the catalogue does not: the .store
       page calls its host ".store Domains", Pop.Store capitalises differently.
       Match case-insensitively, then fall back to a prefix match so the host
       still pins. */
    var hostMatch = "";
    if (hostName) {
      var hn = hostName.toLowerCase();
      PARTNERS.forEach(function (p) {
        var pn = p.n.toLowerCase();
        if (pn === hn) hostMatch = pn;
      });
      if (!hostMatch) {
        PARTNERS.forEach(function (p) {
          var pn = p.n.toLowerCase();
          if (pn.length >= 4 && hn.indexOf(pn) === 0 && pn.length > hostMatch.length) hostMatch = pn;
        });
      }
    }

    function tierOf(p) {
      if (hostMatch && p.n.toLowerCase() === hostMatch) return 0;
      if (demoteSet[p.n.toLowerCase()]) return 2;
      return 1;
    }
    PARTNERS.sort(function (a, b) {
      var ta = tierOf(a), tb = tierOf(b);
      if (ta !== tb) return ta - tb;
      var ra = RANK_OF[a.n], rb = RANK_OF[b.n];
      var ha = ra === undefined, hb = rb === undefined;
      if (ha !== hb) return ha ? 1 : -1;          /* unranked to the bottom */
      if (ha && hb) return a.n.toLowerCase() < b.n.toLowerCase() ? -1 : 1;
      return ra - rb;
    });

    /* ---- categories: true counts over every partner, nothing hidden ---- */
    var CATS = {};
    PARTNERS.forEach(function (p) {
      (p.c || []).forEach(function (c) { CATS[c] = (CATS[c] || 0) + 1; });
    });
    var CAT_NAMES = Object.keys(CATS).sort(function (a, b) {
      if (CATS[b] !== CATS[a]) return CATS[b] - CATS[a];
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

    /* ---- headline figures: read, never compute ---- */
    var statCount = $("canswStatCount"), statValue = $("canswStatValue");
    var totalPartners = PARTNERS.length;
    if (NUMBERS && NUMBERS.partner_count) totalPartners = NUMBERS.partner_count;
    statCount.textContent = totalPartners;
    /* exact dollar total when the deal-numbers routine publishes one, else the
       published rounded figure. The widget never sums a site-wide total. */
    var headlineValue = "";
    if (NUMBERS) {
      if (NUMBERS.total_value_exact) {
        headlineValue = typeof NUMBERS.total_value_exact === "number"
          ? fmt(NUMBERS.total_value_exact) : String(NUMBERS.total_value_exact);
      } else if (NUMBERS.total_value) {
        headlineValue = String(NUMBERS.total_value);
      }
    }
    statValue.textContent = headlineValue || "—";
    if (!headlineValue) statValue.closest(".cansw-stat").hidden = true;

    /* ---- co-brand banner ---- */
    if (CFG.cobrand && (CFG.cobrand.image || CFG.cobrand.name)) {
      var cb = $("canswCobrand");
      var cbHtml = "";
      if (CFG.cobrand.image) {
        cbHtml += '<img src="' + esc(CFG.cobrand.image) + '" alt="' + esc(CFG.cobrand.name || "") + '">';
      }
      if (CFG.cobrand.name || CFG.cobrand.title) {
        cbHtml += '<div>' +
          (CFG.cobrand.name ? '<div class="cansw-cobrand-name">' + esc(CFG.cobrand.name) + '</div>' : '') +
          (CFG.cobrand.title ? '<div class="cansw-cobrand-title">' + esc(CFG.cobrand.title) + '</div>' : '') +
          '</div>';
      }
      cb.className = "cansw-pin cansw-cobrand" + (CFG.cobrand.mode === "photo" ? " cansw-cobrand-photo" : "");
      cb.innerHTML = cbHtml;
      cb.hidden = false;
    }
    if (CFG.headline) $("canswH1").textContent = CFG.headline;

    /* ================= state ================= */
    var CART = [];          /* [{n, offer}] */
    var expanded = {};      /* partner name -> bool */
    var cat = ALL;
    var query = "";
    var shownTotal = 0;
    var countTimer = null, countGen = 0;

    var listEl = $("canswList"), countEl = $("canswCount");
    var picksEl = $("canswPicks"), heroEl = $("canswHero");
    var growEl = $("canswGrow"), profitEl = $("canswProfit");
    var emptyEl = $("canswEmpty"), activeEl = $("canswActive");

    function inCart(n) {
      for (var i = 0; i < CART.length; i++) if (CART[i].n === n) return i;
      return -1;
    }
    function byName(n) {
      for (var i = 0; i < PARTNERS.length; i++) if (PARTNERS[i].n === n) return PARTNERS[i];
      return null;
    }
    /* the default pick: cheapest offer that still beats the membership, so the
       first pick is always profitable. Falls back to the best one. */
    function defaultOffer(p) {
      /* no dollar offer to choose: the partner still joins the pick list */
      if (p._uncapped || p._included) return { i: 0, name: p._val, save: 0 };
      var best = null;
      p._offers.forEach(function (o) {
        if (o.save > MEMBERSHIP && (!best || o.save < best.save)) best = o;
      });
      if (best) return best;
      var hi = null;
      p._offers.forEach(function (o) { if (!hi || o.save > hi.save) hi = o; });
      return hi;
    }

    function logoNode(p) {
      var wrap = document.createElement("div");
      wrap.className = "cansw-logo";
      var url = LOGOS[p.n];
      var mono = document.createElement("div");
      mono.className = "cansw-mono";
      mono.textContent = p.n.split(/[\s.\/]+/).filter(Boolean).slice(0, 2)
        .map(function (w) { return w[0].toUpperCase(); }).join("");
      if (url) {
        var img = document.createElement("img");
        img.src = url; img.alt = ""; img.loading = "lazy";
        img.onerror = function () { img.remove(); wrap.appendChild(mono); };
        wrap.appendChild(img);
      } else {
        wrap.appendChild(mono);
      }
      return wrap;
    }

    /* ================= right panel ================= */
    function visible() {
      return PARTNERS.filter(function (p) {
        if (cat !== ALL && (p.c || []).indexOf(cat) === -1) return false;
        if (query && p._searchText.indexOf(query) === -1) return false;
        return true;
      });
    }

    function iconBtn(cls, svg, label) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cansw-icon " + cls;
      b.innerHTML = svg;
      b.setAttribute("aria-label", label);
      return b;
    }

    function renderList() {
      var items = visible();
      listEl.innerHTML = "";
      if (!items.length) {
        var m = document.createElement("div");
        m.className = "cansw-empty-msg";
        m.textContent = "No partner matches that. Try a different word, or pick another category.";
        listEl.appendChild(m);
      }
      items.forEach(function (p) {
        var row = document.createElement("div");
        row.className = "cansw-row" + (inCart(p.n) > -1 ? " cansw-picked" : "");

        row.appendChild(logoNode(p));

        var mid = document.createElement("div");
        mid.className = "cansw-mid";
        var nameline = document.createElement("div");
        nameline.className = "cansw-nameline";
        nameline.innerHTML = '<span class="cansw-name">' + esc(p.n) + '</span>' +
          (p.t ? '<span class="cansw-trophy" title="Best deal this partner offers anywhere">&#127942;</span>' : '');
        mid.appendChild(nameline);

        var valwrap = document.createElement("div");
        valwrap.className = "cansw-valwrap";
        if (p._val) {
          valwrap.innerHTML = '<div class="cansw-val' + (p._included ? " cansw-val-free" : "") + '">' + esc(p._val) + '</div>' +
            (p._tag ? '<span class="cansw-tag cansw-tag-' + p._tag + '">' + p._tag + '</span>' : '');
        }
        mid.appendChild(valwrap);

        if (p.deal) {
          var d = document.createElement("div");
          d.className = "cansw-deal";
          d.textContent = p.deal;
          mid.appendChild(d);
        }
        row.appendChild(mid);

        var ctrls = document.createElement("div");
        ctrls.className = "cansw-ctrls";
        var multi = p._offers.length > 1;

        /* uncapped and free-inclusion partners are pickable too: they join the
           list without adding to the total (product-ui.md) */
        if (p._offers.length || p._uncapped || p._included) {
          var add = iconBtn("cansw-add", SVG_PLUS, (inCart(p.n) > -1 ? "Remove " : "Add ") + p.n);
          add.setAttribute("aria-pressed", inCart(p.n) > -1 ? "true" : "false");
          add.addEventListener("click", function () { togglePartner(p); });
          ctrls.appendChild(add);
        }
        if (multi) {
          var chev = iconBtn("cansw-chev", SVG_CHEV, (expanded[p.n] ? "Hide " : "Show ") + p.n + " offers");
          chev.setAttribute("aria-expanded", expanded[p.n] ? "true" : "false");
          chev.addEventListener("click", function () {
            expanded[p.n] = !expanded[p.n];
            renderList();
          });
          ctrls.appendChild(chev);
        }
        row.appendChild(ctrls);
        listEl.appendChild(row);

        if (multi && expanded[p.n]) {
          var box = document.createElement("div");
          box.className = "cansw-offers cansw-anim";
          p._offers.forEach(function (o) {
            var orow = document.createElement("div");
            orow.className = "cansw-offer";
            var on = document.createElement("div");
            on.className = "cansw-offer-name";
            on.textContent = o.name;
            var ov2 = document.createElement("div");
            ov2.className = "cansw-offer-val";
            ov2.textContent = fmt(o.save);
            var ci = inCart(p.n);
            var picked = ci > -1 && CART[ci].offer.i === o.i;
            var ob = iconBtn("cansw-add", SVG_PLUS, (picked ? "Remove " : "Add ") + p.n + " " + o.name);
            ob.setAttribute("aria-pressed", picked ? "true" : "false");
            ob.addEventListener("click", function () { pickOffer(p, o); });
            orow.appendChild(on); orow.appendChild(ov2); orow.appendChild(ob);
            box.appendChild(orow);
          });
          listEl.appendChild(box);
        }
      });

      var filtered = (cat !== ALL) || !!query;
      countEl.textContent = filtered
        ? items.length + " of " + PARTNERS.length + " partners"
        : PARTNERS.length + " partners";
    }

    function togglePartner(p) {
      var i = inCart(p.n);
      if (i > -1) CART.splice(i, 1);
      else {
        var o = defaultOffer(p);
        if (!o) return;
        CART.push({ n: p.n, offer: o });
      }
      renderList(); renderLeft();
    }
    function pickOffer(p, o) {
      var i = inCart(p.n);
      if (i > -1 && CART[i].offer.i === o.i) CART.splice(i, 1);
      else if (i > -1) CART[i].offer = o;
      else CART.push({ n: p.n, offer: o });
      renderList(); renderLeft();
    }

    /* ================= left panel ================= */
    function countUp(to) {
      var from = shownTotal;
      shownTotal = to;
      /* write the true figure FIRST. requestAnimationFrame does not fire in a
         backgrounded tab, and a stalled count-up must never leave a stale
         number on screen — the number is the argument. */
      heroEl.textContent = fmt(to);
      var gen = ++countGen;
      /* A hidden tab throttles requestAnimationFrame to roughly 1fps, so an
         animation started there crawls and leaves a wrong number on screen.
         Don't animate at all when hidden, and give every run a wall-clock
         backstop that finalises the figure and invalidates any late frame. */
      if (reduceMotion || from === to || document.hidden || !window.requestAnimationFrame) return;
      var t0 = null, dur = 250;
      clearTimeout(countTimer);
      countTimer = setTimeout(function () {
        if (gen !== countGen) return;
        countGen++;                     /* invalidates frames still in flight */
        heroEl.textContent = fmt(to);
      }, dur + 120);
      function step(ts) {
        if (gen !== countGen) return;   /* superseded, or already finalised */
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur);
        if (k < 1) {
          heroEl.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - k, 3)));
          requestAnimationFrame(step);
        } else {
          countGen++;
          clearTimeout(countTimer);
          heroEl.textContent = fmt(to);
        }
      }
      requestAnimationFrame(step);
    }

    function renderLeft() {
      var any = CART.length > 0;
      emptyEl.hidden = any;
      activeEl.hidden = !any;
      if (!any) { shownTotal = 0; return; }

      var total = 0, uncapped = 0;
      CART.forEach(function (e) {
        var p = byName(e.n);
        if (p && (p._uncapped || p._included)) { uncapped++; return; }
        total += e.offer.save;
      });

      countUp(total);

      if (uncapped > 0) {
        growEl.textContent = "plus " + uncapped + " uncapped deal" + (uncapped === 1 ? "" : "s") + " that grow" + (uncapped === 1 ? "s" : "") + " with you";
        growEl.hidden = false;
      } else {
        growEl.hidden = true;
      }

      picksEl.innerHTML = "";
      CART.forEach(function (e) {
        var p = byName(e.n);
        var r = document.createElement("div");
        r.className = "cansw-pick";
        var nm = document.createElement("div");
        nm.className = "cansw-pick-name";
        nm.textContent = e.n;
        if (p && !p._uncapped && !p._included && p._offers.length > 1) {
          var sub = document.createElement("span");
          sub.className = "cansw-pick-plan";
          sub.textContent = e.offer.name;
          nm.appendChild(sub);
        }
        var vl = document.createElement("div");
        vl.className = "cansw-pick-val";
        vl.textContent = (p && (p._uncapped || p._included)) ? p._val : fmt(e.offer.save);
        var x = document.createElement("button");
        x.type = "button";
        x.className = "cansw-pick-x";
        x.innerHTML = "&times;";
        x.setAttribute("aria-label", "Remove " + e.n);
        x.addEventListener("click", function () {
          var i = inCart(e.n);
          if (i > -1) CART.splice(i, 1);
          renderList(); renderLeft();
        });
        r.appendChild(nm); r.appendChild(vl); r.appendChild(x);
        picksEl.appendChild(r);
      });

      /* N counts the picks that produce the dollar figure. The uncapped ones
         are already spoken for on the grow line, and counting them here would
         make the arithmetic on this line look wrong. */
      var n = CART.length - uncapped;
      var ahead = total - MEMBERSHIP;
      profitEl.hidden = n === 0;   /* nothing but uncapped picks: no arithmetic to show */
      if (n > 0) {
        profitEl.innerHTML = n + " discount" + (n === 1 ? "" : "s") +
          " minus the $" + MEMBERSHIP + " membership &middot; <b>" +
          (ahead < 0 ? "−" + fmt(Math.abs(ahead)) : fmt(ahead)) + " ahead</b>";
      }
    }

    /* ================= controls ================= */
    var picker = $("canswPicker"), pBtn = $("canswPickerBtn"),
        pLabel = $("canswPickerLabel"), menu = $("canswMenu");

    function addOpt(name, count) {
      var o = document.createElement("button");
      o.type = "button";
      o.className = "cansw-opt";
      o.setAttribute("role", "option");
      o.setAttribute("aria-selected", String(name === cat));
      o.innerHTML = '<span>' + esc(name) + '</span>' +
        '<span class="cansw-opt-count">' + count + '</span>';
      o.addEventListener("click", function () { selectCat(name); });
      menu.appendChild(o);
      return o;
    }
    var OPTS = {};
    OPTS[ALL] = addOpt(ALL, PARTNERS.length);
    CAT_NAMES.forEach(function (n) { OPTS[n] = addOpt(n, CATS[n]); });

    function selectCat(name) {
      cat = name;
      pLabel.textContent = name;
      for (var n in OPTS) OPTS[n].setAttribute("aria-selected", String(n === name));
      toggleMenu(false);
      renderList();
    }
    function toggleMenu(open) {
      var isOpen = open !== undefined ? open : !picker.classList.contains("cansw-open");
      picker.classList.toggle("cansw-open", isOpen);
      pBtn.setAttribute("aria-expanded", String(isOpen));
    }
    pBtn.addEventListener("click", function () { toggleMenu(); });
    document.addEventListener("click", function (e) {
      if (!picker.contains(e.target)) toggleMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") toggleMenu(false);
    });

    var searchEl = $("canswSearch");
    searchEl.addEventListener("input", function () {
      query = (searchEl.value || "").trim().toLowerCase();
      renderList();
    });

    /* ---- capture + CTA ----
       A valid email captures then continues to the purchase flow. An empty or
       invalid one continues to the purchase flow and posts NOTHING. The path
       to purchase is never blocked. */
    function picksSummary() {
      return CART.map(function (e) {
        var p = byName(e.n);
        if (p && (p._uncapped || p._included)) return e.n + " (" + p._val + ")";
        return e.n + " " + e.offer.name + " (" + fmt(e.offer.save) + ")";
      }).join("; ");
    }
    function fireCapture(email) {
      if (!CFG.captureUrl) return;
      try {
        var body, type;
        if (CFG.captureUrl.indexOf("/forms/") > -1) {
          body = "form_submission%5Bname%5D=Widget%20Visitor" +
            "&form_submission%5Bemail%5D=" + encodeURIComponent(email) +
            "&form_submission%5Bcustom_5%5D=" + encodeURIComponent(CFG.captureTag) +
            "&form_submission%5Bcustom_6%5D=" + encodeURIComponent(location.href) +
            "&form_submission%5Bcustom_7%5D=" + encodeURIComponent("opted in " + new Date().toISOString()) +
            "&form_submission%5Bcustom_8%5D=" + encodeURIComponent(picksSummary());
          type = "application/x-www-form-urlencoded";
        } else {
          body = JSON.stringify({
            email: email, source: "savings-widget", tag: CFG.captureTag,
            page: location.href, at: new Date().toISOString(),
            optin: "opted in " + new Date().toISOString(), picks: picksSummary()
          });
          type = "text/plain";
        }
        fetch(CFG.captureUrl, {
          method: "POST", mode: "no-cors", credentials: "omit",
          headers: { "Content-Type": type }, body: body
        }).catch(function () {});
      } catch (e) {}
    }
    function goJoin() {
      if (CFG.unlinkCtas) return;
      var url = CFG.joinUrl || "";
      if (!url) return;
      if (url.charAt(0) === "#") {
        /* scroll to the checkout embedded on this page instead of navigating */
        var target = null;
        try { target = document.querySelector(url); } catch (e) {}
        if (!target) target = document.getElementById(url.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
          return;
        }
      }
      window.location.href = url;
    }
    $("canswCapture").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = ($("canswEmail").value || "").trim();
      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) fireCapture(v);
      goJoin();
    });
    if (CFG.unlinkCtas) $("canswCta").disabled = true;

    /* ---- open ---- */
    if (CFG.defaultCategory && (CFG.defaultCategory === ALL || CATS[CFG.defaultCategory])) {
      selectCat(CFG.defaultCategory);
    } else {
      renderList();
    }
    renderLeft();
  }

  /* ---------- data ----------
     cansw-data.json + numbers.json sit next to this script. numbers.json
     carries the AUTHORITATIVE headline figures written by the can-deal-numbers
     routine from Notion OFFER TRACKING. Never blocks: a failure just means the
     stat row falls back to the widget's own partner count. */
  var FALLBACK = { partners: [], logos: {} };
  var done = false;
  var useFallback = function () { if (!done) { done = true; init(FALLBACK); } };
  try {
    Promise.all([
      fetch(BASE + "cansw-data.json", { cache: "no-cache" })
        .then(function (r) { if (!r.ok) throw 0; return r.json(); }),
      fetch(BASE + "numbers.json", { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; })
    ]).then(function (res) {
      var d = res[0];
      if (res[1] && (res[1].partner_count || res[1].total_value)) NUMBERS = res[1];
      if (!done && d && d.partners && d.partners.length) { done = true; init(d); }
      else useFallback();
    }).catch(useFallback);
    setTimeout(useFallback, 4000);
  } catch (e) { useFallback(); }
})();
