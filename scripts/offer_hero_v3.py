#!/usr/bin/env python3
"""
Rebuild the Hero (v2) section of every v2 offer page with the "Unlock Access" email box (2026-09-10 pm).

    python3 scripts/offer_hero_v3.py            # summary
    python3 scripts/offer_hero_v3.py --write    # scripts/payloads/offer-hero-v3/<config>.json  ({theme_id, settings})

What changes on each page (hero section 1787370000000 only; everything else untouched):
  * The Join button becomes an email box with the CTA "Unlock Access". The hosted can-unlock.js (window.CANUNLOCK
    config in the block) posts the email to the Kajabi "Savings Widget Unlock" form (2149650486; name "Unlock Access",
    custom_5 "unlock-access:offer:<token>", custom_6 page URL, custom_7 opt-in stamp), scrolls to the checkout
    section and prefills its <pds-input type="email"> field.
  * Copy is the Aug-22 hero copy verbatim (eyebrow, lead with the synced figures, price line and meta from the config);
    Avi asked for the longer copy back on 2026-09-10 (late).
  * The shared page CSS (previously repeated inside every hero block) now lives in two hosted stylesheets,
    canv2-offer-regular.css and canv2-offer-cobrand.css, generated here from offer_page_lib.css() (the can-offer-page
    skill's build_offer_page.py with the figures read from numbers.json) and linked from the hero block.
Verified 2026-09-10 that every live page's hero_sub / hero_meta / join_text matched its config before this ran.
"""
import glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import offer_page_lib as lib

NUM = json.load(open(os.path.join(REPO, "numbers.json")))
lib.TOTAL, lib.COUNT = NUM["total_value"], str(NUM["partner_count"])
IDS, CHECKOUT = lib.IDS, lib.CHECKOUT
FORM = "2149650486"
BASE = "https://creatoraccessnetwork.github.io/can-widget/"
CSS_FILES = {}

FORM_CSS = """<style>
/* hero v3 (2026-09-10): Unlock Access email box */
.canv2 .hero-unlock{display:flex;align-items:stretch;max-width:560px;margin:0 auto 14px;border-radius:4px;filter:drop-shadow(0 6px 14px rgba(26,31,44,.16))}
.canv2 .hero-unlock input{flex:1 1 240px;min-width:0;height:52px!important;min-height:0;border:1px solid var(--can-border);border-right:0;border-radius:4px 0 0 4px;padding:0 16px;font-family:var(--can-body);font-size:17px;line-height:normal;color:var(--can-ink);background:#fff;margin:0!important;box-shadow:none}
.canv2 .hero-unlock .can-btn{height:52px!important;min-height:0;line-height:1;padding:0 28px;margin:0!important;border-radius:0 4px 4px 0;flex:none}
.canv2 .hero-unlock .can-btn:disabled{opacity:.7;cursor:not-allowed}
.canv2 .hero-meta.ok{color:var(--can-teal);font-weight:600}.canv2 .hero-meta.err{color:var(--can-rust-text)}
@media (max-width:600px){.canv2 .hero-unlock{flex-wrap:wrap}.canv2 .hero-unlock input{flex:1 1 100%;border-right:1px solid var(--can-border);border-radius:4px 4px 0 0}.canv2 .hero-unlock .can-btn{width:100%;border-radius:0 0 4px 4px}}
</style>
"""

UNLOCK_JS = """<script>window.CANUNLOCK = {"form": "#unlock", "note": "#unote", "tag": "unlock-access:offer:%(token)s", "checkout": "#section-%(co)s", "okClass": "hero-meta ok", "errClass": "hero-meta err"};</script>
<script src="%(base)scan-unlock.js"></script>"""


