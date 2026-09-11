"""Copy of the can-offer-page skill's build_offer_page.py (2026-08-22 version, copied 2026-09-10) so offer_hero_v3.py can reuse css()/section()/IDS.
TOTAL/COUNT are overwritten from numbers.json by the caller. Do not run directly."""
import json, sys

CDN = "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/"
CAN_LOGO = CDN + "file-uploads/sites/2148774616/images/baa7c4-3037-ff-d830-0bf7f0f2b3_CreatorAccessNetwork_Logo_Primary.png"
AVI = CDN + "file-uploads/sites/2148774616/images/420d636-e84b-bcd6-d80-5b5f8ee50f_Avi_Gandhi_Headshot_2026_-_Edited.jpg"
PAT_D = "https://creatoraccessnetwork.github.io/can-widget/can-pattern-v4-desktop.svg"
PAT_M = "https://creatoraccessnetwork.github.io/can-widget/can-pattern-v4-mobile.svg"
WIDGET_JS = "https://creatoraccessnetwork.github.io/can-widget/cansw-v2.js"
CHECKOUT = "1744906803654"
TOTAL, COUNT, MEDIAN = "$34,000+", "48", "$400"

IDS = dict(hero="1787370000000", widget="1787370000001", founder="1787370000002", cats="1787370000003",
           how="1787370000004", faq="1787370000005", pricing="1787370000006", fq="1787370000007",
           quote="1787370000008", picks="1787370000009")

