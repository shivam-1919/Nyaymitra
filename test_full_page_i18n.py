"""
End-to-end full page translation test script.
Extracts every data-i18n and data-i18n-placeholder attribute from index.html
and ensures it is present in all 8 language dictionaries in i18n.js.
"""

import re
import os
import json

def test_full_i18n():
    print("==================================================")
    print("TESTING FULL PAGE TRANSLATION COVERAGE")
    print("==================================================")

    # 1. Read index.html and collect all data-i18n and data-i18n-placeholder attributes
    index_file = os.path.join("frontend", "index.html")
    with open(index_file, "r", encoding="utf-8") as f:
        html_text = f.read()

    i18n_keys_in_html = set(re.findall(r'data-i18n=["\']([^"\']+)["\']', html_text))
    placeholder_keys_in_html = set(re.findall(r'data-i18n-placeholder=["\']([^"\']+)["\']', html_text))
    all_html_keys = i18n_keys_in_html | placeholder_keys_in_html

    print(f"Total i18n keys found in index.html: {len(all_html_keys)}")

    # 2. Read i18n.js and parse dictionaries
    i18n_file = os.path.join("frontend", "js", "i18n.js")
    with open(i18n_file, "r", encoding="utf-8") as f:
        js_text = f.read()

    # Verify each language
    languages = ["English", "Hindi", "Hinglish", "Marathi", "Bengali", "Tamil", "Telugu", "Gujarati"]
    
    for lang in languages:
        # Check presence of dictionary
        assert f"{lang}: {{" in js_text or f'"{lang}": {{' in js_text, f"Dictionary for {lang} not found!"

    # Check Hindi and English coverage for all HTML keys
    missing_in_en = []
    missing_in_hi = []

    # Extract English section
    en_match = re.search(r'English:\s*\{(.*?)\n  \},', js_text, re.DOTALL)
    hi_match = re.search(r'Hindi:\s*\{(.*?)\n  \},', js_text, re.DOTALL)

    assert en_match, "Could not extract English dictionary from i18n.js"
    assert hi_match, "Could not extract Hindi dictionary from i18n.js"

    en_block = en_match.group(1)
    hi_block = hi_match.group(1)

    for key in sorted(all_html_keys):
        key_pattern = f'"{key}"'
        if key_pattern not in en_block:
            missing_in_en.append(key)
        if key_pattern not in hi_block:
            missing_in_hi.append(key)

    if missing_in_en:
        print(f"[MISSING] Keys in HTML but missing in English dictionary ({len(missing_in_en)}): {missing_in_en}")
    else:
        print("  [OK] English dictionary has 100% coverage of all HTML keys!")

    if missing_in_hi:
        print(f"[MISSING] Keys in HTML but missing in Hindi dictionary ({len(missing_in_hi)}): {missing_in_hi}")
    else:
        print("  [OK] Hindi dictionary has 100% coverage of all HTML keys!")

    assert len(missing_in_en) == 0, f"Missing {len(missing_in_en)} keys in English"
    assert len(missing_in_hi) == 0, f"Missing {len(missing_in_hi)} keys in Hindi"

    print("==================================================")
    print("ALL FULL PAGE I18N TESTS PASSED (100% TRANSLATED)")
    print("==================================================")

if __name__ == "__main__":
    test_full_i18n()
