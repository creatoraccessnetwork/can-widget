#!/usr/bin/env python3
"""
Build the Kajabi theme payload for a CAN project (segment) page.

    python3 scripts/build_segment_page.py <slug> > payload.json
    python3 scripts/build_segment_page.py --all        # writes scripts/payloads/<slug>.json

The page is a "segment" flavour of the v2 offer template (can-offer-page skill).
Almost everything is rendered client-side by can-segment.js, so each Kajabi code
block is a mount plus a config line. Sections, in render order:

  1787370000010  Project Page (v2)      code block, pattern background
  1744906803654  Checkout               Kajabi native, white, text block 1746107473790
  1787370000011  Pricing + Pick another code block, white

Numbers: the only figures typed into Kajabi are the site-wide total and count in
the checkout text block, taken from numbers.json at build time in the exact
"Plus $X+ in total savings from N top Creator companies." shape the weekly sync
already sweeps. Everything else is read live from numbers.json,
segments-live.json and cansw-data.json by the script.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
BASE = "https://creatoraccessnetwork.github.io/can-widget/"
PAT_D = BASE + "can-pattern-v4-desktop.svg"
PAT_M = BASE + "can-pattern-v4-mobile.svg"
CHECKOUT = "1744906803654"
CO_TEXT = "1746107473790"
CO_IMG = "1744906803654_0"
TOP = "1787370000010"
END = "1787370000011"

DISCLAIMER = ("By completing your purchase, you will be charged today for your Creator Access Network membership. "
              "Your membership will automatically renew according to your selected billing interval unless cancelled before renewal.")


def code_block(html):
    return {"type": "code", "name": "Code", "hidden": "false", "deletable": True, "duplicatable": True, "hideable": True,
            "settings": {"width": "12", "code": html, "make_block": False, "make_flush": True, "text_align": "left",
                         "padding_desktop": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                         "padding_mobile": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                         "margin_desktop": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                         "margin_mobile": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                         "animation_type": "none", "animation_direction": "none", "delay": "0", "duration": "0", "reveal_units": "seconds"}}


def section(name, bid, html, top=64, bottom=64, mtop=40, mbottom=40):
    return {"type": "section", "name": name, "hidden": "false", "hideable": True, "saveable": True,
            "blocks": {bid: code_block(html)}, "block_order": [bid],
            "settings": {"bg_type": "none", "bg_image": "", "bg_video": "", "bg_position": "center", "background_fixed": False,
                         "background_color": "", "full_width": False, "full_height": False, "equal_height": False,
                         "vertical": "center", "horizontal": "center", "hide_on_desktop": False, "hide_on_mobile": False,
                         "padding_desktop": {"top": str(top), "right": "24", "bottom": str(bottom), "left": "24"},
                         "padding_mobile": {"top": str(mtop), "right": "16", "bottom": str(mbottom), "left": "16"},
                         "reveal_event": "", "reveal_offset": "", "reveal_units": "seconds"}}


def checkout_text(total, count):
    bullets = [
        "Every discount on this page, plus the full catalog",
        "Your rate locked in for life, even when the price goes up",
        "Higher affiliate payouts on 20,000+ brands through ShopYourLikes",
        "New discounts added monthly",
    ]
    return ('<h2><strong>Included with your $49 membership</strong></h2>\n'
            '<p><strong><span style="color: #2a6478;">Your rate is locked in for life.</span></strong></p>\n'
            '<p>%s</p>\n<p>Plus %s in total savings from %s top Creator companies.</p>\n'
            '<h6><em><span>%s</span></em></h6>' % ("<br />".join("✔ " + b for b in bullets), total, count, DISCLAIMER))


def build(slug, pages, numbers):
    p = pages["pages"][slug]
    cfg = json.dumps({"seg": slug, "token": p["token"], "checkout": "#section-" + CHECKOUT})
    top_html = ('<div class="canseg-wrap" id="canseg-top"></div>\n'
                '<script>window.CANSEG = %s;</script>\n<script src="%scan-segment.js"></script>' % (cfg, BASE))
    end_html = '<div class="canseg-wrap" id="canseg-end"></div>'
    secs = {
        TOP: section("Project Page (v2)", TOP + "_0", top_html, top=72, bottom=64, mtop=48, mbottom=40),
        END: section("Pricing + Pick another (v2)", END + "_0", end_html),
        CHECKOUT: {"settings": {"background_color": "#FFFFFF", "checkout_block_btn_color": "#9E614A", "checkout_block_box_shadow": "medium",
                                "checkout_block_border_type": "none", "checkout_block_border_radius": "4", "checkout_block_btn_border_radius": "4",
                                "checkout_block_column_width": "5", "checkout_block_standalone_width": "8",
                                "show_checkout_block_first_on_mobile": True, "show_checkout_block_right_on_desktop": True},
                   "blocks": {CO_TEXT: {"hidden": "false", "settings": {"text": checkout_text(numbers["total_value"], numbers["partner_count"]),
                                                                       "width": "7", "background_color": "#FFFFFF", "box_shadow": "medium", "border_radius": "4",
                                                                       "padding_desktop": {"top": "24", "right": "32", "bottom": "24", "left": "32"},
                                                                       "padding_mobile": {"top": "20", "right": "16", "bottom": "20", "left": "16"}}},
                              CO_IMG: {"hidden": "true"}}},
    }
    css = ("@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Open+Sans:wght@400;600;700;800&display=swap');\n"
           "/* CAN project page (segment flavour of the v2 offer template). Body carries the pattern; checkout and pricing sections are white. */\n"
           "body{background:#F0F4F8 url('%s') repeat;background-size:970px 970px}\n"
           "#section-%s,#section-%s{background:#FFFFFF !important;background-image:none !important}\n"
           "#section-%s .container>.row,#section-%s .container>.row{padding:0 !important;margin:0 auto !important;background:transparent !important;border:0 !important;box-shadow:none !important}\n"
           "#section-%s .col-12,#section-%s .col-12{padding-left:0 !important;padding-right:0 !important}\n"
           "@media (max-width:768px){body{background-image:url('%s');background-size:413px 413px}}"
           % (PAT_D, CHECKOUT, END, TOP, END, TOP, END, PAT_M))
    return {"sections": secs, "content_for_index": [TOP, CHECKOUT, END], "css": css}


if __name__ == "__main__":
    pages = json.load(open(os.path.join(HERE, "segment_pages.json")))
    numbers = json.load(open(os.path.join(REPO, "numbers.json")))
    if sys.argv[1] == "--all":
        os.makedirs(os.path.join(HERE, "payloads"), exist_ok=True)
        for slug in pages["pages"]:
            out = build(slug, pages, numbers)
            json.dump(out, open(os.path.join(HERE, "payloads", slug + ".json"), "w"))
            print(slug, len(json.dumps(out)), "bytes")
    else:
        print(json.dumps(build(sys.argv[1], pages, numbers)))