def css(white_ids, pattern_ids):
    W = ",".join("#section-%s" % i for i in white_ids)
    P = ",".join("#section-%s" % i for i in pattern_ids)
    ALL = ",".join("#section-%s" % i for i in white_ids + pattern_ids)
    rows = ",".join("#section-%s .container>.row" % i for i in white_ids + pattern_ids if i != CHECKOUT)
    cols = ",".join("#section-%s .col-12" % i for i in white_ids + pattern_ids if i != CHECKOUT)
    return """<style>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@700;900&family=Open+Sans:wght@400;600;700;800&display=swap');
%(ALL)s{--can-teal:#2A6478;--can-teal-dark:#1E4F5F;--can-rust-text:#9E614A;--can-ink:#1A1F2C;--can-charcoal:#374151;--can-mute:#5B6572;--can-white:#FFFFFF;--can-ground:#F0F4F8;--can-surface-2:#FAFBFD;--can-border:#E6EBF2;--can-hairline:#EFF3F7;--can-display:'Lato',system-ui,sans-serif;--can-body:'Open Sans',system-ui,sans-serif;--can-radius:4px;--can-shadow-card:0 3px 10px rgba(26,31,44,.10);font-family:var(--can-body);font-size:17px;line-height:26px;color:var(--can-charcoal);-webkit-font-smoothing:antialiased}
%(rows)s{padding:0!important;margin:0 auto!important;background:transparent!important;border:0!important;box-shadow:none!important}
%(cols)s{padding-left:0!important;padding-right:0!important}
%(W)s{background:#FFFFFF!important}
%(P)s{background-color:#F0F4F8!important;background-image:url('%(PAT_D)s')!important;background-size:970px 970px!important;background-repeat:repeat!important}
@media (max-width:768px){%(P)s{background-image:url('%(PAT_M)s')!important;background-size:413px 413px!important}}
#section-%(CO)s .cansw2,#section-%(CO)s .cansw{background:transparent}
.canv2{text-align:left;max-width:1160px;margin:0 auto}
.canv2 *{box-sizing:border-box}
.canv2 a{color:var(--can-teal);font-weight:700;text-decoration:none}
.canv2 a:hover{color:var(--can-teal-dark);text-decoration:underline}
.canv2 p{margin:0 0 16px;font-size:17px;line-height:26px;color:var(--can-charcoal)}
.canv2 h1,.canv2 h2,.canv2 h3{margin:0;color:var(--can-ink)}
.canv2 .can-card{background:#fff;border:1px solid var(--can-border);border-radius:var(--can-radius);box-shadow:var(--can-shadow-card)}
%(Wcards)s{box-shadow:none}
.canv2 .can-eyebrow{font-family:var(--can-body);font-size:15px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;line-height:18px;color:var(--can-rust-text);margin:0 0 16px}
.canv2 .can-h2{font-family:var(--can-display);font-weight:900;font-size:32px;line-height:1.12;letter-spacing:-.6px;color:var(--can-ink);margin:0 0 16px}
.canv2 .can-h3{font-family:var(--can-body);font-weight:700;font-size:17px;line-height:26px;color:var(--can-ink)}
.canv2 .meta{font-size:15px;line-height:22px;color:var(--can-mute)}
.canv2 .lead{color:var(--can-ink);font-weight:700}
.canv2 .strike{text-decoration:line-through;color:var(--can-mute);font-weight:600}
.canv2 .can-btn,.canv2 .can-btn:visited{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 24px;border:0;border-radius:var(--can-radius);cursor:pointer;font-family:var(--can-body);font-weight:700;font-size:17px;background:var(--can-rust-text);color:#fff;white-space:nowrap;transition:background 150ms ease;text-decoration:none}
.canv2 .can-btn:hover{background:#87503D;color:#fff;text-decoration:none}
.canv2 .can-btn--secondary{background:var(--can-teal)}.canv2 .can-btn--secondary:hover{background:var(--can-teal-dark)}
.canv2 .can-btn--lg{height:52px;padding:0 32px}.canv2 .can-btn--block{width:100%%}
.canv2 .checks{list-style:none;padding:0;margin:0}.canv2 .checks li{display:flex;gap:10px;align-items:flex-start;padding:6px 0}
.canv2 .chk{flex:none;width:18px;height:18px;border-radius:50%%;background:var(--can-teal);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;margin-top:1px}
.canv2 .fine{font-size:15px;line-height:22px;color:var(--can-mute);margin:8px 0 0}
/* hero */
.canv2.hero-in{max-width:1000px;margin:0 auto;text-align:center}
.canv2 .lockup{display:inline-flex;align-items:center;gap:20px;padding:12px;border:1px solid var(--can-border);border-radius:999px;background:var(--can-surface-2);margin:0 0 32px;max-width:100%%}
.canv2 .lockup img{width:96px;height:96px;border-radius:50%%;object-fit:contain;background:#fff;border:1px solid var(--can-border);padding:12px;flex:none}
.canv2 .lockup img.photo{object-fit:cover;padding:0}
.canv2 .lockup .x{font-family:var(--can-display);font-weight:900;color:var(--can-mute);font-size:28px;line-height:1}
.canv2 .lockup .lbl{font-size:13px;line-height:16px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--can-teal);text-align:left}
.canv2 .solo-logo{display:block;height:56px;width:auto;margin:0 auto 28px}
.canv2.hero .can-eyebrow{font-size:18px;line-height:24px;letter-spacing:1.6px;margin-bottom:28px}
.canv2 .hero-h1 .tl{color:var(--can-teal)}
.canv2 .hero-h1{font-family:var(--can-display);font-weight:900;font-size:44px;line-height:1.1;letter-spacing:-.8px;color:var(--can-ink);margin:0 0 36px;text-wrap:balance}
.canv2 .hero-lead{font-size:23px;line-height:34px;font-weight:600;color:var(--can-charcoal);margin:0 auto 32px;max-width:820px;text-wrap:balance}
.canv2 .hero-lead .lead,.canv2 .hero-sub .lead{color:var(--can-teal);font-variant-numeric:tabular-nums}
.canv2 .hero-sub{font-size:19px;line-height:28px;color:var(--can-charcoal);margin:0 auto 24px;max-width:820px}
.canv2 .hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:0 0 20px}
.canv2 .hero-meta{font-size:15px;line-height:22px;color:var(--can-mute);margin:0;text-align:center}
/* founder */
.canv2.two,.canv2 .two{display:grid;grid-template-columns:1.15fr .85fr;gap:48px;align-items:stretch}
.canv2 .two-right{display:flex;flex-direction:column;justify-content:space-between;gap:24px}
.canv2 .founder{display:flex;gap:16px;align-items:center;padding:20px 24px}
.canv2 .avatar{width:64px;height:64px;border-radius:50%%;border:1px solid var(--can-border);object-fit:cover;flex:none;max-width:64px}
.canv2 .role{font-size:12px;line-height:16px;letter-spacing:1px;text-transform:uppercase;font-weight:800;color:var(--can-rust-text);margin:2px 0 6px}
.canv2 .receipt-card{margin:0;padding:0}
.canv2 .rc-row{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 20px;border-bottom:1px solid var(--can-hairline);font-size:15px;line-height:22px;white-space:nowrap}.canv2 .rc-row:last-child{border-bottom:0}
.canv2 .rc-row .l{color:var(--can-charcoal);overflow:hidden;text-overflow:ellipsis}.canv2 .rc-row .r{font-weight:700;color:var(--can-teal);font-variant-numeric:tabular-nums}
.canv2 .rc-row.tot .l{font-weight:700;color:var(--can-ink)}.canv2 .rc-row.tot .r{font-family:var(--can-display);font-size:26px}
/* discount cards */
.canv2 .head-card{padding:26px;margin-bottom:24px;text-align:center}
.canv2 .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.canv2 .dcard{padding:26px;display:flex;flex-direction:column;gap:6px;min-height:170px}
.canv2 .dcard .top{display:flex;align-items:center;gap:12px;margin-bottom:4px}
.canv2 .dcard .plogo{width:44px;height:44px;border-radius:8px;object-fit:contain;background:#fff;border:1px solid var(--can-border);flex:none}
.canv2 .dcard .cat{font-size:13px;line-height:18px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;color:var(--can-teal)}
.canv2 .dcard .nm{font-weight:700;color:var(--can-ink);font-size:17px}
.canv2 .dcard .dl{font-size:15px;line-height:22px;color:var(--can-mute);flex:1}
.canv2 .dcard .vl{font-family:var(--can-display);font-weight:700;color:var(--can-teal);font-size:26px;line-height:26px;font-variant-numeric:tabular-nums;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.canv2 .dcard .vl.sm{font-size:20px;line-height:26px}
.canv2 .dcard .vl small{font-family:var(--can-body);font-weight:600;font-size:13px;letter-spacing:1.2px;text-transform:uppercase;color:var(--can-mute)}
/* quote */
.canv2 .quote{display:grid;grid-template-columns:200px 1fr;gap:40px;align-items:center;padding:36px 40px}
.canv2 .quote img{width:200px;height:200px;object-fit:contain;background:#fff;padding:20px;border-radius:25px;border:1px solid var(--can-border)}
.canv2 .quote img.photo{object-fit:cover;padding:0}
.canv2 .quote .q{font-family:var(--can-display);font-weight:700;font-size:26px;line-height:1.3;color:var(--can-ink);letter-spacing:-.3px}
.canv2 .quote .by{margin:14px 0 0;color:var(--can-mute);font-size:15px}
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
.canv2 .faq summary::after{content:"+";color:var(--can-teal);font-weight:800}.canv2 .faq details[open] summary::after{content:"\\2013"}
.canv2 .faq p{margin:10px 0 0;color:var(--can-charcoal)}
/* pricing */
.canv2 .price-card{max-width:520px;margin:0 auto;padding:32px;box-shadow:var(--can-shadow-card)!important}
.canv2 .price{font-family:var(--can-display);font-weight:700;color:var(--can-teal);font-size:48px;line-height:1.05;letter-spacing:-1px;font-variant-numeric:tabular-nums}
.canv2 .price small{font-family:var(--can-body);font-weight:600;font-size:17px;letter-spacing:0;color:var(--can-mute);margin-left:4px}
.canv2 .price .was{font-family:var(--can-body);font-weight:600;font-size:22px;letter-spacing:0;color:var(--can-mute);text-decoration:line-through;margin-right:8px}
.canv2 .lock{background:var(--can-surface-2);border:1px solid var(--can-border);border-radius:var(--can-radius);padding:12px 14px;font-size:15px;line-height:22px;color:var(--can-charcoal);margin:16px 0}
/* founder question */
.canv2 .fq{max-width:620px;margin:0 auto;padding:32px;text-align:center}
.canv2 .fq input,.canv2 .fq textarea{display:block;width:100%%;border:1px solid var(--can-border);border-radius:4px;padding:12px 14px;font:inherit;font-size:16px;color:var(--can-ink);background:#fff;margin:0 0 8px;text-align:left}
.canv2 .fq textarea{resize:vertical;margin-bottom:10px}
.canv2 .fq button{display:block;width:100%%;height:48px;background:var(--can-teal);color:#fff;font:inherit;font-weight:700;font-size:17px;border:0;border-radius:4px;cursor:pointer}
.canv2 .fq button:hover{background:var(--can-teal-dark)}
.canv2 .fq .note{display:none;font-size:14px;font-weight:600;margin:8px 0 0;color:var(--can-teal)}
/* mobile sticky */
.canv2-sticky{display:none}
@media (max-width:900px){
  .canv2.two,.canv2 .grid3,.canv2 .steps{grid-template-columns:1fr;gap:32px}
  .canv2 .quote{grid-template-columns:1fr;text-align:center;padding:28px 24px}.canv2 .quote img{margin:0 auto}
  .canv2 .can-h2{font-size:26px}
  .canv2.hero .can-eyebrow{font-size:15px;line-height:20px}
  .canv2 .hero-h1{font-size:34px}.canv2 .hero-lead{font-size:19px;line-height:28px}.canv2 .hero-sub{font-size:17px;line-height:26px}
  .canv2 .lockup{gap:14px;padding:10px}.canv2 .lockup img{width:72px;height:72px;padding:9px}.canv2 .lockup img.photo{object-fit:cover;padding:0}
.canv2 .lockup .x{font-size:22px}
  .canv2-sticky{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:40;background:#fff;border-top:1px solid #E6EBF2;padding:10px 16px;gap:8px;align-items:center;justify-content:space-between;font-family:'Open Sans',system-ui,sans-serif}
  .canv2-sticky .s-price{font-family:'Lato',system-ui,sans-serif;font-weight:700;color:#2A6478;white-space:nowrap}
  .canv2-sticky .can-btn{height:40px;padding:0 16px;display:inline-flex;align-items:center;border-radius:4px;background:#9E614A;color:#fff!important;font-weight:700;text-decoration:none!important}
  body{padding-bottom:68px}
}
</style>
""" % dict(ALL=ALL, rows=rows, cols=cols, W=W, P=P, PAT_D=PAT_D, PAT_M=PAT_M, CO=IDS["widget"],
           Wcards=",".join("#section-%s .canv2 .can-card" % i for i in white_ids))

