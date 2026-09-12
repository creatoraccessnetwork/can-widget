"""Pull the Google Sheet Avi edits into copy.json (run before build_home_v3.py so the baked HTML matches the Sheet).
Usage: python3 scripts/pull_copy.py [sheet_id]. The id defaults to the one in copy_sheet.json."""
import csv, io, json, os, sys, urllib.request
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cfg = json.load(open(os.path.join(REPO, "copy_sheet.json")))
sid = sys.argv[1] if len(sys.argv) > 1 else cfg["sheet_id"]
url = "https://docs.google.com/spreadsheets/d/%s/export?format=csv" % sid
data = urllib.request.urlopen(url, timeout=30).read().decode("utf-8-sig")
rows = list(csv.DictReader(io.StringIO(data)))
cols = {c.strip().lower(): c for c in rows[0].keys()}
tcol, kcol, scol, wcol = cols["text"], cols["key"], cols.get("section"), cols.get("where")
out = [{"section": (r.get(scol) or "").strip(), "where": (r.get(wcol) or "").strip(), "key": r[kcol].strip(), "text": r[tcol].strip()}
       for r in rows if (r.get(kcol) or "").strip() and not r[kcol].strip().startswith("#")]
old = json.load(open(os.path.join(REPO, "copy.json")))
oldmap = {r["key"]: r["text"] for r in old}
changed = [r["key"] for r in out if oldmap.get(r["key"]) != r["text"]]
missing = [k for k in oldmap if k not in {r["key"] for r in out}]
json.dump(out, open(os.path.join(REPO, "copy.json"), "w"), ensure_ascii=False, indent=1)
print("rows:", len(out), "| changed:", changed or "none", "| keys missing from sheet:", missing or "none")
