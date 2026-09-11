#!/usr/bin/env python3
"""Snapshot of the LIVE Creator Access Network homepage (Kajabi site 2148774616, site theme 2164431783)
taken 2026-09-10 ~09:00 PT, BEFORE the quiz became the hero. Transcribed from get_theme_content(section_filter=...)
reads of every v2 section. Run this file to (re)generate live-sections.json and revert-*.json next to it.

Two layouts are captured:
  * pre-quiz  (the Aug 22 layout, no quiz at all)        -> revert-pre-quiz.json
  * with-quiz (quiz section under the hero, live 09-10)  -> revert-quiz-under-hero.json
Both payloads only flip hidden flags and rewrite content_for_index; nothing is deleted from Kajabi.
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
PAT_D = "https://creatoraccessnetwork.github.io/can-widget/can-pattern-v4-desktop.svg"
PAT_M = "https://creatoraccessnetwork.github.io/can-widget/can-pattern-v4-mobile.svg"

def pad(t, r, b, l): return {"top": str(t), "right": str(r), "bottom": str(b), "left": str(l)}

def section_settings(top, bottom, mtop, mbottom):
    return {"bg_type": "none", "bg_image": "", "bg_video": "", "bg_position": "center", "background_fixed": "false",
            "background_color": "", "full_width": "false", "full_height": "false", "equal_height": "false",
            "vertical": "center", "horizontal": "center", "hide_on_desktop": "false", "hide_on_mobile": "false",
            "padding_desktop": pad(top, 24, bottom, 24), "padding_mobile": pad(mtop, 16, mbottom, 16),
            "reveal_event": "", "reveal_offset": "", "reveal_units": "seconds"}

def code_block(code):
    return {"type": "code", "settings": {
        "code": code, "width": "12", "background_color": "", "border_type": "none", "border_width": "0", "border_color": "",
        "border_radius": "0", "box_shadow": "none", "hide_on_desktop": "false", "text_align": "left",
        "padding_desktop": pad(0, 0, 0, 0), "margin_desktop": pad(0, 0, 0, 0), "make_flush": "true", "make_block": "true",
        "hide_on_mobile": "false", "mobile_text_align": "left", "padding_mobile": pad(0, 0, 0, 0), "margin_mobile": pad(0, 0, 0, 0),
        "animation_type": "none", "animation_direction": "none", "delay": "0", "duration": "0",
        "reveal_event": "", "reveal_offset": "", "reveal_units": "seconds"}}

FORM_BLOCK = {"type": "form", "settings": {
    "width": "6", "form": "2149438902", "thank_you": "", "text": "", "disclaimer_text": "", "disclaimer_text_color": "#5B6572",
    "input_label": "placeholder", "inline": "true", "btn_text": "Unlock the Starter Set", "btn_width": "", "btn_style": "",
    "btn_size": "large", "btn_border_radius": "4", "btn_text_color": "#FFFFFF", "btn_background_color": "#9E614A",
    "background_color": "", "border_type": "none", "border_width": "0", "border_color": "", "border_radius": "0", "box_shadow": "none",
    "hide_on_desktop": "false", "text_align": "center", "padding_desktop": pad(0, 0, 0, 0), "margin_desktop": pad(0, 0, 0, 0),
    "make_flush": "true", "make_block": "true", "hide_on_mobile": "false", "mobile_text_align": "center",
    "padding_mobile": pad(0, 0, 0, 0), "margin_mobile": pad(0, 0, 0, 0), "animation_type": "none", "animation_direction": "none",
    "delay": "0", "duration": "0", "reveal_event": "", "reveal_offset": "", "reveal_units": "seconds"}}

# ---------------------------------------------------------------------------------------------------------
# Hero (v2) block 0: ALL shared CSS for the seven v2 sections + the hero markup. Verbatim from Kajabi 2026-09-10.
# ---------------------------------------------------------------------------------------------------------
HERO_CODE = r"""<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@700;900&family=Open+Sans:wght@400;600;700;800&display=swap');
#section-1787360000000,#section-1787360000001,#section-1787360000002,#section-1787360000003,#section-1787360000004,#section-1787360000005,#section-1787360000006{--can-teal:#2A6478;--can-teal-dark:#1E4F5F;--can-rust-text:#9E614A;--can-ink:#1A1F2C;--can-charcoal:#374151;--can-mute:#5B6572;--can-white:#FFFFFF;--can-ground:#F0F4F8;--can-surface-2:#FAFBFD;--can-border:#E6EBF2;--can-hairline:#EFF3F7;--can-display:'Lato',system-ui,sans-serif;--can-body:'Open Sans',system-ui,sans-serif;--can-radius:4px;--can-shadow-card:0 3px 10px rgba(26,31,44,.10);}
#section-1787360000000,#section-1787360000001,#section-1787360000002,#section-1787360000003,#section-1787360000004,#section-1787360000005,#section-1787360000006{font-family:var(--can-body);font-size:17px;line-height:26px;color:var(--can-charcoal);-webkit-font-smoothing:antialiased}
#section-1787360000000 .container>.row,#section-1787360000001 .container>.row,#section-1787360000002 .container>.row,#section-1787360000003 .container>.row,#section-1787360000004 .container>.row,#section-1787360000005 .container>.row,#section-1787360000006 .container>.row{padding:0!important;margin:0 auto!important;background:transparent!important;border:0!important;box-shadow:none!important}
#section-1787360000000 .col-12,#section-1787360000001 .col-12,#section-1787360000002 .col-12,#section-1787360000003 .col-12,#section-1787360000004 .col-12,#section-1787360000005 .col-12,#section-1787360000006 .col-12{padding-left:0!important;padding-right:0!important}
#section-1787360000000,#section-1787360000002,#section-1787360000004,#section-1787360000006{background:#FFFFFF!important}
#section-1787360000001,#section-1787360000003,#section-1787360000005{background-color:#F0F4F8!important;background-image:url('https://creatoraccessnetwork.github.io/can-widget/can-pattern-v4-desktop.svg')!important;background-size:970px 970px!important;background-repeat:repeat!important}
@media (max-width:768px){#section-1787360000001,#section-1787360000003,#section-1787360000005{background-image:url('https://creatoraccessnetwork.github.io/can-widget/can-pattern-v4-mobile.svg')!important;background-size:413px 413px!important}}
.canv2{text-align:left;max-width:1160px;margin:0 auto}
.canv2 *{box-sizing:border-box}
.canv2 a{color:var(--can-teal);font-weight:700;text-decoration:none}
.canv2 a:hover{color:var(--can-teal-dark);text-decoration:underline}
.canv2 p{margin:0 0 16px;font-size:17px;line-height:26px;color:var(--can-charcoal)}
.canv2 h1,.canv2 h2,.canv2 h3{margin:0;color:var(--can-ink)}
.canv2 .wrap{max-width:1160px;margin:0 auto;padding:0 24px}
.canv2 .can-card{background:#fff;border:1px solid var(--can-border);border-radius:var(--can-radius);box-shadow:var(--can-shadow-card)}
#section-1787360000000 .canv2 .can-card,#section-1787360000002 .canv2 .can-card,#section-1787360000004 .canv2 .can-card,#section-1787360000006 .canv2 .can-card{box-shadow:none}
.canv2 .can-eyebrow{font-family:var(--can-body);font-size:15px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;line-height:18px;color:var(--can-rust-text);margin:0 0 16px}
.canv2 .can-h2{font-family:var(--can-display);font-weight:900;font-size:32px;line-height:1.12;letter-spacing:-.6px;color:var(--can-ink);margin:0 0 16px}
.canv2 .can-h3{font-family:var(--can-body);font-weight:700;font-size:17px;line-height:26px;color:var(--can-ink)}
.canv2 .meta{font-size:15px;line-height:22px;color:var(--can-mute)}
.canv2 .micro{font-size:13px;line-height:18px;letter-spacing:1.2px;text-transform:uppercase;font-weight:600;color:var(--can-mute)}
.canv2 .lead{color:var(--can-ink);font-weight:700}
.canv2 .can-btn,.canv2 .can-btn:visited{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 24px;border:0;border-radius:var(--can-radius);cursor:pointer;font-family:var(--can-body);font-weight:700;font-size:17px;background:var(--can-rust-text);color:#fff;white-space:nowrap;transition:background 150ms ease;text-decoration:none}
.canv2 .can-btn:hover{background:#87503D;color:#fff;text-decoration:none}
.canv2 .can-btn--secondary{background:var(--can-teal)}.canv2 .can-btn--secondary:hover{background:var(--can-teal-dark)}
.canv2 .can-btn--lg{height:52px;padding:0 32px}.canv2 .can-btn--block{width:100%}
.canv2 .checks{list-style:none;padding:0;margin:0}.canv2 .checks li{display:flex;gap:10px;align-items:flex-start;padding:6px 0}
.canv2 .chk{flex:none;width:18px;height:18px;border-radius:50%;background:var(--can-teal);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;margin-top:1px}
.canv2 .fine{font-size:15px;line-height:22px;color:var(--can-mute);margin:8px 0 0}
/* hero */
.canv2.hero-in{max-width:1000px;margin:0 auto;text-align:center}
.canv2.hero .can-eyebrow{font-size:18px;line-height:24px;letter-spacing:1.6px;margin-bottom:24px}
.canv2 .hero-h1 .tl{color:var(--can-teal)}
.canv2 .hero-h1{font-family:var(--can-display);font-weight:900;font-size:44px;line-height:1.1;letter-spacing:-.8px;color:var(--can-ink);margin:0 0 32px;text-wrap:balance}
.canv2 .hero-lead{font-size:23px;line-height:34px;font-weight:600;color:var(--can-charcoal);margin:0 auto 24px;max-width:820px;text-wrap:balance}
.canv2 .hero-lead .lead{color:var(--can-teal);font-variant-numeric:tabular-nums}
.canv2 .hero-sub{font-size:19px;line-height:28px;color:var(--can-charcoal);margin:0 auto 8px;max-width:820px}
.canv2 .hero-meta{font-size:15px;line-height:22px;color:var(--can-mute);margin:8px 0 0;text-align:center}
/* native Kajabi form inside the hero */
#section-1787360000000 form{max-width:560px;margin:0 auto;display:flex;gap:0;align-items:stretch;flex-wrap:wrap;justify-content:center;border-radius:4px;box-shadow:none!important;filter:drop-shadow(0 6px 14px rgba(26,31,44,.16))}
#section-1787360000000 form .form-group,#section-1787360000000 form .form-field{margin:0;flex:1 1 240px;min-width:0}
#section-1787360000000 form input[type=email],#section-1787360000000 form input[type=text]{width:100%;height:56px;border:1px solid var(--can-border);border-right:0;border-radius:4px 0 0 4px;padding:0 16px;font-family:var(--can-body);font-size:17px;color:var(--can-ink);box-shadow:none;margin:0;background:#fff}
#section-1787360000000 form .btn,#section-1787360000000 form button,#section-1787360000000 form input[type=submit]{height:56px;padding:0 32px;border-radius:0 4px 4px 0;background:var(--can-rust-text)!important;border-color:var(--can-rust-text)!important;color:#fff!important;font-family:var(--can-body);font-weight:700;font-size:17px;white-space:nowrap;margin:0}
#section-1787360000000 form .btn:hover,#section-1787360000000 form button:hover{background:#87503D!important;border-color:#87503D!important}
@media (max-width:600px){#section-1787360000000 form .btn,#section-1787360000000 form button,#section-1787360000000 form input[type=submit]{width:100%;border-radius:0 0 4px 4px}#section-1787360000000 form input[type=email]{border-right:1px solid var(--can-border);border-radius:4px 4px 0 0}}
/* hero breathing room */
.canv2.hero .can-eyebrow{margin-bottom:28px}
.canv2 .hero-h1{margin:0 0 36px}
.canv2 .hero-lead{margin:0 auto 32px}
.canv2 .hero-sub{margin:0 auto 20px}
.canv2 .hero-meta{margin:20px 0 0}
/* founder */
.canv2.two,.canv2 .two{display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:stretch}
.canv2 .two-right{display:flex;flex-direction:column;justify-content:space-between;gap:24px}
.canv2 .founder{display:flex;gap:16px;align-items:center;padding:20px 24px}
.canv2 .avatar{width:64px;height:64px;border-radius:50%;border:1px solid var(--can-border);object-fit:cover;flex:none;max-width:64px}
.canv2 .role{font-size:12px;line-height:16px;letter-spacing:1px;text-transform:uppercase;font-weight:800;color:var(--can-rust-text);margin:2px 0 6px}
.canv2 .receipt-card{margin:0;padding:0}
.canv2 .rc-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 20px;border-bottom:1px solid var(--can-hairline);font-size:15px;line-height:22px;white-space:nowrap}.canv2 .rc-row:last-child{border-bottom:0}
.canv2 .rc-row .l{color:var(--can-charcoal);overflow:hidden;text-overflow:ellipsis}.canv2 .rc-row .r{font-weight:700;color:var(--can-teal);font-variant-numeric:tabular-nums}
.canv2 .rc-row.tot .l{font-weight:700;color:var(--can-ink)}.canv2 .rc-row.tot .r{font-family:var(--can-display);font-size:26px}
/* discount cards */
.canv2 .head-card{padding:26px;margin-bottom:24px;text-align:center}
.canv2 .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.canv2 .dcard{padding:26px;display:flex;flex-direction:column;gap:6px;min-height:170px}
.canv2 .dcard .cat{font-size:13px;line-height:18px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--can-teal)}
.canv2 .dcard .nm{font-weight:700;color:var(--can-ink);font-size:17px}
.canv2 .dcard .dl{font-size:15px;line-height:22px;color:var(--can-mute);flex:1}
.canv2 .dcard .vl{font-family:var(--can-display);font-weight:700;color:var(--can-teal);font-size:26px;line-height:26px;font-variant-numeric:tabular-nums;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.canv2 .dcard .vl small{font-family:var(--can-body);font-weight:600;font-size:13px;letter-spacing:1.2px;text-transform:uppercase;color:var(--can-mute)}
/* how */
.canv2 .center{text-align:center;max-width:720px;margin:0 auto 32px}
.canv2 .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:32px}
.canv2 .stepn{font-family:var(--can-display);font-weight:700;color:var(--can-teal);font-size:26px;line-height:26px;margin-bottom:8px}
.canv2 .oneline{margin:28px 0 0;color:var(--can-charcoal);text-align:center}
/* faq */
.canv2 .faq{padding:8px 26px}
.canv2 .faq details{border-bottom:1px solid var(--can-hairline);padding:14px 0}.canv2 .faq details:last-child{border-bottom:0}
.canv2 .faq summary{cursor:pointer;font-weight:700;color:var(--can-ink);list-style:none;display:flex;justify-content:space-between;gap:12px;font-size:17px;line-height:26px}
.canv2 .faq summary::-webkit-details-marker{display:none}
.canv2 .faq summary::after{content:"+";color:var(--can-teal);font-weight:800}.canv2 .faq details[open] summary::after{content:"–"}
.canv2 .faq p{margin:10px 0 0;color:var(--can-charcoal)}
/* pricing */
.canv2 .price-card{max-width:520px;margin:0 auto;padding:32px;box-shadow:var(--can-shadow-card)!important}
.canv2 .price{font-family:var(--can-display);font-weight:700;color:var(--can-teal);font-size:48px;line-height:1.05;letter-spacing:-1px;font-variant-numeric:tabular-nums}
.canv2 .price small{font-family:var(--can-body);font-weight:600;font-size:17px;letter-spacing:0;color:var(--can-mute);margin-left:4px}
.canv2 .lock{background:var(--can-surface-2);border:1px solid var(--can-border);border-radius:var(--can-radius);padding:12px 14px;font-size:15px;line-height:22px;color:var(--can-charcoal);margin:16px 0}
/* mobile sticky */
.canv2-sticky{display:none}
@media (max-width:900px){
  .canv2.two,.canv2 .grid3,.canv2 .steps{grid-template-columns:1fr;gap:32px}
  .canv2 .can-h2{font-size:26px}
  .canv2.hero .can-eyebrow{font-size:15px;line-height:20px}
  .canv2 .hero-h1{font-size:34px}.canv2 .hero-lead{font-size:19px;line-height:28px}.canv2 .hero-sub{font-size:17px;line-height:26px}
  .canv2-sticky{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:40;background:#fff;border-top:1px solid #E6EBF2;padding:10px 16px;gap:8px;align-items:center;justify-content:space-between;font-family:'Open Sans',system-ui,sans-serif}
  .canv2-sticky .s-price{font-family:'Lato',system-ui,sans-serif;font-weight:700;color:#2A6478;white-space:nowrap}
  .canv2-sticky .can-btn{height:40px;padding:0 16px;display:inline-flex;align-items:center;border-radius:4px;background:#9E614A;color:#fff!important;font-weight:700;text-decoration:none!important}
  body{padding-bottom:68px}
}
</style>
<div class="canv2 hero-in hero" id="top">
  <p class="can-eyebrow">Starting a Creator business is expensive.</p>
  <h1 class="hero-h1">Our members <span class="tl">save money</span> while they build to <span class="tl">make money</span>.</h1>
  <p class="hero-lead">Access <span class="lead">$36,000+</span> in pre-negotiated discounts on the software and services successful Creators use. Median discount: <span class="lead">$400</span>.</p>
  <p class="hero-sub">Start saving free with the 30-discount Starter Set - unlock it below.</p>
</div>"""

HERO_META = r"""<div class="canv2 hero-in"><p class="hero-meta">No spam, unsubscribe anytime. Or <a href="#pricing">join for $49/year</a> for 4x more savings.</p></div>"""

QUIZ_CODE = r"""<!-- CAN homepage: Project Quiz (v2). Placed directly under the Hero (v2). The section sits on the icon pattern; every word is inside the white card the script renders. -->
<style>
#section-1787360000007{background-color:#F0F4F8!important;background-image:url('https://creatoraccessnetwork.github.io/can-widget/can-pattern-v4-desktop.svg')!important;background-size:970px 970px!important;background-repeat:repeat!important}
@media (max-width:768px){#section-1787360000007{background-image:url('https://creatoraccessnetwork.github.io/can-widget/can-pattern-v4-mobile.svg')!important;background-size:413px 413px!important}}
#section-1787360000007 .container>.row{padding:0!important;margin:0 auto!important;background:transparent!important;border:0!important;box-shadow:none!important}
#section-1787360000007 .col-12{padding-left:0!important;padding-right:0!important}
</style>
<div id="quiz"><div id="can-quiz-mount"></div></div>
<script>window.CANQUIZ = {"starterUrl": "#top"};</script>
<script src="https://creatoraccessnetwork.github.io/can-widget/can-quiz.js"></script>"""

WIDGET_CODE = r"""<div class="canv2" id="widget"><div id="cansw-mount"></div></div>
<script>window.CANSW_OVERRIDES = {"joinUrl": "https://www.creatoraccessnetwork.com/offers/oyLoKFBu/checkout", "starterUrl": "#top", "membershipCost": 49};</script>
<script src="https://creatoraccessnetwork.github.io/can-widget/cansw-v2.js"></script>"""

FOUNDER_CODE = r"""<div class="canv2 two" id="founder">
  <div>
    <p class="can-eyebrow">Why CAN exists</p>
    <h2 class="can-h2">Avi spent $12,000+ finding a stack that worked. CAN would have saved him $3,100.</h2>
    <p>15 years serving Creators as an agent, producer, and platform exec... then he got laid off and became one. After three failed communities, two fired accountants, and too many attempts at selling courses, products, and software, he had spent $12,000+ on experiments before finding the stack that worked.</p>
    <p>CAN shrinks that bill. Most partners give members the best rate they offer anywhere (look for the 🏆) and at just $49/year, it pays for itself fast.</p>
    <p style="margin:8px 0 0"><a class="can-btn can-btn--secondary" href="mailto:avi@creatoraccessnetwork.com">Reach out to Avi</a></p>
  </div>
  <div class="two-right">
    <div class="can-card founder">
      <img class="avatar" src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/sites/2148774616/images/420d636-e84b-bcd6-d80-5b5f8ee50f_Avi_Gandhi_Headshot_2026_-_Edited.jpg" alt="Avi Gandhi">
      <div><div class="can-h3">Avi Gandhi</div><div class="role">Founder, Creator Access Network</div><div class="meta" style="margin-top:4px">17 years in the Creator Economy. Former WME agent and Head of Creator Partnerships at Patreon.</div></div>
    </div>
    <div class="can-card receipt-card">
      <div class="rc-row"><span class="l">Spent on experiments that didn't work</span><span class="r">$12,000+</span></div>
      <div class="rc-row"><span class="l">What CAN discounts would have saved</span><span class="r">$3,100+</span></div>
      <div class="rc-row"><span class="l">CAN membership</span><span class="r">$49</span></div>
      <div class="rc-row tot"><span class="l">Net, first year</span><span class="r">$3,050+</span></div>
    </div>
  </div>
</div>"""

CATS_CODE = r"""<div class="canv2" id="discounts">
  <div class="can-card head-card">
    <p class="can-eyebrow" style="margin-bottom:8px">What's inside</p>
    <h2 class="can-h2" style="margin:0">Discounts for every part of the business.</h2>
    <p class="meta" style="margin:8px 0 0">Six of 50. The figure on each card is what a member saves. "Up to" depends on the plan you pick.</p>
  </div>
  <div class="grid3">
    <div class="can-card dcard"><div class="cat">Courses &amp; Community</div><div class="nm">Kajabi 🏆</div><div class="dl">Member-only discount. Course, coaching, and membership platform where Creators have earned over $10 billion.</div><div class="vl">$358 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Newsletter</div><div class="nm">beehiiv 🏆</div><div class="dl">25% off paid plans for 1 year. Built by former Morning Brew employees.</div><div class="vl">up to $1,212 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Link in Bio</div><div class="nm">Pop.store 🏆</div><div class="dl">30% off annual plans for your first year. Monetization with digital products, community chat, and an AI fan assistant.</div><div class="vl">up to $717 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Banking</div><div class="nm">Mercury 🏆</div><div class="dl">Up to $400 in cash bonuses, terms apply. Business banking used by thousands of small businesses.</div><div class="vl">up to $400 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Productivity</div><div class="nm">Wispr Flow</div><div class="dl">6 months of Pro free. AI dictation that types what you say in any app.</div><div class="vl">up to $90 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Domains</div><div class="nm">.store 🏆</div><div class="dl">5 years of your .store domain free. Separate your commerce from your content.</div><div class="vl">$200 <small>you save</small></div></div>
  </div>
  <div style="text-align:center;margin-top:24px"><a class="can-btn can-btn--secondary" href="#widget">Browse all 50 partners</a></div>
</div>"""

HOW_CODE = r"""<div class="canv2" id="how">
  <div class="center"><p class="can-eyebrow">How it works</p><h2 class="can-h2">Three steps to a more profitable business.</h2></div>
  <div class="steps">
    <div><div class="stepn">1</div><div class="can-h3">Join for $49 a year</div><p>Or start free with a starter set of discounts by email. Your rate locks for life when you join.</p></div>
    <div><div class="stepn">2</div><div class="can-h3">Browse by category</div><p>Search by what you're about to buy. 🏆 means the best rate that partner offers anywhere.</p></div>
    <div><div class="stepn">3</div><div class="can-h3">Redeem as you build</div><p>One discount pays for the membership. New discounts land at least monthly.</p></div>
  </div>
  <p class="oneline">Membership also includes an expert content library and a community of Creators building alongside you.</p>
</div>"""

FAQ_CODE = r"""<div class="canv2" id="faq" style="max-width:820px">
  <div class="can-card head-card">
    <p class="can-eyebrow" style="margin-bottom:8px">FAQ</p>
    <h2 class="can-h2" style="margin:0">Questions Creators ask before joining.</h2>
    <p class="meta" style="margin:8px 0 0">Short and sweet. Anything else, <a href="mailto:avi@creatoraccessnetwork.com">email our founder</a>.</p>
  </div>
  <div class="can-card faq">
    <details><summary>Is this a coupon site?</summary><p>No. The rates aren't public. They're pre-negotiated for members, and partners give their best rate anywhere. Access like this used to take years of relationships.</p></details>
    <details><summary>Do I have to use every discount?</summary><p>No. Each one is worth more than $49, so the first one you use covers the year.</p></details>
    <details><summary>What if the price goes up?</summary><p>Your rate is locked in for life, even when the price goes up.</p></details>
    <details><summary>Does CAN discount tools I'm using right now?</summary><p>No. Vendors don't discount their existing customers. The savings are for your next tool decision, as you build your stack.</p></details>
    <details><summary>Is CAN an agency?</summary><p>No. CAN doesn't represent you or take a cut of your income. It's a membership that gets you better rates on what you're buying anyway.</p></details>
  </div>
</div>"""

PRICING_CODE = r"""<div class="canv2" id="pricing">
  <div class="center"><p class="can-eyebrow">Membership</p><h2 class="can-h2">Save thousands for just $49/year.</h2><p>It pays for itself.</p></div>
  <div class="can-card price-card">
    <div class="can-h3">CAN Membership</div>
    <div class="price" style="margin:8px 0 16px">$49<small>/year</small></div>
    <ul class="checks">
      <li><span class="chk">✓</span><span><span class="lead">$36,000+</span> in savings across 50 partners</span></li>
      <li><span class="chk">✓</span><span>Higher affiliate payouts on <span class="lead">20,000+ brands</span> through ShopYourLikes</span></li>
      <li><span class="chk">✓</span><span><span class="lead">Curated library</span> of educational resources</span></li>
      <li><span class="chk">✓</span><span><span class="lead">Community</span> of Creators building alongside you</span></li>
      <li><span class="chk">✓</span><span><span class="lead">New discounts</span> added at least monthly</span></li>
    </ul>
    <div class="lock"><span class="lead">Locked in for life:</span> join at $49/year and your rate never goes up, even when the price does.</div>
    <a class="can-btn can-btn--lg can-btn--block" href="https://www.creatoraccessnetwork.com/offers/oyLoKFBu/checkout">Join for $49</a>
    <p class="fine" style="text-align:center">Not ready? <a href="#top">Unlock the Starter Set free</a>.</p>
  </div>
</div>
<!-- Mobile sticky bar hidden 2026-08-24 at Avi's request. To restore it, delete the <style> block below. -->
<style>@media (max-width:900px){.canv2-sticky{display:none!important}body{padding-bottom:0!important}}</style>
<div class="canv2-sticky"><span class="s-price">$49/year, locked in</span><a class="can-btn" href="#top">Unlock the Starter Set</a></div>"""

def sec(name, settings, blocks):
    return {"type": "section", "name": name, "hidden": "false", "settings": settings,
            "block_order": [b for b, _ in blocks], "blocks": {b: v for b, v in blocks}}

SECTIONS = {
    "1787360000000": sec("Hero (v2)", section_settings(96, 72, 72, 40), [
        ("1787360000000_0", code_block(HERO_CODE)), ("1787360000000_1", FORM_BLOCK), ("1787360000000_2", code_block(HERO_META))]),
    "1787360000007": sec("Project Quiz (v2)", section_settings(64, 64, 40, 40), [("1787360000007_0", code_block(QUIZ_CODE))]),
    "1787360000001": sec("Savings Widget (v2)", section_settings(64, 64, 48, 48), [("1787360000001_0", code_block(WIDGET_CODE))]),
    "1787360000002": sec("Founder Receipt (v2)", section_settings(64, 64, 48, 48), [("1787360000002_0", code_block(FOUNDER_CODE))]),
    "1787360000003": sec("Discounts by Category (v2)", section_settings(64, 64, 48, 48), [("1787360000003_0", code_block(CATS_CODE))]),
    "1787360000004": sec("How It Works (v2)", section_settings(64, 64, 48, 48), [("1787360000004_0", code_block(HOW_CODE))]),
    "1787360000005": sec("FAQ (v2)", section_settings(64, 64, 48, 48), [("1787360000005_0", code_block(FAQ_CODE))]),
    "1787360000006": sec("Pricing (v2)", section_settings(64, 64, 48, 48), [("1787360000006_0", code_block(PRICING_CODE))]),
}

OLD_HIDDEN = ["1770324356639", "1780328007575", "1780328034483", "1780328292757", "1780328322578", "1768426131462",
              "1770053101146", "1770314388672", "1770033836198", "1770033871764", "1770033930120"]
V2_TAIL = ["1787360000001", "1787360000002", "1787360000003", "1787360000004", "1787360000005", "1787360000006"]
NEW_2026_09_10 = ["1787360000008", "1787360000009", "1787360000010"]   # hero quiz, starter set, member wins (added later that day)

ORDER_WITH_QUIZ = [""] + ["1787360000000", "1787360000007"] + V2_TAIL + OLD_HIDDEN
ORDER_PRE_QUIZ = [""] + ["1787360000000"] + V2_TAIL + ["1787360000007"] + OLD_HIDDEN

def revert(order, quiz_visible):
    """Payload for update_theme_content(site 2148774616, theme 2164431783). Re-sends the old hero+quiz blocks
    verbatim (in case they were edited), unhides them, hides the 2026-09-10 sections, restores the render order."""
    s = {k: json.loads(json.dumps(v)) for k, v in SECTIONS.items() if k in ("1787360000000", "1787360000007")}
    s["1787360000007"]["hidden"] = "false" if quiz_visible else "true"
    for k in NEW_2026_09_10: s[k] = {"hidden": "true"}
    return {"sections": s, "content_for_index": order}

if __name__ == "__main__":
    json.dump({"taken": "2026-09-10T16:00:00Z", "site_id": "2148774616", "theme_id": "2164431783",
               "content_for_index_live": ORDER_WITH_QUIZ, "sections": SECTIONS},
              open(os.path.join(HERE, "live-sections.json"), "w"), ensure_ascii=False, indent=1)
    json.dump(revert(ORDER_PRE_QUIZ, False), open(os.path.join(HERE, "revert-pre-quiz.json"), "w"), ensure_ascii=False, indent=1)
    json.dump(revert(ORDER_WITH_QUIZ, True), open(os.path.join(HERE, "revert-quiz-under-hero.json"), "w"), ensure_ascii=False, indent=1)
    print("wrote live-sections.json, revert-pre-quiz.json, revert-quiz-under-hero.json; hero block bytes:", len(HERO_CODE))