def section(name, blocks, top=64, bottom=64, mtop=48, mbottom=48):
    bl = {}
    order = []
    for i, (bid, code) in enumerate(blocks):
        bl[bid] = {"type": "code", "name": "Code", "hidden": "false", "deletable": True, "duplicatable": True, "hideable": True,
                   "settings": {"width": "12", "code": code, "make_block": False, "make_flush": True, "text_align": "left",
                                "padding_desktop": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                                "padding_mobile": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                                "margin_desktop": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                                "margin_mobile": {"top": "0", "right": "0", "bottom": "0", "left": "0"},
                                "animation_type": "none", "animation_direction": "none", "delay": "0", "duration": "0", "reveal_units": "seconds"}}
        order.append(bid)
    return {"type": "section", "name": name, "hidden": "false", "hideable": True, "saveable": True, "blocks": bl, "block_order": order,
            "settings": {"bg_type": "none", "bg_image": "", "bg_video": "", "bg_position": "center", "background_fixed": False, "background_color": "",
                         "full_width": False, "full_height": False, "equal_height": False, "vertical": "center", "horizontal": "center",
                         "hide_on_desktop": False, "hide_on_mobile": False,
                         "padding_desktop": {"top": str(top), "right": "24", "bottom": str(bottom), "left": "24"},
                         "padding_mobile": {"top": str(mtop), "right": "16", "bottom": str(mbottom), "left": "16"},
                         "reveal_event": "", "reveal_offset": "", "reveal_units": "seconds"}}

