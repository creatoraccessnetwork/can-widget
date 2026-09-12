#!/usr/bin/env python3
"""
Build the Kajabi payload for the CAN homepage v3 (2026-09-10): the project quiz becomes the hero.

    python3 scripts/build_home_v3.py > scripts/payloads/home-v3.json

Site 2148774616, site theme 2164431783. Writes with update_theme_content (live instantly).

What it does
  * NEW 1787360000008  Hero Quiz (v2)   pattern section; one white card: copy left, quiz panel right (can-quiz.js embed mode).
                                        Carries the shared CSS for every v2 section (copied from the old hero block, ids extended).
  * NEW 1787360000009  Starter Set (v2) white section; the native Kajabi email form that used to sit in the hero, with its copy.
  * NEW 1787360000010  Member Wins (v2) white section; can-testimonials.js, members row + partners row.
  * HIDE 1787360000000 (old hero) and 1787360000007 (old quiz-under-hero). Nothing is deleted; see backups/ for the revert.
  * Widget block starterUrl and the pricing block's Starter Set links now point at #starter.
  * content_for_index: hero quiz, member wins, starter set, widget, founder, categories, how, FAQ, pricing, then the hidden ones.

Copy source of truth is this file (mirrors can-homepage skill rulings). The lead sentence keeps the exact
"$36,000+" / "50" shapes the weekly deal-number sync sweeps; repoint that sync to block 1787360000008_0.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, os.path.join(REPO, "backups", "homepage-2026-09-10-pre-quiz-hero"))
import write_snapshot as snap   # the verbatim live sections (shared CSS, form block, pricing block, widget block)
sys.path.insert(0, HERE)
from copy_lib import COPY, slot, plain   # copy.json = snapshot of the "CAN Homepage Copy" Google Sheet; can-copy.js applies live edits

BASE = "https://creatoraccessnetwork.github.io/can-widget/"
NUM = json.load(open(os.path.join(REPO, "numbers.json")))
TOTAL, COUNT, MEDIAN, SUBCOUNT = NUM["total_value"], str(NUM["partner_count"]), "$400", "30"
NUMS = {"total": TOTAL, "count": COUNT, "median": MEDIAN, "starter": SUBCOUNT}
COPY_SHEET = json.load(open(os.path.join(REPO, "copy_sheet.json")))["sheet_id"]
def S(key, tag="span", cls="", extra=""): return slot(key, NUMS, tag, cls, extra)

HERO, STARTER, WINS = "1787360000008", "1787360000009", "1787360000010"
OLD_HERO, OLD_QUIZ = "1787360000000", "1787360000007"
WIDGET, FOUNDER, CATS, HOW, FAQ, PRICING = "1787360000001", "1787360000002", "1787360000003", "1787360000004", "1787360000005", "1787360000006"

# ---- shared CSS: take the old hero's <style> block, extend the section-id lists, drop the old hero-form rules -------------
m = re.search(r"<style>(.*?)</style>", snap.HERO_CODE, re.S)
shared = m.group(1)
ALL_OLD = ",".join("#section-%s" % i for i in [OLD_HERO, WIDGET, FOUNDER, CATS, HOW, FAQ, PRICING])
ALL_NEW = ",".join("#section-%s" % i for i in [HERO, STARTER, WINS, OLD_HERO, WIDGET, FOUNDER, CATS, HOW, FAQ, PRICING])
assert shared.count(ALL_OLD) == 2, shared.count(ALL_OLD)
shared = shared.replace(ALL_OLD, ALL_NEW)
rows_old = ",".join("#section-%s .container>.row" % i for i in [OLD_HERO, WIDGET, FOUNDER, CATS, HOW, FAQ, PRICING])
rows_new = ",".join("#section-%s .container>.row" % i for i in [HERO, STARTER, WINS, OLD_HERO, WIDGET, FOUNDER, CATS, HOW, FAQ, PRICING])
cols_old = rows_old.replace(".container>.row", ".col-12"); cols_new = rows_new.replace(".container>.row", ".col-12")
assert rows_old in shared and cols_old in shared
shared = shared.replace(rows_old, rows_new).replace(cols_old, cols_new)
white_old = "#section-1787360000000,#section-1787360000002,#section-1787360000004,#section-1787360000006{background:#FFFFFF!important}"
white_new = "#section-%s,#section-%s,#section-1787360000000,#section-1787360000002,#section-1787360000006{background:#FFFFFF!important}" % (STARTER, WINS)
assert white_old in shared; shared = shared.replace(white_old, white_new)
pat_old = "#section-1787360000001,#section-1787360000003,#section-1787360000005{background-color"
pat_new = "#section-%s,#section-1787360000004,#section-1787360000001,#section-1787360000003,#section-1787360000005{background-color" % HERO
assert shared.count(pat_old) == 1; shared = shared.replace(pat_old, pat_new)
pat_m_old = "@media (max-width:768px){#section-1787360000001,#section-1787360000003,#section-1787360000005{background-image"
pat_m_new = "@media (max-width:768px){#section-%s,#section-1787360000004,#section-1787360000001,#section-1787360000003,#section-1787360000005{background-image" % HERO
assert shared.count(pat_m_old) == 1; shared = shared.replace(pat_m_old, pat_m_new)
cardw_old = "#section-1787360000000 .canv2 .can-card,#section-1787360000002 .canv2 .can-card,#section-1787360000004 .canv2 .can-card,#section-1787360000006 .canv2 .can-card{box-shadow:none}"
assert cardw_old in shared
shared = shared.replace(cardw_old, "#section-%s .canv2 .can-card,#section-%s .canv2 .can-card,%s" % (STARTER, WINS, cardw_old.replace("#section-1787360000004 .canv2 .can-card,", "")))
# the old hero's native-form rules move to the Starter Set section
form_css = "\n".join(l for l in shared.splitlines() if l.startswith("#section-1787360000000 form") or l.startswith("@media (max-width:600px){#section-1787360000000 form"))
shared = "\n".join(l for l in shared.splitlines() if not (l.startswith("#section-1787360000000 form") or l.startswith("@media (max-width:600px){#section-1787360000000 form")))
form_css = form_css.replace("#section-1787360000000", "#section-" + STARTER)
assert "1787360000000 form" not in shared and form_css.count("#section-" + STARTER) >= 8

HERO_CSS = """
/* hero v3: quiz in the hero (2026-09-10) */
.canv2.heroq{max-width:1160px}
.canv2 .heroq-card{display:grid;grid-template-columns:.98fr 1.02fr;gap:44px;align-items:center;padding:48px 52px;box-shadow:0 12px 32px rgba(26,31,44,.12)!important}
.canv2 .heroq-copy{min-width:0}
.canv2 .heroq-copy .can-eyebrow{font-size:15px;line-height:18px;letter-spacing:1.4px;margin:0 0 18px}
.canv2 .heroq-copy .hero-h1{font-size:44px;line-height:1.08;margin:0 0 20px;text-align:left;text-wrap:balance}
.canv2 .heroq-copy .hero-lead{font-size:19px;line-height:30px;font-weight:600;margin:0 0 18px;max-width:none;text-align:left;text-wrap:pretty}
.canv2 .heroq-copy .hero-sub{font-size:17px;line-height:26px;margin:0 0 22px;max-width:none;text-align:left;color:var(--can-charcoal)}
.canv2 .heroq-copy .hero-sub .arrow{color:var(--can-rust-text);font-weight:800}
.canv2 .heroq-copy .stats{display:flex;gap:28px;margin:0 0 22px;padding:16px 0 0;border-top:1px solid var(--can-hairline)}
.canv2 .heroq-copy .stat .n{font-family:var(--can-display);font-weight:700;font-size:26px;line-height:28px;color:var(--can-teal);font-variant-numeric:tabular-nums;letter-spacing:-.4px}
.canv2 .heroq-copy .stat .l{font-size:13px;line-height:18px;letter-spacing:1.2px;text-transform:uppercase;font-weight:600;color:var(--can-mute);margin-top:2px}
.canv2 .heroq-copy .hero-meta{text-align:left;margin:0}
.canv2 .hero-starter{margin:0;padding:26px 0 0;border-top:1px solid var(--can-hairline)}
.canv2 .starter-lab{display:block;font-size:15px;line-height:24px;color:var(--can-mute);margin:0 0 14px}.canv2 .starter-lab b{color:var(--can-ink)}.canv2 .starter-lab .q{display:block;margin-bottom:2px}
.canv2 .starter-row{display:flex;align-items:stretch;max-width:480px;border-radius:4px;filter:drop-shadow(0 1px 3px rgba(26,31,44,.06))}
.canv2 .starter-row input{flex:1 1 200px;min-width:0;height:50px!important;min-height:0;border:1px solid var(--can-border);border-right:0;border-radius:4px 0 0 4px;padding:0 14px;font-family:var(--can-body);font-size:16px;line-height:normal;color:var(--can-ink);background:#fff;margin:0!important;box-shadow:none}
.canv2 .starter-row .can-btn{height:50px!important;min-height:0;line-height:1;padding:0 22px;margin:0!important;border-radius:0 4px 4px 0;flex:none;font-size:16px}
.canv2 .starter-row .can-btn:disabled{opacity:.7;cursor:not-allowed}
.canv2 .starter-note{font-size:14px;line-height:20px;color:var(--can-mute);margin:12px 0 0;min-height:20px}.canv2 .starter-note.ok{color:var(--can-teal);font-weight:600}.canv2 .starter-note.err{color:var(--can-rust-text)}
@media (max-width:420px){.canv2 .starter-row{flex-wrap:wrap;filter:none}.canv2 .starter-row input{flex:1 1 100%;border-right:1px solid var(--can-border);border-radius:4px 4px 0 0}.canv2 .starter-row .can-btn{width:100%;border-radius:0 0 4px 4px}}
.canv2 .heroq-quiz{min-width:0}
.canv2 .heroq-quiz .canq{margin:0}
.canv2 .how-card{padding:40px 44px 32px}.canv2 .how-card .center{margin-bottom:28px}
@media (max-width:900px){
  .canv2 .heroq-card{grid-template-columns:1fr;gap:26px;padding:28px 20px 24px}
  .canv2 .heroq-copy .hero-h1{font-size:32px}
  .canv2 .heroq-copy .hero-lead{font-size:17px;line-height:26px}
  .canv2 .heroq-copy .stats{gap:20px;margin-bottom:18px}
  .canv2 .heroq-copy .stat .n{font-size:22px;line-height:24px}
}
"""

HERO_HTML = """<div class="canv2 heroq" id="top">
  <div class="can-card heroq-card">
    <div class="heroq-copy">
      %(eyebrow)s
      %(h1)s
      %(lead)s
      <div class="stats"><div class="stat">%(s1n)s%(s1l)s</div><div class="stat">%(s2n)s%(s2l)s</div><div class="stat">%(s3n)s%(s3l)s</div></div>
      <p class="hero-sub"><span class="arrow">&rarr;</span> %(sub)s</p>
      <form class="hero-starter" id="starter" novalidate>
        <span class="starter-lab">%(sq)s %(slab)s</span>
        <div class="starter-row"><input type="email" placeholder="%(splace)s" aria-label="Email" autocomplete="email" required data-copy="hero.starter.placeholder" data-copy-attr="placeholder">%(sbtn)s</div>
        %(snote)s
      </form>
    </div>
    <div class="heroq-quiz"><div id="can-quiz-mount"></div></div>
  </div>
</div>
<script>window.CANCOPY = %(copycfg)s;</script>
<script src="%(base)scan-copy.js?v=20260912a"></script>
<script>window.CANQUIZ = %(quizcfg)s;</script>
<script src="%(base)scan-quiz.js?v=20260912a"></script>
<script>window.CANSTARTER = {"form": "#starter", "source": "hero"};</script>
<script src="%(base)scan-starter.js"></script>
<script>(function(){function go(){if(location.hash==="#top"){var s=document.getElementById("starter");if(s){try{history.replaceState(null,"","#starter");}catch(e){}s.scrollIntoView();}}}go();window.addEventListener("hashchange",go);})();</script>""" % dict(
    eyebrow=S("hero.eyebrow", "p", "can-eyebrow"), h1=S("hero.h1", "h1", "hero-h1"), lead=S("hero.lead", "p", "hero-lead"),
    s1n=S("hero.stat1.n", "div", "n"), s1l=S("hero.stat1.l", "div", "l"), s2n=S("hero.stat2.n", "div", "n"), s2l=S("hero.stat2.l", "div", "l"),
    s3n=S("hero.stat3.n", "div", "n"), s3l=S("hero.stat3.l", "div", "l"), sub=S("hero.sub"),
    sq=S("hero.starter.q", "span", "q"), slab=S("hero.starter.lab"), splace=plain("hero.starter.placeholder", NUMS),
    sbtn=S("hero.starter.button", "button", "can-btn", 'type="submit"'), snote=S("hero.starter.note", "p", "starter-note", 'data-role="note"'),
    copycfg=json.dumps({"sheet": COPY_SHEET, "numbers": NUMS}), quizcfg=json.dumps({"embed": True, "starterUrl": "#starter", "label": plain("quiz.label", NUMS)}), base=BASE)

HERO_CODE = "<style>" + shared + HERO_CSS + "</style>\n" + HERO_HTML

STARTER_CODE = """<style>
%s
#section-%s{border-top:1px solid #EFF3F7}
.canv2 .starter-in{max-width:760px;margin:0 auto;text-align:center}
.canv2 .starter-in .can-h2{margin-bottom:10px}
.canv2 .starter-in .hero-sub{margin:0 auto 22px}
</style>
<div class="canv2 hero-in starter-in" id="starter">
  <p class="can-eyebrow" style="margin-bottom:12px">Free to start</p>
  <h2 class="can-h2">Not ready to join? Start with the free Starter Set.</h2>
  <p class="hero-sub">%s discounts, no card. Unlock them with your email and come back when the next project shows up.</p>
</div>""" % (form_css, STARTER, SUBCOUNT)

STARTER_META = snap.HERO_META  # "No spam, unsubscribe anytime. Or join for $49/year for 4x more savings."

WINS_CODE = """<div class="canv2" id="wins"><div id="can-testimonials-mount"></div></div>
<script>window.CANTESTI = %s;</script>
<script src="%scan-testimonials.js"></script>""" % (json.dumps({"surface": "white", "rows": ["members", "partners"], "eyebrow": plain("wins.eyebrow", NUMS), "headline": plain("wins.headline", NUMS), "sub": plain("wins.sub", NUMS)}), BASE)

WIDGET_CODE = snap.WIDGET_CODE.replace('"starterUrl": "#top"', '"starterUrl": "#starter"').replace("cansw-v2.js\"", "cansw-v2.js?v=20260910d\"")  # ?v= busts browser caches after widget pushes; bump it when cansw-v2.js changes
assert WIDGET_CODE != snap.WIDGET_CODE
# ---- 2026-09-12: sections are templates over copy.json (Avi edits the Google Sheet; can-copy.js applies it live) ----
PRICING_CODE = """<div class="canv2" id="pricing">
  <div class="center">%(eyebrow)s%(h2)s%(sub)s</div>
  <div class="can-card price-card">
    %(title)s
    <div class="price" style="margin:8px 0 16px">%(price)s%(per)s</div>
    <ul class="checks">
      <li><span class="chk">✓</span>%(b1)s</li>
      <li><span class="chk">✓</span>%(b2)s</li>
      <li><span class="chk">✓</span>%(b3)s</li>
      <li><span class="chk">✓</span>%(b4)s</li>
      <li><span class="chk">✓</span>%(b5)s</li>
    </ul>
    %(lock)s
    %(btn)s
    %(fine)s
  </div>
</div>
<!-- Mobile sticky bar hidden 2026-08-24 at Avi's request. To restore it, delete the <style> block below. -->
<style>@media (max-width:900px){.canv2-sticky{display:none!important}body{padding-bottom:0!important}}</style>
<div class="canv2-sticky"><span class="s-price">$49/year, locked in</span><a class="can-btn" href="#starter">Unlock the Starter Set</a></div>""" % dict(
    eyebrow=S("pricing.eyebrow", "p", "can-eyebrow"), h2=S("pricing.h2", "h2", "can-h2"), sub=S("pricing.sub", "p"), title=S("pricing.card.title", "div", "can-h3"),
    price=S("pricing.price"), per=S("pricing.per", "small"), b1=S("pricing.b1"), b2=S("pricing.b2"), b3=S("pricing.b3"), b4=S("pricing.b4"), b5=S("pricing.b5"),
    lock=S("pricing.lock", "div", "lock"), btn=S("pricing.button", "a", "can-btn can-btn--lg can-btn--block", 'href="https://www.creatoraccessnetwork.com/offers/oyLoKFBu/checkout"'),
    fine=S("pricing.fine", "p", "fine", 'style="text-align:center"'))
assert PRICING_CODE.count("#starter") == 2

FOUNDER_CODE = """<div class="canv2 two" id="founder">
  <div>
    %(eyebrow)s
    %(h2)s
    %(p1)s
    %(p2)s
    <p style="margin:8px 0 0">%(btn)s</p>
  </div>
  <div class="two-right">
    <div class="can-card founder">
      <img class="avatar" src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/sites/2148774616/images/420d636-e84b-bcd6-d80-5b5f8ee50f_Avi_Gandhi_Headshot_2026_-_Edited.jpg" alt="Avi Gandhi">
      <div>%(name)s%(role)s%(meta)s</div>
    </div>
    <div class="can-card receipt-card">
      <div class="rc-row">%(r1l)s%(r1r)s</div>
      <div class="rc-row">%(r2l)s%(r2r)s</div>
      <div class="rc-row">%(r3l)s%(r3r)s</div>
      <div class="rc-row tot">%(r4l)s%(r4r)s</div>
    </div>
  </div>
</div>""" % dict(
    eyebrow=S("founder.eyebrow", "p", "can-eyebrow"), h2=S("founder.h2", "h2", "can-h2"), p1=S("founder.p1", "p"), p2=S("founder.p2", "p"),
    btn=S("founder.button", "a", "can-btn", 'href="mailto:avi@creatoraccessnetwork.com"'), name=S("founder.name", "div", "can-h3"), role=S("founder.role", "div", "role"),
    meta=S("founder.meta", "div", "meta", 'style="margin-top:4px"'),
    r1l=S("founder.row1.l", "span", "l"), r1r=S("founder.row1.r", "span", "r"), r2l=S("founder.row2.l", "span", "l"), r2r=S("founder.row2.r", "span", "r"),
    r3l=S("founder.row3.l", "span", "l"), r3r=S("founder.row3.r", "span", "r"), r4l=S("founder.row4.l", "span", "l"), r4r=S("founder.row4.r", "span", "r"))

HOW_CODE = """<div class="canv2" id="how">
  <div class="can-card how-card">
  <div class="center">%(eyebrow)s%(h2)s</div>
  <div class="steps">
    <div><div class="stepn">1</div>%(h1)s%(p1)s</div>
    <div><div class="stepn">2</div>%(h2b)s%(p2)s</div>
    <div><div class="stepn">3</div>%(h3)s%(p3)s</div>
  </div>
  %(one)s
  </div>
</div>""" % dict(
    eyebrow=S("how.eyebrow", "p", "can-eyebrow"), h2=S("how.h2", "h2", "can-h2"),
    h1=S("how.step1.h", "div", "can-h3"), p1=S("how.step1.p", "p"), h2b=S("how.step2.h", "div", "can-h3"), p2=S("how.step2.p", "p"),
    h3=S("how.step3.h", "div", "can-h3"), p3=S("how.step3.p", "p"), one=S("how.oneline", "p", "oneline"))

FAQ_CODE = """<div class="canv2" id="faq" style="max-width:820px">
  <div class="can-card head-card">
    %(eyebrow)s
    %(h2)s
    %(sub)s
  </div>
  <div class="can-card faq">
    <details>%(q1)s%(a1)s</details>
    <details>%(q2)s%(a2)s</details>
    <details>%(q3)s%(a3)s</details>
    <details>%(q4)s%(a4)s</details>
    <details>%(q5)s%(a5)s</details>
  </div>
</div>""" % dict(
    eyebrow=S("faq.eyebrow", "p", "can-eyebrow", 'style="margin-bottom:8px"'), h2=S("faq.h2", "h2", "can-h2", 'style="margin:0"'), sub=S("faq.sub", "p", "meta", 'style="margin:8px 0 0"'),
    **{k: S("faq.%d.%s" % (i, "q" if k[0] == "q" else "a"), "summary" if k[0] == "q" else "p") for i in range(1, 6) for k in ("q%d" % i, "a%d" % i)})

CATS_CODE = snap.CATS_CODE.replace('href="#widget">Browse all 50 partners', 'href="https://www.creatoraccessnetwork.com/partners">Browse all 50 partners')
assert CATS_CODE != snap.CATS_CODE
OLD_HIDDEN = snap.OLD_HIDDEN
# 2026-09-10 late: calculator widget removed from the homepage (Avi: the quiz replaces it). Section 1787360000001 is
# HIDDEN, not deleted; to restore, set it hidden:"false" and put it back after WINS. Surfaces alternate:
# Hero (pattern) > Wins (white) > Categories (pattern) > Founder (white) > How (pattern, card) > Pricing (white) > FAQ (pattern).
# 2026-09-11: "What's Inside" (CATS, 1787360000003) is HIDDEN too (Avi: six named companies don't help; the quiz does that job).
# Surfaces: Hero (pattern) > Wins (white) > How (pattern, card) > Founder (white) > FAQ (pattern) > Pricing (white).
ORDER = ["", HERO, WINS, HOW, FOUNDER, FAQ, PRICING, CATS, WIDGET, STARTER, OLD_HERO, OLD_QUIZ] + OLD_HIDDEN


def build():
    secs = {
        HERO: snap.sec("Hero Quiz (v2)", snap.section_settings(96, 72, 72, 40), [(HERO + "_0", snap.code_block(HERO_CODE))]),
        STARTER: snap.sec("Starter Set (v2)", snap.section_settings(56, 64, 40, 48), [
            (STARTER + "_0", snap.code_block(STARTER_CODE)), (STARTER + "_1", json.loads(json.dumps(snap.FORM_BLOCK))), (STARTER + "_2", snap.code_block(STARTER_META))]),
        WINS: snap.sec("Member Wins (v2)", snap.section_settings(56, 40, 40, 24), [(WINS + "_0", snap.code_block(WINS_CODE))]),
        FOUNDER: {"blocks": {FOUNDER + "_0": {"settings": {"code": FOUNDER_CODE}}}},
        CATS: {"blocks": {CATS + "_0": {"settings": {"code": CATS_CODE}}}},
        HOW: {"blocks": {HOW + "_0": {"settings": {"code": HOW_CODE}}}},
        FAQ: {"blocks": {FAQ + "_0": {"settings": {"code": FAQ_CODE}}}},
        OLD_HERO: {"hidden": "true"},
        OLD_QUIZ: {"hidden": "true"},
        WIDGET: {"blocks": {WIDGET + "_0": {"settings": {"code": WIDGET_CODE}}}},
        PRICING: {"blocks": {PRICING + "_0": {"settings": {"code": PRICING_CODE}}}},
    }
    secs[STARTER]["hidden"] = "true"   # 2026-09-10 pm: the separate Starter Set section is retired (capture lives in the hero)
    secs[WIDGET] = {"hidden": "true"}  # 2026-09-10 late: calculator widget off the homepage; block code kept in the snapshot
    secs[CATS] = {"hidden": "true"}    # 2026-09-11: What's Inside off the homepage; block code kept in the snapshot (CATS_CODE)
    return {"sections": secs, "content_for_index": ORDER}


if __name__ == "__main__":
    out = build()
    if len(sys.argv) > 1 and sys.argv[1] == "--write":
        os.makedirs(os.path.join(HERE, "payloads"), exist_ok=True)
        p = os.path.join(HERE, "payloads", "home-v3.json")
        json.dump(out, open(p, "w"), ensure_ascii=False)
        print("wrote", p, len(json.dumps(out)), "bytes; hero block", len(HERO_CODE), "bytes")
    else:
        print(json.dumps(out, ensure_ascii=False))
