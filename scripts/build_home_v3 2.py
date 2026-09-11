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

BASE = "https://creatoraccessnetwork.github.io/can-widget/"
NUM = json.load(open(os.path.join(REPO, "numbers.json")))
TOTAL, COUNT, MEDIAN, SUBCOUNT = NUM["total_value"], str(NUM["partner_count"]), "$400", "30"

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
white_new = "#section-%s,#section-%s,#section-1787360000000,#section-1787360000002,#section-1787360000004,#section-1787360000006{background:#FFFFFF!important}" % (STARTER, WINS)
assert white_old in shared; shared = shared.replace(white_old, white_new)
pat_old = "#section-1787360000001,#section-1787360000003,#section-1787360000005{background-color"
pat_new = "#section-%s,#section-1787360000001,#section-1787360000003,#section-1787360000005{background-color" % HERO
assert shared.count(pat_old) == 1; shared = shared.replace(pat_old, pat_new)
pat_m_old = "@media (max-width:768px){#section-1787360000001,#section-1787360000003,#section-1787360000005{background-image"
pat_m_new = "@media (max-width:768px){#section-%s,#section-1787360000001,#section-1787360000003,#section-1787360000005{background-image" % HERO
assert shared.count(pat_m_old) == 1; shared = shared.replace(pat_m_old, pat_m_new)
cardw_old = "#section-1787360000000 .canv2 .can-card,#section-1787360000002 .canv2 .can-card,#section-1787360000004 .canv2 .can-card,#section-1787360000006 .canv2 .can-card{box-shadow:none}"
assert cardw_old in shared
shared = shared.replace(cardw_old, "#section-%s .canv2 .can-card,#section-%s .canv2 .can-card,%s" % (STARTER, WINS, cardw_old))
# the old hero's native-form rules move to the Starter Set section
form_css = "\n".join(l for l in shared.splitlines() if l.startswith("#section-1787360000000 form") or l.startswith("@media (max-width:600px){#section-1787360000000 form"))
shared = "\n".join(l for l in shared.splitlines() if not (l.startswith("#section-1787360000000 form") or l.startswith("@media (max-width:600px){#section-1787360000000 form")))
form_css = form_css.replace("#section-1787360000000", "#section-" + STARTER)
assert "1787360000000 form" not in shared and form_css.count("#section-" + STARTER) >= 8