def hero_html(cfg, style):
    if cfg.get("partner_logo"):
        lock = ('<div class="lockup"><img src="%s" alt="Creator Access Network"><span class="x">&times;</span><img class="%s" src="%s" alt="%s"></div>'
                % (CAN_LOGO, "photo" if cfg.get("partner_logo_is_photo") else "", cfg["partner_logo"], cfg["partner"]))
    else:
        lock = ""
    return style + """<div class="canv2 hero-in hero" id="top">
  %s
  <p class="can-eyebrow">Starting a Creator business is expensive.</p>
  <h1 class="hero-h1">Our members <span class="tl">save money</span> while they build to <span class="tl">make money</span>.</h1>
  <p class="hero-lead">Access <span class="lead">%s</span> in pre-negotiated discounts on the software and services successful Creators use. Median discount: <span class="lead">%s</span>.</p>
  <p class="hero-sub">%s</p>
  <div class="hero-cta"><a class="can-btn can-btn--lg" href="#section-%s">%s</a></div>
  <p class="hero-meta">%s</p>
</div>
<div class="canv2-sticky"><span class="s-price">%s</span><a class="can-btn" href="#section-%s">%s</a></div>""" % (
        lock, TOTAL, MEDIAN, cfg["hero_sub"], CHECKOUT, cfg["join_text"], cfg["hero_meta"], cfg["sticky_price"], CHECKOUT, cfg["sticky_btn"])

