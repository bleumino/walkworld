#!/usr/bin/env python3
"""
WalkWorld — fix_data.py

Cleans up data.js without touching anything it doesn't need to.

Usage (in the folder that holds data.js):
    python3 fix_data.py

It reads  data.js  and writes  data.fixed.js  (your original is not changed),
then prints every change it made plus a list of things it could NOT fix.
Open data.fixed.js, check it looks right, then rename it to data.js.
"""

import json
import re
import sys
from collections import Counter

SRC = "data.js"
DST = "data.fixed.js"

# Fixes for specific tours (id -> {field: new value})
EXPLICIT = {
    141: {"city": "Saranda"},
    161: {"emoji": "🇦🇲"},
    162: {"emoji": "🇧🇹"},
    165: {"city": "Bishkek"},          # was "KIEV" (it's Kiev Street in Bishkek)
    178: {"region": "oceania"},        # Solomon Islands was tagged "asia"
    187: {"emoji": "🇮🇱"},
    195: {"emoji": "🇫🇷🚊"},
    197: {"city": "Seattle"},
    214: {"emoji": "🇫🇷"},
    223: {"emoji": "🇪🇸"},
    224: {"url": "https://www.youtube.com/watch?v=A-eMiEiTdc4&t=405s"},
    229: {"city": "Las Palmas"},
    236: {"emoji": "🇸🇪"},
    244: {"city": "Gqeberha"},
}

# Country spellings that should match the ALL_COUNTRIES tracker
COUNTRY_ALIASES = {"united arab emirates": "UAE"}

VALID_REGIONS = {"asia", "europe", "americas", "middleeast", "africa",
                 "oceania", "antarctica"}

changes = []
warnings = []


def read_string_field(block, key):
    """Return (python_string, start, end) of a "double quoted" JS field, or None."""
    m = re.search(r'(\n\s*%s:\s*)("(?:[^"\\]|\\.)*")' % re.escape(key), block)
    if not m:
        return None
    return json.loads(m.group(2)), m.start(2), m.end(2)


def set_string_field(block, key, new_value, tour_id):
    found = read_string_field(block, key)
    if not found:
        return block
    old_value, start, end = found
    if old_value == new_value:
        return block
    changes.append(f"id {tour_id}: {key}  {old_value!r} -> {new_value!r}")
    return block[:start] + json.dumps(new_value, ensure_ascii=False) + block[end:]


def title_case_city(city):
    letters = [c for c in city if c.isalpha()]
    if not letters:
        return city
    if city == city.upper() or city == city.lower():
        return city.title()
    return city


def fix_block(block, tour_id, canonical_countries):
    # 1. Whitespace / punctuation / casing
    city = read_string_field(block, "city")
    if city:
        value = city[0].strip().strip(",").strip()
        value = title_case_city(value)
        block = set_string_field(block, "city", value, tour_id)

    country = read_string_field(block, "country")
    if country:
        value = country[0].strip()
        value = COUNTRY_ALIASES.get(value.lower(), canonical_countries.get(value.lower(), value))
        block = set_string_field(block, "country", value, tour_id)
        if value not in canonical_countries.values():
            warnings.append(f"id {tour_id}: country {value!r} is not in ALL_COUNTRIES")

    views = read_string_field(block, "views")
    if views:
        value = re.sub(r"\s*(views?|v)$", "", views[0].strip(), flags=re.I).strip()
        if re.fullmatch(r"\d{1,3}( \d{3})+", value):
            value = value.replace(" ", ",")
        block = set_string_field(block, "views", value, tour_id)

    duration = read_string_field(block, "duration")
    if duration:
        block = set_string_field(block, "duration", duration[0].strip(), tour_id)

    # 2. Stray letters in front of the emoji
    emoji = read_string_field(block, "emoji")
    if emoji:
        block = set_string_field(block, "emoji", re.sub(r"^[A-Za-z\s]+", "", emoji[0]), tour_id)

    # 4. Video id / url
    vid = read_string_field(block, "videoId")
    if vid:
        clean = re.split(r"[&?#]", vid[0].strip())[0]
        block = set_string_field(block, "videoId", clean, tour_id)
        if re.fullmatch(r"[A-Za-z0-9_-]{11}", clean):
            url = f"https://www.youtube.com/watch?v={clean}"
            old_url = read_string_field(block, "url")
            start = re.search(r"[?&]t=(\d+s?)", old_url[0]) if old_url else None
            if start:
                url += "&t=" + start.group(1)
            block = set_string_field(block, "url", url, tour_id)
        else:
            warnings.append(
                f"id {tour_id}: videoId {clean!r} is {len(clean)} characters "
                f"(YouTube ids are 11) - check the link"
            )

    # 5. Explicit fixes for this tour (applied last so they win)
    for key, value in EXPLICIT.get(tour_id, {}).items():
        block = set_string_field(block, key, value, tour_id)

    # 6. Region sanity check
    region = read_string_field(block, "region")
    if region and region[0] not in VALID_REGIONS:
        warnings.append(f"id {tour_id}: unknown region {region[0]!r}")

    return block


def main():
    try:
        text = open(SRC, encoding="utf-8").read()
    except FileNotFoundError:
        sys.exit(f"Can't find {SRC}. Run this from the folder that contains it.")

    canonical_countries = {
        name.lower(): name
        for name in re.findall(r'\{\s*name:\s*"([^"]+)"\s*,\s*region', text)
    }

    pattern = re.compile(r"(\{\s*id:\s*)(\d+)(,.*?\n\s*\})", re.S)
    seen_ids = Counter()
    video_ids = {}

    def repl(match):
        tour_id = int(match.group(2))
        seen_ids[tour_id] += 1
        fixed = fix_block(match.group(3), tour_id, canonical_countries)
        vid = read_string_field(fixed, "videoId")
        if vid:
            video_ids.setdefault(vid[0], []).append(tour_id)
        return match.group(1) + match.group(2) + fixed

    new_text, count = pattern.subn(repl, text)

    for tour_id, n in seen_ids.items():
        if n > 1:
            warnings.append(f"id {tour_id} is used {n} times")
    for vid, ids in video_ids.items():
        if len(ids) > 1:
            warnings.append(
                f"videoId {vid!r} is shared by tours {ids} - at least one is the wrong video"
            )

    open(DST, "w", encoding="utf-8").write(new_text)

    print(f"Checked {count} tours, made {len(changes)} changes. Wrote {DST}\n")
    for line in changes:
        print("  " + line)
    if warnings:
        print("\nNEEDS YOUR ATTENTION (not fixed automatically):")
        for line in warnings:
            print("  ! " + line)


if __name__ == "__main__":
    main()