HERO_CSS = """
/* hero v3: quiz in the hero (2026-09-10) */
.canv2.heroq{max-width:1160px}
.canv2 .heroq-card{display:grid;grid-template-columns:1.02fr .98fr;gap:48px;align-items:center;padding:52px 56px;box-shadow:0 12px 32px rgba(26,31,44,.12)!important}
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
.canv2 .heroq-quiz{min-width:0}
.canv2 .heroq-quiz .canq{margin:0}
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
      <p class="can-eyebrow">For Creators building a business</p>
      <h1 class="hero-h1">Our members <span class="tl">save money</span> while they build to <span class="tl">make money</span>.</h1>
      <p class="hero-lead">Member rates on the software and services successful Creators use.</p>
      <div class="stats"><div class="stat"><div class="n">%(total)s</div><div class="l">in discounts</div></div><div class="stat"><div class="n">%(count)s</div><div class="l">partners</div></div><div class="stat"><div class="n">%(median)s</div><div class="l">median discount</div></div></div>
      <p class="hero-meta">Not ready? <a href="#starter">Get the free %(sub)s-discount Starter Set</a>.</p>
    </div>
    <div class="heroq-quiz"><div id="can-quiz-mount"></div></div>
  </div>
</div>
<script>window.CANQUIZ = {"embed": true, "starterUrl": "#starter", "label": "Your next project"};</script>
<script src="%(base)scan-quiz.js"></script>
<script>(function(){function go(){if(location.hash==="#top"){var s=document.getElementById("starter");if(s){try{history.replaceState(null,"","#starter");}catch(e){}s.scrollIntoView();}}}go();window.addEventListener("hashchange",go);})();</script>""" % dict(total=TOTAL, median=MEDIAN, count=COUNT, sub=SUBCOUNT, base=BASE)

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
<script>window.CANTESTI = {"surface": "white", "rows": ["members", "partners"], "eyebrow": "Member wins", "headline": "Real Creators, real receipts.", "sub": ""};</script>
<script src="%scan-testimonials.js"></script>""" % BASE

WIDGET_CODE = snap.WIDGET_CODE.replace('"starterUrl": "#top"', '"starterUrl": "#starter"')
assert WIDGET_CODE != snap.WIDGET_CODE
PRICING_CODE = snap.PRICING_CODE.replace('href="#top"', 'href="#starter"')
assert PRICING_CODE.count("#starter") == 2
for a, b in [
    ('<span class="lead">Curated library</span> of educational resources', 'Discounts on <span class="lead">Creator education</span>'),
    ('<span class="lead">Community</span> of Creators building alongside you', 'A <span class="lead">community</span> of Creators, if you want it'),
    ('<span class="lead">New discounts</span> added at least monthly', '<span class="lead">New discounts</span> every month'),
    ('join at $49/year and your rate never goes up, even when the price does.', 'your rate never goes up, even when the price does.'),
    ('Not ready? <a href="#starter">Unlock the Starter Set free</a>.', 'Not ready? <a href="#starter">Get the Starter Set free</a>.'),
]:
    assert a in PRICING_CODE, a; PRICING_CODE = PRICING_CODE.replace(a, b)

# ---- copy pass, 2026-09-10 pm: same sections, fewer words. "Expert content library" removed (PMM decision 4). -------------
FOUNDER_CODE = snap.FOUNDER_CODE
_f_old = """    <p>15 years serving Creators as an agent, producer, and platform exec... then he got laid off and became one. After three failed communities, two fired accountants, and too many attempts at selling courses, products, and software, he had spent $12,000+ on experiments before finding the stack that worked.</p>
    <p>CAN shrinks that bill. Most partners give members the best rate they offer anywhere (look for the 🏆) and at just $49/year, it pays for itself fast.</p>"""
assert _f_old in FOUNDER_CODE
FOUNDER_CODE = FOUNDER_CODE.replace(_f_old, """    <p>15 years as an agent, producer and platform exec. Then he got laid off and became a Creator. Three failed communities, two fired accountants and $12,000+ of experiments later, he found the stack that worked.</p>
    <p>CAN shrinks that bill. Most partners give members their best rate anywhere (look for the 🏆), and at $49/year it pays for itself fast.</p>""")

CATS_CODE = snap.CATS_CODE
for a, b in [
    ("""Six of 50. The figure on each card is what a member saves. "Up to" depends on the plan you pick.""", "Six of 50. Each figure is what a member saves."),
    ("Member-only discount. Course, coaching, and membership platform where Creators have earned over $10 billion.", "Member-only rate on the platform where Creators have earned $10 billion+."),
    ("25% off paid plans for 1 year. Built by former Morning Brew employees.", "25% off paid plans for a year. Built by ex-Morning Brew."),
    ("30% off annual plans for your first year. Monetization with digital products, community chat, and an AI fan assistant.", "30% off annual plans, first year. Digital products, community chat, an AI fan assistant."),
    ("Up to $400 in cash bonuses, terms apply. Business banking used by thousands of small businesses.", "Up to $400 in cash bonuses, terms apply. Business banking for small businesses."),
    ("6 months of Pro free. AI dictation that types what you say in any app.", "6 months of Pro free. Dictation that types what you say, in any app."),
    ("5 years of your .store domain free. Separate your commerce from your content.", "5 years of your .store domain free."),
]:
    assert a in CATS_CODE, a; CATS_CODE = CATS_CODE.replace(a, b)

HOW_CODE = snap.HOW_CODE
for a, b in [
    ("Or start free with a starter set of discounts by email. Your rate locks for life when you join.", "Or start free with the Starter Set. Your rate locks for life."),
    ("Search by what you're about to buy. 🏆 means the best rate that partner offers anywhere.", "Search what you're about to buy. 🏆 marks the best rate anywhere."),
    ("One discount pays for the membership. New discounts land at least monthly.", "One discount pays for the year. New ones land monthly."),
    ("Membership also includes an expert content library and a community of Creators building alongside you.", "Plus a community of Creators building alongside you, if you want it."),
]:
    assert a in HOW_CODE, a; HOW_CODE = HOW_CODE.replace(a, b)

FAQ_CODE = snap.FAQ_CODE
for a, b in [
    ("No. The rates aren't public. They're pre-negotiated for members, and partners give their best rate anywhere. Access like this used to take years of relationships.", "No. The rates aren't public. They're negotiated for members, and most partners give their best rate anywhere."),
    ("No. Each one is worth more than $49, so the first one you use covers the year.", "No. Each one is worth more than $49, so the first one covers the year."),
    ("Your rate is locked in for life, even when the price goes up.", "Your rate is locked in for life."),
    ("No. Vendors don't discount their existing customers. The savings are for your next tool decision, as you build your stack.", "No. Vendors don't discount existing customers. The savings are for your next tool decision."),
    ("No. CAN doesn't represent you or take a cut of your income. It's a membership that gets you better rates on what you're buying anyway.", "No. CAN doesn't represent you or take a cut. It's a membership that gets you better rates on what you're buying anyway."),
]:
    assert a in FAQ_CODE, a; FAQ_CODE = FAQ_CODE.replace(a, b)

OLD_HIDDEN = snap.OLD_HIDDEN
ORDER = ["", HERO, WINS, WIDGET, FOUNDER, CATS, HOW, FAQ, PRICING, STARTER, OLD_HERO, OLD_QUIZ] + OLD_HIDDEN


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
    secs[STARTER]["hidden"] = "true"   # 2026-09-10 pm: the widget's inline capture replaced the separate section
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