def widget_html(cfg):
    o = {"joinUrl": "#section-" + CHECKOUT, "starterUrl": "https://www.creatoraccessnetwork.com/#top", "membershipCost": cfg["cost"],
         "numbers": {"partner_count": int(COUNT), "total_value": TOTAL}, "joinText": cfg["join_text"], "joinAlt": cfg["join_alt"]}
    if cfg.get("pin"): o["pin"] = cfg["pin"]
    if cfg.get("demote"): o["demote"] = cfg["demote"]
    return ('<div class="canv2" id="widget"><div id="cansw-mount"></div></div>\n<script>window.CANSW_OVERRIDES = %s;</script>\n<script src="%s"></script>'
            % (json.dumps(o), WIDGET_JS))

FOUNDER = """<div class="canv2 two" id="founder">
  <div>
    <p class="can-eyebrow">Why CAN exists</p>
    <h2 class="can-h2">Avi spent $12,000+ finding a stack that worked. CAN would have saved him $3,100.</h2>
    <p>15 years serving Creators as an agent, producer, and platform exec... then he got laid off and became one. After three failed communities, two fired accountants, and too many attempts at selling courses, products, and software, he had spent $12,000+ on experiments before finding the stack that worked.</p>
    <p>CAN shrinks that bill. Most partners give members the best rate they offer anywhere (look for the 🏆) and at just %(price)s, it pays for itself fast.</p>
    <p style="margin:8px 0 0"><a class="can-btn can-btn--secondary" href="mailto:avi@creatoraccessnetwork.com">Reach out to Avi</a></p>
  </div>
  <div class="two-right">
    <div class="can-card founder">
      <img class="avatar" src="%(avi)s" alt="Avi Gandhi">
      <div><div class="can-h3">Avi Gandhi</div><div class="role">Founder, Creator Access Network</div><div class="meta" style="margin-top:4px">17 years in the Creator Economy. Former WME agent and Head of Creator Partnerships at Patreon.</div></div>
    </div>
    <div class="can-card receipt-card">
      <div class="rc-row"><span class="l">Spent on experiments that didn't work</span><span class="r">$12,000+</span></div>
      <div class="rc-row"><span class="l">What CAN discounts would have saved</span><span class="r">$3,100+</span></div>
      <div class="rc-row"><span class="l">CAN membership</span><span class="r">%(pricenum)s</span></div>
      <div class="rc-row tot"><span class="l">Net, first year</span><span class="r">%(net)s</span></div>
    </div>
  </div>
</div>"""

CATS = """<div class="canv2" id="discounts">
  <div class="can-card head-card">
    <p class="can-eyebrow" style="margin-bottom:8px">What's inside</p>
    <h2 class="can-h2" style="margin:0">Discounts for every part of the business.</h2>
    <p class="meta" style="margin:8px 0 0">Six of 48. The figure on each card is what a member saves. "Up to" depends on the plan you pick.</p>
  </div>
  <div class="grid3">
    <div class="can-card dcard"><div class="cat">Courses &amp; Community</div><div class="nm">Kajabi 🏆</div><div class="dl">Member-only discount. Course, coaching, and membership platform where Creators have earned over $10 billion.</div><div class="vl">$358 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Newsletter</div><div class="nm">beehiiv 🏆</div><div class="dl">25% off paid plans for 1 year. Built by former Morning Brew employees.</div><div class="vl">up to $1,212 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Link in Bio</div><div class="nm">Pop.store 🏆</div><div class="dl">30% off annual plans for your first year. Monetization with digital products, community chat, and an AI fan assistant.</div><div class="vl">up to $717 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Banking</div><div class="nm">Mercury 🏆</div><div class="dl">Up to $400 in cash bonuses, terms apply. Business banking used by thousands of small businesses.</div><div class="vl">up to $400 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Productivity</div><div class="nm">Wispr Flow</div><div class="dl">6 months of Pro free. AI dictation that types what you say in any app.</div><div class="vl">up to $90 <small>you save</small></div></div>
    <div class="can-card dcard"><div class="cat">Domains</div><div class="nm">.store 🏆</div><div class="dl">5 years of your .store domain free. Separate your commerce from your content.</div><div class="vl">$200 <small>you save</small></div></div>
  </div>
  <div style="text-align:center;margin-top:24px"><a class="can-btn can-btn--secondary" href="#widget">Browse all 48 partners</a></div>
</div>"""

