# Homepage snapshot, 2026-09-10 (before the quiz became the hero)

Kajabi site `2148774616`, site theme `2164431783`, template `content_for_index`.

`write_snapshot.py` holds every live v2 section verbatim as read from Kajabi on 2026-09-10 (hero with the shared CSS
and the Starter Set form, project quiz, widget, founder, categories, how, FAQ, pricing) and writes:

| File | What |
|---|---|
| `live-sections.json` | The eight sections and the live render order, for reference or manual re-paste |
| `revert-pre-quiz.json` | Payload that restores the **Aug 22 layout with no quiz** (hero with email box on top) |
| `revert-quiz-under-hero.json` | Payload that restores the **quiz-under-the-hero layout** that was live 2026-09-10 morning |

## How to revert

Nothing was deleted. The 2026-09-10 change added three sections (`1787360000008` Hero Quiz, `1787360000009` Starter Set,
`1787360000010` Member Wins), hid the old hero (`1787360000000`) and the old quiz section (`1787360000007`), and rewrote
`content_for_index`. Reverting flips that back:

1. Pick the payload above.
2. Call `update_theme_content(site_id="2148774616", theme_id="2164431783", settings=<payload>)` (Kajabi MCP, `themes` toolset).
3. Re-read `get_theme_content(section_filter="1787360000000")` and fetch `https://www.creatoraccessnetwork.com/` to confirm
   the old hero eyebrow ("Starting a Creator business is expensive.") is back and the quiz panel is gone from the top.

Also repoint, if reverting for good: `segments.json > starter_url` back to `/#top`, the widget block's `starterUrl` to `#top`,
and the pricing block's "Unlock the Starter Set free" link to `#top` (they point at `#starter` after the change; the hidden
hero keeps `id="top"`, so those links still land at the top of the page either way).
