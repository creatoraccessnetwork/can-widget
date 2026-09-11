/* CAN project page script (segment flavour of the v2 offer template). v1, 2026-09-10.
 * Renders the project hero, decision rows, the sticky "Which of these are you deciding on?" calculator,
 * the project total, the Upcoming events strip, the for-every-Creator strip, the pricing card and the "Pick another" card.
 * Mounts: #canseg-top (above the Kajabi checkout) and #canseg-end (below it).
 * Config: window.CANSEG = { seg, token, checkout }  (checkout = "#section-<checkout section id>")
 * Data, all next to this script: segments.json, segments-live.json, cansw-data.json, numbers.json.
 * Query string: seg (analytics only), stage (pre|under100k|over100k), platform (grow page), via, preview=slots.
 * Analytics: gtag / fbq / dataLayer when present. No new vendors.
 */
(function () {
  var C = window.CANSEG || {};
  if (!C.seg) return;
  var thisScript = document.currentScript || (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var BASE = window.CANSEG_BASE || (thisScript && thisScript.src ? thisScript.src.replace(/[^\/]*$/, "") : "");
  var CHECKOUT = C.checkout || "#section-1744906803654";
  var Q = {};
  (location.search || "").replace(/^\?/, "").split("&").forEach(function (kv) { if (!kv) return; var p = kv.split("="); Q[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || "").replace(/\+/g, " ")); });
  var STAGE = /^(pre|under100k|over100k)$/.test(Q.stage || "") ? Q.stage : "";
  var PLATFORM = /^(youtube|instagram|newsletter|other)$/.test(Q.platform || "") ? Q.platform : "";
  var STAGE_LINE = { pre: "Filtered for a business that isn't earning yet.", under100k: "Filtered for a business earning under $100k a year.", over100k: "Filtered for a business earning over $100k a year." };

  function track(name, params) {
    var p = {}; for (var k in (params || {})) p[k] = params[k];
    p.segment = C.seg; if (STAGE) p.stage = STAGE; if (PLATFORM) p.platform = PLATFORM; if (Q.via) p.via = Q.via;
    try { if (typeof window.gtag === "function") window.gtag("event", name, p); } catch (e) {}
    try { if (typeof window.fbq === "function") window.fbq("trackCustom", name.replace(/(^|_)(\w)/g, function (m, a, b) { return b.toUpperCase(); }), p); } catch (e) {}
    try { (window.dataLayer = window.dataLayer || []).push({ event: name, can: p }); } catch (e) {}
  }

  var CSS = "" +
".canseg{--t:#2A6478;--td:#1E4F5F;--rust:#9E614A;--ink:#1A1F2C;--ch:#374151;--mute:#5B6572;--bd:#E6EBF2;--hl:#EFF3F7;--s2:#FAFBFD;--disp:'Lato',system-ui,sans-serif;--body:'Open Sans',system-ui,sans-serif;--r:4px;font-family:var(--body);font-size:17px;line-height:26px;color:var(--ch);text-align:left;-webkit-font-smoothing:antialiased;max-width:1160px;margin:0 auto}" +
".canseg *{box-sizing:border-box}.canseg p{margin:0 0 16px;font-size:17px;line-height:26px;color:var(--ch)}.canseg h1,.canseg h2,.canseg h3{margin:0;color:var(--ink)}" +
".canseg a{color:var(--t);font-weight:700;text-decoration:none}.canseg a:hover{color:var(--td);text-decoration:underline}" +
".canseg .card{background:#fff;border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 3px 10px rgba(26,31,44,.10)}" +
".canseg .eyebrow{font-family:var(--body);font-size:15px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;line-height:18px;color:var(--rust);margin:0 0 16px}" +
".canseg .h1{font-family:var(--disp);font-weight:900;font-size:44px;line-height:1.1;letter-spacing:-.8px;color:var(--ink);margin:0 0 20px;text-wrap:balance}" +
".canseg .h2{font-family:var(--disp);font-weight:900;font-size:32px;line-height:1.12;letter-spacing:-.6px;color:var(--ink);margin:0 0 12px}" +
".canseg .h3{font-family:var(--body);font-weight:700;font-size:17px;line-height:26px;color:var(--ink)}" +
".canseg .meta{font-size:15px;line-height:22px;color:var(--mute)}.canseg .lead{color:var(--ink);font-weight:700}.canseg .num{font-family:var(--disp);font-weight:700;color:var(--t);font-variant-numeric:tabular-nums}" +
".canseg .btn,.canseg .btn:visited{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 24px;border:0;border-radius:var(--r);cursor:pointer;font-family:var(--body);font-weight:700;font-size:17px;background:var(--rust);color:#fff!important;white-space:nowrap;transition:background 150ms ease;text-decoration:none!important}.canseg .btn:hover{background:#87503D}" +
".canseg .btn.sec{background:var(--t)}.canseg .btn.sec:hover{background:var(--td)}.canseg .btn.lg{height:52px;padding:0 32px}.canseg .btn.block{width:100%}" +
".canseg .ghost{background:none;border:1px dashed #C9D4E0;color:var(--mute);font-weight:600;height:44px;border-radius:var(--r);padding:0 20px;font:inherit;font-size:15px;cursor:pointer;width:100%}.canseg .ghost:hover{border-color:var(--t);color:var(--t)}" +
".canseg :where(a,button,input,select,[tabindex]):focus-visible{outline:2px solid var(--t);outline-offset:2px}" +
".canseg .hero{padding:40px 44px;text-align:center;max-width:960px;margin:0 auto 32px}.canseg .hero .what{font-size:19px;line-height:28px;max-width:820px;margin:0 auto 12px}.canseg .hero .stagel{font-size:15px;line-height:22px;color:var(--mute);margin:0 0 20px}" +
".canseg .stats{display:inline-grid;grid-template-columns:1fr 1fr;gap:0 32px;margin:8px auto 24px;text-align:left}.canseg .stat .num{font-size:30px;line-height:32px;display:block}.canseg .stat .micro{font-size:13px;line-height:18px;letter-spacing:1.2px;text-transform:uppercase;font-weight:600;color:var(--mute);display:block;margin-top:4px}.canseg .stat+.stat{border-left:1px solid var(--hl);padding-left:32px}" +
".canseg .cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:0 0 8px}" +
".canseg .unlock{display:flex;align-items:stretch;max-width:560px;margin:0 auto 12px;border-radius:var(--r);filter:drop-shadow(0 6px 14px rgba(26,31,44,.16))}.canseg .unlock input{flex:1 1 240px;min-width:0;height:52px!important;min-height:0;border:1px solid var(--bd);border-right:0;border-radius:var(--r) 0 0 var(--r);padding:0 16px;font:inherit;font-size:17px;line-height:normal;color:var(--ink);background:#fff;margin:0!important;box-shadow:none}" +
".canseg .unlock .btn{height:52px!important;min-height:0;line-height:1;padding:0 28px;margin:0!important;border-radius:0 var(--r) var(--r) 0;flex:none}.canseg .unlock .btn:disabled{opacity:.7;cursor:not-allowed}" +
".canseg .unote{font-size:15px;line-height:22px;color:var(--mute);text-align:center;margin:0}.canseg .unote.ok{color:var(--t);font-weight:600}.canseg .unote.err{color:var(--rust)}" +
"@media (max-width:600px){.canseg .unlock{flex-wrap:wrap}.canseg .unlock input{flex:1 1 100%;border-right:1px solid var(--bd);border-radius:var(--r) var(--r) 0 0}.canseg .unlock .btn{width:100%;border-radius:0 0 var(--r) var(--r)}}" +
".canseg .two{display:grid;grid-template-columns:1.15fr .85fr;gap:24px;align-items:start}" +
".canseg .grp{padding:6px 22px 8px;margin-bottom:16px}.canseg .grp .gt{font-size:13px;line-height:18px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--t);padding:14px 0 6px}" +
".canseg .row{display:grid;grid-template-columns:36px 1fr auto;gap:14px;align-items:center;padding:12px 0;border-top:1px solid var(--hl);transition:background 150ms ease}.canseg .row.sel{background:#F4F8FA;margin:0 -12px;padding-left:12px;padding-right:12px}.canseg .row.off,.canseg .grp.off{display:none}" +
".canseg .logo{width:36px;height:36px;border-radius:var(--r);border:1px solid var(--bd);background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:12px;font-weight:800;color:var(--t)}.canseg .logo img{width:100%;height:100%;object-fit:contain}" +
".canseg .mid{min-width:0}.canseg .nm{font-weight:700;color:var(--ink);font-size:17px;line-height:24px}.canseg .term{font-size:15px;line-height:22px;color:var(--ch)}.canseg .desc{font-size:15px;line-height:22px;color:var(--mute)}.canseg .who{font-size:13px;line-height:18px;color:var(--mute);margin-top:2px}.canseg .grows{display:inline-block;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.9px;line-height:14px;padding:2px 6px;border-radius:var(--r);background:rgba(42,100,120,.10);color:var(--t);margin:4px 0 2px}" +
".canseg .right{display:grid;grid-template-columns:auto 32px;gap:10px;align-items:center}.canseg .val{text-align:right;min-width:72px}.canseg .val .v{font-weight:700;color:var(--t);font-variant-numeric:tabular-nums;font-size:17px;line-height:24px;display:block}.canseg .val .v.free{color:var(--rust)}.canseg .val .vl{display:block;font-size:11px;line-height:14px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:var(--mute)}.canseg .upto{font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:600;color:var(--mute)}" +
".canseg .tag{display:inline-block;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.9px;line-height:14px;padding:1px 6px;border-radius:var(--r);background:rgba(42,100,120,.10);color:var(--t)}.canseg .tag.perk{background:rgba(193,122,94,.12);color:var(--rust)}" +
".canseg .add{width:32px;height:32px;border-radius:50%;border:1px solid var(--bd);background:#fff;color:var(--t);font-weight:800;font-size:18px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;font-family:inherit;transition:background 150ms ease}.canseg .add:hover{background:var(--s2)}.canseg .add.on{background:var(--t);color:#fff;border-color:var(--t)}.canseg .add:disabled{opacity:.45;cursor:not-allowed}" +
".canseg select.plan{grid-column:2/-1;height:36px;border:1px solid var(--bd);border-radius:var(--r);padding:0 8px;font:inherit;font-size:14px;color:var(--ink);background:var(--s2);max-width:360px}" +
".canseg .note{grid-column:2/-1;font-size:13px;line-height:18px;color:var(--mute)}" +
".canseg .calc{padding:24px;position:sticky;top:24px}.canseg .calc .h2{font-size:26px}.canseg .rlist{border:1px solid var(--bd);border-radius:var(--r);background:var(--s2);min-height:88px;max-height:280px;overflow-y:auto;margin:12px 0 0}.canseg .rrow{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--hl);font-size:15px;line-height:22px}.canseg .rrow:last-child{border-bottom:0}.canseg .rrow .rn{flex:1;color:var(--ink);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.canseg .rrow .rv{font-weight:700;color:var(--t);font-variant-numeric:tabular-nums;min-width:64px;text-align:right}.canseg .rrow button{background:none;border:0;color:var(--mute);cursor:pointer;font-size:16px;padding:0 0 0 6px;font-family:inherit}" +
".canseg .empty{padding:24px 12px;color:var(--mute);font-size:15px;line-height:22px}" +
".canseg .rtot{display:flex;justify-content:space-between;align-items:baseline;padding:14px 0 0}.canseg .rtot .lab{color:var(--ch);font-weight:600}.canseg .rtot .val{font-family:var(--disp);font-weight:700;color:var(--t);font-size:30px;font-variant-numeric:tabular-nums;min-width:0}.canseg .rsub{font-size:15px;line-height:22px;color:var(--mute);margin:4px 0 16px}" +
".canseg .strip{padding:22px 24px;margin-top:24px}.canseg .strip .h3{margin-bottom:4px}.canseg .mini{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:12px}.canseg .mini .m{display:flex;gap:10px;align-items:center}.canseg .mini .m .logo{width:32px;height:32px}.canseg .mini .m .nm{font-size:15px;line-height:20px}.canseg .mini .m .term{font-size:13px;line-height:18px;color:var(--mute)}.canseg .mini .m .v{font-weight:700;color:var(--t);font-size:15px;white-space:nowrap}.canseg .mini.ev{grid-template-columns:repeat(2,1fr);gap:20px 32px}.canseg .mini.ev .m{align-items:flex-start}.canseg .mini.ev .m .logo{width:40px;height:40px;flex:none}.canseg .mini.ev .m .term{color:var(--ch);font-size:15px;line-height:22px}" +
".canseg .slot{padding:24px;margin-top:24px;border:2px dashed #C9D4E0;box-shadow:none;background:var(--s2)}.canseg .quote{padding:32px 36px;margin-top:24px;display:grid;grid-template-columns:96px 1fr;gap:24px;align-items:center}.canseg .quote img{width:96px;height:96px;border-radius:50%;object-fit:cover;border:1px solid var(--bd)}.canseg .quote .q{font-family:var(--disp);font-weight:700;font-size:24px;line-height:1.3;color:var(--ink)}" +
".canseg .price-card{max-width:520px;margin:0 auto;padding:32px}.canseg .price{font-family:var(--disp);font-weight:700;color:var(--t);font-size:48px;line-height:1.05;letter-spacing:-1px;font-variant-numeric:tabular-nums;margin:8px 0 16px}.canseg .price small{font-family:var(--body);font-weight:600;font-size:17px;letter-spacing:0;color:var(--mute);margin-left:4px}" +
".canseg .checks{list-style:none;padding:0;margin:0 0 8px}.canseg .checks li{display:flex;gap:10px;align-items:flex-start;padding:6px 0}.canseg .chk{flex:none;width:18px;height:18px;border-radius:50%;background:var(--t);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;margin-top:4px}" +
".canseg .lock{background:var(--s2);border:1px solid var(--bd);border-radius:var(--r);padding:12px 14px;font-size:15px;line-height:22px;color:var(--ch);margin:16px 0}.canseg .fine{font-size:15px;line-height:22px;color:var(--mute);margin:8px 0 0;text-align:center}" +
".canseg .center{text-align:center;max-width:720px;margin:0 auto 24px}.canseg .pick{max-width:620px;margin:40px auto 0;padding:28px;text-align:center}" +
".canseg-sticky{display:none}" +
"@media (max-width:900px){.canseg .two{grid-template-columns:1fr}.canseg .calc{position:static}.canseg .h1{font-size:34px}.canseg .h2{font-size:26px}.canseg .hero{padding:28px 20px}.canseg .hero .what{font-size:17px;line-height:26px}.canseg .stats{grid-template-columns:1fr 1fr;gap:0 20px}.canseg .stat .num{font-size:26px}.canseg .stat+.stat{padding-left:20px}.canseg .mini{grid-template-columns:1fr 1fr}.canseg .quote{grid-template-columns:1fr;text-align:center}.canseg .quote img{margin:0 auto}.canseg .row{grid-template-columns:32px 1fr auto;gap:10px}.canseg .val{min-width:0}" +
".canseg-sticky{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:40;background:#fff;border-top:1px solid #E6EBF2;padding:10px 16px;gap:8px;align-items:center;justify-content:space-between;font-family:'Open Sans',system-ui,sans-serif}.canseg-sticky .s-num{font-family:'Lato',system-ui,sans-serif;font-weight:700;color:#2A6478;white-space:nowrap;font-variant-numeric:tabular-nums}.canseg-sticky .s-lab{font-size:12px;color:#5B6572;display:block;line-height:14px}.canseg-sticky .btn{height:40px;padding:0 16px;display:inline-flex;align-items:center;border-radius:4px;background:#9E614A;color:#fff!important;font-weight:700;text-decoration:none!important}body{padding-bottom:68px}}" +
"@media (max-width:600px){.canseg .mini,.canseg .mini.ev{grid-template-columns:1fr}}";
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function unclip(el) {
    // position:sticky needs no ancestor with overflow:hidden (Kajabi's theme puts overflow-x:hidden on body). clip keeps the clipping without creating a scroll container.
    try {
      for (var a = el && el.parentNode; a && a.nodeType === 1 && a !== document.documentElement; a = a.parentNode) {
        var cs = getComputedStyle(a);
        if (cs.overflowX === "hidden") a.style.setProperty("overflow-x", "clip", "important");
        if (cs.overflowY === "hidden") a.style.setProperty("overflow-y", "clip", "important");
      }
    } catch (e) {}
  }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function initials(n) { return (n || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 1).toUpperCase() || "•"; }
  function fetchJSON(url, cb) {
    var done = false; var t = setTimeout(function () { if (!done) { done = true; cb(null); } }, 6000);
    try { fetch(url, { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (!done) { done = true; clearTimeout(t); cb(j); } }).catch(function () { if (!done) { done = true; cb(null); } }); }
    catch (e) { if (!done) { done = true; cb(null); } }
  }

  function render(CFG, LIVE, DATA, NUM) {
    var seg = null; CFG.segments.forEach(function (s) { if (s.slug === C.seg) seg = s; });
    var top = document.getElementById("canseg-top"), end = document.getElementById("canseg-end");
    if (!seg || !top) return;
    var live = (LIVE.segments || {})[seg.slug] || { rows: {}, partner_count: 0, total_display: "", total_exact: 0 };
    var byName = {}; (DATA.partners || []).forEach(function (p) { byName[p.n] = p; });
    var logos = DATA.logos || {};
    var COST = +CFG.membership_cost || 49;
    var UNC = { "ShopYourLikes": 1, "Insense": 1, "Driff": 1, "TopFan": 1 };
    var picks = {}, order = [];

    // --- build the flat row list (stage filter, platform order) --------------------------------------
    var groups = seg.decisions.slice();
    if (PLATFORM) groups.sort(function (a, b) { return (a.platform === PLATFORM ? -1 : 0) - (b.platform === PLATFORM ? -1 : 0); });
    var rows = [];
    groups.forEach(function (g) {
      g.rows.forEach(function (r) {
        if (STAGE && r.stage && r.stage.indexOf(STAGE) < 0) return;
        var p = byName[r.n] || {}, lv = live.rows[r.n] || {};
        var plans = (p.plans || []).filter(function (x) { return x.save != null; });
        var high = lv.high, low = lv.low;
        var usePlans = plans.length > 1 && high != null && Math.max.apply(null, plans.map(function (x) { return x.save; })) === high;
        rows.push({ g: g.title, n: r.n, term: r.term, who: r.who, grows: r.grows, note: r.note, nofigure: !!r.nofigure,
          counted: lv.counted !== false && !r.nofigure && r.count !== false, uncapped: !!(UNC[r.n] || lv.uncapped), included: r.n === "Insense",
          trophy: !!p.t && r.trophy !== false, desc: (CFG.desc_overrides || {})[r.n] || p.desc || "", high: high, low: low, openEnded: !!lv.open_ended, oneTime: !!r.one_time, plans: usePlans ? plans : [], logo: logos[r.n] });
      });
    });
    var h1 = seg.h1; if (PLATFORM && seg.h1_by_platform && seg.h1_by_platform[PLATFORM]) h1 = seg.h1_by_platform[PLATFORM];

    // --- hero ---------------------------------------------------------------------------------------
    var html = '<div class="canseg" id="top">' +
      '<div class="card hero">' +
        '<p class="eyebrow">' + esc(seg.eyebrow) + '</p>' +
        '<h1 class="h1">' + esc(h1) + '</h1>' +
        '<p class="what">' + esc(CFG.what_can_is) + '</p>' +
        (STAGE ? '<p class="stagel">' + esc(STAGE_LINE[STAGE]) + '</p>' : '') +
        '<div class="stats"><div class="stat"><span class="num">' + esc(live.total_display || "") + '</span><span class="micro">in savings</span></div>' +
        '<div class="stat"><span class="num">' + esc(live.partner_count) + '</span><span class="micro">discounts</span></div></div>' +
        '<form class="unlock" data-role="unlock" novalidate><input type="email" placeholder="Your email" aria-label="Email" autocomplete="email" required><button type="submit" class="btn lg">Unlock Access</button></form>' +
        '<p class="unote" data-role="unote">One discount pays for the membership. Your rate never goes up, even when the price does.</p>' +
      '</div>' +
      '<div class="two">' +
        '<div>' +
          '<div class="card grp" style="padding-top:20px;padding-bottom:16px"><h2 class="h2" style="font-size:26px;margin-bottom:4px">Pick what you\'re deciding on.</h2><p class="meta" style="margin:0">Each figure is what that discount is worth. Tap + to add a tool to your savings. Where competing platforms share a line, you\'ll pick one.</p></div>' +
          '<div data-role="groups"></div>' +
          '<div data-role="more"></div>' +
        '</div>' +
        '<div class="card calc" id="canseg-calc">' +
          '<p class="eyebrow" style="margin-bottom:8px">Your savings</p>' +
          '<h2 class="h2">Which of these are you deciding on?</h2>' +
          '<p class="meta" style="margin:0">Add the tools on your list. The receipt writes itself.</p>' +
          '<div class="rlist" data-role="rlist"><div class="empty">Nothing picked yet. Add a tool from the list.</div></div>' +
          '<div class="rtot"><span class="lab">Savings on your picks</span><span class="val" data-role="rtotal">$0</span></div>' +
          '<div class="rsub" data-role="rsub">Membership is $' + COST + '/year. Add a pick to see your net.</div>' +
          '<a class="btn block" href="' + CHECKOUT + '" data-track="calculator">Join for $' + COST + '/year</a>' +
          '<p class="fine">Locked in for life. Not ready? <a href="' + esc(CFG.starter_url) + '">Unlock the Starter Set free</a>.</p>' +
        '</div>' +
      '</div>' +
      '<div data-role="events"></div>' +
      '<div data-role="testimonial"></div>' +
      '<div data-role="every"></div>' +
      '<div data-role="proof"></div>' +
    '</div>' +
    '<div class="canseg-sticky"><span><span class="s-lab">Savings on your picks</span><span class="s-num" data-role="stotal">$0</span></span><a class="btn" href="' + CHECKOUT + '" data-track="sticky">Join for $' + COST + '</a></div>';
    top.innerHTML = html;
    var q = function (r) { return top.querySelector('[data-role="' + r + '"]'); };
    unclip(document.getElementById("canseg-calc"));

    // --- Unlock Access (2026-09-10): shared can-unlock.js collects the email (Kajabi form 2149650486), drops to the
    //     checkout and prefills its email field (a <pds-input> web component on Kajabi's checkout).
    (function () {
      var cfg = { form: q("unlock"), note: q("unote"), okClass: "unote ok", errClass: "unote err", tag: "unlock-access:segment:" + C.seg, checkout: CHECKOUT,
        source: "hero", picks: function () { return order.join("; "); }, track: function (n, p) { track(n, p); } };
      if (window.canUnlockBind) window.canUnlockBind(cfg);
      else { var sc = document.createElement("script"); sc.src = BASE + "can-unlock.js"; sc.async = true; sc.onload = function () { if (window.canUnlockBind) window.canUnlockBind(cfg); }; document.head.appendChild(sc); }
    })();

    // --- decision rows -------------------------------------------------------------------------------
    var LIMIT = 8, shownPartners = {}, hiddenCount = 0;
    var groupsEl = q("groups");
    var lastG = null, gEl = null;
    rows.forEach(function (r, i) {
      if (r.g !== lastG) { gEl = document.createElement("div"); gEl.className = "card grp"; gEl.innerHTML = '<div class="gt">' + esc(r.g) + '</div>'; groupsEl.appendChild(gEl); lastG = r.g; }
      var visible = Object.keys(shownPartners).length < LIMIT || shownPartners[r.n];
      shownPartners[r.n] = 1; if (!visible) hiddenCount++;
      var row = document.createElement("div"); row.className = "row" + (visible ? "" : " off"); row.setAttribute("data-n", r.n);
      var valHtml;
      if (r.nofigure) valHtml = '<span class="v" style="color:var(--mute)">—</span><span class="tag">confirming</span>';
      else if (r.uncapped) valHtml = '<span class="v">' + esc({ "ShopYourLikes": "80/20", "TopFan": "87%", "Driff": "90/10" }[r.n] || "rate") + '</span><span class="tag">uncapped</span>';
      else if (r.included) valHtml = '<span class="v free">Free</span><span class="tag perk">included</span>';
      else if (r.high != null && r.high > 0) valHtml = '<span class="vl">You save</span><span class="v">' + (r.low !== r.high ? '<span class="upto">up to </span>' : "") + money(r.high) + (r.openEnded && r.low === r.high ? "+" : "") + '</span>';
      else if (r.high === 0) valHtml = '<span class="v free">Free</span>';
      else if (r.oneTime) valHtml = '<span class="tag">one-time</span>';
      else valHtml = '<span class="v" style="color:var(--mute)">—</span>';
      row.innerHTML =
        '<div class="logo">' + (r.logo ? '<img src="' + esc(r.logo) + '" alt="" loading="lazy">' : esc(initials(r.n))) + '</div>' +
        '<div class="mid"><div class="nm">' + esc(r.n) + (r.trophy ? " 🏆" : "") + '</div>' +
          (r.grows ? '<span class="grows">' + esc(r.grows) + '</span>' : '') +
          '<div class="term">' + esc(r.term) + '</div>' +
          (r.desc ? '<div class="desc">' + esc(r.desc) + '</div>' : '') +
          '<div class="who">' + esc(r.who) + (r.note ? ' · ' + esc(r.note) : '') + '</div></div>' +
        '<div class="right"><div class="val">' + valHtml + '</div><button class="add" type="button" aria-label="Add ' + esc(r.n) + ' to your savings" aria-pressed="false">+</button></div>';
      var img = row.querySelector("img"); if (img) img.addEventListener("error", function () { this.parentNode.textContent = initials(r.n); });
      var btn = row.querySelector("button.add");
      if (r.nofigure) { btn.disabled = true; btn.title = "Figure being confirmed"; }
      var sel = null;
      if (r.plans.length) {
        sel = document.createElement("select"); sel.className = "plan"; sel.style.display = "none"; sel.setAttribute("aria-label", "Plan for " + r.n);
        r.plans.forEach(function (x) { var o = document.createElement("option"); o.value = x.name; o.textContent = x.name + (x.price ? " · " + money(x.price) + (x.per ? "/" + x.per : "") : "") + " · save " + money(x.save); sel.appendChild(o); });
        row.appendChild(sel);
        sel.addEventListener("change", function () { var x = r.plans.filter(function (y) { return y.name === sel.value; })[0]; if (x && picks[r.n]) { picks[r.n].save = x.save; picks[r.n].plan = x.name; update(); } });
      }
      btn.addEventListener("click", function () {
        if (picks[r.n]) { delete picks[r.n]; order = order.filter(function (x) { return x !== r.n; }); btn.classList.remove("on"); btn.textContent = "+"; btn.setAttribute("aria-pressed", "false"); row.classList.remove("sel"); if (sel) sel.style.display = "none"; track("segment_pick", { partner: r.n, picked: false }); }
        else {
          var save = r.high || 0, plan = "";
          if (r.plans.length) { var ok = r.plans.filter(function (x) { return x.save > COST; }).sort(function (a, b) { return a.save - b.save; }); var d = ok[0] || r.plans.slice().sort(function (a, b) { return b.save - a.save; })[0]; save = d.save; plan = d.name; sel.value = d.name; sel.style.display = "block"; }
          picks[r.n] = { name: r.n, save: save, plan: plan, uncapped: r.uncapped, included: r.included, counted: r.counted }; order.push(r.n);
          btn.classList.add("on"); btn.textContent = "✓"; btn.setAttribute("aria-pressed", "true"); row.classList.add("sel"); track("segment_pick", { partner: r.n, picked: true });
        }
        update();
      });
      gEl.appendChild(row);
    });
    // a group whose rows are all folded away folds with them until "See all"
    groupsEl.querySelectorAll(".grp").forEach(function (g) { if (g.querySelectorAll(".row").length && !g.querySelectorAll(".row:not(.off)").length) g.classList.add("off"); });
    if (hiddenCount) {
      var more = document.createElement("button"); more.className = "ghost"; more.type = "button"; more.textContent = "See all " + live.partner_count + " partners";
      more.addEventListener("click", function () { top.querySelectorAll(".row.off, .grp.off").forEach(function (el) { el.classList.remove("off"); }); more.remove(); track("segment_see_all"); });
      q("more").appendChild(more);
    }
    // upcoming events: global list plus any per-segment strips, full width, never counted
    var events = [], seenEv = {};
    (CFG.events || []).concat(seg.strips || []).forEach(function (e) { if (!seenEv[e.n]) { seenEv[e.n] = 1; events.push(e); } });
    if (events.length) {
      var evLive = LIVE.events || {};
      q("events").innerHTML = '<div class="card strip"><p class="eyebrow" style="margin-bottom:4px">Upcoming events</p><div class="h3">Member pricing on this year\'s Creator events.</div><div class="mini ev">' +
        events.map(function (e) {
          var lv = evLive[e.n] || live.rows[e.n] || {}, p = byName[e.n] || {};
          var v = lv.high ? (lv.low !== lv.high ? "up to " : "") + money(lv.high) : "";
          return '<div class="m"><div class="logo">' + (logos[e.n] ? '<img src="' + esc(logos[e.n]) + '" alt="">' : esc(initials(e.n))) + '</div><div><div class="nm">' + esc(e.n) + (p.t ? " 🏆" : "") + '</div><div class="term">' + esc(e.term) + '</div><div class="who">' + esc(e.who) + (e.when ? ' · ' + esc(e.when) : '') + '</div></div>' + (v ? '<div class="v" style="margin-left:auto">' + v + '</div>' : '') + '</div>';
        }).join("") +
        '</div><p class="meta" style="margin:12px 0 0">One-time tickets, not counted in the total above.</p></div>';
    }

    // --- testimonial slot (marked; renders only when filled, or with ?preview=slots) -------------------
    var tEl = q("testimonial");
    if (seg.testimonial && seg.testimonial.quote) {
      var tm = seg.testimonial;
      tEl.innerHTML = '<div class="card quote"><img src="' + esc(tm.headshot) + '" alt="' + esc(tm.name) + '"><div><div class="q">“' + esc(tm.quote) + '”</div><p class="meta" style="margin:10px 0 0"><a href="' + esc(tm.social_url) + '" target="_blank" rel="noopener">' + esc(tm.name) + '</a> · saved ' + esc(tm.dollar) + ' on ' + esc(tm.discount) + '</p></div></div>';
    } else {
      tEl.innerHTML = '<!-- TESTIMONIAL SLOT: segment "' + esc(seg.slug) + '". Fill segments.json > testimonial {name, headshot, social_url, quote, dollar, discount} with a real, permissioned member quote. Nothing renders until then. -->' +
        (Q.preview === "slots" ? '<div class="card slot"><div class="h3">Testimonial placeholder - ' + esc(seg.name) + '</div><p class="meta" style="margin:4px 0 0">Named member, real headshot, linked social, dollar figure, the discount redeemed, permission on record. Not visible to visitors.</p></div>' : '');
    }

    // --- for every Creator strip ---------------------------------------------------------------------
    var onPage = {}; rows.forEach(function (r) { onPage[r.n] = 1; });
    var everyNames = (CFG.every_creator_strip || []).filter(function (n) { return !onPage[n]; }).slice(0, +CFG.every_creator_show || 4);
    if (everyNames.length) {
      var el = q("every"), es = LIVE.every_creator_strip || {};
      el.innerHTML = '<div class="card strip"><p class="eyebrow" style="margin-bottom:4px">For every Creator</p><div class="h3">Business-side discounts every member gets, whatever the project.</div><div class="mini">' +
        everyNames.map(function (n) { var p = byName[n] || {}, lv = es[n] || {}; var v = lv.high ? (lv.low !== lv.high ? "up to " : "") + money(lv.high) : ""; return '<div class="m"><div class="logo">' + (logos[n] ? '<img src="' + esc(logos[n]) + '" alt="">' : esc(initials(n))) + '</div><div><div class="nm">' + esc(n) + (p.t ? " 🏆" : "") + '</div><div class="term">' + esc(p.deal || "") + '</div>' + (v ? '<div class="v">' + v + '</div>' : '') + '</div></div>'; }).join("") +
        '</div><p class="meta" style="margin:12px 0 0">Not counted in the project total above. <a href="' + esc(CFG.home_url) + 'partners">Browse every partner</a>.</p></div>';
    }

    // --- member wins (can-testimonials.js, shared with the homepage and the v2 offer pages) ---------------
    // Sits at the bottom of the project section, directly above the Kajabi checkout section. 2026-09-10.
    (function () {
      var pEl = q("proof"); if (!pEl) return;
      pEl.innerHTML = '<div id="can-testimonials-mount" style="margin-top:8px"></div>';
      window.CANTESTI = { surface: "pattern", rows: ["members"], compact: true, eyebrow: "Member wins", headline: "One discount covered the membership. Here are the receipts." };
      window.CANTESTI_BASE = BASE;
      var sc = document.createElement("script"); sc.src = BASE + "can-testimonials.js"; sc.async = true; document.head.appendChild(sc);
    })();

    // --- receipt ------------------------------------------------------------------------------------
    var rlist = q("rlist"), rtotal = q("rtotal"), rsub = q("rsub"), stotal = q("stotal");
    var shown = 0, reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    function countTo(target) {
      if (reduce) { rtotal.textContent = money(target); shown = target; return; }
      var start = shown, t0 = performance.now();
      (function step(t) { var k = Math.min(1, (t - t0) / 250); var v = start + (target - start) * (1 - Math.pow(1 - k, 3)); rtotal.textContent = money(v); if (k < 1) requestAnimationFrame(step); else shown = target; })(t0);
    }
    function update() {
      if (!order.length) { rlist.innerHTML = '<div class="empty">Nothing picked yet. Add a tool from the list.</div>'; rtotal.textContent = "$0"; if (stotal) stotal.textContent = "$0"; shown = 0; rsub.textContent = "Membership is $" + COST + "/year. Add a pick to see your net."; return; }
      rlist.innerHTML = ""; var total = 0, unc = 0;
      order.forEach(function (n) {
        var v = picks[n]; var d = document.createElement("div"); d.className = "rrow";
        d.innerHTML = '<span class="rn">' + esc(v.name) + (v.plan && v.plan !== "—" ? " · " + esc(v.plan) : "") + '</span><span class="rv">' + (v.uncapped ? "uncapped" : v.included ? "included" : money(v.save)) + '</span><button type="button" aria-label="Remove ' + esc(v.name) + '">×</button>';
        d.querySelector("button").addEventListener("click", function () { var b = top.querySelector('.row[data-n="' + CSS_escape(n) + '"] button.add'); if (b) b.click(); });
        rlist.appendChild(d);
        if (v.uncapped) unc++; else if (!v.included) total += v.save || 0;
      });
      countTo(total); if (stotal) stotal.textContent = money(total);
      var net = total - COST;
      rsub.textContent = (net >= 0 ? "That's " + money(net) + " ahead after the $" + COST + " membership" : "Add one more and you're past the $" + COST + " membership") + (unc ? ", plus " + unc + " uncapped discount" + (unc > 1 ? "s" : "") + " that grow with you." : ".");
    }
    function CSS_escape(s) { return (window.CSS && CSS.escape) ? CSS.escape(s) : String(s).replace(/["\\]/g, "\\$&"); }

    // --- end mount: pricing card + pick another ------------------------------------------------------
    if (end) {
      var total = (NUM && NUM.total_value) || "", count = (NUM && NUM.partner_count) || "";
      end.innerHTML = '<div class="canseg">' +
        '<div class="center"><p class="eyebrow">Membership</p><h2 class="h2">Save thousands for just $' + COST + '/year.</h2><p>It pays for itself.</p></div>' +
        '<div class="card price-card"><div class="h3">CAN Membership</div><div class="price">$' + COST + '<small>/year</small></div>' +
          '<ul class="checks">' +
            '<li><span class="chk">✓</span><span><span class="lead">' + esc(live.total_display || "") + '</span> in savings across ' + esc(live.partner_count) + ' partners for this project</span></li>' +
            (total ? '<li><span class="chk">✓</span><span><span class="lead">' + esc(total) + '</span> in savings across ' + esc(count) + ' partners in the full catalog</span></li>' : '') +
            '<li><span class="chk">✓</span><span>Higher affiliate payouts on <span class="lead">20,000+ brands</span> through ShopYourLikes</span></li>' +
            '<li><span class="chk">✓</span><span><span class="lead">New discounts</span> added monthly</span></li>' +
          '</ul>' +
          '<div class="lock"><span class="lead">Locked in for life:</span> join at $' + COST + '/year and your rate never goes up, even when the price does.</div>' +
          '<a class="btn lg block" href="#popup_checkout_' + esc(C.token) + '" data-track="pricing">Join for $' + COST + '/year</a>' +
          '<p class="fine">Not ready? <a href="' + esc(CFG.starter_url) + '">Unlock the Starter Set free</a>.</p>' +
        '</div>' +
        '<div class="card pick"><h2 class="h2" style="font-size:26px">Not your project? Pick another.</h2><p class="meta">Three quick questions and you\'re on the right page.</p><a class="btn sec" href="' + esc(CFG.quiz_url) + '" data-track="pick-another">Back to the quiz</a></div>' +
      '</div>';
    }
    document.querySelectorAll("#canseg-top [data-track], #canseg-end [data-track]").forEach(function (a) { a.addEventListener("click", function () { track("segment_join_click", { location: a.getAttribute("data-track") }); }); });
    track("segment_page_view", { partners_shown: rows.length });
  }

  function start() {
    var CFG, LIVE, DATA, NUM, pending = 4, domReady = document.readyState !== "loading";
    function go() { if (pending || !domReady) return; if (!CFG || !LIVE || !DATA) { var m = document.getElementById("canseg-top"); if (m) m.innerHTML = '<div class="canseg"><div class="card hero"><p>The partner list is loading slowly. <a href="https://www.creatoraccessnetwork.com/partners">Browse every partner</a>.</p></div></div>'; return; } render(CFG, LIVE, DATA, NUM || {}); }
    if (!domReady) document.addEventListener("DOMContentLoaded", function () { domReady = true; go(); });
    fetchJSON(BASE + "segments.json", function (j) { CFG = j; pending--; go(); });
    fetchJSON(BASE + "segments-live.json", function (j) { LIVE = j; pending--; go(); });
    fetchJSON(BASE + "cansw-data.json", function (j) { DATA = j; pending--; go(); });
    fetchJSON(BASE + "numbers.json", function (j) { NUM = j; pending--; go(); });
  }
  start();
})();