HOW = """<div class="canv2" id="how">
  <div class="center"><p class="can-eyebrow">How it works</p><h2 class="can-h2">Three steps to a more profitable business.</h2></div>
  <div class="steps">
    <div><div class="stepn">1</div><div class="can-h3">Join for %(price)s</div><p>Your rate locks for life when you join.</p></div>
    <div><div class="stepn">2</div><div class="can-h3">Browse by category</div><p>Search by what you're about to buy. 🏆 means the best rate that partner offers anywhere.</p></div>
    <div><div class="stepn">3</div><div class="can-h3">Redeem as you build</div><p>One discount pays for the membership. New discounts land at least monthly.</p></div>
  </div>
  <p class="oneline">Membership also includes an expert content library and a community of Creators building alongside you.</p>
</div>"""

FAQ = """<div class="canv2" id="faq" style="max-width:820px">
  <div class="can-card head-card">
    <p class="can-eyebrow" style="margin-bottom:8px">FAQ</p>
    <h2 class="can-h2" style="margin:0">Questions Creators ask before joining.</h2>
    <p class="meta" style="margin:8px 0 0">Short and sweet. Anything else, <a href="mailto:avi@creatoraccessnetwork.com">email our founder</a>.</p>
  </div>
  <div class="can-card faq">
    <details><summary>Is this a coupon site?</summary><p>No. The rates aren't public. They're pre-negotiated for members, and partners give their best rate anywhere. Access like this used to take years of relationships.</p></details>
    <details><summary>Do I have to use every discount?</summary><p>No. Each one is worth more than %(price)s, so the first one you use covers the year.</p></details>
    <details><summary>What if the price goes up?</summary><p>Your rate is locked in for life, even when the price goes up.</p></details>
    <details><summary>Does CAN discount tools I'm using right now?</summary><p>No. Vendors don't discount their existing customers. The savings are for your next tool decision, as you build your stack.</p></details>
    <details><summary>Is CAN an agency?</summary><p>No. CAN doesn't represent you or take a cut of your income. It's a membership that gets you better rates on what you're buying anyway.</p></details>
  </div>
</div>"""

PRICING = """<div class="canv2" id="pricing">
  <div class="center"><p class="can-eyebrow">Membership</p><h2 class="can-h2">%(headline)s</h2><p>It pays for itself.</p></div>
  <div class="can-card price-card">
    <div class="can-h3">%(title)s</div>
    <div class="price" style="margin:8px 0 16px">%(pricebig)s</div>
    <ul class="checks">
      <li><span class="chk">✓</span><span><span class="lead">%(total)s</span> in savings across %(count)s partners</span></li>
      <li><span class="chk">✓</span><span>Higher affiliate payouts on <span class="lead">20,000+ brands</span> through ShopYourLikes</span></li>
      <li><span class="chk">✓</span><span><span class="lead">Curated library</span> of educational resources</span></li>
      <li><span class="chk">✓</span><span><span class="lead">Community</span> of Creators building alongside you</span></li>
      <li><span class="chk">✓</span><span><span class="lead">New discounts</span> added at least monthly</span></li>
    </ul>
    <div class="lock"><span class="lead">Locked in for life:</span> %(lock)s</div>
    <a class="can-btn can-btn--lg can-btn--block" href="%(btn_href)s">%(join_text)s</a>
    <p class="fine" style="text-align:center">Not ready? <a href="https://www.creatoraccessnetwork.com/#top">Unlock the Starter Set free</a>.</p>
  </div>
</div>"""