def hero_html(cfg, style):
    if cfg.get("partner_logo"):
        lock = ('<div class="lockup"><img src="%s" alt="Creator Access Network"><span class="x">&times;</span><img class="%s" src="%s" alt="%s"></div>'
                % (lib.CAN_LOGO, "photo" if cfg.get("partner_logo_is_photo") else "", cfg["partner_logo"], cfg["partner"]))
    else:
        lock = ""
    return style + """<div class="canv2 hero-in hero" id="top">
  %(lock)s
  <p class="can-eyebrow">Starting a Creator business is expensive.</p>
  <h1 class="hero-h1">Our members <span class="tl">save money</span> while they build to <span class="tl">make money</span>.</h1>
  <p class="hero-lead">Access <span class="lead">%(total)s</span> in pre-negotiated discounts on the software and services successful Creators use. Median discount: <span class="lead">%(median)s</span>.</p>
  <p class="hero-sub">%(sub)s</p>
  <form class="hero-unlock" id="unlock" novalidate><input type="email" placeholder="Your email" aria-label="Email" autocomplete="email" required><button type="submit" class="can-btn can-btn--lg">Unlock Access</button></form>
  <p class="hero-meta" id="unote">%(meta)s</p>
</div>
<div class="canv2-sticky"><span class="s-price">%(sticky_price)s</span><a class="can-btn" href="#section-%(co)s">%(sticky_btn)s</a></div>
""" % dict(lock=lock, total=lib.TOTAL, count=lib.COUNT, median=lib.MEDIAN, sub=cfg["hero_sub"], meta=cfg["hero_meta"], sticky_price=cfg["sticky_price"], sticky_btn=cfg["sticky_btn"], co=CHECKOUT) + UNLOCK_JS % dict(co=CHECKOUT, token=cfg["token"], base=BASE)


def build(cfg):
    if cfg["kind"] == "regular":
        white = [IDS["hero"], CHECKOUT, IDS["founder"], IDS["how"], IDS["pricing"]]
        pattern = [IDS["widget"], IDS["cats"], IDS["faq"], IDS["fq"]]
    else:
        white = [IDS["hero"], CHECKOUT, IDS["picks"]]
        pattern = [IDS["widget"], IDS["quote"], IDS["fq"]]
    # 2026-09-10 pm: the shared CSS is served from GitHub Pages as one stylesheet per template kind instead of being
    # repeated inside every hero block (29 x 13KB). canv2-offer-<kind>.css is written next to this repo's root on --write.
    css_body = lib.css(white, pattern).replace("<style>", "", 1).rsplit("</style>", 1)[0] + FORM_CSS.replace("<style>", "", 1).rsplit("</style>", 1)[0]
    CSS_FILES[cfg["kind"]] = css_body
    link = '<link rel="stylesheet" href="%scanv2-offer-%s.css">\n' % (BASE, cfg["kind"])
    sec = lib.section("Hero (v2)", [(IDS["hero"] + "_0", hero_html(cfg, link))], top=72, bottom=64, mtop=56, mbottom=40)
    return {"sections": {IDS["hero"]: sec}}


if __name__ == "__main__":
    write = "--write" in sys.argv
    if write: os.makedirs(os.path.join(HERE, "payloads", "offer-hero-v3"), exist_ok=True)
    for f in sorted(glob.glob(os.path.join(HERE, "offer_configs", "*.json"))):
        cfg = json.load(open(f)); name = os.path.basename(f)[:-5]
        out = build(cfg)
        code = out["sections"][IDS["hero"]]["blocks"][IDS["hero"] + "_0"]["settings"]["code"]
        print("%-14s %-8s theme %s  hero block %5d bytes  unlock:%s" % (name, cfg["kind"], cfg["theme_id"], len(code), 'id="unlock"' in code))
        if write: json.dump({"theme_id": cfg["theme_id"], "settings": out}, open(os.path.join(HERE, "payloads", "offer-hero-v3", name + ".json"), "w"), ensure_ascii=False)
    if write:
        for kind, body in CSS_FILES.items():
            fn = os.path.join(REPO, "canv2-offer-%s.css" % kind)
            open(fn, "w").write("/* CAN v2 offer page shared CSS (%s template). Generated by scripts/offer_hero_v3.py from offer_page_lib.css(); do not edit by hand. */\n" % kind + body)
            print("wrote", fn, len(body), "bytes")
