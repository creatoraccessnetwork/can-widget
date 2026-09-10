#!/usr/bin/env python3
"""
Add the Member Wins section (can-testimonials.js) to every v2 offer page, directly above the checkout.

    python3 scripts/offer_testimonials.py            # prints a summary
    python3 scripts/offer_testimonials.py --write    # writes scripts/payloads/offer-wins/<config>.json

One payload per offer theme (configs in scripts/offer_configs/, copied from the can-offer-page skill on 2026-09-10).
Each payload adds section 1787370000012 "Member Wins (v2)" (pattern background, one code block) and rewrites
content_for_index with the section inserted before the checkout (1744906803654). Existing sections are untouched.
Render order per template (can-offer-page skill, verified against the live newsletter and beehiiv themes 2026-09-10):
  regular: hero, widget, [wins], checkout, categories, founder, FAQ, how, founder question, pricing
  cobrand: hero, widget, [wins], checkout, partner quote, top picks, founder question
The fifteen segment pages are NOT in this list: can-segment.js renders the same strip itself.
"""
import glob, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = "https://creatoraccessnetwork.github.io/can-widget/"
PAT_D = BASE + "can-pattern-v4-desktop.svg"
PAT_M = BASE + "can-pattern-v4-mobile.svg"
CHECKOUT = "1744906803654"
WINS = "1787370000012"
IDS = dict(hero="1787370000000", widget="1787370000001", founder="1787370000002", cats="1787370000003",
           how="1787370000004", faq="1787370000005", pricing="1787370000006", fq="1787370000007",
           quote="1787370000008", picks="1787370000009")

WINS_CODE = """<!-- CAN offer page: Member Wins (v2). Sits directly above the checkout. Section on the icon pattern; every word inside the white cards can-testimonials.js renders. -->
<style>
#section-%(id)s{background-color:#F0F4F8!important;background-image:url('%(pd)s')!important;background-size:970px 970px!important;background-repeat:repeat!important}
@media (max-width:768px){#section-%(id)s{background-image:url('%(pm)s')!important;background-size:413px 413px!important}}
#section-%(id)s .container>.row{padding:0!important;margin:0 auto!important;background:transparent!important;border:0!important;box-shadow:none!important}
#section-%(id)s .col-12{padding-left:0!important;padding-right:0!important}
</style>
<div id="wins"><div id="can-testimonials-mount"></div></div>
<script>window.CANTESTI = {"surface": "pattern", "rows": ["members"], "compact": true, "eyebrow": "Member wins", "headline": "One discount covered the membership. Here are the receipts."};</script>
<script src="%(base)scan-testimonials.js"></script>""" % dict(id=WINS, pd=PAT_D, pm=PAT_M, base=BASE)


def code_block(html):
    return {"type": "code", "name": "Code", "hidden": "false", "deletable": True, "duplicatable": True, "hideable": True,
            "settings": {"width": "12", "code": html, "make_block": False, "make_flush": True, "text_align": "left",
                         "padding_desktop": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                         "padding_mobile": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                         "margin_desktop": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                         "margin_mobile": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                         "animation_type": "none", "animation_direction": "none", "delay": "0", "duration": "0", "reveal_units": "seconds"}}


def section(name, bid, html, top=56, bottom=48, mtop=40, mbottom=32):
    return {"type": "section", "name": name, "hidden": "false", "hideable": True, "saveable": True,
            "blocks": {bid: code_block(html)}, "block_order": [bid],
            "settings": {"bg_type": "none", "bg_image": "", "bg_video": "", "bg_position": "center", "background_fixed": False,
                         "background_color": "", "full_width": False, "full_height": False, "equal_height": False,
                         "vertical": "center", "horizontal": "center", "hide_on_desktop": False, "hide_on_mobile": False,
                         "padding_desktop": {"top": str(top), "right": "24", "bottom": str(bottom), "left": "24"},
                         "padding_mobile": {"top": str(mtop), "right": "16", "bottom": str(mbottom), "left": "16"},
                         "reveal_event": "", "reveal_offset": "", "reveal_units": "seconds"}}


def order_for(kind):
    if kind == "regular":
        return [IDS["hero"], IDS["widget"], WINS, CHECKOUT, IDS["cats"], IDS["founder"], IDS["faq"], IDS["how"], IDS["fq"], IDS["pricing"]]
    return [IDS["hero"], IDS["widget"], WINS, CHECKOUT, IDS["quote"], IDS["picks"], IDS["fq"]]


def build(cfg):
    return {"sections": {WINS: section("Member Wins (v2)", WINS + "_0", WINS_CODE)}, "content_for_index": order_for(cfg["kind"])}


if __name__ == "__main__":
    write = "--write" in sys.argv
    if write: os.makedirs(os.path.join(HERE, "payloads", "offer-wins"), exist_ok=True)
    for f in sorted(glob.glob(os.path.join(HERE, "offer_configs", "*.json"))):
        cfg = json.load(open(f)); name = os.path.basename(f)[:-5]
        out = build(cfg)
        print("%-14s %-8s theme %s  order %s" % (name, cfg["kind"], cfg["theme_id"], " ".join(out["content_for_index"])))
        if write: json.dump({"theme_id": cfg["theme_id"], "settings": out}, open(os.path.join(HERE, "payloads", "offer-wins", name + ".json"), "w"))
