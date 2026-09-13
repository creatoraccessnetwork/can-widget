/* CAN testimonials marquee. v2, 2026-09-13.
 * Scrolling rows of member wins (and optionally partner quotes) with headshot, name, linked social handle and the saving.
 * Mounts into #can-testimonials-mount. Reads testimonials.json (next to this script).
 * Config: window.CANTESTI = {
 *   surface: "white" | "pattern"   (pattern = cards carry the drop shadow and the header sits in a white card)
 *   rows: ["members", "partners"]  (default: members only)
 *   header: true|false, eyebrow, headline, sub, compact: true|false,
 *   speed: seconds one card takes to drift past on auto-scroll (default 20; v1 was 7),
 *   arrows: true|false (default true; the previous / next buttons)
 * }
 * window.CANTESTI_BASE overrides the data/asset URL base (used when the JS is inlined or served from elsewhere).
 * Motion (v2): each row is a native horizontal scroller (swipe, trackpad and drag all work) that drifts on its own
 * via requestAnimationFrame. Previous / next buttons step one card. The drift pauses on hover, focus and touch, and
 * for a few seconds after any manual scroll; it never runs under prefers-reduced-motion or while off screen.
 * The cards are repeated so the row wraps without a visible seam.
 */
(function () {
  var O = window.CANTESTI || {};
  var thisScript = document.currentScript || (function () { var s = document.getElementsByTagName("script"); return s[s.length - 1]; })();
  var BASE = window.CANTESTI_BASE || (thisScript && thisScript.src ? thisScript.src.replace(/[^\/]*$/, "") : "");
  var mount = document.getElementById("can-testimonials-mount");
  if (!mount) { mount = document.createElement("div"); mount.id = "can-testimonials-mount"; if (thisScript && thisScript.parentNode) thisScript.parentNode.insertBefore(mount, thisScript); }
  var PATTERN = O.surface === "pattern", COMPACT = !!O.compact, ROWS = O.rows || ["members"], SPEED = +O.speed || 20;
  var HEADER = O.header !== false, ARROWS = O.arrows !== false;
  var EYEBROW = O.eyebrow || "Member wins";
  var HEADLINE = O.headline || (COMPACT ? "One discount covered the membership. Here are the receipts." : "Real Creators, real receipts.");
  var SUB = O.sub != null ? O.sub : (COMPACT ? "" : "Pulled from the members' Wins channel and their own posts. Every name links to the Creator.");
  var REDUCED = false;
  try { REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var RESUME_MS = 4000;   // idle time after a manual scroll / button press before the drift resumes

  var CSS = "" +
".cant{--t:#2A6478;--td:#1E4F5F;--rust:#9E614A;--ink:#1A1F2C;--ch:#374151;--mute:#5B6572;--bd:#E6EBF2;--hl:#EFF3F7;--s2:#FAFBFD;--disp:'Lato',system-ui,sans-serif;--body:'Open Sans',system-ui,sans-serif;--r:4px;--sh:0 3px 10px rgba(26,31,44,.10);font-family:var(--body);font-size:17px;line-height:26px;color:var(--ch);text-align:left;-webkit-font-smoothing:antialiased;max-width:1160px;margin:0 auto}" +
".cant *{box-sizing:border-box}.cant a{color:var(--t);font-weight:700;text-decoration:none}.cant a:hover{color:var(--td);text-decoration:underline}" +
".cant .head{text-align:center;max-width:760px;margin:0 auto 28px}.cant.pattern .head{background:#fff;border:1px solid var(--bd);border-radius:var(--r);box-shadow:var(--sh);padding:26px 28px}" +
".cant .eyebrow{font-size:15px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;line-height:18px;color:var(--rust);margin:0 0 8px}" +
".cant .h2{font-family:var(--disp);font-weight:900;font-size:32px;line-height:1.12;letter-spacing:-.6px;color:var(--ink);margin:0;text-wrap:balance}" +
".cant.compact .h2{font-size:26px}.cant .sub{font-size:15px;line-height:22px;color:var(--mute);margin:8px 0 0}" +
".cant .mqw{position:relative;margin:0 -8px}.cant .mqw+.mqw{margin-top:-8px}" +
".cant .mq{overflow-x:auto;overflow-y:hidden;position:relative;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);padding:12px 0 16px;scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;cursor:grab}" +
".cant .mq::-webkit-scrollbar{display:none}.cant .mq.drag{cursor:grabbing;scroll-snap-type:none}" +
".cant .track{display:flex;gap:20px;width:max-content;align-items:stretch;padding:0 10px}" +
".cant .nav{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:44px;height:44px;margin:0;padding:0;border-radius:50%;background:#fff;border:1px solid var(--bd);box-shadow:var(--sh);color:var(--t);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .15s,color .15s,background .15s;-webkit-tap-highlight-color:transparent}" +
".cant .nav svg{width:20px;height:20px;display:block}.cant .nav:hover{border-color:var(--t);color:var(--td);background:var(--s2)}.cant .nav:active{transform:translateY(-50%) scale(.96)}" +
".cant .nav.prev{left:2px}.cant .nav.next{right:2px}" +
".cant .tcard{flex:none;width:380px;background:#fff;border:1px solid var(--bd);border-radius:var(--r);padding:22px 24px 20px;display:flex;flex-direction:column;gap:12px;user-select:none;-webkit-user-select:none}" +
".cant .tcard img{-webkit-user-drag:none;pointer-events:none}" +
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
".cant :where(a,button):focus-visible{outline:2px solid var(--t);outline-offset:2px}" +
"@media (max-width:600px){.cant .tcard{width:300px;padding:18px 18px 16px}.cant .h2{font-size:26px}.cant.compact .h2{font-size:22px}.cant .head{margin-bottom:20px}.cant.pattern .head{padding:20px 18px}.cant .nav{width:38px;height:38px}.cant .nav svg{width:18px;height:18px}.cant .nav.prev{left:0}.cant .nav.next{right:0}}" +
"@media (prefers-reduced-motion:reduce){.cant .nav{transition:none}}";
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
  var CHEV_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
  function row(items, render, rev, label) {
    if (!items.length) return "";
    var cards = items.map(render).join("");
    return '<div class="mqw" data-rev="' + (rev ? 1 : 0) + '" data-n="' + items.length + '">' +
      (ARROWS ? '<button type="button" class="nav prev" aria-label="Previous ' + esc(label) + '">' + CHEV_L + '</button>' : '') +
      '<div class="mq" role="region" aria-label="' + esc(label) + '"><div class="track">' + cards + '</div></div>' +
      (ARROWS ? '<button type="button" class="nav next" aria-label="Next ' + esc(label) + '">' + CHEV_R + '</button>' : '') + '</div>';
  }

  /* ---- one scrolling row: native scroller + auto drift + buttons --------------------------------------------- */
  function scroller(wrap) {
    var mq = wrap.querySelector(".mq"), track = wrap.querySelector(".track");
    var n = +wrap.getAttribute("data-n") || 0, rev = wrap.getAttribute("data-rev") === "1";
    if (!n) return;
    var first = track.children[0];
    var seedHTML = track.innerHTML;            // one set of cards
    var period = 0, step = 0, copies = 1;
    var pos = 0, lastSet = -1, auto = !REDUCED, hold = 0, timer = null, glide = null, lastT = 0, visible = true, dragging = false;

    function makeCopies() {
      var cw = Math.max(1, mq.clientWidth);
      var setW = track.scrollWidth - 20;       // minus the track padding
      var want = Math.max(3, Math.ceil((2 * cw) / Math.max(1, setW / copies)) + 2);
      if (want === copies) return;
      var html = "";
      for (var i = 0; i < want; i++) html += (i ? seedHTML.replace(/<div class="tcard/g, '<div aria-hidden="true" class="dup tcard') : seedHTML);
      track.innerHTML = html; copies = want;
      var links = track.querySelectorAll(".dup a"); for (var j = 0; j < links.length; j++) links[j].tabIndex = -1;
    }
    function measure() {
      makeCopies();
      first = track.children[0];
      var second = track.children[1] || first, dup = track.children[n] || first;
      step = Math.max(1, (second === first ? first.offsetWidth + 20 : second.offsetLeft - first.offsetLeft));
      period = Math.max(1, dup.offsetLeft - first.offsetLeft);
      if (period <= 1) period = step * n;
      pos = wrapPos(pos < period ? pos + period : pos);
      write();
    }
    function wrapPos(p) {            // keep the scroll offset inside the middle copy
      if (p < period) p += period; else if (p >= 2 * period) p -= period;
      return p;
    }
    function write() { lastSet = Math.round(pos); if (Math.round(mq.scrollLeft) !== lastSet) mq.scrollLeft = pos; }
    function pause(ms) {
      hold = 1; if (timer) clearTimeout(timer);
      if (ms) timer = setTimeout(function () { hold = 0; timer = null; lastT = 0; }, ms);
    }
    function resume(ms) { if (timer) clearTimeout(timer); timer = setTimeout(function () { hold = 0; timer = null; lastT = 0; }, ms || 0); }

    function frame(t) {
      requestAnimationFrame(frame);
      if (!period) return;
      var cur = mq.scrollLeft;
      if (Math.abs(cur - lastSet) > 1) {   // the user (touch, wheel, keyboard, momentum) moved it
        pos = wrapPos(cur); lastSet = Math.round(pos);
        if (Math.round(cur) !== lastSet) mq.scrollLeft = pos;
        glide = null; pause(RESUME_MS); lastT = t; return;
      }
      if (glide) {
        var k = Math.min(1, (t - glide.t0) / glide.dur), e = 1 - Math.pow(1 - k, 3);
        pos = wrapPos(glide.from + glide.dist * e);
        if (k >= 1) { glide = null; pause(RESUME_MS); }
        write(); lastT = t; return;
      }
      if (!auto || hold || !visible || dragging) { lastT = t; return; }
      var dt = lastT ? Math.min(50, t - lastT) : 0; lastT = t;
      pos = wrapPos(pos + (rev ? -1 : 1) * (step / SPEED) * (dt / 1000));
      write();
    }
    function nudge(dir) {
      if (!period) return;
      var from = glide ? wrapPos(glide.from + glide.dist) : pos;
      if (REDUCED) { pos = wrapPos(from + dir * step); write(); pause(RESUME_MS); return; }
      glide = { from: from, dist: dir * step, t0: performance.now(), dur: 420 };
      pause(0);
    }

    var prev = wrap.querySelector(".nav.prev"), next = wrap.querySelector(".nav.next");
    if (prev) prev.addEventListener("click", function () { nudge(-1); });
    if (next) next.addEventListener("click", function () { nudge(1); });
    wrap.addEventListener("mouseenter", function () { pause(0); });
    wrap.addEventListener("mouseleave", function () { if (!dragging) resume(600); });
    wrap.addEventListener("focusin", function () { pause(0); });
    wrap.addEventListener("focusout", function () { resume(RESUME_MS); });
    mq.addEventListener("touchstart", function () { pause(0); }, { passive: true });
    mq.addEventListener("touchend", function () { resume(RESUME_MS); }, { passive: true });
    mq.addEventListener("touchcancel", function () { resume(RESUME_MS); }, { passive: true });
    // Mouse drag to scroll on desktop (touch devices scroll natively).
    var dx0 = 0, sl0 = 0, moved = false;
    mq.addEventListener("mousedown", function (ev) {
      if (ev.button !== 0) return;
      dragging = true; moved = false; dx0 = ev.clientX; sl0 = mq.scrollLeft; glide = null; mq.classList.add("drag");
    });
    window.addEventListener("mousemove", function (ev) {
      if (!dragging) return;
      var d = ev.clientX - dx0; if (Math.abs(d) > 3) moved = true;
      if (moved) { ev.preventDefault(); mq.scrollLeft = sl0 - d; }
    });
    window.addEventListener("mouseup", function () {
      if (!dragging) return;
      dragging = false; mq.classList.remove("drag");
      pos = wrapPos(mq.scrollLeft); write(); pause(RESUME_MS);
    });
    mq.addEventListener("click", function (ev) { if (moved) { ev.preventDefault(); ev.stopPropagation(); moved = false; } }, true);

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; lastT = 0; }, { rootMargin: "80px" }).observe(wrap);
    }
    var rt = null;
    window.addEventListener("resize", function () { if (rt) clearTimeout(rt); rt = setTimeout(measure, 150); });
    measure();
    requestAnimationFrame(frame);
  }

  function render(data) {
    var members = (data.members || []).filter(function (t) { return t.enabled !== false && t.quote; });
    var partners = (data.partners || []).filter(function (t) { return t.enabled !== false && t.quote; });
    mount.className = (mount.className ? mount.className + " " : "") + "cant" + (PATTERN ? " pattern" : "") + (COMPACT ? " compact" : "");
    var html = "";
    if (HEADER) html += '<div class="head"><p class="eyebrow">' + esc(EYEBROW) + '</p><h2 class="h2">' + esc(HEADLINE) + '</h2>' + (SUB ? '<p class="sub">' + esc(SUB) + '</p>' : '') + '</div>';
    ROWS.forEach(function (r, i) {
      if (r === "members") html += row(members, memberCard, i % 2 === 1, "member wins");
      if (r === "partners") html += row(partners, partnerCard, i % 2 === 1, "partner quotes");
    });
    if (O.foot) html += '<p class="foot">' + esc(O.foot) + '</p>';
    mount.innerHTML = html;
    var wraps = mount.querySelectorAll(".mqw");
    for (var i = 0; i < wraps.length; i++) scroller(wraps[i]);
  }

  function start() {
    var url = BASE + "testimonials.json";
    try {
      fetch(url, { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j) render(j); }).catch(function () {});
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
