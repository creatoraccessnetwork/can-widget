/* can-copy.js - fills the CAN homepage text slots from the "CAN Homepage Copy" Google Sheet.
 * Config: window.CANCOPY = { sheet: "<spreadsheet id>", numbers: { total, count, median, starter } }
 * Slots: any element with data-copy="key" (innerHTML) or data-copy + data-copy-attr="placeholder" (attribute).
 * JS-rendered widgets read window.CANCOPY_MAP and listen for the "cancopy" event.
 * Text markup (same rules as scripts/copy_lib.py): {total} {count} {median} {starter}, **bold**, [[teal]], [text](url).
 * Sheet columns: Section | Where | Text | Key. Rows without a Key, or whose Key starts with #, are ignored.
 * ?copy=off in the URL disables it. Nothing here throws: on any failure the baked text stays. */
(function () {
  var O = window.CANCOPY || {};
  if (!O.sheet || /[?&]copy=off\b/.test(location.search)) return;
  var NUMS = { total: "", count: "", median: "$400", starter: "30" };
  for (var k in (O.numbers || {})) NUMS[k] = O.numbers[k];
  var src = (document.currentScript && document.currentScript.src) || "";
  var BASE = O.base || (src ? src.replace(/[^\/]*$/, "") : "https://creatoraccessnetwork.github.io/can-widget/");
  var RAW = null, applied = 0;
  var SEL = { "quiz.label": ".canq .plabel", "wins.eyebrow": "#wins .cant .eyebrow", "wins.headline": "#wins .cant .h2", "wins.sub": "#wins .cant .sub" };

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function fill(s) { return String(s).replace(/\{(total|count|median|starter)\}/g, function (m, k) { return NUMS[k] || m; }); }
  function render(s) {
    s = esc(fill(s));
    s = s.replace(/\*\*(.+?)\*\*/g, '<b class="lead">$1</b>');
    s = s.replace(/\[\[(.+?)\]\]/g, '<span class="tl">$1</span>');
    s = s.replace(/\[([^\]]+)\]\(((?:https?:|mailto:|#)[^)\s]+)\)/g, '<a href="$2">$1</a>');
    return s.replace(/\n/g, "<br>");
  }
  function map() { var m = {}; for (var k in RAW) m[k] = fill(RAW[k]); return m; }

  function apply() {
    if (!RAW) return;
    var els = document.querySelectorAll("[data-copy]"), i, el, k, t;
    for (i = 0; i < els.length; i++) {
      el = els[i]; k = el.getAttribute("data-copy"); t = RAW[k];
      if (t == null || el.getAttribute("data-copy-v") === t) continue;
      el.setAttribute("data-copy-v", t);
      var attr = el.getAttribute("data-copy-attr");
      if (attr) el.setAttribute(attr, fill(t)); else el.innerHTML = render(t);
    }
    for (k in SEL) {
      t = RAW[k]; if (t == null) continue;
      el = document.querySelector(SEL[k]);
      if (el && el.getAttribute("data-copy-v") !== t) { el.setAttribute("data-copy-v", t); el.textContent = fill(t); }
    }
    window.CANCOPY_MAP = map();
    if (!applied) { applied = 1; try { document.dispatchEvent(new CustomEvent("cancopy", { detail: window.CANCOPY_MAP })); } catch (e) {} }
  }

  function parseGviz(txt) {
    var s = txt.indexOf("("), e = txt.lastIndexOf(")");
    var j = JSON.parse(txt.slice(s + 1, e)); var cols = j.table.cols.map(function (c) { return String(c.label || "").trim().toLowerCase(); });
    var ti = cols.indexOf("text"), ki = cols.indexOf("key");
    if (ki < 0 || ti < 0) { ki = 3; ti = 2; }  // Section | Where | Text | Key
    var out = {};
    j.table.rows.forEach(function (r) {
      var kc = r.c[ki], tc = r.c[ti]; var key = kc && kc.v != null ? String(kc.v).trim() : "";
      if (!key || key.charAt(0) === "#") return;
      out[key] = tc && tc.v != null ? String(tc.v) : "";
    });
    return out;
  }
  function got(data) {
    if (!data || !Object.keys(data).length) return;
    RAW = data; try { sessionStorage.setItem("cancopy:" + O.sheet, JSON.stringify(data)); } catch (e) {}
    apply();
  }
  function load() {
    var url = "https://docs.google.com/spreadsheets/d/" + O.sheet + "/gviz/tq?tqx=out:json&headers=1" + (O.tab ? "&sheet=" + encodeURIComponent(O.tab) : "");
    var done = false;
    try {
      fetch(url, { cache: "no-store" }).then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
        .then(function (t) { done = true; got(parseGviz(t)); })
        .catch(function () { if (!done) jsonp(url); });
    } catch (e) { jsonp(url); }
  }
  function jsonp(url) {
    var cb = "CANCOPY_CB_" + Math.floor(Math.random() * 1e6);
    window[cb] = function (j) { try { got(parseGviz("(" + JSON.stringify(j) + ")")); } catch (e) {} };
    var s = document.createElement("script"); s.src = url.replace("tqx=out:json", "tqx=out:json;responseHandler:" + cb); s.async = true; document.head.appendChild(s);
  }

  // Fresh partner count / total from numbers.json (weekly sync); the config values are the baked fallback.
  try { fetch(BASE + "numbers.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (n) {
    if (!n) return; if (n.total_value) NUMS.total = n.total_value; if (n.partner_count) NUMS.count = String(n.partner_count);
    if (RAW) { var els = document.querySelectorAll("[data-copy-v]"); for (var i = 0; i < els.length; i++) els[i].removeAttribute("data-copy-v"); applied = 0; apply(); }
  }).catch(function () {}); } catch (e) {}

  try { var c = sessionStorage.getItem("cancopy:" + O.sheet); if (c) { RAW = JSON.parse(c); apply(); } } catch (e) {}
  load();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply); else apply();
  window.addEventListener("load", apply);
  // widgets that render after us (testimonials, quiz): re-apply as the DOM changes, for the first 20s
  try { var mo = new MutationObserver(function () { if (RAW) apply(); }); mo.observe(document.documentElement, { childList: true, subtree: true }); setTimeout(function () { mo.disconnect(); }, 20000); } catch (e) {}
})();
