#!/usr/bin/env python3
"""
Per-segment partner counts and capped savings totals for the CAN project pages.

Extends the weekly deal-number sync (can-deal-numbers skill). Run it AFTER
parse_tracker.py and compute.py have produced a SAFE parsed.json:

    python3 scripts/segments.py <parsed.json> [--write]

Reads segments.json (page membership, hand-curated from the tracker) and the
parsed tracker rows, then:
  * writes segments-live.json  - per segment: partner_count, total_exact,
    total_display, and per-row low/high/open_ended/counted (the pages read this)
  * merges a "segments" summary block into numbers.json (partner_count,
    total_exact, total_display per slug) without touching the site-wide keys

Rules (Avi, Sep 2026):
  * A segment total sums the CEILING (high end) of every counted row on the
    page, the same basis as the site-wide total.
  * Rows never counted: uncapped rev-share partners (the parser's
    UNCAPPED_EARN_PARTNERS), rows with no dollar figure, rows the config marks
    count:false (one-time tickets, footnoted rows such as CreatorCare and
    Dorian, and Roster until its figure is confirmed).
  * Display rounding is floor to $100 with a trailing "+" so the "+" keeps
    doing real work on small totals.
Without --write it prints what it would write and exits.
"""
import json
import math
import os
import re
import sys
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)


def norm(name):
    return re.sub(r"[^a-z0-9]", "", (name or "").lower().replace("’", "").replace("'", ""))


def display(total):
    if total <= 0:
        return "$0"
    return "$%s+" % format(int(math.floor(total / 100.0) * 100), ",")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    parsed = json.load(open(sys.argv[1]))
    write = "--write" in sys.argv
    cfg = json.load(open(os.path.join(REPO, "segments.json")))

    tracker = {}
    for r in parsed["live_rows"]:
        tracker[norm(r["company"])] = r
    uncapped = {norm(x["company"]) for x in parsed.get("excluded_uncapped_earn", [])}
    rate_based = {norm(x["company"]) for x in parsed.get("excluded_rate_based", [])}

    out = {"generated": date.today().isoformat(), "basis": "ceiling", "segments": {}}
    problems = []
    for seg in cfg["segments"]:
        rows = {}
        total = 0.0
        partners = []
        groups = list(seg.get("decisions", []))
        for g in groups:
            for row in g["rows"]:
                key = norm(row.get("tracker") or row["n"])
                t = tracker.get(key)
                if not t:
                    problems.append("%s: %s is not a live tracker row" % (seg["slug"], row["n"]))
                    continue
                if row["n"] not in partners:
                    partners.append(row["n"])
                low, high = t["low"], t["high"]
                counted = (row.get("count", True) and not row.get("nofigure")
                           and key not in uncapped and key not in rate_based
                           and high is not None and high > 0)
                rows[row["n"]] = {
                    "low": None if row.get("nofigure") else low,
                    "high": None if row.get("nofigure") else high,
                    "open_ended": bool(t.get("open_ended")),
                    "uncapped": key in uncapped,
                    "counted": bool(counted),
                }
                if counted:
                    total += high
        for s in seg.get("strips", []):
            key = norm(s.get("tracker") or s["n"])
            t = tracker.get(key)
            if not t:
                problems.append("%s: strip %s is not a live tracker row" % (seg["slug"], s["n"]))
                continue
            rows[s["n"]] = {"low": t["low"], "high": t["high"], "open_ended": bool(t.get("open_ended")),
                            "uncapped": key in uncapped, "counted": False, "strip": True}
        out["segments"][seg["slug"]] = {
            "name": seg["name"],
            "partner_count": len(partners),
            "total_exact": int(round(total)),
            "total_display": display(total),
            "rows": rows,
        }

    # every-Creator strip figures, read from the same parse
    strip = {}
    for n in cfg.get("every_creator_strip", []):
        t = tracker.get(norm(n))
        if t:
            strip[n] = {"low": t["low"], "high": t["high"], "open_ended": bool(t.get("open_ended")),
                        "uncapped": norm(n) in uncapped}
        else:
            problems.append("every_creator_strip: %s is not a live tracker row" % n)
    out["every_creator_strip"] = strip

    summary = {k: {"partner_count": v["partner_count"], "total_exact": v["total_exact"],
                   "total_display": v["total_display"]} for k, v in out["segments"].items()}

    for slug, v in out["segments"].items():
        print("%-18s partners=%2d  total=%6d  %s" % (slug, v["partner_count"], v["total_exact"], v["total_display"]))
    for p in problems:
        print("PROBLEM:", p)

    if not write:
        print("(dry run; pass --write to update segments-live.json and numbers.json)")
        return 2 if problems else 0
    if problems:
        print("Refusing to write with problems above.")
        return 2

    json.dump(out, open(os.path.join(REPO, "segments-live.json"), "w"), indent=1)
    np = os.path.join(REPO, "numbers.json")
    numbers = json.load(open(np))
    numbers["segments"] = summary
    numbers["segments_updated"] = out["generated"]
    json.dump(numbers, open(np, "w"), indent=2)
    # re-read and confirm the site-wide key survived (rule from can-deal-numbers)
    check = json.load(open(np))
    assert "total_value_exact" in check, "numbers.json lost total_value_exact"
    assert len(check["segments"]) == len(cfg["segments"])
    print("wrote segments-live.json and numbers.json (segments block)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