FQ = """<div class="canv2"><div class="can-card fq" id="ask">
  <p class="can-eyebrow">Not sure yet?</p>
  <h2 class="can-h2">CAN pays for itself in a single discount.</h2>
  <p>We're powering the New American Dream by making it easier to build a small business and make a living through content. Got questions? Ask Avi directly.</p>
  <input id="canqEmail" type="email" placeholder="Your email">
  <textarea id="canqMsg" rows="3" placeholder="Your question for Avi"></textarea>
  <button id="canqSend" type="button">Send to our founder</button>
  <p id="canqNote" class="note"></p>
</div></div>
<script>
(function(){
  var btn=document.getElementById("canqSend"),em=document.getElementById("canqEmail"),msg=document.getElementById("canqMsg"),note=document.getElementById("canqNote");
  if(!btn)return;
  btn.addEventListener("click",function(){
    var e=(em.value||"").trim(),m=(msg.value||"").trim();
    if(!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(e)){note.style.display="block";note.style.color="#9E614A";note.textContent="Please enter a valid email.";return;}
    if(!m){note.style.display="block";note.style.color="#9E614A";note.textContent="Please write a question.";return;}
    btn.disabled=true;btn.textContent="Sending...";
    var body="form_submission%5Bname%5D="+encodeURIComponent("Founder Question")+"&form_submission%5Bemail%5D="+encodeURIComponent(e)+"&form_submission%5Bcustom_10%5D="+encodeURIComponent(m)+"&form_submission%5Bcustom_11%5D="+encodeURIComponent(location.href);
    fetch("https://www.creatoraccessnetwork.com/forms/2149654819/form_submissions",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:body,credentials:"omit"}).then(function(){
      note.style.display="block";note.style.color="#2A6478";note.textContent="Sent. Avi will reply to your email directly.";btn.textContent="Sent \\u2713";
      em.value="";msg.value="";
    }).catch(function(){
      btn.disabled=false;btn.textContent="Send to our founder";
      note.style.display="block";note.style.color="#9E614A";note.textContent="Something went wrong - email avi@creatoraccessnetwork.com instead.";
    });
  });
})();
</script>"""

def quote_html(cfg):
    cls = "photo" if cfg.get("quote_is_photo") else ""
    return """<div class="canv2"><div class="can-card quote">
  <img class="%s" src="%s" alt="%s">
  <div><p class="can-eyebrow" style="margin-bottom:12px">From %s</p><div class="q">%s</div><p class="by">%s</p></div>
</div></div>""" % (cls, cfg["quote_img"], cfg["partner"], cfg["partner"], cfg["quote"], cfg["quote_by"])

def picks_html(cfg):
    cards = "".join("""
    <div class="can-card dcard"><div class="top"><img class="plogo" src="%s" alt="%s logo"><div class="cat">%s</div></div><div class="nm">%s</div><div class="dl">%s</div><div class="vl sm">%s</div></div>""" % tuple(c) for c in cfg["picks"])
    return """<div class="canv2" id="picks">
  <div class="can-card head-card">
    <p class="can-eyebrow" style="margin-bottom:8px">%s's top picks for you</p>
    <h2 class="can-h2" style="margin:0">%s</h2>
    <p class="meta" style="margin:8px 0 0">🏆 = Exclusive to CAN or the best discount this partner offers</p>
  </div>
  <div class="grid3">%s
  </div>
  <div style="text-align:center;margin-top:24px"><a class="can-btn can-btn--lg" href="#section-%s">%s</a></div>
</div>""" % (cfg["partner"], cfg["picks_sub"], cards, CHECKOUT, cfg["join_text"])

def checkout_text(cfg):
    return ('<h2><strong>%s</strong></h2>\n<p><strong><span style="color: #2a6478;">%s</span></strong></p>\n<p>%s</p>\n'
            '<p>Plus %s in total savings from %s top Creator companies.</p>\n<p>Featuring partners like %s, and more.</p>\n'
            '<h6><em><span>%s</span></em></h6>'
            % (cfg["co_title"], cfg["co_line"], "<br />".join("✔ " + b for b in cfg["co_bullets"]), TOTAL, COUNT, cfg["co_partners"],
               cfg.get("disclaimer", "By completing your purchase, you will be charged today for your Creator Access Network membership. "
                       "Your membership will automatically renew according to your selected billing interval unless cancelled before renewal.")))

