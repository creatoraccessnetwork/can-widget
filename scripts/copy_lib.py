"""Homepage copy: copy.json is the snapshot of the Google Sheet Avi edits (see pull_copy.py).
The builder bakes these strings into the Kajabi HTML and marks each slot with data-copy="key";
can-copy.js re-applies the live Sheet values in the browser. Keep render() and the JS render in sync."""
import html, json, os, re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROWS = json.load(open(os.path.join(REPO, "copy.json")))
COPY = {r["key"]: r["text"] for r in ROWS if r.get("key")}

def render(text, nums):
    """Same transform as can-copy.js: {placeholders}, then escape, then **bold**, [[teal]], [text](url), newlines."""
    s = re.sub(r"\{(total|count|median|starter)\}", lambda m: str(nums.get(m.group(1), m.group(0))), text)
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r'<b class="lead">\1</b>', s)
    s = re.sub(r"\[\[(.+?)\]\]", r'<span class="tl">\1</span>', s)
    s = re.sub(r"\[([^\]]+)\]\(((?:https?:|mailto:|#)[^)\s]+)\)", r'<a href="\2">\1</a>', s)
    return s.replace("\n", "<br>")

def slot(key, nums, tag="span", cls="", extra=""):
    assert key in COPY, key
    a = ' class="%s"' % cls if cls else ""
    return "<%s%s%s data-copy=\"%s\">%s</%s>" % (tag, a, (" " + extra) if extra else "", key, render(COPY[key], nums), tag)

def plain(key, nums):
    """Placeholder-resolved text without markup (for JS config strings / attributes)."""
    assert key in COPY, key
    return re.sub(r"\{(total|count|median|starter)\}", lambda m: str(nums.get(m.group(1), m.group(0))), COPY[key])
