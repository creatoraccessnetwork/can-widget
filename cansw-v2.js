/* CAN Savings Widget v2 - two-panel "pick what you're about to buy" receipt widget.
 * Mounts into #cansw-mount (created next to the script tag if missing).
 * Data: cansw-data.json + numbers.json next to this script (BASE derived from script src).
 * Overrides via window.CANSW_OVERRIDES:
 *   joinUrl (default "#pricing"), starterUrl (default "#top"), membershipCost (49),
 *   pin (partner name to float to top), demote [names], hide [names],
 *   numbers {partner_count, total_value, total_value_exact} (skips numbers.json when given),
 *   data {partners, logos} (skips cansw-data.json when given),
 *   eyebrow, headline, intro, stat1Label, stat2Label, joinText, joinAlt (HTML), bullets [HTML x3]
 */
(function () {
  var O = window.CANSW_OVERRIDES || {};
  var MEMBERSHIP = +O.membershipCost || 49;
  var JOIN = O.joinUrl || "#pricing";
  var STARTER = O.starterUrl || "#top";

  var thisScript = document.currentScript || (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var BASE = window.CANSW_BASE || "";
  if (!BASE && thisScript && thisScript.src) BASE = thisScript.src.replace(/[^\/]*$/, "");

  var mount = document.getElementById("cansw-mount");
  if (!mount) { mount = document.createElement("div"); mount.id = "cansw-mount"; if (thisScript && thisScript.parentNode) thisScript.parentNode.insertBefore(mount, thisScript); else document.body.appendChild(mount); }

  var CSS = "" +
".cansw2{--t:#2A6478;--td:#1E4F5F;--rust:#9E614A;--ink:#1A1F2C;--ch:#374151;--mute:#5B6572;--bd:#E6EBF2;--hl:#EFF3F7;--s2:#FAFBFD;--disp:'Lato',system-ui,sans-serif;--body:'Open Sans',system-ui,sans-serif;--r:4px;font-family:var(--body);font-size:17px;line-height:26px;color:var(--ch);text-align:left;-webkit-font-smoothing:antialiased}" +
".cansw2 *{box-sizing:border-box}.cansw2 p{margin:0 0 16px}.cansw2 h2{margin:0;color:var(--ink)}" +
".cansw2 a{color:var(--t);font-weight:700;text-decoration:none}.cansw2 a:hover{color:var(--td);text-decoration:underline}" +
".cansw2 .lead{color:var(--ink);font-weight:700}" +
".cansw2-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:stretch;max-width:1160px;margin:0 auto}" +
".cansw2-card{background:#fff;border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 3px 10px rgba(26,31,44,.10)}" +
".cansw2-panel{height:640px;overflow:hidden;display:flex;flex-direction:column;padding:26px}" +
".cansw2-scroll{flex:1 1 auto;min-height:0;overflow-y:auto}.cansw2-pin{flex:none}" +
".cansw2-eyebrow{font-family:var(--body);font-size:15px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;line-height:18px;color:var(--rust);margin:0 0 16px}" +
".cansw2-h{font-family:var(--disp);font-weight:900;font-size:32px;line-height:1.12;letter-spacing:-.6px;color:var(--ink)}" +
".cansw2-num{font-family:var(--disp);font-weight:700;color:var(--t);font-variant-numeric:tabular-nums;font-size:26px;line-height:26px}" +
".cansw2-micro{font-size:13px;line-height:18px;letter-spacing:1.2px;text-transform:uppercase;font-weight:600;color:var(--mute)}" +
".cansw2-stats{display:grid;grid-template-columns:1fr 1fr;margin:24px 0 16px}.cansw2-stat{padding:0 16px 0 0}.cansw2-stat+.cansw2-stat{border-left:1px solid var(--hl);padding-left:16px}.cansw2-stat .cansw2-micro{margin-top:4px;display:block}" +
".cansw2-checks{list-style:none;padding:0;margin:0}.cansw2-checks li{display:flex;gap:10px;align-items:flex-start;padding:6px 0}" +
".cansw2-chk{flex:none;width:18px;height:18px;border-radius:50%;background:var(--t);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;margin-top:1px}" +
".cansw2-swap{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;justify-content:space-evenly;overflow:hidden}" +
".cansw2-bullets{overflow-y:auto}.cansw2-bullets.off{display:none}" +
".cansw2-receipt{display:none;flex-direction:column;min-height:0;height:100%}.cansw2-receipt.on{display:flex}" +
".cansw2-rlist{flex:1 1 auto;min-height:88px;overflow-y:auto;border:1px solid var(--bd);border-radius:var(--r);background:var(--s2)}" +
".cansw2-rrow{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid var(--hl);font-size:15px;line-height:22px}.cansw2-rrow:last-child{border-bottom:0}" +
".cansw2-rrow .rn{flex:1 1 auto;color:var(--ink);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cansw2-rrow .rv{font-weight:700;color:var(--t);font-variant-numeric:tabular-nums;min-width:64px;text-align:right}" +
".cansw2-rrow button{background:none;border:0;color:var(--mute);cursor:pointer;font-size:14px;padding:0 0 0 8px;font-family:inherit}" +
".cansw2-rtot{display:flex;justify-content:space-between;align-items:baseline;padding:10px 0 0}.cansw2-rtot .lab{color:var(--ch);font-weight:600}.cansw2-rtot .val{font-family:var(--disp);font-weight:700;color:var(--t);font-size:26px;font-variant-numeric:tabular-nums}" +
".cansw2-rsub{font-size:15px;line-height:22px;color:var(--mute)}" +
".cansw2-capture{border-top:1px solid var(--hl);padding-top:16px;margin-top:16px}" +
".cansw2-btn{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 24px;border:0;border-radius:var(--r);cursor:pointer;font-family:var(--body);font-weight:700;font-size:17px;background:var(--rust);color:#fff!important;white-space:nowrap;transition:background 150ms ease;text-decoration:none!important;width:100%}.cansw2-btn:hover{background:#87503D;color:#fff}" +
".cansw2-alt{font-size:15px;line-height:22px;margin:8px 0 0;color:var(--ch);text-align:center}" +
".cansw2-tools{display:grid;grid-template-columns:1fr 180px;gap:8px;margin-bottom:12px}" +
".cansw2-tools input,.cansw2-tools select{height:40px;border:1px solid var(--bd);border-radius:var(--r);padding:0 10px;font:inherit;font-size:15px;color:var(--ink);background:#fff;min-width:0;margin:0;width:100%}" +
".cansw2-plist{border-top:1px solid var(--hl)}" +
".cansw2-prow{display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center;padding:10px 4px;border-bottom:1px solid var(--hl);transition:background 150ms ease}.cansw2-prow:hover{background:var(--s2)}.cansw2-prow.sel{background:#F4F8FA}" +
".cansw2-plogo{width:28px;height:28px;border-radius:var(--r);border:1px solid var(--bd);background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;font-size:11px;font-weight:800;color:var(--t)}.cansw2-plogo img{width:100%;height:100%;object-fit:contain;max-width:100%}" +
".cansw2-pmid{min-width:0}.cansw2-pname{font-weight:700;color:var(--ink);font-size:17px;line-height:26px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cansw2-pdeal{font-size:15px;line-height:22px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
".cansw2-pright{display:grid;grid-template-columns:auto 28px;gap:8px;align-items:center}.cansw2-pval{text-align:right;min-width:64px}.cansw2-pval .v{font-weight:700;color:var(--t);font-variant-numeric:tabular-nums;font-size:17px;line-height:26px;display:block}.cansw2-pval .v.free{color:var(--rust)}" +
".cansw2-tag{display:inline-block;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.9px;line-height:14px;padding:1px 6px;border-radius:var(--r);background:rgba(42,100,120,.10);color:var(--t)}.cansw2-tag.perk{background:rgba(193,122,94,.12);color:var(--rust)}" +
".cansw2-add{width:28px;height:28px;border-radius:50%;border:1px solid var(--bd);background:#fff;color:var(--t);font-weight:800;font-size:16px;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:background 150ms ease;padding:0;font-family:inherit}.cansw2-add:hover{background:var(--s2)}.cansw2-add.on{background:var(--t);color:#fff;border-color:var(--t)}" +
".cansw2-plans{grid-column:1/-1;background:var(--s2);border-radius:var(--r);margin:0 0 4px 40px;display:none}.cansw2-prow.open .cansw2-plans{display:block}" +
".cansw2-plan{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid var(--hl);font-size:15px;line-height:22px}.cansw2-plan:last-child{border-bottom:0}.cansw2-plan .pn{color:var(--ch)}.cansw2-plan .pv{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--t);font-variant-numeric:tabular-nums}.cansw2-plan .cansw2-add{width:24px;height:24px;font-size:14px}" +
".cansw2-legend{border-top:1px solid var(--hl);padding-top:10px;margin-top:8px;font-size:13px;line-height:18px;color:var(--mute);display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.cansw2-legend b{color:var(--ch)}" +
".cansw2-empty{padding:24px 8px;color:var(--mute);font-size:15px;line-height:22px}" +
"@media (max-width:600px){.cansw2-prow{gap:8px}.cansw2-pright{gap:6px}.cansw2-pval{min-width:0}.cansw2 .upto{display:block;font-size:13px;line-height:12px;letter-spacing:1.2px;text-transform:uppercase;font-weight:600;color:var(--mute)}}" +
"@media (max-width:900px){.cansw2-grid{grid-template-columns:1fr}.cansw2-panel{height:auto;max-height:none}.cansw2-panel--list{height:560px}.cansw2-h{font-size:26px}}";

  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  var ORDER = ["beehiiv","Kajabi","Mercury","Teachable","Mighty Networks","Epidemic Sound","Fourthwall","ShopYourLikes","Insense","Thematic","ClearPath","Boring Stuff","Nas.com","Pop.store","SendOwl","Wispr Flow","Elevate.io","Karat","Ratelle Law","Unbound Legal","FYPM","Creator Wizard","Creators Guild of America","Hopp","Slipstream","Buy.Video","Switcher Studios","CreatorScore","DUPAY","TopFan","Dorian","Driff","Revenews","Roster","EditHers","Valim","Built by Foundry","EssentL Creator","Growth in Reverse",".store","Pierson Ferdinand","CreatorCare"];
  var RATE = {"ShopYourLikes":"80/20","Dorian":"100%","TopFan":"87%","Driff":"90/10"};
  var UNCAPPED_NAMES = {"ShopYourLikes":1,"Insense":1,"Driff":1,"TopFan":1};

  function money(n){ return "$" + Math.round(n).toLocaleString("en-US"); }
  function esc(s){ return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function initials(n){ return (n || "").replace(/[^A-Za-z0-9]/g,"").slice(0,1).toUpperCase() || "•"; }

  function fetchJSON(url, cb){
    var done = false;
    var t = setTimeout(function(){ if(!done){ done = true; cb(null); } }, 4000);
    try {
      fetch(url, {cache:"no-cache"}).then(function(r){ return r.ok ? r.json() : null; }).then(function(j){ if(!done){ done = true; clearTimeout(t); cb(j); } }).catch(function(){ if(!done){ done = true; clearTimeout(t); cb(null); } });
    } catch(e){ if(!done){ done = true; clearTimeout(t); cb(null); } }
  }

  function prep(DATA){
    var list = (DATA.partners || []).map(function(p){
      var q = {}; for (var k in p) q[k] = p[k];
      q.categories = p.c || [];
      q.plans = (p.plans || []).filter(function(pl){ return pl.save != null; });
      q.uncapped = !!UNCAPPED_NAMES[p.n] || (!!p.earn && !p.v);
      q.included = p.n === "Insense";
      q.max = p.v ? p.v[1] : (q.plans.length ? Math.max.apply(null, q.plans.map(function(x){ return x.save; })) : null);
      q.min = p.v ? p.v[0] : (q.plans.length ? Math.min.apply(null, q.plans.map(function(x){ return x.save; })) : null);
      q.dealText = p.deal || "Discount details for members";
      return q;
    });
    var hide = {}; (O.hide || []).forEach(function(n){ hide[n] = 1; });
    list = list.filter(function(p){ return !hide[p.n]; });
    function idx(n){ var i = ORDER.indexOf(n); return i < 0 ? 999 : i; }
    list.sort(function(a,b){ return idx(a.n) - idx(b.n); });
    if (O.pin) list.sort(function(a,b){ return a.n === O.pin ? -1 : b.n === O.pin ? 1 : 0; });
    if (O.demote && O.demote.length) { var d = {}; O.demote.forEach(function(n){ d[n] = 1; }); list = list.filter(function(p){ return !d[p.n]; }).concat(list.filter(function(p){ return d[p.n]; })); }
    return list;
  }

  function render(DATA, NUM){
    var total = (NUM && NUM.total_value) || "$34,000+";
    var exact = (NUM && NUM.total_value_exact) || null;
    var count = (NUM && NUM.partner_count) || (DATA.partners || []).length;
    var bullets = O.bullets || [
      '<span class="lead">Rates you can\'t get on your own.</span> Pre-negotiated, not public.',
      '<span class="lead">One discount pays for the year.</span> Each is worth more than $' + MEMBERSHIP + '.',
      '<span class="lead">Save as you build your stack.</span> Newsletter to legal to banking.'
    ];
    mount.className = (mount.className ? mount.className + " " : "") + "cansw2";
    mount.innerHTML =
      '<div class="cansw2-grid">' +
        '<div class="cansw2-card cansw2-panel">' +
          '<p class="cansw2-eyebrow">' + esc(O.eyebrow || "See what you'd save") + '</p>' +
          '<h2 class="cansw2-h">' + esc(O.headline || "Pick what you're about to buy.") + '</h2>' +
          '<p style="margin-top:12px">' + esc(O.intro || "Add the tools on your list. The receipt writes itself.") + '</p>' +
          '<div class="cansw2-stats">' +
            '<div class="cansw2-stat"><span class="cansw2-num" data-role="total">' + esc(total) + '</span><span class="cansw2-micro">' + esc(O.stat1Label || "in savings across the catalog") + '</span></div>' +
            '<div class="cansw2-stat"><span class="cansw2-num">' + esc(count) + '</span><span class="cansw2-micro">' + esc(O.stat2Label || "partners, new discounts monthly") + '</span></div>' +
          '</div>' +
          '<div class="cansw2-swap">' +
            '<ul class="cansw2-checks cansw2-bullets" data-role="bullets">' + bullets.map(function(b){ return '<li><span class="cansw2-chk">✓</span><span>' + b + '</span></li>'; }).join("") + '</ul>' +
            '<div class="cansw2-receipt" data-role="receipt">' +
              '<div class="cansw2-micro" style="margin-bottom:6px">Your picks</div>' +
              '<div class="cansw2-rlist" data-role="rlist"></div>' +
              '<div class="cansw2-rtot"><span class="lab">Savings on your picks</span><span class="val" data-role="rtotal">$0</span></div>' +
              '<div class="cansw2-rsub" data-role="rsub">Membership is $' + MEMBERSHIP + '/year. Add a pick to see your net.</div>' +
            '</div>' +
          '</div>' +
          '<div class="cansw2-capture cansw2-pin">' +
            '<a class="cansw2-btn" href="' + esc(JOIN) + '">' + esc(O.joinText || ("Join for $" + MEMBERSHIP + "/year")) + '</a>' +
            '<p class="cansw2-alt">' + (O.joinAlt || ('Locked in for life. Not ready? <a href="' + esc(STARTER) + '">Unlock the Starter Set free</a>.')) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="cansw2-card cansw2-panel cansw2-panel--list">' +
          '<div class="cansw2-tools cansw2-pin">' +
            '<input type="search" placeholder="Search partners, categories, discounts" aria-label="Search" data-role="search">' +
            '<select aria-label="Category" data-role="cat"><option value="">All categories</option></select>' +
          '</div>' +
          '<div class="cansw2-scroll cansw2-plist" data-role="list"></div>' +
          '<div class="cansw2-legend cansw2-pin"><span><b>🏆</b> = best discount this partner offers anywhere</span><span><b>Uncapped</b> = grows with your business</span><span data-role="count"></span></div>' +
        '</div>' +
      '</div>';

    var q = function(r){ return mount.querySelector('[data-role=' + r + ']'); };
    var all = prep(DATA);
    var listEl = q("list"), search = q("search"), cat = q("cat"), countEl = q("count");
    var bulletsEl = q("bullets"), receipt = q("receipt"), rlist = q("rlist"), rtotal = q("rtotal"), rsub = q("rsub");
    var picks = {}; var pickOrder = [];
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

    var cc = {};
    all.forEach(function(p){ p.categories.forEach(function(c){ cc[c] = (cc[c] || 0) + 1; }); });
    Object.keys(cc).sort().forEach(function(c){ var o = document.createElement("option"); o.value = c; o.textContent = c + " (" + cc[c] + ")"; cat.appendChild(o); });
    countEl.textContent = "";

    function defaultPlan(p){
      if (!p.plans.length) return {name:"", save:p.max};
      var ok = p.plans.filter(function(x){ return x.save > MEMBERSHIP; }).sort(function(a,b){ return a.save - b.save; });
      return ok[0] || p.plans.slice().sort(function(a,b){ return b.save - a.save; })[0];
    }
    function setPick(n, v){ if (!picks[n]) pickOrder.push(n); picks[n] = v; }
    function delPick(n){ delete picks[n]; pickOrder = pickOrder.filter(function(x){ return x !== n; }); }

    var shown = 0;
    function countTo(target){
      if (reduce) { rtotal.textContent = money(target); shown = target; return; }
      var start = shown, t0 = performance.now(), dur = 250;
      (function step(t){ var k = Math.min(1, (t - t0) / dur); var v = start + (target - start) * (1 - Math.pow(1 - k, 3)); rtotal.textContent = money(v); if (k < 1) requestAnimationFrame(step); else shown = target; })(t0);
    }

    function updateReceipt(){
      if (!pickOrder.length) { receipt.classList.remove("on"); bulletsEl.classList.remove("off"); shown = 0; return; }
      bulletsEl.classList.add("off"); receipt.classList.add("on");
      var total = 0, unc = 0; rlist.innerHTML = "";
      pickOrder.forEach(function(n){
        var v = picks[n];
        var d = document.createElement("div"); d.className = "cansw2-rrow";
        d.innerHTML = '<span class="rn">' + esc(v.name) + (v.planName && v.planName !== "—" ? " · " + esc(v.planName) : "") + '</span><span class="rv">' + (v.uncapped ? "uncapped" : (v.included ? "included" : money(v.save))) + '</span><button aria-label="Remove">×</button>';
        d.querySelector("button").addEventListener("click", function(){ delPick(n); renderList(); updateReceipt(); });
        rlist.appendChild(d);
        if (v.uncapped) unc++; else if (!v.included) total += v.save || 0;
      });
      countTo(total);
      var net = total - MEMBERSHIP;
      rsub.textContent = (net >= 0 ? "That's " + money(net) + " ahead after the $" + MEMBERSHIP + " membership" : "Add one more and you're past the $" + MEMBERSHIP + " membership") + (unc ? ", plus " + unc + " uncapped discount" + (unc > 1 ? "s" : "") + " that grow with you." : ".");
    }

    function renderList(){
      var qs = (search.value || "").toLowerCase().trim(); var c = cat.value;
      listEl.innerHTML = ""; var n = 0;
      all.forEach(function(p){
        if (c && p.categories.indexOf(c) < 0) return;
        if (qs) { var hay = (p.n + " " + p.dealText + " " + p.categories.join(" ")).toLowerCase(); if (hay.indexOf(qs) < 0) return; }
        n++;
        var row = document.createElement("div"); row.className = "cansw2-prow"; if (picks[p.n]) row.classList.add("sel");
        var multi = p.plans.length > 1, valHtml;
        if (p.uncapped) valHtml = '<span class="v">' + esc(RATE[p.n] || "rate") + '</span><span class="cansw2-tag">uncapped</span>';
        else if (p.included) valHtml = '<span class="v free">Free</span><span class="cansw2-tag perk">included</span>';
        else if (p.max != null) valHtml = '<span class="v">' + (p.min !== p.max ? '<span class="upto">up to </span>' : "") + money(p.max) + '</span>';
        else valHtml = '<span class="v" style="color:var(--mute)">—</span>';
        var logo = (DATA.logos || {})[p.n];
        row.innerHTML =
          '<div class="cansw2-plogo">' + (logo ? '<img src="' + esc(logo) + '" alt="" loading="lazy">' : esc(initials(p.n))) + '</div>' +
          '<div class="cansw2-pmid"><div class="cansw2-pname">' + esc(p.n) + (p.t ? " 🏆" : "") + '</div><div class="cansw2-pdeal" title="' + esc(p.dealText) + '">' + esc(p.dealText) + '</div></div>' +
          '<div class="cansw2-pright"><div class="cansw2-pval">' + valHtml + '</div>' +
            (multi ? '<button class="cansw2-add" aria-label="Show plans" data-act="toggle">›</button>' : '<button class="cansw2-add' + (picks[p.n] ? " on" : "") + '" aria-label="Add" data-act="add">' + (picks[p.n] ? "✓" : "+") + '</button>') +
          '</div>';
        var img = row.querySelector("img"); if (img) img.addEventListener("error", function(){ this.parentNode.textContent = initials(p.n); });
        if (multi) {
          var pl = document.createElement("div"); pl.className = "cansw2-plans";
          p.plans.forEach(function(x){
            var sel = picks[p.n] && picks[p.n].planName === x.name;
            var d = document.createElement("div"); d.className = "cansw2-plan";
            d.innerHTML = '<span class="pn">' + esc(x.name) + (x.price ? " · " + money(x.price) + (x.per ? "/" + esc(x.per) : "") : "") + '</span><span class="pv">' + money(x.save) + '<button class="cansw2-add' + (sel ? " on" : "") + '" data-act="plan" data-plan="' + esc(x.name) + '">' + (sel ? "✓" : "+") + '</button></span>';
            pl.appendChild(d);
          });
          row.appendChild(pl);
        }
        row.addEventListener("click", function(e){
          var b = e.target.closest ? e.target.closest("button") : null; if (!b) return;
          var act = b.getAttribute("data-act");
          if (act === "toggle") { row.classList.toggle("open"); b.textContent = row.classList.contains("open") ? "⌄" : "›"; return; }
          if (act === "add") { if (picks[p.n]) delPick(p.n); else { var dp = defaultPlan(p); setPick(p.n, {name:p.n, planName:dp.name, save:dp.save, uncapped:p.uncapped, included:p.included}); } }
          if (act === "plan") { var pn = b.getAttribute("data-plan"); var cur = picks[p.n]; if (cur && cur.planName === pn) delPick(p.n); else { var x = null; p.plans.forEach(function(y){ if (y.name === pn) x = y; }); if (x) setPick(p.n, {name:p.n, planName:x.name, save:x.save}); } }
          var wasOpen = row.classList.contains("open");
          renderList();
          if (wasOpen) { var rows = listEl.querySelectorAll(".cansw2-prow"); for (var i = 0; i < rows.length; i++) { var nm = rows[i].querySelector(".cansw2-pname"); if (nm && nm.textContent.indexOf(p.n) === 0) { rows[i].classList.add("open"); var t = rows[i].querySelector("[data-act=toggle]"); if (t) t.textContent = "⌄"; break; } } }
          updateReceipt();
        });
        listEl.appendChild(row);
      });
      if (!n) listEl.innerHTML = '<div class="cansw2-empty">Nothing matches that yet. Try a broader word like "newsletter" or "legal", or clear the category.</div>';
      countEl.textContent = (qs || c) ? "Showing " + n + " of " + all.length : "";
    }
    search.addEventListener("input", renderList); cat.addEventListener("change", renderList);
    renderList();

    // count-up on the headline stat
    var tEl = q("total");
    if (exact && !reduce) {
      var fin = tEl.textContent, t0 = performance.now();
      (function step(t){ var k = Math.min(1, (t - t0) / 600); var v = exact * (1 - Math.pow(1 - k, 3)); tEl.textContent = "$" + Math.round(v).toLocaleString("en-US"); if (k < 1) requestAnimationFrame(step); else tEl.textContent = fin; })(t0);
    }
  }

  function start(){
    var DATA = O.data, NUM = O.numbers;
    var pending = 0;
    function go(){ if (pending) return; if (!DATA || !DATA.partners) { mount.innerHTML = '<div class="cansw2"><p class="cansw2-empty">The partner list is loading slowly. <a href="/partners">Browse all partners</a>.</p></div>'; return; } render(DATA, NUM || {}); }
    if (!DATA) { pending++; fetchJSON(BASE + "cansw-data.json", function(j){ DATA = j; pending--; go(); }); }
    if (!NUM) { pending++; fetchJSON(BASE + "numbers.json", function(j){ NUM = j; pending--; go(); }); }
    if (!pending) go();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
