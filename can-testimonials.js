/* CAN testimonials marquee. v1, 2026-09-10.
 * Scrolling rows of member wins (and optionally partner quotes) with headshot, name, linked social handle and the saving.
 * Mounts into #can-testimonials-mount. Reads testimonials.json (next to this script).
 * Config: window.CANTESTI = {
 *   surface: "white" | "pattern"   (pattern = cards carry the drop shadow and the header sits in a white card)
 *   rows: ["members", "partners"]  (default: members only)
 *   header: true|false, eyebrow, headline, sub, compact: true|false, speed: seconds per card (default 7)
 * }
 * window.CANTESTI_BASE overrides the data/asset URL base (used when the JS is inlined or served from elsewhere).
 * Motion: linear CSS marquee, pauses on hover and focus, static horizontal scroll under prefers-reduced-motion.
 */
(function () {
  var O = window.CANTESTI || {};
  var thisScript = document.currentScript || (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var BASE = window.CANTESTI_BASE || (thisScript && thisScript.src ? thisScript.src.replace(/[^\/]*$/, "") : "");
  var mount = document.getElementById("can-testimonials-mount");
  if (!mount) { mount = document.createElement("div"); mount.id = "can-testimonials-mount"; if (thisScript && thisScript.parentNode) thisScript.parentNode.insertBefore(mount, thisScript); }
  var PATTERN = O.surface === "pattern", COMPACT = !!O.compact, ROWS = O.rows || ["members"], SPEED = +O.speed || 7;
  var HEADER = O.header !== false;
  var EYEBROW = O.eyebrow || "Member wins";
  var HEADLINE = O.headline || (COMPACT ? "One discount covered the membership. Here are the receipts." : "Real Creators, real receipts.");
  var SUB = O.sub != null ? O.sub : (COMPACT ? "" : "Pulled from the members' Wins channel and their own posts. Every name links to the Creator.");

  var CSS = "" +
".cant{--t:#2A6478;--td:#1E4F5F;--rust:#9E614A;--ink:#1A1F2C;--ch:#374151;--mute:#5B6572;--bd:#E6EBF2;--hl:#EFF3F7;--s2:#FAFBFD;--disp:'Lato',system-ui,sans-serif;--body:'Open Sans',system-ui,sans-serif;--r:4px;--sh:0 3px 10px rgba(26,31,44,.10);font-family:var(--body);font-size:17px;line-height:26px;color:var(--ch);text-align:left;-webkit-font-smoothing:antialiased;max-width:1160px;margin:0 auto}" +
".cant *{box-sizing:border-box}.cant a{color:var(--t);font-weight:700;text-decoration:none}.cant a:hover{color:var(--td);text-decoration:underline}" +
".cant .head{text-align:center;max-width:760px;margin:0 auto 28px}.cant.pattern .head{background:#fff;border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);padding:26px 28px}" +
".cant .eyebrow{font-size:15px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;line-height:18px;color:var(--rust);margin:0 0 8px}" +
".cant .h2{font-family:var(--disp);font-weight:900;font-size:32px;line-height:1.12;letter-spacing:-.6px;color:var(--ink);margin:0;text-wrap:balance}" +
".cant.compact .h2{font-size:26px}.cant .sub{font-size:15px;line-height:22px;color:var(--mute);margin:8px 0 0}" +
".cant .mq{overflow:hidden;position:relative;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);padding:12px 0 16px;margin:0 -8px}" +
".cant .mq+.mq{padding-top:4px}" +
".cant .track{display:flex;gap:20px;width:max-content;align-items:stretch;animation:cant-scroll var(--dur,60s) linear infinite;padding:0 10px}" +
".cant .mq.rev .track{animation-direction:reverse}" +
".cant .mq:hover .track,.cant .mq:focus-within .track{animation-play-state:paused}" +
"@keyframes cant-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}" +
".cant .tcard{flex:none;width:380px;background:#fff;border:1px solid var(--bd);border-radius:var(--r);padding:22px 24px 20px;display:flex;flex-direction:column;gap:12px}" +
".cant.pattern .tcard{box-shadow:var(--sh)}" +
".cant .who{display:flex;align-items:center;gap:12px;min-width:0}" +
".cant .av{flex:none;width:52px;height:52px;border-radius:50%;object-fit:cover;border:1px solid var(--bd);background:var(--hl)}" +
".cant .av.init{display:inline-flex;align-items:center;justify-content:center;font-family:var(--disp);font-weight:700;color:var(--t);font-size:18px}" +
".cant .nm{font-weight:700;color:var(--ink);font-size:17px;line-height:22px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
".cant .hd{font-size:15px;line-height:20px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cant .hd a{font-weight:700}.cant .hd .pf{color:var(--mute);font-weight:400}" +
".cant .q{margin:0;font-size:17px;line-height:26px;color:var(--ch);flex:1;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}" +
".cant .rc{display:flex;align-items:baseline;gap:8px;border-top:1px solid var(--hl);padding-top:12px;font-size:15px;line-height:22px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
".cant .rc b{font-family:var(--disp);font-weight:700;color:var(--t);font-size:20px;line-height:22px;font-variant-numeric:tabular-nums;letter-spacing:-.2px}" +
".cant .rc .lab{font-size:13px;letter-spacing:1.2px;text-transform:uppercase;font-weight:600}" +
".cant .tcard.partner .q{font-family:var(--disp);font-weight:700;font-size:20px;line-height:1.3;color:var(--ink);letter-spacing:-.2px;-webkit-line-clamp:4}" +
".cant .tcard.partner .av{border-radius:12px;object-fit:contain;background:#fff}" +
".cant .foot{text-align:center;font-size:15px;line-height:22px;color:var(--mute);margin:8px 0 0}.cant.pattern .foot{background:#fff;border:1px solid var(--bd);border-radius:var(--r);display:table;margin:8px auto 0;padding:8px 16px}" +
".cant :where(a):focus-visible{outline:2px solid var(--t);outline-offset:2px}" +
"@media (max-width:600px){.cant .tcard{width:300px;padding:18px 18px 16px}.cant .h2{font-size:26px}.cant.compact .h2{font-size:22px}.cant .head{margin-bottom:20px}.cant.pattern .head{padding:20px 18px}}" +
"@media (prefers-reduced-motion:reduce){.cant .track{animation:none;width:auto}.cant .mq{overflow-x:auto;-webkit-mask-image:none;mask-image:none;-webkit-overflow-scrolling:touch}.cant .track .dup{display:none}}";
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function url(p) { return /^https?:\/\//.test(p) ? p : BASE + p; }
  function initials(n) { return String(n || "").split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase(); }
  function avatar(t, cls) {
    return t.headshot ? '<img class="av" src="' + esc(url(t.headshot)) + '" alt="" loading="lazy" width="52" height="52">' : '<span class="av init" aria-hidden="true">' + esc(initials(t.name)) + '</span>';
  }
  function memberCard(t) {
    var handle = t.handle ? (t.handle_url ? '<a href="' + esc(t.handle_url) + '" target="_blank" rel="noopener">' + esc(t.handle) + '</a>' : esc(t.handle)) + (t.platform ? ' <span class="pf">on ' + esc(t.platform) + '</span>' : '') : esc(t.title || "CAN member");
    var rc = "";
    if (t.saved && /\$/.test(t.saved)) rc = '<b>' + esc(t.saved) + '</b><span class="lab">saved</span>' + (t.partner ? '<span>&middot; ' + esc(t.partner) + '</span>' : '');
    else if (t.saved) rc = '<span class="lab" style="color:var(--t)">' + esc(t.saved) + '</span>' + (t.partner ? '<span>&middot; ' + esc(t.partner) + '</span>' : '');
    else if (t.partner) rc = '<span class="lab">Redeemed</span><span>' + esc(t.partner) + '</span>';
    return '<div class="tcard member"><div class="who">' + avatar(t) + '<div style="min-width:0"><div class="nm">' + esc(t.name) + '</div><div class="hd">' + handle + '</div></div></div>' +
      '<p class="q">&ldquo;' + esc(t.quote) + '&rdquo;</p>' + (rc ? '<div class="rc">' + rc + '</div>' : '') + '</div>';
  }
  function partnerCard(t) {
    return '<div class="tcard partner"><p class="q">&ldquo;' + esc(t.quote) + '&rdquo;</p><div class="who">' + avatar(t) + '<div style="min-width:0"><div class="nm">' + esc(t.name) + '</div><div class="hd">' + esc(t.title || "") + '</div></div></div></div>';
  }
  function row(items, render, rev) {
    if (!items.length) return "";
    var cards = items.map(render).join("");
    var dup = items.map(render).join("").replace(/<div class="tcard/g, '<div aria-hidden="true" class="dup tcard');
    return '<div class="mq' + (rev ? " rev" : "") + '" style="--dur:' + (items.length * SPEED) + 's"><div class="track">' + cards + dup + '</div></div>';
  }

  function render(data) {
    var members = (data.members || []).filter(function (t) { return t.enabled !== false && t.quote; });
    var partners = (data.partners || []).filter(function (t) { return t.enabled !== false && t.quote; });
    mount.className = (mount.className ? mount.className + " " : "") + "cant" + (PATTERN ? " pattern" : "") + (COMPACT ? " compact" : "");
    var html = "";
    if (HEADER) html += '<div class="head"><p class="eyebrow">' + esc(EYEBROW) + '</p><h2 class="h2">' + esc(HEADLINE) + '</h2>' + (SUB ? '<p class="sub">' + esc(SUB) + '</p>' : '') + '</div>';
    ROWS.forEach(function (r, i) {
      if (r === "members") html += row(members, memberCard, i % 2 === 1);
      if (r === "partners") html += row(partners, partnerCard, i % 2 === 1);
    });
    if (O.foot) html += '<p class="foot">' + esc(O.foot) + '</p>';
    mount.innerHTML = html;
  }

  function start() {
    var url = BASE + "testimonials.json";
    try {
      fetch(url, { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j) render(j); }).catch(function () {});
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
