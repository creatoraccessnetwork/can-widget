/* CAN project quiz. v1, 2026-09-10.
 * Two to four multiple-choice questions that land on one of fifteen project offer pages.
 * v1.1, 2026-09-12: "Land more brand deals" and "Sell physical products" are direct Q1 outcomes (two questions);
 * "Not sure yet" lists every project page (quiz_label + not_sure_extras in segments.json) above the Starter Set CTA.
 * Mounts into #can-quiz-mount. Reads segments.json (next to this script) for the page URLs.
 * Config: window.CANQUIZ = { header, sub, starterUrl, embed, label } (all optional). embed:true (2026-09-10) renders the
 * questions as a panel with no card chrome or header, for the homepage hero where the copy sits beside it.
 * Redirect: <segment url>?seg=<slug>&stage=<pre|under100k|over100k>[&platform=<youtube|instagram|newsletter|other>]&via=quiz
 * "Not sure yet" shows every project page and the Starter Set CTA (homepage form) with no further questions.
 * Analytics: gtag / fbq / dataLayer when present (quiz_answer per answer, quiz_complete per finish). No email gate.
 */
(function () {
  var O = window.CANQUIZ || {};
  var thisScript = document.currentScript || (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var BASE = window.CANQUIZ_BASE || (thisScript && thisScript.src ? thisScript.src.replace(/[^\/]*$/, "") : "");
  var mount = document.getElementById("can-quiz-mount");
  if (!mount) { mount = document.createElement("div"); mount.id = "can-quiz-mount"; if (thisScript && thisScript.parentNode) thisScript.parentNode.insertBefore(mount, thisScript); }
  var EMBED = !!O.embed; // hero mode: no outer card, no header; the surrounding hero carries the copy
  var HEADER = O.header || "Save money on your next Creator project.";
  var SUB = O.sub || "CAN members get the best available discounts on the tools and services behind every Creator project. Pick yours and see what you'd save.";

  var CSS = "" +
".canq{--t:#2A6478;--td:#1E4F5F;--rust:#9E614A;--ink:#1A1F2C;--ch:#374151;--mute:#5B6572;--bd:#E6EBF2;--hl:#EFF3F7;--s2:#FAFBFD;--disp:'Lato',system-ui,sans-serif;--body:'Open Sans',system-ui,sans-serif;--r:4px;font-family:var(--body);font-size:17px;line-height:26px;color:var(--ch);text-align:left;-webkit-font-smoothing:antialiased;max-width:760px;margin:0 auto}" +
".canq *{box-sizing:border-box}.canq .card{background:#fff;border:1px solid var(--bd);border-radius:var(--r);box-shadow:0 3px 10px rgba(26,31,44,.10);padding:36px 40px}" +
".canq .eyebrow{font-size:15px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;line-height:18px;color:var(--rust);margin:0 0 12px}" +
".canq .h2{font-family:var(--disp);font-weight:900;font-size:32px;line-height:1.12;letter-spacing:-.6px;color:var(--ink);margin:0 0 12px;text-wrap:balance}" +
".canq .sub{font-size:19px;line-height:28px;color:var(--ch);margin:0 0 24px}" +
".canq .prog{display:flex;align-items:center;gap:12px;margin:0 0 16px}.canq .bar{flex:1;height:6px;background:var(--hl);border-radius:3px;overflow:hidden}.canq .bar i{display:block;height:100%;background:var(--t);width:0;transition:width 250ms ease-out}.canq .step{font-size:13px;line-height:18px;letter-spacing:1.2px;text-transform:uppercase;font-weight:600;color:var(--mute);white-space:nowrap;font-variant-numeric:tabular-nums}" +
".canq .q{font-family:var(--disp);font-weight:700;font-size:24px;line-height:1.25;color:var(--ink);margin:0 0 16px}" +
".canq .opts{display:grid;gap:10px;margin:0;padding:0;list-style:none}.canq .opt{display:flex;align-items:center;gap:12px;width:100%;min-height:52px;padding:12px 16px;border:1px solid var(--bd);border-radius:var(--r);background:#fff;font:inherit;font-size:17px;line-height:24px;color:var(--ink);text-align:left;cursor:pointer;transition:background 150ms ease,border-color 150ms ease}" +
".canq .opt:hover{background:var(--s2)}.canq .opt .k{flex:none;width:28px;height:28px;border-radius:50%;border:1px solid var(--bd);display:inline-flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:var(--t);background:#fff}.canq .opt[aria-checked=true]{background:#F4F8FA;border-color:var(--t)}.canq .opt[aria-checked=true] .k{background:var(--t);color:#fff;border-color:var(--t)}" +
".canq :where(button,a):focus-visible{outline:2px solid var(--t);outline-offset:2px}" +
".canq .nav{display:flex;justify-content:space-between;align-items:center;margin:16px 0 0;gap:12px}.canq .back{background:none;border:0;color:var(--mute);font:inherit;font-size:15px;font-weight:600;cursor:pointer;padding:8px 0}.canq .back:hover{color:var(--t)}.canq .fine{font-size:15px;line-height:22px;color:var(--mute);margin:0}" +
".canq .done{text-align:center;padding:12px 0}.canq .done .q{margin-bottom:8px}.canq .btn{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 24px;border:0;border-radius:var(--r);cursor:pointer;font-family:var(--body);font-weight:700;font-size:17px;background:var(--rust);color:#fff!important;text-decoration:none!important}" +
".canq .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}" +
".canq .done.list{text-align:left;padding:4px 0 0}.canq .done.list .q{font-size:24px;margin:0 0 10px}.canq .done.list p{margin:0 0 14px;font-size:16px;line-height:24px}" +
".canq .pages{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;margin:0 0 16px;padding:0;list-style:none}.canq .pages a{display:flex;align-items:center;gap:8px;min-height:36px;padding:6px 10px;border:1px solid var(--bd);border-radius:var(--r);background:#fff;color:var(--ink);font-weight:600;font-size:15px;line-height:20px;text-decoration:none;transition:border-color 150ms ease,background 150ms ease}.canq .pages a:hover{border-color:var(--t);background:var(--s2);color:var(--td);text-decoration:none}.canq .pages a::before{content:'';flex:none;width:6px;height:6px;border-radius:50%;background:var(--t)}" +
".canq .starter{border-top:1px solid var(--bd);padding-top:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.canq .starter .fine{flex:1 1 200px}" +
"@media (max-width:600px){.canq .pages{grid-template-columns:1fr}.canq .done.list .q{font-size:21px}}" +
".canq.embed{max-width:none}.canq .panel{background:#fff;border:1px solid var(--bd);border-radius:6px;padding:0;overflow:hidden;box-shadow:0 14px 34px rgba(26,31,44,.16);animation:canq-in 250ms ease-out both}" +
".canq .phead{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 22px;background:var(--t);color:#fff}.canq .plabel{font-size:13px;line-height:18px;letter-spacing:1.4px;text-transform:uppercase;font-weight:800;color:#fff}.canq .phead .step{color:rgba(255,255,255,.85)}" +
".canq .pbody{padding:20px 22px 18px}.canq.embed .bar{margin:0 0 18px;height:6px;background:#E6EBF2;border-radius:3px;overflow:hidden}.canq.embed .bar i{background:var(--rust)}" +
".canq.embed .q{font-family:var(--disp);font-weight:900;font-size:27px;line-height:1.15;letter-spacing:-.4px;margin:0 0 14px}" +
".canq.embed .opt{border:1px solid var(--bd);background:#fff;transition:transform 150ms ease,border-color 150ms ease,background 150ms ease,box-shadow 150ms ease}.canq.embed .opt:hover{border-color:var(--t);background:var(--s2);transform:translateX(4px);box-shadow:0 3px 10px rgba(26,31,44,.10)}" +
".canq.embed .opt .k{background:var(--t);color:#fff;border-color:var(--t)}.canq.embed .opt:hover .k{background:var(--rust);border-color:var(--rust)}" +
".canq.embed .nav .fine{color:var(--mute)}.canq.embed .done{padding:8px 0 4px}" +
"@keyframes canq-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}" +
"@media (max-width:600px){.canq .card{padding:24px 18px}.canq .phead{padding:12px 16px}.canq .pbody{padding:16px 14px 14px}.canq.embed .q{font-size:22px}.canq.embed .opt:hover{transform:none}.canq .h2{font-size:26px}.canq .sub{font-size:17px;line-height:26px}.canq .q{font-size:21px}}" +
"@media (prefers-reduced-motion:reduce){.canq .bar i{transition:none}.canq .panel{animation:none}.canq.embed .opt,.canq.embed .opt:hover{transition:none;transform:none}}";
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  // ---- the tree (can-product-marketing skill, "Project quiz") -------------------------------------------
  var Qs = {
    project: { text: "What's your next project?", opts: [
      { id: "money", label: "Make money from my audience", next: "how" },
      { id: "branddeals", label: "Land more brand deals", seg: "brand-deals" },
      { id: "physical", label: "Sell physical products or my favorite brands", seg: "physical-products" },
      { id: "grow", label: "Grow my audience", next: "where" },
      { id: "business", label: "Get the business side handled", next: "handle" },
      { id: "content", label: "Make better content, faster", next: "make" },
      { id: "unsure", label: "Not sure yet", starter: true } ] },
    how: { text: "How do you want to make it?", opts: [
      { id: "branddeals", label: "Brand deals and sponsorships", seg: "brand-deals" },
      { id: "knowledge", label: "Selling what I know", next: "knowledge" },
      { id: "community", label: "A paid community or membership", seg: "community" },
      { id: "products", label: "Selling products", next: "products" },
      { id: "media", label: "A newsletter or podcast", next: "media" } ] },
    knowledge: { text: "What are you selling?", opts: [
      { id: "course", label: "A course", seg: "course" },
      { id: "coaching", label: "Coaching", seg: "coaching" },
      { id: "consulting", label: "Consulting", seg: "consulting" } ] },
    products: { text: "What kind of products?", opts: [
      { id: "digital", label: "Digital products", seg: "digital-products" },
      { id: "physical", label: "Physical products or merch", seg: "physical-products" } ] },
    media: { text: "Which one?", opts: [
      { id: "newsletter", label: "A newsletter", seg: "newsletter" },
      { id: "podcast", label: "A podcast", seg: "podcast" } ] },
    where: { text: "Where do you want to grow?", opts: [
      { id: "youtube", label: "YouTube", seg: "grow", platform: "youtube" },
      { id: "instagram", label: "Instagram", seg: "grow", platform: "instagram" },
      { id: "newsletter", label: "A newsletter", seg: "grow", platform: "newsletter" },
      { id: "podcast", label: "A podcast", seg: "podcast" },
      { id: "other", label: "Somewhere else", seg: "grow", platform: "other" } ] },
    handle: { text: "What needs handling?", opts: [
      { id: "setup", label: "Setting it up", seg: "set-up" },
      { id: "protect", label: "Protecting it", seg: "protect" },
      { id: "tax", label: "Paying less in taxes", seg: "tax" },
      { id: "time", label: "Getting my time back", seg: "save-time" } ] },
    make: { text: "What do you make?", opts: [
      { id: "video", label: "Video", seg: "video" },
      { id: "podcast", label: "A podcast", seg: "podcast" },
      { id: "writing", label: "A newsletter or written content", seg: "newsletter" },
      { id: "all", label: "All of it, I just need more hours", seg: "save-time" } ] },
    stage: { text: "How far along is the business?", opts: [
      { id: "pre", label: "Not earning yet" },
      { id: "under100k", label: "Earning, under $100k a year" },
      { id: "over100k", label: "Over $100k a year" } ] }
  };
  var LONG = { money: 4 }; // Money paths through a Q3 are four questions, everything else is three

  function track(name, params) {
    var p = params || {};
    try { if (typeof window.gtag === "function") window.gtag("event", name, p); } catch (e) {}
    try { if (typeof window.fbq === "function") window.fbq("trackCustom", name.replace(/(^|_)(\w)/g, function (m, a, b) { return b.toUpperCase(); }), p); } catch (e) {}
    try { (window.dataLayer = window.dataLayer || []).push({ event: name, can: p }); } catch (e) {}
  }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  var URLS = {}, SEGS = [], EXTRAS = [], STARTER = O.starterUrl || "https://www.creatoraccessnetwork.com/#top", HOME = "https://www.creatoraccessnetwork.com/";
  var STARTER_COUNT = O.starterCount || 30, STARTER_VALUE = O.starterValue || "$1,750";
  var state = { history: [], answers: {}, seg: null, platform: null, cur: "project" };

  mount.className = (mount.className ? mount.className + " " : "") + "canq" + (EMBED ? " embed" : "");
  mount.innerHTML = EMBED
    ? '<div class="panel" id="quiz"><div class="phead"><span class="plabel">' + esc(O.label || "Your next project") + '</span><span class="step" data-role="step"></span></div><div class="pbody"><div class="bar" aria-hidden="true"><i data-role="bar"></i></div><div data-role="body" aria-live="polite"></div></div></div>'
    : '<div class="card" id="quiz"><p class="eyebrow">Your next project</p><h2 class="h2">' + esc(HEADER) + '</h2><p class="sub">' + esc(SUB) + '</p>' +
    '<div class="prog" aria-hidden="true"><div class="bar"><i data-role="bar"></i></div><span class="step" data-role="step"></span></div>' +
    '<div data-role="body" aria-live="polite"></div></div>';
  var body = mount.querySelector('[data-role="body"]'), bar = mount.querySelector('[data-role="bar"]'), stepEl = mount.querySelector('[data-role="step"]');

  var DIRECT = { branddeals: 1, physical: 1 }; // Q1 answers that land on a page straight away: Q1 + the stage question
  function totalSteps() { var p = state.answers.project; if (!p) return 3; if (p === "unsure") return 1; if (DIRECT[p]) return 2; var n = 3; if (p === "money" && state.answers.how && ["knowledge", "products", "media"].indexOf(state.answers.how) >= 0) n = LONG.money; return n; }
  function stepNo() { return state.history.length + 1; }

  function renderQ(id) {
    state.cur = id; var Qd = Qs[id]; var n = stepNo(), t = totalSteps();
    bar.style.width = Math.round(((n - 1) / t) * 100) + "%"; stepEl.textContent = "Question " + n + " of " + t;
    body.innerHTML = '<div class="q" id="canq-q">' + esc(Qd.text) + '</div><div class="opts" role="radiogroup" aria-labelledby="canq-q">' +
      Qd.opts.map(function (o, i) { return '<button type="button" class="opt" role="radio" aria-checked="false" data-id="' + esc(o.id) + '" tabindex="' + (i === 0 ? "0" : "-1") + '"><span class="k" aria-hidden="true">' + (i + 1) + '</span><span>' + esc(o.label) + '</span></button>'; }).join("") +
      '</div><div class="nav">' + (state.history.length ? '<button type="button" class="back">← Back</button>' : '<span></span>') + '<p class="fine">No email needed.</p></div>';
    var opts = Array.prototype.slice.call(body.querySelectorAll(".opt"));
    opts.forEach(function (b, i) {
      b.addEventListener("click", function () { choose(Qd, Qd.opts[i], b); });
      b.addEventListener("keydown", function (e) {
        var j = i;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") j = (i + 1) % opts.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") j = (i - 1 + opts.length) % opts.length;
        else if (/^[1-9]$/.test(e.key) && opts[+e.key - 1]) { opts[+e.key - 1].click(); return; }
        else if (e.key === "Backspace" && state.history.length) { e.preventDefault(); back(); return; }
        else return;
        e.preventDefault(); opts.forEach(function (x) { x.tabIndex = -1; }); opts[j].tabIndex = 0; opts[j].focus();
      });
    });
    var bk = body.querySelector(".back"); if (bk) bk.addEventListener("click", back);
    if (state.history.length) { var f = body.querySelector(".opt"); if (f) f.focus({ preventScroll: true }); }
  }

  function back() { var prev = state.history.pop(); if (!prev) return; delete state.answers[prev]; if (prev === "project") { state.seg = null; state.platform = null; } renderQ(prev); }

  function choose(Qd, o, btn) {
    body.querySelectorAll(".opt").forEach(function (x) { x.setAttribute("aria-checked", "false"); }); btn.setAttribute("aria-checked", "true");
    state.answers[state.cur] = o.id; state.history.push(state.cur);
    track("quiz_answer", { question: state.cur, answer: o.id, step: state.history.length, path: state.history.map(function (k) { return k + ":" + state.answers[k]; }).join(">") });
    if (o.starter) return finishStarter();
    if (o.seg) { state.seg = o.seg; state.platform = o.platform || null; }
    if (o.next) return setTimeout(function () { renderQ(o.next); }, 120);
    if (state.cur === "stage") return finish(o.id);
    setTimeout(function () { renderQ("stage"); }, 120);
  }

  function finishStarter() {
    bar.style.width = "100%"; stepEl.textContent = "Done";
    track("quiz_complete", { segment: "starter", path: "project:unsure" });
    var items = SEGS.map(function (sg) { return { label: sg.quiz_label || sg.name, slug: sg.slug }; }).concat(EXTRAS);
    var list = items.length ? '<ul class="pages">' + items.map(function (it) {
      var u = URLS[it.slug]; if (!u) return "";
      return '<li><a href="' + esc(u + (u.indexOf("?") >= 0 ? "&" : "?") + "seg=" + encodeURIComponent(it.slug) + "&via=quiz-list") + '" data-slug="' + esc(it.slug) + '">' + esc(it.label) + '</a></li>';
    }).join("") + '</ul>' : '<p><a href="' + esc(HOME + "partners") + '">Browse every partner</a>.</p>';
    body.innerHTML = '<div class="done list"><div class="q">Not sure yet? Here\'s what we can help you build.</div>' +
      '<p>We have all the discounts you need to launch the projects below with the best tools and services for the least money. Check out what we can help you build, or come back when you\'re ready for your next project.</p>' +
      list +
      '<div class="starter"><p class="fine">Or start with the free Starter Set: ' + STARTER_COUNT + ' discounts worth ' + esc(STARTER_VALUE) + '. No card required.</p><a class="btn" href="' + esc(STARTER) + '">Get the Starter Set</a></div>' +
      '<div class="nav"><button type="button" class="back">← Back</button><span></span></div></div>';
    body.querySelector(".back").addEventListener("click", back);
    Array.prototype.forEach.call(body.querySelectorAll(".pages a"), function (a) { a.addEventListener("click", function () { track("quiz_list_click", { segment: a.getAttribute("data-slug"), path: "project:unsure" }); }); });
    var sb = body.querySelector(".starter .btn");
    sb.addEventListener("click", function (e) {
      var starterEl = document.getElementById("starter");
      var email = starterEl && starterEl.querySelector('input[type="email"]');
      if (email && /^#/.test(STARTER)) { e.preventDefault(); try { email.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { email.focus({ preventScroll: true }); }, 400); } catch (er) { location.hash = STARTER; } }
    });
  }

  function finish(stage) {
    var seg = state.seg, url = URLS[seg];
    bar.style.width = "100%"; stepEl.textContent = "Done";
    var qs = "seg=" + encodeURIComponent(seg) + "&stage=" + encodeURIComponent(stage) + (state.platform ? "&platform=" + encodeURIComponent(state.platform) : "") + "&via=quiz";
    var dest = url ? url + (url.indexOf("?") >= 0 ? "&" : "?") + qs : HOME + "partners";
    track("quiz_complete", { segment: seg, stage: stage, platform: state.platform || "", path: state.history.map(function (k) { return k + ":" + state.answers[k]; }).join(">") });
    body.innerHTML = '<div class="done"><div class="q">Loading your discounts…</div><p class="fine">If nothing happens, <a href="' + esc(dest) + '">open your page</a>.</p></div>';
    setTimeout(function () { location.href = dest; }, 200);
  }

  function start() {
    try { fetch(BASE + "segments.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.segments) { SEGS = j.segments; j.segments.forEach(function (s) { URLS[s.slug] = s.url; }); if (j.starter_count && !O.starterCount) STARTER_COUNT = j.starter_count; if (j.starter_value && !O.starterValue) STARTER_VALUE = j.starter_value; if (j.not_sure_extras) EXTRAS = j.not_sure_extras.map(function (x) { return { label: x.label, slug: x.seg }; }); if (j.starter_url && !O.starterUrl) STARTER = j.starter_url; if (j.home_url) HOME = j.home_url; } }).catch(function () {}); } catch (e) {}
    renderQ("project");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
