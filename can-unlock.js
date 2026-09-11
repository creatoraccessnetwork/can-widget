/* CAN "Unlock Access" email box. v1, 2026-09-10.
 * Shared by the v2 offer-page heroes (window.CANUNLOCK set in the hero block) and the segment pages (can-segment.js
 * calls window.canUnlockBind after it renders). Collects the email into the Kajabi "Savings Widget Unlock" form
 * (2149650486), scrolls to the checkout section and prefills its email field, which on Kajabi's checkout is a
 * <pds-input type="email"> web component (set host.value + input/change events; plain <input> handled too).
 * Config: { form: "#unlock", note: "#unote", tag: "unlock-access:offer:<token>", checkout: "#section-1744906803654",
 *           picks: function () { return "..."; }  // optional, written to custom_8
 *           track: function (name, params) {}     // optional analytics hook; gtag/dataLayer used by default }
 */
(function () {
  var FORM_URL = "https://www.creatoraccessnetwork.com/forms/2149650486/form_submissions";
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  function setValue(el, v) {
    try {
      if (el.tagName && el.tagName.indexOf("-") > -1 && "value" in el) { el.value = v; }
      else { var d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value"); if (d && d.set) d.set.call(el, v); else el.value = v; }
      el.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      el.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
      var sh = el.shadowRoot && el.shadowRoot.querySelector("input");
      if (sh && sh.value !== v) { try { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(sh, v); sh.dispatchEvent(new Event("input", { bubbles: true, composed: true })); } catch (e) {} }
      return true;
    } catch (e) { return false; }
  }
  function findEmailField(root) {
    if (!root) return null;
    return root.querySelector('pds-input[type="email"], pds-input[component-id="email"], input[type="email"], input[name*="email" i], pds-input[label="Email"]');
  }
  function prefill(checkoutSel, email) {
    var co = document.querySelector(checkoutSel);
    if (co) { try { co.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { location.hash = checkoutSel; } }
    var tries = 0;
    (function fill() {
      var el = findEmailField(co || document);
      if (el) setValue(el, email);
      else if (tries++ < 40) setTimeout(fill, 250);
    })();
  }
  function track(cfg, name, params) {
    try { if (typeof cfg.track === "function") return cfg.track(name, params); } catch (e) {}
    try { if (typeof window.gtag === "function") window.gtag("event", name, params); } catch (e) {}
    try { (window.dataLayer = window.dataLayer || []).push({ event: name, can: params }); } catch (e) {}
  }

  function bind(cfg) {
    cfg = cfg || {};
    var f = typeof cfg.form === "string" ? document.querySelector(cfg.form) : cfg.form;
    if (!f || f.__canUnlock) return; f.__canUnlock = true;
    var note = typeof cfg.note === "string" ? document.querySelector(cfg.note) : cfg.note;
    var inp = f.querySelector('input[type="email"], input'), btn = f.querySelector("button");
    var okClass = cfg.okClass || (note ? note.className + " ok" : ""), errClass = cfg.errClass || (note ? note.className + " err" : "");
    var checkout = cfg.checkout || "#section-1744906803654";
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = (inp.value || "").trim();
      if (!EMAIL_RE.test(email)) { if (note) { note.className = errClass; note.textContent = "Please enter a valid email."; } inp.focus(); return; }
      btn.disabled = true; btn.textContent = "Unlocking…";
      var picks = ""; try { picks = typeof cfg.picks === "function" ? (cfg.picks() || "") : ""; } catch (e) {}
      var body = "form_submission%5Bname%5D=" + encodeURIComponent("Unlock Access") +
        "&form_submission%5Bemail%5D=" + encodeURIComponent(email) +
        "&form_submission%5Bcustom_5%5D=" + encodeURIComponent(cfg.tag || "unlock-access") +
        "&form_submission%5Bcustom_6%5D=" + encodeURIComponent(location.href) +
        "&form_submission%5Bcustom_7%5D=" + encodeURIComponent("opted in " + new Date().toISOString()) +
        (picks ? "&form_submission%5Bcustom_8%5D=" + encodeURIComponent(picks) : "");
      try { fetch(FORM_URL, { method: "POST", mode: "no-cors", credentials: "omit", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body }).catch(function () {}); } catch (e) {}
      track(cfg, "unlock_access", { source: cfg.source || "hero", page: cfg.tag || "" });
      btn.textContent = "Unlocked ✓";
      if (note) { note.className = okClass; note.textContent = "Finish below. Your email is filled in."; }
      prefill(checkout, email);
    });
  }

  window.canUnlockBind = bind;
  function auto() { if (window.CANUNLOCK) bind(window.CANUNLOCK); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
})();