def build(cfg):
    kind = cfg["kind"]
    if kind == "regular":
        order = [IDS["hero"], IDS["widget"], CHECKOUT, IDS["cats"], IDS["founder"], IDS["faq"], IDS["how"], IDS["fq"], IDS["pricing"]]
        white = [IDS["hero"], CHECKOUT, IDS["founder"], IDS["how"], IDS["pricing"]]
        pattern = [IDS["widget"], IDS["cats"], IDS["faq"], IDS["fq"]]
    else:
        order = [IDS["hero"], IDS["widget"], CHECKOUT, IDS["quote"], IDS["picks"], IDS["fq"]]
        white = [IDS["hero"], CHECKOUT, IDS["picks"]]
        pattern = [IDS["widget"], IDS["quote"], IDS["fq"]]
    style = css(white, pattern)
    secs = {}
    secs[IDS["hero"]] = section("Hero (v2)", [(IDS["hero"] + "_0", hero_html(cfg, style))], top=72, bottom=64, mtop=56, mbottom=40)
    secs[IDS["widget"]] = section("Savings Widget (v2)", [(IDS["widget"] + "_0", widget_html(cfg))])
    secs[IDS["fq"]] = section("Founder Question (v2)", [(IDS["fq"] + "_0", FQ)])
    if kind == "regular":
        secs[IDS["founder"]] = section("Founder Receipt (v2)", [(IDS["founder"] + "_0", FOUNDER % dict(price=cfg["price_year"], avi=AVI, pricenum=cfg["price_num"], net=cfg["net"]))])
        secs[IDS["cats"]] = section("Discounts by Category (v2)", [(IDS["cats"] + "_0", CATS)])
        secs[IDS["how"]] = section("How It Works (v2)", [(IDS["how"] + "_0", HOW % dict(price=cfg["price_year"]))])
        secs[IDS["faq"]] = section("FAQ (v2)", [(IDS["faq"] + "_0", FAQ % dict(price=cfg["price_num"]))])
        secs[IDS["pricing"]] = section("Pricing + Checkout (v2)", [(IDS["pricing"] + "_0", PRICING % dict(
            headline=cfg["pricing_headline"], title=cfg["offer_title"], pricebig=cfg["price_big"], total=TOTAL, count=COUNT,
            lock=cfg["lock"], btn_href="#popup_checkout_" + cfg["token"], join_text=cfg["join_text"]))])
    else:
        secs[IDS["quote"]] = section("Partner Quote (v2)", [(IDS["quote"] + "_0", quote_html(cfg))])
        secs[IDS["picks"]] = section("Top Picks (v2)", [(IDS["picks"] + "_0", picks_html(cfg))])
    # checkout: partial update of existing section
    secs[CHECKOUT] = {"settings": {"background_color": "#FFFFFF", "checkout_block_btn_color": "#9E614A", "checkout_block_box_shadow": "medium",
                                   "checkout_block_border_type": "none", "checkout_block_border_radius": "4", "checkout_block_btn_border_radius": "4",
                                   "checkout_block_column_width": "5", "checkout_block_standalone_width": "8",
                                   "show_checkout_block_first_on_mobile": True, "show_checkout_block_right_on_desktop": True},
                      "blocks": {cfg["co_block"]: {"hidden": "false", "settings": {"text": checkout_text(cfg), "width": "7", "background_color": "#FFFFFF", "box_shadow": "medium",
                                                   "border_radius": "4", "padding_desktop": {"top": "24", "right": "32", "bottom": "24", "left": "32"},
                                                   "padding_mobile": {"top": "20", "right": "16", "bottom": "20", "left": "16"}}}}}
    if cfg.get("co_hide_image"):
        secs[CHECKOUT]["blocks"][cfg["co_hide_image"]] = {"hidden": "true"}
    theme_css = ("@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Open+Sans:wght@400;600;700;800&display=swap');\n"
                 "/* CAN v2 offer page. Body carries the pattern; checkout section is solid white (ruling 14 Aug 2026). */\n"
                 "body{background:#F0F4F8 url('%s') repeat;background-size:970px 970px}\n"
                 "#section-%s{background:#FFFFFF !important;background-image:none !important}\n"
                 "@media (max-width:768px){body{background-image:url('%s');background-size:413px 413px}}" % (PAT_D, CHECKOUT, PAT_M))
    return {"sections": secs, "content_for_index": order, "css": theme_css}

if __name__ == "__main__":
    cfg = json.load(open(sys.argv[1]))
    out = build(cfg)
    json.dump(out, open(sys.argv[2], "w"))
    print("sections:", list(out["sections"]), "bytes:", len(json.dumps(out)))
