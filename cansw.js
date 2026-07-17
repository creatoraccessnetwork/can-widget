/* CAN savings widget - single-source bundle.
   Served via GitHub Pages; every CAN page loads this one file.
   Page-specific config via window.CANSW_OVERRIDES BEFORE the script tag:
   { defaultCategory, joinUrl, dealsUrl, rotateMs, headline, lede, unlinkCtas,
     cobrand: { mode: "photo"|"text"|"logo", image, name, title, headline, lede } }
   Partner data: cansw-data.json next to this file (baked fallback below).
   Built from can-savings-widget-horizontal.html - keep that file canonical
   for markup/CSS changes and rebuild via tools/build.py in the private repo. */
(function () {
  if (window.__canswLoaded) return; window.__canswLoaded = true;
  var SCRIPT = document.currentScript;
  var CSS = "\n  .cansw {\n    --cansw-teal: #2A6478;\n    --cansw-teal-dark: #1E4F5F;\n    --cansw-terra: #C17A5E;\n    --cansw-terra-dark: #9E614A;\n    --cansw-ink: #1A1F2C;\n    --cansw-charcoal: #374151;\n    --cansw-ground: #F0F4F8;\n    --cansw-card: #FFFFFF;\n    font-family: 'Open Sans', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;\n    background: var(--cansw-ground);\n    color: var(--cansw-charcoal);\n    padding: 56px 24px;\n    text-align: left;\n    box-sizing: border-box;\n  }\n  .cansw *, .cansw *::before, .cansw *::after { box-sizing: border-box; }\n\n  .cansw-cols {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);\n    gap: 48px;\n    max-width: 1080px;\n    margin: 0 auto;\n    align-items: center;\n  }\n\n  .cansw-title {\n    font-size: 44px; font-weight: 700; line-height: 1.12;\n    color: var(--cansw-ink); margin: 0 0 20px;\n  }\n  .cansw-lede {\n    font-size: 20px; line-height: 1.5;\n    margin: 0 0 32px; color: var(--cansw-charcoal);\n  }\n\n  .cansw-picker { position: relative; width: 100%; max-width: 420px; text-align: left; }\n  .cansw-picker-btn {\n    width: 100%;\n    display: flex; align-items: center; justify-content: space-between; gap: 16px;\n    background: var(--cansw-card);\n    border: 1px solid #D7DFE8;\n    border-radius: 4px;\n    padding: 14px 16px;\n    font-family: inherit; font-size: 16px; color: var(--cansw-charcoal);\n    cursor: pointer;\n    box-shadow: 0 1px 3px rgba(0,0,0,0.04);\n  }\n  .cansw-picker-btn:hover { border-color: var(--cansw-teal); }\n  .cansw-picker-btn:focus-visible, .cansw-opt:focus-visible, .cansw-cta:focus-visible,\n  .cansw input[type=range]:focus-visible { outline: 2px solid var(--cansw-teal); outline-offset: 2px; }\n  .cansw-placeholder { color: #8A94A3; }\n  .cansw-caret { flex: none; transition: transform 0.15s ease; color: var(--cansw-teal); }\n  .cansw-picker.cansw-open .cansw-caret { transform: rotate(180deg); }\n\n  .cansw-menu {\n    position: absolute; z-index: 50; top: calc(100% + 8px); left: 0; right: 0;\n    background: var(--cansw-card);\n    border: 1px solid #E5EAF0; border-radius: 4px;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.08);\n    max-height: 320px; overflow-y: auto;\n    padding: 8px;\n    display: none;\n  }\n  .cansw-picker.cansw-open .cansw-menu { display: block; }\n  .cansw-menu-label {\n    font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;\n    color: var(--cansw-teal); padding: 8px 8px 4px;\n  }\n  .cansw-opt {\n    width: 100%;\n    display: flex; justify-content: space-between; align-items: center; gap: 16px;\n    padding: 10px 8px;\n    border: 0; background: none; border-radius: 4px;\n    font-family: inherit; font-size: 15px; color: var(--cansw-charcoal);\n    cursor: pointer; text-align: left;\n  }\n  .cansw-opt:hover { background: var(--cansw-ground); }\n  .cansw-opt[aria-selected=\"true\"] { background: var(--cansw-ground); color: var(--cansw-ink); font-weight: 600; }\n  .cansw-count { font-size: 13px; color: #8A94A3; flex: none; }\n\n  .cansw-result {\n    width: 100%;\n    background: var(--cansw-card);\n    border-radius: 4px;\n    box-shadow: 0 1px 3px rgba(0,0,0,0.04);\n    padding: 32px 36px;\n    text-align: center;\n    height: 580px;\n    display: flex; flex-direction: column; justify-content: center;\n    overflow: hidden;\n  }\n  #canswContent { width: 100%; }\n  .cansw-result.cansw-show { animation: cansw-rise 0.25s ease; }\n  @keyframes cansw-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }\n  @media (prefers-reduced-motion: reduce) {\n    .cansw-result.cansw-show { animation: none; }\n    .cansw-caret { transition: none; }\n  }\n\n  .cansw-kicker {\n    font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;\n    color: var(--cansw-teal); margin: 0 0 8px;\n  }\n  .cansw-savings {\n    font-size: 44px; font-weight: 700; line-height: 1.1;\n    color: var(--cansw-teal);\n    font-variant-numeric: tabular-nums;\n    margin: 0 0 4px;\n  }\n  .cansw-savings-sub { font-size: 16px; color: var(--cansw-charcoal); margin: 0 0 8px; }\n  .cansw-earn-note { font-size: 15px; color: var(--cansw-charcoal); margin: 0 0 24px; }\n  .cansw-earn-note strong { color: var(--cansw-teal); }\n\n  .cansw-partners {\n    display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;\n    margin: 16px 0 20px;\n  }\n  .cansw-pill {\n    display: inline-flex; align-items: center; gap: 8px;\n    background: var(--cansw-ground);\n    border-radius: 4px;\n    padding: 6px 12px 6px 6px;\n    font-size: 14px; font-weight: 500; color: var(--cansw-ink);\n  }\n  .cansw-mono {\n    width: 24px; height: 24px; border-radius: 4px; flex: none;\n    background: rgba(42,100,120,0.12); color: var(--cansw-teal);\n    font-size: 12px; font-weight: 700;\n    display: grid; place-items: center;\n  }\n  .cansw-logo {\n    width: 24px; height: 24px; border-radius: 4px; flex: none;\n    object-fit: contain; background: #fff;\n  }\n  .cansw-more {\n    display: inline-flex; align-items: center;\n    background: var(--cansw-ground);\n    border-radius: 4px;\n    padding: 6px 12px;\n    font-size: 14px; font-weight: 600; color: #8A94A3;\n  }\n  .cansw-trophy { font-size: 13px; }\n  .cansw-trophy-note {\n    font-size: 13px; color: #8A94A3; margin: -8px 0 12px;\n  }\n  .cansw-locked {\n    display: flex; align-items: center; justify-content: center; gap: 8px;\n    font-size: 14px; color: #8A94A3; margin: 0 0 28px;\n  }\n\n  .cansw-earn {\n    background: var(--cansw-ground);\n    border-radius: 4px;\n    padding: 16px 20px;\n    margin: 0 0 16px;\n    text-align: left;\n  }\n  .cansw-earn-label { font-size: 14px; font-weight: 600; color: var(--cansw-ink); display: flex; justify-content: space-between; margin-bottom: 12px; }\n  .cansw-earn-label output { color: var(--cansw-teal); font-variant-numeric: tabular-nums; }\n  .cansw input[type=range] { width: 100%; margin: 0 0 16px; accent-color: var(--cansw-teal); }\n  .cansw-earn-result { font-size: 15px; color: var(--cansw-charcoal); margin: 0; line-height: 1.6; }\n  .cansw-earn-result strong {\n    font-size: 22px; font-weight: 700;\n    color: var(--cansw-teal); font-variant-numeric: tabular-nums;\n  }\n  .cansw-earn-fine { font-size: 12px; color: #8A94A3; margin: 8px 0 0; }\n\n  .cansw-cta {\n    display: inline-block;\n    background: var(--cansw-terra); color: #fff;\n    font-family: inherit; font-weight: 600; font-size: 16px;\n    padding: 16px 32px; border: 0; border-radius: 4px; cursor: pointer;\n    text-decoration: none;\n  }\n  .cansw-cta:hover { background: var(--cansw-terra-dark); color: #fff; }\n  .cansw-payoff { font-size: 14px; color: var(--cansw-charcoal); margin: 16px 0 0; }\n  .cansw-see-all { display: inline-block; margin-top: 12px; font-size: 14px; color: var(--cansw-teal); text-decoration: underline; text-underline-offset: 3px; }\n  .cansw-see-all:hover { color: var(--cansw-teal-dark); }\n\n  @media (max-width: 900px) {\n    .cansw { padding: 48px 16px; }\n    .cansw-cols { grid-template-columns: 1fr; gap: 32px; }\n    .cansw-left { text-align: center; }\n    .cansw-picker { margin: 0 auto; }\n    .cansw-title { font-size: 30px; }\n    .cansw-lede { font-size: 17px; }\n    .cansw-savings { font-size: 34px; }\n    .cansw-result { padding: 32px 20px 24px; height: auto; }\n  }\n\n  .cansw .cansw-cta, .cansw .cansw-cta:visited, .cansw .cansw-cta:hover { color: #fff !important; }\n  .cansw [hidden] { display: none !important; }\n  .cansw-cobrand{display:flex;align-items:center;gap:14px;margin:0 0 22px}\n  .cansw-cobrand-img{width:56px;height:56px;border-radius:16px;object-fit:cover;box-shadow:0 2px 6px rgba(0,0,0,.10);flex:none}\n  .cansw-cobrand-logo{height:44px;width:auto;max-width:170px;object-fit:contain;background:#fff;border-radius:8px;padding:6px 12px;box-shadow:0 1px 3px rgba(0,0,0,.06);flex:none}\n  .cansw-cobrand-name{font-size:16px;font-weight:700;color:var(--cansw-ink);margin:0;line-height:1.3}\n  .cansw-cobrand-title{font-size:13px;color:#8A94A3;margin:0;line-height:1.4}\n  .cansw-cobrand-with{font-size:12px;font-weight:600;color:var(--cansw-teal);letter-spacing:.5px;text-transform:uppercase;margin:0 0 2px}\n  .cansw-cobrand-x{font-size:15px;font-weight:700;color:var(--cansw-teal)}\n  .cansw-cobrand-canword{font-size:14px;font-weight:700;color:var(--cansw-teal);letter-spacing:.5px;text-transform:uppercase;line-height:1.2}\n  @media(max-width:900px){.cansw-cobrand{justify-content:center}}\n";
  var HTML = "<div class=\"cansw-cols\">\n  <div class=\"cansw-left\">\n    <h1 class=\"cansw-title\">Spend less on your Creator projects.</h1>\n    <p class=\"cansw-lede\">The best deals anywhere on <span id=\"canswNPartners\">35+</span> top Creator tools and services. Most Members cover the cost of membership with a single deal.</p>\n\n    <div class=\"cansw-picker\" id=\"canswPicker\">\n      <button class=\"cansw-picker-btn\" id=\"canswBtn\" aria-haspopup=\"listbox\" aria-expanded=\"false\">\n        <span class=\"cansw-placeholder\" id=\"canswLabel\">What are you working on?</span>\n        <svg class=\"cansw-caret\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" aria-hidden=\"true\">\n          <path d=\"M4 6l4 4 4-4\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n        </svg>\n      </button>\n      <div class=\"cansw-menu\" role=\"listbox\" id=\"canswMenu\">\n        <div class=\"cansw-menu-label\">Choose a category</div>\n      </div>\n    </div>\n\n  </div>\n\n  <div class=\"cansw-right\">\n    <div class=\"cansw-result\" id=\"canswResult\" aria-live=\"polite\">\n      <div id=\"canswContent\">\n        <p class=\"cansw-kicker\" id=\"canswKicker\"></p>\n        <p class=\"cansw-savings\" id=\"canswNum\"></p>\n        <p class=\"cansw-savings-sub\" id=\"canswSub\"></p>\n        <p class=\"cansw-earn-note\" id=\"canswEarnNote\" hidden></p>\n\n        <div class=\"cansw-partners\" id=\"canswPills\"></div>\n\n        <p class=\"cansw-trophy-note\" id=\"canswTrophyNote\" hidden>&#127942; = Exclusive to CAN or the best deal this partner offers</p>\n\n        <p class=\"cansw-locked\">\n          <svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\" aria-hidden=\"true\">\n            <rect x=\"2.5\" y=\"6\" width=\"9\" height=\"6\" rx=\"1\" stroke=\"#8A94A3\" stroke-width=\"1.5\"/>\n            <path d=\"M4.5 6V4.5a2.5 2.5 0 015 0V6\" stroke=\"#8A94A3\" stroke-width=\"1.5\"/>\n          </svg>\n          Exact deal terms are revealed inside the membership\n        </p>\n\n        <div class=\"cansw-earn\" id=\"canswEarnBlock\" hidden>\n          <div class=\"cansw-earn-label\">\n            <span>Your monthly affiliate earnings today</span>\n            <output id=\"canswEarnIn\">$1,000</output>\n          </div>\n          <input type=\"range\" id=\"canswEarnSlider\" min=\"0\" max=\"10000\" step=\"100\" value=\"1000\" aria-label=\"Your monthly affiliate earnings in dollars\">\n          <p class=\"cansw-earn-result\" id=\"canswEarnOut\"></p>\n          <p class=\"cansw-earn-fine\">Members earn 10% more on the same sales through our partner's improved revenue split.</p>\n        </div>\n\n        <a class=\"cansw-cta\" id=\"canswCta\" href=\"#\">Unlock Access</a>\n        <p class=\"cansw-payoff\">CAN pays for itself the first time you use it.</p>\n        <a class=\"cansw-see-all\" id=\"canswSeeAll\" href=\"#\">See every partner deal</a>\n      </div>\n    </div>\n  </div>\n</div>";
  var FALLBACK = {"generated": "2026-07-17", "partners": [{"n": "Fourthwall", "v": [50, 50], "t": true, "c": ["Merchandise", "Digital Products", "Memberships & Community", "Website & Bio Link", "Monetization"]}, {"n": "Creator Wizard", "v": [106, 106], "c": ["Education", "Brand Deals", "Resources"]}, {"n": "Creators Guild of America", "v": [99, 99], "t": true, "c": ["Brand Deals", "Resources"]}, {"n": "ShopYourLikes", "v": null, "earn": true, "t": true, "c": ["Affiliates", "Monetization"]}, {"n": "Unbound Legal", "v": [896, 1646], "t": true, "c": ["Legal", "Business Infrastructure"]}, {"n": "SendOwl", "v": [280, 1144], "t": true, "c": ["Digital Products", "Memberships & Community", "Monetization"]}, {"n": "Nas.com", "v": [54, 500], "t": true, "c": ["Digital Products", "Courses", "Memberships & Community", "Coaching", "Monetization"]}, {"n": "EssentL Creator", "v": [450, 450], "t": true, "c": ["Business Infrastructure", "Insurance", "Mental Health"]}, {"n": "Boring Stuff", "v": [600, 600], "t": true, "c": ["Accounting", "Business Infrastructure"]}, {"n": "Kajabi", "v": [358, 358], "t": true, "c": ["Website & Bio Link", "Digital Products", "Courses", "Memberships & Community", "Coaching", "Monetization"]}, {"n": "Slipstream", "v": [60, 60], "t": true, "c": ["Music", "Royalty-Free", "YouTube"]}, {"n": "beehiiv", "v": [129, 1212], "t": true, "c": ["Newsletter", "Website & Bio Link", "Digital Products", "Monetization"]}, {"n": "Elevate.io", "v": [30, 75], "t": true, "c": ["Video", "Editing"]}, {"n": "Karat", "v": [250, 250], "t": true, "c": ["Banking", "Business Infrastructure"]}, {"n": ".store", "v": [200, 200], "t": true, "c": ["Website & Bio Link", "Business Infrastructure"]}, {"n": "FYPM", "v": [416, 416], "t": true, "c": ["Brand Deals"]}, {"n": "Pop.store", "v": [35, 717], "t": true, "c": ["Website & Bio Link", "Courses", "Digital Products", "Memberships & Community", "Coaching", "Automation", "AI", "Instagram", "Monetization"]}, {"n": "Mercury", "v": [400, 400], "t": true, "c": ["Banking", "Business Infrastructure"]}, {"n": "Growth in Reverse", "v": [50, 50], "t": true, "c": ["Education", "Newsletter", "Growth"]}, {"n": "Wispr Flow", "v": [72, 90], "c": ["Productivity", "AI"]}, {"n": "Epidemic Sound", "v": [50, 50], "t": true, "c": ["Music", "Royalty-Free", "YouTube"]}, {"n": "Teachable", "v": [248, 500], "t": true, "c": ["Digital Products", "Courses", "Memberships & Community", "Coaching", "Monetization"]}, {"n": "Hopp", "v": [36, 600], "t": true, "c": ["Website & Bio Link"]}, {"n": "ClearPath", "v": [1500, 1500], "t": true, "c": ["Accounting", "Business Infrastructure"]}, {"n": "Pierson Ferdinand", "v": [150, 150], "t": true, "c": ["Legal", "Business Infrastructure"]}, {"n": "Insense", "v": null, "c": ["Brand Deals", "UGC", "Monetization"]}, {"n": "Mighty Networks", "v": [316, 1416], "t": true, "c": ["Memberships & Community", "Digital Products", "Courses", "Coaching", "Monetization"]}, {"n": "CreatorCare", "v": null, "t": true, "c": ["Mental Health"]}, {"n": "Thematic", "v": [60, 60], "t": true, "c": ["Music", "Royalty-Free", "YouTube"]}, {"n": "Buy.Video", "v": [400, 1000], "t": true, "c": ["Video", "Digital Products", "Monetization"]}, {"n": "Switcher Studios", "v": [200, 200], "t": true, "c": ["Livestreaming", "Video", "Monetization"]}, {"n": "CreatorScore", "v": [40, 160], "t": true, "c": ["Analytics", "Brand Deals"]}, {"n": "Ratelle Law", "v": [900, 900], "t": true, "c": ["Legal", "Business Infrastructure", "Resources"]}, {"n": "Dorian", "v": null, "earn": true, "t": true, "c": ["Gaming", "Monetization", "Platforms"]}, {"n": "Revenews", "v": [1000, 1000], "t": true, "c": ["Newsletter", "Brand Deals", "Monetization"]}, {"n": "DUPAY", "v": [60, 60], "t": true, "c": ["Brand Deals", "Legal", "Business Infrastructure", "Resources"]}, {"n": "EditHers", "v": null, "c": ["Hiring", "Business Infrastructure"]}], "logos": {"Fourthwall": "https://cdn.commoninja.com/asset/1f312bbf-eb47-41f5-890c-9d5e4e39b7fc.png", "Creator Wizard": "https://cdn.commoninja.com/asset/932da69e-34b0-475d-8018-cfbbf709c5f4.png", "Creators Guild of America": "https://cdn.commoninja.com/asset/e67d4f36-c7aa-4257-8a6d-71ac3a703128.png", "ShopYourLikes": "https://cdn.commoninja.com/asset/dcefc1df-a971-4315-a594-b32db8781973.png", "Unbound Legal": "https://cdn.commoninja.com/asset/f401d169-92e9-4a4e-bd9c-d4fc7535db9d.jpg", "SendOwl": "https://cdn.commoninja.com/asset/a9d50920-2603-4933-b6c3-00045721a847.png", "Nas.com": "https://cdn.commoninja.com/asset/60e809e6-0aa3-45e9-8cf4-9e029220b3be.png", "EssentL Creator": "https://cdn.commoninja.com/asset/3797119d-e8fb-414e-b0c4-37b6d4cb5eec.png", "Boring Stuff": "https://cdn.commoninja.com/asset/d762d97f-370c-4862-9ed0-d0434728eeb3.png", "Kajabi": "https://cdn.commoninja.com/asset/79542a92-4300-4f9c-bc34-29ba0410bad1.png", "Slipstream": "https://cdn.commoninja.com/asset/1d2418e0-b38b-4ae7-b1ca-7f318402e502.jpg", "beehiiv": "https://cdn.commoninja.com/asset/17226348-3ca7-4837-9a75-9f863e05dad5.png", "Elevate.io": "https://cdn.commoninja.com/asset/ee1380b1-42d6-4d93-9b3e-917333012589.png", "Karat": "https://cdn.commoninja.com/asset/1c8f0175-228c-4137-b063-47195ea7eb3b.png", ".store": "https://cdn.commoninja.com/asset/1096651c-a59f-42d0-b9a0-3edd16434ebb.png", "FYPM": "https://cdn.commoninja.com/asset/352db6dc-293b-4ceb-8f15-318cf84b75f4.png", "Pop.store": "https://cdn.commoninja.com/asset/7bbccbda-fa40-4b79-bfbe-f433a634bec9.png", "Mercury": "https://cdn.commoninja.com/asset/192714c1-3628-4441-b3bd-3876e687e3e5.png", "Growth in Reverse": "https://cdn.commoninja.com/asset/a037d267-cfc9-4099-bac8-5ce1303643a5.png", "Wispr Flow": "https://cdn.commoninja.com/asset/9fc7abfd-06f4-42b2-a037-72011fb19b3e.png", "Epidemic Sound": "https://cdn.commoninja.com/asset/d4a0ac81-8de7-4857-9b3c-43d803fa9871.png", "Teachable": "https://cdn.commoninja.com/asset/dbf2a3ca-a19d-44fe-a61e-3bff641ecc82.jpeg", "Hopp": "https://cdn.commoninja.com/asset/6a5383c0-7402-4feb-ac32-85e526a82f1f.png", "ClearPath": "https://cdn.commoninja.com/asset/4b70b4e5-e6d8-4918-a71c-14d3c3f89a00.png", "Pierson Ferdinand": "https://cdn.commoninja.com/asset/efa9dd93-4d6d-4012-84b2-9d8dc6518d6b.jpg", "Insense": "https://cdn.commoninja.com/asset/7b7f0900-39bb-4672-a3fe-34f11aa2eef7.png", "Mighty Networks": "https://cdn.commoninja.com/asset/6bf52e53-86fe-419e-ab33-876d79d287b0.png", "CreatorCare": "https://cdn.commoninja.com/asset/048ee7e9-3fbb-4589-aefe-5f76252c91b3.png", "Thematic": "https://cdn.commoninja.com/asset/f42e7860-717e-4a27-a3e8-2714a8152586.png", "Buy.Video": "https://cdn.commoninja.com/asset/ec692c8e-3ff5-4eb4-adee-196f3c05780f.png", "Switcher Studios": "https://cdn.commoninja.com/asset/a1e6cf0b-41ec-4827-a74d-ae528816170b.png", "CreatorScore": "https://cdn.commoninja.com/asset/6eebbca6-0b7e-4918-bc1b-32201328b1ce.png", "Ratelle Law": "https://cdn.commoninja.com/asset/ba8a0432-228d-49d3-8e0c-44c9d4f512cb.png", "Dorian": "https://cdn.commoninja.com/asset/1c1b028d-4f55-4989-b77f-8b6f1b1f8e3f.jpg", "Revenews": "https://cdn.commoninja.com/asset/bb2d8089-e680-4e49-be71-14063bee93d6.png", "DUPAY": "https://cdn.commoninja.com/asset/4ac8cbc0-639e-4d10-92ff-7066af0e1b2c.png", "EditHers": "https://cdn.commoninja.com/asset/a567569b-dc20-4ae4-9b65-82cea76487fb.png"}};

  var DEFAULTS = {
    joinUrl: "https://www.creatoraccessnetwork.com/resource_redirect/offers/RJm4wbtW",
    dealsUrl: "https://www.creatoraccessnetwork.com/partners",
    earnUplift: 0.10,
    defaultCategory: "Memberships & Community",
    rotateMs: 2000
  };
  var CFG = {};
  var ov = window.CANSW_OVERRIDES || {};
  for (var k in DEFAULTS) CFG[k] = DEFAULTS[k];
  for (var k2 in ov) CFG[k2] = ov[k2];

  /* mount: explicit #cansw-mount if present, else right before this script tag */
  var mount = document.getElementById("cansw-mount");
  if (!mount) {
    mount = document.createElement("div");
    SCRIPT.parentNode.insertBefore(mount, SCRIPT);
  }
  if (!document.getElementById("cansw-style")) {
    var st = document.createElement("style");
    st.id = "cansw-style";
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  mount.innerHTML = '<div class="cansw">' + HTML + '</div>';
  var root = mount.querySelector(".cansw");

  function init(DATA) {

  /* ---- category index + render (single Unlock Access CTA design) ---- */
  var PARTNERS = DATA.partners, LOGOS = DATA.logos;
  var CATS = {};
  PARTNERS.forEach(function (p) {
    p.c.forEach(function (c) {
      if (!CATS[c]) CATS[c] = { partners: [], vals: [], earners: [], nvals: 0 };
      CATS[c].partners.push({ n: p.n, t: !!p.t });
      if (p.v !== null && p.v !== undefined) { CATS[c].vals.push(p.v[0]); CATS[c].vals.push(p.v[1]); CATS[c].nvals++; }
      if (p.earn) CATS[c].earners.push(p.n);
    });
  });
  var CAT_NAMES = Object.keys(CATS).sort();

  var nEl = document.getElementById("canswNPartners");
  if (nEl) nEl.textContent = PARTNERS.length;

  /* headline / lede / cobrand overrides */
  var titleEl = root.querySelector(".cansw-title");
  var ledeEl = root.querySelector(".cansw-lede");
  var cb = CFG.cobrand || null;
  var headline = (cb && cb.headline) || CFG.headline;
  var lede = (cb && cb.lede) || CFG.lede;
  if (headline) titleEl.textContent = headline;
  if (lede) ledeEl.textContent = lede;
  if (cb && (cb.name || cb.image)) {
    var w = document.createElement("div");
    w.className = "cansw-cobrand";
    if (cb.mode === "logo" && cb.image) {
      w.innerHTML = '<img class="cansw-cobrand-logo" src="' + cb.image + '" alt="' + (cb.name || "") + '"><span class="cansw-cobrand-x">&times;</span><span class="cansw-cobrand-canword">Creator<br>Access<br>Network</span>';
    } else {
      var img = (cb.image && cb.mode !== "text") ? '<img class="cansw-cobrand-img" src="' + cb.image + '" alt="' + (cb.name || "") + '">' : '';
      w.innerHTML = img + '<div><p class="cansw-cobrand-with">Curated with</p><p class="cansw-cobrand-name">' + (cb.name || "") + '</p><p class="cansw-cobrand-title">' + (cb.title || "") + '</p></div>';
    }
    titleEl.parentNode.insertBefore(w, titleEl);
  }

  var picker = document.getElementById("canswPicker");
  var btn = document.getElementById("canswBtn");
  var label = document.getElementById("canswLabel");
  var menu = document.getElementById("canswMenu");
  var result = document.getElementById("canswResult");
  var OPT_ELS = {};
  var fmt = function (n) { return "$" + n.toLocaleString("en-US"); };

  var cta = document.getElementById("canswCta");
  if (CFG.unlinkCtas) { cta.removeAttribute("href"); }
  else { cta.href = CFG.joinUrl; }
  var seeAll = document.getElementById("canswSeeAll");
  if (CFG.dealsUrl) { seeAll.href = CFG.dealsUrl; } else { seeAll.hidden = true; }

  CAT_NAMES.forEach(function (name) {
    var d = CATS[name];
    var o = document.createElement("button");
    o.className = "cansw-opt";
    o.setAttribute("role", "option");
    o.setAttribute("aria-selected", "false");
    o.innerHTML = "<span>" + name + "</span><span class='cansw-count'>" + d.partners.length + " partner" + (d.partners.length > 1 ? "s" : "") + "</span>";
    o.addEventListener("click", function () { select(name); });
    OPT_ELS[name] = o;
    menu.appendChild(o);
  });

  function toggle(open) {
    var isOpen = open !== undefined ? open : !picker.classList.contains("cansw-open");
    picker.classList.toggle("cansw-open", isOpen);
    btn.setAttribute("aria-expanded", String(isOpen));
  }
  btn.addEventListener("click", function () { toggle(); });
  document.addEventListener("click", function (e) {
    if (!picker.contains(e.target)) toggle(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggle(false);
  });

  function select(name) {
    var d = CATS[name];
    if (!d) return;
    CAT_NAMES.forEach(function (n) {
      OPT_ELS[n].setAttribute("aria-selected", String(n === name));
    });
    label.textContent = name;
    label.classList.remove("cansw-placeholder");
    toggle(false);

    document.getElementById("canswKicker").textContent = name + " · " + d.partners.length + " verified partner deal" + (d.partners.length > 1 ? "s" : "");

    var num = document.getElementById("canswNum");
    var sub = document.getElementById("canswSub");
    var earnNote = document.getElementById("canswEarnNote");
    var earnBlock = document.getElementById("canswEarnBlock");
    var isAffiliates = (name === "Affiliates");

    if (d.vals.length) {
      var lo = Math.min.apply(null, d.vals);
      var hi = Math.max.apply(null, d.vals);
      if (lo === hi) {
        num.textContent = "Save up to " + fmt(hi);
        sub.textContent = "in your first year as a member";
      } else {
        num.textContent = "Save " + fmt(lo) + " – " + fmt(hi);
        sub.textContent = (d.nvals === 1)
          ? "in your first year, depending on the plan you choose"
          : "in your first year, depending on the tools you pick";
      }
    } else if (isAffiliates) {
      num.textContent = "Earn 10% more";
      sub.textContent = "on the affiliate sales you're already making";
    } else {
      num.textContent = "Member-only deals";
      sub.textContent = "with every partner in this category";
    }

    if (d.earners.length && !isAffiliates) {
      earnNote.innerHTML = "Plus <strong>better revenue splits</strong> with " + d.earners.join(", ");
      earnNote.hidden = false;
    } else {
      earnNote.hidden = true;
    }

    earnBlock.hidden = !isAffiliates;
    root.querySelector(".cansw-locked").style.display = isAffiliates ? "none" : "flex";
    if (isAffiliates) updateEarn();

    var pills = document.getElementById("canswPills");
    pills.innerHTML = "";
    var hasTrophy = false;
    var MAX_PILLS = 8;
    d.partners.slice(0, MAX_PILLS).forEach(function (p) {
      var pill = document.createElement("span");
      pill.className = "cansw-pill";
      var initials = p.n.split(/[\s.\/]+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join("");
      pill.innerHTML = "<span class='cansw-mono'>" + initials + "</span>" + p.n + (p.t ? " <span class='cansw-trophy' title='Exclusive to CAN or the best deal this partner offers'>🏆</span>" : "");
      var logoUrl = LOGOS[p.n];
      if (logoUrl) {
        var mono = pill.firstChild;
        var img = document.createElement("img");
        img.className = "cansw-logo";
        img.alt = "";
        img.onerror = function () { img.remove(); mono.style.display = "grid"; };
        img.src = logoUrl;
        mono.style.display = "none";
        pill.insertBefore(img, mono);
      }
      if (p.t) hasTrophy = true;
      pills.appendChild(pill);
    });
    if (d.partners.length > MAX_PILLS) {
      var more = document.createElement("span");
      more.className = "cansw-more";
      more.textContent = "+" + (d.partners.length - MAX_PILLS) + " more";
      pills.appendChild(more);
    }
    document.getElementById("canswTrophyNote").hidden = !hasTrophy;

    result.classList.remove("cansw-show");
    void result.offsetWidth;
    result.classList.add("cansw-show");
  }

  var slider = document.getElementById("canswEarnSlider");
  function updateEarn() {
    var e = Number(slider.value);
    var member = Math.round(e * (1 + CFG.earnUplift));
    var extraYr = Math.round(e * CFG.earnUplift * 12);
    document.getElementById("canswEarnIn").textContent = fmt(e);
    document.getElementById("canswEarnOut").innerHTML =
      "You'd earn <strong>" + fmt(member) + "</strong>/mo instead of " + fmt(e) +
      " — an extra <strong>" + fmt(extraYr) + "</strong> a year";
  }
  slider.addEventListener("input", updateEarn);

  var dc = CFG.defaultCategory;
  if (!CATS[dc]) dc = CAT_NAMES[0];
  select(dc);

  var rotateTimer = null;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (CFG.rotateMs > 0 && !reduceMotion) {
    var ROTATION = CAT_NAMES.filter(function (n) { return CATS[n].vals.length > 0; });
    var rIdx = ROTATION.indexOf(dc);
    rotateTimer = setInterval(function () {
      if (document.hidden) return;
      rIdx = (rIdx + 1) % ROTATION.length;
      select(ROTATION[rIdx]);
    }, CFG.rotateMs);
    var stopRotate = function () {
      if (rotateTimer) { clearInterval(rotateTimer); rotateTimer = null; }
    };
    root.addEventListener("click", stopRotate, true);
    root.addEventListener("touchstart", stopRotate, true);
  }

  }

  /* data: cansw-data.json next to this script; baked fallback on any failure */
  var base = SCRIPT.src.replace(/[^\/]*$/, "");
  var done = false;
  var useFallback = function () { if (!done) { done = true; init(FALLBACK); } };
  try {
    fetch(base + "cansw-data.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        if (!done && d && d.partners && d.partners.length) { done = true; init(d); }
        else useFallback();
      })
      .catch(useFallback);
    setTimeout(useFallback, 4000);
  } catch (e) { useFallback(); }
})();
