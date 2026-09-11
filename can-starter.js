/* CAN Starter Set email capture. v1, 2026-09-10.
 * Binds the hero's inline Starter Set form (#starter by default): posts the email to the Kajabi Email Signup form
 * (2149438902, the form that delivers the Starter Set), no redirect, success text in place.
 * Config: window.CANSTARTER = { form: "#starter", formId: "2149438902", source: "hero" }  (all optional)
 * Also exposes window.canStarterBind(cfg) for other scripts.
 */
(function () {
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  function bind(cfg) {
    cfg = cfg || {};
    var f = typeof cfg.form === "string" ? document.querySelector(cfg.form) : (cfg.form || document.querySelector("#starter"));
    if (!f || f.__canStarter) return; f.__canStarter = true;
    var inp = f.querySelector('input[type="email"], input'), btn = f.querySelector("button"), note = f.querySelector('[data-role="note"]');
    var url = "https://www.creatoraccessnetwork.com/forms/" + (cfg.formId || "2149438902") + "/form_submissions";
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = (inp.value || "").trim();
      if (!EMAIL_RE.test(email)) { if (note) { note.className = "starter-note err"; note.textContent = "Please enter a valid email."; } inp.focus(); return; }
      btn.disabled = true; btn.textContent = "Sending…";
      var body = "form_submission%5Bemail%5D=" + encodeURIComponent(email) + "&form_submission%5Bcustom_6%5D=" + encodeURIComponent(location.href);
      try { fetch(url, { method: "POST", mode: "no-cors", credentials: "omit", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body }).catch(function () {}); } catch (e) {}
      try { if (typeof window.gtag === "function") window.gtag("event", "starter_capture", { source: cfg.source || "hero" }); } catch (e) {}
      try { (window.dataLayer = window.dataLayer || []).push({ event: "starter_capture", can: { source: cfg.source || "hero" } }); } catch (e) {}
      btn.textContent = "Sent ✓"; inp.disabled = true;
      if (note) { note.className = "starter-note ok"; note.textContent = "Check your inbox. The Starter Set is on its way."; }
    });
  }
  window.canStarterBind = bind;
  function auto() { bind(window.CANSTARTER || {}); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
})();
